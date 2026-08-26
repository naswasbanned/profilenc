import { Router } from 'express';
import { query } from '../config/db.js';
import auth from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/content/:key
 * Public — returns JSONB data for the given key.
 */
router.get('/:key', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT data FROM content WHERE key = $1',
      [req.params.key]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(rows[0].data);
  } catch (err) {
    console.error('Content GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/content/:key
 * Auth required — replaces JSONB data for the given key.
 */
router.put('/:key', auth, async (req, res) => {
  try {
    const { key } = req.params;
    const data = req.body;

    if (data === undefined || data === null) {
      return res.status(400).json({ error: 'Request body required' });
    }

    const { rowCount } = await query(
      `INSERT INTO content (key, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = NOW()`,
      [key, JSON.stringify(data)]
    );

    res.json({ success: true, key });
  } catch (err) {
    console.error('Content PUT error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
