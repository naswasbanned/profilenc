import { describe, expect, it } from 'vitest';
import { escapeHtml, summarize, absoluteImage, renderOgHtml, findJournalEntry } from './og.js';

const origin = 'https://profilenc.test';

describe('escapeHtml', () => {
  it('neutralises markup and quotes', () => {
    expect(escapeHtml('"><script>alert(1)</script>&\'')).toBe('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;&amp;&#39;');
    expect(escapeHtml(null)).toBe('');
  });
});

describe('summarize', () => {
  it('strips markdown and clips on a word', () => {
    expect(summarize('## Hello **world** and [a link](https://x.y)')).toBe('Hello world and a link');
    expect(summarize('Full-stack dev, a > b\n- item one\n> quoted\n---')).toBe('Full-stack dev, a > b item one quoted');
    const long = summarize('word '.repeat(100), 40);
    expect(long.length).toBeLessThanOrEqual(40);
    expect(long.endsWith('…')).toBe(true);
  });
});

describe('absoluteImage', () => {
  it('resolves relative paths and rejects non-http schemes', () => {
    expect(absoluteImage('/uploads/a.webp', origin)).toBe(`${origin}/uploads/a.webp`);
    expect(absoluteImage('https://cdn.test/a.png', origin)).toBe('https://cdn.test/a.png');
    expect(absoluteImage('javascript:alert(1)', origin)).toBe(null);
    expect(absoluteImage('', origin)).toBe(null);
  });
});

describe('renderOgHtml', () => {
  it('escapes user text into every tag', () => {
    const html = renderOgHtml({ origin, path: '/@nas', title: 'Nas "><script>x</script>', description: '<b>bio</b>' });
    expect(html).not.toContain('<script>x');
    expect(html).not.toContain('<b>bio');
    expect(html).toContain('og:title" content="Nas &quot;&gt;&lt;script&gt;');
    expect(html).toContain(`og:url" content="${origin}/@nas"`);
  });

  it('falls back to the default image and description', () => {
    const html = renderOgHtml({ origin, path: '/@nas', image: 'javascript:x' });
    expect(html).toContain(`og:image" content="${origin}/og-default.png"`);
    expect(html).toContain('og:description" content="A clean');
    expect(html).toContain('<title>Profilenc</title>');
  });
});

describe('findJournalEntry', () => {
  const content = { tabs: [{ blocks: [
    { type: 'journal', hidden: true, data: { items: [{ id: 'h' }] } },
    { type: 'journal', data: { items: [{ id: 'e1', title: 'One' }] } },
  ] }] };
  it('finds visible entries only', () => {
    expect(findJournalEntry(content, 'e1').title).toBe('One');
    expect(findJournalEntry(content, 'h')).toBe(null);
    expect(findJournalEntry(content, 'nope')).toBe(null);
    expect(findJournalEntry(undefined, 'e1')).toBe(null);
  });
});
