/**
 * Pure helpers for the built-in image editor: crop ratios, quarter-turn
 * rotation, filter ops (shared by the CSS preview, ctx.filter and the pixel
 * fallback), the single-pass export plan, file naming and GIF detection.
 * No DOM access here, so everything is unit and property tested in Node.
 */

// --- Ratios ---------------------------------------------------------------

export const RATIO_OPTIONS = [
  { id: 'free', label: 'Free', value: null },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '16:9', label: '16:9', value: 16 / 9 },
  { id: '3:1', label: '3:1', value: 3 },
  { id: '1.91:1', label: '1.91:1', value: 1.91 },
];

/** Unknown, missing or malformed ids resolve to 'free'. */
export function resolveRatioId(id) {
  if (typeof id === 'string' && RATIO_OPTIONS.some((option) => option.id === id)) return id;
  return 'free';
}

/** Numeric aspect (width / height) for a ratio id, or null for Free. */
export function ratioValue(id) {
  const resolved = resolveRatioId(id);
  return RATIO_OPTIONS.find((option) => option.id === resolved).value;
}

// --- Rotation -------------------------------------------------------------

export const ROTATIONS = [0, 90, 180, 270];

/** rotateBy(r, +90) = clockwise, rotateBy(r, -90) = counter-clockwise. */
export function rotateBy(rotation, delta) {
  return (((rotation + delta) % 360) + 360) % 360;
}

/** Bounding box of a w x h image rotated by a multiple of 90 degrees. */
export function rotatedBounds(width, height, rotation) {
  const quarter = (((Math.round(rotation / 90) % 4) + 4) % 4);
  return quarter % 2 === 1 ? { width: height, height: width } : { width, height };
}

// --- Filters --------------------------------------------------------------

export const NEUTRAL_ADJUSTMENTS = { brightness: 100, contrast: 100, saturation: 100 };

export const ADJUSTMENT_RANGES = {
  brightness: { min: 50, max: 150, step: 1 },
  contrast: { min: 50, max: 150, step: 1 },
  saturation: { min: 0, max: 200, step: 1 },
};

export const FILTER_PRESETS = [
  { id: 'none', label: 'None', ops: [] },
  { id: 'mono', label: 'Mono', ops: [{ fn: 'grayscale', amount: 1 }] },
  { id: 'sepia', label: 'Sepia', ops: [{ fn: 'sepia', amount: 0.8 }] },
  { id: 'warm', label: 'Warm', ops: [{ fn: 'sepia', amount: 0.25 }, { fn: 'saturate', amount: 1.2 }, { fn: 'hue-rotate', amount: -10 }] },
  { id: 'cool', label: 'Cool', ops: [{ fn: 'saturate', amount: 0.9 }, { fn: 'hue-rotate', amount: 15 }, { fn: 'brightness', amount: 1.03 }] },
  { id: 'vivid', label: 'Vivid', ops: [{ fn: 'saturate', amount: 1.5 }, { fn: 'contrast', amount: 1.1 }] },
  { id: 'fade', label: 'Fade', ops: [{ fn: 'contrast', amount: 0.85 }, { fn: 'brightness', amount: 1.08 }, { fn: 'saturate', amount: 0.8 }] },
];

export const FILTER_FNS = ['brightness', 'contrast', 'saturate', 'grayscale', 'sepia', 'hue-rotate'];

const ADJUSTMENT_OPS = [
  { key: 'brightness', fn: 'brightness' },
  { key: 'contrast', fn: 'contrast' },
  { key: 'saturation', fn: 'saturate' },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Preset ops followed by non-neutral adjustment ops (brightness, contrast,
 * saturate). Adjustments are percentages (100 = neutral), clamped to
 * ADJUSTMENT_RANGES; non-finite values count as neutral; unknown preset = none.
 */
export function buildFilterOps(presetId, adjustments) {
  const preset = FILTER_PRESETS.find((p) => p.id === presetId) || FILTER_PRESETS[0];
  const ops = preset.ops.map((op) => ({ ...op }));
  const source = adjustments && typeof adjustments === 'object' ? adjustments : {};

  for (const { key, fn } of ADJUSTMENT_OPS) {
    const raw = source[key];
    if (typeof raw !== 'number' || !Number.isFinite(raw)) continue;
    const { min, max } = ADJUSTMENT_RANGES[key];
    const value = clamp(raw, min, max);
    if (value === NEUTRAL_ADJUSTMENTS[key]) continue;
    ops.push({ fn, amount: value / 100 });
  }

  return ops;
}

/** [] -> 'none'; otherwise e.g. 'sepia(0.8) brightness(1.1) hue-rotate(15deg)'. */
export function opsToCssFilter(ops) {
  if (!Array.isArray(ops) || ops.length === 0) return 'none';
  return ops
    .map(({ fn, amount }) => (fn === 'hue-rotate' ? `hue-rotate(${amount}deg)` : `${fn}(${amount})`))
    .join(' ');
}

// Filter Effects Module Level 1 colour matrices (row-major 3x3).
function grayscaleMatrix(amount) {
  const s = 1 - clamp(amount, 0, 1);
  return [
    0.2126 + 0.7874 * s, 0.7152 - 0.7152 * s, 0.0722 - 0.0722 * s,
    0.2126 - 0.2126 * s, 0.7152 + 0.2848 * s, 0.0722 - 0.0722 * s,
    0.2126 - 0.2126 * s, 0.7152 - 0.7152 * s, 0.0722 + 0.9278 * s,
  ];
}

function sepiaMatrix(amount) {
  const s = 1 - clamp(amount, 0, 1);
  return [
    0.393 + 0.607 * s, 0.769 - 0.769 * s, 0.189 - 0.189 * s,
    0.349 - 0.349 * s, 0.686 + 0.314 * s, 0.168 - 0.168 * s,
    0.272 - 0.272 * s, 0.534 - 0.534 * s, 0.131 + 0.869 * s,
  ];
}

function saturateMatrix(s) {
  return [
    0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s,
    0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s,
    0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s,
  ];
}

function hueRotateMatrix(degrees) {
  const rad = (degrees * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [
    0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
    0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.140, 0.072 - c * 0.072 - s * 0.283,
    0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
  ];
}

function opToTransform({ fn, amount }) {
  const a = Number.isFinite(amount) ? amount : (fn === 'hue-rotate' || fn === 'grayscale' || fn === 'sepia' ? 0 : 1);
  switch (fn) {
    case 'brightness':
      return { kind: 'linear', mul: a, add: 0 };
    case 'contrast':
      return { kind: 'linear', mul: a, add: 0.5 - 0.5 * a };
    case 'grayscale':
      return { kind: 'matrix', m: grayscaleMatrix(a) };
    case 'sepia':
      return { kind: 'matrix', m: sepiaMatrix(a) };
    case 'saturate':
      return { kind: 'matrix', m: saturateMatrix(Math.max(0, a)) };
    case 'hue-rotate':
      return { kind: 'matrix', m: hueRotateMatrix(a) };
    default:
      return null;
  }
}

/**
 * In-place on an RGBA Uint8ClampedArray. Applies ops in order with the Filter
 * Effects formulas (sRGB, 0..1), clamping after every op; alpha is untouched.
 */
export function applyFilterOpsToPixels(data, ops) {
  if (!data || !Array.isArray(ops) || ops.length === 0) return data;
  const transforms = ops.map(opToTransform).filter(Boolean);
  if (transforms.length === 0) return data;

  for (let i = 0; i + 3 < data.length; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;

    for (const t of transforms) {
      if (t.kind === 'linear') {
        r = r * t.mul + t.add;
        g = g * t.mul + t.add;
        b = b * t.mul + t.add;
      } else {
        const m = t.m;
        const nr = m[0] * r + m[1] * g + m[2] * b;
        const ng = m[3] * r + m[4] * g + m[5] * b;
        const nb = m[6] * r + m[7] * g + m[8] * b;
        r = nr;
        g = ng;
        b = nb;
      }
      r = clamp(r, 0, 1);
      g = clamp(g, 0, 1);
      b = clamp(b, 0, 1);
    }

    data[i] = Math.round(r * 255);
    data[i + 1] = Math.round(g * 255);
    data[i + 2] = Math.round(b * 255);
  }

  return data;
}

// --- Export planning ------------------------------------------------------

export const MAX_OUTPUT_SIDE = 2560;

/** Scale w x h down (never up) so the longest side <= maxSide; integers >= 1. */
export function fitWithinMaxSide(width, height, maxSide = MAX_OUTPUT_SIDE) {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const limit = Math.max(1, Math.floor(maxSide));
  const longest = Math.max(w, h);
  if (longest <= limit) return { width: w, height: h };
  const scale = limit / longest;
  return {
    width: clamp(Math.round(w * scale), 1, limit),
    height: clamp(Math.round(h * scale), 1, limit),
  };
}

// Exact trig for quarter turns so 0 degrees maps the crop origin to (0, 0).
function quarterTrig(rotation) {
  const r = rotateBy(Math.round(rotation / 90) * 90, 0);
  if (r === 0) return { cos: 1, sin: 0 };
  if (r === 90) return { cos: 0, sin: 1 };
  if (r === 180) return { cos: -1, sin: 0 };
  return { cos: 0, sin: -1 };
}

/**
 * Single-pass export plan. `crop` is react-easy-crop's croppedAreaPixels, in
 * the coordinate space of the rotated image's bounding box. Returns
 * { width, height, matrix: [a, b, c, d, e, f] } where matrix maps source image
 * pixel coordinates to output canvas coordinates (for ctx.setTransform).
 */
export function planExport({ naturalWidth, naturalHeight, rotation = 0, crop, maxSide = MAX_OUTPUT_SIDE }) {
  const { width, height } = fitWithinMaxSide(crop.width, crop.height, maxSide);
  // Per-axis scale so the crop fills the integer canvas exactly (no partly
  // transparent edge row from rounding); both equal width / crop.width up to
  // sub-pixel rounding.
  const sx = width / crop.width;
  const sy = height / crop.height;
  const { cos, sin } = quarterTrig(rotation);
  const bounds = rotatedBounds(naturalWidth, naturalHeight, rotation);

  // translate(-W/2,-H/2) -> rotate -> translate(B/2) -> translate(-crop) -> scale
  const a = sx * cos;
  const b = sy * sin;
  const c = -sx * sin;
  const d = sy * cos;
  const e = sx * (-cos * (naturalWidth / 2) + sin * (naturalHeight / 2) + bounds.width / 2 - crop.x);
  const f = sy * (-sin * (naturalWidth / 2) - cos * (naturalHeight / 2) + bounds.height / 2 - crop.y);

  return { width, height, matrix: [a, b, c, d, e, f] };
}

// --- Files ----------------------------------------------------------------

/** 'image/jpeg' for JPEG sources, else 'image/png'. Used when WebP encode is unavailable. */
export function pickFallbackType(sourceType) {
  const type = typeof sourceType === 'string' ? sourceType.toLowerCase() : '';
  return type === 'image/jpeg' || type === 'image/jpg' ? 'image/jpeg' : 'image/png';
}

const MIME_EXTENSIONS = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };

/** 'photo.JPG' + 'image/webp' -> 'photo-edited.webp'. */
export function editedFileName(originalName, mimeType) {
  const name = typeof originalName === 'string' ? originalName : '';
  const dot = name.lastIndexOf('.');
  const base = (dot > 0 ? name.slice(0, dot) : name) || 'image';
  const ext = MIME_EXTENSIONS[mimeType] || 'png';
  return `${base}-edited.${ext}`;
}

// --- GIF detection --------------------------------------------------------

/** Walks GIF blocks; returns the number of image descriptors (0 for non-GIF). Never throws. */
export function countGifFrames(bytes) {
  if (!bytes || typeof bytes.length !== 'number' || bytes.length < 13) return 0;
  // 'GIF87a' or 'GIF89a'
  if (bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x38
    || (bytes[4] !== 0x37 && bytes[4] !== 0x39) || bytes[5] !== 0x61) {
    return 0;
  }

  const len = bytes.length;
  let pos = 6;
  const screenFlags = bytes[pos + 4];
  pos += 7;
  if (screenFlags & 0x80) pos += 3 * 2 ** ((screenFlags & 0x07) + 1);

  // Skips a chain of data sub-blocks; returns the position after the
  // terminator, or -1 when the data runs out first.
  const skipSubBlocks = (start) => {
    let p = start;
    while (p < len) {
      const size = bytes[p];
      p += 1;
      if (size === 0) return p;
      p += size;
    }
    return -1;
  };

  let frames = 0;
  while (pos < len) {
    const marker = bytes[pos];
    if (marker === 0x3b) break;
    if (marker === 0x2c) {
      if (pos + 10 > len) break;
      frames += 1;
      const flags = bytes[pos + 9];
      pos += 10;
      if (flags & 0x80) pos += 3 * 2 ** ((flags & 0x07) + 1);
      pos += 1; // LZW minimum code size
      if (pos > len) break;
      pos = skipSubBlocks(pos);
      if (pos < 0) break;
    } else if (marker === 0x21) {
      pos += 2; // introducer + label
      if (pos > len) break;
      pos = skipSubBlocks(pos);
      if (pos < 0) break;
    } else {
      break;
    }
  }

  return frames;
}

export const isAnimatedGif = (bytes) => countGifFrames(bytes) > 1;

// --- Free crop ------------------------------------------------------------

/** Free-mode crop size update, symmetric about the centre, clamped to [minSize, bounds]. */
export function resizeFreeCrop(size, { dWidth = 0, dHeight = 0 } = {}, bounds, minSize = 40) {
  const dw = Number.isFinite(dWidth) ? dWidth : 0;
  const dh = Number.isFinite(dHeight) ? dHeight : 0;
  const minW = Math.min(minSize, bounds.width);
  const minH = Math.min(minSize, bounds.height);
  return {
    width: clamp(size.width + dw, minW, bounds.width),
    height: clamp(size.height + dh, minH, bounds.height),
  };
}
