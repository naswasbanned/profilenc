import { query } from '../../config/db.js';

/**
 * Bootstrap seed for a fresh deployment.
 *
 * Idempotent and non-destructive — every statement is guarded by
 * "ON CONFLICT DO NOTHING" or an emptiness check, so running it on an
 * existing database never overwrites data.
 *
 * 1. Promotes the configured ADMIN_USERNAME account to admin.
 * 2. Seeds the default landing page CMS configuration when missing.
 *
 * Patch notes are no longer seeded here: the built-in releases live in
 * src/data/patchNotes.js and are merged with the patch_notes table at read
 * time (see src/lib/patchNotes.js). Rows seeded by older versions are left
 * untouched; where they share a version with the code changelog, the code
 * entry is shown and the row is flagged in the admin console.
 */

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

  // 2. Default landing page CMS configuration
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
