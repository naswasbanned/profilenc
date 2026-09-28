import { Router } from 'express';
import { query } from '../config/db.js';
import auth, { adminOnly } from '../middleware/auth.js';
import { CHANGE_TYPES, normalizeChanges } from '../lib/patchNotes.js';
import { codeReleaseFor, loadPatchNotes } from '../services/patchNotesService.js';

const router = Router();

const PATCH_LIMITS = { version: 32, status: 40, date: 60, codename: 60, title: 160, changeText: 300, changes: 20 };

/**
 * Validate and clean a patch note from the admin form.
 * @returns {{ error: string } | { value: object }}
 */
function readPatchNoteBody(body = {}) {
  const text = (value) => (typeof value === 'string' ? value.trim() : '');
  const value = {
    version: text(body.version),
    status: text(body.status) || 'UPDATE',
    date: text(body.date),
    codename: text(body.codename),
    title: text(body.title),
    // Unknown tags fall back to NEW so the landing board can always style them
    changes: normalizeChanges(body.changes).map((change) => ({
      type: CHANGE_TYPES.includes(change.type) ? change.type : 'NEW',
      text: change.text,
    })),
  };

  if (!value.version || !value.title || !value.date) {
    return { error: 'Version, date, and title are required' };
  }

  for (const field of ['version', 'status', 'date', 'codename', 'title']) {
    if (value[field].length > PATCH_LIMITS[field]) {
      return { error: `${field} must be ${PATCH_LIMITS[field]} characters or fewer` };
    }
  }
  if (value.changes.length > PATCH_LIMITS.changes) {
    return { error: `A release can list at most ${PATCH_LIMITS.changes} changes` };
  }
  if (value.changes.some((change) => change.text.length > PATCH_LIMITS.changeText)) {
    return { error: `Each change must be ${PATCH_LIMITS.changeText} characters or fewer` };
  }

  // Code wins a version clash on the public timeline, so a dashboard copy
  // would never show. Refuse it up front with a clear reason instead.
  if (codeReleaseFor(value.version)) {
    return {
      error: `${value.version} is already written in code (server/src/data/patchNotes.js). Use a new version number.`,
      status: 409,
    };
  }

  return { value };
}

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
    // Releases on the public timeline: code changelog plus dashboard notes
    const { notes: patchTimeline } = await loadPatchNotes();
    const { rows: suggestionCount } = await query('SELECT COUNT(*) FROM suggestions');
    const { rows: newSuggestionCount } = await query("SELECT COUNT(*) FROM suggestions WHERE status = 'NEW'");

    // Sum all blocks across all user_content modular profiles
    const { rows: modularRows } = await query(
      "SELECT data FROM user_content WHERE key = 'modular_profile'"
    );

    let totalBlocks = 0;
    for (const row of modularRows) {
      const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      if (Array.isArray(data?.tabs)) {
        for (const tab of data.tabs) {
          if (Array.isArray(tab.blocks)) {
            totalBlocks += tab.blocks.length;
          }
        }
      }
    }

    // Add legacy blocks for users without a modular profile
    const { rows: legacyBlockCount } = await query(`
      SELECT COUNT(*) FROM user_content uc
      WHERE uc.key != 'modular_profile'
        AND NOT EXISTS (
          SELECT 1 FROM user_content m WHERE m.user_id = uc.user_id AND m.key = 'modular_profile'
        )
    `);
    totalBlocks += parseInt(legacyBlockCount[0]?.count || 0, 10);

    res.json({
      totalUsers: parseInt(userCount[0].count, 10),
      publicUsers: parseInt(publicCount[0].count, 10),
      adminUsers: parseInt(adminCount[0].count, 10),
      totalBlocks,
      totalPatches: patchTimeline.length,
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
 * Search and list all registered users with accurate block count and recent change time.
 */
router.get('/users', async (req, res) => {
  try {
    const { search = '' } = req.query;
    let whereClause = '';
    const params = [];

    if (search.trim()) {
      whereClause = `WHERE u.username ILIKE $1 OR u.email ILIKE $1 OR u.display_name ILIKE $1`;
      params.push(`%${search.trim()}%`);
    }

    const sql = `
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
        u.updated_at AS user_updated_at,
        COALESCE(
          (
            SELECT json_agg(json_build_object('key', uc.key, 'data', uc.data, 'updated_at', uc.updated_at))
            FROM user_content uc 
            WHERE uc.user_id = u.id
          ),
          '[]'::json
        ) AS content_items,
        (
          SELECT MAX(ut.updated_at)
          FROM user_themes ut
          WHERE ut.user_id = u.id
        ) AS theme_updated_at,
        (
          SELECT MAX(us.updated_at)
          FROM user_sections us
          WHERE us.user_id = u.id
        ) AS section_updated_at
      FROM users u
      ${whereClause}
      ORDER BY u.created_at DESC
    `;

    const { rows } = await query(sql, params);

    const users = rows.map((u) => {
      let blockCount = 0;
      let lastChanged = u.user_updated_at || u.created_at;

      if (u.theme_updated_at) {
        const t = new Date(u.theme_updated_at);
        if (!lastChanged || t > new Date(lastChanged)) {
          lastChanged = u.theme_updated_at;
        }
      }

      if (u.section_updated_at) {
        const t = new Date(u.section_updated_at);
        if (!lastChanged || t > new Date(lastChanged)) {
          lastChanged = u.section_updated_at;
        }
      }

      const contentItems = Array.isArray(u.content_items) ? u.content_items : [];
      const modularItem = contentItems.find((c) => c.key === 'modular_profile');

      if (modularItem && modularItem.data) {
        const data = typeof modularItem.data === 'string' ? JSON.parse(modularItem.data) : modularItem.data;
        if (Array.isArray(data?.tabs)) {
          for (const tab of data.tabs) {
            if (Array.isArray(tab.blocks)) {
              blockCount += tab.blocks.length;
            }
          }
        }
        if (modularItem.updated_at) {
          const t = new Date(modularItem.updated_at);
          if (!lastChanged || t > new Date(lastChanged)) {
            lastChanged = modularItem.updated_at;
          }
        }
      } else if (contentItems.length > 0) {
        for (const item of contentItems) {
          blockCount++;
          if (item.updated_at) {
            const t = new Date(item.updated_at);
            if (!lastChanged || t > new Date(lastChanged)) {
              lastChanged = item.updated_at;
            }
          }
        }
      }

      return {
        id: u.id,
        username: u.username,
        email: u.email,
        display_name: u.display_name,
        avatar_url: u.avatar_url,
        is_public: u.is_public,
        is_admin: u.is_admin,
        template_slug: u.template_slug,
        created_at: u.created_at,
        updated_at: lastChanged,
        last_changed_at: lastChanged,
        block_count: blockCount,
      };
    });

    res.json({ users });
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
    // notes: the public timeline, each tagged source 'code' or 'dashboard'.
    // shadowed: dashboard rows hidden because code has the same version.
    const { notes, shadowed } = await loadPatchNotes();
    res.json({ patchNotes: notes, shadowed });
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
    const parsed = readPatchNoteBody(req.body);
    if (parsed.error) {
      return res.status(parsed.status || 400).json({ error: parsed.error });
    }
    const { version, status, date, codename, title, changes } = parsed.value;

    // Order and the "current" flag are derived from the version number when
    // the timeline is merged, so these columns are no longer set from here.
    const { rows } = await query(
      `INSERT INTO patch_notes (version, status, date, codename, title, changes, order_num, is_current, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 0, false, NOW())
       RETURNING *`,
      [version, status, date, codename, title, JSON.stringify(changes)]
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
    const parsed = readPatchNoteBody(req.body);
    if (parsed.error) {
      return res.status(parsed.status || 400).json({ error: parsed.error });
    }
    const { version, status, date, codename, title, changes } = parsed.value;

    const { rows } = await query(
      `UPDATE patch_notes
       SET version = $1, status = $2, date = $3, codename = $4, title = $5, changes = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [version, status, date, codename, title, JSON.stringify(changes), id]
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
