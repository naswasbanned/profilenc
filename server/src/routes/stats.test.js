import { describe, expect, it, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import express from 'express';
import jwt from 'jsonwebtoken';

const calls = [];
vi.mock('../config/db.js', () => ({
  query: vi.fn(async (sql, params) => {
    calls.push({ sql, params });
    if (sql.startsWith('SELECT id, is_public')) {
      const users = { nas: { id: 1, is_public: true }, hidden: { id: 2, is_public: false } };
      return { rows: users[params[0]] ? [users[params[0]]] : [] };
    }
    if (sql.includes("kind = 'view'")) return { rows: [{ day: '2026-10-09', count: 3 }, { day: '2026-10-10', count: '2' }] };
    if (sql.includes("kind = 'click'")) return { rows: [{ target: 'block:b1|https://x.y', count: 4 }] };
    return { rows: [] };
  }),
}));

process.env.JWT_SECRET = 'test-secret';
const { default: statsRoutes } = await import('./stats.js');

const BROWSER = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128.0 Safari/537.36';
const token = (id) => jwt.sign({ id, username: id === 1 ? 'nas' : 'other' }, 'test-secret');

let server;
let base;
beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/stats', statsRoutes);
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://127.0.0.1:${server.address().port}/api/stats`;
});
afterAll(() => server.close());
beforeEach(() => { calls.length = 0; });

const settle = () => new Promise((r) => setTimeout(r, 30));
const track = async (username, body, { ua = BROWSER, auth, type = 'text/plain' } = {}) => {
  const headers = { 'user-agent': ua, 'content-type': type };
  if (auth) headers.authorization = `Bearer ${auth}`;
  const res = await fetch(`${base}/${username}`, { method: 'POST', headers, body: JSON.stringify(body) });
  await settle();
  return res.status;
};
const inserts = () => calls.filter((c) => c.sql.includes('INSERT INTO profile_stats_daily'));

describe('POST /api/stats/:username', () => {
  it('counts a guest view from a sendBeacon text body', async () => {
    expect(await track('nas', { kind: 'view' })).toBe(204);
    expect(inserts()).toHaveLength(1);
    expect(inserts()[0].params).toEqual([1, 'view', '']);
  });

  it('counts a click from a JSON body', async () => {
    await track('@nas', { kind: 'click', target: 'block:b1|https://x.y' }, { type: 'application/json' });
    expect(inserts()[0].params).toEqual([1, 'click', 'block:b1|https://x.y']);
  });

  it('drops bots, the owner, private and unknown profiles, and bad events', async () => {
    await track('nas', { kind: 'view' }, { ua: 'Discordbot/2.0' });
    await track('nas', { kind: 'view' }, { ua: '' });
    await track('nas', { kind: 'view' }, { auth: token(1) });
    await track('hidden', { kind: 'view' });
    await track('nobody', { kind: 'view' });
    await track('nas', { kind: 'delete-everything' });
    await track('nas', { kind: 'click' });
    expect(inserts()).toHaveLength(0);
  });

  it('still counts a logged-in visitor who is not the owner', async () => {
    await track('nas', { kind: 'view' }, { auth: token(5) });
    expect(inserts()).toHaveLength(1);
  });
});

describe('GET /api/stats', () => {
  it('requires login', async () => {
    expect((await fetch(base)).status).toBe(401);
  });

  it("returns only the caller's own numbers", async () => {
    const res = await fetch(`${base}?days=7`, { headers: { authorization: `Bearer ${token(1)}` } });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toEqual({
      days: 7,
      daily: [{ day: '2026-10-09', views: 3 }, { day: '2026-10-10', views: 2 }],
      totalViews: 5,
      topClicks: [{ target: 'block:b1|https://x.y', count: 4 }],
    });
    expect(calls.every((c) => c.params[0] === 1)).toBe(true);
  });
});
