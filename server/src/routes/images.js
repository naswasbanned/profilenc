import { Router } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { query } from '../config/db.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { imageUploadLimiter } from '../middleware/rateLimit.js';
import { ImageValidationError, processImage, deleteImage } from '../services/imageService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

/** Per-account storage ceiling. Raise if real usage gets close. */
const MAX_IMAGES_PER_USER = 200;
const MAX_BYTES_PER_USER = 200 * 1024 * 1024; // 200 MB

const router = Router();

/**
 * Current storage usage for a user, read from the images table.
 * @returns {Promise<{count: number, bytes: number}>}
 */
async function usageFor(userId) {
  const { rows } = await query(
    'SELECT COUNT(*)::int AS count, COALESCE(SUM(size_bytes), 0)::bigint AS bytes FROM images WHERE user_id = $1',
    [userId]
  );
  return {
    count: rows[0]?.count || 0,
    bytes: Number(rows[0]?.bytes || 0),
  };
}

/**
 * POST /api/images
 * Auth required. Multipart upload (field name: "image").
 * Stores in uploads/:userId/ directory.
 * Returns { url, filename, width, height, sizeBytes, originalName }.
 */
router.post('/', auth, imageUploadLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Quota check before any decoding work. The temp file is removed here
    // because processImage, which normally cleans it up, is never reached.
    const usage = await usageFor(req.user.id);
    if (usage.count >= MAX_IMAGES_PER_USER || usage.bytes >= MAX_BYTES_PER_USER) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(413).json({
        error: 'Storage limit reached. Delete some images to upload more.',
        usage: {
          images: usage.count,
          maxImages: MAX_IMAGES_PER_USER,
          bytes: usage.bytes,
          maxBytes: MAX_BYTES_PER_USER,
        },
      });
    }

    // Ensure user-specific upload dir exists
    const userDir = path.join(uploadsDir, String(req.user.id));
    await fs.mkdir(userDir, { recursive: true });

    const result = await processImage(req.file.path, { outputDir: userDir });

    await query(
      `INSERT INTO images (filename, original_name, size_bytes, width, height, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [result.filename, req.file.originalname, result.sizeBytes, result.width, result.height, req.user.id]
    );

    res.json({
      url: `/uploads/${req.user.id}/${result.filename}`,
      filename: result.filename,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
      originalName: req.file.originalname,
    });
  } catch (err) {
    if (err instanceof ImageValidationError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

/**
 * GET /api/images
 * Auth required. List current user's uploaded images.
 */
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, filename, original_name, size_bytes, width, height, created_at
       FROM images WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    const images = rows.map((row) => ({
      id: row.id,
      url: `/uploads/${req.user.id}/${row.filename}`,
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
 * Auth required. Removes image from disk and DB. Owner only.
 */
router.delete('/:filename', auth, async (req, res) => {
  try {
    // basename strips any traversal segments before this value reaches a path
    // join below. The ownership check already blocks it, but the filesystem
    // call should not depend on that being the only guard.
    const filename = path.basename(req.params.filename || '');
    if (!filename) {
      return res.status(400).json({ error: 'Filename required' });
    }

    const { rowCount } = await query(
      'DELETE FROM images WHERE filename = $1 AND user_id = $2',
      [filename, req.user.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from user-specific directory
    const userDir = path.join(uploadsDir, String(req.user.id));
    const filePath = path.join(userDir, filename);
    await fs.unlink(filePath).catch(() => {
      // Fallback: try root uploads dir (legacy images)
      return deleteImage(filename).catch(() => {});
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Image delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
