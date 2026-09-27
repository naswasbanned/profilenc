/**
 * Hand-drawn trophy in the Field Notes sticker style: flat gold fill, a dark
 * outline, and a hard offset shadow drawn as a second copy of the silhouette.
 * Colours come from classes in WinnerEvent.css, so the art follows the theme.
 */

// Four point sparkle, centred on the origin.
const SPARKLE =
  'M0 -9 C1.4 -2.2 2.2 -1.4 9 0 C2.2 1.4 1.4 2.2 0 9 C-1.4 2.2 -2.2 1.4 -9 0 C-2.2 -1.4 -1.4 -2.2 0 -9 Z';

const LEFT_HANDLE = 'M40 38 C14 38 12 88 52 92';
const RIGHT_HANDLE = 'M120 38 C146 38 148 88 108 92';

function Silhouette({ shadow = false }) {
  const outline = shadow ? 'wn-trophy-shadow-stroke' : 'wn-trophy-outline';
  const gold = shadow ? 'wn-trophy-shadow-fill' : 'wn-trophy-gold';
  const coral = shadow ? 'wn-trophy-shadow-fill' : 'wn-trophy-coral';

  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* Handles: a thick outline stroke with a narrower gold stroke on top,
          which reads as an outlined tube */}
      <path className={outline} d={LEFT_HANDLE} fill="none" strokeWidth="12" />
      <path className={outline} d={RIGHT_HANDLE} fill="none" strokeWidth="12" />
      {!shadow && (
        <>
          <path className="wn-trophy-gold-stroke" d={LEFT_HANDLE} fill="none" strokeWidth="5" />
          <path className="wn-trophy-gold-stroke" d={RIGHT_HANDLE} fill="none" strokeWidth="5" />
        </>
      )}

      {/* Cup, rim, stem, knot, base, plinth */}
      <path
        className={`${gold} ${outline}`}
        strokeWidth="3.5"
        d="M38 26 H122 V58 C122 88 104 106 80 106 C56 106 38 88 38 58 Z"
      />
      <rect className={`${gold} ${outline}`} strokeWidth="3.5" x="32" y="18" width="96" height="14" rx="6" />
      <path className={`${gold} ${outline}`} strokeWidth="3.5" d="M71 106 H89 L86 128 H74 Z" />
      <rect className={`${gold} ${outline}`} strokeWidth="3.5" x="62" y="126" width="36" height="10" rx="4" />
      <rect className={`${coral} ${outline}`} strokeWidth="3.5" x="50" y="136" width="60" height="22" rx="5" />
      <rect className={`${gold} ${outline}`} strokeWidth="3.5" x="40" y="156" width="80" height="13" rx="5" />
    </g>
  );
}

/**
 * @param {string} [className]
 * @param {boolean} [sparkles]  Twinkling sparkles around the cup.
 */
export default function TrophyArt({ className = '', sparkles = true }) {
  return (
    <svg
      className={`wn-trophy-art ${className}`.trim()}
      viewBox="0 0 164 182"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(6 7)">
        <Silhouette shadow />
      </g>
      <Silhouette />

      <text className="wn-trophy-number" x="80" y="84" textAnchor="middle">
        1
      </text>
      <path className="wn-trophy-shine" d="M50 38 C50 64 56 82 68 94" />
      <rect className="wn-trophy-plate" x="66" y="142" width="28" height="10" rx="2" />

      {/* The position lives on the wrapper group: the CSS twinkle animation
          writes `transform` on the sparkle itself, which would otherwise
          replace the SVG transform attribute */}
      {sparkles && (
        <g>
          <g transform="translate(14 24)">
            <path className="wn-trophy-sparkle" d={SPARKLE} />
          </g>
          <g transform="translate(150 16) scale(0.8)">
            <path className="wn-trophy-sparkle is-coral" d={SPARKLE} />
          </g>
          <g transform="translate(154 110) scale(0.7)">
            <path className="wn-trophy-sparkle is-mint" d={SPARKLE} />
          </g>
        </g>
      )}
    </svg>
  );
}
