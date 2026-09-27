import { useCallback, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { useOverlayLock } from './useOverlayLock';
import { WINNER_EVENT } from './winnerEvent.config';
import './WinnerEvent.css';

// Two hand-drawn signature strokes, drawn in when the certificate is seen.
const SIGNATURE_PATHS = [
  'M4 28 C12 8 20 6 23 20 C26 33 31 12 39 15 C47 19 43 31 53 26 C64 19 69 8 77 17 C83 25 92 29 116 13',
  'M6 25 C17 31 21 9 29 12 C37 15 30 30 40 30 C51 30 55 10 63 12 C70 14 66 26 76 24 C87 22 96 9 114 19',
];

const TILT_SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

/** Polygon points for a starburst seal. */
function starburstPoints(cx, cy, outer, inner, spikes) {
  const points = [];
  for (let i = 0; i < spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI * i) / spikes - Math.PI / 2;
    points.push(
      `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
    );
  }
  return points.join(' ');
}

const MEDAL_BURST = starburstPoints(50, 46, 34, 28, 24);

/** Gold seal with ribbon tails, pressed onto the designed certificate. */
function MedalArt() {
  return (
    <svg className="wn-medal" viewBox="0 0 100 112" aria-hidden="true" focusable="false">
      <path className="wn-medal-ribbon" d="M34 62 L24 106 L36 98 L44 108 L52 66 Z" />
      <path className="wn-medal-ribbon is-right" d="M66 62 L76 106 L64 98 L56 108 L48 66 Z" />
      <polygon className="wn-medal-burst" points={MEDAL_BURST} />
      <circle className="wn-medal-inner" cx="50" cy="46" r="21" />
      <text className="wn-medal-label" x="50" y="39" textAnchor="middle">
        NO.
      </text>
      <text className="wn-medal-number" x="50" y="61" textAnchor="middle">
        1
      </text>
    </svg>
  );
}

/**
 * Printed-style certificate built from the event config, shown until a real
 * scan is set in `certificate.image`. Sized in container query units, so the
 * whole document scales with the card like a photographed page.
 */
function CertificateDocument({ certificate, competition }) {
  return (
    <div className="wn-cert-doc">
      <div className="wn-cert-frame">
        {['is-tl', 'is-tr', 'is-bl', 'is-br'].map((corner) => (
          <span key={corner} className={`wn-cert-corner ${corner}`} aria-hidden="true" />
        ))}

        <div className="wn-cert-body">
          <p className="wn-cert-kicker">{competition.name}</p>
          <p className="wn-cert-heading">{certificate.title}</p>
          <p className="wn-cert-small">Proudly presented to</p>
          <p className="wn-cert-name">{certificate.awardedTo}</p>
          <p className="wn-cert-small">for achieving</p>
          <p className="wn-cert-award">{competition.placementLabel}</p>
          <p className="wn-cert-event">
            {competition.category} · {competition.year}
          </p>
        </div>

        <div className="wn-cert-signs">
          {certificate.signatories.slice(0, 2).map((person, index) => (
            <div className="wn-cert-sign" key={`${person.role}-${index}`}>
              <svg
                className="wn-cert-signature"
                viewBox="0 0 120 36"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <motion.path
                  d={SIGNATURE_PATHS[index % SIGNATURE_PATHS.length]}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.9 + index * 0.35, duration: 1.1, ease: 'easeInOut' }}
                />
              </svg>
              <span className="wn-cert-sign-name">{person.name}</span>
              <span className="wn-cert-sign-role">{person.role}</span>
            </div>
          ))}
        </div>

        <MedalArt />
      </div>
    </div>
  );
}

function LightboxBody({ onClose, src, alt, lenisRef }) {
  const closeRef = useRef(null);
  useOverlayLock({ lenisRef, onClose, focusRef: closeRef });

  return (
    <motion.div
      className="wn-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.img
        className="wn-lightbox-image"
        src={src}
        alt={alt}
        onClick={(event) => event.stopPropagation()}
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      />
      <button
        ref={closeRef}
        type="button"
        className="wn-lightbox-close"
        onClick={onClose}
        aria-label="Close certificate"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </motion.div>
  );
}

/**
 * The certificate card in the winner section.
 *
 * Deals in on scroll, tilts in 3D under the pointer with a moving glare, and
 * gets a "Winner" stamp slammed onto it. With a real scan configured, the
 * scan replaces the designed document and opens full size on click.
 */
export default function WinnerCertificate({ lenisRef }) {
  const { certificate, competition } = WINNER_EVENT;
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const closeZoom = useCallback(() => setZoomed(false), []);

  // Pointer position over the card, 0 to 1 on each axis, centred at rest.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [7, -7]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-9, 9]), TILT_SPRING);

  const glareX = useTransform(pointerX, (value) => `${value * 100}%`);
  const glareY = useTransform(pointerY, (value) => `${value * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.6), transparent 55%)`;
  const glareStrength = useMotionValue(0);
  const glareOpacity = useSpring(glareStrength, { stiffness: 200, damping: 30 });

  const handlePointerMove = (event) => {
    // Touch drags scroll the page; tilting under a finger just feels broken.
    if (reduceMotion || event.pointerType === 'touch' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
    glareStrength.set(1);
  };

  const resetTilt = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    glareStrength.set(0);
  };

  return (
    <>
      <motion.figure
        className="wn-cert-wrap"
        initial={{ opacity: 0, y: 60, rotate: -5 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 110, damping: 17 }}
      >
        <motion.div
          ref={cardRef}
          className="wn-cert"
          style={{ rotateX, rotateY, transformPerspective: 1100 }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
        >
          {certificate.image ? (
            <>
              <button
                type="button"
                className="wn-cert-image"
                onClick={() => setZoomed(true)}
                aria-label="View the certificate full size"
              >
                <img src={certificate.image} alt={certificate.alt} loading="lazy" decoding="async" />
                <span className="wn-cert-zoom" aria-hidden="true">
                  <Maximize2 size={13} /> View full size
                </span>
              </button>
              <motion.span
                className="wn-cert-tab"
                aria-hidden="true"
                initial={{ opacity: 0, y: -14, rotate: -14 }}
                whileInView={{ opacity: 1, y: 0, rotate: -6 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 420, damping: 16 }}
              >
                {competition.placementShort}
              </motion.span>
            </>
          ) : (
            <>
              <CertificateDocument certificate={certificate} competition={competition} />
              <motion.span
                className="wn-cert-stamp"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 2.6, rotate: -34 }}
                whileInView={{ opacity: 0.9, scale: 1, rotate: -14 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.55, type: 'spring', stiffness: 520, damping: 17 }}
              >
                Winner
              </motion.span>
            </>
          )}

          {!reduceMotion && (
            <motion.span
              className="wn-cert-glare"
              style={{ backgroundImage: glare, opacity: glareOpacity }}
              aria-hidden="true"
            />
          )}
        </motion.div>

        <figcaption className="wn-cert-caption">
          <span>{certificate.title}</span>
          <span>
            {competition.organizer} · {competition.year}
          </span>
        </figcaption>
      </motion.figure>

      {certificate.image && (
        <AnimatePresence>
          {zoomed && (
            <LightboxBody
              key="certificate-lightbox"
              onClose={closeZoom}
              src={certificate.image}
              alt={certificate.alt}
              lenisRef={lenisRef}
            />
          )}
        </AnimatePresence>
      )}
    </>
  );
}
