/** Paper looks offered by "Save as image"; ids map to `.journal-paper.is-<id>`. */
export const PAPER_STYLES = [
  { id: 'notebook', label: 'Notebook', swatch: '#fbf7ee' },
  { id: 'typewriter', label: 'Typewriter', swatch: '#ffffff' },
  { id: 'midnight', label: 'Midnight', swatch: '#151821' },
];

export const PAPER_STYLE_KEY = 'profilenc_journal_paper';

/** Last paper style the visitor picked, or the first one if unknown or unavailable. */
export function readPaperStyle(storage = globalThis.localStorage) {
  try {
    const saved = storage?.getItem(PAPER_STYLE_KEY);
    if (PAPER_STYLES.some((s) => s.id === saved)) return saved;
  } catch {
    // Storage can throw in private mode or when blocked; fall through to the default
  }
  return PAPER_STYLES[0].id;
}

/** Public profile paths: `/@user` and `/@user/journal/<id>` (the `@` is optional). */
const PROFILE_PATH = /^\/@?[^/]+(?:\/journal\/([^/]+))?\/?$/;

/** True when the address bar may be rewritten for journal entry links. */
export function isProfilePath(pathname) {
  return PROFILE_PATH.test(pathname || '');
}

/** Entry id from `/@user/journal/<id>`, or null. */
export function entryIdFromPath(pathname) {
  const id = (pathname || '').match(PROFILE_PATH)?.[1];
  return id ? decodeURIComponent(id) : null;
}

/** Id of the tab holding a journal entry, or null. */
export function findTabWithEntry(content, entryId) {
  if (!entryId) return null;
  for (const tab of content?.tabs || []) {
    for (const block of tab.blocks || []) {
      if (block.type === 'journal' && (block.data?.items || []).some((e) => e?.id === entryId)) {
        return tab.id;
      }
    }
  }
  return null;
}

/** Absolute link to one journal entry, e.g. https://site/@nas/journal/entry-1. */
export function entryShareUrl(origin, username, entryId) {
  const user = String(username || '').replace(/^@/, '');
  return `${String(origin || '').replace(/\/+$/, '')}/@${user}/journal/${encodeURIComponent(entryId)}`;
}
