export const SUGGEST_MIN = 2;
export const SUGGEST_LIMIT = 6;
export const SUGGEST_MAX_QUERY = 40;

/** Trim, strip leading @, lowercase, cap length. Returns '' when unusable or under SUGGEST_MIN. */
export function normalizePrefix(raw) {
  if (typeof raw !== 'string') return '';
  const q = raw.trim().replace(/^@+/, '').trim().toLowerCase().slice(0, SUGGEST_MAX_QUERY);
  return q.length >= SUGGEST_MIN ? q : '';
}

/** Backslash-escape LIKE metacharacters so user input matches literally. */
export const escapeLike = (s) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

/** Builds GET /suggest-users handler. Mount after `auth`. queryFn is injectable for tests. */
export function createSuggestHandler(queryFn) {
  return async (req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      const q = normalizePrefix(req.query.q);
      if (!q) return res.json({ users: [] });
      const { rows } = await queryFn(
        `SELECT username, display_name, avatar_url
           FROM users
          WHERE is_public = true AND id <> $2 AND username ILIKE $1 ESCAPE '\\'
          ORDER BY username ASC
          LIMIT ${SUGGEST_LIMIT}`,
        [`${escapeLike(q)}%`, req.user.id]
      );
      res.json({
        users: rows.map((r) => ({
          username: r.username,
          displayName: r.display_name || null,
          avatarUrl: r.avatar_url || null,
        })),
      });
    } catch (err) {
      console.error('Inbox suggest error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
