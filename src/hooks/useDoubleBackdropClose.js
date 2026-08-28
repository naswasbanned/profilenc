import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to require double-clicking outside a modal backdrop to dismiss it.
 * Prevents accidental single-clicks on backdrop from discarding modal content.
 *
 * @param {Function} onClose - Callback to close modal
 * @param {number} delay - Max interval between clicks in milliseconds (default 500ms)
 * @returns {{ handleBackdropClick: Function, hintVisible: boolean }}
 */
export function useDoubleBackdropClose(onClose, delay = 500) {
  const lastClickRef = useRef(0);
  const [hintVisible, setHintVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e) => {
      // Ignore clicks that bubbled from modal contents
      if (e.target !== e.currentTarget) return;

      const now = Date.now();
      if (now - lastClickRef.current < delay) {
        // Second click within interval -> dismiss modal!
        lastClickRef.current = 0;
        setHintVisible(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (onClose) onClose();
      } else {
        // First click -> show brief double-click guidance hint
        lastClickRef.current = now;
        setHintVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setHintVisible(false);
          lastClickRef.current = 0;
        }, 1200);
      }
    },
    [onClose, delay]
  );

  return { handleBackdropClick, hintVisible };
}

export default useDoubleBackdropClose;
