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
import { imagePaths } from '../../imagePaths';
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
    title: '18K++ ELO on Premier',
    description: 'Reached medium-high competitive level on Official Premiere.',
    date: '2025',
    tier: 'rare',
  },
  // {
  //   title: 'Regional LAN Champion',
  //   description: 'Won 1st place at the Regional CS Championship with team "Phantom Protocol" — $10K prize pool.',
  //   date: '2024',
  //   tier: 'epic',
  // },
  // {
  //   title: 'ESEA Main Finalist',
  //   description: 'Led team to the Grand Finals of ESEA Main Season 42. Finished top 2 in the division.',
  //   date: '2024',
  //   tier: 'epic',
  // },
  // {
  //   title: 'Online Cup — 5x Winner',
  //   description: 'Dominated multiple online tournaments on platforms like Challengermode and FACEIT Cups.',
  //   date: '2023-2025',
  //   tier: 'rare',
  // },
  // {
  //   title: 'Stream Highlight Viral',
  //   description: 'An insane 1v5 clutch clip on Mirage went viral — 2.5M+ views across platforms.',
  //   date: '2024',
  //   tier: 'legendary',
  // },
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
  { item: 'LG 24GN600', detail: '144Hz, 1ms', image: imagePaths.setupMonitor },
  { item: 'Scyrox V8', detail: '38g, PAW3950, 2K Polling Rate', image: imagePaths.setupMouse },
  { item: 'Zifriend M68', detail: '68% Mechanical Hall Effect', image: imagePaths.setupKeyboard },
  { item: 'dbe GM210', detail: '7.1 Surround Sound', image: imagePaths.setupHeadset },
];

const storyGames = [
  {
    title: 'Persona 4 Golden',
    status: 'Completed',
    hours: 186,
    rating: "GOLDEN",
    description: 'A masterpiece of storytelling. Emotional at its peak, the best one in the series. I wrote a whole essay about how good this game is and passed my university course with it. Best Game Of All Time. Argue with a wall.',
    genre: 'Adventure-JRPG / Turn Based',
    image: imagePaths.story1,
  },
  {
    title: 'Red Dead Redemption 2',
    status: 'Completed',
    hours: 280,
    rating: 10,
    description: 'Arthur Morgan\'s journey is the greatest character arc in gaming. The slow pacing is intentional. Details like the dynamic weather and NPC interactions make the world feel alive. The story is a tragic masterpiece.',
    genre: 'Action-Adventure',
    image: imagePaths.story2,
  },
    {
    title: 'Elden Ring',
    status: 'Completed',
    hours: 73,
    rating: 10,
    description: 'FromSoft at their peak. Open world done right — every corner hides something terrifying and beautiful. Fuck Maliketh. Worth every death.',
    genre: 'Action RPG / Souls-like',
    image: imagePaths.story3,
  },
  {
    title: 'Kingdom Hearts 2',
    status: 'Completed',
    hours: 101,
    rating: 10,
    description: 'The best Kingdom Hearts game. The story is a masterpiece of emotional storytelling and character development. Thankyou for introducing me to gaming.',
    genre: 'Action-Adventure / RPG',
    image: imagePaths.story4,
  },
  {
    title: 'Clair Obscur: Expedition 33',
    status: 'Completed',
    hours: 96,
    rating: 9,
    description: 'A beautiful, atmospheric, and emotionally resonant game. The story is a masterpiece of character development and narrative depth. Somehow the ending really bothers me.',
    genre: 'Adventure-RPG / Turn Based',
    image: imagePaths.story5,
  },
  {
    title: 'Final Fantasy VII Remake Integrade',
    status: 'Completed',
    hours: 98,
    rating: 9,
    description: 'The best Final Fantasy VII game. The story is a masterpiece of emotional storytelling and character development. Though i never really played the original. Sorry for that.',
    genre: 'Action-Adventure',
    image: imagePaths.story6,
  },
  {
    title: 'Metaphor: ReFantazio',
    status: 'Completed',
    hours: 67,
    rating: 9,
    description: 'My 2024 GOTY. A stunningly beautiful and emotionally resonant game. The story is a masterpiece of character development and narrative depth. The combat is fun and rewarding. The world is a work of art. Diveristy is amazing. The only flaw is the pacing a bit rushed at the ending.',
    genre: 'Adventure-JRPG / Turn Based',
    image: imagePaths.story7,
  },
  {
    title: 'Persona 3 Reload',
    status: 'Completed',
    hours: 72,
    rating: 9,
    description: 'A great remake of a classic. The story is just as compelling as P4G, with a darker tone and more mature themes. The new combat system is a great improvement. The DLC is the weakest point of the series, not worth the money. Should have been free content. Atleast bring back Kotone.',
    genre: 'Adventure-JRPG / Turn Based',
    image: imagePaths.story8,
  },
  {
    title: 'God of War: Ragnarok',
    status: 'Completed',
    hours: 41,
    rating: 9,
    description: 'Really good expansion from the first one. Story deepens and really show how Kratos could fit in another world not just as a fighter but also a leader and.. hope. Really solid game, cant wait how atreus will develop in the next game. Hope they can make the game longer tho, pacing kinda fast.',
    genre: 'Action-Adventure / RPG',
    image: imagePaths.story9,
  },
  {
    title: 'Marvel Spiderman Remastered',
    status: 'Completed',
    hours: 27,
    rating: 9,
    description: 'A fun and emotional superhero game. The story is a heartfelt tribute to the character and his world. The DLC is a nice addition, but not essential. No fast-travel needed, peak traversal mechanism. Need more playtime. Finish in one sitting. Yes, 21 hours straight.',
    genre: 'Action-Adventure',
    image: imagePaths.story10,
  },
  {
    title: 'Persona 5 Royal',
    status: 'Completed',
    hours: 119,
    rating: 8,
    description: 'Best mechanics in the series. Arguably the best music and ambience. The story is good, but not as emotionally resonant as P4G or P3R. The DLC is a nice addition, but not essential. Overall a great game, but not my favorite in the series. Little note on the side characters, felt not deeply developed.',
    genre: 'Adventure-JRPG / Turn Based',
    image: imagePaths.story11,
  },
  {
    title: 'God of War (2018)',
    status: 'Completed',
    hours: 38,
    rating: 8,
    description: 'Really good reboot to the series, Kratos doesnt seem really fit in nordic mythology. Proves himself in Ragnarok. Though for me the story itself felt a bit underwhelming, i mean just about father and son sowing ashes. Its a really good build up. The way they develop every detail this game had in Ragnarok is insanely good.',
    genre: 'Adventure-JRPG / Turn Based',
    image: imagePaths.story12,
  },
];

const currentlyPlaying = [
  { title: 'Phoenix Wright: Ace Attorney Trilogy', progress: 65, genre: 'Visual Novel', image: imagePaths.game1 },
  { title: 'RAIDOU Remastered', progress: 40, genre: 'JRPG', image: imagePaths.game2 },
  { title: 'Shin Megami Tensei IV', progress: 25, genre: 'JRPG', image: imagePaths.game3 },
];

const highlightImages = [
  imagePaths.highlight1,
  imagePaths.highlight2,
  imagePaths.highlight3,
];

const backlog = [
  'Apollo Justice: Ace Attorney',
  'Black Myth: Wukong',
  'Metal Gear Solid V',
  'The Witcher 3: Wild Hunt',
  'Persona 6',
  'Grand Theft Auto VI',
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
              <img src={imagePaths.csAvatar} alt="Profile" className="cs-avatar-img" />
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
              Story Game Enthusiast &amp; Competitive Player 
            </motion.p>
            <motion.p className="cs-bio" variants={itemVariants}>
              Two sides of the same gamer. On one hand — head hunter in every 
              competitive match. On the other — someone who
              spends 200 hours in an RPG finding achievements.
            </motion.p>
            <motion.div className="cs-quick-stats" variants={itemVariants}>
              <div className="cs-quick-stat">
                <Crosshair size={18} />
                <div>
                  <span className="cs-qs-value">4,700+</span>
                  <span className="cs-qs-label">Competitive Hrs</span>
                </div>
              </div>
              <div className="cs-quick-stat">
                <BookOpen size={18} />
                <div>
                  <span className="cs-qs-value">800+</span>
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
            {/* <section className="cs-section">
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
            </section> */}

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
            {/* <section className="cs-section">
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
            </section> */}

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
                      <img src={gear.image} alt={gear.item} className="cs-setup-img" />
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
                  <span className="cs-setting-value">0.57</span>
                  <span className="cs-setting-detail">1600 DPI — eDPI: 912</span>
                </div>
                <div className="cs-setting-card">
                  <h4>Resolution</h4>
                  <span className="cs-setting-value">1280×1024</span>
                  <span className="cs-setting-detail">5:4 Stretched</span>
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
                  <span className="cs-setting-detail">fov 68</span>
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
                      <img src={highlightImages[num - 1]} alt={`Clip ${num}`} className="cs-highlight-img" />
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
                      <img src={game.image} alt={game.title} className="cs-story-img" />
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
              <div className="cs-continue-banner">
                <div className="cs-continue-inner">
                  <span className="cs-continue-text">TO BE CONTINUED...</span>
                </div>
              </div>
            </section>

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
                      <img src={game.image} alt={game.title} className="cs-playing-img" />
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
