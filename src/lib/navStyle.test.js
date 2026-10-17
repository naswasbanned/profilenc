import { describe, it, expect } from 'vitest';
import {
  NAV_LOOKS,
  NAV_RESET_PATHS,
  resolveNav,
  resolveLook,
  isBakedNavValue,
  hasNavCustomization,
} from './navStyle';
import { parseColor, contrastRatio } from './color';

const fieldNotes = {
  designStyle: 'field-notes',
  backgroundColor: '#f5efdf',
  cardBackground: '#fffaf0',
  cardBorder: '#d7ccb8',
  headingColor: '#252320',
  textColorMuted: '#746e63',
  accentColor: '#e96d52',
  glassBlur: 0,
};
const obsidian = {
  designStyle: 'obsidian',
  backgroundColor: '#090a0f',
  cardBackground: 'rgba(18, 21, 30, 0.82)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  headingColor: '#ffffff',
  textColorMuted: '#8b949e',
  accentColor: '#00f0aa',
  glassBlur: 12,
};
const neo = {
  designStyle: 'neo-brutalist',
  backgroundColor: '#fafafa',
  cardBackground: '#ffffff',
  cardBorder: '#000000',
  headingColor: '#000000',
  textColorMuted: '#444444',
  accentColor: '#ffdd00',
  glassBlur: 0,
};

const theme = (global) => ({ global });

describe('resolveLook (Auto)', () => {
  it('maps designs to a look and falls back to pills', () => {
    expect(resolveLook(theme(fieldNotes))).toBe('tactile');
    expect(resolveLook(theme(neo))).toBe('brutal');
    expect(resolveLook(theme({ designStyle: 'press-mono' }))).toBe('underline');
    expect(resolveLook(theme(obsidian))).toBe('pills');
    expect(resolveLook(theme({ designStyle: 'something-new' }))).toBe('pills');
    expect(resolveLook({})).toBe('pills');
  });

  it('honors an explicit look and ignores an unknown one', () => {
    expect(resolveLook(theme({ ...obsidian, nav: { look: 'brutal' } }))).toBe('brutal');
    expect(resolveLook(theme({ ...obsidian, nav: { look: 'nonsense' } }))).toBe('pills');
  });
});

describe('resolveNav tokens', () => {
  const required = [
    '--nav-bar-bg', '--nav-bar-border', '--nav-bar-blur', '--nav-arrow-bg',
    '--nav-tab-bg', '--nav-tab-text', '--nav-tab-border', '--nav-tab-radius', '--nav-tab-border-w', '--nav-tab-weight',
    '--nav-hover-bg', '--nav-hover-text', '--nav-hover-border', '--nav-hover-shadow', '--nav-hover-lift',
    '--nav-active-bg', '--nav-active-text', '--nav-active-border', '--nav-active-shadow', '--nav-accent',
  ];

  it('defines every token for every design and every look, with no empty value', () => {
    [fieldNotes, obsidian, neo].forEach((g) => {
      NAV_LOOKS.forEach((l) => {
        const { vars } = resolveNav(theme({ ...g, nav: { look: l.id } }));
        required.forEach((k) => {
          expect(vars[k], `${g.designStyle}/${l.id} ${k}`).toBeTruthy();
        });
      });
    });
  });

  it('emits layout attributes', () => {
    const { attrs } = resolveNav(theme({ ...fieldNotes, nav: { align: 'left', size: 'compact', bar: 'transparent' } }));
    expect(attrs).toEqual({
      'data-nav-look': 'tactile',
      'data-nav-align': 'left',
      'data-nav-size': 'compact',
      'data-nav-bar': 'transparent',
    });
  });

  it('survives a missing theme', () => {
    expect(() => resolveNav(undefined)).not.toThrow();
    expect(resolveNav({}).vars['--nav-accent']).toBeTruthy();
  });

  it('follows the theme: a new accent or background moves the bar', () => {
    const before = resolveNav(theme(obsidian)).vars;
    const accent = resolveNav(theme({ ...obsidian, accentColor: '#ff0066' })).vars;
    expect(accent['--nav-accent']).toBe('#ff0066');
    expect(accent['--nav-active-text']).not.toBe(before['--nav-active-text']);
    const bg = resolveNav(theme({ ...obsidian, backgroundColor: '#112233' })).vars;
    expect(bg['--nav-bar-bg']).toContain('#112233');
    expect(before['--nav-bar-bg']).not.toContain('#112233');
  });

  it('reproduces the Field Notes tab look: paper tab, bordered, coral active', () => {
    const { vars } = resolveNav(theme(fieldNotes));
    expect(vars['--nav-tab-bg']).toBe('#fffaf0');
    expect(vars['--nav-tab-border']).toBe('#d7ccb8');
    expect(vars['--nav-tab-border-w']).toBe('2px');
    expect(vars['--nav-active-bg']).toBe('#e96d52');
    expect(vars['--nav-hover-shadow']).toMatch(/^2px 2px 0 /);
  });

  it('prefers the paper color for active text only when it reads at 3:1, else a readable one', () => {
    // Cream on coral is 2.98:1, so the text switches to the dark ink for legibility
    const coral = resolveNav(theme(fieldNotes)).vars;
    expect(contrastRatio(parseColor('#e96d52'), parseColor(coral['--nav-active-text']))).toBeGreaterThanOrEqual(4.5);
    // A deep accent keeps the paper text
    const deep = resolveNav(theme({ ...fieldNotes, accentColor: '#7a2e1d' })).vars;
    expect(deep['--nav-active-text']).toBe('#fffaf0');
  });

  it('keeps dark themes tinted with an accent text, and picks readable text on light fills', () => {
    const dark = resolveNav(theme(obsidian)).vars;
    expect(dark['--nav-active-text']).toBe('#00f0aa');
    expect(dark['--nav-active-bg']).toContain('#00f0aa');
    const yellow = resolveNav(theme(neo)).vars;
    const bgColor = parseColor(yellow['--nav-active-bg']);
    const text = parseColor(yellow['--nav-active-text']);
    expect(contrastRatio(bgColor, text)).toBeGreaterThanOrEqual(4.5);
  });

  it('gives hover a theme-derived tint, never a fixed navy', () => {
    const { vars } = resolveNav(theme(fieldNotes));
    expect(vars['--nav-hover-bg']).toContain('#e96d52');
    expect(vars['--nav-hover-text']).toBe('#252320');
    Object.values(vars).forEach((v) => expect(v).not.toMatch(/181c28|18, ?28, ?40/i));
  });

  it('applies the accent override to hover and active', () => {
    const { vars } = resolveNav(theme({ ...fieldNotes, nav: { accent: '#3366ff' } }));
    expect(vars['--nav-accent']).toBe('#3366ff');
    expect(vars['--nav-active-bg']).toBe('#3366ff');
    expect(vars['--nav-hover-bg']).toContain('#3366ff');
  });

  it('underline and minimal use the active color as an indicator instead of a fill', () => {
    const underline = resolveNav(theme({ ...obsidian, nav: { look: 'underline' } })).vars;
    expect(underline['--nav-active-bg']).toBe('transparent');
    expect(underline['--nav-active-shadow']).toContain('#00f0aa');
    const minimal = resolveNav(theme({ ...obsidian, nav: { look: 'minimal' } })).vars;
    expect(minimal['--nav-active-bg']).toBe('transparent');
    expect(minimal['--nav-active-text']).toBe('#00f0aa');
  });

  it('bar modes: auto follows glass blur, transparent clears the bar', () => {
    expect(resolveNav(theme(fieldNotes)).attrs['data-nav-bar']).toBe('solid');
    expect(resolveNav(theme(obsidian)).attrs['data-nav-bar']).toBe('glass');
    const clear = resolveNav(theme({ ...obsidian, nav: { bar: 'transparent' } })).vars;
    expect(clear['--nav-bar-bg']).toBe('transparent');
    expect(clear['--nav-bar-border']).toBe('transparent');
  });
});

describe('legacy tab colors', () => {
  it('ignores values an old preset baked in, so the bar follows the theme', () => {
    expect(isBakedNavValue('tabButtonBackground', '#FFFAF0')).toBe(true);
    expect(isBakedNavValue('tabNavBackground', 'rgba(255, 250, 240, 0.96)')).toBe(true);
    const baked = resolveNav(theme({ ...obsidian, tabButtonBackground: '#fffaf0', tabButtonActiveBackground: '#e96d52' })).vars;
    const clean = resolveNav(theme(obsidian)).vars;
    expect(baked).toEqual(clean);
  });

  it('honors a color the user really chose', () => {
    const { vars } = resolveNav(theme({
      ...obsidian,
      tabNavBackground: '#101820',
      tabButtonBackground: '#202830',
      tabButtonTextColor: '#aabbcc',
      tabButtonActiveBackground: '#ffcc00',
    }));
    expect(vars['--nav-bar-bg']).toBe('#101820');
    expect(vars['--nav-tab-bg']).toBe('#202830');
    expect(vars['--nav-tab-text']).toBe('#aabbcc');
    expect(vars['--nav-active-bg']).toBe('#ffcc00');
    expect(contrastRatio(parseColor('#ffcc00'), parseColor(vars['--nav-active-text']))).toBeGreaterThanOrEqual(4.5);
  });

  it('ignores the removed border and active-text keys', () => {
    const a = resolveNav(theme({ ...obsidian, tabNavBorder: '#123456', tabButtonBorder: '#654321', tabButtonActiveTextColor: '#abcdef' })).vars;
    expect(a).toEqual(resolveNav(theme(obsidian)).vars);
  });
});

describe('hasNavCustomization and reset paths', () => {
  it('detects choices and ignores defaults and baked values', () => {
    expect(hasNavCustomization(theme(obsidian))).toBe(false);
    expect(hasNavCustomization(theme({ ...obsidian, nav: { look: 'auto', align: 'center' } }))).toBe(false);
    expect(hasNavCustomization(theme({ ...obsidian, tabButtonBackground: '#fffaf0' }))).toBe(false);
    expect(hasNavCustomization(theme({ ...obsidian, nav: { look: 'brutal' } }))).toBe(true);
    expect(hasNavCustomization(theme({ ...obsidian, tabButtonTextColor: '#123456' }))).toBe(true);
  });

  it('reset paths cover the nav object and every legacy key', () => {
    expect(NAV_RESET_PATHS).toContain('global.nav');
    ['tabNavBackground', 'tabNavBorder', 'tabButtonBackground', 'tabButtonTextColor', 'tabButtonBorder', 'tabButtonActiveBackground', 'tabButtonActiveTextColor']
      .forEach((k) => expect(NAV_RESET_PATHS).toContain(`global.${k}`));
  });
});
