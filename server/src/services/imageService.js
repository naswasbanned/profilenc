import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

/**
 * Process an uploaded image:
 *  1. Auto-rotate from EXIF
 *  2. Resize if wider than maxWidth (keep aspect ratio, never enlarge)
 *  3. Convert to WebP (quality 80)
 *  4. Strip all metadata
 *  5. Save to uploads/ with UUID filename
 *
 * Returns { filename, path, width, height, sizeBytes }
 */
export async function processImage(inputPath, options = {}) {
  const { maxWidth = 1920, quality = 80 } = options;
  const filename = `${uuidv4()}.webp`;
  const outputPath = path.join(uploadsDir, filename);

  const result = await sharp(inputPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  // Clean up temp file
  await fs.unlink(inputPath).catch(() => {});

  return {
    filename,
    path: outputPath,
    width: result.width,
    height: result.height,
    sizeBytes: result.size,
  };
}

/**
 * Delete an image file from uploads/.
 */
export async function deleteImage(filename) {
  const filePath = path.join(uploadsDir, filename);
  await fs.unlink(filePath);
}

/**
 * Ensure uploads/ and uploads/temp/ directories exist.
 */
export async function ensureUploadDirs() {
  await fs.mkdir(path.join(uploadsDir, 'temp'), { recursive: true });
}
