// Pure helpers for the username suggestion combobox.

export const SUGGEST_MIN = 2;
export const SUGGEST_MAX_QUERY = 40;

/** Same rules as the server: trim, strip leading @, lowercase, '' under 2 characters. */
export function normalizeSuggestQuery(raw) {
  if (typeof raw !== 'string') return '';
  const q = raw.trim().replace(/^@+/, '').trim().toLowerCase().slice(0, SUGGEST_MAX_QUERY);
  return q.length >= SUGGEST_MIN ? q : '';
}

/** Active option index for ArrowDown/ArrowUp with wrap. -1 when there are no options. */
export function nextActiveIndex(current, count, key) {
  if (!count || count < 1) return -1;
  if (key === 'ArrowDown') return current < 0 || current >= count - 1 ? 0 : current + 1;
  if (key === 'ArrowUp') return current <= 0 ? count - 1 : current - 1;
  return current;
}
