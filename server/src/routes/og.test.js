import { describe, expect, it, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const users = {
  nas: {
    id: 1, username: 'nas', display_name: 'Nas', avatar_url: '/uploads/1/a.webp', bio: 'Builder <b>of</b> things', is_public: true,
    theme: { global: { accentColor: '#2b4bff' } },
    content: { tabs: [{ blocks: [{ type: 'journal', data: { items: [
      { id: 'e1', title: 'First entry', date: '2026-10-09', excerpt: 'Short **summary**', coverUrl: '/uploads/1/cover.webp' },
      { id: 'e2', title: 'No cover', content: 'Body text' },
    ] } }] }] },
  },
  custom: {
    id: 3, username: 'custom', display_name: 'Cee', avatar_url: null, bio: 'bio', is_public: true,
    og_image_url: '/uploads/3/share.webp', og_title: 'My own title', og_description: 'My own description', content: null,
  },
  hidden: { id: 2, username: 'hidden', display_name: 'Secret', avatar_url: null, bio: 'private bio', is_public: false, content: null },
};

vi.mock('../config/db.js', () => ({
  query: vi.fn(async (_sql, [username]) => ({ rows: users[username] ? [users[username]] : [] })),
}));

// Card rendering is covered separately; here we only check which card is asked for
const fixture = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'public', 'og-default.png');
const cards = [];
vi.mock('../services/ogImageService.js', async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, getCard: vi.fn(async (spec) => { cards.push(spec); return fixture; }) };
});

const { default: ogRoutes } = await import('./og.js');

let server;
let base;
beforeAll(async () => {
  process.env.PUBLIC_URL = 'https://profilenc.test/';
  const app = express();
  app.use('/api/og', ogRoutes);
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}/api/og`;
});
afterAll(() => server.close());
beforeEach(() => { cards.length = 0; });

const get = async (p) => {
  const res = await fetch(base + p, { headers: { host: 'evil.example' }, redirect: 'manual' });
  return { status: res.status, type: res.headers.get('content-type'), location: res.headers.get('location'), cache: res.headers.get('cache-control'), html: await res.text() };
};
const meta = (html, prop) => html.match(new RegExp(`(?:property|name)="${prop}" content="([^"]*)"`))?.[1];

describe('OG preview pages', () => {
  it('serves the generic site preview at the root', async () => {
    const { status, html } = await get('/');
    expect(status).toBe(200);
    expect(meta(html, 'og:title')).toBe('Profilenc');
    expect(meta(html, 'og:url')).toBe('https://profilenc.test/');
    expect(meta(html, 'og:image')).toBe('https://profilenc.test/og-default.png');
  });

  it('renders profile tags pointing at the generated card', async () => {
    const { status, type, html } = await get('/@nas');
    expect(status).toBe(200);
    expect(type).toMatch(/text\/html/);
    expect(meta(html, 'og:title')).toBe('Nas (@nas) · Profilenc');
    expect(meta(html, 'og:description')).toBe('Builder &lt;b&gt;of&lt;/b&gt; things');
    expect(meta(html, 'og:image')).toMatch(/^https:\/\/profilenc\.test\/api\/og\/image\/@nas\?v=[0-9a-f]{20}$/);
    expect(meta(html, 'og:url')).toBe('https://profilenc.test/@nas');
    expect(html).not.toContain('evil.example');
  });

  it('gives entries their own card and tags', async () => {
    const { html } = await get('/@nas/journal/e1');
    expect(meta(html, 'og:type')).toBe('article');
    expect(meta(html, 'og:title')).toBe('First entry by Nas (@nas) · Profilenc');
    expect(meta(html, 'og:description')).toBe('Short summary');
    expect(meta(html, 'og:image')).toMatch(/\/api\/og\/image\/@nas\/journal\/e1\?v=/);
    expect(meta(html, 'og:url')).toBe('https://profilenc.test/@nas/journal/e1');
  });

  it('uses custom title and description when set', async () => {
    const { html } = await get('/@custom');
    expect(meta(html, 'og:title')).toBe('My own title · Profilenc');
    expect(meta(html, 'og:description')).toBe('My own description');
  });

  it('falls back to the profile preview for an unknown entry', async () => {
    const { html } = await get('/@nas/journal/missing');
    expect(meta(html, 'og:title')).toBe('Nas (@nas) · Profilenc');
  });

  it('reveals nothing about private or missing profiles', async () => {
    for (const p of ['/@hidden', '/@hidden/journal/x', '/@nobody']) {
      const { status, html } = await get(p);
      expect(status).toBe(200);
      expect(meta(html, 'og:title')).toBe('Profilenc');
      expect(html).not.toMatch(/Secret|private bio|hidden/);
    }
  });
});

describe('OG preview images', () => {
  it('draws the profile card with the theme accent and local avatar', async () => {
    const res = await get('/image/@nas?v=abc');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/image\/jpeg/);
    expect(res.cache).toContain('immutable');
    expect(cards[0]).toMatchObject({ kind: 'profile', username: 'nas', accent: '#2b4bff' });
    expect(cards[0].avatarPath).toMatch(/uploads\/1\/a\.webp$/);
  });

  it('draws the entry card with its cover', async () => {
    await get('/image/@nas/journal/e1');
    expect(cards[0]).toMatchObject({ kind: 'entry', title: 'First entry', author: '@nas', date: '2026-10-09' });
    expect(cards[0].coverPath).toMatch(/uploads\/1\/cover\.webp$/);
  });

  it('uses the custom image instead of drawing a card', async () => {
    await get('/image/@custom');
    expect(cards[0].kind).toBe('custom');
    expect(cards[0].imagePath).toMatch(/uploads\/3\/share\.webp$/);
  });

  it('redirects private and missing profiles to the default image', async () => {
    for (const p of ['/image/@hidden', '/image/@nobody/journal/x']) {
      const res = await get(p);
      expect(res.status).toBe(302);
      expect(res.location).toBe('/og-default.png');
    }
    expect(cards).toHaveLength(0);
  });
});
