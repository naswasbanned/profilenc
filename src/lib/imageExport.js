/**
 * Browser side of the image editor: decodes the source, renders the edit into
 * a canvas in a single pass and encodes it. All geometry and filter math comes
 * from the pure `imageEdit.js` module.
 */
import {
  applyFilterOpsToPixels,
  editedFileName,
  opsToCssFilter,
  pickFallbackType,
  planExport,
} from './imageEdit.js';

const ENCODE_QUALITY = 0.92;
// Above this many output pixels the fallback filter loop runs in row bands.
const BANDED_PIXEL_THRESHOLD = 16_000_000;

let canvasFilterSupport = null;

/** Memoised feature test: draw a red pixel with ctx.filter = 'grayscale(1)', read it back. */
export function supportsCanvasFilter() {
  if (canvasFilterSupport !== null) return canvasFilterSupport;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || !('filter' in ctx)) {
      canvasFilterSupport = false;
      return canvasFilterSupport;
    }
    ctx.filter = 'grayscale(1)';
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    canvasFilterSupport = r === g && g === b;
  } catch {
    canvasFilterSupport = false;
  }
  return canvasFilterSupport;
}

/** Resolves an HTMLImageElement from an object URL; rejects on decode error. */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image could not be decoded'));
    img.src = src;
  });
}

/** Promise wrapper around canvas.toBlob; rejects on null blob. */
export function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export failed'));
      }, type, quality);
    } catch (err) {
      reject(err);
    }
  });
}

function applyPixelFallback(ctx, width, height, ops) {
  const bandHeight = width * height > BANDED_PIXEL_THRESHOLD
    ? Math.max(1, Math.floor(BANDED_PIXEL_THRESHOLD / 4 / width))
    : height;
  for (let y = 0; y < height; y += bandHeight) {
    const rows = Math.min(bandHeight, height - y);
    const imageData = ctx.getImageData(0, y, width, rows);
    applyFilterOpsToPixels(imageData.data, ops);
    ctx.putImageData(imageData, 0, y);
  }
}

/**
 * Renders the edit with planExport + ctx.setTransform, applies filters via
 * ctx.filter or (fallback) getImageData -> applyFilterOpsToPixels ->
 * putImageData, encodes WebP (quality 0.92); if the returned blob.type is not
 * image/webp, re-encodes with pickFallbackType(file.type). Returns a File
 * named by editedFileName.
 */
export async function exportEditedImage({ image, file, rotation = 0, crop, ops = [] }) {
  const plan = planExport({
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    rotation,
    crop,
  });

  const canvas = document.createElement('canvas');
  canvas.width = plan.width;
  canvas.height = plan.height;
  const useFallback = ops.length > 0 && !supportsCanvasFilter();
  const ctx = canvas.getContext('2d', useFallback ? { willReadFrequently: true } : undefined);
  if (!ctx) throw new Error('Canvas is not available');

  ctx.setTransform(...plan.matrix);
  if (ops.length > 0 && !useFallback) ctx.filter = opsToCssFilter(ops);
  ctx.drawImage(image, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!useFallback && ops.length > 0) ctx.filter = 'none';

  if (useFallback) applyPixelFallback(ctx, plan.width, plan.height, ops);

  let blob = await canvasToBlob(canvas, 'image/webp', ENCODE_QUALITY);
  if (blob.type !== 'image/webp') {
    blob = await canvasToBlob(canvas, pickFallbackType(file?.type), ENCODE_QUALITY);
  }

  return new File([blob], editedFileName(file?.name, blob.type), { type: blob.type });
}
