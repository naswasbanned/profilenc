/**
 * URL scheme allowlist for anything a user can type.
 *
 * Profile blocks let people supply their own link targets, and those strings go
 * straight into `href`. Without a check, `javascript:...` in a link field is
 * stored XSS against every visitor of that profile.
 *
 * Allowed: http, https, mailto, tel, and relative paths (/, ?, #).
 * Everything else — javascript:, data:, vbscript:, file:, custom app schemes —
 * returns null so the caller can render inert text instead of a link.
 */

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

// Resolves relative inputs without touching the real location. The hostname is
// intentionally unroutable: nothing should ever navigate to it.
const RELATIVE_BASE = 'https://relative.invalid';

/**
 * @param {unknown} value  Raw user input.
 * @returns {string|null}  The original (trimmed) string when safe, else null.
 */
export function safeUrl(value) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Browsers ignore control characters and whitespace inside a scheme, so
  // "java\tscript:alert(1)" and "java\nscript:alert(1)" both execute. Strip
  // them before parsing, and parse the stripped form rather than the original.
  // The control characters in this class are the point of the check, so the
  // no-control-regex rule is intentionally suppressed here.
  // eslint-disable-next-line no-control-regex
  const candidate = trimmed.replace(/[\u0000-\u0020\u007f]/g, '');
  if (!candidate) return null;

  // A leading /, ? or # cannot carry a scheme, so it is always relative.
  // "//host/path" is protocol relative, not a path, so it goes through parsing.
  if (/^[?#]/.test(candidate) || (candidate.startsWith('/') && !candidate.startsWith('//'))) {
    return trimmed;
  }

  let parsed;
  try {
    parsed = new URL(candidate, RELATIVE_BASE);
  } catch {
    return null;
  }

  if (!SAFE_PROTOCOLS.has(parsed.protocol)) return null;

  return trimmed;
}

/**
 * Boolean form, for validation paths that only need a verdict.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isSafeUrl(value) {
  return safeUrl(value) !== null;
}

export default safeUrl;
