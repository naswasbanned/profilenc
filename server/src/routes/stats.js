import { Router } from 'express';
import express from 'express';
import { query } from '../config/db.js';
import auth, { optionalAuth } from '../middleware/auth.js';
import { statsLimiter } from '../middleware/rateLimit.js';
import { isBotUserAgent, parseStatEvent, parseDays } from '../lib/stats.js';

const router = Router();

/**
 * POST /api/stats/:username
 * Public beacon: { kind: 'view' | 'click', target? }. Always answers 204 so
 * the client never retries or learns whether the event counted. Bots, the
 * profile owner, private and unknown profiles are dropped silently.
 */
router.post(
  '/:username',
  statsLimiter,
  // sendBeacon posts text/plain, which express.json() skips
  express.text({ type: 'text/plain', limit: '2kb' }),
  optionalAuth,
  async (req, res) => {
    res.status(204).end();
    try {
      if (isBotUserAgent(req.get('user-agent'))) return;

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return;
        }
      }
      const event = parseStatEvent(body);
      if (!event) return;

      const { rows } = await query(
        'SELECT id, is_public FROM users WHERE username = $1',
        [String(req.params.username).replace(/^@/, '').toLowerCase()]
      );
      const user = rows[0];
      if (!user || !user.is_public || req.user?.id === user.id) return;

      await query(
        `INSERT INTO profile_stats_daily (user_id, day, kind, target, count)
         VALUES ($1, CURRENT_DATE, $2, $3, 1)
         ON CONFLICT (user_id, day, kind, target) DO UPDATE SET count = profile_stats_daily.count + 1`,
        [user.id, event.kind, event.target]
      );
    } catch (err) {
      console.error('Stats track error:', err);
    }
  }
);

/**
 * GET /api/stats?days=30
 * Owner only: daily views and the most clicked targets for the logged-in user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const days = parseDays(req.query.days);
    const since = `CURRENT_DATE - ($2::int - 1)`;

    const [{ rows: daily }, { rows: topClicks }] = await Promise.all([
      query(
        `SELECT to_char(day, 'YYYY-MM-DD') AS day, count
         FROM profile_stats_daily
         WHERE user_id = $1 AND kind = 'view' AND day >= ${since}
         ORDER BY day`,
        [req.user.id, days]
      ),
      query(
        `SELECT target, SUM(count)::int AS count
         FROM profile_stats_daily
         WHERE user_id = $1 AND kind = 'click' AND day >= ${since}
         GROUP BY target ORDER BY count DESC LIMIT 5`,
        [req.user.id, days]
      ),
    ]);

    res.json({
      days,
      daily: daily.map((r) => ({ day: r.day, views: Number(r.count) })),
      totalViews: daily.reduce((sum, r) => sum + Number(r.count), 0),
      topClicks,
    });
  } catch (err) {
    console.error('Stats read error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
