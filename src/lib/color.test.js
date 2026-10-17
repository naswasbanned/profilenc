import { describe, it, expect } from 'vitest';
import { parseColor, readableOn, contrastRatio, isLightColor } from './color';

describe('parseColor', () => {
  it('reads hex in 3, 6 and 8 digit forms', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('#e96d52')).toEqual({ r: 233, g: 109, b: 82, a: 1 });
    expect(parseColor('#00000080').a).toBeCloseTo(0.5, 1);
  });

  it('reads rgb and rgba', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 });
    expect(parseColor('rgba(255, 250, 240, 0.96)').a).toBeCloseTo(0.96);
  });

  it('returns null for anything it cannot read', () => {
    expect(parseColor('color-mix(in srgb, red 50%, blue)')).toBeNull();
    expect(parseColor('var(--x)')).toBeNull();
    expect(parseColor('')).toBeNull();
    expect(parseColor(null)).toBeNull();
  });
});

describe('isLightColor', () => {
  it('classifies paper and ink backgrounds', () => {
    expect(isLightColor('#f5efdf')).toBe(true);
    expect(isLightColor('#eef0f8')).toBe(true);
    expect(isLightColor('#090a0f')).toBe(false);
    expect(isLightColor('#0a0714')).toBe(false);
    expect(isLightColor('linear-gradient(red, blue)')).toBeNull();
  });
});

describe('readableOn', () => {
  it('picks dark text on light backgrounds and light text on dark ones', () => {
    expect(readableOn('#fffaf0')).toBe('#17171a');
    expect(readableOn('#ffdd00')).toBe('#17171a');
    expect(readableOn('#090a0f')).toBe('#ffffff');
    expect(readableOn('#252320')).toBe('#ffffff');
  });

  it('blends a translucent background over the base before choosing', () => {
    expect(readableOn('rgba(0, 0, 0, 0.05)', '#ffffff')).toBe('#17171a');
    expect(readableOn('rgba(0, 0, 0, 0.05)', '#000000')).toBe('#ffffff');
  });

  it('returns null for an unparsable background', () => {
    expect(readableOn('color-mix(in srgb, red 10%, white)')).toBeNull();
  });

  it('always picks the better of the two text colors (never worse than 4.2:1)', () => {
    // Mid-luminance accents like #8b5cf6 are the worst case for a two-color choice
    ['#e96d52', '#00f0aa', '#f472b6', '#8b5cf6', '#ffdd00', '#17171a', '#ffffff'].forEach((bg) => {
      const text = readableOn(bg);
      expect(contrastRatio(parseColor(bg), parseColor(text))).toBeGreaterThanOrEqual(4.2);
    });
  });
});
