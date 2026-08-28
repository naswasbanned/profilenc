import { Router } from 'express';
import { query } from '../config/db.js';
import upload from '../middleware/upload.js';
import { processImage } from '../services/imageService.js';

const router = Router();

/**
 * GET /api/site/landing
 * Public endpoint to fetch dynamic landing page content configuration.
 */
router.get('/landing', async (_req, res) => {
  try {
    const { rows } = await query('SELECT data FROM site_settings WHERE key = $1', ['landing_page']);
    if (rows.length === 0) {
      return res.json({ config: null });
    }
    res.json({ config: rows[0].data });
  } catch (err) {
    console.error('Site landing GET error:', err);
    res.status(500).json({ error: 'Failed to fetch site config' });
  }
});

/**
 * GET /api/site/patch-notes
 * Public endpoint to fetch active engine patch notes / release timeline.
 */
router.get('/patch-notes', async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, version, status, date, codename, title, changes, order_num, is_current FROM patch_notes ORDER BY order_num ASC, created_at DESC'
    );
    res.json({ patchNotes: rows });
  } catch (err) {
    console.error('Site patch-notes GET error:', err);
    res.status(500).json({ error: 'Failed to fetch patch notes' });
  }
});

/**
 * POST /api/site/suggestions
 * Public endpoint for open community suggestions with optional screenshot upload.
 */
router.post('/suggestions', upload.single('image'), async (req, res) => {
  try {
    const { name, email, category = 'DESIGN', title, message } = req.body;

    if (!title || !title.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: 'Title and suggestion message are required' });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await processImage(req.file.path);
      imageUrl = `/uploads/${result.filename}`;
    }

    const validCategories = ['DESIGN', 'TECHNICALITY', 'FEATURE', 'BUG'];
    const normalizedCategory = validCategories.includes(category?.toUpperCase())
      ? category.toUpperCase()
      : 'DESIGN';

    const { rows } = await query(
      `INSERT INTO suggestions (name, email, category, title, message, image_url, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'NEW', NOW(), NOW())
       RETURNING id, name, category, title, created_at`,
      [
        (name || '').trim() || null,
        (email || '').trim() || null,
        normalizedCategory,
        title.trim(),
        message.trim(),
        imageUrl,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Suggestion submitted successfully. Thank you for helping build Profilenc!',
      suggestion: rows[0],
    });
  } catch (err) {
    console.error('Submit suggestion error:', err);
    res.status(500).json({ error: 'Failed to submit suggestion. Please try again.' });
  }
});

export default router;

