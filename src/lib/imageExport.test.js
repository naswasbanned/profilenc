import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Minimal canvas stubs (no jsdom). Every createElement('canvas') call returns
 * a fresh fake canvas recorded in `canvases`.
 *  - filterSupported: whether the 1x1 grayscale probe reads back grey
 *  - blobTypes: types toBlob hands back, in call order (null = null blob)
 */
function installCanvasStub({ filterSupported = true, blobTypes = ['image/webp'] } = {}) {
  const canvases = [];
  const encodeCalls = [];
  let blobIndex = 0;

  const makeContext = (canvas) => {
    const ctx = {
      filter: 'none',
      fillStyle: '#000',
      filterAtDraw: null,
      calls: [],
      setTransform: (...args) => ctx.calls.push(['setTransform', ...args]),
      fillRect: () => {},
      drawImage: () => {
        ctx.filterAtDraw = ctx.filter;
        ctx.calls.push(['drawImage']);
      },
      getImageData: (x, y, w, h) => {
        ctx.calls.push(['getImageData', x, y, w, h]);
        if (canvas.width === 1 && canvas.height === 1) {
          const grey = filterSupported && ctx.filter === 'grayscale(1)';
          return { data: new Uint8ClampedArray(grey ? [54, 54, 54, 255] : [255, 0, 0, 255]) };
        }
        return { data: new Uint8ClampedArray(w * h * 4).fill(200) };
      },
      putImageData: (data, x, y) => ctx.calls.push(['putImageData', x, y]),
    };
    return ctx;
  };

  const document = {
    createElement: (tag) => {
      if (tag !== 'canvas') throw new Error(`unexpected element ${tag}`);
      const canvas = {
        width: 300,
        height: 150,
        ctx: null,
        getContext() {
          if (!canvas.ctx) canvas.ctx = makeContext(canvas);
          return canvas.ctx;
        },
        toBlob(cb, type, quality) {
          encodeCalls.push({ type, quality });
          const next = blobTypes[Math.min(blobIndex, blobTypes.length - 1)];
          blobIndex += 1;
          cb(next === null ? null : new Blob(['x'], { type: next }));
        },
      };
      canvases.push(canvas);
      return canvas;
    },
  };

  vi.stubGlobal('document', document);
  return { canvases, encodeCalls };
}

async function freshModule() {
  vi.resetModules();
  return import('./imageExport.js');
}

const image = { naturalWidth: 800, naturalHeight: 600 };
const crop = { x: 0, y: 0, width: 400, height: 300 };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('canvasToBlob', () => {
  it('rejects when toBlob hands back null', async () => {
    const { canvasToBlob } = await freshModule();
    const canvas = { toBlob: (cb) => cb(null) };
    await expect(canvasToBlob(canvas, 'image/webp', 0.92)).rejects.toThrow();
  });

  it('rejects when toBlob throws', async () => {
    const { canvasToBlob } = await freshModule();
    const canvas = { toBlob: () => { throw new Error('tainted'); } };
    await expect(canvasToBlob(canvas, 'image/webp', 0.92)).rejects.toThrow('tainted');
  });
});

describe('exportEditedImage', () => {
  it('rejects when the encode returns a null blob', async () => {
    installCanvasStub({ blobTypes: [null] });
    const { exportEditedImage } = await freshModule();
    const file = new File(['a'], 'photo.png', { type: 'image/png' });
    await expect(exportEditedImage({ image, file, rotation: 0, crop, ops: [] })).rejects.toThrow();
  });

  it('re-encodes with the fallback type when WebP is not supported', async () => {
    const { encodeCalls } = installCanvasStub({ blobTypes: ['image/png', 'image/jpeg'] });
    const { exportEditedImage } = await freshModule();
    const file = new File(['a'], 'Holiday.JPG', { type: 'image/jpeg' });
    const out = await exportEditedImage({ image, file, rotation: 0, crop, ops: [] });
    expect(encodeCalls.map((c) => c.type)).toEqual(['image/webp', 'image/jpeg']);
    expect(encodeCalls.every((c) => c.quality === 0.92)).toBe(true);
    expect(out).toBeInstanceOf(File);
    expect(out.name).toBe('Holiday-edited.jpg');
    expect(out.type).toBe('image/jpeg');
  });

  it('returns a WebP file named after the original and sized by the plan', async () => {
    const { canvases, encodeCalls } = installCanvasStub({ blobTypes: ['image/webp'] });
    const { exportEditedImage } = await freshModule();
    const file = new File(['a'], 'photo.png', { type: 'image/png' });
    const out = await exportEditedImage({ image, file, rotation: 0, crop, ops: [] });
    expect(encodeCalls).toHaveLength(1);
    expect(out.name).toBe('photo-edited.webp');
    expect(out.type).toBe('image/webp');
    const output = canvases.find((c) => c.width === 400);
    expect(output.width).toBe(400);
    expect(output.height).toBe(300);
    const [name, ...matrix] = output.ctx.calls[0];
    expect(name).toBe('setTransform');
    expect(matrix.map((v) => v + 0)).toEqual([1, 0, 0, 1, 0, 0]);
  });

  it('uses ctx.filter when the canvas supports it', async () => {
    const { canvases } = installCanvasStub({ filterSupported: true });
    const { exportEditedImage, supportsCanvasFilter } = await freshModule();
    const file = new File(['a'], 'photo.png', { type: 'image/png' });
    await exportEditedImage({ image, file, rotation: 0, crop, ops: [{ fn: 'grayscale', amount: 1 }] });
    expect(supportsCanvasFilter()).toBe(true);
    const output = canvases.find((c) => c.width === 400);
    expect(output.ctx.filterAtDraw).toBe('grayscale(1)');
    expect(output.ctx.calls.some(([name]) => name === 'putImageData')).toBe(false);
  });

  it('falls back to the pixel loop when ctx.filter is unsupported', async () => {
    const { canvases } = installCanvasStub({ filterSupported: false });
    const { exportEditedImage, supportsCanvasFilter } = await freshModule();
    const file = new File(['a'], 'photo.png', { type: 'image/png' });
    await exportEditedImage({ image, file, rotation: 0, crop, ops: [{ fn: 'grayscale', amount: 1 }] });
    expect(supportsCanvasFilter()).toBe(false);
    const output = canvases.find((c) => c.width === 400);
    expect(output.ctx.filterAtDraw).toBe('none');
    const names = output.ctx.calls.map(([name]) => name);
    expect(names).toContain('getImageData');
    expect(names).toContain('putImageData');
  });
});
