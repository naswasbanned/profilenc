import { Router } from 'express';
import crypto from 'crypto';
import { query } from '../config/db.js';
import { optionalAuth } from '../middleware/auth.js';
import { messageLimiter } from '../middleware/rateLimit.js';
import { clientIp } from '../middleware/clientIp.js';
import { validateSubmission } from '../lib/validateSubmission.js';

const router = Router();

const MIN_FILL_MS = 3000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const INBOX_CAP = 500;

async function verifyTurnstile(token, ip) {
  if (typeof token !== 'string' || !token || token.length > 4096) return false;
  try {
    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
      signal: AbortSignal.timeout(5000),
    });
    const json = await resp.json();
    return json?.success === true;
  } catch {
    return false;
  }
}

function findContactBlock(content, blockId) {
  for (const tab of content?.tabs || []) {
    if (tab?.enabled === false) continue;
    for (const block of tab?.blocks || []) {
      if (block?.id === blockId && block?.type === 'contact') {
        return block.hidden === true ? null : block;
      }
    }
  }
  return null;
}

/**
 * POST /api/u/:username/messages
 * Public contact block submission. Delivered to the owner's dashboard inbox.
 */
router.post('/:username/messages', optionalAuth, ...messageLimiter, async (req, res) => {
  try {
    const body = req.body || {};

    // Honeypot: pretend success, store nothing.
    if (typeof body.website === 'string' && body.website.trim()) {
      return res.status(201).json({ success: true });
    }

    const elapsed = Date.now() - Number(body.rendered_at);
    if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed > MAX_AGE_MS) {
      return res.status(400).json({ error: 'Please reload the page and try again' });
    }
    if (elapsed < MIN_FILL_MS) {
      return res.status(400).json({ error: 'Please take a moment to fill in the form' });
    }

    const ip = clientIp(req);
    if (process.env.TURNSTILE_SECRET) {
      if (!(await verifyTurnstile(body.turnstile_token, ip))) {
        return res.status(400).json({ error: 'Verification failed. Please try again.' });
      }
    }

    const username = String(req.params.username).toLowerCase().replace(/^@+/, '');
    const { rows: users } = await query(
      'SELECT id, username, is_public FROM users WHERE username = $1',
      [username]
    );
    const owner = users[0];
    if (!owner) return res.status(404).json({ error: 'Profile not found' });
    if (!owner.is_public) return res.status(403).json({ error: 'This profile is private' });

    const { rows: contents } = await query(
      'SELECT data FROM user_content WHERE user_id = $1 AND key = $2',
      [owner.id, 'modular_profile']
    );
    const blockId = typeof body.block_id === 'string' ? body.block_id : '';
    const block = blockId ? findContactBlock(contents[0]?.data, blockId) : null;
    if (!block) return res.status(404).json({ error: 'Form not found' });

    if (req.user && req.user.id === owner.id) {
      return res.status(400).json({ error: 'You cannot send a message to your own profile' });
    }

    const result = validateSubmission(block.data, body.answers, req.user, {
      anonymous: body.anonymous === true,
    });
    if (!result.ok) return res.status(result.status).json({ error: result.error });

    const { rows: counts } = await query(
      `SELECT COUNT(*)::int AS n FROM profile_messages
       WHERE recipient_user_id = $1 AND status <> 'ARCHIVED'`,
      [owner.id]
    );
    if (counts[0].n >= INBOX_CAP) {
      return res.status(409).json({ error: 'This inbox is not accepting messages right now.' });
    }

    const ipHash = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'inbox-ip-salt')
      .update(ip)
      .digest('hex');

    await query(
      `INSERT INTO profile_messages
         (recipient_user_id, sender_user_id, sender_name, source, block_id, answers, status, ip_hash)
       VALUES ($1, $2, $3, 'block', $4, $5::jsonb, 'NEW', $6)`,
      [
        owner.id,
        result.sender?.userId ?? null,
        result.sender?.name ?? null,
        blockId,
        JSON.stringify(result.answers),
        ipHash,
      ]
    );

    const custom =
      typeof block.data?.successMessage === 'string' ? block.data.successMessage.trim() : '';
    res.status(201).json({
      success: true,
      message: custom && custom.length <= 300 ? custom : 'Message sent.',
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
