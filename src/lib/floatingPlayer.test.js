import { describe, expect, it } from 'vitest';
import {
  FLOAT_SIZE_DEFAULT,
  FLOAT_SIZE_MAX,
  FLOAT_SIZE_MIN,
  floatingClassName,
  floatingStyle,
  resolveFloatPlacement,
  resolveFloatSize,
} from './floatingPlayer';
import { clampToRange, parseDraft } from './rangeValue';

describe('resolveFloatPlacement', () => {
  it('passes valid values through', () => {
    for (const edge of ['top', 'left', 'right']) {
      for (const align of ['start', 'center', 'end']) {
        expect(resolveFloatPlacement(edge, align)).toEqual({ edge, align });
      }
    }
  });

  it('falls back to right/center for garbage', () => {
    const def = { edge: 'right', align: 'center' };
    expect(resolveFloatPlacement()).toEqual(def);
    expect(resolveFloatPlacement(null, null)).toEqual(def);
    expect(resolveFloatPlacement(5, {})).toEqual(def);
    expect(resolveFloatPlacement('bottom', 'middle')).toEqual(def);
  });

  it('normalizes each field independently', () => {
    expect(resolveFloatPlacement('left', 'nope')).toEqual({ edge: 'left', align: 'center' });
    expect(resolveFloatPlacement('nope', 'end')).toEqual({ edge: 'right', align: 'end' });
  });
});

describe('resolveFloatSize', () => {
  it('maps legacy keys to pixels', () => {
    expect(resolveFloatSize('sm')).toBe(70);
    expect(resolveFloatSize('md')).toBe(90);
    expect(resolveFloatSize('lg')).toBe(120);
    expect(resolveFloatSize('xl')).toBe(150);
  });

  it('passes valid numbers and numeric strings through', () => {
    expect(resolveFloatSize(100)).toBe(100);
    expect(resolveFloatSize('120')).toBe(120);
  });

  it('clamps to the range', () => {
    expect(resolveFloatSize(10)).toBe(FLOAT_SIZE_MIN);
    expect(resolveFloatSize(999)).toBe(FLOAT_SIZE_MAX);
    expect(resolveFloatSize('1000')).toBe(FLOAT_SIZE_MAX);
  });

  it('rounds to the step', () => {
    expect(resolveFloatSize(91)).toBe(92);
    expect(resolveFloatSize(90.4)).toBe(90);
  });

  it('falls back to the default for garbage', () => {
    for (const v of [undefined, null, {}, [], 'huge', 'XL', '', '  ', NaN, Infinity, 'toString']) {
      expect(resolveFloatSize(v)).toBe(FLOAT_SIZE_DEFAULT);
    }
  });
});

describe('floatingClassName / floatingStyle', () => {
  it('builds the class string', () => {
    expect(floatingClassName('left', 'end')).toBe('floating-vinyl edge-left align-end');
    expect(floatingClassName(undefined, undefined)).toBe('floating-vinyl edge-right align-center');
  });

  it('emits desktop size variables', () => {
    expect(floatingStyle(90)).toEqual({ '--fv-desktop-size': '90px', '--fv-desktop-scale': '0.5' });
    expect(floatingStyle('xl')['--fv-desktop-size']).toBe('150px');
    expect(floatingStyle(undefined)['--fv-desktop-size']).toBe('90px');
  });
});

describe('rangeValue', () => {
  it('clamps and rounds', () => {
    expect(clampToRange(5, 10, 20, 2)).toBe(10);
    expect(clampToRange(25, 10, 20, 2)).toBe(20);
    expect(clampToRange(13, 10, 20, 2)).toBe(14);
    expect(clampToRange('abc', 10, 20)).toBeNull();
  });

  it('parses drafts', () => {
    expect(parseDraft('', 10, 20)).toBeNull();
    expect(parseDraft('  ', 10, 20)).toBeNull();
    expect(parseDraft('15', 10, 20)).toBe(15);
    expect(parseDraft('x', 10, 20)).toBeNull();
    expect(parseDraft('99', 10, 20)).toBe(20);
  });
});
