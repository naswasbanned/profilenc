import { apiUrl, getStoredToken } from './api';

/**
 * Visitor analytics beacons (counts only; see server/src/routes/stats.js).
 * Fire-and-forget: tracking must never block or break the profile.
 */

/** Click target for a link inside a block, as `block:<id>|<url>`, or null for non-links. */
export function clickTarget(element) {
  const link = element?.closest?.('a[href]');
  if (!link) return null;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return null;
  const blockId = link.closest('[data-block-id]')?.getAttribute('data-block-id') || 'page';
  return `block:${blockId}|${href}`.slice(0, 300);
}

export function track(username, kind, target) {
  if (!username || typeof navigator === 'undefined') return;
  const body = JSON.stringify(target ? { kind, target } : { kind });
  const url = apiUrl(`/api/stats/${encodeURIComponent(username)}`);
  const token = getStoredToken();
  try {
    // Logged-in visitors send their token so the server can skip the owner's own
    // visits; sendBeacon cannot carry headers, so they use a keepalive fetch instead.
    if (!token && navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain' }))) return;
    const headers = { 'Content-Type': 'text/plain' };
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch(url, { method: 'POST', body, headers, keepalive: true }).catch(() => {});
  } catch {
    // Analytics is best-effort
  }
}
