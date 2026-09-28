import { Router } from 'express';
import { query } from '../config/db.js';
import { publicUpload } from '../middleware/upload.js';
import { suggestionLimiter } from '../middleware/rateLimit.js';
import { LIMITS, firstLengthError } from '../lib/validate.js';
import { ImageValidationError, processImage } from '../services/imageService.js';
import { codeOnlyPatchNotes, loadPatchNotes } from '../services/patchNotesService.js';

const router = Router();

/** Fields the landing page needs; database ids and timestamps stay private. */
function publicPatchNote(note) {
  const { version, status, date, codename, title, changes, is_current, source } = note;
  return { version, status, date, codename, title, changes, is_current, source };
}

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
 * Public release timeline: the code changelog merged with the releases
 * published from the admin console, newest version first.
 */
router.get('/patch-notes', async (_req, res) => {
  try {
    const { notes } = await loadPatchNotes();
    res.json({ patchNotes: notes.map(publicPatchNote) });
  } catch (err) {
    // The code changelog needs no database, so the timeline still loads
    console.error('Site patch-notes GET error, serving code changelog only:', err);
    res.json({ patchNotes: codeOnlyPatchNotes().notes.map(publicPatchNote) });
  }
});

/**
 * POST /api/site/suggestions
 * Public endpoint for open community suggestions with optional screenshot upload.
 */
router.post('/suggestions', suggestionLimiter, publicUpload.single('image'), async (req, res) => {
  try {
    const { name, email, category = 'DESIGN', title, message } = req.body;

    if (!title || !title.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: 'Title and suggestion message are required' });
    }

    const lengthError = firstLengthError([
      [name, LIMITS.suggestionName, 'Name'],
      [email, LIMITS.suggestionEmail, 'Email'],
      [title, LIMITS.suggestionTitle, 'Title'],
      [message, LIMITS.suggestionMessage, 'Suggestion'],
    ]);
    if (lengthError) {
      return res.status(400).json({ error: lengthError });
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
    if (err instanceof ImageValidationError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Submit suggestion error:', err);
    res.status(500).json({ error: 'Failed to submit suggestion. Please try again.' });
  }
});

export default router;

