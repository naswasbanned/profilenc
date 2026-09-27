import { useEffect, useRef } from 'react';

/**
 * Shared behaviour for the winner event overlays, called from the component
 * that mounts with the overlay:
 *
 *   - freezes page scroll: Lenis on pointer devices, body overflow on touch
 *   - closes on Escape
 *   - keeps keyboard focus on the overlay's control while it is open
 *   - hands focus back to wherever it was when the overlay closes
 *
 * @param {object} options
 * @param {{ current: any }} [options.lenisRef]  The landing page Lenis instance.
 * @param {() => void} options.onClose
 * @param {{ current: HTMLElement | null }} [options.focusRef]  Control that
 *        receives focus on open and holds it while the overlay is up.
 */
export function useOverlayLock({ lenisRef, onClose, focusRef }) {
  // Kept in a ref so a new onClose identity never re-runs the lock effect,
  // which would restart the focus handling mid-animation.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const lenis = lenisRef?.current;
    lenis?.stop();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const previouslyFocused = document.activeElement;
    focusRef?.current?.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }
      // The overlays hold a single control, so Tab keeps focus on it rather
      // than letting it wander into the page underneath.
      if (event.key === 'Tab' && focusRef?.current) {
        event.preventDefault();
        focusRef.current.focus({ preventScroll: true });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      // Reading the live ref here is deliberate: when the whole landing page
      // unmounts, its own cleanup clears lenisRef and destroys Lenis first,
      // and restarting a destroyed instance must be skipped.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (lenis && lenisRef?.current === lenis) lenis.start();
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [lenisRef, focusRef]);
}
