import { apiFetch } from './api';

/**
 * Landing page CMS config (hero, marquee, CTA): where it comes from on first
 * paint, and how it is refreshed.
 *
 * Order of preference for the first render:
 *   1. The early request started by the inline script in index.html, when it
 *      has already answered by the time the app mounts.
 *   2. The copy cached in localStorage by the previous visit.
 *   3. LANDING_DEFAULTS below.
 *
 * Getting this right keeps the hero from swapping its text after load, which
 * the visitor sees as a flash and Lighthouse counts as a late LCP.
 */

const CACHE_KEY = 'profilenc_landing_config';

/**
 * Copy shown only when the CMS has never been reached from this browser.
 * Keep it identical to what the admin has published in the Landing CMS, or
 * first-time visitors will see the text swap once the CMS answers.
 */
export const LANDING_DEFAULTS = {
  hero: {
    badge: 'PROFILENC // PERSONAL PROFILE BUILDER',
    mastheadTop: 'CREATE YOUR',
    mastheadMid: 'PERSONAL PAGE.',
    manifestoLead:
      'The easiest way to build a clean, customizable profile website. Choose your blocks, customize colors and fonts, and share your link with the world.',
    claimLabel: 'YOUR PERSONAL LINK',
  },
  marquee: {
    text: 'CREATE YOUR PROFILE // 10 MODULAR BLOCKS // NO CODING REQUIRED // SHARE ANYWHERE //',
  },
  cta: {
    badge: '[GET_STARTED]',
    title: 'READY TO BUILD YOUR PAGE?',
    text: "Create a clean, customizable personal page in minutes. It's free and easy to set up.",
    btnLabel: 'START BUILDING NOW',
  },
};

/** Section-by-section merge, so a partial CMS config keeps the other fields. */
export function mergeLandingConfig(base, config) {
  if (!config || typeof config !== 'object') return base;
  return {
    hero: { ...base.hero, ...(config.hero || {}) },
    marquee: { ...base.marquee, ...(config.marquee || {}) },
    cta: { ...base.cta, ...(config.cta || {}) },
  };
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(config) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(config));
  } catch {
    // Storage full or blocked: the next visit just starts from the defaults.
  }
}

/** Config for the very first render: early response, else cache, else defaults. */
export function initialLandingConfig() {
  if (typeof window === 'undefined') return LANDING_DEFAULTS;
  const early = window.__PROFILENC_LANDING_DATA__;
  const config = early?.config || readCache();
  return mergeLandingConfig(LANDING_DEFAULTS, config);
}

/**
 * Fetch the latest config, reusing the early request from index.html when
 * there is one (it is consumed, so a later visit to "/" fetches fresh).
 * Caches whatever the server returns.
 *
 * @returns {Promise<object | null>} The raw CMS config, or null.
 */
export async function loadLandingConfig() {
  let early = null;
  if (typeof window !== 'undefined' && window.__PROFILENC_LANDING__) {
    early = window.__PROFILENC_LANDING__;
    window.__PROFILENC_LANDING__ = undefined;
    window.__PROFILENC_LANDING_DATA__ = undefined;
  }

  let data = early ? await early : null;
  if (!data) {
    // No early request (another entry route, or the API lives on another
    // origin), or it failed: ask through the regular client.
    try {
      const res = await apiFetch('/api/site/landing', { token: null });
      data = res.ok ? await res.json() : null;
    } catch {
      data = null;
    }
  }

  if (data?.config) {
    writeCache(data.config);
    return data.config;
  }
  return null;
}
