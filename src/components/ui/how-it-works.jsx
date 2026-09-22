import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
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

const PatchCard = ({
  patch,
  index,
  colorTheme = 'orange',
  className = '',
  style = {},
}) => {
  const isPatchNote = Boolean(patch.version || patch.changes);

  return (
    <div
      className={`how-it-works-card-wrap how-it-works-theme-${colorTheme} ${className}`}
      style={style}
    >
      <div className="how-it-works-card-frame">
        <Pin />
        <div className="how-it-works-card-body">
          {isPatchNote ? (
            <>
              <div className="hiw-patch-top-row">
                <span className="how-it-works-version">{patch.version}</span>
                <span className="hiw-patch-status-badge">
                  {patch.status || (patch.is_current ? 'LATEST UPDATE' : 'STABLE')}
                </span>
              </div>

              <div className="hiw-patch-meta-row">
                {patch.date && <span className="hiw-patch-date">{patch.date}</span>}
                {patch.codename && (
                  <span className="hiw-patch-codename">// {patch.codename}</span>
                )}
              </div>

              <h3 className="how-it-works-title">{patch.title}</h3>

              {Array.isArray(patch.changes) && patch.changes.length > 0 && (
                <div className="hiw-patch-changes-list">
                  {patch.changes.map((c, cIdx) => (
                    <div key={cIdx} className="hiw-patch-change-item">
                      <span
                        className={`hiw-change-tag is-${(c.type || 'new').toLowerCase()}`}
                      >
                        {c.type || 'NEW'}
                      </span>
                      <span className="hiw-change-text">{c.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {patch.description && !patch.changes && (
                <p className="how-it-works-desc">{patch.description}</p>
              )}
            </>
          ) : (
            <>
              <span className="how-it-works-number">{`0${index + 1}`}</span>
              <h3 className="how-it-works-title">{patch.title}</h3>
              <p className="how-it-works-desc">{patch.description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DEFAULT_PROFILENC_PATCHES = [
  {
    version: 'v1.0.0',
    status: 'LATEST UPDATE',
    date: 'August 28, 2026',
    codename: 'RELEASE 1.0',
    title: 'Photo Gallery, Events Calendar & Smooth Scroll',
    changes: [
      { type: 'NEW', text: 'Photo Gallery Block: Display photos in grid layouts with full-screen lightbox zoom.' },
      { type: 'NEW', text: 'Events Calendar Block: 1-click Google Calendar & Apple .ICS schedule sync.' },
      { type: 'IMPROVED', text: 'Smooth Scroll Showcase: Ultra-smooth scrolling powered by GSAP and Lenis.' },
      { type: 'IMPROVED', text: 'Card Color Tokens: Independent styling inside cards without affecting headlines.' },
    ],
  },
  {
    version: 'v0.9.0',
    status: 'UPDATE',
    date: 'August 27, 2026',
    codename: 'BLOCK EXPANSION',
    title: 'Services & Rates, Hero Alignments & Multi-Image Uploads',
    changes: [
      { type: 'NEW', text: 'Services & Commissions: Pricing tiers with deliverables checklist and booking.' },
      { type: 'NEW', text: 'Hero Layouts: Choose center, left-aligned, or split-side layouts for header.' },
      { type: 'NEW', text: 'Journal Covers: Add card cover photos with rich visual markdown formatting.' },
      { type: 'NEW', text: 'Multi-Image Gallery: Attach multiple project images to milestones.' },
    ],
  },
  {
    version: 'v0.8.0',
    status: 'UPDATE',
    date: 'August 26, 2026',
    codename: 'THEME ENGINE',
    title: 'Custom Theme Colors & Dynamic Page Backgrounds',
    changes: [
      { type: 'IMPROVED', text: 'Color Customization: Set custom theme colors, button styles, and border radius.' },
      { type: 'NEW', text: 'Page Backgrounds: Choose unique background styles dynamically for each tab.' },
    ],
  },
  {
    version: 'v0.5.0',
    status: 'INITIAL LAUNCH',
    date: 'August 20, 2026',
    codename: 'BETA RELEASE',
    title: 'Visual Live Editor & Custom Profile URLs',
    changes: [
      { type: 'NEW', text: 'Custom Profile URLs: Get your unique profile link at profilenc.my.id/@yourname.' },
      { type: 'NEW', text: 'Visual Live Editor: Edit your profile blocks and see changes instantly in real-time.' },
    ],
  },
];

export default function HowItWorks({
  patches,
  patchNotes,
  features,
  className = '',
}) {
  const data =
    patches && patches.length > 0
      ? patches
      : patchNotes && patchNotes.length > 0
      ? patchNotes
      : features && features.length > 0
      ? features
      : DEFAULT_PROFILENC_PATCHES;

  const stepDistance = 330;
  const pinOffsetY = 38;
  const height = data.length <= 1 ? 460 : (data.length - 1) * stepDistance + 390;

  return (
    <LazyMotion features={domAnimation}>
      <div className={`how-it-works-wrapper ${className}`}>
        {/* Ruled notebook line background */}
        <div className="how-it-works-lined-bg" />
        <div className="how-it-works-fade-left" />
        <div className="how-it-works-fade-right" />

        <div className="how-it-works-inner">
          <div
            className="how-it-works-stage"
            style={{ '--stage-height': `${height}px` }}
          >
            {/* SVG Connecting Animated Path (Desktop) */}
            {data.length > 1 && (
              <svg
                className="how-it-works-svg"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  const pathD = data.reduce((acc, _, index) => {
                    if (index >= data.length - 1) return acc;
                    const currY = index * stepDistance + pinOffsetY;
                    const nextY = (index + 1) * stepDistance + pinOffsetY;
                    const currX = index % 2 === 0 ? 250 : 750;
                    const nextX = (index + 1) % 2 === 0 ? 250 : 750;

                    if (index === 0) {
                      return `M ${currX} ${currY} C ${currX + 220} ${currY}, ${nextX - 220} ${nextY}, ${nextX} ${nextY}`;
                    }
                    return (
                      acc +
                      ` C ${currX + (index % 2 === 0 ? 220 : -220)} ${currY}, ${
                        nextX + ((index + 1) % 2 === 0 ? -220 : 220)
                      } ${nextY}, ${nextX} ${nextY}`
                    );
                  }, '');

                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="how-it-works-path"
                      strokeWidth="2.5"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{
                        strokeDashoffset: -140, // Seamless infinite loop
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  );
                })()}
              </svg>
            )}

            {/* Step / Patch Note Cards */}
            {data.map((item, index) => {
              const isEven = index % 2 === 0;
              const sideClass = isEven ? 'hiw-side-left' : 'hiw-side-right';
              const topPos = index * stepDistance;
              const colorTheme = item.colorTheme || THEME_CYCLE[index % THEME_CYCLE.length];

              return (
                <PatchCard
                  key={item.version || item.title || index}
                  patch={item}
                  index={index}
                  colorTheme={colorTheme}
                  className={sideClass}
                  style={{ top: `${topPos}px` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
