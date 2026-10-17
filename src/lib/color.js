/**
 * Minimal color helpers for deriving readable text colors.
 * Only plain hex and rgb()/rgba() values are understood; anything else
 * (color-mix, var(), named colors) returns null so callers can fall back.
 */

const DARK_TEXT = '#17171a';
const LIGHT_TEXT = '#ffffff';

/** Parse '#rgb', '#rrggbb', '#rrggbbaa', 'rgb(...)' or 'rgba(...)' into {r,g,b,a}, or null. */
export function parseColor(input) {
  if (typeof input !== 'string') return null;
  const value = input.trim().toLowerCase();

  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(value);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = h.split('').map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }

  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+)(%?))?\s*\)$/.exec(value);
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : rgb[5] ? Number(rgb[4]) / 100 : Number(rgb[4]);
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]), a: Math.min(1, alpha) };
  }
  return null;
}

function channel(v) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance({ r, g, b }) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between two parsed colors (alpha ignored). */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** True for a light color, false for a dark one, null when the color cannot be parsed. */
export function isLightColor(input) {
  const c = parseColor(input);
  return c ? luminance(c) > 0.4 : null;
}

/**
 * Light or dark text, whichever contrasts more with `background`.
 * A translucent background is blended over `base` (default white) first.
 * Returns null when the background cannot be parsed.
 */
export function readableOn(background, base = '#ffffff') {
  const bg = parseColor(background);
  if (!bg) return null;
  const under = parseColor(base) || { r: 255, g: 255, b: 255 };
  const mix = (top, bottom) => Math.round(top * bg.a + bottom * (1 - bg.a));
  const solid = { r: mix(bg.r, under.r), g: mix(bg.g, under.g), b: mix(bg.b, under.b) };
  const light = parseColor(LIGHT_TEXT);
  const dark = parseColor(DARK_TEXT);
  return contrastRatio(solid, light) >= contrastRatio(solid, dark) ? LIGHT_TEXT : DARK_TEXT;
}
