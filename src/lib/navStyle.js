/**
 * Profile navigation bar styling.
 *
 * The bar follows the theme: every color is derived from the theme's own seeds
 * (background, card, heading, muted text, accent), so changing the palette or
 * preset changes the bar with it. The user then customizes on top of that with
 * `theme.global.nav` (look, accent, align, size, bar) and four optional colors.
 * `resolveNav` is the single place these defaults live. The public profile, the
 * editor canvas and the editor's live preview all read its output.
 */
import { parseColor, isLightColor, readableOn, contrastRatio } from './color';

export const NAV_LOOKS = [
  { id: 'auto', label: 'Auto', hint: 'Follows your design' },
  { id: 'pills', label: 'Pills', hint: 'Rounded and soft' },
  { id: 'tactile', label: 'Tactile', hint: 'Bordered with a hard shadow' },
  { id: 'brutal', label: 'Brutal', hint: 'Square, thick border' },
  { id: 'underline', label: 'Underline', hint: 'Text with an active line' },
  { id: 'minimal', label: 'Minimal', hint: 'Text only' },
];

export const NAV_BAR_MODES = [
  { id: 'auto', label: 'Auto' },
  { id: 'solid', label: 'Solid' },
  { id: 'glass', label: 'Glass' },
  { id: 'transparent', label: 'Clear' },
];

export const NAV_DEFAULTS = { look: 'auto', accent: null, align: 'center', size: 'comfortable', bar: 'auto' };

/** Auto look per design. Designs not listed use Pills. */
const AUTO_LOOK = {
  'field-notes': 'tactile',
  'neo-brutalist': 'brutal',
  'press-mono': 'underline',
};

/** Used only when the background is not a plain color we can measure. */
const LIGHT_DESIGNS = new Set(['field-notes', 'clean-light', 'neo-brutalist']);

/** Theme keys written by the four nav color pickers. */
export const NAV_COLOR_KEYS = {
  barBg: 'global.tabNavBackground',
  tabBg: 'global.tabButtonBackground',
  tabText: 'global.tabButtonTextColor',
  activeBg: 'global.tabButtonActiveBackground',
};

/** Everything the nav ever stored. Applying a preset or palette clears all of it. */
export const NAV_RESET_PATHS = [
  'global.nav',
  'global.tabNavBackground',
  'global.tabNavBorder',
  'global.tabButtonBackground',
  'global.tabButtonTextColor',
  'global.tabButtonBorder',
  'global.tabButtonActiveBackground',
  'global.tabButtonActiveTextColor',
];

const norm = (v) => String(v).toLowerCase().replace(/\s+/g, '');

/**
 * Values that old presets (and the seeded Field Notes theme in server data) wrote
 * into profiles. They were never a choice the user made, so they are ignored and
 * the bar follows the theme instead.
 */
const BAKED = {
  tabNavBackground: [
    'rgba(255,250,240,0.96)', 'rgba(242,242,240,0.92)', 'rgba(255,255,255,0.72)',
    'rgba(10,10,15,0.82)', '#ffffff', 'rgba(19,13,36,0.85)',
  ],
  tabButtonBackground: [
    '#fffaf0', 'transparent', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.03)', '#ffffff',
  ],
  tabButtonTextColor: ['#746e63', '#6b6b70', '#6f6a80', '#8b949e', '#000000', '#8b5cf6'],
  tabButtonActiveBackground: [
    '#e96d52', '#17171a', '#f472b6', 'rgba(0,240,170,0.15)', '#ffdd00', 'rgba(167,139,250,0.2)',
  ],
};

/** The color the user picked for one nav color key (`tabNavBackground`, ...), or null. */
export function customNavColor(theme, key) {
  return custom(theme?.global || {}, key);
}

/** True when the user changed anything about the nav, so "Reset to theme" has work to do. */
export function hasNavCustomization(theme) {
  const g = theme?.global || {};
  const nav = g.nav || {};
  if (Object.entries(NAV_DEFAULTS).some(([k, d]) => nav[k] != null && nav[k] !== d)) return true;
  return Object.keys(BAKED).some((k) => custom(g, k));
}

export function isBakedNavValue(key, value) {
  return Boolean(value) && (BAKED[key] || []).includes(norm(value));
}

const mix = (color, pct, into = 'transparent') => `color-mix(in srgb, ${color} ${pct}%, ${into})`;

/** A color the user really chose, or null (empty, or a leftover preset value). */
function custom(g, key) {
  const v = g[key];
  return v && !isBakedNavValue(key, v) ? v : null;
}

/** Preferred text if it reads well on the fill (3:1), else whichever of light/dark does. */
function textOn(fill, preferred, under) {
  const f = parseColor(fill);
  const p = parseColor(preferred);
  if (f && f.a >= 0.95 && p && contrastRatio(f, p) >= 3) return preferred;
  return readableOn(fill, under) || preferred;
}

export function resolveLook(theme) {
  const g = theme?.global || {};
  const asked = g.nav?.look;
  if (asked && asked !== 'auto' && NAV_LOOKS.some((l) => l.id === asked)) return asked;
  return AUTO_LOOK[g.designStyle] || 'pills';
}

export function resolveNav(theme) {
  const g = theme?.global || {};
  const nav = { ...NAV_DEFAULTS, ...(g.nav || {}) };
  const design = g.designStyle || '';
  const look = resolveLook(theme);

  // Theme seeds
  const bg = g.backgroundColor || '#090a0f';
  const cardBg = g.cardBackground || '#12151e';
  const cardBorder = g.cardBorder || 'rgba(255, 255, 255, 0.08)';
  const heading = g.headingColor || g.headingTextColor || g.textColor || '#ffffff';
  const muted = g.textColorMuted || '#8b949e';
  const accent = nav.accent || g.accentColor || '#00f0aa';
  const blur = g.glassBlur ?? 12;
  const light = isLightColor(bg) ?? LIGHT_DESIGNS.has(design);

  const ink = light ? heading : mix(heading, 55);
  const paper = parseColor(cardBg) ? cardBg : '#ffffff';
  const filled = look === 'pills' || look === 'tactile' || look === 'brutal';

  // Bar
  const barMode = nav.bar !== 'auto' && NAV_BAR_MODES.some((m) => m.id === nav.bar)
    ? nav.bar
    : (blur > 0 ? 'glass' : 'solid');
  const barOverride = custom(g, 'tabNavBackground');
  let barBg = mix(bg, barMode === 'glass' ? 72 : 96);
  if (barMode === 'transparent') barBg = 'transparent';
  else if (barOverride) barBg = barOverride;
  const barBorder = barMode === 'transparent' ? 'transparent' : look === 'brutal' ? ink : cardBorder;
  const barBlur = barMode === 'glass' ? `${Math.max(blur, 12)}px` : '0px';

  // Tabs at rest
  let tabBg = look === 'underline' || look === 'minimal' ? 'transparent' : light ? cardBg : mix(heading, 4);
  tabBg = custom(g, 'tabButtonBackground') || tabBg;
  const tabText = custom(g, 'tabButtonTextColor') || (look === 'brutal' ? heading : muted);
  let tabBorder = 'transparent';
  if (look === 'pills') tabBorder = light ? cardBorder : mix(heading, 10);
  else if (look === 'tactile') tabBorder = cardBorder;
  else if (look === 'brutal') tabBorder = ink;

  // Shape and effects per look
  const shadowColor = look === 'brutal' ? ink : light ? mix(ink, 32) : 'rgba(0, 0, 0, 0.55)';
  const activeOverride = custom(g, 'tabButtonActiveBackground');
  const indicator = activeOverride || accent;
  const shape = {
    pills: { radius: '9999px', width: '1px', weight: 600, lift: '0px', hover: 'none' },
    tactile: { radius: '9999px', width: '2px', weight: 700, lift: '-1px', hover: `2px 2px 0 ${shadowColor}` },
    brutal: { radius: '0px', width: '2.5px', weight: 800, lift: '-2px', hover: `3px 3px 0 ${shadowColor}` },
    underline: { radius: '0px', width: '0px', weight: 600, lift: '0px', hover: `inset 0 -2px 0 ${mix(accent, 45)}` },
    minimal: { radius: '8px', width: '0px', weight: 600, lift: '0px', hover: 'none' },
  }[look];

  // Active tab
  let activeBg = 'transparent';
  let activeText = heading;
  let activeBorder = 'transparent';
  let activeShadow = 'none';
  if (filled) {
    if (activeOverride) {
      activeBg = activeOverride;
      activeText = textOn(activeOverride, heading, bg);
    } else if (light) {
      activeBg = accent;
      activeText = textOn(accent, paper);
    } else {
      activeBg = mix(accent, 15);
      activeText = accent;
    }
    activeBorder = look === 'pills' && !light ? accent : ink;
    if (look === 'pills') activeShadow = light ? `0 6px 14px ${mix(accent, 38)}` : `0 0 16px ${mix(accent, 20)}`;
    else activeShadow = shape.hover;
  } else if (look === 'underline') {
    activeShadow = `inset 0 -2px 0 ${indicator}`;
  } else {
    activeText = indicator;
  }

  const vars = {
    '--nav-bar-bg': barBg,
    '--nav-bar-border': barBorder,
    '--nav-bar-blur': barBlur,
    '--nav-arrow-bg': mix(bg, 96),
    '--nav-tab-bg': tabBg,
    '--nav-tab-text': tabText,
    '--nav-tab-border': tabBorder,
    '--nav-tab-radius': shape.radius,
    '--nav-tab-border-w': shape.width,
    '--nav-tab-weight': String(shape.weight),
    '--nav-hover-bg': mix(accent, 14, tabBg),
    '--nav-hover-text': heading,
    '--nav-hover-border': look === 'pills' ? accent : filled ? ink : 'transparent',
    '--nav-hover-shadow': shape.hover,
    '--nav-hover-lift': shape.lift,
    '--nav-active-bg': activeBg,
    '--nav-active-text': activeText,
    '--nav-active-border': activeBorder,
    '--nav-active-shadow': activeShadow,
    '--nav-accent': accent,
  };

  const attrs = {
    'data-nav-look': look,
    'data-nav-align': nav.align === 'left' ? 'left' : 'center',
    'data-nav-size': nav.size === 'compact' ? 'compact' : 'comfortable',
    'data-nav-bar': barMode,
  };

  return { vars, attrs, look };
}
