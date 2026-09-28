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
 * Run `callback` once the page has finished loading and the main thread is
 * idle. Returns a cancel function.
 */
function whenPageSettles(callback) {
  let idleId = 0;
  let timerId = 0;
  let cancelled = false;

  const onIdle = () => {
    if (cancelled) return;
    if ('requestIdleCallback' in window) {
      // The timeout caps the wait on a page that never goes idle
      idleId = window.requestIdleCallback(callback, { timeout: 2000 });
    } else {
      timerId = window.setTimeout(callback, 200);
    }
  };

  if (document.readyState === 'complete') {
    onIdle();
  } else {
    window.addEventListener('load', onIdle, { once: true });
  }

  return () => {
    cancelled = true;
    window.removeEventListener('load', onIdle);
    if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
    window.clearTimeout(timerId);
  };
}

/**
 * Open state for the entry celebration.
 *
 * Opens automatically once per browser session, so navigating back to "/"
 * within a visit does not replay it. It waits for the page to finish loading
 * and go idle, then `celebration.delayMs`: the popup and its confetti never
 * compete with the first paint.
 *
 * `requested` turns true the first time the popup is asked to open and stays
 * true, so the caller can mount the (lazily loaded) popup only when needed
 * and keep it mounted for its exit animation.
 * `replay` reopens it on demand (the trophy emblem in the winner section).
 */
export function useWinnerCelebration() {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (!WINNER_EVENT.enabled || alreadyCelebrated()) return undefined;

    let timer = 0;
    const cancelSettle = whenPageSettles(() => {
      timer = window.setTimeout(() => {
        markCelebrated();
        setRequested(true);
        setOpen(true);
      }, WINNER_EVENT.celebration.delayMs);
    });

    return () => {
      cancelSettle();
      window.clearTimeout(timer);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const replay = useCallback(() => {
    setRequested(true);
    setOpen(true);
  }, []);

  return { open, close, replay, requested };
}
