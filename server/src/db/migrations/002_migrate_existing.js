import bcrypt from 'bcrypt';
import { query } from '../../config/db.js';

/**
 * Migrate existing single-user data to multi-user model.
 * 
 * 1. Creates user 'nas' from existing admin_user credentials
 * 2. Copies all content rows to user_content
 * 3. Assigns all images to user 'nas'
 * 4. Creates default theme and sections config
 */
export async function migrateExisting() {
  console.log('Checking legacy data migration to multi-user...');

  // 1. Create user 'nas' from admin_user
  const { rows: admins } = await query(
    'SELECT username, password_hash FROM admin_user LIMIT 1'
  );

  let userId;

  if (admins.length > 0) {
    const admin = admins[0];
    const { rows: existing } = await query(
      'SELECT id FROM users WHERE username = $1',
      ['nas']
    );

    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const { rows: newUser } = await query(
        `INSERT INTO users (username, email, password_hash, display_name, template_slug)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        ['nas', 'nas@gnc.web.id', admin.password_hash, 'NAS', 'developer']
      );
      userId = newUser[0].id;
      console.log(`   ✓ Created user "nas" (id: ${userId})`);
    }
  } else {
    // Check if user 'nas' exists
    const { rows: existing } = await query(
      'SELECT id FROM users WHERE username = $1',
      ['nas']
    );
    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const password = process.env.ADMIN_PASSWORD || 'admin';
      const hash = await bcrypt.hash(password, 12);
      const { rows: newUser } = await query(
        `INSERT INTO users (username, email, password_hash, display_name, template_slug)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO UPDATE SET password_hash = $3
         RETURNING id`,
        ['nas', 'nas@gnc.web.id', hash, 'NAS', 'developer']
      );
      userId = newUser[0].id;
      console.log(`   ✓ Created user "nas" from env vars (id: ${userId})`);
    }
  }

  // 2. Copy content rows to user_content if any exist
  const { rows: contentRows } = await query('SELECT key, data FROM content');

  if (contentRows.length > 0) {
    for (const row of contentRows) {
      await query(
        `INSERT INTO user_content (user_id, key, data, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, key) DO UPDATE SET data = $3, updated_at = NOW()`,
        [userId, row.key, JSON.stringify(row.data)]
      );
    }
    console.log(`   ✓ Migrated ${contentRows.length} content rows to user "nas"`);
  }

  // 3. Assign images to user
  await query(
    'UPDATE images SET user_id = $1 WHERE user_id IS NULL',
    [userId]
  );

  // 4. Create default theme if missing
  const defaultTheme = {
    global: {
      fontFamily: "'JetBrains Mono', monospace",
      headingFont: "'Orbitron', sans-serif",
      baseFontSize: 16,
      borderRadius: 12,
      backgroundColor: '#0a0a0f',
      accentColor: '#64ffda',
      accentColorSecondary: '#a855f7',
      textColor: '#ccd6f6',
      textColorMuted: '#8892b0',
      cardBackground: 'rgba(255,255,255,0.03)',
      cardBorder: 'rgba(255,255,255,0.06)',
      glassBlur: 12,
      animationSpeed: 1,
    },
    pages: {
      dev: { backgroundColor: '#0a0a0f' },
      hobbies: { backgroundColor: '#0d0d0d' },
      diary: { backgroundColor: '#0d0b0f' },
    },
  };

  await query(
    `INSERT INTO user_themes (user_id, theme)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId, JSON.stringify(defaultTheme)]
  );

  // 5. Create sections config if missing
  const sections = [
    { id: 'dev', label: 'Developer', enabled: true },
    { id: 'hobbies', label: 'Hobbies', enabled: true },
    { id: 'diary', label: 'Diary', enabled: true },
  ];

  await query(
    `INSERT INTO user_sections (user_id, config)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO NOTHING`,
    [userId, JSON.stringify(sections)]
  );

  console.log('  ✓ Data migration check complete.');
}

if (process.argv[1] && process.argv[1].endsWith('002_migrate_existing.js')) {
  migrateExisting()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
