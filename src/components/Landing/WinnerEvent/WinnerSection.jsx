import { useId } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { HeartHandshake, PartyPopper, Quote, Sparkles, Users } from 'lucide-react';
import TrophyArt from './TrophyArt';
import WinnerCertificate from './WinnerCertificate';
import { WINNER_EVENT } from './winnerEvent.config';
import './WinnerEvent.css';

const TONES = ['butter', 'mint', 'lavender', 'coral', 'blue'];
const NOTE_TONES = ['butter', 'mint', 'lavender', 'coral'];
const CARD_TILTS = [-4, 3, -2.5, 4, -3, 2];
const NOTE_TILTS = [-2, 1.5, -1, 2.5, -1.5, 1];

// Paper bits drifting in the section background, placed so they never sit
// behind text: "edge" bits live in the side margins (shown only on screens
// wide enough to have margins), "top" bits in the section's top padding.
const BITS = [
  { place: 'edge', left: '2.5%', top: '8%', w: 14, h: 14, tone: 'butter', round: true, rotate: 0, duration: 7, delay: 0 },
  { place: 'edge', left: '3.2%', top: '24%', w: 24, h: 8, tone: 'coral', rotate: 28, duration: 8.5, delay: 1.2 },
  { place: 'edge', left: '1.8%', top: '46%', w: 12, h: 12, tone: 'mint', rotate: 45, duration: 6.5, delay: 0.6 },
  { place: 'edge', left: '3%', top: '70%', w: 18, h: 18, tone: 'lavender', round: true, rotate: 0, duration: 9, delay: 2 },
  { place: 'edge', left: '96%', top: '10%', w: 20, h: 8, tone: 'mint', rotate: -18, duration: 7.5, delay: 0.4 },
  { place: 'edge', left: '97%', top: '28%', w: 14, h: 14, tone: 'coral', round: true, rotate: 0, duration: 8, delay: 1.6 },
  { place: 'edge', left: '95.6%', top: '48%', w: 12, h: 12, tone: 'butter', rotate: 45, duration: 6.8, delay: 1.1 },
  { place: 'edge', left: '96.4%', top: '68%', w: 24, h: 8, tone: 'lavender', rotate: 12, duration: 9.5, delay: 0.2 },
  { place: 'top', left: '24%', top: '46px', w: 10, h: 10, tone: 'blue', round: true, rotate: 0, duration: 6, delay: 0.9 },
  { place: 'top', left: '74%', top: '70px', w: 16, h: 6, tone: 'butter', rotate: -30, duration: 7, delay: 2.4 },
];

const TITLE_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const WORD_VARIANTS = {
  hidden: { y: '105%', rotate: 4 },
  visible: { y: '0%', rotate: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const LIST_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// Polaroids are dealt onto the table: they fly up from below, over-rotated,
// and settle at their own small tilt.
const POLAROID_VARIANTS = {
  hidden: (index) => ({
    opacity: 0,
    y: 90,
    scale: 0.8,
    rotate: CARD_TILTS[index % CARD_TILTS.length] * -3,
  }),
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: CARD_TILTS[index % CARD_TILTS.length],
    transition: { type: 'spring', stiffness: 150, damping: 15 },
  }),
};

// Notes drop down onto their pins with a small bounce.
const NOTE_VARIANTS = {
  hidden: (index) => ({
    opacity: 0,
    y: -46,
    scale: 1.06,
    rotate: NOTE_TILTS[index % NOTE_TILTS.length] * 4,
  }),
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: NOTE_TILTS[index % NOTE_TILTS.length],
    transition: { type: 'spring', stiffness: 230, damping: 15 },
  }),
};

const HOVER_SPRING = { type: 'spring', stiffness: 300, damping: 18 };

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

/** Headline whose words slide up from behind their own masks. */
function SectionTitle({ titleTop, titleAccent }) {
  const toWords = (text, accent) =>
    text
      .split(' ')
      .filter(Boolean)
      .map((word) => ({ word, accent }));

  const renderWord = ({ word, accent }, index) => (
    <span key={`${word}-${index}`}>
      {/* Real spaces keep the heading a readable sentence for screen readers */}
      {index > 0 && ' '}
      <span className="wn-word-mask">
        <motion.span className={`wn-word${accent ? ' is-accent' : ''}`} variants={WORD_VARIANTS}>
          {word}
        </motion.span>
      </span>
    </span>
  );

  return (
    <motion.h2
      id="wn-title"
      className="wn-title"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={TITLE_VARIANTS}
    >
      {toWords(titleTop, false).map(renderWord)}
      <br />
      {toWords(titleAccent, true).map(renderWord)}
    </motion.h2>
  );
}

/**
 * Rotating trophy emblem. It is also the replay control: pressing it brings
 * the entry celebration back.
 */
function Emblem({ onReplay }) {
  const { section, competition } = WINNER_EVENT;
  // useId output contains characters that are awkward in a URL fragment.
  const ringId = `wn-ring-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <div className="wn-emblem-col">
      <motion.button
        type="button"
        className="wn-emblem"
        onClick={onReplay}
        aria-label="Replay the first place celebration"
        initial={{ opacity: 0, scale: 0.4, rotate: -120 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 150, damping: 14 }}
      >
        <svg className="wn-emblem-ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <defs>
            <path id={ringId} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
          </defs>
          <circle className="wn-emblem-disc" cx="100" cy="100" r="97" />
          <circle className="wn-emblem-rule" cx="100" cy="100" r="64" />
          <text className="wn-emblem-text">
            {/* textLength stretches the run to exactly one lap of the circle */}
            <textPath href={`#${ringId}`} textLength="502" lengthAdjust="spacing">
              {section.emblemText.toUpperCase()}
            </textPath>
          </text>
        </svg>
        <span className="wn-emblem-core">
          <TrophyArt sparkles={false} />
        </span>
      </motion.button>

      <p className="wn-emblem-hint">
        <PartyPopper size={14} aria-hidden="true" /> Tap the trophy to replay the moment
      </p>

      <motion.dl
        className="wn-highlights"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="wn-highlight">
          <dt>Placement</dt>
          <dd>{competition.placementLabel}</dd>
        </div>
        <div className="wn-highlight">
          <dt>Category</dt>
          <dd>{competition.category}</dd>
        </div>
        <div className="wn-highlight">
          <dt>Year</dt>
          <dd>{competition.year}</dd>
        </div>
      </motion.dl>
    </div>
  );
}

function BlockHead({ icon, kicker, title, meta }) {
  return (
    <motion.div
      className="wn-block-head"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <p className="wn-block-kicker">
          {icon} {kicker}
        </p>
        <h3 className="wn-block-title">{title}</h3>
      </div>
      {meta && <span className="wn-block-meta">{meta}</span>}
    </motion.div>
  );
}

function TeamBoard({ team }) {
  return (
    <div className="wn-block">
      <BlockHead
        icon={<Users size={14} aria-hidden="true" />}
        kicker="The team"
        title="The people who built it."
        meta={`${team.length} ${team.length === 1 ? 'member' : 'members'}`}
      />

      <motion.ul
        className="wn-team"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={LIST_VARIANTS}
      >
        {team.map((member, index) => (
          <motion.li
            key={`${member.name}-${index}`}
            className="wn-polaroid"
            custom={index}
            variants={POLAROID_VARIANTS}
            whileHover={{ rotate: 0, y: -10, scale: 1.03, transition: HOVER_SPRING }}
            style={{
              '--tone': `var(--${TONES[index % TONES.length]})`,
              '--tape-rotate': `${index % 2 === 0 ? -4 : 5}deg`,
            }}
          >
            <div className="wn-polaroid-photo">
              {member.photo ? (
                <img src={member.photo} alt={member.name} loading="lazy" decoding="async" />
              ) : (
                <span className="wn-monogram" aria-hidden="true">
                  {initialsOf(member.name)}
                </span>
              )}
            </div>
            <p className="wn-polaroid-name">{member.name}</p>
            <p className="wn-polaroid-role">{member.role}</p>
            {member.note && <p className="wn-polaroid-note">{member.note}</p>}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function ThanksBoard({ thanks }) {
  return (
    <div className="wn-block">
      <BlockHead
        icon={<HeartHandshake size={14} aria-hidden="true" />}
        kicker="Special thanks"
        title="With gratitude to."
      />

      <motion.ul
        className="wn-thanks"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={LIST_VARIANTS}
      >
        {thanks.map((person, index) => {
          const tone = NOTE_TONES[index % NOTE_TONES.length];
          return (
            <motion.li
              key={`${person.name}-${index}`}
              className="wn-note"
              custom={index}
              variants={NOTE_VARIANTS}
              whileHover={{ rotate: 0, y: -6, transition: HOVER_SPRING }}
              style={{
                '--tone': `var(--${tone})`,
                // A coral note gets a butter pin so the pin still stands out
                '--pin': `var(--${tone === 'coral' ? 'butter' : 'coral'})`,
              }}
            >
              <Quote size={20} className="wn-note-quote" aria-hidden="true" />
              {person.note && <p className="wn-note-text">{person.note}</p>}
              <p className="wn-note-name">{person.name}</p>
              {person.role && <p className="wn-note-role">{person.role}</p>}
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

function RibbonBand({ variant, items }) {
  // One run is repeated until it is wider than any screen, then rendered
  // twice: sliding the track by exactly half makes the loop seamless.
  const run = Array.from({ length: 4 }, () => items).flat();

  return (
    <div className={`wn-ribbon is-${variant}`}>
      <div className="wn-ribbon-track">
        {[0, 1].map((copy) => (
          <div className="wn-ribbon-group" key={copy}>
            {run.map((item, index) => (
              <span className="wn-ribbon-item" key={`${copy}-${index}`}>
                {item}
                <span className="wn-ribbon-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two crossed ribbons closing the section: a thank-you roll over the win. */
function Ribbons() {
  const { thanks, competition, celebration } = WINNER_EVENT;
  const front = ['Thank you', ...thanks.map((person) => person.name)];
  const back = [competition.placementLabel, celebration.headline, competition.name, competition.year];

  return (
    // Decorative: the same names are listed in the thank-you notes above.
    <div className="wn-ribbons" aria-hidden="true">
      <RibbonBand variant="back" items={back} />
      <RibbonBand variant="front" items={front} />
    </div>
  );
}

/**
 * Special event section for the first place win, placed directly under the
 * landing hero: certificate, trophy emblem, team and special thanks.
 *
 * All content comes from winnerEvent.config.js and is static, so every
 * animated child exists on first render (see the data-gating rule in
 * AGENTS.md).
 *
 * @param {() => void} onReplay  Reopens the entry celebration.
 * @param {{ current: any }} lenisRef  Paused while the certificate lightbox is open.
 */
export default function WinnerSection({ onReplay, lenisRef }) {
  const { section, team, thanks } = WINNER_EVENT;

  return (
    <MotionConfig reducedMotion="user">
      <section className="wn-section" id="winner" aria-labelledby="wn-title">
        <div className="wn-backdrop" aria-hidden="true">
          {BITS.map((bit, index) => (
            <span
              key={index}
              className={`wn-bit is-${bit.place}`}
              style={{
                left: bit.left,
                top: bit.top,
                '--bit-w': `${bit.w}px`,
                '--bit-h': `${bit.h}px`,
                '--bit-radius': bit.round ? '50%' : '2px',
                '--bit-tone': `var(--${bit.tone})`,
                '--bit-rotate': `${bit.rotate}deg`,
                '--bit-duration': `${bit.duration}s`,
                '--bit-delay': `${bit.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="fn-container">
          <header className="wn-head">
            <motion.p
              className="fn-eyebrow wn-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.5 }}
            >
            </motion.p>

            <SectionTitle titleTop={section.titleTop} titleAccent={section.titleAccent} />

            <motion.p
              className="fn-section-lead wn-lead"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {section.lead}
            </motion.p>
          </header>

          <div className="wn-feature">
            <WinnerCertificate lenisRef={lenisRef} />
            <Emblem onReplay={onReplay} />
          </div>

          {team.length > 0 && <TeamBoard team={team} />}
          {thanks.length > 0 && <ThanksBoard thanks={thanks} />}
        </div>

        <Ribbons />
      </section>
    </MotionConfig>
  );
}
