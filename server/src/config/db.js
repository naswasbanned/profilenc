import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Run a parameterised SQL query.
 * Usage: const { rows } = await query('SELECT * FROM users WHERE username = $1', ['jane']);
 */
export async function query(text, params) {
  return pool.query(text, params);
}

export default pool;
