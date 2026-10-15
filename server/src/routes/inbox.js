import { Router } from 'express';
import { query } from '../config/db.js';
import auth from '../middleware/auth.js';
import { dmLimiter, suggestUsersLimiter } from '../middleware/rateLimit.js';
import { LIMITS } from '../lib/validate.js';
import { createSuggestHandler } from '../lib/suggestUsers.js';

const router = Router();

const STATUSES = ['NEW', 'READ', 'ARCHIVED'];
const SOURCES = ['direct', 'block'];
const INBOX_CAP = 500;
// Strip control characters except tab and newline.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

// Every route here is authenticated and scoped to req.user.id.
router.use(auth);

/**
 * POST /api/inbox/send  { to, message }
 * Direct message to another account, addressed by exact username.
 */
router.post('/send', ...dmLimiter, async (req, res) => {
  // Every account accepts messages from every logged-in user. An opt-out/block setting can be added later.
  try {
    const { to, message } = req.body || {};
    if (typeof to !== 'string') {
      return res.status(400).json({ error: 'Recipient is required' });
    }
    const recipientName = to.trim().toLowerCase().replace(/^@+/, '');
    if (!recipientName) {
      return res.status(400).json({ error: 'Recipient is required' });
    }
    if (typeof message !== 'string') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    const text = message.replace(CONTROL_CHARS, '').trim();
    if (!text) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    if (text.length > LIMITS.directMessage) {
      return res
        .status(400)
        .json({ error: `Message must be ${LIMITS.directMessage} characters or fewer` });
    }

    const { rows: users } = await query('SELECT id, username FROM users WHERE username = $1', [
      recipientName,
    ]);
    const recipient = users[0];
    if (!recipient) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (recipient.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot send a message to yourself' });
    }

    const { rows: counts } = await query(
      `SELECT COUNT(*)::int AS n FROM profile_messages
       WHERE recipient_user_id = $1 AND status <> 'ARCHIVED'`,
      [recipient.id]
    );
    if (counts[0].n >= INBOX_CAP) {
      return res.status(409).json({ error: 'This inbox is full right now. Please try again later.' });
    }

    const answers = [{ id: 'message', label: 'Message', type: 'textarea', value: text }];
    await query(
      `INSERT INTO profile_messages
         (recipient_user_id, sender_user_id, sender_name, source, answers, status)
       VALUES ($1, $2, $3, 'direct', $4::jsonb, 'NEW')`,
      [recipient.id, req.user.id, req.user.username, JSON.stringify(answers)]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Inbox send error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/inbox?status=&source=&page=&limit=
 * Absent or "all" status returns everything except ARCHIVED.
 */
router.get('/', async (req, res) => {
  try {
    const { status, source } = req.query;
    const conditions = ['m.recipient_user_id = $1'];
    const params = [req.user.id];

    if (status === undefined || status === '' || status === 'all') {
      conditions.push(`m.status <> 'ARCHIVED'`);
    } else if (typeof status === 'string' && STATUSES.includes(status)) {
      params.push(status);
      conditions.push(`m.status = $${params.length}`);
    } else {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (source !== undefined && source !== '') {
      if (typeof source !== 'string' || !SOURCES.includes(source)) {
        return res.status(400).json({ error: 'Invalid source' });
      }
      params.push(source);
      conditions.push(`m.source = $${params.length}`);
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const where = conditions.join(' AND ');

    const { rows: totals } = await query(
      `SELECT COUNT(*)::int AS n FROM profile_messages m WHERE ${where}`,
      params
    );
    const { rows: items } = await query(
      `SELECT m.id, m.source, m.block_id, m.sender_user_id, m.sender_name,
              u.username AS sender_username, m.answers, m.status, m.created_at
       FROM profile_messages m
       LEFT JOIN users u ON u.id = m.sender_user_id
       WHERE ${where}
       ORDER BY m.created_at DESC, m.id DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, (page - 1) * limit]
    );

    res.json({ items, total: totals[0].n, page, limit });
  } catch (err) {
    console.error('Inbox list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT COUNT(*)::int AS n FROM profile_messages
       WHERE recipient_user_id = $1 AND status = 'NEW'`,
      [req.user.id]
    );
    res.json({ unread: rows[0].n });
  } catch (err) {
    console.error('Inbox unread error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/suggest-users', suggestUsersLimiter, createSuggestHandler(query));

router.patch('/:id', async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id) || req.params.id.length > 9) {
      return res.status(404).json({ error: 'Message not found' });
    }
    const status = req.body?.status;
    if (typeof status !== 'string' || !STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const { rows } = await query(
      `UPDATE profile_messages SET status = $1
       WHERE id = $2 AND recipient_user_id = $3 RETURNING id, status`,
      [status, Number(req.params.id), req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Inbox update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id) || req.params.id.length > 9) {
      return res.status(404).json({ error: 'Message not found' });
    }
    const { rowCount } = await query(
      'DELETE FROM profile_messages WHERE id = $1 AND recipient_user_id = $2',
      [Number(req.params.id), req.user.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Inbox delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
