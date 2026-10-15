// Pure helpers for the dashboard Statistics / Inbox tabs.

export const DASHBOARD_TABS = ['stats', 'inbox'];

// Only the exact value "inbox" opens the Inbox; anything else is Statistics.
export function resolveDashboardTab(value) {
  return value === 'inbox' ? 'inbox' : 'stats';
}

// Text for the unread pill. Empty string means "show no badge".
export function formatUnreadBadge(count) {
  if (typeof count !== 'number' || !Number.isFinite(count) || count <= 0) return '';
  return count > 99 ? '99+' : String(count);
}

// Next tab id for a roving-tabindex key press, or null when the key is not handled.
export function nextTabId(current, key) {
  const i = DASHBOARD_TABS.indexOf(current);
  if (i === -1) return null;
  const n = DASHBOARD_TABS.length;
  if (key === 'ArrowRight') return DASHBOARD_TABS[(i + 1) % n];
  if (key === 'ArrowLeft') return DASHBOARD_TABS[(i - 1 + n) % n];
  if (key === 'Home') return DASHBOARD_TABS[0];
  if (key === 'End') return DASHBOARD_TABS[n - 1];
  return null;
}
