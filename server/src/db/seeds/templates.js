import { query } from '../../config/db.js';

const createFieldNotesTheme = (accentColor = '#e96d52', accentColorSecondary = '#f4cf62') => ({
  global: {
    designStyle: 'field-notes',
    fontFamily: "'DM Sans', sans-serif",
    headingFont: "'Fraunces', serif",
    monoFont: "'DM Mono', monospace",
    serifFont: "'Fraunces', Georgia, serif",
    baseFontSize: 16,
    borderRadius: 14,
    backgroundType: 'solid',
    backgroundColor: '#f5efdf',
    backgroundGradient: null,
    accentColor,
    accentColorSecondary,
    buttonBackground: '#252320',
    buttonTextColor: '#fffaf0',
    headingColor: '#252320',
    textColor: '#252320',
    textColorMuted: '#746e63',
    cardBackground: '#fffaf0',
    cardBorder: '#d7ccb8',
    cardHeadingColor: '#252320',
    cardTextColor: '#252320',
    cardTextMuted: '#746e63',
    tabNavBackground: 'rgba(255, 250, 240, 0.96)',
    tabNavBorder: '#d7ccb8',
    tabButtonBackground: '#fffaf0',
    tabButtonTextColor: '#746e63',
    tabButtonBorder: '#d7ccb8',
    tabButtonActiveBackground: accentColor,
    tabButtonActiveTextColor: '#fffaf0',
    glassBlur: 0,
    animationSpeed: 1,
    backgroundImage: null,
    backgroundOverlayOpacity: 0.75,
    backgroundOverlayColor: null,
    backgroundBlur: 0,
    cardBoxShadow: '4px 5px 0 rgba(37, 35, 32, 0.22)',
    cardShadow: '4px 5px 0 rgba(37, 35, 32, 0.22)',
    cardShadowHover: '6px 7px 0 rgba(37, 35, 32, 0.32)',
    cardBorderWidth: 2,
    cardBorderStyle: 'solid',
    blockGap: 32,
    blockPadding: 20,
    blockDividerStyle: 'solid',
    blockDividerColor: '#d7ccb8',
    headingFontWeight: 600,
    pillStyle: 'editorial-bordered',
    buttonStyle: 'editorial-tactile',
    iconStyle: 'bordered-box',
  },
  tabs: {},
  pages: {
    dev: { backgroundColor: '#f5efdf' },
    hobbies: { backgroundColor: '#f5efdf' },
    diary: { backgroundColor: '#f5efdf' },
  },
  sections: {},
});

export const TEMPLATES = [
  // ==========================================
  // 1. DEVELOPER TEMPLATE
  // ==========================================
  {
    slug: 'developer',
    name: 'Developer',
    description: 'Field Notes editorial portfolio for software engineers with full stack, GitHub heatmap, projects, experience, workstation rig, and engineering log.',
    theme: createFieldNotesTheme('#34a87a', '#f4cf62'),
    sections: [
      { id: 'tab-main', label: 'Portfolio', enabled: true },
      { id: 'tab-gear', label: 'Stack & Rig', enabled: true },
      { id: 'tab-notes', label: 'Engineering Log', enabled: true },
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
                  name: 'Alex Rivera',
                  tagline: 'Staff Full-Stack Engineer & Systems Architect',
                  bio: 'Crafting resilient distributed backends, tactile web experiences, and high-throughput infrastructure. Enthusiast for developer tools and open web standards.',
                  avatarUrl: null,
                  statusBadge: 'Open for Opportunities',
                  socials: [
                    { platform: 'Github', label: 'GitHub', url: 'https://github.com' },
                    { platform: 'Linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
                    { platform: 'Twitter', label: 'X / Twitter', url: 'https://x.com' },
                    { platform: 'Mail', label: 'Email', url: 'mailto:alex@example.com' },
                  ],
                  actions: [
                    { label: 'View Featured Projects', url: '#projects', primary: true },
                    { label: 'Download Resume', url: '#', primary: false },
                  ],
                },
              },
              {
                id: 'blk-dev-skills',
                type: 'skills',
                title: 'Core Technologies & Proficiencies',
                subtitle: 'Languages, frameworks, and architecture tools utilized daily',
                data: {
                  items: [
                    { name: 'TypeScript', category: 'Frontend', tier: 'Expert', color: '#3178c6', icon: 'SiTypescript' },
                    { name: 'React 19', category: 'Frontend', tier: 'Expert', color: '#61dafb', icon: 'SiReact' },
                    { name: 'Next.js', category: 'Frontend', tier: 'Expert', color: '#000000', icon: 'SiNextdotjs' },
                    { name: 'Tailwind CSS', category: 'Frontend', tier: 'Proficient', color: '#06b6d4', icon: 'SiTailwindcss' },
                    { name: 'Node.js', category: 'Backend', tier: 'Expert', color: '#5fa04e', icon: 'SiNodedotjs' },
                    { name: 'Go / Golang', category: 'Backend', tier: 'Proficient', color: '#00add8', icon: 'SiGo' },
                    { name: 'PostgreSQL', category: 'Database', tier: 'Expert', color: '#4169e1', icon: 'SiPostgresql' },
                    { name: 'Redis', category: 'Database', tier: 'Proficient', color: '#dc382d', icon: 'SiRedis' },
                    { name: 'Docker', category: 'DevOps', tier: 'Proficient', color: '#2496ed', icon: 'SiDocker' },
                    { name: 'Kubernetes', category: 'DevOps', tier: 'Intermediate', color: '#326ce5', icon: 'SiKubernetes' },
                    { name: 'GraphQL', category: 'Backend', tier: 'Proficient', color: '#e10098', icon: 'SiGraphql' },
                    { name: 'Git', category: 'Tools', tier: 'Expert', color: '#f05032', icon: 'SiGit' },
                  ],
                },
              },
              {
                id: 'blk-dev-heatmap',
                type: 'github_heatmap',
                title: 'Open Source Contribution Pulse',
                subtitle: 'Verified commits, pull requests, and code activity',
                data: {
                  username: 'torvalds',
                },
              },
              {
                id: 'blk-dev-projects',
                type: 'cards_grid',
                title: 'Featured Production Projects',
                subtitle: 'Production platforms, distributed microservices, and client solutions',
                data: {
                  columns: 2,
                  items: [
                    {
                      id: 'proj-1',
                      title: 'HyperStream Event Mesh',
                      description: 'Distributed WebSocket & SSE broker handling 120k concurrent pub/sub connections with sub-10ms delivery.',
                      badge: 'High Performance',
                      tags: ['Go', 'Redis', 'WebSockets', 'Docker'],
                      linkUrl: 'https://github.com',
                      actionLabel: 'View Repository',
                    },
                    {
                      id: 'proj-2',
                      title: 'Field Notes UI Design System',
                      description: 'Accessible React & Tailwind design system featuring tactile paper borders, smooth physics, and zero layout shift.',
                      badge: 'Design System',
                      tags: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
                      linkUrl: 'https://github.com',
                      actionLabel: 'Live Playground',
                    },
                    {
                      id: 'proj-3',
                      title: 'OmniQuery Analytics Gateway',
                      description: 'Columnar query aggregation pipeline with automated schema inference and real-time dashboard telemetry.',
                      badge: 'Data Engine',
                      tags: ['Node.js', 'PostgreSQL', 'DuckDB', 'GraphQL'],
                      linkUrl: 'https://github.com',
                      actionLabel: 'Architecture Specs',
                    },
                    {
                      id: 'proj-4',
                      title: 'SecureAuth Identity Vault',
                      description: 'Passkey and WebAuthn multi-tenant authentication microservice with JWT rotation and biometric validation.',
                      badge: 'Security',
                      tags: ['TypeScript', 'WebAuthn', 'PostgreSQL', 'Docker'],
                      linkUrl: 'https://github.com',
                      actionLabel: 'View Documentation',
                    },
                  ],
                },
              },
              {
                id: 'blk-dev-timeline',
                type: 'timeline',
                title: 'Engineering Career Timeline',
                subtitle: 'Professional history and high-impact engineering milestones',
                data: {
                  items: [
                    {
                      id: 'exp-1',
                      role: 'Senior Staff Engineer',
                      company: 'Vanguard Systems',
                      period: '2023 — Present',
                      description: 'Leading platform engineering, microservice decomposition, and performance reliability across core services.',
                      bullets: [
                        'Scaled API throughput by 340% while slashing 99th percentile latency from 180ms to 24ms',
                        'Architected zero-downtime database migration strategy serving 2.4M monthly active users',
                        'Mentored 12 mid and senior engineers across distributed team topologies',
                      ],
                      tags: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes'],
                    },
                    {
                      id: 'exp-2',
                      role: 'Full-Stack Software Engineer',
                      company: 'Kinetic Digital Studio',
                      period: '2020 — 2023',
                      description: 'Developed high-conversion SaaS web applications and interactive client portals.',
                      bullets: [
                        'Built multi-tenant dashboard with realtime WebSockets and collaborative document editing',
                        'Authored internal design system adopted by 6 cross-functional product squads',
                      ],
                      tags: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-gear',
            label: 'Stack & Rig',
            slug: 'gear',
            enabled: true,
            blocks: [
              {
                id: 'blk-dev-specs',
                type: 'specs_grid',
                title: 'Workstation Hardware & Peripherals',
                subtitle: 'Engineering rig and ergonomic daily drivers',
                data: {
                  items: [
                    { category: 'Workstation', name: 'MacBook Pro M3 Max', detail: '16-Core CPU / 40-Core GPU / 64GB Unified RAM', icon: 'Laptop' },
                    { category: 'Desktop CPU', name: 'AMD Ryzen 9 7950X', detail: '16 Cores / 32 Threads @ 5.7GHz', icon: 'Cpu' },
                    { category: 'Display', name: 'Dell UltraSharp 38" Curved', detail: 'WQHD+ IPS Black, 90W USB-C Hub', icon: 'Monitor' },
                    { category: 'Input Device', name: 'Keychron Q1 Pro Wireless', detail: 'Gateron Oil Kings, Lubed, Custom PBT keycaps', icon: 'Keyboard' },
                    { category: 'Pointer', name: 'Logitech MX Master 3S', detail: 'Quiet Click 8000 DPI MagSpeed', icon: 'Mouse' },
                    { category: 'Audio Interface', name: 'Sennheiser HD 660S2 + DAC', detail: 'Balanced Open-Back Studio Reference', icon: 'Headphones' },
                  ],
                },
              },
              {
                id: 'blk-dev-milestones',
                type: 'milestones',
                title: '2026 Engineering Roadmap & Milestones',
                subtitle: 'Tracked goals, open-source initiatives, and architectural targets',
                data: {
                  items: [
                    {
                      id: 'ms-dev-1',
                      title: 'Publish Distributed State Engine Open-Source',
                      description: 'Packaged Go library for replicated state machines with Raft consensus.',
                      category: 'Tech',
                      completed: true,
                      date: 'Q1 2026',
                      subTasks: [
                        { id: 'st-1', title: 'Complete consensus test harness', completed: true },
                        { id: 'st-2', title: 'Write benchmarks & documentation', completed: true },
                        { id: 'st-3', title: 'Publish initial v1.0 release tag', completed: true },
                      ],
                    },
                    {
                      id: 'ms-dev-2',
                      title: 'Launch Self-Hosted Developer Analytics Tool',
                      description: 'Privacy-focused self-hosted telemetry engine for Next.js applications.',
                      category: 'Goals',
                      completed: false,
                      date: 'Q2 2026',
                      subTasks: [
                        { id: 'st-4', title: 'Design database aggregation layer', completed: true },
                        { id: 'st-5', title: 'Build interactive chart dashboard', completed: true },
                        { id: 'st-6', title: 'Deploy public alpha demo sandbox', completed: false },
                      ],
                    },
                    {
                      id: 'ms-dev-3',
                      title: 'Master Rust Systems Programming & WASM',
                      description: 'Re-implement critical hot-path parsing routines in Rust WebAssembly.',
                      category: 'Learning',
                      completed: false,
                      date: 'Q3 2026',
                      subTasks: [
                        { id: 'st-7', title: 'Complete Rust book & async book', completed: true },
                        { id: 'st-8', title: 'Build WebAssembly AST parser', completed: false },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-notes',
            label: 'Engineering Log',
            slug: 'notes',
            enabled: true,
            blocks: [
              {
                id: 'blk-dev-journal',
                type: 'journal',
                title: 'Engineering Dispatches & Field Notes',
                subtitle: 'Architectural lessons, post-mortems, and frontend craftsmanship',
                data: {
                  items: [
                    {
                      id: 'dev-post-1',
                      title: 'Tactile Physicality in Modern Web Design',
                      date: new Date().toISOString().split('T')[0],
                      mood: 'Deep Focus',
                      moodEmoji: '⚡',
                      excerpt: 'Why hard offset shadows, high-contrast borders, and spring-damper transitions resonate more than flat minimalism.',
                      content: `Modern software interfaces have spent a decade smoothing out every edge, reducing web experiences into indistinguishable gray rectangles. By re-introducing tactile physical boundaries—such as 2px borders, 4px hard offset shadows, and authentic serif Fraunces typography—we bridge the gap between tangible editorial print and fluid digital interaction.

When users interact with elements that have mass, spring-resistance, and spatial presence, cognitive friction drops significantly. It feels like using a finely-crafted field journal rather than browsing a generic template.`,
                      tags: ['UI/UX', 'Design Systems', 'CSS'],
                    },
                    {
                      id: 'dev-post-2',
                      title: 'Designing Zero-Downtime Database Migrations at Scale',
                      date: '2026-01-14',
                      mood: 'Architecting',
                      moodEmoji: '🛠️',
                      excerpt: 'Techniques for schema evolution, dual-writing, and lock-free index builds across production PostgreSQL tables.',
                      content: `Operating high-traffic tables requires abandoning simplistic migration scripts. By enforcing a 3-step expand-contract pattern:

1. Add nullable columns or backward-compatible schema changes first.
2. Deploy application code that dual-writes to both old and new representations.
3. Backfill historic records in asynchronous micro-batches before dropping deprecated structures.

Following this discipline allows zero-downtime deployments with zero client-facing locking or timeout cascades.`,
                      tags: ['PostgreSQL', 'Architecture', 'Backend'],
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

  // ==========================================
  // 2. DESIGNER TEMPLATE
  // ==========================================
  {
    slug: 'designer',
    name: 'Designer',
    description: 'Field Notes editorial portfolio for UI/UX and brand designers with interactive deck, case studies, visual gallery, service tiers, and studio philosophy.',
    theme: createFieldNotesTheme('#e96d52', '#f4cf62'),
    sections: [
      { id: 'tab-main', label: 'Selected Works', enabled: true },
      { id: 'tab-services', label: 'Services & Rates', enabled: true },
      { id: 'tab-about', label: 'Studio & Notes', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Selected Works',
            slug: 'work',
            enabled: true,
            blocks: [
              {
                id: 'blk-des-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Elena Rostova',
                  tagline: 'Principal Product & Brand Identity Designer',
                  bio: 'Designing memorable digital products, editorial web experiences, and scalable design token systems. Grounded in typography, visual hierarchy, and tactile craft.',
                  avatarUrl: null,
                  statusBadge: 'Taking Selected Projects',
                  socials: [
                    { platform: 'Dribbble', label: 'Dribbble', url: 'https://dribbble.com' },
                    { platform: 'Behance', label: 'Behance', url: 'https://behance.net' },
                    { platform: 'Instagram', label: 'Instagram', url: 'https://instagram.com' },
                    { platform: 'Mail', label: 'Email', url: 'mailto:elena@example.com' },
                  ],
                  actions: [
                    { label: 'Explore Commission Rates', url: '#services', primary: true },
                    { label: 'View Case Studies', url: '#works', primary: false },
                  ],
                },
              },
              {
                id: 'blk-des-deck',
                type: 'stacked_deck',
                title: 'Design Philosophy Highlights',
                subtitle: 'Swipe or cycle through the foundational pillars of our design ethos',
                data: {
                  items: [
                    {
                      id: 'deck-1',
                      title: 'Tactile Physicality',
                      subtitle: 'Beyond Flat Abstractions',
                      description: 'Interfaces that feel crafted with physical weight, hard offset shadows, and authentic ink tones foster genuine engagement.',
                      badge: 'Core Principle',
                      tags: ['Tactility', 'Editorial', 'Aesthetics'],
                    },
                    {
                      id: 'deck-2',
                      title: 'Typographic Soul',
                      subtitle: 'Voice Through Letterforms',
                      description: 'Every layout communicates through nuanced serif weights, precise leading, and expressive proportional harmony.',
                      badge: 'Typography',
                      tags: ['Editorial', 'Fraunces', 'Micro-Type'],
                    },
                    {
                      id: 'deck-3',
                      title: 'Systemic Cohesion',
                      subtitle: 'Code-Synced Design Tokens',
                      description: 'Bridging design intent and engineering reality with rigorous semantic tokens that scale effortlessly.',
                      badge: 'Design Systems',
                      tags: ['Tokens', 'Figma', 'Engineering'],
                    },
                  ],
                },
              },
              {
                id: 'blk-des-projects',
                type: 'cards_grid',
                title: 'Featured Client Case Studies',
                subtitle: 'Comprehensive product designs, mobile applications, and brand identities',
                data: {
                  columns: 2,
                  items: [
                    {
                      id: 'work-1',
                      title: 'Aura Private Wealth Management',
                      description: 'Complete end-to-end iOS & web suite for next-generation asset management and real-time portfolio balancing.',
                      badge: 'Fintech Suite',
                      tags: ['Product Design', 'iOS', 'Design System'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'Read Case Study',
                    },
                    {
                      id: 'work-2',
                      title: 'Kestrel Editorial Quarterly',
                      description: 'Brand identity, typography guidelines, and fluid responsive publishing portal for independent literary journalism.',
                      badge: 'Brand & Web',
                      tags: ['Brand Identity', 'Typography', 'Editorial'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'View Brand Guidelines',
                    },
                    {
                      id: 'work-3',
                      title: 'Northwind E-Commerce Experience',
                      description: 'Frictionless multi-currency checkout redesign delivering a 28% decrease in cart abandonment across mobile devices.',
                      badge: 'E-Commerce',
                      tags: ['UX Research', 'Conversion', 'Figma'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'View Metrics & UX',
                    },
                    {
                      id: 'work-4',
                      title: 'Prism Multi-Brand Design Tokens',
                      description: 'Unified cross-platform design token architecture serving 4 flagship products across web, React Native, and macOS.',
                      badge: 'Design Systems',
                      tags: ['Tokens', 'Figma', 'Accessibility'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'Explore System',
                    },
                  ],
                },
              },
              {
                id: 'blk-des-gallery',
                type: 'gallery',
                title: 'Visual Experiments & Visual Craft',
                subtitle: 'Posters, 3D explorations, and micro-interaction prototypes',
                data: {
                  columns: 3,
                  items: [
                    { id: 'gal-1', title: 'Typographic Monograph', tag: 'Print', caption: 'Custom woodblock serif specimen printed on cotton rag paper.' },
                    { id: 'gal-2', title: 'Tactile Glass Tokens', tag: '3D Render', caption: 'Refraction and caustic studies for tactile digital components.' },
                    { id: 'gal-3', title: 'Editorial Poster No. 04', tag: 'Editorial', caption: 'Bauhaus-inspired layout exploring negative space and geometry.' },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-services',
            label: 'Services & Rates',
            slug: 'services',
            enabled: true,
            blocks: [
              {
                id: 'blk-des-services',
                type: 'services',
                title: 'Design Services & Commission Tiers',
                subtitle: 'Transparent scopes, sprint deliverables, and dedicated studio engagements',
                data: {
                  columns: 2,
                  items: [
                    {
                      id: 'svc-1',
                      title: 'UI/UX Product Sprint',
                      price: '$2,400',
                      period: 'sprint (2 weeks)',
                      description: 'Focused design sprint for early-stage products, core feature redesigns, or high-fidelity prototype validation.',
                      highlight: true,
                      features: [
                        'Interactive clickable Figma prototype',
                        'User flow mapping and friction audit',
                        'Up to 8 core production screens (Web & Mobile)',
                        'Design review calls & developer handoff specs',
                      ],
                      actionLabel: 'Book Sprint Slot',
                      actionUrl: 'mailto:elena@example.com?subject=Book%20Product%20Sprint',
                    },
                    {
                      id: 'svc-2',
                      title: 'Complete Brand Identity Suite',
                      price: '$3,800',
                      period: 'project',
                      description: 'Comprehensive brand direction, custom logo marks, typography pairings, color systems, and marketing templates.',
                      highlight: false,
                      features: [
                        'Primary and secondary responsive logo marks',
                        'Comprehensive 40-page brand guidelines book',
                        'Custom typography, color palettes & texture kits',
                        'Social media kit and pitch deck presentation kit',
                      ],
                      actionLabel: 'Inquire for Brand Suite',
                      actionUrl: 'mailto:elena@example.com?subject=Brand%20Identity%20Inquiry',
                    },
                    {
                      id: 'svc-3',
                      title: 'Design System Architecture',
                      price: '$5,200',
                      period: 'system',
                      description: 'Scalable semantic token framework connecting Figma component variables directly with code repositories.',
                      highlight: false,
                      features: [
                        'Figma component library with auto-layout & variants',
                        'Semantic color, spacing, and typography token structure',
                        'Accessibility audit meeting WCAG AAA contrast',
                        'Engineers pairing & component documentation handbook',
                      ],
                      actionLabel: 'Discuss Design System',
                      actionUrl: 'mailto:elena@example.com?subject=Design%20System%20Consultation',
                    },
                  ],
                },
              },
              {
                id: 'blk-des-timeline',
                type: 'timeline',
                title: 'Design Career Journey',
                subtitle: 'Studio leadership, brand strategy, and product experience',
                data: {
                  items: [
                    {
                      id: 'des-exp-1',
                      role: 'Principal Product Designer',
                      company: 'Studio Form & Function',
                      period: '2022 — Present',
                      description: 'Directing product design sprints and design token systems for global tech leaders.',
                      bullets: [
                        'Led design team of 8 across fintech and media products',
                        'Recipient of Awwwards Site of the Day and Red Dot Design Award',
                      ],
                      tags: ['Figma', 'Design Systems', 'Leadership'],
                    },
                    {
                      id: 'des-exp-2',
                      role: 'Senior UI/UX Designer',
                      company: 'Monolith Creative',
                      period: '2019 — 2022',
                      description: 'Crafted web experiences and brand identities for high-growth ventures.',
                      bullets: [
                        'Increased mobile conversion by 34% through checkout UX overhaul',
                        'Established studio design tokens adopted by 14 client projects',
                      ],
                      tags: ['UI/UX', 'Prototyping', 'Branding'],
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-about',
            label: 'Studio & Notes',
            slug: 'about',
            enabled: true,
            blocks: [
              {
                id: 'blk-des-specs',
                type: 'specs_grid',
                title: 'Studio Hardware & Creative Tools',
                subtitle: 'Daily drivers powering our product design and visual explorations',
                data: {
                  items: [
                    { category: 'Main Machine', name: 'MacBook Pro 16" M3 Max', detail: 'Liquid Retina XDR, 64GB RAM', icon: 'Laptop' },
                    { category: 'Primary Display', name: 'Apple Studio Display 27"', detail: '5K Retina, P3 Wide Color, Nano-texture', icon: 'Monitor' },
                    { category: 'Drawing Tablet', name: 'Wacom Cintiq Pro 16', detail: '4K Display with Pro Pen 2', icon: 'Palette' },
                    { category: 'Ergonomics', name: 'Herman Miller Aeron', detail: 'Fully Adjustable PostureFit SL', icon: 'Sparkles' },
                  ],
                },
              },
              {
                id: 'blk-des-journal',
                type: 'journal',
                title: 'Studio Essays & Design Reflections',
                subtitle: 'Thoughts on digital longevity, typography, and tactile craft',
                data: {
                  items: [
                    {
                      id: 'des-post-1',
                      title: 'Designing for Longevity in a Disposable Web',
                      date: new Date().toISOString().split('T')[0],
                      mood: 'Inspired',
                      moodEmoji: '🎨',
                      excerpt: 'How creating software with classical editorial principles resists trend obsolescence.',
                      content: `Trends in web design expire with seasonal rapidity—neomorphism, brutalism, glassmorphism, and holographic gradients each burn bright before quickly aging like milk. 

Classical books and printed journals, however, retain elegance over centuries. By anchoring digital design around typography, generous paper margins, disciplined color palettes, and deliberate tactile feedback, we build digital artifacts that endure.`,
                      tags: ['Design Philosophy', 'Editorial', 'Typography'],
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

  // ==========================================
  // 3. GAMER / STREAMER TEMPLATE
  // ==========================================
  {
    slug: 'gamer',
    name: 'Gamer / Streamer',
    description: 'Field Notes gaming hub for creators with streaming broadcast schedules, video highlights, in-depth game reviews, battlestation specs, and chill soundtrack lounge.',
    theme: createFieldNotesTheme('#8a63d2', '#f1846b'),
    sections: [
      { id: 'tab-main', label: 'Live & Hub', enabled: true },
      { id: 'tab-gear', label: 'Battlestation', enabled: true },
      { id: 'tab-soundtrack', label: 'Lounge', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Live & Hub',
            slug: 'hub',
            enabled: true,
            blocks: [
              {
                id: 'blk-game-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Kaelen "Valkyrie" Vance',
                  tagline: 'Competitive Streamer, RPG Enthusiast & Lore Analyst',
                  bio: 'Exploring vast open worlds, high-tier competitive arenas, and story-driven indie masterpieces. Streaming weekly with deep dives into game systems and audio design.',
                  avatarUrl: null,
                  statusBadge: 'Now Playing: Elden Ring',
                  socials: [
                    { platform: 'Twitch', label: 'Twitch', url: 'https://twitch.tv' },
                    { platform: 'Youtube', label: 'YouTube', url: 'https://youtube.com' },
                    { platform: 'Discord', label: 'Discord Community', url: 'https://discord.com' },
                    { platform: 'Twitter', label: 'X / Twitter', url: 'https://x.com' },
                  ],
                  actions: [
                    { label: 'Watch Live Stream', url: 'https://twitch.tv', primary: true },
                    { label: 'Join Discord Server', url: 'https://discord.com', primary: false },
                  ],
                },
              },
              {
                id: 'blk-game-events',
                type: 'events',
                title: 'Broadcast & Event Schedule',
                subtitle: 'Upcoming live streams, tournament runs, and community gaming nights',
                data: {
                  items: [
                    {
                      id: 'ev-1',
                      title: 'Elden Ring: Seamless Co-Op Challenge',
                      date: new Date().toISOString().split('T')[0],
                      startTime: '19:00',
                      endTime: '23:00',
                      type: 'Stream',
                      location: 'Twitch.tv/ValkyrieLive',
                      description: 'Permadeath run with community challenge constraints and live chat commentary.',
                    },
                    {
                      id: 'ev-2',
                      title: 'Community Game Night: Party & Custom Lobes',
                      date: '2026-09-26',
                      startTime: '20:00',
                      endTime: '00:00',
                      type: 'Community',
                      location: 'Discord Voice & Game Lobbies',
                      description: 'Open lobbies for Discord subscribers with custom custom tournaments and prizes.',
                    },
                    {
                      id: 'ev-3',
                      title: 'Cyberpunk 2077 Lore & Soundtrack Deep Dive',
                      date: '2026-09-29',
                      startTime: '18:30',
                      endTime: '22:00',
                      type: 'Special',
                      location: 'YouTube Premiere & Live Stream',
                      description: 'Comprehensive narrative dissection of Night City worldbuilding and industrial audio.',
                    },
                  ],
                },
              },
              {
                id: 'blk-game-video',
                type: 'featured_video',
                title: 'Latest Broadcast Spotlight & Highlights',
                subtitle: 'Selected gameplay showcase and clutch tournament moments',
                data: {
                  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  title: 'Top 10 Unforgettable Boss Encounters in Souls Games',
                  badge: 'Featured Video',
                  description: 'Detailed analysis of combat pacing, musical leitmotifs, and spatial arena mechanics.',
                },
              },
              {
                id: 'blk-game-reviews',
                type: 'media_reviews',
                title: 'Curated Game Reviews & Critical Ratings',
                subtitle: 'Comprehensive impressions of standout titles across genres',
                data: {
                  items: [
                    {
                      id: 'g-1',
                      title: 'Cyberpunk 2077: Phantom Liberty',
                      rating: 5,
                      status: 'Mastered',
                      genre: 'Action RPG / Cyberpunk',
                      notes: 'Peak narrative execution in modern gaming. Dogtown is a dense masterclass in environmental storytelling and combat versatility.',
                    },
                    {
                      id: 'g-2',
                      title: 'Elden Ring',
                      rating: 5,
                      status: 'Completed',
                      genre: 'Open World / Soulslike',
                      notes: 'The gold standard for sense of discovery. Lands Between rewards curious exploration better than any open world in history.',
                    },
                    {
                      id: 'g-3',
                      title: 'Hollow Knight: Silksong',
                      rating: 5,
                      status: 'Anticipated',
                      genre: 'Metroidvania',
                      notes: 'Fluid acrobatics, needle combat, and haunting atmospheric score. The most awaited masterpiece of our generation.',
                    },
                    {
                      id: 'g-4',
                      title: 'Baldur’s Gate 3',
                      rating: 5,
                      status: 'Completed (3 Playthroughs)',
                      genre: 'CRPG / Tactical',
                      notes: 'Unprecedented narrative branching and reactive voice acting. Every dialogue decision ripples across dozens of hours.',
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-gear',
            label: 'Battlestation',
            slug: 'rig',
            enabled: true,
            blocks: [
              {
                id: 'blk-game-specs',
                type: 'specs_grid',
                title: 'Dual-PC Streaming & Gaming Rig',
                subtitle: 'High-refresh hardware, studio audio, and broadcasting peripherals',
                data: {
                  items: [
                    { category: 'Gaming CPU', name: 'AMD Ryzen 7 7800X3D', detail: '8 Cores / 16 Threads @ 5.0GHz 3D V-Cache', icon: 'Cpu' },
                    { category: 'Graphics Card', name: 'NVIDIA GeForce RTX 4080 Super', detail: '16GB GDDR6X, Full Ray Tracing & DLSS 3.5', icon: 'Tv' },
                    { category: 'Main Monitor', name: 'ASUS ROG Swift 27" OLED 240Hz', detail: '0.03ms Response Time, Pure Blacks', icon: 'Monitor' },
                    { category: 'Microphone', name: 'Shure SM7B + Cloudlifter', detail: 'Broadcast Dynamic Mic + GoXLR Mixer', icon: 'Headphones' },
                    { category: 'Stream Controller', name: 'Elgato Stream Deck XL', detail: '32 Customizable LCD Keys & Scene Control', icon: 'Layers' },
                    { category: 'Webcam & Cam', name: 'Sony A6400 + Sigma 16mm f/1.4', detail: '4K Clean HDMI Output with Shallow DoF', icon: 'Film' },
                  ],
                },
              },
              {
                id: 'blk-game-milestones',
                type: 'milestones',
                title: '2026 Gaming & Creator Milestones',
                subtitle: 'Community benchmarks and streaming achievements',
                data: {
                  items: [
                    {
                      id: 'ms-gm-1',
                      title: 'Reach 50,000 Twitch Followers',
                      description: 'Build an engaged, supportive community for narrative RPG enthusiasts.',
                      category: 'Goals',
                      completed: true,
                      date: '2026',
                      subTasks: [
                        { id: 'st-g1', title: 'Maintain consistent 4-day broadcast schedule', completed: true },
                        { id: 'st-g2', title: 'Launch custom emote set & sub badges', completed: true },
                      ],
                    },
                    {
                      id: 'ms-gm-2',
                      title: 'Host 24-Hour Charity Marathon for Child’s Play',
                      description: 'Community marathon aiming to raise $15,000 for children’s hospitals.',
                      category: 'Achievement',
                      completed: false,
                      date: 'Q4 2026',
                      subTasks: [
                        { id: 'st-g3', title: 'Coordinate sponsor match pool', completed: true },
                        { id: 'st-g4', title: 'Finalize challenge donation incentives', completed: false },
                      ],
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-soundtrack',
            label: 'Lounge',
            slug: 'soundtrack',
            enabled: true,
            blocks: [
              {
                id: 'blk-game-music',
                type: 'music_player',
                title: 'Stream Soundtrack & Synthwave Lounge',
                subtitle: 'Ambient beats and chill synthwave tracks for focus and gaming',
                data: {
                  items: [
                    {
                      id: 'track-1',
                      title: 'Neon Nights & Starlit Roads',
                      artist: 'Lofi Cyber Records',
                      embedUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
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

  // ==========================================
  // 4. MINIMAL WRITER TEMPLATE
  // ==========================================
  {
    slug: 'minimal',
    name: 'Minimal Writer',
    description: 'Serif-driven Field Notes editorial journal for essayists, researchers, and thinkers with long-form articles, reading bookshelf, and quiet workspace tools.',
    theme: createFieldNotesTheme('#d97736', '#b9d9bb'),
    sections: [
      { id: 'tab-main', label: 'Essays & Library', enabled: true },
      { id: 'tab-workspace', label: 'Desk & Tools', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Essays & Library',
            slug: 'essays',
            enabled: true,
            blocks: [
              {
                id: 'blk-min-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Julian Thorne',
                  tagline: 'Essayist, Cultural Critic & Independent Researcher',
                  bio: 'Writing on intentional living, digital calm, and the enduring craft of physical and intellectual tools. Publishing monthly reflections and long-form monographs.',
                  avatarUrl: null,
                  statusBadge: 'Publishing Dispatch No. 42',
                  socials: [
                    { platform: 'Substack', label: 'Substack', url: 'https://substack.com' },
                    { platform: 'Twitter', label: 'X / Twitter', url: 'https://x.com' },
                    { platform: 'Mail', label: 'Email Correspondence', url: 'mailto:julian@example.com' },
                  ],
                  actions: [
                    { label: 'Read Selected Essays', url: '#essays', primary: true },
                    { label: 'Browse Reading Bookshelf', url: '#bookshelf', primary: false },
                  ],
                },
              },
              {
                id: 'blk-min-journal',
                type: 'journal',
                title: 'Selected Monographs & Dispatches',
                subtitle: 'Essays on intentionality, technology, and classical humanism',
                data: {
                  items: [
                    {
                      id: 'post-min-1',
                      title: 'The Architecture of Intentional Solitude',
                      date: new Date().toISOString().split('T')[0],
                      mood: 'Contemplative',
                      moodEmoji: '🕯️',
                      excerpt: 'In an economy engineered to commodify attention, reclaiming deliberate quiet is the ultimate act of creative autonomy.',
                      content: `To sit uninterrupted in a room with a blank notebook is increasingly treated as an anomaly. The algorithmic feed thrives on ambient panic—convincing us that every breaking moment requires an immediate reaction.

Yet all lasting philosophical breakthroughs and enduring literature emerged from periods of sustained solitude. When you step outside the broadcast cycle, your thoughts decelerate. You begin discerning between urgency and true substance.`,
                      tags: ['Solitude', 'Philosophy', 'Attention'],
                    },
                    {
                      id: 'post-min-2',
                      title: 'Digital Gardens vs. The Ephemeral Stream',
                      date: '2026-02-18',
                      mood: 'Scholarly',
                      moodEmoji: '🌱',
                      excerpt: 'Why organizing personal knowledge into slowly-cultivated interconnected notes outlasts social feeds.',
                      content: `The modern web replaced the library with the river—a rushing torrent of ephemeral posts that vanish beneath tomorrow’s noise. A digital garden operates on the opposite principle: ideas are planted, tended, cross-linked, and refined across seasons.

Instead of writing to satisfy an algorithmic timeline, build an enduring archive of interconnected thinking that ripens over decades.`,
                      tags: ['Digital Gardens', 'Knowledge', 'Writing'],
                    },
                    {
                      id: 'post-min-3',
                      title: 'On the Slowness of Good Thinking',
                      date: '2026-01-08',
                      mood: 'Quiet Mind',
                      moodEmoji: '☕',
                      excerpt: 'Why instantaneous answers stifle cognitive depth, and the value of letting ideas ferment.',
                      content: `Fast computation gives the illusion that thinking itself should be frictionless. But wisdom is never instantaneous; it requires incubation, contradictory drafts, and prolonged staring out the window. Give your mind permission to be slow.`,
                      tags: ['Craft', 'Slowness', 'Thought'],
                    },
                  ],
                },
              },
              {
                id: 'blk-min-milestones',
                type: 'milestones',
                title: '2026 Publishing & Research Initiatives',
                subtitle: 'Long-term writing projects, manuscript chapters, and reading targets',
                data: {
                  items: [
                    {
                      id: 'ms-min-1',
                      title: 'Draft Anthology: "The Tangible Web"',
                      description: '10 collected essays on the resurgence of tactile design and slow technology.',
                      category: 'Creative',
                      completed: false,
                      date: '2026',
                      subTasks: [
                        { id: 'st-m1', title: 'Complete first 5 manuscript chapters', completed: true },
                        { id: 'st-m2', title: 'Commission letterpress cover artwork', completed: true },
                        { id: 'st-m3', title: 'Print limited run of 500 numbered editions', completed: false },
                      ],
                    },
                    {
                      id: 'ms-min-2',
                      title: 'Annual Reading List Target (30 Volumes)',
                      description: 'Deep dives across classical stoicism, architectural history, and cognitive science.',
                      category: 'Learning',
                      completed: true,
                      date: '2026',
                      subTasks: [
                        { id: 'st-m4', title: 'Read 12 books on classical philosophy', completed: true },
                        { id: 'st-m5', title: 'Annotate 6 works on typography & print history', completed: true },
                      ],
                    },
                  ],
                },
              },
              {
                id: 'blk-min-books',
                type: 'media_reviews',
                title: 'Essential Bookshelf & Marginalia',
                subtitle: 'Key texts that have shaped our worldview and writing discipline',
                data: {
                  items: [
                    {
                      id: 'bk-1',
                      title: 'Four Thousand Weeks: Time Management for Mortals',
                      rating: 5,
                      status: 'Essential Reading',
                      genre: 'Philosophy / Time',
                      notes: 'A brilliant critique of toxic productivity. Embraces human limitation and finite mortality with profound liberation.',
                    },
                    {
                      id: 'bk-2',
                      title: 'The Design of Everyday Things',
                      rating: 5,
                      status: 'Reference',
                      genre: 'Design / Ergonomics',
                      notes: 'Don Norman’s timeless thesis on affordances, signifiers, and intuitive human interactions.',
                    },
                    {
                      id: 'bk-3',
                      title: 'The Medium is the Massage',
                      rating: 5,
                      status: 'Re-Read Annually',
                      genre: 'Media Theory',
                      notes: 'Marshall McLuhan’s prophetically accurate examination of how technology shapes cognitive structures.',
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-workspace',
            label: 'Desk & Tools',
            slug: 'desk',
            enabled: true,
            blocks: [
              {
                id: 'blk-min-specs',
                type: 'specs_grid',
                title: 'Writing Apparatus & Daily Implements',
                subtitle: 'Tangible instruments for focused, quiet intellectual production',
                data: {
                  items: [
                    { category: 'Typing Machine', name: 'Custom Corne Split Keyboard', detail: 'Boba U4 Silent Tactiles, Columnar Ergonomic', icon: 'Keyboard' },
                    { category: 'Digital Paper', name: 'Kindle Scribe 10.2"', detail: '300ppi E-Ink Paperwhite with Premium Pen', icon: 'BookOpen' },
                    { category: 'Notebook', name: 'Midori MD Notebook Journal', detail: 'Japanese Bleed-Resistant Cotton Paper', icon: 'Palette' },
                    { category: 'Fountain Pen', name: 'Lamy 2000 Makrolon <F>', detail: 'Piston-Fill with Iroshizuku Kon-Peki Ink', icon: 'Sparkles' },
                  ],
                },
              },
              {
                id: 'blk-min-music',
                type: 'music_player',
                title: 'Writing Room Acoustics & Ambient Focus',
                subtitle: 'Warm acoustic textures and calming instrumental piano',
                data: {
                  items: [
                    {
                      id: 'track-min-1',
                      title: 'Rain Over Quiet Library Stacks',
                      artist: 'Ambient Studio Archive',
                      embedUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
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

  // ==========================================
  // 5. CREATIVE MULTI-HYPHENATE TEMPLATE
  // ==========================================
  {
    slug: 'creative',
    name: 'Creative Multi-Hyphenate',
    description: 'Field Notes creative showcase mixing interactive concept decks, generative installations, soundscapes, exhibition calendar, and collaborative services.',
    theme: createFieldNotesTheme('#4f72b8', '#e96d52'),
    sections: [
      { id: 'tab-main', label: 'Creative Canvas', enabled: true },
      { id: 'tab-gallery', label: 'Creations & Log', enabled: true },
    ],
    content: {
      modular_profile: {
        tabs: [
          {
            id: 'tab-main',
            label: 'Creative Canvas',
            slug: 'canvas',
            enabled: true,
            blocks: [
              {
                id: 'blk-crt-hero',
                type: 'hero',
                title: '',
                data: {
                  name: 'Rowan Mercer',
                  tagline: 'Audio-Visual Artist, Technologist & Composer',
                  bio: 'Operating at the intersection of generative sound, interactive physical installations, and speculative digital interfaces. Crafting multisensory experiences.',
                  avatarUrl: null,
                  statusBadge: 'Curating & Building',
                  socials: [
                    { platform: 'Bandcamp', label: 'Bandcamp', url: 'https://bandcamp.com' },
                    { platform: 'Github', label: 'GitHub', url: 'https://github.com' },
                    { platform: 'Instagram', label: 'Instagram', url: 'https://instagram.com' },
                    { platform: 'Mail', label: 'Email', url: 'mailto:rowan@example.com' },
                  ],
                  actions: [
                    { label: 'Explore Interactive Works', url: '#works', primary: true },
                    { label: 'Listen to Soundscapes', url: '#sound', primary: false },
                  ],
                },
              },
              {
                id: 'blk-crt-deck',
                type: 'stacked_deck',
                title: 'Interdisciplinary Mediums',
                subtitle: 'Click through our active creative disciplines and sensory experiments',
                data: {
                  items: [
                    {
                      id: 'deck-crt-1',
                      title: 'Generative Soundscapes',
                      subtitle: 'Algorithmic Ambient Audio',
                      description: 'Composing procedural sound environments driven by mathematical harmonics and environmental data feeds.',
                      badge: 'Sound Design',
                      tags: ['Max/MSP', 'Ableton', 'Generative'],
                    },
                    {
                      id: 'deck-crt-2',
                      title: 'Spatial Installations',
                      subtitle: 'Light & Acoustic Sculptures',
                      description: 'Building experiential spaces where human proximity alters musical timbre and projected typographic patterns.',
                      badge: 'Installation',
                      tags: ['TouchDesigner', 'Projection', 'Sensors'],
                    },
                    {
                      id: 'deck-crt-3',
                      title: 'Speculative Web Fiction',
                      subtitle: 'Interactive Narrative Canvases',
                      description: 'Writing non-linear interactive essays that transform as the reader scrolls, clicks, and navigates.',
                      badge: 'Interactive Fiction',
                      tags: ['Creative Web', 'GLSL', 'Storytelling'],
                    },
                  ],
                },
              },
              {
                id: 'blk-crt-cards',
                type: 'cards_grid',
                title: 'Selected Installations & Audio-Visual Works',
                subtitle: 'Exhibitions, interactive software, and collaborative releases',
                data: {
                  columns: 2,
                  items: [
                    {
                      id: 'work-crt-1',
                      title: 'Resonance Chamber No. 3',
                      description: 'Interactive audio installation reacting to ambient room noise, modulating granular delay lines in real time.',
                      badge: 'Sound Installation',
                      tags: ['Interactive Audio', 'Max/MSP', 'Acoustics'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'View Exhibition Video',
                    },
                    {
                      id: 'work-crt-2',
                      title: 'Typographic Caustics',
                      description: 'Real-time WebGL shader rendering light refraction through liquid glass typography.',
                      badge: 'Generative Web',
                      tags: ['Three.js', 'GLSL', 'Typography'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'Launch WebGL Demo',
                    },
                    {
                      id: 'work-crt-3',
                      title: 'Hymns for Analog Synthesizers',
                      description: '12-track vinyl release exploring modular Buchla synthesis, tape loop decay, and tape saturation.',
                      badge: 'Vinyl Album',
                      tags: ['Modular Synth', 'Ambient', 'Bandcamp'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'Listen on Bandcamp',
                    },
                    {
                      id: 'work-crt-4',
                      title: 'Chrono-Cartography Archive',
                      description: 'A non-linear digital atlas mapping speculative future ecosystems through interactive sound maps.',
                      badge: 'Speculative Media',
                      tags: ['Creative Code', 'Cartography', 'Audio'],
                      linkUrl: 'https://example.com',
                      actionLabel: 'Explore Interactive Atlas',
                    },
                  ],
                },
              },
              {
                id: 'blk-crt-music',
                type: 'music_player',
                title: 'Featured Audio Releases & Sound Design',
                subtitle: 'Original ambient compositions and modular synth improvisations',
                data: {
                  items: [
                    {
                      id: 'track-crt-1',
                      title: 'Drifting Through Solar Wind',
                      artist: 'Rowan Mercer',
                      embedUrl: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
                    },
                  ],
                },
              },
            ],
          },
          {
            id: 'tab-gallery',
            label: 'Creations & Log',
            slug: 'creations',
            enabled: true,
            blocks: [
              {
                id: 'blk-crt-gallery',
                type: 'gallery',
                title: 'Visual Art, Artifacts & Photography',
                subtitle: 'Exhibition photographs, typographic prints, and tactile objects',
                data: {
                  columns: 3,
                  items: [
                    { id: 'crt-gal-1', title: 'Modular Patch Bay Cable Web', tag: 'Studio', caption: 'Intricate patch routing on Eurorack modular synthesizer.' },
                    { id: 'crt-gal-2', title: 'Acoustic Diffuser Geometry', tag: 'Architecture', caption: 'Handcrafted birch wood acoustic diffusion panel.' },
                    { id: 'crt-gal-3', title: 'Lissajous Laser Projection', tag: 'Installation', caption: 'Dual-oscilloscope laser projection captured at 1/15s shutter.' },
                  ],
                },
              },
              {
                id: 'blk-crt-events',
                type: 'events',
                title: 'Exhibitions, Screenings & Performances',
                subtitle: 'Live audio-visual performances and collaborative workshops',
                data: {
                  items: [
                    {
                      id: 'ev-crt-1',
                      title: 'Live Modular Ambient Set @ Soundwave Gallery',
                      date: '2026-10-12',
                      startTime: '20:00',
                      endTime: '22:00',
                      type: 'Live Performance',
                      location: 'Brooklyn Arts Collective, NY',
                      description: 'Immersive multichannel soundscape performance with reactive projection mapping.',
                    },
                    {
                      id: 'ev-crt-2',
                      title: 'Creative Code & Generative Sound Workshop',
                      date: '2026-11-05',
                      startTime: '14:00',
                      endTime: '18:00',
                      type: 'Workshop',
                      location: 'Online Livestream & Discord',
                      description: 'Hands-on introduction to Web Audio API, synthesis primitives, and algorithmic pacing.',
                    },
                  ],
                },
              },
              {
                id: 'blk-crt-services',
                type: 'services',
                title: 'Creative Collaboration & Commissions',
                subtitle: 'Bespoke original sound design, experiential installations, and creative code consultation',
                data: {
                  columns: 2,
                  items: [
                    {
                      id: 'crt-svc-1',
                      title: 'Original Film / Game Sound Design',
                      price: '$3,500',
                      period: 'project',
                      description: 'Custom acoustic and synthesis scoring, spatial sound effects, and atmospheric world audio.',
                      highlight: true,
                      features: [
                        'Complete bespoke audio suite and stems',
                        'Spatial audio mix mastering (Stereo & Binaural)',
                        'Custom synthesizer patches created from scratch',
                        'Unlimited mix revisions during scoring period',
                      ],
                      actionLabel: 'Commission Score',
                      actionUrl: 'mailto:rowan@example.com?subject=Sound%20Design%20Commission',
                    },
                    {
                      id: 'crt-svc-2',
                      title: 'Interactive Web Installation',
                      price: '$4,800',
                      period: 'installation',
                      description: 'Full-stack interactive audio-visual canvas built with WebGL, Web Audio, and tactile Framer Motion physics.',
                      highlight: false,
                      features: [
                        'Custom WebGL shaders and audio reactivity',
                        'Mobile and desktop responsive optimization',
                        'Turnkey GitHub repository and deployment setup',
                        'Maintenance and performance documentation',
                      ],
                      actionLabel: 'Commission Installation',
                      actionUrl: 'mailto:rowan@example.com?subject=Interactive%20Installation%20Inquiry',
                    },
                  ],
                },
              },
              {
                id: 'blk-crt-journal',
                type: 'journal',
                title: 'Studio Logbook & Process Notes',
                subtitle: 'Documenting sonic experiments, hardware design, and creative discoveries',
                data: {
                  items: [
                    {
                      id: 'post-crt-1',
                      title: 'The Resonance of Physical Tape Decay',
                      date: new Date().toISOString().split('T')[0],
                      mood: 'Experimental',
                      moodEmoji: '📼',
                      excerpt: 'Why tape saturation and magnetic wow-and-flutter breathe organic warmth into digital music.',
                      content: `Digital synthesis is mathematically perfect—frequencies remain locked to the sample rate with surgical precision. But nature is never mathematically sterile.

Running clean digital oscillators through a worn cassette head introduces magnetic saturation, subtle pitch fluctuation, and tape hiss that our ears recognize as breathing life.`,
                      tags: ['Sound Design', 'Analog', 'Tape Music'],
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
  console.log('Seeding templates with Field Notes preset & rich default blocks...');

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

  console.log('  ✓ 5 rich Field Notes modular block template presets seeded successfully.');
}

if (process.argv[1] && process.argv[1].endsWith('templates.js')) {
  seedTemplates()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Template seed failed:', err);
      process.exit(1);
    });
}
