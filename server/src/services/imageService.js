import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

/**
 * Formats we accept, checked against what libvips reports after reading the
 * file header. This is the authoritative type check: the multipart Content-Type
 * is supplied by the client and means nothing on its own.
 *
 * SVG is excluded on purpose (script carrier, and unused by the product).
 */
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'gif', 'webp', 'avif']);

/** ~50 megapixels. Bounds decode cost so a small file cannot pin the CPU. */
const MAX_INPUT_PIXELS = 50_000_000;

/** Thrown for input problems, so routes can answer 400 instead of 500. */
export class ImageValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ImageValidationError';
    this.status = 400;
  }
}

/**
 * Validate and process an uploaded image:
 *  1. Identify the real format from the file contents; reject anything else
 *  2. Auto-rotate from EXIF
 *  3. Resize if wider than maxWidth (keep aspect ratio, never enlarge)
 *  4. Convert to WebP (quality 80)
 *  5. Strip all metadata
 *  6. Save to outputDir (or uploads/) with a UUID filename
 *
 * The temp file is removed on every path, success or failure.
 *
 * Returns { filename, path, width, height, sizeBytes }
 * Throws ImageValidationError when the upload is not a supported image.
 */
export async function processImage(inputPath, options = {}) {
  const { maxWidth = 1920, quality = 80, outputDir = uploadsDir } = options;

  try {
    const pipeline = sharp(inputPath, {
      limitInputPixels: MAX_INPUT_PIXELS,
      sequentialRead: true,
      failOn: 'error',
    });

    let metadata;
    try {
      metadata = await pipeline.metadata();
    } catch {
      throw new ImageValidationError('That file could not be read as an image');
    }

    if (!metadata?.format || !ALLOWED_FORMATS.has(metadata.format)) {
      throw new ImageValidationError(
        'Unsupported image type. Use JPEG, PNG, GIF, WebP, or AVIF.'
      );
    }

    const filename = `${uuidv4()}.webp`;
    const outputPath = path.join(outputDir, filename);

    const result = await pipeline
      .rotate()
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(outputPath);

    return {
      filename,
      path: outputPath,
      width: result.width,
      height: result.height,
      sizeBytes: result.size,
    };
  } finally {
    // Always clean up the multer temp file, including when validation rejected it.
    await fs.unlink(inputPath).catch(() => {});
  }
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
