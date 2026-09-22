import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

/**
 * GET /api/templates
 * Public — list all available templates.
 */
router.get('/', async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT slug, name, description, preview_url FROM templates ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error('Templates list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/templates/featured/profiles
 * Public — returns up to 12 public profiles for the landing page.
 * NOTE: Must be defined BEFORE /:slug route to prevent Express shadowing.
 */
router.get('/featured/profiles', async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT u.username, u.display_name, u.avatar_url, u.bio, u.template_slug, u.created_at,
              uc.data AS content_data
       FROM users u
       LEFT JOIN user_content uc ON uc.user_id = u.id AND uc.key = 'modular_profile'
       WHERE u.is_public = true
       ORDER BY u.created_at DESC
       LIMIT 12`
    );

    res.json(rows.map(r => {
      let bio = r.bio && typeof r.bio === 'string' && r.bio.trim().length > 0 ? r.bio.trim() : null;

      // If user has not explicitly set their account bio yet, fallback to hero block bio/tagline from modular profile
      if (!bio && r.content_data) {
        try {
          const content = typeof r.content_data === 'string' ? JSON.parse(r.content_data) : r.content_data;
          const tabs = content.tabs || [];
          for (const tab of tabs) {
            const heroBlock = (tab.blocks || []).find(b => b.type === 'hero');
            if (heroBlock && heroBlock.data) {
              if (heroBlock.data.bio && typeof heroBlock.data.bio === 'string' && heroBlock.data.bio.trim()) {
                bio = heroBlock.data.bio.trim();
                break;
              } else if (heroBlock.data.tagline && typeof heroBlock.data.tagline === 'string' && heroBlock.data.tagline.trim()) {
                bio = heroBlock.data.tagline.trim();
                break;
              }
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      return {
        username: r.username,
        displayName: r.display_name,
        avatarUrl: r.avatar_url,
        bio: bio || null,
        headline: bio || null,
        templateSlug: r.template_slug,
        createdAt: r.created_at,
      };
    }));
  } catch (err) {
    console.error('Featured profiles error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/templates/:slug
 * Public — get full template detail (theme + sections + content).
 */
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT slug, name, description, preview_url, theme, sections, content FROM templates WHERE slug = $1',
      [req.params.slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Template GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
