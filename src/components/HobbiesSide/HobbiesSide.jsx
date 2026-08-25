import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  BookOpen,
  Heart,
  Star,
  Clock,
  Map,
  Cpu,
  Tv,
  CircuitBoard,
  Layers,
  HardDrive,
  Zap,
  Fan,
  Box,
  Monitor,
  Headphones,
  Mouse,
  Keyboard,
  Sliders,
  Sparkles,
} from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import './HobbiesSide.css';

// Map icon string names from JSON to Lucide components
const iconMap = {
  Gamepad2: <Gamepad2 size={18} />,
  BookOpen: <BookOpen size={18} />,
  Heart: <Heart size={18} />,
  Cpu: <Cpu size={20} />,
  Tv: <Tv size={20} />,
  CircuitBoard: <CircuitBoard size={20} />,
  Layers: <Layers size={20} />,
  HardDrive: <HardDrive size={20} />,
  Zap: <Zap size={20} />,
  Fan: <Fan size={20} />,
  Box: <Box size={20} />,
  Monitor: <Monitor size={20} />,
  Headphones: <Headphones size={20} />,
  Mouse: <Mouse size={20} />,
  Keyboard: <Keyboard size={20} />,
  Sliders: <Sliders size={20} />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const subPageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

export default function HobbiesSide({
  profile,
  specs,
  setup,
  storyGames,
  currentlyPlaying,
  backlog,
  philosophy,
}) {
  const [subSide, setSubSide] = useState('games');
  const [direction, setDirection] = useState(1);

  const handleSubToggle = (side) => {
    if (side === subSide) return;
    setDirection(side === 'gears' ? 1 : -1);
    setSubSide(side);
  };

  // ⚠️ CRITICAL: Gate on ALL data props, not just profile.
  // Framer Motion's containerVariants (staggerChildren) fires once on mount.
  // If any section data is still null, its <motion.section> won't exist in the DOM,
  // and when the data arrives later the animation has already completed → sections stay invisible.
  // FIX: Block the entire animated tree until every data dependency is present.
  const isReady = profile && specs && setup && storyGames && currentlyPlaying && backlog && philosophy;
  if (!isReady) {
    return (
      <div className="hobbies-side">
        <div className="hobbies-bg-scanlines" />
        <div className="hobbies-bg-vignette" />
        <div className="hobbies-bg-accent-glow" />
      </div>
    );
  }

  return (
    <motion.div
      key="hobbies-loaded"
      className="hobbies-side"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Aggressive background effects */}
      <div className="hobbies-bg-scanlines" />
      <div className="hobbies-bg-vignette" />
      <div className="hobbies-bg-accent-glow" />

      {/* Hero Section */}
      <motion.section className="hobbies-hero" variants={itemVariants}>
        <div className="hobbies-hero-content">
          <div className="hobbies-avatar-wrapper">
            <div className="hobbies-avatar-placeholder">
              <OptimizedImage src={profile.avatar} alt="Profile" className="hobbies-avatar-img" width={160} height={160} />
            </div>
            <div className="hobbies-rank-badge">
              <Gamepad2 size={14} />
              <span>{profile.rankBadge}</span>
            </div>
          </div>
          <div className="hobbies-hero-text">
            <motion.div className="hobbies-tag-line" variants={itemVariants}>
              <Sparkles size={14} />
              <span>{profile.tagline}</span>
            </motion.div>
            <motion.h1 className="hobbies-gamertag" variants={itemVariants}>
              {profile.gamertag}
            </motion.h1>
            <motion.p className="hobbies-role" variants={itemVariants}>
              {profile.role}
            </motion.p>
            <motion.p className="hobbies-bio" variants={itemVariants}>
              {profile.bio}
            </motion.p>
            <motion.div className="hobbies-quick-stats" variants={itemVariants}>
              {profile.quickStats?.map((qs) => (
                <div key={qs.label} className="hobbies-quick-stat">
                  {iconMap[qs.icon] || <Gamepad2 size={18} />}
                  <div>
                    <span className="hobbies-qs-value">{qs.value}</span>
                    <span className="hobbies-qs-label">{qs.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Sub-side toggle: Games vs Gears */}
      <motion.div className="hobbies-sub-toggle" variants={itemVariants}>
        <button
          className={`hobbies-sub-btn ${subSide === 'games' ? 'active games' : ''}`}
          onClick={() => handleSubToggle('games')}
        >
          <Gamepad2 size={16} />
          <span>Games</span>
        </button>
        <button
          className={`hobbies-sub-btn ${subSide === 'gears' ? 'active gears' : ''}`}
          onClick={() => handleSubToggle('gears')}
        >
          <Cpu size={16} />
          <span>Gears & Specs</span>
        </button>
        {/* Animated underline */}
        <motion.div
          className="hobbies-sub-indicator"
          animate={{ x: subSide === 'games' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </motion.div>

      {/* Animated sub-content */}
      <AnimatePresence mode="wait" custom={direction}>
        {subSide === 'gears' ? (
          <motion.div
            key="gears"
            custom={direction}
            variants={subPageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* PC Rig Specifications Section */}
            {specs && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title gears-title">
                  <Cpu size={24} />
                  <span>PC Hardware Specifications</span>
                </h2>
                <div className="hobbies-specs-grid">
                  {specs.map((spec, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-spec-card"
                      whileHover={{ y: -4, borderColor: '#00e5ff' }}
                    >
                      <div className="hobbies-spec-icon-wrapper">
                        {iconMap[spec.icon] || <Cpu size={20} />}
                      </div>
                      <div className="hobbies-spec-info">
                        <span className="hobbies-spec-category">{spec.category}</span>
                        <h4 className="hobbies-spec-name">{spec.name}</h4>
                        <p className="hobbies-spec-detail">{spec.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Peripherals & Gears Section */}
            {setup && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title gears-title">
                  <Monitor size={24} />
                  <span>Peripherals & Battlestation Gears</span>
                </h2>
                <div className="hobbies-setup-grid">
                  {setup.map((gear, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-setup-card"
                      whileHover={{ y: -6, borderColor: '#00e5ff' }}
                    >
                      <div className="hobbies-setup-image-placeholder">
                        <OptimizedImage src={gear.image} alt={gear.item} className="hobbies-setup-img" width={200} height={140} />
                        {gear.category && (
                          <span className="hobbies-setup-tag">{gear.category}</span>
                        )}
                      </div>
                      <div className="hobbies-setup-info">
                        <h4>{gear.item}</h4>
                        <p>{gear.detail}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="games"
            custom={direction}
            variants={subPageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Favorite Story Games */}
            {storyGames && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title story-title">
                  <Heart size={24} />
                  <span>Favorite Story Games</span>
                </h2>
                <div className="hobbies-story-games-grid">
                  {storyGames.map((game, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-story-card"
                      whileHover={{ y: -6, borderColor: '#a855f7' }}
                    >
                      <div className="hobbies-story-image-placeholder">
                        <OptimizedImage src={game.image} alt={game.title} className="hobbies-story-img" width={560} height={180} />
                      </div>
                      <div className="hobbies-story-body">
                        <div className="hobbies-story-header">
                          <h3>{game.title}</h3>
                          <div className="hobbies-story-rating">
                            <Star size={14} />
                            <span>{game.rating}/10</span>
                          </div>
                        </div>
                        <div className="hobbies-story-meta">
                          <span className="hobbies-story-genre-tag">{game.genre}</span>
                          <span className="hobbies-story-hours">{game.hours}h played</span>
                          <span className={`hobbies-story-status-badge ${game.status.toLowerCase()}`}>{game.status}</span>
                        </div>
                        <p className="hobbies-story-desc">{game.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="hobbies-continue-banner">
                  <div className="hobbies-continue-inner">
                    <span className="hobbies-continue-text">TO BE CONTINUED...</span>
                  </div>
                </div>
              </section>
            )}

            {/* Currently Playing */}
            {currentlyPlaying && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title story-title">
                  <Clock size={24} />
                  <span>Currently Playing</span>
                </h2>
                <div className="hobbies-currently-playing">
                  {currentlyPlaying.map((game, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-playing-card"
                      whileHover={{ y: -4 }}
                    >
                      <div className="hobbies-playing-image-placeholder">
                        <OptimizedImage src={game.image} alt={game.title} className="hobbies-playing-img" width={380} height={122} />
                      </div>
                      <div className="hobbies-playing-info">
                        <h4>{game.title}</h4>
                        <span className="hobbies-playing-genre">{game.genre}</span>
                        <div className="hobbies-playing-progress">
                          <div className="hobbies-playing-bar-track">
                            <motion.div
                              className="hobbies-playing-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${game.progress}%` }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                            />
                          </div>
                          <span className="hobbies-playing-pct">{game.progress}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Backlog */}
            {backlog && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title story-title">
                  <Map size={24} />
                  <span>The Backlog</span>
                </h2>
                <p className="hobbies-backlog-subtitle">Games waiting for their turn. So many worlds, so little time.</p>
                <div className="hobbies-backlog-grid">
                  {backlog.map((game, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-backlog-item"
                      whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
                    >
                      <div className="hobbies-backlog-number">#{i + 1}</div>
                      <span>{game}</span>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Gaming Philosophy */}
            {philosophy && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title story-title">
                  <BookOpen size={24} />
                  <span>Gaming Philosophy</span>
                </h2>
                <div className="hobbies-philosophy-grid">
                  {philosophy.map((item, i) => (
                    <div key={i} className="hobbies-philosophy-card">
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
