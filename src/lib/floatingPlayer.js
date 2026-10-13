import { clampToRange } from './rangeValue';

/** Placement helpers for the floating vinyl of the music player block. */
export const FLOAT_EDGES = ['top', 'left', 'right'];
export const FLOAT_ALIGNS = ['start', 'center', 'end'];

/** Normalize owner-provided edge/align into known values. Garbage-safe. */
export function resolveFloatPlacement(edge, align) {
  return {
    edge: FLOAT_EDGES.includes(edge) ? edge : 'right',
    align: FLOAT_ALIGNS.includes(align) ? align : 'center',
  };
}

/** Vinyl size in px. The vinyl is designed at 180px; the tonearm scales with it. */
export const FLOAT_SIZE_MIN = 56;
export const FLOAT_SIZE_MAX = 180;
export const FLOAT_SIZE_STEP = 2;
export const FLOAT_SIZE_DEFAULT = 90;
export const FLOAT_DESIGN_SIZE = 180;

/** Older profiles stored a size key instead of pixels. */
const LEGACY_SIZES = { sm: 70, md: 90, lg: 120, xl: 150 };

/**
 * Normalize the stored size into pixels. Accepts numbers, numeric strings and
 * the legacy 'sm'|'md'|'lg'|'xl' keys. Garbage falls back to the default.
 */
export function resolveFloatSize(size) {
  if (typeof size === 'string' && Object.hasOwn(LEGACY_SIZES, size)) return LEGACY_SIZES[size];
  const isNumeric = typeof size === 'number' || (typeof size === 'string' && size.trim() !== '');
  const px = isNumeric ? clampToRange(size, FLOAT_SIZE_MIN, FLOAT_SIZE_MAX, FLOAT_SIZE_STEP) : null;
  return px ?? FLOAT_SIZE_DEFAULT;
}

/** Inline custom properties for the desktop size; the mobile media query overrides the derived ones. */
export function floatingStyle(size) {
  const px = resolveFloatSize(size);
  return {
    '--fv-desktop-size': `${px}px`,
    '--fv-desktop-scale': String(px / FLOAT_DESIGN_SIZE),
  };
}

/** CSS class string for the floating vinyl, e.g. `floating-vinyl edge-left align-end`. */
export function floatingClassName(edge, align) {
  const p = resolveFloatPlacement(edge, align);
  return `floating-vinyl edge-${p.edge} align-${p.align}`;
}
