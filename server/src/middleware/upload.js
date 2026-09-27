import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, '..', '..', 'uploads', 'temp');

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // authenticated users
export const MAX_PUBLIC_UPLOAD_BYTES = 2 * 1024 * 1024; // unauthenticated form

/**
 * Types we are willing to decode. SVG is deliberately absent: it is a script
 * carrier, and nothing in the product needs vector uploads.
 *
 * This header is supplied by the client, so it is only a cheap first filter.
 * The authoritative check happens in imageService.processImage, which asks
 * libvips what the bytes actually are.
 */
const ALLOWED_MIME = /^image\/(jpeg|jpg|png|gif|webp|avif)$/i;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tempDir),
  filename: (_req, _file, cb) => {
    // No extension, and nothing derived from originalname: the original
    // filename is attacker controlled, and sharp identifies the format from
    // the file contents rather than from its name.
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique);
  },
});

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIME.test(file.mimetype)) {
    cb(null, true);
    return;
  }
  const err = new Error('Only JPEG, PNG, GIF, WebP, and AVIF images are allowed');
  // Read by the error handler in index.js so this answers 400, not 500.
  err.status = 400;
  cb(err, false);
};

/** Authenticated uploads: up to 10MB, one file per request. */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
});

/**
 * Public, unauthenticated uploads (the suggestion form). Smaller ceiling,
 * because this path costs CPU without anyone having to log in first.
 */
export const publicUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_PUBLIC_UPLOAD_BYTES, files: 1 },
});

export default upload;
