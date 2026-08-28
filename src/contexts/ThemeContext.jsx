import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ThemeContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || '';

// Default theme values — aligned with Technical Obsidian design system
const DEFAULT_THEME = {
  global: {
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    headingFont: "'Space Grotesk', sans-serif",
    monoFont: "'JetBrains Mono', monospace",
    serifFont: "'Crimson Text', Georgia, serif",
    baseFontSize: 16,
    borderRadius: 10,
    backgroundType: 'solid',
    backgroundColor: '#090a0f',
    backgroundGradient: null,
    accentColor: '#00f0aa',
    accentColorSecondary: '#f59e0b',
    buttonBackground: null,
    buttonTextColor: '#090a0f',
    headingColor: '#ffffff',
    textColor: '#e6edf3',
    textColorMuted: '#8b949e',
    cardBackground: '#12151e',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardHeadingColor: null,
    cardTextColor: null,
    cardTextMuted: null,
    glassBlur: 12,
    animationSpeed: 1,
  },
  tabs: {},
  pages: {
    dev: { backgroundColor: '#090a0f' },
    hobbies: { backgroundColor: '#090a0f' },
    diary: { backgroundColor: '#0e0e12' },
  },
  sections: {},
};

// Map theme object to CSS custom properties
function themeToCSSVars(theme) {
  const vars = {};
  const g = theme.global || {};

  const accent = g.accentColor || DEFAULT_THEME.global.accentColor;
  const accentSec = g.accentColorSecondary || DEFAULT_THEME.global.accentColorSecondary;
  const bg = g.backgroundColor || DEFAULT_THEME.global.backgroundColor;
  const text = g.textColor || DEFAULT_THEME.global.textColor;
  const heading = g.headingColor || g.headingTextColor || (text === DEFAULT_THEME.global.textColor ? '#ffffff' : text);
  const textMuted = g.textColorMuted || DEFAULT_THEME.global.textColorMuted;
  const cardBg = g.cardBackground || DEFAULT_THEME.global.cardBackground;
  const cardBorder = g.cardBorder || DEFAULT_THEME.global.cardBorder;
  const cardHeading = g.cardHeadingColor || heading;
  const cardText = g.cardTextColor || text;
  const cardTextMuted = g.cardTextMuted || textMuted;
  const btnBg = g.buttonBackground || accent;
  const btnText = g.buttonTextColor || '#090a0f';
  const radius = g.borderRadius ?? 10;

  // Fonts
  vars['--font-family'] = g.fontFamily || DEFAULT_THEME.global.fontFamily;
  vars['--heading-font'] = g.headingFont || DEFAULT_THEME.global.headingFont;
  vars['--font-display'] = g.headingFont || DEFAULT_THEME.global.headingFont;
  vars['--font-body'] = g.fontFamily || DEFAULT_THEME.global.fontFamily;
  vars['--font-mono'] = g.monoFont || DEFAULT_THEME.global.monoFont;
  vars['--mono-font'] = g.monoFont || DEFAULT_THEME.global.monoFont;
  vars['--font-serif'] = g.serifFont || g.journalFont || DEFAULT_THEME.global.serifFont;
  vars['--journal-font'] = g.serifFont || g.journalFont || DEFAULT_THEME.global.serifFont;
  vars['--base-font-size'] = `${g.baseFontSize || 16}px`;
  vars['--border-radius'] = `${radius}px`;

  // Backgrounds & Canvas
  vars['--bg-color'] = bg;
  vars['--color-bg-base'] = bg;
  vars['--dev-bg'] = bg;
  vars['--cs-bg'] = bg;
  vars['--diary-bg'] = bg;
  vars['--card-bg'] = cardBg;
  vars['--color-surface-raised'] = cardBg;
  vars['--color-surface-base'] = cardBg;
  vars['--color-surface-sunken'] = bg;
  vars['--card-border'] = cardBorder;
  vars['--color-border-subtle'] = cardBorder;
  vars['--color-border-normal'] = cardBorder;

  // Accents
  vars['--accent-color'] = accent;
  vars['--color-accent-primary'] = accent;
  vars['--dev-accent'] = accent;
  vars['--cs-accent'] = accent;
  vars['--color-accent-hover'] = accent;
  vars['--color-accent-dim'] = `color-mix(in srgb, ${accent} 15%, transparent)`;
  vars['--color-accent-glow'] = `color-mix(in srgb, ${accent} 30%, transparent)`;
  vars['--dev-accent-dim'] = `color-mix(in srgb, ${accent} 15%, transparent)`;
  vars['--accent-secondary'] = accentSec;
  vars['--color-accent-secondary'] = accentSec;

  // Headings & Text (Canvas / Block Level)
  vars['--heading-color'] = heading;
  vars['--color-heading'] = heading;
  vars['--color-text-bright'] = heading;
  vars['--text-color'] = text;
  vars['--color-text-primary'] = text;
  vars['--text-muted'] = textMuted;
  vars['--color-text-secondary'] = textMuted;
  vars['--color-text-muted'] = textMuted;
  vars['--dev-text'] = text;
  vars['--dev-text-dim'] = textMuted;
  vars['--cs-text'] = text;
  vars['--cs-text-dim'] = textMuted;
  vars['--diary-text'] = text;
  vars['--diary-text-dim'] = textMuted;

  // Inside Cards Typography & Surfaces
  vars['--card-heading-color'] = cardHeading;
  vars['--color-card-heading'] = cardHeading;
  vars['--card-text-color'] = cardText;
  vars['--color-card-text'] = cardText;
  vars['--card-text-muted'] = cardTextMuted;
  vars['--color-card-text-muted'] = cardTextMuted;

  // Buttons
  vars['--btn-primary-bg'] = btnBg;
  vars['--btn-primary-text'] = btnText;
  vars['--btn-primary-border'] = btnBg;
  vars['--color-btn-primary-bg'] = btnBg;
  vars['--color-btn-primary-text'] = btnText;
  const speed = g.animationSpeed ?? 1;
  const blur = g.glassBlur ?? 12;

  vars['--base-font-size'] = `${g.baseFontSize || 16}px`;
  vars['--border-radius'] = `${radius}px`;
  vars['--radius-md'] = `${radius}px`;
  vars['--radius-sm'] = `${Math.max(0, Math.round(radius * 0.6))}px`;
  vars['--radius-lg'] = `${Math.round(radius * 1.5)}px`;
  vars['--radius-xs'] = `${Math.max(0, Math.round(radius * 0.4))}px`;
  vars['--btn-radius'] = `${radius}px`;

  // Glass & Animation
  vars['--glass-blur'] = `${blur}px`;
  vars['--animation-speed'] = `${speed}`;
  vars['--transition-fast'] = `${Math.round(150 / speed)}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  vars['--transition-normal'] = `${Math.round(220 / speed)}ms cubic-bezier(0.16, 1, 0.3, 1)`;
  vars['--transition-slow'] = `${Math.round(350 / speed)}ms cubic-bezier(0.16, 1, 0.3, 1)`;

  if (g.backgroundGradient) {
    vars['--bg-gradient'] = g.backgroundGradient;
  }

  return vars;
}

// Apply CSS vars to root element
function applyCSSVars(vars) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

// Remove CSS vars from root
function removeCSSVars(vars) {
  const root = document.documentElement;
  for (const key of Object.keys(vars)) {
    root.style.removeProperty(key);
  }
}

// Deep merge utility
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object'
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Set nested value by dot-path
function setNestedValue(obj, path, value) {
  const result = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

// Get nested value by dot-path
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

// Load Google Font dynamically
function loadGoogleFont(fontFamily) {
  if (!fontFamily) return;
  // Skip system fonts
  const systemFonts = ['system-ui', 'sans-serif', 'serif', 'monospace', 'cursive'];
  const cleanName = fontFamily.split(',')[0].trim().replace(/'/g, '');
  if (systemFonts.includes(cleanName.toLowerCase())) return;

  const linkId = `google-font-${cleanName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanName)}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

export function ThemeProvider({ children, username, initialTheme }) {
  const [theme, setTheme] = useState(() =>
    deepMerge(DEFAULT_THEME, initialTheme || {})
  );
  const [isDirty, setIsDirty] = useState(false);
  const prevVarsRef = useRef({});

  // Apply CSS vars whenever theme changes
  useEffect(() => {
    // Remove previous vars
    if (Object.keys(prevVarsRef.current).length > 0) {
      removeCSSVars(prevVarsRef.current);
    }

    const vars = themeToCSSVars(theme);
    applyCSSVars(vars);
    prevVarsRef.current = vars;

    // Load custom fonts
    loadGoogleFont(theme.global?.fontFamily);
    loadGoogleFont(theme.global?.headingFont);
    loadGoogleFont(theme.global?.monoFont);
    loadGoogleFont(theme.global?.serifFont || theme.global?.journalFont);

    return () => {
      removeCSSVars(vars);
    };
  }, [theme]);

  // Update a single theme value by dot-path — instant local update
  const updateTheme = useCallback((path, value) => {
    setTheme((prev) => setNestedValue(prev, path, value));
    setIsDirty(true);
  }, []);

  // Bulk-update theme
  const setFullTheme = useCallback((newTheme) => {
    setTheme(deepMerge(DEFAULT_THEME, newTheme));
    setIsDirty(true);
  }, []);

  // Reset to defaults
  const resetTheme = useCallback(() => {
    setTheme({ ...DEFAULT_THEME });
    setIsDirty(true);
  }, []);

  // Save theme to server
  const saveTheme = useCallback(async (token) => {
    if (!username || !token) return;

    const res = await fetch(`${API_BASE}/api/u/${username}/theme`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(theme),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save theme');
    }

    setIsDirty(false);
  }, [username, theme]);

  // Get resolved background for a page/section
  const getBackground = useCallback((page) => {
    const pageTheme = theme.pages?.[page];
    if (pageTheme?.backgroundColor) return pageTheme.backgroundColor;
    if (theme.global?.backgroundGradient) return theme.global.backgroundGradient;
    return theme.global?.backgroundColor || DEFAULT_THEME.global.backgroundColor;
  }, [theme]);

  // Get section-specific style overrides
  const getSectionStyle = useCallback((sectionId) => {
    return theme.sections?.[sectionId] || {};
  }, [theme]);

  const value = {
    theme,
    isDirty,
    setIsDirty,
    updateTheme,
    setFullTheme,
    resetTheme,
    saveTheme,
    getBackground,
    getSectionStyle,
    getNestedValue: (path) => getNestedValue(theme, path),
    DEFAULT_THEME,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

export { DEFAULT_THEME };
export default ThemeContext;
