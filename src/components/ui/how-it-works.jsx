import { useEffect, useId, useRef, useState } from 'react';
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './how-it-works.css';

const Pin = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`how-it-works-pin ${className}`}
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const THEME_CYCLE = ['orange', 'blue', 'purple', 'mint'];

// Desktop zig-zag geometry: each card sits at least STEP_DISTANCE below the
// previous one (in the other column), and the trail runs between the pins.
const STEP_DISTANCE = 330;
const PIN_OFFSET_Y = 38;
// Cards grow with their change lists, so the layout uses measured heights:
// a card never starts until the card above it in the same column has ended.
const CARD_GAP = 40;
const STAGE_PADDING = 48;
const FALLBACK_CARD_HEIGHT = 390; // before the first measurement

/**
 * Card tops and stage height for the zig-zag.
 * @param {number[]} heights  Measured card heights (may be shorter than count)
 * @param {number} count
 */
function layoutCards(heights, count) {
  const heightOf = (index) => heights[index] || FALLBACK_CARD_HEIGHT;
  const tops = [];

  for (let index = 0; index < count; index += 1) {
    let top = index === 0 ? 0 : tops[index - 1] + STEP_DISTANCE;
    if (index >= 2) {
      top = Math.max(top, tops[index - 2] + heightOf(index - 2) + CARD_GAP);
    }
    tops.push(top);
  }

  const bottom = tops.reduce((max, top, index) => Math.max(max, top + heightOf(index)), 0);
  return { tops, height: count === 0 ? 0 : bottom + STAGE_PADDING };
}

const EASE_OUT = [0.16, 1, 0.3, 1];

// Scroll-in choreography, in the same spirit as the winner section: the card
// swings in from its side, the pin drops onto it, then the header rows and
// the change lines follow one after another.
const CARD_VARIANTS = {
  hidden: (side) => ({
    opacity: 0,
    y: 70,
    scale: 0.92,
    rotate: side === 'left' ? -7 : 7,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 130,
      damping: 17,
      delayChildren: 0.18,
      staggerChildren: 0.07,
    },
  },
};

const PIN_VARIANTS = {
  hidden: { opacity: 0, y: -40, scale: 1.4 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 520, damping: 15 } },
};

const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

const CHANGES_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const CHANGE_VARIANTS = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

/** Curve from pin to pin down the zig-zag, in the SVG's 1000-wide viewBox. */
function trailPath(tops) {
  let d = '';
  for (let index = 0; index < tops.length - 1; index += 1) {
    const currY = tops[index] + PIN_OFFSET_Y;
    const nextY = tops[index + 1] + PIN_OFFSET_Y;
    const currX = index % 2 === 0 ? 250 : 750;
    const nextX = (index + 1) % 2 === 0 ? 250 : 750;

    if (index === 0) {
      d = `M ${currX} ${currY} C ${currX + 220} ${currY}, ${nextX - 220} ${nextY}, ${nextX} ${nextY}`;
    } else {
      d += ` C ${currX + (index % 2 === 0 ? 220 : -220)} ${currY}, ${
        nextX + ((index + 1) % 2 === 0 ? -220 : 220)
      } ${nextY}, ${nextX} ${nextY}`;
    }
  }
  return d;
}

function PatchCard({ patch, index, colorTheme, side, style, wrapRef }) {
  const isPatchNote = Boolean(patch.version || patch.changes);
  const changes = Array.isArray(patch.changes) ? patch.changes : [];

  return (
    <div
      ref={wrapRef}
      className={`how-it-works-card-wrap how-it-works-theme-${colorTheme} hiw-side-${side}`}
      style={style}
    >
      {/* The entrance animates the frame, not the wrap: the wrap carries the
          zig-zag tilt and hover scale in CSS, which an inline transform from
          the animation would overwrite */}
      <m.div
        className="how-it-works-card-frame"
        custom={side}
        variants={CARD_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <m.span className="how-it-works-pin-wrap" variants={PIN_VARIANTS}>
          <Pin />
        </m.span>

        <div className="how-it-works-card-body">
          {isPatchNote ? (
            <>
              <m.div className="hiw-patch-top-row" variants={ROW_VARIANTS}>
                <span className="how-it-works-version">{patch.version}</span>
                <span className="hiw-patch-status-badge">
                  {patch.status || (patch.is_current ? 'LATEST UPDATE' : 'STABLE')}
                </span>
              </m.div>

              <m.div className="hiw-patch-meta-row" variants={ROW_VARIANTS}>
                {patch.date && <span className="hiw-patch-date">{patch.date}</span>}
                {patch.codename && <span className="hiw-patch-codename">// {patch.codename}</span>}
              </m.div>

              <m.h3 className="how-it-works-title" variants={ROW_VARIANTS}>
                {patch.title}
              </m.h3>

              {changes.length > 0 && (
                <m.div className="hiw-patch-changes-list" variants={CHANGES_VARIANTS}>
                  {changes.map((change, changeIndex) => (
                    <m.div
                      key={changeIndex}
                      className="hiw-patch-change-item"
                      variants={CHANGE_VARIANTS}
                    >
                      <span className={`hiw-change-tag is-${(change.type || 'new').toLowerCase()}`}>
                        {change.type || 'NEW'}
                      </span>
                      <span className="hiw-change-text">{change.text}</span>
                    </m.div>
                  ))}
                </m.div>
              )}

              {patch.description && changes.length === 0 && (
                <m.p className="how-it-works-desc" variants={ROW_VARIANTS}>
                  {patch.description}
                </m.p>
              )}
            </>
          ) : (
            <>
              <m.span className="how-it-works-number" variants={ROW_VARIANTS}>
                {`0${index + 1}`}
              </m.span>
              <m.h3 className="how-it-works-title" variants={ROW_VARIANTS}>
                {patch.title}
              </m.h3>
              <m.p className="how-it-works-desc" variants={ROW_VARIANTS}>
                {patch.description}
              </m.p>
            </>
          )}
        </div>
      </m.div>
    </div>
  );
}

function PatchBoard({ data, initialCount, className }) {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  // useId output contains characters that are awkward in a url(#id) reference
  const maskId = `hiw-trail-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const canCollapse = Number.isFinite(initialCount) && data.length > initialCount;
  const items = canCollapse && !expanded ? data.slice(0, initialCount) : data;
  const itemsKey = items.map((item, index) => item.version || item.title || index).join('|');

  // Measure each card so tall releases push the zig-zag down instead of
  // spilling past the stage. ResizeObserver also catches font loads and
  // viewport changes that re-wrap the change lines.
  const cardRefs = useRef([]);
  const [cardHeights, setCardHeights] = useState([]);

  useEffect(() => {
    const nodes = cardRefs.current.slice(0, items.length);
    if (typeof ResizeObserver === 'undefined' || !nodes.some(Boolean)) return undefined;

    const measure = () => {
      const next = nodes.map((node) => (node ? node.offsetHeight : 0));
      setCardHeights((previous) =>
        previous.length === next.length && previous.every((value, i) => value === next[i])
          ? previous
          : next
      );
    };

    const observer = new ResizeObserver(measure);
    nodes.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
    // itemsKey changes whenever a different set of cards is rendered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  const { tops, height } = layoutCards(cardHeights, items.length);
  const pathD = trailPath(tops);

  // The trail between pins draws itself in as the board scrolls through the
  // viewport: 0 when the board's top reaches 80% down the screen, 1 when its
  // bottom reaches 60%.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start 80%', 'end 60%'] });
  const trailProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  const toggleExpanded = () => {
    // Collapsing removes most of the board; if the reader is deep inside it,
    // bring its top back into view so they are not left below the section.
    if (expanded && stageRef.current && stageRef.current.getBoundingClientRect().top < 0) {
      stageRef.current.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    setExpanded((value) => !value);
  };

  return (
    <div className={`how-it-works-wrapper ${className}`.trim()}>
      {/* Ruled notebook line background */}
      <div className="how-it-works-lined-bg" />
      <div className="how-it-works-fade-left" />
      <div className="how-it-works-fade-right" />

      <div className="how-it-works-inner">
        <div
          ref={stageRef}
          className="how-it-works-stage"
          style={{ '--stage-height': `${height}px` }}
        >
          {/* Connecting trail (desktop). A solid copy of the path, drawn on
              scroll, masks the dashed one: pathLength works by rewriting the
              dash pattern, so it cannot animate the dashed path directly. */}
          {items.length > 1 && (
            <svg
              className="how-it-works-svg"
              viewBox={`0 0 1000 ${height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {!reduceMotion && (
                <defs>
                  <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height={height}>
                    <m.path
                      d={pathD}
                      fill="none"
                      stroke="#fff"
                      strokeWidth="16"
                      strokeLinecap="round"
                      style={{ pathLength: trailProgress }}
                    />
                  </mask>
                </defs>
              )}
              <m.path
                d={pathD}
                stroke="currentColor"
                className="how-it-works-path"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                fill="none"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                mask={reduceMotion ? undefined : `url(#${maskId})`}
                initial={{ strokeDashoffset: 0 }}
                // Marching dashes; skipped for visitors who ask for less motion
                animate={reduceMotion ? undefined : { strokeDashoffset: -140 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          )}

          {items.map((item, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            return (
              <PatchCard
                key={item.version || item.title || index}
                patch={item}
                index={index}
                side={side}
                colorTheme={item.colorTheme || THEME_CYCLE[index % THEME_CYCLE.length]}
                style={{ top: `${tops[index]}px` }}
                wrapRef={(node) => {
                  cardRefs.current[index] = node;
                }}
              />
            );
          })}
        </div>

        {canCollapse && (
          <div className="hiw-more">
            <button
              type="button"
              className="fn-btn fn-btn-ghost hiw-more-btn"
              onClick={toggleExpanded}
              aria-expanded={expanded}
            >
              {expanded ? 'Show fewer releases' : `Show all ${data.length} releases`}
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`hiw-more-icon${expanded ? ' is-open' : ''}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Pinned-card board for patch notes (or numbered feature steps).
 *
 * @param {object[]} [patches]      Release notes, newest first.
 * @param {object[]} [patchNotes]   Alias of `patches`.
 * @param {object[]} [features]     Numbered steps, used when no notes are given.
 * @param {number} [initialCount]   Show this many cards until "Show all" is
 *                                  pressed. Omit to always show everything.
 * @param {string} [className]
 */
export default function HowItWorks({ patches, patchNotes, features, initialCount, className = '' }) {
  const data =
    patches && patches.length > 0
      ? patches
      : patchNotes && patchNotes.length > 0
      ? patchNotes
      : features && features.length > 0
      ? features
      : [];

  // Nothing to pin. The board lives in its own component so its scroll hooks
  // only run when there is a stage for them to track.
  if (data.length === 0) return null;

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <PatchBoard data={data} initialCount={initialCount} className={className} />
      </MotionConfig>
    </LazyMotion>
  );
}
