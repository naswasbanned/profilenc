import { query } from '../config/db.js';

/**
 * Create all required tables (both legacy and multi-user).
 * Idempotent — safe to run multiple times.
 */
export async function runMigrations() {
  console.log('Running database migrations...');

  // Legacy single-user tables
  await query(`
    CREATE TABLE IF NOT EXISTS content (
      key         TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

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

  await query(`
    CREATE TABLE IF NOT EXISTS admin_user (
      id              SERIAL PRIMARY KEY,
      username        TEXT NOT NULL UNIQUE,
      password_hash   TEXT NOT NULL
    )
  `);

  // Multi-user tables
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id              SERIAL PRIMARY KEY,
      username        TEXT NOT NULL UNIQUE,
      email           TEXT NOT NULL UNIQUE,
      password_hash   TEXT NOT NULL,
      display_name    TEXT,
      avatar_url      TEXT,
      bio             TEXT,
      is_public       BOOLEAN DEFAULT true,
      template_slug   TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_content (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      key         TEXT NOT NULL,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, key)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_themes (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      theme       JSONB NOT NULL DEFAULT '{}',
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_sections (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      config      JSONB NOT NULL DEFAULT '[]',
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS templates (
      id          SERIAL PRIMARY KEY,
      slug        TEXT NOT NULL UNIQUE,
      name        TEXT NOT NULL,
      description TEXT,
      preview_url TEXT,
      theme       JSONB NOT NULL DEFAULT '{}',
      sections    JSONB NOT NULL DEFAULT '[]',
      content     JSONB NOT NULL DEFAULT '{}',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Add user_id to images
  await query(`
    ALTER TABLE images ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  `);

  // Add is_admin to users
  await query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false
  `);

  // Patch notes table
  await query(`
    CREATE TABLE IF NOT EXISTS patch_notes (
      id          SERIAL PRIMARY KEY,
      version     TEXT NOT NULL UNIQUE,
      status      TEXT NOT NULL DEFAULT 'UPDATE',
      date        TEXT NOT NULL,
      codename    TEXT,
      title       TEXT NOT NULL,
      changes     JSONB NOT NULL DEFAULT '[]',
      order_num   INTEGER DEFAULT 0,
      is_current  BOOLEAN DEFAULT false,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Global site settings / Landing CMS table
  await query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key         TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Open community suggestions table
  await query(`
    CREATE TABLE IF NOT EXISTS suggestions (
      id          SERIAL PRIMARY KEY,
      name        TEXT,
      email       TEXT,
      category    TEXT NOT NULL DEFAULT 'DESIGN',
      title       TEXT NOT NULL,
      message     TEXT NOT NULL,
      image_url   TEXT,
      status      TEXT NOT NULL DEFAULT 'NEW',
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Indexes
  await query(`
    CREATE INDEX IF NOT EXISTS idx_user_content_user_key ON user_content(user_id, key)
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id)
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_patch_notes_order ON patch_notes(order_num, created_at DESC)
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_suggestions_created ON suggestions(created_at DESC)
  `);

  console.log('  ✓ All database tables and indexes verified.');
}

// Standalone CLI execution
if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
