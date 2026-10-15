import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

process.env.JWT_SECRET = 'test-secret';

const { default: express } = await import('express');
const { default: jwt } = await import('jsonwebtoken');
const { default: auth } = await import('../src/middleware/auth.js');
const { default: inboxRouter } = await import('../src/routes/inbox.js');
const { suggestUsersLimiter } = await import('../src/middleware/rateLimit.js');
const { createSuggestHandler, escapeLike, normalizePrefix } = await import(
  '../src/lib/suggestUsers.js'
);

const token = (id, username = `u${id}`) => jwt.sign({ id, username }, process.env.JWT_SECRET);

const USERS = [
  { id: 1, username: 'me_self', display_name: 'Me', avatar_url: null, is_public: true },
  { id: 2, username: 'alice', display_name: 'Alice A', avatar_url: 'http://x/a.png', is_public: true },
  { id: 3, username: 'alan', display_name: null, avatar_url: null, is_public: true },
  { id: 4, username: 'malik', display_name: 'Malik', avatar_url: null, is_public: true },
  { id: 5, username: 'a_b', display_name: null, avatar_url: null, is_public: true },
  { id: 6, username: 'ab', display_name: null, avatar_url: null, is_public: true },
  { id: 7, username: 'alhidden', display_name: null, avatar_url: null, is_public: false },
  { id: 8, username: '100%', display_name: null, avatar_url: null, is_public: true },
  { id: 9, username: 'back\\slash', display_name: null, avatar_url: null, is_public: true },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 20 + i,
    username: `zed${String.fromCharCode(106 - i)}`, // zedj .. zeda, inserted in reverse order
    display_name: null,
    avatar_url: null,
    is_public: true,
  })),
];

/** Emulates ILIKE <pattern> ESCAPE '\' on the in-memory list and records calls. */
function makeFakeQuery() {
  const calls = [];
  const fn = async (sql, params) => {
    calls.push({ sql, params });
    const [pattern, selfId] = params;
    let re = '';
    for (let i = 0; i < pattern.length; i++) {
      const c = pattern[i];
      if (c === '\\') re += pattern[++i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      else if (c === '%') re += '.*';
      else if (c === '_') re += '.';
      else re += c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    const rx = new RegExp(`^${re}$`, 'is');
    const rows = USERS.filter((u) => u.is_public && u.id !== selfId && rx.test(u.username))
      .sort((a, b) => (a.username < b.username ? -1 : a.username > b.username ? 1 : 0))
      .slice(0, 6)
      .map(({ username, display_name, avatar_url }) => ({ username, display_name, avatar_url }));
    return { rows };
  };
  fn.calls = calls;
  return fn;
}

async function serve(app) {
  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  return { base, close: () => new Promise((r) => server.close(r)) };
}

async function withHandler(fn) {
  const q = makeFakeQuery();
  const app = express();
  app.get('/s', auth, createSuggestHandler(q));
  const s = await serve(app);
  try {
    await fn(q, async (qs, uid = 1) => {
      const res = await fetch(`${s.base}/s${qs}`, {
        headers: { Authorization: `Bearer ${token(uid)}` },
      });
      const text = await res.text();
      return { res, text, body: JSON.parse(text) };
    });
  } finally {
    await s.close();
  }
}

test('requires auth on the real inbox router', async () => {
  const app = express();
  app.use('/api/inbox', inboxRouter);
  const s = await serve(app);
  try {
    const res = await fetch(`${s.base}/api/inbox/suggest-users?q=ab`);
    assert.equal(res.status, 401);
  } finally {
    await s.close();
  }
});

test('short or empty queries return [] without querying', async () => {
  await withHandler(async (q, get) => {
    for (const qs of ['', '?q=', '?q=a', '?q=%40a', '?q=%20a%20', '?q=%40', '?q=%40%20%20']) {
      const { res, body } = await get(qs);
      assert.equal(res.status, 200);
      assert.deepEqual(body, { users: [] }, qs);
    }
    assert.equal(q.calls.length, 0);
  });
});

test('sets Cache-Control: no-store', async () => {
  await withHandler(async (_q, get) => {
    const { res } = await get('?q=al');
    assert.equal(res.headers.get('cache-control'), 'no-store');
  });
});

test('prefix semantics with case, @ and space normalization', async () => {
  await withHandler(async (_q, get) => {
    for (const qs of ['?q=al', '?q=AL', '?q=%40AL', '?q=%20al%20']) {
      const { body } = await get(qs);
      assert.deepEqual(
        body.users.map((u) => u.username),
        ['alan', 'alice'],
        qs
      );
    }
  });
});

test('metacharacters are literal', async () => {
  assert.equal(escapeLike('a_b%c\\d'), 'a\\_b\\%c\\\\d');
  assert.equal(normalizePrefix('%%'), '%%');
  await withHandler(async (q, get) => {
    let r = await get('?q=a_');
    assert.deepEqual(r.body.users.map((u) => u.username), ['a_b']);
    assert.equal(q.calls.at(-1).params[0], 'a\\_%');

    r = await get('?q=%25%25');
    assert.deepEqual(r.body.users, []);
    assert.equal(q.calls.at(-1).params[0], '\\%\\%%');

    r = await get('?q=100%25');
    assert.deepEqual((await get('?q=10%25')).body.users, []);
    r = await get('?q=100%25');
    assert.deepEqual(r.body.users.map((u) => u.username), ['100%']);

    r = await get('?q=_x');
    assert.deepEqual(r.body.users, []);

    r = await get('?q=back%5C');
    assert.deepEqual(r.body.users.map((u) => u.username), ['back\\slash']);
    assert.equal(q.calls.at(-1).params[0], 'back\\\\%');
  });
});

test('excludes self and non-public users', async () => {
  await withHandler(async (q, get) => {
    let r = await get('?q=me', 1);
    assert.deepEqual(r.body.users, []);
    assert.equal(q.calls.at(-1).params[1], 1);
    r = await get('?q=me', 2);
    assert.deepEqual(r.body.users.map((u) => u.username), ['me_self']);
    r = await get('?q=alh');
    assert.deepEqual(r.body.users, []);
  });
});

test('caps at 6 alphabetical results', async () => {
  await withHandler(async (_q, get) => {
    const { body } = await get('?q=zed');
    assert.deepEqual(
      body.users.map((u) => u.username),
      ['zeda', 'zedb', 'zedc', 'zedd', 'zede', 'zedf']
    );
  });
});

test('response exposes only username, displayName, avatarUrl', async () => {
  await withHandler(async (_q, get) => {
    const { body, text } = await get('?q=al');
    for (const u of body.users) {
      assert.deepEqual(Object.keys(u).sort(), ['avatarUrl', 'displayName', 'username']);
    }
    assert.doesNotMatch(text, /email|password_hash|"id"/);
    const alice = body.users.find((u) => u.username === 'alice');
    assert.equal(alice.displayName, 'Alice A');
    assert.equal(alice.avatarUrl, 'http://x/a.png');
  });
});

test('query is parameterized and uses a single-backslash ESCAPE', async () => {
  await withHandler(async (q, get) => {
    const evil = "x'; DROP TABLE users;--";
    await get(`?q=${encodeURIComponent(evil)}`);
    await get('?q=al');
    assert.equal(q.calls.length, 2);
    assert.equal(q.calls[0].sql, q.calls[1].sql);
    assert.ok(!q.calls[0].sql.includes('DROP'));
    assert.ok(q.calls[0].sql.includes("ESCAPE '\\'"));
    assert.ok(!q.calls[0].sql.includes("ESCAPE '\\\\'"));
    assert.equal(q.calls[0].params[0], `${evil.toLowerCase()}%`);
  });
});

test('array or object q returns []', async () => {
  await withHandler(async (q, get) => {
    for (const qs of ['?q[]=ab', '?q=ab&q=cd', '?q[a]=ab']) {
      const { res, body } = await get(qs);
      assert.equal(res.status, 200, qs);
      assert.deepEqual(body, { users: [] }, qs);
    }
    assert.equal(q.calls.length, 0);
  });
});

test('limiter: 60 per minute per user, then 429; separate bucket per user', async () => {
  const app = express();
  app.get('/s', auth, suggestUsersLimiter, (_req, res) => res.json({ users: [] }));
  const s = await serve(app);
  const hit = (uid) =>
    fetch(`${s.base}/s`, { headers: { Authorization: `Bearer ${token(uid)}` } });
  try {
    for (let i = 0; i < 60; i++) assert.equal((await hit(901)).status, 200);
    const blocked = await hit(901);
    assert.equal(blocked.status, 429);
    assert.match((await blocked.json()).error, /Too many username lookups/);
    assert.equal((await hit(902)).status, 200);
  } finally {
    await s.close();
  }
});
