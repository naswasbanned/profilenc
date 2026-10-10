/**
 * Privacy-light profile analytics: daily counters only. Nothing that
 * identifies a visitor (IP, cookie, user agent) is ever stored.
 */

export const STAT_KINDS = new Set(['view', 'click']);
export const MAX_TARGET_LENGTH = 300;

// Crawlers and preview fetchers; real browsers never match these
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|embedly|headless|lighthouse|curl|wget|python|axios|node-fetch|go-http/i;

export function isBotUserAgent(ua) {
  return !ua || BOT_UA.test(ua);
}

/**
 * Validate a tracking event from the client.
 * @returns {{kind: string, target: string} | null} null when the event must be dropped.
 */
export function parseStatEvent(body) {
  const kind = body?.kind;
  if (!STAT_KINDS.has(kind)) return null;
  if (kind === 'view') return { kind, target: '' };

  const target = typeof body?.target === 'string' ? body.target.trim() : '';
  if (!target || target.length > MAX_TARGET_LENGTH) return null;
  return { kind, target };
}

/** Clamp the stats window to 1..90 days, default 30. */
export function parseDays(value) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return 30;
  return Math.min(90, Math.max(1, n));
}
