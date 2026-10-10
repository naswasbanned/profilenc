/**
 * Link-preview (Open Graph / Twitter Card) HTML for profile and journal entry
 * links. Served only to preview bots by nginx; see routes/og.js.
 */

const SITE_NAME = 'Profilenc';
const DEFAULT_IMAGE = '/og-default.png';
const DEFAULT_DESCRIPTION = 'A clean, customizable personal profile page built with modular blocks.';

/** Escape text for an HTML attribute or text node. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Plain-text summary: strips markdown markers, collapses whitespace, clips on a word. */
export function summarize(text, max = 160) {
  const plain = String(text || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(?:#{1,6}|>|[-*+]|\d+\.)\s+/gm, '') // block markers only at line start
    .replace(/^\s*(?:---|\*\*\*|___)\s*$/gm, ' ')
    .replace(/(\*\*|__|~~|`|\*)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : cut.length)}…`;
}

/** Absolute http(s) URL for an image, or null. Relative paths resolve against the site origin. */
export function absoluteImage(url, origin) {
  if (!url || typeof url !== 'string') return null;
  try {
    const resolved = new URL(url, origin);
    return resolved.protocol === 'http:' || resolved.protocol === 'https:' ? resolved.href : null;
  } catch {
    return null;
  }
}

/**
 * @param {object} meta
 * @param {string} meta.origin      e.g. https://profilenc.example
 * @param {string} meta.path        canonical path, e.g. /@nas
 * @param {string} [meta.title]
 * @param {string} [meta.description]
 * @param {string} [meta.image]     any URL; resolved and validated here
 * @param {string} [meta.type]      og:type
 */
export function renderOgHtml({ origin, path, title, description, image, type = 'website' }) {
  const url = new URL(path || '/', origin).href;
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESCRIPTION;
  const img = absoluteImage(image, origin) || new URL(DEFAULT_IMAGE, origin).href;
  const t = escapeHtml(fullTitle);
  const d = escapeHtml(desc);
  const u = escapeHtml(url);
  const i = escapeHtml(img);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${u}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:type" content="${escapeHtml(type)}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${u}">
<meta property="og:image" content="${i}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${i}">
</head>
<body><p><a href="${u}">${t}</a></p></body>
</html>`;
}

/** Find a journal entry by id anywhere in modular profile content. */
export function findJournalEntry(content, entryId) {
  for (const tab of content?.tabs || []) {
    for (const block of tab?.blocks || []) {
      if (block?.type !== 'journal' || block.hidden) continue;
      const entry = (block.data?.items || []).find((e) => e?.id === entryId);
      if (entry) return entry;
    }
  }
  return null;
}
