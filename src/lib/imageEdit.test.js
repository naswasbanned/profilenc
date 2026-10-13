import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  ADJUSTMENT_RANGES,
  FILTER_FNS,
  FILTER_PRESETS,
  MAX_OUTPUT_SIDE,
  NEUTRAL_ADJUSTMENTS,
  RATIO_OPTIONS,
  ROTATIONS,
  applyFilterOpsToPixels,
  buildFilterOps,
  countGifFrames,
  editedFileName,
  fitWithinMaxSide,
  isAnimatedGif,
  opsToCssFilter,
  pickFallbackType,
  planExport,
  ratioValue,
  resizeFreeCrop,
  resolveRatioId,
  rotateBy,
  rotatedBounds,
} from './imageEdit.js';
import { MAX_SUGGESTION_IMAGE_BYTES, isWithinSuggestionLimit } from './uploadLimits.js';

// --- GIF fixture builder --------------------------------------------------

const ascii = (text) => Array.from(text, (ch) => ch.charCodeAt(0));

/**
 * Builds GIF bytes. `gct` / frame `lct` are colour table size exponents
 * (-1 = no table). Each frame may be preceded by `ext` graphic control
 * extensions and carries `subs` data sub-block lengths.
 */
function buildGif({ header = 'GIF89a', gct = -1, frames = [], trailingExt = 0 } = {}) {
  const out = [...ascii(header), 1, 0, 1, 0, gct >= 0 ? 0x80 | gct : 0, 0, 0];
  if (gct >= 0) out.push(...new Array(3 * 2 ** (gct + 1)).fill(0x3b));
  const pushExt = () => out.push(0x21, 0xf9, 0x04, 0, 0, 0, 0, 0x00);

  for (const frame of frames) {
    for (let i = 0; i < (frame.ext || 0); i += 1) pushExt();
    const lct = frame.lct ?? -1;
    out.push(0x2c, 0, 0, 0, 0, 1, 0, 1, 0, lct >= 0 ? 0x80 | lct : 0);
    if (lct >= 0) out.push(...new Array(3 * 2 ** (lct + 1)).fill(0x2c));
    out.push(0x02);
    for (const size of frame.subs || [1]) {
      out.push(size, ...new Array(size).fill(0x21));
    }
    out.push(0x00);
  }
  for (let i = 0; i < trailingExt; i += 1) pushExt();
  out.push(0x3b);
  return new Uint8Array(out);
}

// --- Example tests --------------------------------------------------------

describe('ratios', () => {
  it('offers exactly the six ratio ids with matching values', () => {
    expect(RATIO_OPTIONS.map((r) => r.id)).toEqual(['free', '1:1', '4:3', '16:9', '3:1', '1.91:1']);
    expect(ratioValue('1.91:1')).toBe(1.91);
    expect(ratioValue('16:9')).toBeCloseTo(16 / 9);
    expect(ratioValue('free')).toBeNull();
  });

  it('resolves unknown or malformed ids to free', () => {
    for (const bad of [undefined, null, 'bogus', 3, {}]) {
      expect(resolveRatioId(bad)).toBe('free');
    }
    for (const { id } of RATIO_OPTIONS) {
      expect(resolveRatioId(id)).toBe(id);
    }
  });
});

describe('rotation', () => {
  it('wraps quarter turns', () => {
    expect(rotateBy(0, -90)).toBe(270);
    expect(rotateBy(270, 90)).toBe(0);
  });

  it('swaps bounds on odd quarter turns', () => {
    expect(rotatedBounds(400, 300, 90)).toEqual({ width: 300, height: 400 });
    expect(rotatedBounds(400, 300, 180)).toEqual({ width: 400, height: 300 });
  });
});

describe('filters', () => {
  it('renders each preset as the expected CSS string', () => {
    const css = Object.fromEntries(
      FILTER_PRESETS.map((p) => [p.id, opsToCssFilter(buildFilterOps(p.id, NEUTRAL_ADJUSTMENTS))]),
    );
    expect(css.none).toBe('none');
    expect(css.mono).toBe('grayscale(1)');
    expect(css.sepia).toBe('sepia(0.8)');
    expect(css.warm).toBe('sepia(0.25) saturate(1.2) hue-rotate(-10deg)');
    expect(css.cool).toBe('saturate(0.9) hue-rotate(15deg) brightness(1.03)');
    expect(css.vivid).toBe('saturate(1.5) contrast(1.1)');
    expect(css.fade).toBe('contrast(0.85) brightness(1.08) saturate(0.8)');
  });

  it('appends non-neutral adjustments and clamps out-of-range values', () => {
    expect(opsToCssFilter(buildFilterOps('none', { brightness: 120, contrast: 100, saturation: 100 })))
      .toBe('brightness(1.2)');
    expect(opsToCssFilter(buildFilterOps('none', { brightness: 999, contrast: -5, saturation: 500 })))
      .toBe('brightness(1.5) contrast(0.5) saturate(2)');
    expect(opsToCssFilter(buildFilterOps('mono', { brightness: Number.NaN, contrast: Infinity })))
      .toBe('grayscale(1)');
    expect(opsToCssFilter(buildFilterOps('unknown', NEUTRAL_ADJUSTMENTS))).toBe('none');
  });

  it('applies grayscale and brightness to pixels with clamping and alpha untouched', () => {
    const red = new Uint8ClampedArray([255, 0, 0, 77]);
    applyFilterOpsToPixels(red, [{ fn: 'grayscale', amount: 1 }]);
    expect(Array.from(red)).toEqual([54, 54, 54, 77]);

    const bright = new Uint8ClampedArray([200, 100, 0, 12]);
    applyFilterOpsToPixels(bright, [{ fn: 'brightness', amount: 1.5 }]);
    expect(Array.from(bright)).toEqual([255, 150, 0, 12]);
  });
});

describe('export plan', () => {
  const apply = ([a, b, c, d, e, f], x, y) => [a * x + c * y + e, b * x + d * y + f];

  it('maps the crop origin to (0, 0) at 0 degrees', () => {
    const plan = planExport({ naturalWidth: 800, naturalHeight: 600, rotation: 0, crop: { x: 100, y: 50, width: 400, height: 300 } });
    expect(plan.width).toBe(400);
    expect(plan.height).toBe(300);
    expect(apply(plan.matrix, 100, 50)).toEqual([0, 0]);
    expect(apply(plan.matrix, 500, 350)).toEqual([400, 300]);
  });

  it('uses swapped bounds at 90 degrees on a non-square image', () => {
    // 800x600 rotated 90 -> bbox 600x800; full-bbox crop.
    const plan = planExport({ naturalWidth: 800, naturalHeight: 600, rotation: 90, crop: { x: 0, y: 0, width: 600, height: 800 } });
    expect(plan.width).toBe(600);
    expect(plan.height).toBe(800);
    // Clockwise turn: the source top-left corner ends up top-right.
    const [x, y] = apply(plan.matrix, 0, 0);
    expect(x).toBeCloseTo(600);
    expect(y).toBeCloseTo(0);
  });

  it('caps the output at 2560 px on the longest side', () => {
    const plan = planExport({ naturalWidth: 6000, naturalHeight: 4000, rotation: 0, crop: { x: 0, y: 0, width: 6000, height: 4000 } });
    expect(MAX_OUTPUT_SIDE).toBe(2560);
    expect(plan.width).toBe(2560);
    expect(plan.height).toBe(1707);
  });
});

describe('file helpers', () => {
  it('picks JPEG only for JPEG sources', () => {
    expect(pickFallbackType('image/jpeg')).toBe('image/jpeg');
    expect(pickFallbackType('image/png')).toBe('image/png');
    expect(pickFallbackType('image/gif')).toBe('image/png');
    expect(pickFallbackType(undefined)).toBe('image/png');
  });

  it('names edited files after the original', () => {
    expect(editedFileName('photo.JPG', 'image/webp')).toBe('photo-edited.webp');
    expect(editedFileName('photo', 'image/webp')).toBe('photo-edited.webp');
    expect(editedFileName('my.holiday.pic.png', 'image/jpeg')).toBe('my.holiday.pic-edited.jpg');
    expect(editedFileName('scan.gif', 'image/png')).toBe('scan-edited.png');
  });
});

describe('GIF detection', () => {
  it('counts a single frame as not animated', () => {
    const gif = buildGif({ gct: 1, frames: [{ ext: 1 }] });
    expect(countGifFrames(gif)).toBe(1);
    expect(isAnimatedGif(gif)).toBe(false);
  });

  it('counts two frames as animated', () => {
    const gif = buildGif({ frames: [{ ext: 1, subs: [3, 255] }, { ext: 1, lct: 0 }] });
    expect(countGifFrames(gif)).toBe(2);
    expect(isAnimatedGif(gif)).toBe(true);
  });

  it('returns 0 for non-GIF bytes', () => {
    expect(countGifFrames(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0]))).toBe(0);
    expect(countGifFrames(new Uint8Array([]))).toBe(0);
  });

  it('does not throw on a truncated GIF', () => {
    const gif = buildGif({ frames: [{ ext: 1 }, { ext: 1 }] });
    const truncated = gif.slice(0, gif.length - 6);
    expect(() => countGifFrames(truncated)).not.toThrow();
    expect(countGifFrames(truncated)).toBeLessThanOrEqual(2);
  });
});

describe('suggestion upload limit', () => {
  it('accepts exactly 2 MB and rejects one byte more', () => {
    expect(MAX_SUGGESTION_IMAGE_BYTES).toBe(2 * 1024 * 1024);
    expect(isWithinSuggestionLimit(2 * 1024 * 1024)).toBe(true);
    expect(isWithinSuggestionLimit(2 * 1024 * 1024 + 1)).toBe(false);
  });
});

// --- Property tests -------------------------------------------------------

const near = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));

const arbGif = fc
  .record({
    header: fc.constantFrom('GIF87a', 'GIF89a'),
    gct: fc.integer({ min: -1, max: 7 }),
    frames: fc.array(
      fc.record({
        ext: fc.integer({ min: 0, max: 2 }),
        lct: fc.integer({ min: -1, max: 3 }),
        subs: fc.array(fc.integer({ min: 1, max: 255 }), { minLength: 1, maxLength: 3 }),
      }),
      { maxLength: 5 },
    ),
    trailingExt: fc.integer({ min: 0, max: 2 }),
  })
  .map((spec) => ({ bytes: buildGif(spec), frames: spec.frames.length }));

describe('properties', () => {
  it('Feature: image-editor, Property 1: Ratio resolution is total and faithful', () => {
    const ids = RATIO_OPTIONS.map((r) => r.id);
    fc.assert(
      fc.property(
        fc.oneof(fc.constantFrom(...ids), fc.string(), fc.double(), fc.constant(null), fc.constant(undefined), fc.object()),
        (input) => {
          const out = resolveRatioId(input);
          expect(ids).toContain(out);
          expect(out).toBe(ids.includes(input) ? input : 'free');
        },
      ),
      { numRuns: 200 },
    );
  });

  it('Feature: image-editor, Property 2: Rotation stays in quarter turns and composes additively', () => {
    fc.assert(
      fc.property(fc.constantFrom(...ROTATIONS), fc.array(fc.constantFrom(90, -90)), (start, steps) => {
        const end = steps.reduce(rotateBy, start);
        expect(ROTATIONS).toContain(end);
        expect(end).toBe((((start + steps.reduce((a, b) => a + b, 0)) % 360) + 360) % 360);
        expect(rotateBy(rotateBy(start, -90), 90)).toBe(start);
        expect([90, 90, 90, 90].reduce(rotateBy, start)).toBe(start);
      }),
      { numRuns: 200 },
    );
  });

  it('Feature: image-editor, Property 3: Export plan maps the crop rectangle onto the output canvas', () => {
    const arbCase = fc
      .record({
        W: fc.integer({ min: 1, max: 8000 }),
        H: fc.integer({ min: 1, max: 8000 }),
        rotation: fc.constantFrom(...ROTATIONS),
        maxSide: fc.integer({ min: 1, max: 4000 }),
        fx: fc.double({ min: 0, max: 1, noNaN: true }),
        fy: fc.double({ min: 0, max: 1, noNaN: true }),
        fw: fc.double({ min: 0, max: 1, noNaN: true }),
        fh: fc.double({ min: 0, max: 1, noNaN: true }),
        px: fc.double({ min: 0, max: 1, noNaN: true }),
        py: fc.double({ min: 0, max: 1, noNaN: true }),
      })
      .map((c) => {
        const B = rotatedBounds(c.W, c.H, c.rotation);
        const width = Math.max(1, Math.round(c.fw * B.width));
        const height = Math.max(1, Math.round(c.fh * B.height));
        const x = Math.round(c.fx * (B.width - width));
        const y = Math.round(c.fy * (B.height - height));
        return { ...c, B, crop: { x, y, width, height } };
      });

    fc.assert(
      fc.property(arbCase, ({ W, H, rotation, maxSide, crop, B, px, py }) => {
        const plan = planExport({ naturalWidth: W, naturalHeight: H, rotation, crop, maxSide });
        expect(Number.isInteger(plan.width) && Number.isInteger(plan.height)).toBe(true);
        expect(Math.max(plan.width, plan.height)).toBeLessThanOrEqual(maxSide);

        const sx = plan.width / crop.width;
        const sy = plan.height / crop.height;
        const theta = (rotation * Math.PI) / 180;
        const reference = (x, y) => {
          const x0 = x - W / 2;
          const y0 = y - H / 2;
          const xr = x0 * Math.cos(theta) - y0 * Math.sin(theta) + B.width / 2;
          const yr = x0 * Math.sin(theta) + y0 * Math.cos(theta) + B.height / 2;
          return [(xr - crop.x) * sx, (yr - crop.y) * sy];
        };
        const [a, b, c, d, e, f] = plan.matrix;
        const viaMatrix = (x, y) => [a * x + c * y + e, b * x + d * y + f];

        // Arbitrary source point agrees with the reference model.
        const sxp = px * W;
        const syp = py * H;
        const [rx, ry] = reference(sxp, syp);
        const [mx, my] = viaMatrix(sxp, syp);
        expect(near(mx, rx)).toBe(true);
        expect(near(my, ry)).toBe(true);

        // A point inside the crop (bbox space), mapped back to source space,
        // lands inside the output canvas.
        const ux = crop.x + px * crop.width - B.width / 2;
        const uy = crop.y + py * crop.height - B.height / 2;
        const srcX = ux * Math.cos(theta) + uy * Math.sin(theta) + W / 2;
        const srcY = -ux * Math.sin(theta) + uy * Math.cos(theta) + H / 2;
        const [ox, oy] = viaMatrix(srcX, srcY);
        const eps = 1e-6 * Math.max(1, plan.width, plan.height);
        expect(ox).toBeGreaterThanOrEqual(-eps);
        expect(oy).toBeGreaterThanOrEqual(-eps);
        expect(ox).toBeLessThanOrEqual(plan.width + eps);
        expect(oy).toBeLessThanOrEqual(plan.height + eps);
      }),
      { numRuns: 300 },
    );
  });

  it('Feature: image-editor, Property 4: Size fitting caps without distortion or upscaling', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20000 }),
        fc.integer({ min: 1, max: 20000 }),
        fc.integer({ min: 1, max: 5000 }),
        (w, h, maxSide) => {
          const out = fitWithinMaxSide(w, h, maxSide);
          expect(Number.isInteger(out.width) && Number.isInteger(out.height)).toBe(true);
          expect(out.width).toBeGreaterThanOrEqual(1);
          expect(out.height).toBeGreaterThanOrEqual(1);
          expect(out.width).toBeLessThanOrEqual(w);
          expect(out.height).toBeLessThanOrEqual(h);
          expect(Math.max(out.width, out.height)).toBeLessThanOrEqual(maxSide);
          if (Math.max(w, h) <= maxSide) {
            expect(out).toEqual({ width: w, height: h });
          } else {
            const scale = maxSide / Math.max(w, h);
            expect(Math.abs(out.width - w * scale)).toBeLessThanOrEqual(1);
            expect(Math.abs(out.height - h * scale)).toBeLessThanOrEqual(1);
          }
        },
      ),
      { numRuns: 300 },
    );
  });

  const arbAdjustmentValue = fc.oneof(
    fc.double({ min: -500, max: 500, noNaN: true }),
    fc.integer({ min: 0, max: 200 }),
    fc.constantFrom(Number.NaN, Infinity, -Infinity, 100),
  );
  const arbAdjustments = fc.record({
    brightness: arbAdjustmentValue,
    contrast: arbAdjustmentValue,
    saturation: arbAdjustmentValue,
  });
  const arbPresetId = fc.oneof(fc.constantFrom(...FILTER_PRESETS.map((p) => p.id)), fc.string());

  it('Feature: image-editor, Property 5: Filter ops produce a single, well-formed, shared CSS string', () => {
    const keys = [['brightness', 'brightness'], ['contrast', 'contrast'], ['saturation', 'saturate']];
    fc.assert(
      fc.property(arbPresetId, arbAdjustments, (presetId, adjustments) => {
        const ops = buildFilterOps(presetId, adjustments);
        const preset = FILTER_PRESETS.find((p) => p.id === presetId) || FILTER_PRESETS[0];
        const expectedTail = [];
        for (const [key, fn] of keys) {
          const raw = adjustments[key];
          if (!Number.isFinite(raw)) continue;
          const { min, max } = ADJUSTMENT_RANGES[key];
          const v = Math.min(max, Math.max(min, raw));
          if (v !== 100) expectedTail.push({ fn, amount: v / 100 });
        }
        expect(ops).toEqual([...preset.ops, ...expectedTail]);
        for (const op of ops) {
          expect(FILTER_FNS).toContain(op.fn);
          expect(Number.isFinite(op.amount)).toBe(true);
        }

        const css = opsToCssFilter(ops);
        if (ops.length === 0) {
          expect(css).toBe('none');
        } else {
          const tokens = css.split(' ');
          expect(tokens).toHaveLength(ops.length);
          tokens.forEach((token, i) => {
            const unit = ops[i].fn === 'hue-rotate' ? 'deg' : '';
            expect(token).toBe(`${ops[i].fn}(${ops[i].amount}${unit})`);
          });
        }
      }),
      { numRuns: 300 },
    );
  });

  it('Feature: image-editor, Property 6: Pixel fallback is bounded, alpha-preserving and neutral-safe', () => {
    const arbPixels = fc
      .array(fc.integer({ min: 0, max: 255 }), { minLength: 4, maxLength: 64 })
      .map((arr) => new Uint8ClampedArray(arr.slice(0, arr.length - (arr.length % 4))));
    const arbNeutralOps = fc.array(
      fc.constantFrom(
        { fn: 'brightness', amount: 1 },
        { fn: 'contrast', amount: 1 },
        { fn: 'saturate', amount: 1 },
        { fn: 'grayscale', amount: 0 },
        { fn: 'sepia', amount: 0 },
        { fn: 'hue-rotate', amount: 0 },
      ),
      { maxLength: 6 },
    );

    fc.assert(
      fc.property(arbPixels, arbPresetId, arbAdjustments, arbNeutralOps, (pixels, presetId, adjustments, neutralOps) => {
        const ops = buildFilterOps(presetId, adjustments);
        const data = pixels.slice();
        applyFilterOpsToPixels(data, ops);
        for (let i = 0; i < data.length; i += 1) {
          expect(Number.isInteger(data[i])).toBe(true);
          expect(data[i]).toBeGreaterThanOrEqual(0);
          expect(data[i]).toBeLessThanOrEqual(255);
          if (i % 4 === 3) expect(data[i]).toBe(pixels[i]);
        }

        const untouched = pixels.slice();
        applyFilterOpsToPixels(untouched, buildFilterOps('none', NEUTRAL_ADJUSTMENTS));
        expect(Array.from(untouched)).toEqual(Array.from(pixels));

        const neutral = pixels.slice();
        applyFilterOpsToPixels(neutral, neutralOps);
        expect(Array.from(neutral)).toEqual(Array.from(pixels));
      }),
      { numRuns: 200 },
    );
  });

  it('Feature: image-editor, Property 7: GIF frame count matches the encoded frames', () => {
    fc.assert(
      fc.property(arbGif, ({ bytes, frames }) => {
        expect(countGifFrames(bytes)).toBe(frames);
        expect(isAnimatedGif(bytes)).toBe(frames > 1);
      }),
      { numRuns: 200 },
    );

    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 64 }), (bytes) => {
        fc.pre(!(bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46));
        expect(countGifFrames(bytes)).toBe(0);
      }),
      { numRuns: 200 },
    );

    fc.assert(
      fc.property(arbGif, fc.double({ min: 0, max: 1, noNaN: true }), ({ bytes, frames }, frac) => {
        const prefix = bytes.slice(0, Math.floor(frac * bytes.length));
        let count;
        expect(() => { count = countGifFrames(prefix); }).not.toThrow();
        expect(count).toBeGreaterThanOrEqual(0);
        expect(count).toBeLessThanOrEqual(frames);
      }),
      { numRuns: 200 },
    );
  });

  it('Feature: image-editor, Property 8: Free crop resizing stays within bounds', () => {
    const arbCase = fc
      .record({
        bw: fc.integer({ min: 1, max: 2000 }),
        bh: fc.integer({ min: 1, max: 2000 }),
        fw: fc.double({ min: 0, max: 1, noNaN: true }),
        fh: fc.double({ min: 0, max: 1, noNaN: true }),
        fm: fc.double({ min: 0, max: 1, noNaN: true }),
        dWidth: fc.double({ min: -5000, max: 5000, noNaN: true }),
        dHeight: fc.double({ min: -5000, max: 5000, noNaN: true }),
      })
      .map((c) => {
        const bounds = { width: c.bw, height: c.bh };
        const minSize = c.fm * Math.min(c.bw, c.bh);
        const size = {
          width: minSize + c.fw * (c.bw - minSize),
          height: minSize + c.fh * (c.bh - minSize),
        };
        return { bounds, minSize, size, dWidth: c.dWidth, dHeight: c.dHeight };
      });

    fc.assert(
      fc.property(arbCase, ({ bounds, minSize, size, dWidth, dHeight }) => {
        const out = resizeFreeCrop(size, { dWidth, dHeight }, bounds, minSize);
        expect(out.width).toBeGreaterThanOrEqual(minSize);
        expect(out.height).toBeGreaterThanOrEqual(minSize);
        expect(out.width).toBeLessThanOrEqual(bounds.width);
        expect(out.height).toBeLessThanOrEqual(bounds.height);

        expect(resizeFreeCrop(size, { dWidth }, bounds, minSize).height).toBe(size.height);
        expect(resizeFreeCrop(size, { dHeight }, bounds, minSize).width).toBe(size.width);
      }),
      { numRuns: 300 },
    );
  });
});
