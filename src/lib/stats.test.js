import { describe, expect, it } from 'vitest';
import { clickTarget } from './stats';

// Minimal stand-in for DOM nodes: closest() walks parents matching a tag or attribute
function node(tag, attrs = {}, parent = null) {
  return {
    tag,
    attrs,
    parent,
    getAttribute: (name) => attrs[name] ?? null,
    closest(selector) {
      const match = (n) => (selector === 'a[href]' ? n.tag === 'a' && 'href' in n.attrs : selector === '[data-block-id]' && 'data-block-id' in n.attrs);
      for (let n = this; n; n = n.parent) if (match(n)) return n;
      return null;
    },
  };
}

describe('clickTarget', () => {
  it('reports the link and its block, from a nested click', () => {
    const section = node('section', { 'data-block-id': 'b7' });
    const link = node('a', { href: 'https://x.y/a' }, section);
    expect(clickTarget(node('span', {}, link))).toBe('block:b7|https://x.y/a');
  });

  it('uses "page" outside blocks and ignores non-links and hash links', () => {
    expect(clickTarget(node('a', { href: '/' }))).toBe('block:page|/');
    expect(clickTarget(node('a', { href: '#top' }))).toBe(null);
    expect(clickTarget(node('button'))).toBe(null);
    expect(clickTarget(null)).toBe(null);
  });
});
