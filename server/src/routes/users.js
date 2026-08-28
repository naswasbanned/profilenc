import { Router } from 'express';
import { query } from '../config/db.js';
import auth, { optionalAuth, ownerOnly } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/u/:username
 * Public — returns user profile summary + theme + sections config.
 */
router.get('/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;

    const { rows: users } = await query(
      `SELECT id, username, display_name, avatar_url, bio, is_public, template_slug, created_at
       FROM users WHERE username = $1`,
      [username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Check visibility
    if (!user.is_public && (!req.user || req.user.id !== user.id)) {
      return res.status(403).json({ error: 'This profile is private' });
    }

    // Fetch theme
    const { rows: themes } = await query(
      'SELECT theme FROM user_themes WHERE user_id = $1',
      [user.id]
    );

    // Fetch sections config
    const { rows: sections } = await query(
      'SELECT config FROM user_sections WHERE user_id = $1',
      [user.id]
    );

    const isOwner = req.user && req.user.id === user.id;

    res.json({
      user: {
        username: user.username,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        isPublic: user.is_public,
        templateSlug: user.template_slug,
        createdAt: user.created_at,
      },
      theme: themes[0]?.theme || {},
      sections: sections[0]?.config || [],
      isOwner,
    });
  } catch (err) {
    console.error('User profile GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/u/:username
 * Auth + owner only — update user profile info (display_name, bio, avatar_url, is_public).
 */
router.put('/:username', auth, ownerOnly, async (req, res) => {
  try {
    const { displayName, bio, avatarUrl, isPublic } = req.body;

    await query(
      `UPDATE users SET
        display_name = COALESCE($1, display_name),
        bio = COALESCE($2, bio),
        avatar_url = COALESCE($3, avatar_url),
        is_public = COALESCE($4, is_public),
        updated_at = NOW()
       WHERE username = $5`,
      [displayName, bio, avatarUrl, isPublic, req.params.username.toLowerCase()]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('User profile PUT error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/u/:username/content/:key
 * Public — returns JSONB data for a content key.
 */
router.get('/:username/content/:key', optionalAuth, async (req, res) => {
  try {
    const { username, key } = req.params;

    // Resolve user id
    const { rows: users } = await query(
      'SELECT id, is_public FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    if (!user.is_public && (!req.user || req.user.id !== user.id)) {
      return res.status(403).json({ error: 'This profile is private' });
    }

    const { rows } = await query(
      'SELECT data FROM user_content WHERE user_id = $1 AND key = $2',
      [user.id, key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(rows[0].data);
  } catch (err) {
    console.error('User content GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/u/:username/content/:key
 * Auth + owner — update content for a key.
 */
router.put('/:username/content/:key', auth, ownerOnly, async (req, res) => {
  try {
    const { username, key } = req.params;
    const data = req.body;

    if (data === undefined || data === null) {
      return res.status(400).json({ error: 'Request body required' });
    }

    const { rows: users } = await query(
      'SELECT id FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await query(
      `INSERT INTO user_content (user_id, key, data, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, key) DO UPDATE SET data = $3, updated_at = NOW()`,
      [users[0].id, key, JSON.stringify(data)]
    );

    res.json({ success: true, key });
  } catch (err) {
    console.error('User content PUT error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/u/:username/content/:key
 * Auth + owner — delete a content key.
 */
router.delete('/:username/content/:key', auth, ownerOnly, async (req, res) => {
  try {
    const { username, key } = req.params;

    const { rows: users } = await query(
      'SELECT id FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await query(
      'DELETE FROM user_content WHERE user_id = $1 AND key = $2',
      [users[0].id, key]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('User content DELETE error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/u/:username/content
 * Public — returns all content keys for a user (for full profile load).
 */
router.get('/:username/content', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;

    const { rows: users } = await query(
      'SELECT id, is_public FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    if (!user.is_public && (!req.user || req.user.id !== user.id)) {
      return res.status(403).json({ error: 'This profile is private' });
    }

    const { rows } = await query(
      'SELECT key, data FROM user_content WHERE user_id = $1',
      [user.id]
    );

    // Return as object: { "profile": {...}, "dev-skills": [...], ... }
    const content = {};
    for (const row of rows) {
      content[row.key] = row.data;
    }

    res.json(content);
  } catch (err) {
    console.error('User content list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/u/:username/theme
 * Auth + owner — update theme config.
 */
router.put('/:username/theme', auth, ownerOnly, async (req, res) => {
  try {
    const theme = req.body;

    const { rows: users } = await query(
      'SELECT id FROM users WHERE username = $1',
      [req.params.username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await query(
      `INSERT INTO user_themes (user_id, theme, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET theme = $2, updated_at = NOW()`,
      [users[0].id, JSON.stringify(theme)]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Theme PUT error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/u/:username/theme
 * Public — returns theme config.
 */
router.get('/:username/theme', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;

    const { rows: users } = await query(
      'SELECT id FROM users WHERE username = $1',
      [username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { rows } = await query(
      'SELECT theme FROM user_themes WHERE user_id = $1',
      [users[0].id]
    );

    res.json(rows[0]?.theme || {});
  } catch (err) {
    console.error('Theme GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/u/:username/sections
 * Auth + owner — update sections layout config.
 */
router.put('/:username/sections', auth, ownerOnly, async (req, res) => {
  try {
    const config = req.body;

    const { rows: users } = await query(
      'SELECT id FROM users WHERE username = $1',
      [req.params.username.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await query(
      `INSERT INTO user_sections (user_id, config, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET config = $2, updated_at = NOW()`,
      [users[0].id, JSON.stringify(config)]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Sections PUT error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
