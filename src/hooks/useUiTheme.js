import { useState, useEffect, useCallback } from 'react';

/**
 * Shared dark / light UI theme for the app shell (landing, auth, dashboard,
 * admin and editor surfaces).
 *
 * The theme lives in `localStorage.profilenc_theme` and is applied as
 * `<html data-theme="...">`, so every stylesheet can react to it.
 */

export const UI_THEME_STORAGE_KEY = 'profilenc_theme';

const VIEW_TRANSITION_DURATION = 650;
const VIEW_TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

/**
 * @param {boolean} [fallbackToDocument] Also honour an existing
 *        `<html data-theme>` attribute when nothing is stored.
 */
export function readStoredUiTheme(fallbackToDocument = false) {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(UI_THEME_STORAGE_KEY);
  if (stored) return stored;
  if (fallbackToDocument) {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr;
  }
  return 'light';
}

/** Persist the theme and apply it to the document element. */
export function applyUiTheme(theme) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(UI_THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Theme state plus an animated toggle.
 *
 * The toggle expands a circular View Transitions wave from the clicked button,
 * and falls back to an instant switch when the API is unavailable.
 *
 * @param {object} [options]
 * @param {boolean} [options.fallbackToDocument]
 * @returns {{ theme: string, setTheme: Function, toggleTheme: (event?: object) => void }}
 */
export function useUiTheme(options = {}) {
  const { fallbackToDocument = false } = options;
  const [theme, setTheme] = useState(() => readStoredUiTheme(fallbackToDocument));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((event) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const commit = () => {
      setTheme(nextTheme);
      applyUiTheme(nextTheme);
    };

    // Fallback if the View Transitions API is not available
    if (!document.startViewTransition) {
      commit();
      return;
    }

    // Origin coordinates of the button (or the top-right corner)
    const rect = event?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const y = rect ? rect.top + rect.height / 2 : 0;

    // Radius that covers the whole viewport plus a safety margin
    const maxDist = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const endRadius = Math.ceil(maxDist) + 40;

    const transition = document.startViewTransition(commit);

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: VIEW_TRANSITION_DURATION,
          easing: VIEW_TRANSITION_EASING,
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}

/**
 * Editor-surface variant: accepts an optional controlled value from a parent,
 * mirrors changes made in other browser tabs, and toggles without a view
 * transition (the editor canvas repaints instantly).
 *
 * @param {object} [options]
 * @param {string} [options.value]        Controlled theme from a parent.
 * @param {Function} [options.onChange]   Setter owned by a parent.
 */
export function useSyncedUiTheme(options = {}) {
  const { value, onChange } = options;
  const [localTheme, setLocalTheme] = useState(() => readStoredUiTheme(true));
  const theme = value || localTheme;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === UI_THEME_STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
        if (onChange) onChange(e.newValue);
        else setLocalTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [onChange]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    if (onChange) onChange(next);
    else setLocalTheme(next);
    applyUiTheme(next);
  }, [theme, onChange]);

  return { theme, setTheme: onChange || setLocalTheme, toggleTheme };
}
