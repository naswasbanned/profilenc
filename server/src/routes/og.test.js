import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';
import express from 'express';

const users = {
  nas: {
    id: 1, username: 'nas', display_name: 'Nas', avatar_url: '/uploads/1/a.webp', bio: 'Builder <b>of</b> things', is_public: true,
    content: { tabs: [{ blocks: [{ type: 'journal', data: { items: [
      { id: 'e1', title: 'First entry', excerpt: 'Short **summary**', coverUrl: '/uploads/1/cover.webp' },
      { id: 'e2', title: 'No cover', content: 'Body text' },
    ] } }] }] },
  },
  hidden: { id: 2, username: 'hidden', display_name: 'Secret', avatar_url: null, bio: 'private bio', is_public: false, content: null },
};

vi.mock('../config/db.js', () => ({
  query: vi.fn(async (_sql, [username]) => ({ rows: users[username] ? [users[username]] : [] })),
}));

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

const get = async (path) => {
  const res = await fetch(base + path, { headers: { host: 'evil.example' } });
  return { status: res.status, type: res.headers.get('content-type'), html: await res.text() };
};
const meta = (html, prop) => html.match(new RegExp(`(?:property|name)="${prop}" content="([^"]*)"`))?.[1];

describe('OG preview route', () => {
  it('renders profile tags with escaped bio and absolute avatar', async () => {
    const { status, type, html } = await get('/@nas');
    expect(status).toBe(200);
    expect(type).toMatch(/text\/html/);
    expect(meta(html, 'og:title')).toBe('Nas (@nas) · Profilenc');
    expect(meta(html, 'og:description')).toBe('Builder &lt;b&gt;of&lt;/b&gt; things');
    expect(meta(html, 'og:image')).toBe('https://profilenc.test/uploads/1/a.webp');
    expect(meta(html, 'og:url')).toBe('https://profilenc.test/@nas');
    expect(html).not.toContain('evil.example');
  });

  it('renders entry tags with cover, falling back to the avatar', async () => {
    const one = await get('/@nas/journal/e1');
    expect(meta(one.html, 'og:type')).toBe('article');
    expect(meta(one.html, 'og:title')).toBe('First entry by Nas (@nas) · Profilenc');
    expect(meta(one.html, 'og:description')).toBe('Short summary');
    expect(meta(one.html, 'og:image')).toBe('https://profilenc.test/uploads/1/cover.webp');
    expect(meta(one.html, 'og:url')).toBe('https://profilenc.test/@nas/journal/e1');
    const two = await get('/@nas/journal/e2');
    expect(meta(two.html, 'og:image')).toBe('https://profilenc.test/uploads/1/a.webp');
  });

  it('falls back to the profile preview for an unknown entry', async () => {
    const { html } = await get('/@nas/journal/missing');
    expect(meta(html, 'og:title')).toBe('Nas (@nas) · Profilenc');
  });

  it('reveals nothing about private or missing profiles', async () => {
    for (const path of ['/@hidden', '/@hidden/journal/x', '/@nobody']) {
      const { status, html } = await get(path);
      expect(status).toBe(200);
      expect(meta(html, 'og:title')).toBe('Profilenc');
      expect(html).not.toMatch(/Secret|private bio|hidden/);
    }
  });
});
