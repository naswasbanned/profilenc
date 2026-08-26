import { Router } from 'express';
import { query } from '../config/db.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { processImage, deleteImage } from '../services/imageService.js';

const router = Router();

/**
 * POST /api/images
 * Auth required. Multipart upload (field name: "image").
 * Converts to WebP, saves to uploads/, inserts metadata into DB.
 * Returns { url, filename, width, height, sizeBytes, originalName }.
 */
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await processImage(req.file.path);

    await query(
      `INSERT INTO images (filename, original_name, size_bytes, width, height)
       VALUES ($1, $2, $3, $4, $5)`,
      [result.filename, req.file.originalname, result.sizeBytes, result.width, result.height]
    );

    res.json({
      url: `/uploads/${result.filename}`,
      filename: result.filename,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
      originalName: req.file.originalname,
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

/**
 * GET /api/images
 * Auth required. List all uploaded images.
 */
router.get('/', auth, async (_req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, filename, original_name, size_bytes, width, height, created_at FROM images ORDER BY created_at DESC'
    );

    const images = rows.map((row) => ({
      id: row.id,
      url: `/uploads/${row.filename}`,
      filename: row.filename,
      originalName: row.original_name,
      sizeBytes: row.size_bytes,
      width: row.width,
      height: row.height,
      createdAt: row.created_at,
    }));

    res.json(images);
  } catch (err) {
    console.error('Image list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/images/:filename
 * Auth required. Removes image from disk and DB.
 */
router.delete('/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;

    const { rowCount } = await query(
      'DELETE FROM images WHERE filename = $1',
      [filename]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await deleteImage(filename).catch(() => {});

    res.json({ success: true });
  } catch (err) {
    console.error('Image delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
