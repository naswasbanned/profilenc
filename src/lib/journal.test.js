import { describe, it, expect } from 'vitest';
import { readPaperStyle, PAPER_STYLE_KEY, isProfilePath, entryIdFromPath, findTabWithEntry, entryShareUrl } from './journal';

const store = (value) => ({ getItem: (k) => (k === PAPER_STYLE_KEY ? value : null) });

describe('readPaperStyle', () => {
  it('returns a saved known style', () => {
    expect(readPaperStyle(store('midnight'))).toBe('midnight');
  });
  it('falls back for unknown values, missing storage and throwing storage', () => {
    expect(readPaperStyle(store('bogus'))).toBe('notebook');
    expect(readPaperStyle(undefined)).toBe('notebook');
    expect(readPaperStyle({ getItem: () => { throw new Error('blocked'); } })).toBe('notebook');
  });
});

describe('profile paths', () => {
  it('recognises profile and entry paths only', () => {
    expect(isProfilePath('/@nas')).toBe(true);
    expect(isProfilePath('/nas/journal/entry-1')).toBe(true);
    expect(isProfilePath('/@nas/edit')).toBe(false);
    expect(isProfilePath('/dashboard/x')).toBe(false);
  });
  it('extracts the entry id', () => {
    expect(entryIdFromPath('/@nas/journal/entry-123')).toBe('entry-123');
    expect(entryIdFromPath('/@nas/journal/a%20b')).toBe('a b');
    expect(entryIdFromPath('/@nas')).toBe(null);
    expect(entryIdFromPath('/@nas/edit')).toBe(null);
  });
});

describe('findTabWithEntry', () => {
  const content = {
    tabs: [
      { id: 'a', blocks: [{ type: 'gallery', data: { items: [{ id: 'e1' }] } }] },
      { id: 'b', blocks: [{ type: 'journal', data: { items: [{ id: 'e1' }, { id: 'e2' }] } }] },
    ],
  };
  it('finds the tab of a journal entry, ignoring other block types', () => {
    expect(findTabWithEntry(content, 'e1')).toBe('b');
    expect(findTabWithEntry(content, 'e2')).toBe('b');
  });
  it('returns null for unknown or missing ids', () => {
    expect(findTabWithEntry(content, 'nope')).toBe(null);
    expect(findTabWithEntry(content, null)).toBe(null);
    expect(findTabWithEntry(undefined, 'e1')).toBe(null);
  });
});

describe('entryShareUrl', () => {
  it('builds an absolute entry link with or without the @', () => {
    expect(entryShareUrl('https://p.test/', '@nas', 'entry-1')).toBe('https://p.test/@nas/journal/entry-1');
    expect(entryShareUrl('https://p.test', 'nas', 'a b')).toBe('https://p.test/@nas/journal/a%20b');
  });
});
