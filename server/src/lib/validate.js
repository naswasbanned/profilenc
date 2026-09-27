/**
 * Input validation helpers for user-supplied text.
 *
 * Two jobs:
 *   1. Reject URL schemes that execute script (`javascript:`, `data:`, ...) so a
 *      hostile value can never reach the database in the first place. The client
 *      has the same check in src/lib/safeUrl.js; this file is a deliberate
 *      duplicate because the server image only copies server/src, so the two
 *      cannot share a module. Keep them in sync.
 *   2. Enforce length ceilings. `express.json({ limit: '5mb' })` otherwise lets
 *      a single field carry megabytes of text into a JSONB column.
 *
 * The ceilings below are set well above any realistic profile so they cannot
 * reject existing content. To tighten them, check your live maxima first:
 *
 *   SELECT max(length(display_name)), max(length(bio)), max(length(avatar_url))
 *   FROM users;
 */

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const RELATIVE_BASE = 'https://relative.invalid';

export const LIMITS = {
  displayName: 120,
  bio: 2000,
  avatarUrl: 2048,
  suggestionName: 120,
  suggestionEmail: 200,
  suggestionTitle: 200,
  suggestionMessage: 5000,
};

/**
 * @param {unknown} value
 * @returns {boolean} True when the value is safe to place in an href or src.
 */
export function isSafeUrl(value) {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (!trimmed) return false;

  // Browsers ignore control characters inside a scheme, so "java\tscript:" runs.
  // Matching them is the point of the check.
  // eslint-disable-next-line no-control-regex
  const candidate = trimmed.replace(/[\u0000-\u0020\u007f]/g, '');
  if (!candidate) return false;

  if (/^[?#]/.test(candidate) || (candidate.startsWith('/') && !candidate.startsWith('//'))) {
    return true;
  }

  try {
    return SAFE_PROTOCOLS.has(new URL(candidate, RELATIVE_BASE).protocol);
  } catch {
    return false;
  }
}

/**
 * Trim a value and confirm it fits. Returns an error string, or null when fine.
 *
 * @param {unknown} value
 * @param {number} max
 * @param {string} label  Human readable field name for the message.
 */
export function checkLength(value, max, label) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return `${label} must be text`;
  if (value.trim().length > max) return `${label} must be ${max} characters or fewer`;
  return null;
}

/**
 * Run several length checks and return the first failure.
 *
 * @param {Array<[unknown, number, string]>} checks
 * @returns {string|null}
 */
export function firstLengthError(checks) {
  for (const [value, max, label] of checks) {
    const error = checkLength(value, max, label);
    if (error) return error;
  }
  return null;
}
