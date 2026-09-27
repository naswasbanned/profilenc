import { query } from '../../config/db.js';

/**
 * Bootstrap seed for a fresh deployment.
 *
 * Idempotent and non-destructive — every statement is guarded by
 * "ON CONFLICT DO NOTHING" or an emptiness check, so running it on an
 * existing database never overwrites data.
 *
 * 1. Promotes the configured ADMIN_USERNAME account to admin.
 * 2. Seeds the default patch notes timeline when the table is empty.
 * 3. Seeds the default landing page CMS configuration when missing.
 */

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

const DEFAULT_LANDING_SETTINGS = {
  hero: {
    badge: 'PROFILENC // PERSONAL PROFILE BUILDER',
    mastheadTop: 'UNBOUNDED',
    mastheadMid: 'DIGITAL IDENTITY',
    mastheadSub: 'CREATE YOUR PERSONAL PAGE',
    manifestoLead:
      'Profilenc is a clean, modular profile builder for developers, designers, creators, and writers. Build your personal page in minutes with custom layouts, themes, and instant publishing.',
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

export async function seedBootstrap() {
  console.log('Checking bootstrap seed...');

  // 1. Admin flag for the configured administrator account.
  //    Only applied while no administrator exists. Re-applying it on every boot
  //    would silently undo a deliberate demotion the next time the container
  //    restarted, which makes admin access impossible to revoke.
  const { rows: existingAdmins } = await query('SELECT id FROM users WHERE is_admin = true LIMIT 1');
  if (existingAdmins.length === 0) {
    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const { rowCount } = await query(
      'UPDATE users SET is_admin = true WHERE username = $1',
      [adminUsername]
    );
    if (rowCount > 0) {
      console.log(`Bootstrap: promoted "${adminUsername}" to administrator.`);
    }
  }

  // 2. Default patch notes (only when none exist)
  const { rows: existingPatches } = await query('SELECT id FROM patch_notes LIMIT 1');
  if (existingPatches.length === 0) {
    for (const note of DEFAULT_PATCH_NOTES) {
      await query(
        `INSERT INTO patch_notes (version, status, date, codename, title, changes, order_num, is_current)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (version) DO NOTHING`,
        [
          note.version,
          note.status,
          note.date,
          note.codename,
          note.title,
          JSON.stringify(note.changes),
          note.order_num,
          note.is_current,
        ]
      );
    }
    console.log('   ✓ Seeded default patch notes');
  }

  // 3. Default landing page CMS configuration
  await query(
    `INSERT INTO site_settings (key, data, updated_at)
     VALUES ('landing_page', $1, NOW())
     ON CONFLICT (key) DO NOTHING`,
    [JSON.stringify(DEFAULT_LANDING_SETTINGS)]
  );

  console.log('  ✓ Bootstrap seed complete.');
}

// Standalone CLI execution
if (process.argv[1] && process.argv[1].endsWith('bootstrap.js')) {
  seedBootstrap()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Bootstrap seed failed:', err);
      process.exit(1);
    });
}
