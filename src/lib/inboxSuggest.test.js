import { describe, expect, it } from 'vitest';
import { normalizeSuggestQuery, nextActiveIndex } from './inboxSuggest';

describe('normalizeSuggestQuery', () => {
  it('returns empty under two characters', () => {
    for (const v of ['', 'a', '@a', ' a ', '@', '  @ ']) {
      expect(normalizeSuggestQuery(v)).toBe('');
    }
  });
  it('trims, strips @ and lowercases', () => {
    expect(normalizeSuggestQuery('@AL')).toBe('al');
    expect(normalizeSuggestQuery('  Ali ')).toBe('ali');
    expect(normalizeSuggestQuery('@@bob')).toBe('bob');
  });
  it('caps at 40 characters', () => {
    expect(normalizeSuggestQuery('a'.repeat(60))).toHaveLength(40);
  });
  it('ignores non-strings', () => {
    for (const v of [null, undefined, 12, ['ab'], { a: 1 }]) {
      expect(normalizeSuggestQuery(v)).toBe('');
    }
  });
});

describe('nextActiveIndex', () => {
  it('returns -1 with no options', () => {
    expect(nextActiveIndex(0, 0, 'ArrowDown')).toBe(-1);
    expect(nextActiveIndex(-1, 0, 'ArrowUp')).toBe(-1);
  });
  it('moves down with wrap', () => {
    expect(nextActiveIndex(-1, 3, 'ArrowDown')).toBe(0);
    expect(nextActiveIndex(0, 3, 'ArrowDown')).toBe(1);
    expect(nextActiveIndex(2, 3, 'ArrowDown')).toBe(0);
  });
  it('moves up with wrap', () => {
    expect(nextActiveIndex(-1, 3, 'ArrowUp')).toBe(2);
    expect(nextActiveIndex(0, 3, 'ArrowUp')).toBe(2);
    expect(nextActiveIndex(2, 3, 'ArrowUp')).toBe(1);
  });
  it('keeps the index for other keys', () => {
    expect(nextActiveIndex(1, 3, 'a')).toBe(1);
  });
});
