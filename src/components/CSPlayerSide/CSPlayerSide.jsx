import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crosshair,
  Trophy,
  Swords,
  Target,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Monitor,
  Headphones,
  Mouse,
  Keyboard,
  Award,
  Flame,
  ChevronRight,
  Gamepad2,
  BookOpen,
  Heart,
  Star,
  Clock,
  Map,
} from 'lucide-react';
import './CSPlayerSide.css';

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

const stats = [
  { label: 'K/D Ratio', value: '1.34', icon: <Crosshair size={18} /> },
  { label: 'Headshot %', value: '62.7%', icon: <Target size={18} /> },
  { label: 'Win Rate', value: '68%', icon: <TrendingUp size={18} /> },
  { label: 'Matches', value: '3,847', icon: <Swords size={18} /> },
  { label: 'MVPs', value: '1,204', icon: <Award size={18} /> },
  { label: 'Clutches', value: '487', icon: <Flame size={18} /> },
];

const achievements = [
  {
    title: 'FACEIT Level 10',
    description: 'Reached the highest competitive level on FACEIT with 3,200+ ELO.',
    date: '2025',
    tier: 'legendary',
  },
  {
    title: 'Regional LAN Champion',
    description: 'Won 1st place at the Regional CS Championship with team "Phantom Protocol" — $10K prize pool.',
    date: '2024',
    tier: 'epic',
  },
  {
    title: 'ESEA Main Finalist',
    description: 'Led team to the Grand Finals of ESEA Main Season 42. Finished top 2 in the division.',
    date: '2024',
    tier: 'epic',
  },
  {
    title: 'Online Cup — 5x Winner',
    description: 'Dominated multiple online tournaments on platforms like Challengermode and FACEIT Cups.',
    date: '2023-2025',
    tier: 'rare',
  },
  {
    title: 'Stream Highlight Viral',
    description: 'An insane 1v5 clutch clip on Mirage went viral — 2.5M+ views across platforms.',
    date: '2024',
    tier: 'legendary',
  },
];

const maps = [
  { name: 'Mirage', winrate: 76, rounds: 842 },
  { name: 'Inferno', winrate: 71, rounds: 756 },
  { name: 'Dust 2', winrate: 68, rounds: 690 },
  { name: 'Anubis', winrate: 65, rounds: 523 },
  { name: 'Nuke', winrate: 62, rounds: 418 },
  { name: 'Ancient', winrate: 58, rounds: 387 },
];

const team = [
  { name: 'NAS', role: 'Entry Fragger / IGL', status: 'You' },
  { name: 'PhantomX', role: 'AWPer', status: 'Online' },
  { name: 'GhostRider', role: 'Support', status: 'In Match' },
  { name: 'VoltEdge', role: 'Lurker', status: 'Online' },
  { name: 'Fr0stByte', role: 'Rifler', status: 'Offline' },
];

const setup = [
  { item: 'Monitor', detail: '240Hz IPS, 1ms', icon: <Monitor size={18} /> },
  { item: 'Mouse', detail: 'Lightweight, 50g, PAW3395', icon: <Mouse size={18} /> },
  { item: 'Keyboard', detail: '60% Mechanical, Hall Effect', icon: <Keyboard size={18} /> },
  { item: 'Headset', detail: 'Open-back, Hi-Res Audio', icon: <Headphones size={18} /> },
];

const storyGames = [
  {
    title: 'The Witcher 3: Wild Hunt',
    status: 'Completed',
    hours: 186,
    rating: 10,
    description: 'A masterpiece of storytelling. The Bloody Baron questline alone is better than most full games. Did every side quest, both DLCs. Hearts of Stone hit different.',
    genre: 'RPG / Open World',
    image: null,
  },
  {
    title: 'Red Dead Redemption 2',
    status: 'Completed',
    hours: 142,
    rating: 10,
    description: 'Arthur Morgan\'s journey is the greatest character arc in gaming. The slow pacing is intentional — it makes you *live* in that world. Cried at the ending.',
    genre: 'Action-Adventure',
    image: null,
  },
  {
    title: 'God of War: Ragnarök',
    status: 'Completed',
    hours: 68,
    rating: 9,
    description: 'Father and son, gods and mortals. The combat evolution is insane and the story delivers on every front. That final act is pure cinema.',
    genre: 'Action-Adventure',
    image: null,
  },
  {
    title: 'Elden Ring',
    status: 'Completed',
    hours: 210,
    rating: 10,
    description: 'FromSoft at their peak. Open world done right — every corner hides something terrifying and beautiful. Malenia took me 47 attempts. Worth every death.',
    genre: 'Action RPG / Souls-like',
    image: null,
  },
  {
    title: 'Baldur\'s Gate 3',
    status: 'Completed',
    hours: 156,
    rating: 10,
    description: 'The new gold standard for CRPGs. Every choice matters, every playthrough is different. The depth of reactivity is unmatched. Did 3 full runs.',
    genre: 'RPG / Turn-Based',
    image: null,
  },
  {
    title: 'Cyberpunk 2077: Phantom Liberty',
    status: 'Completed',
    hours: 98,
    rating: 9,
    description: 'The glow-up of the decade. Night City after 2.0 is the best open world ever crafted. Phantom Liberty\'s spy thriller story is a banger.',
    genre: 'Action RPG',
    image: null,
  },
];

const currentlyPlaying = [
  { title: 'Ghost of Tsushima', progress: 65, genre: 'Action-Adventure' },
  { title: 'Disco Elysium', progress: 40, genre: 'RPG' },
  { title: 'Hollow Knight: Silksong', progress: 25, genre: 'Metroidvania' },
];

const backlog = [
  'Death Stranding 2',
  'Final Fantasy VII Rebirth',
  'Metaphor: ReFantazio',
  'Hades II',
  'Silksong (remaining)',
  'Black Myth: Wukong',
];

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

export default function CSPlayerSide() {
  const [subSide, setSubSide] = useState('casual');
  const [direction, setDirection] = useState(1);

  const handleSubToggle = (side) => {
    if (side === subSide) return;
    setDirection(side === 'competitive' ? 1 : -1);
    setSubSide(side);
  };

  return (
    <motion.div
      className="cs-side"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Aggressive background effects */}
      <div className="cs-bg-scanlines" />
      <div className="cs-bg-vignette" />
      <div className="cs-bg-accent-glow" />

      {/* Hero Section */}
      <motion.section className="cs-hero" variants={itemVariants}>
        <div className="cs-hero-content">
          <div className="cs-avatar-wrapper">
            <div className="cs-avatar-placeholder">
              <Gamepad2 size={56} />
            </div>
            <div className="cs-rank-badge">
              <Gamepad2 size={14} />
              <span>GAMER</span>
            </div>
          </div>
          <div className="cs-hero-text">
            <motion.div className="cs-tag-line" variants={itemVariants}>
              <Zap size={14} />
              <span>GAMER</span>
            </motion.div>
            <motion.h1 className="cs-gamertag" variants={itemVariants}>
              NAS
            </motion.h1>
            <motion.p className="cs-role" variants={itemVariants}>
              Competitive CS Player &amp; Story Game Enthusiast
            </motion.p>
            <motion.p className="cs-bio" variants={itemVariants}>
              Two sides of the same gamer. On one hand — a ruthless entry fragger
              hunting FACEIT ELO and LAN trophies. On the other — someone who
              spends 200 hours in an RPG talking to every NPC, reading every lore
              note, and crying at the credits. Gaming isn't just a hobby, it's a
              lifestyle.
            </motion.p>
            <motion.div className="cs-quick-stats" variants={itemVariants}>
              <div className="cs-quick-stat">
                <Crosshair size={18} />
                <div>
                  <span className="cs-qs-value">3,200+</span>
                  <span className="cs-qs-label">FACEIT ELO</span>
                </div>
              </div>
              <div className="cs-quick-stat">
                <BookOpen size={18} />
                <div>
                  <span className="cs-qs-value">860+</span>
                  <span className="cs-qs-label">Story Hrs</span>
                </div>
              </div>
              <div className="cs-quick-stat">
                <Heart size={18} />
                <div>
                  <span className="cs-qs-value">42</span>
                  <span className="cs-qs-label">Games Beat</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Sub-side toggle */}
      <motion.div className="cs-sub-toggle" variants={itemVariants}>
        <button
          className={`cs-sub-btn ${subSide === 'casual' ? 'active casual' : ''}`}
          onClick={() => handleSubToggle('casual')}
        >
          <BookOpen size={16} />
          <span>Casual</span>
        </button>
        <button
          className={`cs-sub-btn ${subSide === 'competitive' ? 'active competitive' : ''}`}
          onClick={() => handleSubToggle('competitive')}
        >
          <Crosshair size={16} />
          <span>Competitive</span>
        </button>
        {/* Animated underline */}
        <motion.div
          className="cs-sub-indicator"
          animate={{ x: subSide === 'casual' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </motion.div>

      {/* Animated sub-content */}
      <AnimatePresence mode="wait" custom={direction}>
        {subSide === 'competitive' ? (
          <motion.div
            key="competitive"
            custom={direction}
            variants={subPageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Stats Grid */}
            <section className="cs-section">
              <h2 className="cs-section-title">
                <Target size={24} />
                <span>Career Stats</span>
              </h2>
              <div className="cs-stats-grid">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="cs-stat-card"
                    whileHover={{ scale: 1.05, borderColor: '#ff4655' }}
                  >
                    <div className="cs-stat-icon">{stat.icon}</div>
                    <span className="cs-stat-value">{stat.value}</span>
                    <span className="cs-stat-label">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Map Stats */}
            <section className="cs-section">
              <h2 className="cs-section-title">
                <Crosshair size={24} />
                <span>Map Performance</span>
              </h2>
              <div className="cs-maps-list">
                {maps.map((map, i) => (
                  <motion.div
                    key={map.name}
                    className="cs-map-item"
                    whileHover={{ x: 8 }}
                  >
                    <div className="cs-map-rank">#{i + 1}</div>
                    <div className="cs-map-image-placeholder">
                      <span>{map.name[0]}</span>
                    </div>
                    <div className="cs-map-info">
                      <h4>{map.name}</h4>
                      <span className="cs-map-rounds">{map.rounds} rounds played</span>
                    </div>
                    <div className="cs-map-winrate">
                      <div className="cs-map-bar-track">
                        <motion.div
                          className="cs-map-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${map.winrate}%` }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                        />
                      </div>
                      <span className="cs-map-winrate-value">{map.winrate}% WR</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section className="cs-section">
              <h2 className="cs-section-title">
                <Trophy size={24} />
                <span>Achievements & Tournaments</span>
              </h2>
              <div className="cs-achievements-list">
                {achievements.map((ach, i) => (
                  <motion.div
                    key={i}
                    className={`cs-achievement-card tier-${ach.tier}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="cs-ach-icon">
                      <Trophy size={24} />
                    </div>
                    <div className="cs-ach-content">
                      <div className="cs-ach-header">
                        <h3>{ach.title}</h3>
                        <span className={`cs-ach-tier tier-${ach.tier}`}>{ach.tier}</span>
                      </div>
                      <p>{ach.description}</p>
                      <span className="cs-ach-date">{ach.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Team Roster */}
            <section className="cs-section">
              <h2 className="cs-section-title">
                <Users size={24} />
                <span>Team — Phantom Protocol</span>
              </h2>
              <div className="cs-team-roster">
                {team.map((member, i) => (
                  <motion.div
                    key={i}
                    className={`cs-team-member ${member.status === 'You' ? 'is-you' : ''}`}
                    whileHover={{ x: 6 }}
                  >
                    <div className="cs-member-avatar">
                      <Shield size={20} />
                    </div>
                    <div className="cs-member-info">
                      <h4>
                        {member.name}
                        {member.status === 'You' && <span className="cs-you-badge">YOU</span>}
                      </h4>
                      <span className="cs-member-role">{member.role}</span>
                    </div>
                    <div className={`cs-member-status status-${member.status.toLowerCase().replace(' ', '-')}`}>
                      <span className="cs-status-dot" />
                      <span>{member.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Setup / Gear */}
            <section className="cs-section">
              <h2 className="cs-section-title">
                <Monitor size={24} />
                <span>Gaming Setup</span>
              </h2>
              <div className="cs-setup-grid">
                {setup.map((gear, i) => (
                  <motion.div
                    key={i}
                    className="cs-setup-card"
                    whileHover={{ y: -4, borderColor: '#ff4655' }}
                  >
                    <div className="cs-setup-image-placeholder">
                      {gear.icon}
                      <span>Placeholder</span>
                    </div>
                    <div className="cs-setup-info">
                      <h4>{gear.item}</h4>
                      <p>{gear.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Crosshair / Settings */}
            <section className="cs-section">
              <h2 className="cs-section-title">
                <Crosshair size={24} />
                <span>In-Game Settings</span>
              </h2>
              <div className="cs-settings-grid">
                <div className="cs-setting-card">
                  <h4>Sensitivity</h4>
                  <span className="cs-setting-value">0.8</span>
                  <span className="cs-setting-detail">400 DPI — eDPI: 320</span>
                </div>
                <div className="cs-setting-card">
                  <h4>Resolution</h4>
                  <span className="cs-setting-value">1280×960</span>
                  <span className="cs-setting-detail">4:3 Stretched</span>
                </div>
                <div className="cs-setting-card">
                  <h4>Crosshair</h4>
                  <div className="cs-crosshair-preview">
                    <div className="cs-ch-h" />
                    <div className="cs-ch-v" />
                    <div className="cs-ch-dot" />
                  </div>
                  <span className="cs-setting-detail">Static, Gap -3, Size 2</span>
                </div>
                <div className="cs-setting-card">
                  <h4>Viewmodel</h4>
                  <span className="cs-setting-value">Custom</span>
                  <span className="cs-setting-detail">fov_cs_debug 110</span>
                </div>
              </div>
            </section>

            {/* Highlight Reel */}
            <section className="cs-section">
              <h2 className="cs-section-title">
                <Flame size={24} />
                <span>Highlight Reel</span>
              </h2>
              <div className="cs-highlights-grid">
                {[1, 2, 3].map((num) => (
                  <motion.div
                    key={num}
                    className="cs-highlight-card"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="cs-highlight-thumbnail">
                      <Crosshair size={32} />
                      <span>Clip #{num}</span>
                      <div className="cs-play-overlay">
                        <ChevronRight size={36} />
                      </div>
                    </div>
                    <div className="cs-highlight-info">
                      <h4>
                        {num === 1
                          ? '1v5 Clutch on Mirage'
                          : num === 2
                          ? 'AWP Ace — Inferno B Site'
                          : 'Deagle 4K Highlight'}
                      </h4>
                      <span className="cs-highlight-views">
                        {num === 1 ? '2.5M views' : num === 2 ? '890K views' : '456K views'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="casual"
            custom={direction}
            variants={subPageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Currently Playing */}
            <section className="cs-section">
              <h2 className="cs-section-title story-title">
                <Clock size={24} />
                <span>Currently Playing</span>
              </h2>
              <div className="cs-currently-playing">
                {currentlyPlaying.map((game, i) => (
                  <motion.div
                    key={i}
                    className="cs-playing-card"
                    whileHover={{ y: -4 }}
                  >
                    <div className="cs-playing-image-placeholder">
                      <Gamepad2 size={28} />
                      <span>Placeholder</span>
                    </div>
                    <div className="cs-playing-info">
                      <h4>{game.title}</h4>
                      <span className="cs-playing-genre">{game.genre}</span>
                      <div className="cs-playing-progress">
                        <div className="cs-playing-bar-track">
                          <motion.div
                            className="cs-playing-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${game.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                          />
                        </div>
                        <span className="cs-playing-pct">{game.progress}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Favorite Story Games */}
            <section className="cs-section">
              <h2 className="cs-section-title story-title">
                <Heart size={24} />
                <span>Favorite Story Games</span>
              </h2>
              <div className="cs-story-games-grid">
                {storyGames.map((game, i) => (
                  <motion.div
                    key={i}
                    className="cs-story-card"
                    whileHover={{ y: -6, borderColor: '#a855f7' }}
                  >
                    <div className="cs-story-image-placeholder">
                      <BookOpen size={32} />
                      <span>Cover Art</span>
                    </div>
                    <div className="cs-story-body">
                      <div className="cs-story-header">
                        <h3>{game.title}</h3>
                        <div className="cs-story-rating">
                          <Star size={14} />
                          <span>{game.rating}/10</span>
                        </div>
                      </div>
                      <div className="cs-story-meta">
                        <span className="cs-story-genre-tag">{game.genre}</span>
                        <span className="cs-story-hours">{game.hours}h played</span>
                        <span className={`cs-story-status-badge ${game.status.toLowerCase()}`}>{game.status}</span>
                      </div>
                      <p className="cs-story-desc">{game.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Backlog */}
            <section className="cs-section">
              <h2 className="cs-section-title story-title">
                <Map size={24} />
                <span>The Backlog</span>
              </h2>
              <p className="cs-backlog-subtitle">Games waiting for their turn. So many worlds, so little time.</p>
              <div className="cs-backlog-grid">
                {backlog.map((game, i) => (
                  <motion.div
                    key={i}
                    className="cs-backlog-item"
                    whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
                  >
                    <div className="cs-backlog-number">#{i + 1}</div>
                    <span>{game}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Gaming Philosophy */}
            <section className="cs-section">
              <h2 className="cs-section-title story-title">
                <BookOpen size={24} />
                <span>Gaming Philosophy</span>
              </h2>
              <div className="cs-philosophy-grid">
                <div className="cs-philosophy-card">
                  <h4>"Games are art."</h4>
                  <p>A well-crafted story in a game hits harder than any movie or book. The interactivity makes you <em>part</em> of the narrative, not just a spectator.</p>
                </div>
                <div className="cs-philosophy-card">
                  <h4>"Completionism is a lifestyle."</h4>
                  <p>If there's a side quest, I'm doing it. If there's a hidden cave, I'm exploring it. 100% or bust. Every achievement, every collectible, every secret ending.</p>
                </div>
                <div className="cs-philosophy-card">
                  <h4>"Difficulty = Respect."</h4>
                  <p>I play on the hardest difficulty first. Elden Ring, Sekiro, Baldur's Gate on Honour Mode — the struggle is what makes victory meaningful.</p>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
