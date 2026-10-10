/**
 * SVG layouts for generated link-preview cards (1200x630). Pure string
 * building so it can be unit tested; routes/ogImage.js rasterises with sharp.
 * Fonts come from the system (fonts-dejavu-core in the server image).
 */

export const CARD_W = 1200;
export const CARD_H = 630;
const DEFAULT_ACCENT = '#e96d52';
const SANS = "'DejaVu Sans', 'Liberation Sans', sans-serif";
const SERIF = "'DejaVu Serif', 'Liberation Serif', Georgia, serif";
const MONO = "'DejaVu Sans Mono', 'Liberation Mono', monospace";

export function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Only `#rgb` / `#rrggbb` reach the SVG; anything else falls back to the house coral. */
export function safeAccent(value) {
  return typeof value === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
    ? value.trim()
    : DEFAULT_ACCENT;
}

/** Shorten to `max` characters on a word boundary, with an ellipsis. */
export function clip(text, max) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/**
 * Greedy word wrap by character count (good enough for a fixed-size card).
 * The last line is clipped so text never runs past `maxLines`.
 */
export function wrap(text, perLine, maxLines) {
  const words = String(text || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (next.length <= perLine) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    line = words[i];
    if (lines.length === maxLines - 1) {
      lines.push(clip(words.slice(i).join(' '), perLine));
      return lines;
    }
  }
  if (line) lines.push(clip(line, perLine));
  return lines.slice(0, maxLines);
}

const tspans = (lines, x, lineHeight) =>
  lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`).join('');

/**
 * Profile card. The avatar (if any) is composited by the caller into the
 * circle at AVATAR_BOX, so the SVG only draws the ring and an initial fallback.
 */
export const AVATAR_BOX = { left: 96, top: 150, size: 240 };

export function profileCardSvg({ displayName, username, bio, accent, hasAvatar }) {
  const a = safeAccent(accent);
  // Without a display name the handle line below already says @username
  const name = displayName || username;
  const nameLines = wrap(name, 22, 2);
  const bioLines = wrap(bio, 46, 2);
  const { left, top, size } = AVATAR_BOX;
  const cx = left + size / 2;
  const cy = top + size / 2;
  const initial = escapeXml((name[0] || 'P').toUpperCase());
  const textX = 400;
  const nameY = nameLines.length > 1 ? 210 : 250;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}">
  <rect width="${CARD_W}" height="${CARD_H}" fill="#fbf7ee"/>
  <rect x="0" y="0" width="${CARD_W}" height="14" fill="${a}"/>
  <rect x="36" y="44" width="1128" height="550" rx="20" fill="none" stroke="#252320" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="${size / 2 + 8}" fill="${a}"/>
  ${hasAvatar ? '' : `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="#252320"/>
  <text x="${cx}" y="${cy + 38}" text-anchor="middle" font-family="${SANS}" font-size="110" font-weight="700" fill="#fbf7ee">${initial}</text>`}
  <text x="${textX}" y="${nameY}" font-family="${SERIF}" font-size="64" font-weight="700" fill="#1d1a16">${tspans(nameLines, textX, 74)}</text>
  <text x="${textX}" y="${nameY + (nameLines.length - 1) * 74 + 60}" font-family="${MONO}" font-size="30" fill="${a}">@${escapeXml(username)}</text>
  <text x="${textX}" y="${nameY + (nameLines.length - 1) * 74 + 130}" font-family="${SANS}" font-size="30" fill="#5d564b">${tspans(bioLines, textX, 42)}</text>
  <text x="1124" y="560" text-anchor="end" font-family="${MONO}" font-size="24" font-weight="700" fill="#252320">PROFILENC</text>
  <rect x="968" y="539" width="14" height="14" fill="${a}"/>
</svg>`;
}

/**
 * Journal entry card on notebook paper. When `hasCover` the right side is
 * left for the cover, composited by the caller at COVER_BOX.
 */
export const COVER_BOX = { left: 760, top: 110, width: 360, height: 400 };

export function entryCardSvg({ title, excerpt, author, date, accent, hasCover }) {
  const a = safeAccent(accent);
  const width = hasCover ? 28 : 40;
  const titleLines = wrap(title || 'Journal entry', width - 6, 3);
  const excerptLines = wrap(excerpt, hasCover ? 44 : 62, 3);
  const x = 150;
  const titleY = 200;
  const excerptY = titleY + (titleLines.length - 1) * 66 + 70;
  const ruled = Array.from({ length: 17 }, (_, i) => `<line x1="0" x2="${CARD_W}" y1="${60 + i * 34}" y2="${60 + i * 34}" stroke="#5678a8" stroke-opacity="0.16"/>`).join('');
  const { left, top, width: cw, height: ch } = COVER_BOX;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}">
  <rect width="${CARD_W}" height="${CARD_H}" fill="#fbf7ee"/>
  ${ruled}
  <line x1="118" x2="118" y1="0" y2="${CARD_H}" stroke="#d65448" stroke-opacity="0.45" stroke-width="2"/>
  <circle cx="60" cy="150" r="14" fill="#2b2620"/><circle cx="60" cy="315" r="14" fill="#2b2620"/><circle cx="60" cy="480" r="14" fill="#2b2620"/>
  <rect x="${hasCover ? 420 : 520}" y="-6" width="170" height="40" fill="${a}" fill-opacity="0.55" transform="rotate(-2 ${hasCover ? 505 : 605} 14)"/>
  <text x="${x}" y="120" font-family="${MONO}" font-size="22" font-weight="700" letter-spacing="3" fill="${a}">${escapeXml(clip(date || 'JOURNAL', 24).toUpperCase())}</text>
  <text x="${x}" y="${titleY}" font-family="${SERIF}" font-size="56" font-weight="700" fill="#1d1a16">${tspans(titleLines, x, 66)}</text>
  <text x="${x}" y="${excerptY}" font-family="${SERIF}" font-size="28" font-style="italic" fill="#4a443b">${tspans(excerptLines, x, 40)}</text>
  ${hasCover ? `<rect x="${left - 10}" y="${top - 10}" width="${cw + 20}" height="${ch + 20}" fill="#ffffff"/>` : ''}
  <line x1="${x}" x2="${hasCover ? 700 : 1100}" y1="548" y2="548" stroke="#d8ccb4" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="${x}" y="590" font-family="${MONO}" font-size="24" font-weight="700" fill="#252320">PROFILENC</text>
  <text x="${hasCover ? 700 : 1100}" y="590" text-anchor="end" font-family="${SERIF}" font-size="28" font-style="italic" fill="#2b2722">— ${escapeXml(clip(author, 30))}</text>
</svg>`;
}
