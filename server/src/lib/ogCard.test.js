import { describe, expect, it } from 'vitest';
import { escapeXml, safeAccent, clip, wrap, profileCardSvg, entryCardSvg } from './ogCard.js';

describe('ogCard helpers', () => {
  it('escapes XML', () => {
    expect(escapeXml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&apos;&amp;&apos;&lt;/a&gt;');
  });

  it('only allows hex accents', () => {
    expect(safeAccent('#2b4bff')).toBe('#2b4bff');
    expect(safeAccent('#abc')).toBe('#abc');
    expect(safeAccent('red"/><script>')).toBe('#e96d52');
    expect(safeAccent(undefined)).toBe('#e96d52');
  });

  it('clips on a word', () => {
    expect(clip('short', 10)).toBe('short');
    const c = clip('one two three four five six', 15);
    expect(c.length).toBeLessThanOrEqual(15);
    expect(c.endsWith('…')).toBe(true);
  });

  it('wraps into at most maxLines, clipping the last', () => {
    const lines = wrap('alpha beta gamma delta epsilon zeta eta theta iota kappa', 12, 2);
    expect(lines).toHaveLength(2);
    expect(lines.every((l) => l.length <= 12)).toBe(true);
    expect(lines[1].endsWith('…')).toBe(true);
    expect(wrap('', 10, 2)).toEqual([]);
  });
});

describe('card SVGs', () => {
  it('escape user text and sanitise the accent', () => {
    const svg = profileCardSvg({ displayName: 'Nas <script>', username: 'nas', bio: 'a & b', accent: 'url(evil)', hasAvatar: false });
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('Nas &lt;script&gt;');
    expect(svg).toContain('a &amp; b');
    expect(svg).not.toContain('evil');
    expect(svg).toContain('#e96d52');
  });

  it('draws the initial only without an avatar', () => {
    expect(profileCardSvg({ username: 'nas', hasAvatar: false })).toContain('>N</text>');
    expect(profileCardSvg({ username: 'nas', hasAvatar: true })).not.toContain('>N</text>');
  });

  it('leaves room for a cover on entry cards', () => {
    const withCover = entryCardSvg({ title: 'T', excerpt: 'E', author: '@nas', date: '2026-10-09', hasCover: true });
    const without = entryCardSvg({ title: 'T', excerpt: 'E', author: '@nas', date: '2026-10-09', hasCover: false });
    expect(withCover).toContain('fill="#ffffff"');
    expect(without).not.toContain('fill="#ffffff"');
    expect(withCover).toContain('2026-10-09');
  });
});
