import { describe, expect, it } from 'vitest';
import {
  senderLabel,
  subjectOf,
  previewOf,
  formatListTime,
  formatFullDate,
  unreadDelta,
  nextSelectionAfterRemoval,
  moveActive,
  filterLoaded,
  mergeById,
  normalizeRecipient,
} from './inbox';

const direct = (text, extra = {}) => ({
  id: 1,
  source: 'direct',
  sender_username: 'alice',
  sender_name: 'alice',
  status: 'NEW',
  answers: [{ id: 'message', label: 'Message', type: 'textarea', value: text }],
  ...extra,
});

const block = (answers, extra = {}) => ({
  id: 2,
  source: 'block',
  sender_name: null,
  sender_username: null,
  status: 'READ',
  answers,
  ...extra,
});

describe('senderLabel', () => {
  it('uses the username for direct messages, falling back to sender_name', () => {
    expect(senderLabel(direct('hi'))).toBe('alice');
    expect(senderLabel(direct('hi', { sender_username: null, sender_name: 'bob' }))).toBe('bob');
    expect(senderLabel(direct('hi', { sender_username: null, sender_name: null }))).toBe('Anonymous');
  });
  it('finds a name-like text answer for block messages', () => {
    const m = block([
      { id: 'a', label: 'Your Name', type: 'text', value: ' Dana ' },
      { id: 'b', label: 'Email', type: 'email', value: 'd@x.io' },
    ]);
    expect(senderLabel(m)).toBe('Dana');
  });
  it('falls back for empty name answers, missing answers and null', () => {
    expect(senderLabel(block([{ id: 'a', label: 'Name', type: 'text', value: '  ' }], { sender_name: 'Zed' }))).toBe('Zed');
    expect(senderLabel(block([]))).toBe('Anonymous');
    expect(senderLabel(block('nope'))).toBe('Anonymous');
    expect(senderLabel(null)).toBe('Anonymous');
  });
});

describe('subjectOf', () => {
  it('uses the first non-empty line of a direct message', () => {
    expect(subjectOf(direct('\n\n  Hello there  \nsecond'))).toBe('Hello there');
  });
  it('truncates long subjects', () => {
    const s = subjectOf(direct('x'.repeat(200)));
    expect(s.length).toBeLessThanOrEqual(80);
    expect(s.endsWith('...')).toBe(true);
  });
  it('handles empty direct text and block messages', () => {
    expect(subjectOf(direct('   '))).toBe('(no text)');
    expect(subjectOf(block([]))).toBe('Contact form');
    expect(subjectOf(null)).toBe('');
  });
});

describe('previewOf', () => {
  it('shows text after the first line, collapsing whitespace', () => {
    expect(previewOf(direct('Subject\nline   two\n\nline three'))).toBe('line two line three');
  });
  it('falls back to the first line for single-line messages', () => {
    expect(previewOf(direct('only one line'))).toBe('only one line');
  });
  it('joins label: value pairs for block messages and skips empty values', () => {
    const m = block([
      { id: 'a', label: 'Name', type: 'text', value: 'Dana' },
      { id: 'b', label: 'Phone', type: 'text', value: '' },
      { id: 'c', label: 'Note', type: 'textarea', value: 'Hi\nthere' },
    ]);
    expect(previewOf(m)).toBe('Name: Dana \u00b7 Note: Hi there');
  });
  it('truncates and tolerates bad answers', () => {
    expect(previewOf(direct('s\n' + 'y'.repeat(400))).length).toBeLessThanOrEqual(140);
    expect(previewOf(block(null))).toBe('');
    expect(previewOf(direct('', { answers: [null, 5] }))).toBe('');
  });
});

describe('formatListTime', () => {
  const now = new Date(2025, 5, 15, 12, 0, 0);
  it('returns a time for today', () => {
    const out = formatListTime(new Date(2025, 5, 15, 9, 5, 0), now);
    expect(out).toMatch(/\d/);
    expect(out).not.toContain('Jun');
  });
  it('treats the midnight boundary as the same day / previous day', () => {
    const lateNow = new Date(2025, 5, 15, 0, 0, 1);
    expect(formatListTime(new Date(2025, 5, 14, 23, 59, 59), lateNow)).toBe('Jun 14');
    expect(formatListTime(new Date(2025, 5, 15, 0, 0, 0), lateNow)).not.toContain('Jun');
  });
  it('uses Mon D within the year and adds the year otherwise', () => {
    expect(formatListTime(new Date(2025, 0, 3, 10, 0, 0), now)).toBe('Jan 3');
    expect(formatListTime(new Date(2023, 11, 25, 10, 0, 0), now)).toBe('Dec 25, 2023');
  });
  it('returns empty for invalid dates', () => {
    expect(formatListTime('garbage', now)).toBe('');
    expect(formatListTime(undefined, now)).toBe('');
  });
});

describe('formatFullDate', () => {
  it('formats valid dates and rejects invalid ones', () => {
    expect(formatFullDate(new Date(2025, 5, 15, 9, 5, 0))).toContain('2025');
    expect(formatFullDate('nope')).toBe('');
  });
});

describe('unreadDelta', () => {
  it('only NEW counts as unread', () => {
    expect(unreadDelta('NEW', 'READ')).toBe(-1);
    expect(unreadDelta('NEW', 'ARCHIVED')).toBe(-1);
    expect(unreadDelta('READ', 'NEW')).toBe(1);
    expect(unreadDelta('ARCHIVED', 'NEW')).toBe(1);
    expect(unreadDelta('READ', 'ARCHIVED')).toBe(0);
    expect(unreadDelta('NEW', 'NEW')).toBe(0);
  });
});

describe('nextSelectionAfterRemoval', () => {
  const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
  it('prefers the next item, then the previous', () => {
    expect(nextSelectionAfterRemoval(list, 1)).toBe(2);
    expect(nextSelectionAfterRemoval(list, 2)).toBe(3);
    expect(nextSelectionAfterRemoval(list, 3)).toBe(2);
  });
  it('returns null for the only item, unknown ids and bad input', () => {
    expect(nextSelectionAfterRemoval([{ id: 9 }], 9)).toBeNull();
    expect(nextSelectionAfterRemoval(list, 42)).toBeNull();
    expect(nextSelectionAfterRemoval(null, 1)).toBeNull();
  });
});

describe('moveActive', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  it('moves and clamps without wrapping', () => {
    expect(moveActive(list, 'a', 'ArrowDown')).toBe('b');
    expect(moveActive(list, 'c', 'ArrowDown')).toBe('c');
    expect(moveActive(list, 'a', 'ArrowUp')).toBe('a');
    expect(moveActive(list, 'c', 'ArrowUp')).toBe('b');
  });
  it('supports Home/End and starts at the first item with no current', () => {
    expect(moveActive(list, 'b', 'Home')).toBe('a');
    expect(moveActive(list, 'b', 'End')).toBe('c');
    expect(moveActive(list, null, 'ArrowDown')).toBe('a');
  });
  it('ignores other keys and empty lists', () => {
    expect(moveActive(list, 'a', 'x')).toBeNull();
    expect(moveActive([], null, 'ArrowDown')).toBeNull();
  });
});

describe('filterLoaded', () => {
  const items = [direct('Lunch plans\ntomorrow?', { id: 1 }), direct('Invoice', { id: 2, sender_username: 'zed' })];
  it('returns everything for empty text', () => {
    expect(filterLoaded(items, '  ')).toBe(items);
  });
  it('matches sender, subject and preview case-insensitively', () => {
    expect(filterLoaded(items, 'ZED').map((m) => m.id)).toEqual([2]);
    expect(filterLoaded(items, 'lunch').map((m) => m.id)).toEqual([1]);
    expect(filterLoaded(items, 'tomorrow').map((m) => m.id)).toEqual([1]);
    expect(filterLoaded(items, 'nothing')).toEqual([]);
  });
  it('tolerates non-arrays', () => {
    expect(filterLoaded(null, 'a')).toEqual([]);
  });
});

describe('mergeById', () => {
  it('appends new ids and skips duplicates', () => {
    expect(mergeById([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }])).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
  it('keeps the same array when nothing is new and handles bad input', () => {
    const base = [{ id: 1 }];
    expect(mergeById(base, [{ id: 1 }])).toBe(base);
    expect(mergeById(null, [{ id: 1 }])).toEqual([{ id: 1 }]);
    expect(mergeById([{ id: 1 }], null)).toEqual([{ id: 1 }]);
  });
});

describe('normalizeRecipient', () => {
  it('trims, strips @ and lowercases', () => {
    expect(normalizeRecipient('  @Alice ')).toBe('alice');
    expect(normalizeRecipient('@@Bob')).toBe('bob');
    expect(normalizeRecipient('')).toBe('');
    expect(normalizeRecipient(null)).toBe('');
  });
});
