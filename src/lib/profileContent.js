/**
 * Profile content schema helpers.
 *
 * Profile content is stored as `{ tabs: [{ blocks: [...] }] }`. Older rows may
 * still hold the flat single-user shape, so every read goes through the
 * normalizer below before it reaches the renderer.
 */

/**
 * Universal schema normalizer:
 * Converts any legacy data (or fresh profile) into the clean modular { tabs: [...] } block structure.
 */
export function normalizeModularContent(rawContent, username = 'User') {
  // If already modular, or nested under 'modular_profile' key from API
  const modularData = rawContent?.modular_profile || rawContent;
  if (modularData?.tabs && Array.isArray(modularData.tabs) && modularData.tabs.length > 0) {
    return modularData;
  }

  // Convert legacy or empty content to dynamic blocks
  const profile = rawContent?.profile || {};
  const devProfile = profile?.dev || {};
  const skills = Array.isArray(rawContent?.['dev-skills']) ? rawContent['dev-skills'] : [];
  const projects = Array.isArray(rawContent?.['dev-projects']) ? rawContent['dev-projects'] : [];
  const experience = Array.isArray(rawContent?.['dev-experience']) ? rawContent['dev-experience'] : [];
  const services = Array.isArray(rawContent?.['dev-services']) ? rawContent['dev-services'] : [];
  const specs = Array.isArray(rawContent?.['hobbies-specs']) ? rawContent['hobbies-specs'] : [];
  const diaryEntries = Array.isArray(rawContent?.['diary-entries']) ? rawContent['diary-entries'] : [];

  const mainBlocks = [
    {
      id: 'block-hero',
      type: 'hero',
      title: '',
      data: {
        name: devProfile?.name || username,
        tagline: devProfile?.tagline || 'Software Engineer & Creator',
        bio: devProfile?.bio || 'Building fluid web experiences and open-source tools.',
        avatarUrl: devProfile?.avatar || null,
        statusBadge: 'Available for Hire',
        socials: profile?.contact?.socials || [
          { platform: 'Github', url: 'https://github.com' },
          { platform: 'Linkedin', url: 'https://linkedin.com' },
        ],
        actions: [
          { label: 'Get in Touch', url: `mailto:${profile?.contact?.email || 'hello@example.com'}`, primary: true },
        ],
      },
    },
  ];

  if (skills.length > 0) {
    mainBlocks.push({
      id: 'block-skills',
      type: 'skills',
      title: 'Skills & Technologies',
      subtitle: 'Core competencies and framework proficiencies',
      data: { items: skills },
    });
  }

  if (projects.length > 0) {
    mainBlocks.push({
      id: 'block-projects',
      type: 'cards_grid',
      title: 'Featured Projects',
      subtitle: 'Selected production applications and open source',
      data: {
        columns: 2,
        items: projects.map((p, idx) => ({
          id: `proj-${idx}`,
          title: p.title,
          description: p.description,
          image: p.image || (Array.isArray(p.images) ? p.images[0] : null),
          badge: p.badge || p.category,
          tags: p.tech || p.tags || [],
          linkUrl: p.liveUrl || p.githubUrl || p.link,
          actionLabel: 'View Project',
        })),
      },
    });
  }

  if (experience.length > 0) {
    mainBlocks.push({
      id: 'block-timeline',
      type: 'timeline',
      title: 'Experience Timeline',
      subtitle: 'Career milestones and work history',
      data: { items: experience },
    });
  }

  if (services.length > 0) {
    mainBlocks.push({
      id: 'block-services',
      type: 'cards_grid',
      title: 'Services & Commissions',
      subtitle: 'What I can help build for you',
      data: {
        columns: 2,
        items: services.map((s, idx) => ({
          id: `serv-${idx}`,
          title: s.title,
          description: s.description,
          image: s.image,
          badge: s.badge,
          tags: s.tech || [],
          price: s.startingPrice,
          linkUrl: s.actionUrl,
          actionLabel: 'Inquire',
        })),
      },
    });
  }

  const tabs = [
    {
      id: 'tab-main',
      label: 'Portfolio',
      slug: 'portfolio',
      enabled: true,
      blocks: mainBlocks,
    },
  ];

  if (specs.length > 0) {
    tabs.push({
      id: 'tab-gear',
      label: 'Setup & Gear',
      slug: 'gear',
      enabled: true,
      blocks: [
        {
          id: 'block-specs',
          type: 'specs_grid',
          title: 'Hardware & Equipment',
          subtitle: 'Daily workstation and hardware specs',
          data: { items: specs },
        },
      ],
    });
  }

  if (diaryEntries.length > 0) {
    tabs.push({
      id: 'tab-journal',
      label: 'Journal',
      slug: 'journal',
      enabled: true,
      blocks: [
        {
          id: 'block-journal',
          type: 'journal',
          title: 'Journal & Notes',
          subtitle: 'Daily logs, thoughts, and ideas',
          data: { items: diaryEntries },
        },
      ],
    });
  }

  return { tabs };
}
