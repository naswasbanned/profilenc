/** Clamp `n` to [min, max] and round to the nearest `step` (anchored at min). */
export function clampToRange(n, min, max, step = 1) {
  let v = Number(n);
  if (!Number.isFinite(v)) return null;
  if (step > 0) v = min + Math.round((v - min) / step) * step;
  v = Math.min(max, Math.max(min, v));
  // Trim float noise from fractional steps.
  return Math.round(v * 1e6) / 1e6;
}

/** Parse a typed draft; returns a clamped number or null when it is not a valid number. */
export function parseDraft(draft, min, max, step = 1) {
  const text = String(draft ?? '').trim();
  if (text === '') return null;
  return clampToRange(text, min, max, step);
}
