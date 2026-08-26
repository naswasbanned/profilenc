import { query } from '../config/db.js';

/**
 * Create all required tables. Idempotent — safe to run multiple times.
 */
async function migrate() {
  console.log('Running migrations...');

  await query(`
    CREATE TABLE IF NOT EXISTS content (
      key         TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ content table');

  await query(`
    CREATE TABLE IF NOT EXISTS images (
      id              SERIAL PRIMARY KEY,
      filename        TEXT NOT NULL UNIQUE,
      original_name   TEXT NOT NULL,
      size_bytes      INTEGER NOT NULL,
      width           INTEGER,
      height          INTEGER,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ images table');

  await query(`
    CREATE TABLE IF NOT EXISTS admin_user (
      id              SERIAL PRIMARY KEY,
      username        TEXT NOT NULL UNIQUE,
      password_hash   TEXT NOT NULL
    )
  `);
  console.log('  ✓ admin_user table');

  console.log('Migrations complete.');
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
