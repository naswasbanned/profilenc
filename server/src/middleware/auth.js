import jwt from 'jsonwebtoken';

/**
 * Express middleware — verifies JWT from Authorization header.
 * Attaches decoded payload to req.user.
 * Returns 401 if missing/invalid/expired.
 */
export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth — if token present and valid, attaches req.user.
 * If missing or invalid, continues without req.user (no 401).
 * Useful for public routes that behave differently for owners.
 */
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next();
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Invalid token — continue unauthenticated
  }
  next();
}

/**
 * Middleware — checks that req.user.username matches :username param.
 * Must be used after auth middleware.
 */
export function ownerOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.username !== req.params.username && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized to modify this profile' });
  }
  next();
}

/**
 * Middleware — checks that req.user is an administrator.
 * Must be used after auth middleware.
 */
export async function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Fast check from decoded token or verify against database
  if (req.user.isAdmin) {
    return next();
  }

  try {
    const { query } = await import('../config/db.js');
    const { rows } = await query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (rows.length > 0 && rows[0].is_admin) {
      req.user.isAdmin = true;
      return next();
    }
    return res.status(403).json({ error: 'Admin privileges required' });
  } catch (err) {
    console.error('adminOnly check error:', err);
    return res.status(500).json({ error: 'Internal authorization error' });
  }
}


