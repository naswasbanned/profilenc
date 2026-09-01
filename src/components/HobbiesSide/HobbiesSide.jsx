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
  Film,
  Clapperboard,
} from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { GearIcon } from '../../utils/gearIconUtils';
import './HobbiesSide.css';

// Map icon string names from JSON to Lucide components
const iconMap = {
  Gamepad2: <Gamepad2 size={18} />,
  Film: <Film size={18} />,
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

const tabOrder = { games: 0, movies: 1, gears: 2 };

export default function HobbiesSide({
  profile,
  visibility = null,
  specs,
  setup,
  storyGames,
  currentlyPlaying,
  backlog,
  philosophy,
  movies,
  moviesWatching,
  moviesBacklog,
}) {
  const [subSide, setSubSide] = useState('games');
  const [direction, setDirection] = useState(1);

  // ⚠️ CRITICAL: Gate on ALL data props, not just profile.
  // Framer Motion's containerVariants (staggerChildren) fires once on mount.
  // FIX: Block the entire animated tree until every data dependency is present.
  const isReady =
    profile &&
    specs &&
    setup &&
    storyGames &&
    currentlyPlaying &&
    backlog &&
    philosophy &&
    movies &&
    moviesWatching &&
    moviesBacklog;

  if (!isReady) {
    return (
      <div className="hobbies-side">
        <div className="hobbies-bg-scanlines" />
        <div className="hobbies-bg-vignette" />
        <div className="hobbies-bg-accent-glow" />
      </div>
    );
  }

  // Dynamic available subtabs based on visibility controls
  const availableTabs = [
    { id: 'games', label: 'Games', icon: Gamepad2, visible: visibility?.gamesTab !== false && visibility?.games !== false },
    { id: 'movies', label: 'Movies & Series', icon: Film, visible: visibility?.moviesTab !== false && visibility?.movies !== false },
    { id: 'gears', label: 'Gears', icon: Cpu, visible: visibility?.gearsTab !== false && visibility?.gears !== false },
  ].filter((t) => t.visible);

  const activeSubSide = availableTabs.some((t) => t.id === subSide)
    ? subSide
    : (availableTabs[0]?.id || 'games');

  const activeTabIndex = availableTabs.findIndex((t) => t.id === activeSubSide);

  const handleSubToggle = (side) => {
    if (side === activeSubSide) return;
    const fromIdx = availableTabs.findIndex((t) => t.id === activeSubSide);
    const toIdx = availableTabs.findIndex((t) => t.id === side);
    setDirection(toIdx > fromIdx ? 1 : -1);
    setSubSide(side);
  };

  // Filter out hidden items
  const specsList = Array.isArray(specs) ? specs : [];
  const setupList = Array.isArray(setup) ? setup : [];
  const storyGamesList = Array.isArray(storyGames) ? storyGames : [];
  const currentlyPlayingList = Array.isArray(currentlyPlaying) ? currentlyPlaying : [];
  const backlogList = Array.isArray(backlog) ? backlog : [];
  const philosophyList = Array.isArray(philosophy) ? philosophy : [];
  const moviesList = Array.isArray(movies) ? movies : [];
  const moviesWatchingList = Array.isArray(moviesWatching) ? moviesWatching : [];
  const moviesBacklogList = Array.isArray(moviesBacklog) ? moviesBacklog : [];

  const activeSpecs = specsList.filter((s) => !s?.hidden);
  const activeSetup = setupList.filter((s) => !s?.hidden);
  const activeStoryGames = storyGamesList.filter((g) => !g?.hidden);
  const activeCurrentlyPlaying = currentlyPlayingList.filter((g) => !g?.hidden);
  const activeBacklog = backlogList.filter((g) => !g?.hidden);
  const activePhilosophy = philosophyList.filter((p) => !p?.hidden);
  const activeMovies = moviesList.filter((m) => !m?.hidden);
  const activeMoviesWatching = moviesWatchingList.filter((m) => !m?.hidden);
  const activeMoviesBacklog = moviesBacklogList.filter((m) => !m?.hidden);

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
      {visibility?.hero !== false && (
        <motion.section className="hobbies-hero" variants={itemVariants}>
          <div className="hobbies-hero-content">
            {visibility?.avatar !== false && profile.avatar && (
              <div className="hobbies-avatar-wrapper">
                <div className="hobbies-avatar-placeholder">
                  <OptimizedImage src={profile.avatar} alt="Profile" className="hobbies-avatar-img" width={160} height={160} />
                </div>
                {visibility?.rankBadge !== false && profile.rankBadge && (
                  <div className="hobbies-rank-badge">
                    <Gamepad2 size={14} />
                    <span>{profile.rankBadge}</span>
                  </div>
                )}
              </div>
            )}
            <div className="hobbies-hero-text">
              {visibility?.tagline !== false && profile.tagline && (
                <motion.div className="hobbies-tag-line" variants={itemVariants}>
                  <Sparkles size={14} />
                  <span>{profile.tagline}</span>
                </motion.div>
              )}
              {visibility?.gamertag !== false && profile.gamertag && (
                <motion.h1 className="hobbies-gamertag" variants={itemVariants}>
                  {profile.gamertag}
                </motion.h1>
              )}
              {visibility?.role !== false && profile.role && (
                <motion.p className="hobbies-role" variants={itemVariants}>
                  {profile.role}
                </motion.p>
              )}
              {visibility?.bio !== false && profile.bio && (
                <motion.p className="hobbies-bio" variants={itemVariants}>
                  {profile.bio}
                </motion.p>
              )}
              {visibility?.quickStats !== false && profile.quickStats && profile.quickStats.length > 0 && (
                <motion.div className="hobbies-quick-stats" variants={itemVariants}>
                  {profile.quickStats.map((qs) => (
                    <div key={qs.label} className="hobbies-quick-stat">
                      {iconMap[qs.icon] || <Gamepad2 size={18} />}
                      <div>
                        <span className="hobbies-qs-value">{qs.value}</span>
                        <span className="hobbies-qs-label">{qs.label}</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Sub-side toggle: Games vs Movies & Series vs Gears */}
      {availableTabs.length > 1 && (
        <motion.div className="hobbies-sub-toggle" variants={itemVariants}>
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`hobbies-sub-btn ${activeSubSide === tab.id ? `active ${tab.id}` : ''}`}
                onClick={() => handleSubToggle(tab.id)}
                style={{ flex: 1 }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
          {/* Animated underline */}
          <motion.div
            className={`hobbies-sub-indicator ${activeSubSide}`}
            style={{ width: `${100 / availableTabs.length}%` }}
            animate={{ x: `${(activeTabIndex >= 0 ? activeTabIndex : 0) * 100}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </motion.div>
      )}

      {/* Animated sub-content */}
      <AnimatePresence mode="wait" custom={direction}>
        {activeSubSide === 'gears' && (
          <motion.div
            key="gears"
            custom={direction}
            variants={subPageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* PC Rig Specifications Section */}
            {visibility?.specs !== false && activeSpecs.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title gears-title">
                  <Cpu size={24} />
                  <span>PC Hardware Specifications</span>
                </h2>
                    <div className="hobbies-specs-grid">
                      {activeSpecs.map((spec, i) => (
                        <motion.div
                          key={i}
                          className="hobbies-spec-card"
                          whileHover={{ y: -4, borderColor: '#00e5ff' }}
                        >
                          <div className="hobbies-spec-icon-wrapper">
                            <GearIcon icon={spec.icon} category={spec.category} name={spec.name} size={20} />
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
            {visibility?.setup !== false && activeSetup.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title gears-title">
                  <Monitor size={24} />
                  <span>Peripherals & Battlestation Gears</span>
                </h2>
                <div className="hobbies-setup-grid">
                  {activeSetup.map((gear, i) => (
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
        )}

        {activeSubSide === 'movies' && (
          <motion.div
            key="movies"
            custom={direction}
            variants={subPageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Favorite Movies & Series */}
            {visibility?.moviesList !== false && activeMovies.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title movies-title">
                  <Film size={24} />
                  <span>Favorite Movies & Series</span>
                </h2>
                <div className="hobbies-story-games-grid">
                  {activeMovies.map((movie, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-story-card hobbies-movie-card"
                      whileHover={{ y: -6, borderColor: '#f59e0b' }}
                    >
                      <div className="hobbies-story-image-placeholder hobbies-movie-image-cover">
                        <OptimizedImage src={movie.image} alt={movie.title} className="hobbies-story-img" width={560} height={180} />
                        {movie.type && (
                          <span className={`hobbies-movie-type-badge type-${movie.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                            {movie.type}
                          </span>
                        )}
                      </div>
                      <div className="hobbies-story-body">
                        <div className="hobbies-story-header">
                          <h3>{movie.title}</h3>
                          <div className="hobbies-story-rating movies-rating">
                            <Star size={14} />
                            <span>{movie.rating}{typeof movie.rating === 'number' ? '/10' : ''}</span>
                          </div>
                        </div>
                        <div className="hobbies-story-meta">
                          <span className="hobbies-story-genre-tag">{movie.genre}</span>
                          {movie.year && <span className="hobbies-movie-year-tag">{movie.year}</span>}
                          {movie.episodes && <span className="hobbies-movie-ep-tag">{movie.episodes}</span>}
                          {movie.director && <span className="hobbies-movie-dir-tag">Dir. {movie.director}</span>}
                          <span className={`hobbies-story-status-badge ${(movie.status || 'completed').toLowerCase().replace(/\s+/g, '-')}`}>
                            {movie.status || 'Completed'}
                          </span>
                        </div>
                        <p className="hobbies-story-desc">{movie.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Currently Watching */}
            {visibility?.moviesWatching !== false && activeMoviesWatching.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title movies-title">
                  <Clock size={24} />
                  <span>Currently Watching</span>
                </h2>
                <div className="hobbies-currently-playing">
                  {activeMoviesWatching.map((item, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-playing-card hobbies-watching-card"
                      whileHover={{ y: -4, borderColor: '#f59e0b' }}
                    >
                      <div className="hobbies-playing-image-placeholder">
                        <OptimizedImage src={item.image} alt={item.title} className="hobbies-playing-img" width={380} height={122} />
                        {item.currentEpisode && (
                          <span className="hobbies-watching-ep-badge">{item.currentEpisode}</span>
                        )}
                      </div>
                      <div className="hobbies-playing-info">
                        <h4>{item.title}</h4>
                        <span className="hobbies-playing-genre">{item.genre}</span>
                        <div className="hobbies-playing-progress">
                          <div className="hobbies-playing-bar-track">
                            <motion.div
                              className="hobbies-playing-bar-fill movies-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                            />
                          </div>
                          <span className="hobbies-playing-pct">{item.progress}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Movies & Series Watchlist / Backlog */}
            {visibility?.moviesBacklog !== false && moviesBacklog && moviesBacklog.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title movies-title">
                  <Map size={24} />
                  <span>The Cinema & Series Watchlist</span>
                </h2>
                <p className="hobbies-backlog-subtitle">Films and shows queued up for movie nights and weekend binges.</p>
                <div className="hobbies-backlog-grid">
                  {moviesBacklog.map((title, i) => (
                    <motion.div
                      key={i}
                      className="hobbies-backlog-item hobbies-movie-backlog-item"
                      whileHover={{ scale: 1.05, borderColor: '#f59e0b' }}
                    >
                      <div className="hobbies-backlog-number movies-backlog-num">#{i + 1}</div>
                      <span>{title}</span>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {activeSubSide === 'games' && (
          <motion.div
            key="games"
            custom={direction}
            variants={subPageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Favorite Story Games */}
            {visibility?.storyGames !== false && activeStoryGames.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title story-title">
                  <Heart size={24} />
                  <span>Favorite Story Games</span>
                </h2>
                <div className="hobbies-story-games-grid">
                  {activeStoryGames.map((game, i) => (
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
            {visibility?.currentlyPlaying !== false && activeCurrentlyPlaying.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title story-title">
                  <Clock size={24} />
                  <span>Currently Playing</span>
                </h2>
                <div className="hobbies-currently-playing">
                  {activeCurrentlyPlaying.map((game, i) => (
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
            {visibility?.backlog !== false && backlog && backlog.length > 0 && (
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
            {visibility?.philosophy !== false && activePhilosophy.length > 0 && (
              <section className="hobbies-section">
                <h2 className="hobbies-section-title story-title">
                  <BookOpen size={24} />
                  <span>Gaming Philosophy</span>
                </h2>
                <div className="hobbies-philosophy-grid">
                  {activePhilosophy.map((item, i) => (
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
