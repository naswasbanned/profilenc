/**
 * Patch notes: one release timeline, two sources.
 *
 *   code       Entries in server/src/data/patchNotes.js, committed alongside
 *              the release they describe. Read only in the admin console.
 *   dashboard  Rows in the patch_notes table, published from the admin
 *              console at /admin without a deploy.
 *
 * Both sources are merged into a single list here. When the same version
 * exists in both, the code entry wins and the database row is reported as
 * shadowed, so the admin console can surface it instead of silently hiding
 * it. Nothing is ever deleted automatically.
 *
 * The list is ordered by version, newest first. The newest release is always
 * the current one and is labelled LATEST UPDATE; any older release that still
 * carries that label is shown as a plain UPDATE, so the timeline never claims
 * two "latest" releases.
 *
 * Pure functions only, with no Node APIs: the frontend imports this module
 * too, to render the code entries before the API responds and as a fallback
 * when it is unreachable.
 */

export const PATCH_SOURCES = Object.freeze({ CODE: 'code', DASHBOARD: 'dashboard' });

export const LATEST_STATUS = 'LATEST UPDATE';
export const DEFAULT_STATUS = 'UPDATE';

/** Change tags the landing board and the admin console know how to style. */
export const CHANGE_TYPES = Object.freeze(['NEW', 'IMPROVED', 'FIXED', 'SYSTEM', 'STUDIO', 'CRITICAL']);

/**
 * Parse "v1.2.3", "1.2.3", "v1.2" or "1" into [major, minor, patch].
 * @returns {number[] | null} null when the string is not a version number.
 */
export function parseVersion(version) {
  const match = String(version ?? '')
    .trim()
    .match(/^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?$/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2] || 0), Number(match[3] || 0)];
}

/**
 * Identity used to match releases across sources, so "1.2.0", "v1.2" and
 * "V1.2.0" all count as the same release.
 */
export function versionKey(version) {
  const parts = parseVersion(version);
  return parts ? `v${parts.join('.')}` : String(version ?? '').trim().toLowerCase();
}

function dateValue(date) {
  const time = Date.parse(date);
  return Number.isNaN(time) ? 0 : time;
}

/** Sort comparator: highest version first, then latest date, then order_num. */
export function compareNewestFirst(a, b) {
  const versionA = parseVersion(a.version);
  const versionB = parseVersion(b.version);

  if (versionA && versionB) {
    for (let i = 0; i < 3; i += 1) {
      if (versionA[i] !== versionB[i]) return versionB[i] - versionA[i];
    }
  }

  const byDate = dateValue(b.date) - dateValue(a.date);
  if (byDate !== 0) return byDate;

  return (a.order_num ?? 0) - (b.order_num ?? 0);
}

/** Accept changes as an array or a JSON string; drop empty or malformed items. */
export function normalizeChanges(changes) {
  let list = changes;
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list);
    } catch {
      list = [];
    }
  }
  if (!Array.isArray(list)) return [];

  return list
    .filter((item) => item && typeof item.text === 'string' && item.text.trim())
    .map((item) => {
      const type = String(item.type || 'NEW').trim().toUpperCase();
      return { type: type || 'NEW', text: item.text.trim() };
    });
}

function toNote(raw, source) {
  const note = {
    version: String(raw?.version ?? '').trim(),
    status: String(raw?.status ?? '').trim(),
    date: String(raw?.date ?? '').trim(),
    codename: String(raw?.codename ?? '').trim(),
    title: String(raw?.title ?? '').trim(),
    changes: normalizeChanges(raw?.changes),
    source,
  };
  // Database rows keep their id so the admin console can edit or delete them.
  if (raw?.id !== undefined && raw?.id !== null) note.id = raw.id;
  return note;
}

/**
 * Merge code and database releases into one timeline.
 *
 * @param {{ manual?: object[], database?: object[] }} sources
 * @returns {{ notes: object[], shadowed: object[] }}
 *   notes     Public timeline, newest first. Each note has `source` and
 *             `is_current`, and a normalised `status`.
 *   shadowed  Database rows hidden because a release with the same version
 *             already exists. Each has `shadowedBy` set to the winning source.
 */
export function mergePatchNotes({ manual = [], database = [] } = {}) {
  const byKey = new Map();
  const shadowed = [];

  const add = (raw, source) => {
    const note = toNote(raw, source);
    if (!note.version || !note.title) return;

    const key = versionKey(note.version);
    const existing = byKey.get(key);
    if (existing) {
      // Code entries are listed first, so a clash always shadows the later
      // database row. Two code entries with one version keep the first.
      if (source === PATCH_SOURCES.DASHBOARD) {
        shadowed.push({ ...note, shadowedBy: existing.source });
      }
      return;
    }
    byKey.set(key, note);
  };

  manual.forEach((raw) => add(raw, PATCH_SOURCES.CODE));
  database.forEach((raw) => add(raw, PATCH_SOURCES.DASHBOARD));

  const notes = [...byKey.values()].sort(compareNewestFirst).map((note, index) => {
    const isCurrent = index === 0;
    let status = note.status || DEFAULT_STATUS;
    if (isCurrent) {
      status = LATEST_STATUS;
    } else if (status.toUpperCase() === LATEST_STATUS) {
      status = DEFAULT_STATUS;
    }
    return { ...note, status, is_current: isCurrent };
  });

  return { notes, shadowed };
}

/** The code entry for a version, if one exists. */
export function findManualNote(version, manual = []) {
  const key = versionKey(version);
  return manual.find((note) => versionKey(note.version) === key) || null;
}
