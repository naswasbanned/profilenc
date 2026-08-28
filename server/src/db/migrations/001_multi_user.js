import { query } from '../../config/db.js';

/**
 * Multi-user schema migration.
 * Creates: users, user_content, user_themes, user_sections, templates.
 * Adds user_id column to images table.
 * Idempotent — safe to run multiple times.
 */
async function migrate() {
  console.log('Running multi-user migration...\n');

  // Users table
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
  console.log('  ✓ users table');

  // User-scoped content (replaces global content for multi-user)
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
  console.log('  ✓ user_content table');

  // Per-user theme config
  await query(`
    CREATE TABLE IF NOT EXISTS user_themes (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      theme       JSONB NOT NULL DEFAULT '{}',
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ user_themes table');

  // Per-user section layout config
  await query(`
    CREATE TABLE IF NOT EXISTS user_sections (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      config      JSONB NOT NULL DEFAULT '[]',
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('  ✓ user_sections table');

  // Starter templates
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
  console.log('  ✓ templates table');

  // Add user_id to images (nullable for backward compat during migration)
  await query(`
    ALTER TABLE images ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
  `);
  console.log('  ✓ images.user_id column');

  // Index for fast user content lookups
  await query(`
    CREATE INDEX IF NOT EXISTS idx_user_content_user_key ON user_content(user_id, key)
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id)
  `);
  console.log('  ✓ indexes');

  console.log('\nMulti-user migration complete.');
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
