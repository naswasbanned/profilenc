import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import TrophyArt from './TrophyArt';
import { createConfetti, readConfettiPalette } from './confetti';
import { useOverlayLock } from './useOverlayLock';
import { WINNER_EVENT } from './winnerEvent.config';
import './WinnerEvent.css';

const HEADLINE_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
};

const WORD_VARIANTS = {
  hidden: { opacity: 0, y: 28, rotate: -6 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 380, damping: 20 },
  },
};

/** Props for a short fade-and-rise, delayed to sit in the entrance sequence. */
function fadeUp(delay) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] },
  };
}

/**
 * Entry celebration for the first place win: a trophy popping onto a card,
 * confetti fired from both bottom corners, and the headline landing word by
 * word. Closes itself after `autoCloseMs`, or on Continue, a backdrop click,
 * or Escape, and the page underneath carries on as normal.
 *
 * @param {boolean} open
 * @param {() => void} onClose  Keep this stable (useCallback).
 * @param {{ current: any }} lenisRef  Landing page Lenis instance, paused while open.
 */
export default function WinnerCelebration({ open, onClose, lenisRef }) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <CelebrationOverlay key="winner-celebration" onClose={onClose} lenisRef={lenisRef} />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function CelebrationOverlay({ onClose, lenisRef }) {
  const { celebration, competition } = WINNER_EVENT;
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef(null);
  const continueRef = useRef(null);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const messageId = `${baseId}-message`;

  useOverlayLock({ lenisRef, onClose, focusRef: continueRef });

  // Close on a timer so the page returns to normal without any input.
  useEffect(() => {
    const timer = window.setTimeout(onClose, celebration.autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [onClose, celebration.autoCloseMs]);

  // Confetti waves, timed against the card entrance. Skipped entirely for
  // visitors who ask for reduced motion.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (reduceMotion || !canvas) return undefined;

    const confetti = createConfetti(canvas, { colors: readConfettiPalette(canvas) });
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    // Fewer pieces on narrow screens: same look, less work for a phone.
    const density = Math.min(1, Math.max(0.45, width / 1280));
    const scaled = (count) => Math.round(count * density);

    const cannons = (count, power) => {
      confetti.burst({ x: -10, y: height + 10, angle: 62, spread: 34, count: scaled(count), power });
      confetti.burst({ x: width + 10, y: height + 10, angle: 118, spread: 34, count: scaled(count), power });
    };

    const timers = [
      window.setTimeout(() => cannons(120, 1), 320),
      // Pop around the trophy as it lands
      window.setTimeout(() => {
        confetti.burst({
          x: width / 2,
          y: height * 0.36,
          spread: 360,
          radial: true,
          count: scaled(80),
          power: 0.5,
        });
      }, 760),
      window.setTimeout(() => confetti.rain({ count: scaled(110) }), 1200),
      window.setTimeout(() => cannons(60, 0.85), 2300),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      confetti.destroy();
    };
  }, [reduceMotion]);

  const words = celebration.headline.split(' ');

  return (
    <motion.div
      className="wn-celebrate"
      role="presentation"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <canvas ref={canvasRef} className="wn-confetti-canvas" aria-hidden="true" />

      <motion.div
        className="wn-celebrate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.6, rotate: -8, y: 40 }}
        animate={{ opacity: 1, scale: 1, rotate: -1.5, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, rotate: 2, y: 24, transition: { duration: 0.25 } }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <div className="wn-celebrate-trophy">
          {/* Scale and fade live on the wrapper: the CSS spin writes its own
              transform on the inner element */}
          <motion.span
            className="wn-sunburst-wrap"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="wn-sunburst" />
          </motion.span>

          <motion.div
            className="wn-celebrate-trophy-pop"
            initial={{ y: 60, scale: 0.2, rotate: -24 }}
            animate={{ y: 0, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 13, delay: 0.12 }}
          >
            <TrophyArt />
          </motion.div>
        </div>

        <motion.p className="wn-celebrate-eyebrow" {...fadeUp(0.35)}>
          {competition.placementLabel} · {competition.name}
        </motion.p>

        <motion.h2
          id={titleId}
          className="wn-celebrate-title"
          initial="hidden"
          animate="visible"
          variants={HEADLINE_VARIANTS}
        >
          {words.map((word, index) => {
            const isLast = index === words.length - 1;
            return (
              <span key={`${word}-${index}`}>
                {/* Real spaces between the animated words keep the heading
                    readable as a sentence for screen readers */}
                {index > 0 && ' '}
                <motion.span
                  className={`wn-celebrate-word${isLast ? ' is-accent' : ''}`}
                  variants={WORD_VARIANTS}
                >
                  {word}
                  {isLast && (
                    <svg
                      className="wn-celebrate-swash"
                      viewBox="0 0 120 26"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <motion.path
                        d="M4 18 C34 6 70 5 116 13"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
                      />
                    </svg>
                  )}
                </motion.span>
              </span>
            );
          })}
        </motion.h2>

        <motion.p id={messageId} className="wn-celebrate-message" {...fadeUp(1.05)}>
          {celebration.message}
        </motion.p>

        <motion.div {...fadeUp(1.2)}>
          <button
            ref={continueRef}
            type="button"
            className="fn-btn fn-btn-butter wn-celebrate-btn"
            onClick={onClose}
          >
            Continue <ArrowRight size={16} aria-hidden="true" />
          </button>
        </motion.div>

        {/* Time left before the popup closes by itself */}
        <span className="wn-celebrate-progress" aria-hidden="true">
          <motion.span
            className="wn-celebrate-progress-fill"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: celebration.autoCloseMs / 1000, ease: 'linear' }}
          />
        </span>
      </motion.div>
    </motion.div>
  );
}
