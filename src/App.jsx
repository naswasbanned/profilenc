import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SideToggle from './components/SideToggle/SideToggle';
import TransitionOverlay from './components/TransitionOverlay/TransitionOverlay';
import ProgrammerSide from './components/ProgrammerSide/ProgrammerSide';
import CSPlayerSide from './components/CSPlayerSide/CSPlayerSide';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 1.03, transition: { duration: 0.3 } },
};

function App() {
  const [activeSide, setActiveSide] = useState('dev');
  const [transitioning, setTransitioning] = useState(false);
  const [targetSide, setTargetSide] = useState('dev');

  const handleToggle = useCallback(
    (side) => {
      if (side === activeSide || transitioning) return;
      setTargetSide(side);
      setTransitioning(true);
      window.scrollTo({ top: 0, behavior: 'instant' });

      setTimeout(() => {
        setActiveSide(side);
      }, 500);

      setTimeout(() => {
        setTransitioning(false);
      }, 1000);
    },
    [activeSide, transitioning]
  );

  // Change body background based on side
  useEffect(() => {
    document.body.style.background =
      activeSide === 'dev' ? '#0a0a0f' : '#0d0d0d';
  }, [activeSide]);

  return (
    <div className="app">
      <SideToggle activeSide={activeSide} onToggle={handleToggle} />
      <TransitionOverlay isActive={transitioning} targetSide={targetSide} />

      <AnimatePresence mode="wait">
        {activeSide === 'dev' ? (
          <motion.div
            key="dev"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ProgrammerSide />
          </motion.div>
        ) : (
          <motion.div
            key="cs"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <CSPlayerSide />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={`app-footer ${activeSide}`}>
        <p>
          &copy; 2026 NAS —{' '}
          {activeSide === 'dev'
            ? 'Built with React + Framer Motion'
            : 'Press Start to continue...'}
        </p>
      </footer>
    </div>
  );
}

export default App;
