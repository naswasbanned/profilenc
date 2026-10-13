/**
 * Upload size limits shared by the browser. Constants only, no imports, so the
 * LandingPage entry chunk can use it without pulling in the image editor.
 */

/** Matches MAX_PUBLIC_UPLOAD_BYTES in server/src/middleware/upload.js. */
export const MAX_SUGGESTION_IMAGE_BYTES = 2 * 1024 * 1024;

export function isWithinSuggestionLimit(size) {
  return Number.isFinite(size) && size <= MAX_SUGGESTION_IMAGE_BYTES;
}
