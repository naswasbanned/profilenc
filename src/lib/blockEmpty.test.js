import { describe, it, expect } from 'vitest';
import { isBlockEmpty, isTabEmpty } from './blockEmpty';

describe('isBlockEmpty', () => {
  it('flags list blocks without items', () => {
    expect(isBlockEmpty({ type: 'gallery', data: {} })).toBe(true);
    expect(isBlockEmpty({ type: 'gallery', data: { items: [] } })).toBe(true);
    expect(isBlockEmpty({ type: 'gallery', data: { items: [{}] } })).toBe(false);
  });

  it('uses the per-type data key', () => {
    expect(isBlockEmpty({ type: 'stacked_deck', data: { images: [] } })).toBe(true);
    expect(isBlockEmpty({ type: 'stacked_deck', data: { images: ['a.png'] } })).toBe(false);
    expect(isBlockEmpty({ type: 'music_player', data: { embedUrl: 'x' } })).toBe(false);
    expect(isBlockEmpty({ type: 'featured_video', data: { title: 'Hi' } })).toBe(false);
    expect(isBlockEmpty({ type: 'github_heatmap', data: {} })).toBe(true);
  });

  it('never hides blocks it does not know', () => {
    expect(isBlockEmpty({ type: 'hero', data: {} })).toBe(false);
    expect(isBlockEmpty(undefined)).toBe(false);
  });
});

describe('isTabEmpty', () => {
  it('is empty when every block is empty or hidden', () => {
    expect(isTabEmpty({ blocks: [] })).toBe(true);
    expect(isTabEmpty({ blocks: [{ type: 'gallery', data: {} }, { type: 'hero', hidden: true, data: {} }] })).toBe(true);
  });
  it('is not empty when one block has content', () => {
    expect(isTabEmpty({ blocks: [{ type: 'gallery', data: {} }, { type: 'hero', data: {} }] })).toBe(false);
  });
});
