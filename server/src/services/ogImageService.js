import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { CARD_W, CARD_H, AVATAR_BOX, COVER_BOX, profileCardSvg, entryCardSvg } from '../lib/ogCard.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const cacheDir = path.join(uploadsDir, 'og'); // shortcut: no eviction — add a cron to prune files older than 7 days when the uploads disk matters

// Bump when the card layout changes so every cached card is redrawn
const CARD_VERSION = 1;
const MAX_INPUT_PIXELS = 50_000_000;

/**
 * Absolute path of a file in our own uploads folder, or null.
 * Remote URLs are never fetched: that would let a profile make the server
 * request internal addresses (SSRF). `ownerId` restricts to one user's folder.
 */
export function localUploadPath(url, ownerId) {
  if (typeof url !== 'string') return null;
  const match = url.trim().match(/^\/uploads\/(\d+)\/([A-Za-z0-9._-]+)$/);
  if (!match || match[2].startsWith('.')) return null;
  if (ownerId !== undefined && Number(match[1]) !== Number(ownerId)) return null;
  return path.join(uploadsDir, match[1], match[2]);
}

/** Stable cache key for everything that ends up on a card. */
export function cardHash(spec) {
  return crypto.createHash('sha1').update(JSON.stringify({ v: CARD_VERSION, ...spec })).digest('hex').slice(0, 20);
}

async function readable(file) {
  if (!file) return null;
  try {
    await fs.access(file);
    return file;
  } catch {
    return null;
  }
}

async function circleAvatar(file, size) {
  const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
  return sharp(file, { limitInputPixels: MAX_INPUT_PIXELS })
    .resize(size, size, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/**
 * Render (or reuse) a card and return the cached JPEG path.
 * spec.kind: 'profile' | 'entry' | 'custom'
 */
export async function getCard(spec) {
  const file = path.join(cacheDir, `${cardHash(spec)}.jpg`);
  if (await readable(file)) return file;

  let image;
  if (spec.kind === 'custom') {
    image = sharp(spec.imagePath, { limitInputPixels: MAX_INPUT_PIXELS }).resize(CARD_W, CARD_H, { fit: 'cover' });
  } else if (spec.kind === 'entry') {
    const cover = await readable(spec.coverPath);
    const svg = entryCardSvg({ ...spec, hasCover: Boolean(cover) });
    const layers = [];
    if (cover) {
      const buf = await sharp(cover, { limitInputPixels: MAX_INPUT_PIXELS }).resize(COVER_BOX.width, COVER_BOX.height, { fit: 'cover' }).toBuffer();
      layers.push({ input: buf, left: COVER_BOX.left, top: COVER_BOX.top });
    }
    image = sharp(Buffer.from(svg)).composite(layers);
  } else {
    const avatar = await readable(spec.avatarPath);
    const svg = profileCardSvg({ ...spec, hasAvatar: Boolean(avatar) });
    const layers = avatar
      ? [{ input: await circleAvatar(avatar, AVATAR_BOX.size), left: AVATAR_BOX.left, top: AVATAR_BOX.top }]
      : [];
    image = sharp(Buffer.from(svg)).composite(layers);
  }

  await fs.mkdir(cacheDir, { recursive: true });
  // Write to a temp name first so a concurrent request never serves a half-written file
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await image.flatten({ background: '#fbf7ee' }).jpeg({ quality: 86 }).toFile(tmp);
  await fs.rename(tmp, file);
  return file;
}
