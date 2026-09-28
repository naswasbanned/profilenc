import { MotionConfig, motion } from 'framer-motion';
import './RevealHeading.css';

const HEADING_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const WORD_VARIANTS = {
  hidden: { y: '105%', rotate: 4 },
  visible: { y: '0%', rotate: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Section heading whose words slide up from behind their own masks when it
 * scrolls into view: the same reveal as the winner section title.
 *
 * @param {string} text
 * @param {string} [className]  Typography class, e.g. "fn-display".
 * @param {string} [id]
 */
export default function RevealHeading({ text, className = '', id }) {
  const words = String(text ?? '').split(' ').filter(Boolean);

  return (
    <MotionConfig reducedMotion="user">
      <motion.h2
        id={id}
        className={`fn-reveal-heading ${className}`.trim()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={HEADING_VARIANTS}
      >
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            {/* Real spaces keep the heading a readable sentence for screen readers */}
            {index > 0 && ' '}
            <span className="fn-reveal-mask">
              <motion.span className="fn-reveal-word" variants={WORD_VARIANTS}>
                {word}
              </motion.span>
            </span>
          </span>
        ))}
      </motion.h2>
    </MotionConfig>
  );
}
