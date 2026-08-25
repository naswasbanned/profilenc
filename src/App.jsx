import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SideToggle from './components/SideToggle/SideToggle';
import TransitionOverlay from './components/TransitionOverlay/TransitionOverlay';
import ProgrammerSide from './components/ProgrammerSide/ProgrammerSide';
import HobbiesSide from './components/HobbiesSide/HobbiesSide';
import DiarySide from './components/DiarySide/DiarySide';
import useDataFetch from './hooks/useDataFetch';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 1.03, transition: { duration: 0.3 } },
};

const bgMap = {
  dev: '#0a0a0f',
  hobbies: '#0d0d0d',
  diary: '#0d0b0f',
};

// Map URL pathname to section id
function pathToSection(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (clean === 'hobbies') return 'hobbies';
  if (clean === 'diary') return 'diary';
  return 'dev'; // '/' or '/dev' or anything else
}

// Map section id to URL path
function sectionToPath(section) {
  if (section === 'hobbies') return '/hobbies';
  if (section === 'diary') return '/diary';
  return '/';
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active section from URL
  const activeSide = useMemo(() => pathToSection(location.pathname), [location.pathname]);

  const [transitioning, setTransitioning] = useState(false);
  const [targetSide, setTargetSide] = useState(activeSide);

  // Lift ALL data fetching to App so it persists across AnimatePresence mount/unmount
  const { data: profile } = useDataFetch('/data/profile.json');
  const { data: skills } = useDataFetch('/data/dev-skills.json');
  const { data: projects } = useDataFetch('/data/dev-projects.json');
  const { data: experience } = useDataFetch('/data/dev-experience.json');
  const { data: specs } = useDataFetch('/data/hobbies-specs.json');
  const { data: setup } = useDataFetch('/data/hobbies-setup.json');
  const { data: storyGames } = useDataFetch('/data/hobbies-story-games.json');
  const { data: currentlyPlaying } = useDataFetch('/data/hobbies-currently-playing.json');
  const { data: backlog } = useDataFetch('/data/hobbies-backlog.json');
  const { data: philosophy } = useDataFetch('/data/hobbies-philosophy.json');
  const { data: diaryEntries } = useDataFetch('/data/diary-entries.json');

  const footer = profile?.footer;

  const handleToggle = useCallback(
    (side) => {
      if (side === activeSide || transitioning) return;
      setTargetSide(side);
      setTransitioning(true);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Navigate after transition overlay covers the screen
      setTimeout(() => {
        navigate(sectionToPath(side));
      }, 500);

      setTimeout(() => {
        setTransitioning(false);
      }, 1000);
    },
    [activeSide, transitioning, navigate]
  );

  // Change body background based on side
  useEffect(() => {
    document.body.style.background = bgMap[activeSide] || '#0a0a0f';
  }, [activeSide]);

  // Resolve footer tagline per section
  const getFooterTagline = () => {
    if (activeSide === 'dev') return footer?.devTagline || 'Built with React + Framer Motion';
    if (activeSide === 'diary') return footer?.diaryTagline || 'Every day is a page worth writing.';
    return footer?.hobbiesTagline || 'Press Start to continue...';
  };

  return (
    <div className="app">
      <SideToggle activeSide={activeSide} onToggle={handleToggle} />
      <TransitionOverlay isActive={transitioning} targetSide={targetSide} />

      <AnimatePresence mode="wait">
        {activeSide === 'dev' && (
          <motion.div
            key="dev"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ProgrammerSide
              profile={profile?.dev}
              contact={profile?.contact}
              skills={skills}
              projects={projects}
              experience={experience}
            />
          </motion.div>
        )}

        {activeSide === 'hobbies' && (
          <motion.div
            key="hobbies"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <HobbiesSide
              profile={profile?.hobbies}
              specs={specs}
              setup={setup}
              storyGames={storyGames}
              currentlyPlaying={currentlyPlaying}
              backlog={backlog}
              philosophy={philosophy}
            />
          </motion.div>
        )}

        {activeSide === 'diary' && (
          <motion.div
            key="diary"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DiarySide
              profile={profile?.diary}
              entries={diaryEntries}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={`app-footer ${activeSide}`}>
        <p>
          {footer?.copyright || '© 2026 NAS'} — {getFooterTagline()}
        </p>
      </footer>
    </div>
  );
}

export default App;
