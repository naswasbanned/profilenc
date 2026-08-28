import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import auth from '../middleware/auth.js';

const router = Router();

// Username validation: 3-30 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphen
const USERNAME_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;
const RESERVED_USERNAMES = new Set([
  'admin', 'api', 'login', 'register', 'dashboard', 'settings',
  'help', 'support', 'about', 'contact', 'terms', 'privacy',
  'static', 'uploads', 'images', 'public', 'assets', 'health',
  'templates', 'explore', 'featured', 'search', 'edit',
]);

/**
 * POST /api/auth/register
 * Body: { username, email, password, templateSlug? }
 * Returns: { token, expiresIn, user }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, templateSlug } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password required' });
    }

    // Validate username format
    const normalizedUsername = username.toLowerCase().trim();
    if (!USERNAME_REGEX.test(normalizedUsername)) {
      return res.status(400).json({
        error: 'Username must be 3-30 characters, lowercase letters, numbers, and hyphens only',
      });
    }

    if (RESERVED_USERNAMES.has(normalizedUsername)) {
      return res.status(400).json({ error: 'This username is reserved' });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check username availability
    const { rows: existingUser } = await query(
      'SELECT id FROM users WHERE username = $1',
      [normalizedUsername]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Check email availability
    const { rows: existingEmail } = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );
    if (existingEmail.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 12);

    // Insert user
    const { rows: newUser } = await query(
      `INSERT INTO users (username, email, password_hash, display_name, template_slug)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, display_name, created_at`,
      [normalizedUsername, email.toLowerCase().trim(), hash, normalizedUsername, templateSlug || 'developer']
    );

    const user = newUser[0];

    // If template selected, copy template data to user
    if (templateSlug) {
      const { rows: tmpl } = await query(
        'SELECT theme, sections, content FROM templates WHERE slug = $1',
        [templateSlug]
      );

      if (tmpl.length > 0) {
        const template = tmpl[0];

        // Copy theme
        await query(
          `INSERT INTO user_themes (user_id, theme) VALUES ($1, $2)`,
          [user.id, JSON.stringify(template.theme)]
        );

        // Copy sections config
        await query(
          `INSERT INTO user_sections (user_id, config) VALUES ($1, $2)`,
          [user.id, JSON.stringify(template.sections)]
        );

        // Copy template content as user_content rows
        if (template.content && typeof template.content === 'object') {
          for (const [key, data] of Object.entries(template.content)) {
            await query(
              `INSERT INTO user_content (user_id, key, data) VALUES ($1, $2, $3)
               ON CONFLICT (user_id, key) DO NOTHING`,
              [user.id, key, JSON.stringify(data)]
            );
          }
        }
      }
    }

    // Create default theme if none from template
    await query(
      `INSERT INTO user_themes (user_id, theme)
       VALUES ($1, '{}')
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    );

    // Create default sections if none from template
    await query(
      `INSERT INTO user_sections (user_id, config)
       VALUES ($1, '[]')
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, isAdmin: !!user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      expiresIn: '7d',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        isAdmin: !!user.is_admin,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Body: { login (username or email), password }
 * Returns: { token, expiresIn, user }
 */
router.post('/login', async (req, res) => {
  try {
    const { login, password, username: legacyUsername } = req.body;
    const identifier = login || legacyUsername;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Login and password required' });
    }

    // Try users table first (multi-user)
    const { rows } = await query(
      'SELECT id, username, email, password_hash, display_name, avatar_url, is_admin FROM users WHERE username = $1 OR email = $1',
      [identifier.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, isAdmin: !!user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      expiresIn: '7d',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        avatarUrl: user.avatar_url,
        isAdmin: !!user.is_admin,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Auth required. Returns current user info.
 */
router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, username, email, display_name, avatar_url, bio, is_public, is_admin, template_slug, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      isPublic: user.is_public,
      isAdmin: !!user.is_admin,
      templateSlug: user.template_slug,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/check-username
 * Body: { username }
 * Returns: { available: boolean }
 */
router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    const normalized = username.toLowerCase().trim();

    if (!USERNAME_REGEX.test(normalized)) {
      return res.json({ available: false, reason: 'Invalid format' });
    }

    if (RESERVED_USERNAMES.has(normalized)) {
      return res.json({ available: false, reason: 'Reserved' });
    }

    const { rows } = await query(
      'SELECT id FROM users WHERE username = $1',
      [normalized]
    );

    res.json({ available: rows.length === 0 });
  } catch (err) {
    console.error('Check username error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
