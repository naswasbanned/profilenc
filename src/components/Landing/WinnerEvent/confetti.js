/**
 * Canvas confetti for the winner celebration.
 *
 * Deliberately small instead of a dependency: a few hundred paper pieces with
 * gravity, drag, sway and a tumbling flip, drawn on one full viewport canvas.
 * The animation loop stops on its own once the last piece has fallen, so an
 * idle canvas costs nothing.
 */

const GRAVITY = 0.3; // px per frame², at 60fps
const DRAG = 0.994; // share of velocity kept each frame
const MAX_FALL = 5; // terminal speed, so pieces flutter instead of drop
const MAX_PIECES = 700;

const FALLBACK_COLORS = ['#f4cf62', '#e96d52', '#9ed0b0', '#c6b9df', '#8ba8e2', '#fffaf0'];

/**
 * Read the landing palette from CSS custom properties, so the confetti follows
 * dark and light mode.
 *
 * @param {Element} element  Any element inside .landing-raw-root.
 * @returns {string[]}
 */
export function readConfettiPalette(element) {
  if (!element || typeof window === 'undefined') return FALLBACK_COLORS;
  const styles = window.getComputedStyle(element);
  const colors = ['--butter', '--coral', '--mint', '--lavender', '--blue']
    .map((token) => styles.getPropertyValue(token).trim())
    .filter(Boolean);
  // Cream paper reads well on the dark backdrop in both themes.
  return colors.length ? [...colors, '#fffaf0'] : FALLBACK_COLORS;
}

/**
 * @param {HTMLCanvasElement} canvas  Sized by CSS; the backing store follows it.
 * @param {{ colors?: string[] }} [options]
 */
export function createConfetti(canvas, { colors = FALLBACK_COLORS } = {}) {
  const context = canvas.getContext('2d');
  if (!context) {
    return { burst() {}, rain() {}, destroy() {} };
  }

  let pieces = [];
  let frameId = 0;
  let lastTime = 0;
  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const makePiece = (x, y, angleDeg, speed) => {
    const angle = (angleDeg * Math.PI) / 180;
    const roll = Math.random();
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      width: 7 + Math.random() * 7,
      height: 4 + Math.random() * 5,
      shape: roll < 0.16 ? 'circle' : roll < 0.36 ? 'streamer' : 'rect',
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      flip: Math.random() * Math.PI * 2,
      flipSpeed: 0.08 + Math.random() * 0.14,
      sway: Math.random() * Math.PI * 2,
      age: 0,
      life: 240 + Math.random() * 160,
    };
  };

  const draw = (piece) => {
    const remaining = piece.life - piece.age;
    context.globalAlpha = remaining < 60 ? Math.max(0, remaining / 60) : 1;
    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    // Squashing one axis by cos(flip) reads as a paper piece tumbling over.
    context.scale(1, Math.cos(piece.flip));
    context.fillStyle = piece.color;

    if (piece.shape === 'circle') {
      context.beginPath();
      context.arc(0, 0, piece.height * 0.75, 0, Math.PI * 2);
      context.fill();
    } else if (piece.shape === 'streamer') {
      context.fillRect(-piece.width, -1.5, piece.width * 2, 3);
    } else {
      context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
    }

    context.restore();
  };

  const tick = (now) => {
    // Frame-rate independent: `step` is 1 at 60fps, 0.5 at 120fps.
    const step = Math.min(3, (now - lastTime) / 16.667) || 1;
    lastTime = now;
    context.clearRect(0, 0, width, height);

    const drag = Math.pow(DRAG, step);
    pieces = pieces.filter((piece) => {
      piece.age += step;
      piece.vx *= drag;
      piece.vy = Math.min(MAX_FALL, piece.vy * drag + GRAVITY * step);
      piece.sway += 0.05 * step;
      piece.x += (piece.vx + Math.sin(piece.sway) * 0.8) * step;
      piece.y += piece.vy * step;
      piece.rotation += piece.spin * step;
      piece.flip += piece.flipSpeed * step;
      return piece.age < piece.life && piece.y < height + 40;
    });

    pieces.forEach(draw);
    context.globalAlpha = 1;

    frameId = pieces.length ? requestAnimationFrame(tick) : 0;
  };

  const run = () => {
    if (frameId) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(tick);
  };

  const add = (piece) => {
    if (pieces.length < MAX_PIECES) pieces.push(piece);
  };

  resize();
  window.addEventListener('resize', resize);

  return {
    /**
     * Fire a cone of confetti.
     * @param {{x: number, y: number, angle?: number, spread?: number,
     *          count?: number, power?: number, radial?: boolean}} options
     *        `angle` in degrees, 90 is straight up. `radial` ignores the
     *        launch angle for speed, for an even pop in every direction.
     */
    burst({ x, y, angle = 90, spread = 50, count = 100, power = 1, radial = false }) {
      // Launch speed that would carry a piece roughly the full canvas height.
      const reach = Math.sqrt(2 * GRAVITY * Math.max(height, 320));
      for (let i = 0; i < count; i += 1) {
        const direction = angle + (Math.random() - 0.5) * spread;
        const lift = Math.max(0.35, Math.sin((direction * Math.PI) / 180));
        const speed = radial
          ? reach * power * (0.35 + Math.random() * 0.65)
          : (reach * power * (0.8 + Math.random() * 0.55)) / lift;
        add(makePiece(x, y, direction, speed));
      }
      run();
    },

    /** Drop confetti from above the top edge across the full width. */
    rain({ count = 80 } = {}) {
      for (let i = 0; i < count; i += 1) {
        const x = Math.random() * width;
        const y = -20 - Math.random() * height * 0.5;
        add(makePiece(x, y, -90 + (Math.random() - 0.5) * 40, 1 + Math.random() * 2));
      }
      run();
    },

    destroy() {
      cancelAnimationFrame(frameId);
      frameId = 0;
      pieces = [];
      window.removeEventListener('resize', resize);
      context.clearRect(0, 0, width, height);
    },
  };
}
