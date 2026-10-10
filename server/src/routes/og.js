import { Router } from 'express';
import { query } from '../config/db.js';
import { renderOgHtml, summarize, findJournalEntry } from '../lib/og.js';

/**
 * Link-preview pages for social bots. nginx rewrites bot requests for
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
    `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio, u.is_public, c.data AS content
     FROM users u
     LEFT JOIN user_content c ON c.user_id = u.id AND c.key = 'modular_profile'
     WHERE u.username = $1`,
    [username.toLowerCase()]
  );
  const user = rows[0];
  return user && user.is_public ? user : null;
}

function send(res, html) {
  res.set('Cache-Control', 'public, max-age=300');
  res.type('html').send(html);
}

async function handle(req, res) {
  const origin = originOf(req);
  const username = String(req.params.username || '').replace(/^@/, '');
  const entryId = req.params.entryId ? String(req.params.entryId) : null;
  const path = `/@${username}${entryId ? `/journal/${encodeURIComponent(entryId)}` : ''}`;

  try {
    const user = await loadPublicProfile(username);
    if (!user) return send(res, renderOgHtml({ origin, path: '/' }));

    const name = user.display_name ? `${user.display_name} (@${user.username})` : `@${user.username}`;

    if (entryId) {
      const entry = findJournalEntry(user.content, entryId);
      if (entry) {
        return send(res, renderOgHtml({
          origin,
          path,
          type: 'article',
          title: `${entry.title || 'Journal entry'} by ${name}`,
          description: summarize(entry.excerpt || entry.content),
          image: entry.coverUrl || entry.imageUrl || user.avatar_url,
        }));
      }
    }

    return send(res, renderOgHtml({
      origin,
      path: `/@${user.username}`,
      type: 'profile',
      title: name,
      description: summarize(user.bio),
      image: user.avatar_url,
    }));
  } catch (err) {
    console.error('OG preview error:', err);
    return send(res, renderOgHtml({ origin, path: '/' }));
  }
}

router.get('/:username/journal/:entryId', handle);
router.get('/:username', handle);

export default router;
