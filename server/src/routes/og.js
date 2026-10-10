import { Router } from 'express';
import { query } from '../config/db.js';
import { renderOgHtml, summarize, findJournalEntry } from '../lib/og.js';
import { getCard, cardHash, localUploadPath } from '../services/ogImageService.js';

/**
 * Link-preview pages for social bots. nginx rewrites bot requests for `/`,
 * `/@user` and `/@user/journal/<id>` to `/api/og/...`; people never reach here.
 * Anything not public (missing user, private profile, unknown entry) gets the
 * generic site preview, so this route reveals nothing the profile page hides.
 */
const router = Router();

/** Site origin for absolute URLs. PUBLIC_URL wins so a spoofed Host header cannot rewrite the tags. */
function originOf(req) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/+$/, '');
  const proto = (req.get('x-forwarded-proto') || req.protocol || 'https').split(',')[0].trim();
  return `${proto}://${req.get('host')}`;
}

async function loadPublicProfile(username) {
  const { rows } = await query(
    `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio, u.is_public,
            u.og_image_url, u.og_title, u.og_description,
            c.data AS content, t.theme
     FROM users u
     LEFT JOIN user_content c ON c.user_id = u.id AND c.key = 'modular_profile'
     LEFT JOIN user_themes t ON t.user_id = u.id
     WHERE u.username = $1`,
    [username.toLowerCase()]
  );
  const user = rows[0];
  return user && user.is_public ? user : null;
}

/**
 * Everything a preview needs for a profile or entry: the text tags and the
 * card spec (what gets drawn, which also keys the image cache).
 * Returns null when the profile is not public.
 */
async function buildPreview(rawUsername, entryId) {
  const username = String(rawUsername || '').replace(/^@/, '');
  const user = await loadPublicProfile(username);
  if (!user) return null;

  const name = user.display_name ? `${user.display_name} (@${user.username})` : `@${user.username}`;
  const accent = user.theme?.global?.accentColor;
  const base = `/@${user.username}`;

  const entry = entryId ? findJournalEntry(user.content, entryId) : null;
  if (entry) {
    const path = `${base}/journal/${encodeURIComponent(entryId)}`;
    const excerpt = summarize(entry.excerpt || entry.content);
    return {
      path,
      imagePath: `/api/og/image${path}`,
      type: 'article',
      title: `${entry.title || 'Journal entry'} by ${name}`,
      description: excerpt,
      card: {
        kind: 'entry',
        title: entry.title || 'Journal entry',
        excerpt: summarize(entry.excerpt || entry.content, 200),
        author: `@${user.username}`,
        date: entry.date || '',
        accent,
        coverPath: localUploadPath(entry.coverUrl || entry.imageUrl),
      },
    };
  }

  const customImage = localUploadPath(user.og_image_url, user.id);
  return {
    path: base,
    imagePath: `/api/og/image${base}`,
    type: 'profile',
    title: user.og_title || name,
    description: user.og_description || summarize(user.bio),
    card: customImage
      ? { kind: 'custom', imagePath: customImage }
      : {
          kind: 'profile',
          displayName: user.display_name || '',
          username: user.username,
          bio: summarize(user.bio, 120),
          accent,
          avatarPath: localUploadPath(user.avatar_url),
        },
  };
}

function send(res, html) {
  res.set('Cache-Control', 'public, max-age=300');
  res.type('html').send(html);
}

async function handlePage(req, res) {
  const origin = originOf(req);
  try {
    const preview = await buildPreview(req.params.username, req.params.entryId);
    if (!preview) return send(res, renderOgHtml({ origin, path: '/' }));
    return send(res, renderOgHtml({
      origin,
      path: preview.path,
      type: preview.type,
      title: preview.title,
      description: preview.description,
      // ?v= changes whenever the card would, so preview services refetch it
      image: `${preview.imagePath}?v=${cardHash(preview.card)}`,
    }));
  } catch (err) {
    console.error('OG preview error:', err);
    return send(res, renderOgHtml({ origin, path: '/' }));
  }
}

async function handleImage(req, res) {
  try {
    const preview = await buildPreview(req.params.username, req.params.entryId);
    if (!preview) return res.redirect(302, '/og-default.png');
    const file = await getCard(preview.card);
    res.set('Cache-Control', req.query.v ? 'public, max-age=31536000, immutable' : 'public, max-age=300');
    return res.type('jpeg').sendFile(file);
  } catch (err) {
    console.error('OG image error:', err);
    return res.redirect(302, '/og-default.png');
  }
}

router.get('/', (req, res) => send(res, renderOgHtml({ origin: originOf(req), path: '/' })));
router.get('/image/:username/journal/:entryId', handleImage);
router.get('/image/:username', handleImage);
router.get('/:username/journal/:entryId', handlePage);
router.get('/:username', handlePage);

export default router;
