import { Router } from 'express';
import { query } from '../config/db.js';
import auth, { adminOnly } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with auth and adminOnly
router.use(auth);
router.use(adminOnly);

/**
 * GET /api/admin/stats
 * Admin dashboard overview stats.
 */
router.get('/stats', async (_req, res) => {
  try {
    const { rows: userCount } = await query('SELECT COUNT(*) FROM users');
    const { rows: publicCount } = await query('SELECT COUNT(*) FROM users WHERE is_public = true');
    const { rows: adminCount } = await query('SELECT COUNT(*) FROM users WHERE is_admin = true');
    const { rows: blockCount } = await query('SELECT COUNT(*) FROM user_content');
    const { rows: patchCount } = await query('SELECT COUNT(*) FROM patch_notes');
    const { rows: suggestionCount } = await query('SELECT COUNT(*) FROM suggestions');
    const { rows: newSuggestionCount } = await query("SELECT COUNT(*) FROM suggestions WHERE status = 'NEW'");

    res.json({
      totalUsers: parseInt(userCount[0].count, 10),
      publicUsers: parseInt(publicCount[0].count, 10),
      adminUsers: parseInt(adminCount[0].count, 10),
      totalBlocks: parseInt(blockCount[0].count, 10),
      totalPatches: parseInt(patchCount[0].count, 10),
      totalSuggestions: parseInt(suggestionCount[0].count, 10),
      newSuggestions: parseInt(newSuggestionCount[0].count, 10),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * GET /api/admin/users
 * Search and list all registered users.
 */
router.get('/users', async (req, res) => {
  try {
    const { search = '' } = req.query;
    let sql = `
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.display_name, 
        u.avatar_url, 
        u.is_public, 
        u.is_admin, 
        u.template_slug, 
        u.created_at,
        COUNT(uc.id)::int AS block_count
      FROM users u
      LEFT JOIN user_content uc ON uc.user_id = u.id
    `;
    const params = [];

    if (search.trim()) {
      sql += ` WHERE u.username ILIKE $1 OR u.email ILIKE $1 OR u.display_name ILIKE $1`;
      params.push(`%${search.trim()}%`);
    }

    sql += ` GROUP BY u.id ORDER BY u.created_at DESC`;

    const { rows } = await query(sql, params);
    res.json({ users: rows });
  } catch (err) {
    console.error('Admin list users error:', err);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

/**
 * PATCH /api/admin/users/:id
 * Toggle admin status, public visibility, etc.
 */
router.patch('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_admin, is_public } = req.body;

    const updates = [];
    const params = [id];
    let pIdx = 2;

    if (typeof is_admin === 'boolean') {
      // Prevent removing admin from oneself if last admin
      if (parseInt(id, 10) === req.user.id && !is_admin) {
        return res.status(400).json({ error: 'Cannot remove admin privileges from your own account' });
      }
      updates.push(`is_admin = $${pIdx++}`);
      params.push(is_admin);
    }

    if (typeof is_public === 'boolean') {
      updates.push(`is_public = $${pIdx++}`);
      params.push(is_public);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid update fields provided' });
    }

    updates.push(`updated_at = NOW()`);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING id, username, email, is_admin, is_public`;
    const { rows } = await query(sql, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Admin update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Permanently delete a user account.
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account from the admin dashboard' });
    }

    const { rowCount } = await query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * GET /api/admin/patch-notes
 * Get all patch notes (ordered).
 */
router.get('/patch-notes', async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, version, status, date, codename, title, changes, order_num, is_current, created_at, updated_at FROM patch_notes ORDER BY order_num ASC, created_at DESC'
    );
    res.json({ patchNotes: rows });
  } catch (err) {
    console.error('Admin get patch notes error:', err);
    res.status(500).json({ error: 'Failed to fetch patch notes' });
  }
});

/**
 * POST /api/admin/patch-notes
 * Create a new patch note.
 */
router.post('/patch-notes', async (req, res) => {
  try {
    const { version, status = 'UPDATE', date, codename = '', title, changes = [], order_num = 0, is_current = false } = req.body;

    if (!version || !title || !date) {
      return res.status(400).json({ error: 'Version, date, and title are required' });
    }

    // If marked as current, reset other notes is_current to false
    if (is_current) {
      await query('UPDATE patch_notes SET is_current = false');
    }

    const { rows } = await query(
      `INSERT INTO patch_notes (version, status, date, codename, title, changes, order_num, is_current, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [version.trim(), status.trim(), date.trim(), codename.trim(), title.trim(), JSON.stringify(changes), order_num, is_current]
    );

    res.status(201).json({ patchNote: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A patch note with this version number already exists' });
    }
    console.error('Admin create patch note error:', err);
    res.status(500).json({ error: 'Failed to create patch note' });
  }
});

/**
 * PUT /api/admin/patch-notes/:id
 * Update an existing patch note.
 */
router.put('/patch-notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { version, status, date, codename, title, changes, order_num, is_current } = req.body;

    if (!version || !title || !date) {
      return res.status(400).json({ error: 'Version, date, and title are required' });
    }

    if (is_current) {
      await query('UPDATE patch_notes SET is_current = false WHERE id != $1', [id]);
    }

    const { rows } = await query(
      `UPDATE patch_notes
       SET version = $1, status = $2, date = $3, codename = $4, title = $5, changes = $6, order_num = $7, is_current = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [version.trim(), status.trim(), date.trim(), codename.trim(), title.trim(), JSON.stringify(changes), order_num || 0, !!is_current, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patch note not found' });
    }

    res.json({ patchNote: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A patch note with this version number already exists' });
    }
    console.error('Admin update patch note error:', err);
    res.status(500).json({ error: 'Failed to update patch note' });
  }
});

/**
 * DELETE /api/admin/patch-notes/:id
 * Delete a patch note.
 */
router.delete('/patch-notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM patch_notes WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Patch note not found' });
    }

    res.json({ message: 'Patch note deleted successfully' });
  } catch (err) {
    console.error('Admin delete patch note error:', err);
    res.status(500).json({ error: 'Failed to delete patch note' });
  }
});

/**
 * GET /api/admin/landing
 * Fetch the full landing page content configuration.
 */
router.get('/landing', async (_req, res) => {
  try {
    const { rows } = await query('SELECT data FROM site_settings WHERE key = $1', ['landing_page']);
    if (rows.length === 0) {
      return res.json({ config: null });
    }
    res.json({ config: rows[0].data });
  } catch (err) {
    console.error('Admin get landing error:', err);
    res.status(500).json({ error: 'Failed to fetch landing page config' });
  }
});

/**
 * PUT /api/admin/landing
 * Save updated landing page content configuration.
 */
router.put('/landing', async (req, res) => {
  try {
    const { config } = req.body;
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ error: 'Valid configuration object required' });
    }

    const { rows } = await query(
      `INSERT INTO site_settings (key, data, updated_at)
       VALUES ('landing_page', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET data = $1, updated_at = NOW()
       RETURNING data`,
      [JSON.stringify(config)]
    );

    res.json({ config: rows[0].data, message: 'Landing page settings saved successfully' });
  } catch (err) {
    console.error('Admin save landing error:', err);
    res.status(500).json({ error: 'Failed to save landing page config' });
  }
});

/**
 * GET /api/admin/suggestions
 * List all submitted suggestions with optional filters.
 */
router.get('/suggestions', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let sql = 'SELECT id, name, email, category, title, message, image_url, status, created_at, updated_at FROM suggestions WHERE 1=1';
    const params = [];
    let pIdx = 1;

    if (category && category !== 'ALL') {
      sql += ` AND category = $${pIdx++}`;
      params.push(category.toUpperCase());
    }

    if (status && status !== 'ALL') {
      sql += ` AND status = $${pIdx++}`;
      params.push(status.toUpperCase());
    }

    if (search && search.trim()) {
      sql += ` AND (title ILIKE $${pIdx} OR message ILIKE $${pIdx} OR name ILIKE $${pIdx} OR email ILIKE $${pIdx})`;
      params.push(`%${search.trim()}%`);
      pIdx++;
    }

    sql += ' ORDER BY created_at DESC';

    const { rows } = await query(sql, params);
    res.json({ suggestions: rows });
  } catch (err) {
    console.error('Admin list suggestions error:', err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

/**
 * PATCH /api/admin/suggestions/:id
 * Update suggestion status (e.g. 'REVIEWED', 'RESOLVED', 'ARCHIVED').
 */
router.patch('/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const { rows } = await query(
      `UPDATE suggestions
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status.toUpperCase(), id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    res.json({ suggestion: rows[0] });
  } catch (err) {
    console.error('Admin update suggestion error:', err);
    res.status(500).json({ error: 'Failed to update suggestion' });
  }
});

/**
 * DELETE /api/admin/suggestions/:id
 * Delete a suggestion.
 */
router.delete('/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM suggestions WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    res.json({ message: 'Suggestion deleted successfully' });
  } catch (err) {
    console.error('Admin delete suggestion error:', err);
    res.status(500).json({ error: 'Failed to delete suggestion' });
  }
});

export default router;
