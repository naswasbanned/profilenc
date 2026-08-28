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

  // 6. Set admin flags
  const adminUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  await query(
    `UPDATE users SET is_admin = true WHERE username = $1 OR username = 'nas' OR username = 'admin'`,
    [adminUsername]
  );

  // 7. Seed default patch notes if empty
  const { rows: existingPatches } = await query('SELECT id FROM patch_notes LIMIT 1');
  if (existingPatches.length === 0) {
    const DEFAULT_PATCH_NOTES = [
      {
        version: 'v1.0.0',
        status: 'LATEST UPDATE',
        date: 'August 28, 2026',
        codename: 'RELEASE 1.0',
        title: 'Photo Gallery, Events Calendar & Smooth Scroll',
        order_num: 0,
        is_current: true,
        changes: [
          { type: 'NEW', text: 'Photo Gallery Block: Display images in clean grid layouts with full-screen lightbox zoom.' },
          { type: 'NEW', text: 'Events & Calendar Block: Share your schedule with 1-click Google Calendar & Apple .ICS sync.' },
          { type: 'IMPROVED', text: 'Smooth Scroll Showcase: Ultra-smooth scrolling experience powered by GSAP and Lenis.' },
          { type: 'IMPROVED', text: 'Independent Card Colors: Customize text colors inside cards without affecting headlines.' },
        ],
      },
      {
        version: 'v0.9.0',
        status: 'UPDATE',
        date: 'August 27, 2026',
        codename: 'BLOCK EXPANSION',
        title: 'Services & Rates, Hero Alignments & Multi-Image Uploads',
        order_num: 1,
        is_current: false,
        changes: [
          { type: 'NEW', text: 'Services & Commissions Block: Create pricing tiers with deliverables checklist and booking buttons.' },
          { type: 'NEW', text: 'Hero Layout Options: Choose between center, left-aligned, or split-side layouts for your header.' },
          { type: 'NEW', text: 'Journal Cover Photos: Add card cover images and format articles with a visual markdown editor.' },
          { type: 'NEW', text: 'Multi-Image Gallery: Attach multiple project images to your career and timeline milestones.' },
        ],
      },
      {
        version: 'v0.8.0',
        status: 'UPDATE',
        date: 'August 26, 2026',
        codename: 'THEME ENGINE',
        title: 'Custom Theme Colors & Dynamic Page Backgrounds',
        order_num: 2,
        is_current: false,
        changes: [
          { type: 'IMPROVED', text: 'Color Customization: Set custom theme colors, button styles, and border radius.' },
          { type: 'NEW', text: 'Page Backgrounds: Choose unique background styles dynamically for each tab.' },
        ],
      },
      {
        version: 'v0.5.0',
        status: 'INITIAL LAUNCH',
        date: 'August 20, 2026',
        codename: 'BETA RELEASE',
        title: 'Visual Live Editor & Custom Profile URLs',
        order_num: 3,
        is_current: false,
        changes: [
          { type: 'NEW', text: 'Custom Profile URLs: Get your unique profile link at gnc.web.id/@yourname.' },
          { type: 'NEW', text: 'Visual Live Editor: Edit your profile blocks and see changes instantly in real-time.' },
        ],
      },
    ];

    for (const p of DEFAULT_PATCH_NOTES) {
      await query(
        `INSERT INTO patch_notes (version, status, date, codename, title, changes, order_num, is_current)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (version) DO NOTHING`,
        [p.version, p.status, p.date, p.codename, p.title, JSON.stringify(p.changes), p.order_num, p.is_current]
      );
    }
    console.log('   ✓ Seeded default patch notes');
  }

  // 8. Seed default landing page configuration
  const DEFAULT_LANDING_SETTINGS = {
    hero: {
      badge: 'PROFILENC // PERSONAL PROFILE BUILDER',
      mastheadTop: 'UNBOUNDED',
      mastheadMid: 'DIGITAL IDENTITY',
      mastheadSub: 'CREATE YOUR PERSONAL PAGE',
      manifestoLead: 'Profilenc is a clean, modular profile builder for developers, designers, creators, and writers. Build your personal page in minutes with custom layouts, themes, and instant publishing.',
      claimLabel: 'CLAIM YOUR PROFILE URL:',
    },
    marquee: {
      text: 'CREATE YOUR PROFILE // 10 MODULAR BLOCKS // NO CODING REQUIRED // SHARE ANYWHERE //',
    },
    cta: {
      badge: '[DEPLOY_YOUR_PROFILE]',
      title: 'BUILD YOUR PERSONAL PROFILE TODAY',
      text: 'Claim your personal link, choose a starter template, and customize every section with our live visual editor.',
      btnLabel: 'CREATE YOUR PROFILE',
    },
  };

  await query(
    `INSERT INTO site_settings (key, data, updated_at)
     VALUES ('landing_page', $1, NOW())
     ON CONFLICT (key) DO NOTHING`,
    [JSON.stringify(DEFAULT_LANDING_SETTINGS)]
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
