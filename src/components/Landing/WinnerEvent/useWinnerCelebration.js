import { useCallback, useEffect, useState } from 'react';
import { WINNER_EVENT } from './winnerEvent.config';

const STORAGE_KEY = `profilenc_celebrated_${WINNER_EVENT.id}`;

function alreadyCelebrated() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // Storage can be blocked (private modes, strict cookie settings).
    return false;
  }
}

function markCelebrated() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // Not fatal: the popup just shows again on the next visit.
  }
}

/**
 * Open state for the entry celebration.
 *
 * Opens automatically once per browser session, shortly after the landing
 * page mounts, so navigating back to "/" within a visit does not replay it.
 * `replay` reopens it on demand (the trophy emblem in the winner section).
 */
export function useWinnerCelebration() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!WINNER_EVENT.enabled || alreadyCelebrated()) return undefined;

    const timer = window.setTimeout(() => {
      markCelebrated();
      setOpen(true);
    }, WINNER_EVENT.celebration.delayMs);

    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const replay = useCallback(() => setOpen(true), []);

  return { open, close, replay };
}
