import { query } from '../config/db.js';
import { MANUAL_PATCH_NOTES } from '../data/patchNotes.js';
import { findManualNote, mergePatchNotes } from '../lib/patchNotes.js';

/**
 * Release timeline, merged from the code changelog and the patch_notes table.
 * The merge rules live in lib/patchNotes.js.
 *
 * @returns {Promise<{ notes: object[], shadowed: object[] }>}
 */
export async function loadPatchNotes() {
  const { rows } = await query(
    'SELECT id, version, status, date, codename, title, changes, order_num, created_at, updated_at FROM patch_notes'
  );
  return mergePatchNotes({ manual: MANUAL_PATCH_NOTES, database: rows });
}

/** Timeline from the code changelog alone, for when the database is down. */
export function codeOnlyPatchNotes() {
  return mergePatchNotes({ manual: MANUAL_PATCH_NOTES });
}

/** The code changelog entry for a version, or null. */
export function codeReleaseFor(version) {
  return findManualNote(version, MANUAL_PATCH_NOTES);
}
