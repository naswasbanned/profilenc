import { describe, expect, it } from 'vitest';
import {
  CHANGE_TYPES,
  LATEST_STATUS,
  PATCH_SOURCES,
  compareNewestFirst,
  findManualNote,
  mergePatchNotes,
  normalizeChanges,
  parseVersion,
  versionKey,
} from './patchNotes.js';
import { MANUAL_PATCH_NOTES } from '../data/patchNotes.js';

const note = (version, extra = {}) => ({
  version,
  title: `Release ${version}`,
  date: 'September 1, 2026',
  changes: [{ type: 'NEW', text: 'Something new.' }],
  ...extra,
});

describe('parseVersion / versionKey', () => {
  it('reads v-prefixed and bare semver, filling missing parts with zero', () => {
    expect(parseVersion('v1.2.3')).toEqual([1, 2, 3]);
    expect(parseVersion('1.2')).toEqual([1, 2, 0]);
    expect(parseVersion('V2')).toEqual([2, 0, 0]);
  });

  it('returns null for anything that is not a version number', () => {
    expect(parseVersion('beta')).toBeNull();
    expect(parseVersion('v1.2.3-rc1')).toBeNull();
    expect(parseVersion('')).toBeNull();
  });

  it('treats equivalent spellings as the same release', () => {
    expect(versionKey('1.2.0')).toBe(versionKey('v1.2'));
    expect(versionKey('V1.2.0')).toBe('v1.2.0');
  });
});

describe('compareNewestFirst', () => {
  it('orders by version numerically, not as text', () => {
    const sorted = [note('v1.2.0'), note('v1.10.0'), note('v1.9.3')].sort(compareNewestFirst);
    expect(sorted.map((n) => n.version)).toEqual(['v1.10.0', 'v1.9.3', 'v1.2.0']);
  });

  it('falls back to the date when a version is not a number', () => {
    const older = note('beta', { date: 'August 1, 2026' });
    const newer = note('preview', { date: 'August 20, 2026' });
    expect([older, newer].sort(compareNewestFirst)[0]).toBe(newer);
  });
});

describe('normalizeChanges', () => {
  it('parses JSON strings and drops empty or malformed items', () => {
    const raw = JSON.stringify([
      { type: 'improved', text: '  Faster saves.  ' },
      { type: 'NEW', text: '   ' },
      { text: 'Untyped item.' },
      null,
      'not an object',
    ]);
    expect(normalizeChanges(raw)).toEqual([
      { type: 'IMPROVED', text: 'Faster saves.' },
      { type: 'NEW', text: 'Untyped item.' },
    ]);
  });

  it('returns an empty list for unreadable input', () => {
    expect(normalizeChanges('{broken')).toEqual([]);
    expect(normalizeChanges(undefined)).toEqual([]);
  });
});

describe('mergePatchNotes', () => {
  it('combines both sources, newest first, tagging where each came from', () => {
    const { notes } = mergePatchNotes({
      manual: [note('v1.1.0'), note('v1.3.0')],
      database: [note('v1.2.0', { id: 7 })],
    });
    expect(notes.map((n) => [n.version, n.source])).toEqual([
      ['v1.3.0', PATCH_SOURCES.CODE],
      ['v1.2.0', PATCH_SOURCES.DASHBOARD],
      ['v1.1.0', PATCH_SOURCES.CODE],
    ]);
    expect(notes[1].id).toBe(7);
    expect(notes[0].id).toBeUndefined();
  });

  it('lets code win a version clash and reports the hidden database row', () => {
    const { notes, shadowed } = mergePatchNotes({
      manual: [note('v1.0.0', { title: 'From code' })],
      database: [note('1.0.0', { id: 3, title: 'From dashboard' })],
    });
    expect(notes).toHaveLength(1);
    expect(notes[0].title).toBe('From code');
    expect(shadowed).toHaveLength(1);
    expect(shadowed[0]).toMatchObject({ id: 3, shadowedBy: PATCH_SOURCES.CODE });
  });

  it('marks only the newest release as current and latest', () => {
    const { notes } = mergePatchNotes({
      manual: [note('v1.0.0', { status: LATEST_STATUS }), note('v1.1.0')],
    });
    expect(notes[0]).toMatchObject({ version: 'v1.1.0', status: LATEST_STATUS, is_current: true });
    // A stale "latest" label on an older release is demoted
    expect(notes[1]).toMatchObject({ version: 'v1.0.0', status: 'UPDATE', is_current: false });
  });

  it('keeps custom labels on releases that are not the newest', () => {
    const { notes } = mergePatchNotes({
      manual: [note('v2.0.0'), note('v1.9.0', { status: 'SECURITY PATCH' })],
    });
    expect(notes[1].status).toBe('SECURITY PATCH');
  });

  it('ignores the database is_current flag in favour of version order', () => {
    const { notes } = mergePatchNotes({
      database: [note('v1.0.0', { id: 1, is_current: true }), note('v1.5.0', { id: 2 })],
    });
    expect(notes.find((n) => n.is_current).version).toBe('v1.5.0');
  });

  it('skips entries without a version or title', () => {
    const { notes } = mergePatchNotes({
      manual: [{ title: 'No version' }, { version: 'v1.0.0' }, note('v1.1.0')],
    });
    expect(notes.map((n) => n.version)).toEqual(['v1.1.0']);
  });

  it('works with no input at all', () => {
    expect(mergePatchNotes()).toEqual({ notes: [], shadowed: [] });
  });
});

describe('findManualNote', () => {
  it('matches regardless of how the version is spelled', () => {
    const manual = [note('v1.4.0')];
    expect(findManualNote('1.4', manual)).toBe(manual[0]);
    expect(findManualNote('v9.9.9', manual)).toBeNull();
  });
});

// Guards the committed changelog itself, so a typo fails the test run rather
// than breaking the landing page.
describe('MANUAL_PATCH_NOTES', () => {
  it('has unique, parseable versions', () => {
    const keys = MANUAL_PATCH_NOTES.map((n) => {
      expect(parseVersion(n.version), n.version).not.toBeNull();
      return versionKey(n.version);
    });
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('gives every release a readable date, title and at least one change', () => {
    for (const release of MANUAL_PATCH_NOTES) {
      expect(Number.isNaN(Date.parse(release.date)), `${release.version} date`).toBe(false);
      expect(release.title.length, `${release.version} title`).toBeLessThanOrEqual(70);
      expect(release.changes.length, `${release.version} changes`).toBeGreaterThan(0);
    }
  });

  it('uses known change tags and keeps each line short', () => {
    for (const release of MANUAL_PATCH_NOTES) {
      for (const change of release.changes) {
        expect(CHANGE_TYPES, `${release.version}: ${change.type}`).toContain(change.type);
        expect(change.text.length, `${release.version}: ${change.text}`).toBeLessThanOrEqual(120);
      }
    }
  });
});
