import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Gamepad2, BookHeart } from 'lucide-react';
import './TransitionOverlay.css';

const iconMap = {
  dev: <Code2 size={64} />,
  cs: <Gamepad2 size={64} />,
  hobbies: <Gamepad2 size={64} />,
  diary: <BookHeart size={64} />,
};

function getOverlayClass(targetSide) {
  if (targetSide === 'dev') return 'to-dev';
  if (targetSide === 'diary') return 'to-diary';
  return 'to-cs'; // hobbies / cs
}

export default function TransitionOverlay({ isActive, targetSide }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={`transition-overlay ${getOverlayClass(targetSide)}`}
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{ opacity: 0 }}
          transition={{
            clipPath: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            opacity: { duration: 0.3, delay: 0.6 },
          }}
        >
          <motion.div
            className="transition-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            {iconMap[targetSide] || <Code2 size={64} />}
          </motion.div>

          {/* Glitch lines */}
          <div className="glitch-lines">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="glitch-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.04,
                  ease: 'easeInOut',
                }}
                style={{
                  top: `${10 + i * 11}%`,
                  height: `${2 + Math.random() * 4}px`,
                  opacity: 0.3 + Math.random() * 0.4,
                }}
              />
            ))}
          </div>

          {/* Particles */}
          <div className="transition-particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="t-particle"
                initial={{
                  x: 0, y: 0, opacity: 0, scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 600,
                  y: (Math.random() - 0.5) * 600,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + Math.random() * 0.3,
                  ease: 'easeOut',
                }}
                style={{
                  width: `${3 + Math.random() * 6}px`,
                  height: `${3 + Math.random() * 6}px`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
