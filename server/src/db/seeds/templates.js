import { query } from '../../config/db.js';

export const TEMPLATES = [
  {
    slug: 'developer',
    name: 'Developer',
    description: 'Portfolio for engineers with Hero, Tech Stack, Featured Projects, Timeline, and Gear.',
    theme: {
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
    },
    sections: [
      { id: 'tab-main', label: 'Portfolio', enabled: true },
      { id: 'tab-gear', label: 'Setup', enabled: true },
      { id: 'tab-notes', label: 'Journal', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Portfolio',
            slug: 'portfolio',
            enabled: true,
            blocks: [
              {
                id: 'blk-dev-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Your Name',
                  tagline: 'Full-Stack Developer',
                  bio: 'Passionate developer crafting modern web experiences, backend architectures, and open-source systems.',
                  avatarUrl: null,
                  statusBadge: 'Open for Opportunities',
                  socials: [
                    { platform: 'Github', url: 'https://github.com' },
                    { platform: 'Linkedin', url: 'https://linkedin.com' },
                    { platform: 'Mail', url: 'mailto:you@example.com' },
                  ],
                  actions: [
                    { label: 'Contact Me', url: 'mailto:you@example.com', primary: true },
                  ],
                },
              },
              {
                id: 'blk-dev-skills',
                type: 'skills',
                title: 'Skills & Technologies',
                subtitle: 'Core competencies and framework proficiencies',
                data: {
                  items: [
                    { name: 'React', category: 'Frontend', tier: 'Expert', color: '#61DAFB', icon: 'SiReact' },
                    { name: 'JavaScript', category: 'Frontend', tier: 'Proficient', color: '#F7DF1E', icon: 'SiJavascript' },
                    { name: 'Tailwind CSS', category: 'Frontend', tier: 'Proficient', color: '#06B6D4', icon: 'SiTailwindcss' },
                    { name: 'Laravel', category: 'Backend', tier: 'Expert', color: '#FF2D20', icon: 'SiLaravel' },
                    { name: 'Node.js', category: 'Backend', tier: 'Intermediate', color: '#5FA04E', icon: 'SiNodedotjs' },
                    { name: 'Docker', category: 'DevOps', tier: 'Intermediate', color: '#2496ED', icon: 'SiDocker' },
                    { name: 'MySQL', category: 'Database', tier: 'Proficient', color: '#4479A1', icon: 'SiMysql' },
                    { name: 'Git', category: 'Tools', tier: 'Proficient', color: '#F05032', icon: 'SiGit' },
                  ],
                },
              },
              {
                id: 'blk-dev-projects',
                type: 'cards_grid',
                title: 'Featured Projects',
                subtitle: 'Production web platforms and client solutions',
                data: {
                  columns: 2,
                  items: [
                    {
                      id: 'proj-1',
                      title: 'Real-Time Quiz Engine',
                      description: 'Multiplayer quiz platform with WebSockets and live leaderboards.',
                      badge: 'Full Stack',
                      tags: ['React', 'Laravel', 'MySQL'],
                      linkUrl: 'https://github.com',
                      actionLabel: 'View Repository',
                    },
                    {
                      id: 'proj-2',
                      title: 'Design System & UI Library',
                      description: 'Accessible component library with dark theme & micro-animations.',
                      badge: 'Frontend',
                      tags: ['React', 'Tailwind CSS', 'Framer Motion'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'Live Demo',
                    },
                  ],
                },
              },
              {
                id: 'blk-dev-timeline',
                type: 'timeline',
                title: 'Experience Timeline',
                subtitle: 'Work history and career highlights',
                data: {
                  items: [
                    {
                      id: 'exp-1',
                      role: 'Software Engineer',
                      company: 'Digital Studio',
                      period: '2023 - Present',
                      description: 'Architecting scalable web applications and REST APIs.',
                      bullets: ['Developed high-traffic payment integrations', 'Refactored frontend for 50% faster load'],
                      tags: ['React', 'Laravel'],
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-gear',
            label: 'Setup & Gear',
            slug: 'gear',
            enabled: true,
            blocks: [
              {
                id: 'blk-dev-specs',
                type: 'specs_grid',
                title: 'Workstation Setup',
                subtitle: 'Daily driver hardware and peripherals',
                data: {
                  items: [
                    { category: 'Processor', name: 'AMD Ryzen 5 5600', detail: '6 Cores / 12 Threads', icon: 'Cpu' },
                    { category: 'Graphics', name: 'NVIDIA RTX 4060', detail: '8GB GDDR6', icon: 'Tv' },
                    { category: 'Memory', name: '32GB DDR4', detail: '3200MHz Dual Channel', icon: 'Layers' },
                    { category: 'Display', name: '27" 1440p 165Hz IPS', detail: 'High Refresh Rate', icon: 'Monitor' },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'designer',
    name: 'Designer',
    description: 'Visual-first portfolio for designers with case studies, photo decks, and projects.',
    theme: {
      global: {
        fontFamily: "'Inter', sans-serif",
        headingFont: "'Playfair Display', serif",
        baseFontSize: 16,
        borderRadius: 16,
        backgroundColor: '#0f0f0f',
        accentColor: '#f472b6',
        accentColorSecondary: '#818cf8',
        textColor: '#e8e8e8',
        textColorMuted: '#888888',
        cardBackground: 'rgba(255,255,255,0.02)',
        cardBorder: 'rgba(255,255,255,0.04)',
        glassBlur: 16,
        animationSpeed: 1.2,
      },
    },
    sections: [
      { id: 'tab-main', label: 'Work', enabled: true },
      { id: 'tab-about', label: 'About', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Work',
            slug: 'work',
            enabled: true,
            blocks: [
              {
                id: 'blk-des-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Your Name',
                  tagline: 'Product & UI/UX Designer',
                  bio: 'Crafting intuitive digital products, brand identities, and memorable interfaces.',
                  statusBadge: 'Open for Commissions',
                  socials: [
                    { platform: 'Instagram', url: 'https://instagram.com' },
                    { platform: 'Mail', url: 'mailto:you@example.com' },
                  ],
                  actions: [
                    { label: 'View Portfolio', url: '#', primary: true },
                  ],
                },
              },
              {
                id: 'blk-des-cards',
                type: 'cards_grid',
                title: 'Featured Works',
                subtitle: 'Case studies and interface designs',
                data: {
                  columns: 2,
                  items: [
                    {
                      id: 'des-1',
                      title: 'Mobile Banking Experience',
                      description: 'End-to-end design for modern personal finance management.',
                      badge: 'Fintech',
                      tags: ['Figma', 'UI/UX', 'iOS'],
                      actionLabel: 'Case Study',
                    },
                    {
                      id: 'des-2',
                      title: 'Creative Agency Brand Identity',
                      description: 'Comprehensive brand guide, typography, and marketing assets.',
                      badge: 'Branding',
                      tags: ['Branding', 'Typography'],
                      actionLabel: 'View Brand Guide',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'gamer',
    name: 'Gamer',
    description: 'Gaming profile with reviews, game highlights, and streaming gear.',
    theme: {
      global: {
        fontFamily: "'Outfit', sans-serif",
        headingFont: "'Orbitron', sans-serif",
        baseFontSize: 16,
        borderRadius: 10,
        backgroundColor: '#0d0d0d',
        accentColor: '#a855f7',
        accentColorSecondary: '#ec4899',
        textColor: '#efefef',
        textColorMuted: '#999999',
        cardBackground: 'rgba(168, 85, 247, 0.04)',
        cardBorder: 'rgba(168, 85, 247, 0.08)',
        glassBlur: 12,
        animationSpeed: 1,
      },
    },
    sections: [
      { id: 'tab-main', label: 'Gaming', enabled: true },
      { id: 'tab-gear', label: 'Gear', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Gaming',
            slug: 'gaming',
            enabled: true,
            blocks: [
              {
                id: 'blk-game-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Your Gamertag',
                  tagline: 'Gamer & Content Creator',
                  bio: 'Exploring story-rich universes and competitive arenas.',
                  statusBadge: 'Now Playing',
                  socials: [
                    { platform: 'Youtube', url: 'https://youtube.com' },
                    { platform: 'Twitter', url: 'https://twitter.com' },
                  ],
                },
              },
              {
                id: 'blk-game-reviews',
                type: 'media_reviews',
                title: 'Favorite Games & Reviews',
                subtitle: 'Ratings and impressions of unforgettable titles',
                data: {
                  items: [
                    {
                      id: 'g-1',
                      title: 'Cyberpunk 2077: Phantom Liberty',
                      rating: 5,
                      status: 'Completed',
                      notes: 'Outstanding storyline with peak atmosphere and combat.',
                      genre: 'Action RPG',
                    },
                    {
                      id: 'g-2',
                      title: 'Elden Ring',
                      rating: 5,
                      status: 'Completed',
                      notes: 'Unrivaled open world discovery and boss design.',
                      genre: 'Soulslike',
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-gear',
            label: 'Gaming Rig',
            slug: 'rig',
            enabled: true,
            blocks: [
              {
                id: 'blk-game-specs',
                type: 'specs_grid',
                title: 'Battlestation Specs',
                subtitle: 'Hardware, peripherals, and audio',
                data: {
                  items: [
                    { category: 'GPU', name: 'NVIDIA RTX 4070 Super', detail: '12GB GDDR6X', icon: 'Tv' },
                    { category: 'CPU', name: 'AMD Ryzen 7 7800X3D', detail: 'Peak Gaming Performance', icon: 'Cpu' },
                    { category: 'Monitor', name: '27" OLED 240Hz 0.03ms', detail: 'Perfect Blacks', icon: 'Monitor' },
                    { category: 'Audio', name: 'Open-Back Studio Headphones', detail: 'Spacial Soundstage', icon: 'Headphones' },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'minimal',
    name: 'Minimal',
    description: 'Clean single-page profile with just the essentials.',
    theme: {
      global: {
        fontFamily: "'DM Sans', sans-serif",
        headingFont: "'DM Sans', sans-serif",
        baseFontSize: 16,
        borderRadius: 8,
        backgroundColor: '#0a0a0a',
        accentColor: '#fbbf24',
        accentColorSecondary: '#f97316',
        textColor: '#d4d4d4',
        textColorMuted: '#737373',
        cardBackground: 'rgba(255,255,255,0.02)',
        cardBorder: 'rgba(255,255,255,0.04)',
        glassBlur: 8,
        animationSpeed: 0.8,
      },
    },
    sections: [{ id: 'tab-main', label: 'Home', enabled: true }],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Home',
            slug: 'home',
            enabled: true,
            blocks: [
              {
                id: 'blk-min-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Your Name',
                  tagline: 'Designer & Thinker',
                  bio: 'Creating simple, meaningful things on the web.',
                  socials: [
                    { platform: 'Github', url: 'https://github.com' },
                    { platform: 'Mail', url: 'mailto:you@example.com' },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'creative',
    name: 'Creative',
    description: 'Vibrant layout for writers, artists, and creators with journal articles and media decks.',
    theme: {
      global: {
        fontFamily: "'Space Grotesk', sans-serif",
        headingFont: "'Space Grotesk', sans-serif",
        baseFontSize: 17,
        borderRadius: 20,
        backgroundColor: '#0a0812',
        accentColor: '#34d399',
        accentColorSecondary: '#06b6d4',
        textColor: '#e2e8f0',
        textColorMuted: '#94a3b8',
        cardBackground: 'rgba(52, 211, 153, 0.03)',
        cardBorder: 'rgba(52, 211, 153, 0.06)',
        glassBlur: 16,
        animationSpeed: 1.1,
      },
    },
    sections: [
      { id: 'tab-main', label: 'Writings', enabled: true },
      { id: 'tab-gallery', label: 'Creations', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Writings',
            slug: 'writings',
            enabled: true,
            blocks: [
              {
                id: 'blk-crt-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Your Name',
                  tagline: 'Writer & Creative Explorer',
                  bio: 'Documenting thoughts, stories, and creative experiments.',
                  statusBadge: 'Writing New Chapter',
                },
              },
              {
                id: 'blk-crt-journal',
                type: 'journal',
                title: 'Essays & Stories',
                subtitle: 'Reflections and written explorations',
                data: {
                  items: [
                    {
                      id: 'post-1',
                      title: 'The Art of Intentional Creativity',
                      date: new Date().toISOString().split('T')[0],
                      mood: 'Inspired',
                      moodEmoji: '💡',
                      excerpt: 'How creating digital spaces gives life to new ideas and connections.',
                      content: 'Every digital canvas is an invitation to build something that feels uniquely personal.\n\nSimplicity and focus turn ordinary spaces into memorable experiences.',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  },
];

export async function seedTemplates() {
  console.log('Seeding templates...');

  for (const tmpl of TEMPLATES) {
    await query(
      `INSERT INTO templates (slug, name, description, preview_url, theme, sections, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE SET
         name = $2, description = $3, preview_url = $4,
         theme = $5, sections = $6, content = $7`,
      [
        tmpl.slug,
        tmpl.name,
        tmpl.description,
        tmpl.preview_url || null,
        JSON.stringify(tmpl.theme),
        JSON.stringify(tmpl.sections),
        JSON.stringify(tmpl.content),
      ]
    );
  }

  console.log('  ✓ 5 modular block template presets seeded.');
}

if (process.argv[1] && process.argv[1].endsWith('templates.js')) {
  seedTemplates()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Template seed failed:', err);
      process.exit(1);
    });
}
