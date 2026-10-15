// Pure helpers for the dashboard inbox (no React, no DOM) so they can be unit tested.

export const INBOX_FILTERS = [
  { id: 'NEW', label: 'New' },
  { id: 'ALL', label: 'All' },
  { id: 'ARCHIVED', label: 'Archived' },
];

const PREVIEW_MAX = 140;
const SUBJECT_MAX = 80;

const asAnswers = (m) =>
  Array.isArray(m?.answers)
    ? m.answers.filter((a) => a && typeof a === 'object')
    : [];

const answerText = (a) => String(a?.value ?? '').trim();

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max - 3).trimEnd()}...` : text;

export const isDirect = (m) => m?.source === 'direct';

/** Display name for the sender column. */
export function senderLabel(m) {
  if (!m) return 'Anonymous';
  if (isDirect(m)) {
    return m.sender_username || m.sender_name || 'Anonymous';
  }
  const named = asAnswers(m).find(
    (a) => a.type === 'text' && /name/i.test(String(a.label ?? '')) && answerText(a) !== ''
  );
  if (named) return answerText(named);
  return m.sender_name || 'Anonymous';
}

/** One-line subject. Direct: first non-empty line. Block: a fixed label. */
export function subjectOf(m) {
  if (!m) return '';
  if (!isDirect(m)) return 'Contact form';
  const first = asAnswers(m)
    .map(answerText)
    .join('\n')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l !== '');
  return truncate(first || '(no text)', SUBJECT_MAX);
}

/** Short body preview shown under the subject. */
export function previewOf(m) {
  if (!m) return '';
  const answers = asAnswers(m);
  if (!isDirect(m)) {
    const pairs = answers
      .map((a) => {
        const value = answerText(a);
        if (!value) return '';
        const label = String(a.label ?? '').trim();
        return label ? `${label}: ${value}` : value;
      })
      .filter(Boolean)
      .join(' \u00b7 ');
    return truncate(pairs.replace(/\s+/g, ' '), PREVIEW_MAX);
  }
  const lines = answers
    .map(answerText)
    .join('\n')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l !== '');
  if (lines.length === 0) return '';
  const rest = lines.slice(1).join(' ').replace(/\s+/g, ' ');
  return truncate(rest || lines[0], PREVIEW_MAX);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Time for list rows: today HH:MM, this year "Mon D", otherwise "Mon D, YYYY". */
export function formatListTime(value, now = new Date()) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return '';
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return d.getFullYear() === now.getFullYear() ? base : `${base}, ${d.getFullYear()}`;
}

/** Long date and time for the reading pane. */
export function formatFullDate(value) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return '';
  const date = d.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date}, ${time}`;
}

/** NEW is the only unread status. Returns -1, 0 or +1 for the unread counter. */
export function unreadDelta(prevStatus, nextStatus) {
  const was = prevStatus === 'NEW';
  const will = nextStatus === 'NEW';
  if (was === will) return 0;
  return will ? 1 : -1;
}

/** Id to select after removing `id`: the next one, else the previous, else null. */
export function nextSelectionAfterRemoval(items, id) {
  if (!Array.isArray(items)) return null;
  const index = items.findIndex((m) => m.id === id);
  if (index === -1) return null;
  if (items[index + 1]) return items[index + 1].id;
  if (items[index - 1]) return items[index - 1].id;
  return null;
}

/** Arrow/Home/End navigation, clamped (no wrap). Returns the new id or null for other keys. */
export function moveActive(items, currentId, key) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const index = items.findIndex((m) => m.id === currentId);
  let next;
  if (key === 'Home') next = 0;
  else if (key === 'End') next = items.length - 1;
  else if (key === 'ArrowDown') next = index === -1 ? 0 : Math.min(items.length - 1, index + 1);
  else if (key === 'ArrowUp') next = index === -1 ? 0 : Math.max(0, index - 1);
  else return null;
  return items[next].id;
}

/** Case-insensitive filter over the already loaded messages. */
export function filterLoaded(items, text) {
  if (!Array.isArray(items)) return [];
  const needle = String(text ?? '').trim().toLowerCase();
  if (!needle) return items;
  return items.filter((m) =>
    [senderLabel(m), subjectOf(m), previewOf(m)].some((s) => s.toLowerCase().includes(needle))
  );
}

/** Append `incoming` to `existing`, skipping ids that are already present. */
export function mergeById(existing, incoming) {
  const base = Array.isArray(existing) ? existing : [];
  const seen = new Set(base.map((m) => m.id));
  const extra = (Array.isArray(incoming) ? incoming : []).filter((m) => !seen.has(m.id));
  return extra.length ? [...base, ...extra] : base;
}

/** Mirrors the server: trim, strip leading @, lowercase. */
export function normalizeRecipient(raw) {
  if (typeof raw !== 'string') return '';
  return raw.trim().replace(/^@+/, '').trim().toLowerCase();
}
