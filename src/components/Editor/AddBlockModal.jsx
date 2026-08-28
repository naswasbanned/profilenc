import { motion } from 'framer-motion';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import {
  X,
  Layers,
  Code2,
  Briefcase,
  Gamepad2,
  BookOpen,
  Cpu,
  User,
  Plus,
  Sparkles,
} from 'lucide-react';

const BLOCK_PRESETS = [
  {
    type: 'hero',
    title: 'Hero Profile Block',
    desc: 'Avatar, headline, bio, status pill, social links, and CTA buttons with left, right, middle, or split layouts.',
    icon: <User size={24} color="#00f0aa" />,
    defaultTitle: 'Hero Profile',
    defaultData: {
      name: 'Your Name',
      tagline: 'Digital Creator & Engineer',
      bio: 'Crafting fluid web experiences, apps, and digital systems.',
      avatarUrl: null,
      statusBadge: 'Open for Work',
      align: 'center',
      socials: [
        { platform: 'Github', label: 'GitHub', url: 'https://github.com' },
        { platform: 'Linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
        { platform: 'Mail', label: 'Email', url: 'mailto:hello@example.com' },
      ],
      actions: [
        { label: 'Get in Touch', url: 'mailto:hello@example.com', primary: true },
        { label: 'View Resume', url: '#', primary: false },
      ],
    },
  },
  {
    type: 'services',
    title: 'Services & Commissions',
    desc: 'Pricing cards for freelance services, commissions, tiers, deliverables checklist, and booking CTAs.',
    icon: <Sparkles size={24} color="#f59e0b" />,
    defaultTitle: 'Services & Rates',
    defaultData: {
      columns: 2,
      items: [
        {
          id: 'svc-1',
          title: 'Full-Stack Web App',
          price: '$1,200',
          period: 'project',
          status: 'Available',
          deliveryTime: '2-3 weeks',
          featured: true,
          description: 'Production-ready responsive web application with custom UI, backend API, and database integration.',
          features: [
            'Tailored Modern UI & Micro-interactions',
            'Full Responsive Mobile & Desktop Layout',
            'API & Database Architecture',
            'Deployment & CI/CD Setup',
          ],
          ctaLabel: 'Book Project',
          ctaUrl: 'mailto:hello@example.com?subject=Project Inquiry',
        },
        {
          id: 'svc-2',
          title: 'UI/UX Design & Prototype',
          price: '$600',
          period: 'project',
          status: 'Available',
          deliveryTime: '1 week',
          featured: false,
          description: 'Figma prototypes, component design systems, and user experience flows for digital products.',
          features: [
            'High-Fidelity Interactive Prototype',
            'Design System & Component Library',
            'User Flows & Wireframing',
            'Developer Handoff Specs',
          ],
          ctaLabel: 'Inquire Now',
          ctaUrl: 'mailto:hello@example.com?subject=Design Inquiry',
        },
      ],
    },
  },
  {
    type: 'cards_grid',
    title: 'Cards Grid',
    desc: 'Grid of cards for projects, services, portfolio, or products.',
    icon: <Layers size={24} color="#00d4ff" />,
    defaultTitle: 'Featured Projects',
    defaultData: {
      columns: 2,
      items: [
        {
          id: 'card-1',
          title: 'Project Title',
          description: 'A modern web application with rich interactive animations.',
          badge: 'Featured',
          tags: ['React', 'Node.js'],
          linkUrl: 'https://github.com',
          actionLabel: 'View Project',
        },
        {
          id: 'card-2',
          title: 'Second Project',
          description: 'High performance REST API backend and microservices.',
          badge: 'API',
          tags: ['Laravel', 'PostgreSQL'],
          linkUrl: 'https://example.com',
          actionLabel: 'Live Demo',
        },
      ],
    },
  },
  {
    type: 'skills',
    title: 'Skills & Tech Badges',
    desc: 'Categorized technology pills with brand icons and proficiency tiers.',
    icon: <Code2 size={24} color="#34d399" />,
    defaultTitle: 'Tech Stack',
    defaultData: {
      items: [
        { name: 'React', category: 'Frontend', tier: 'Expert', color: '#61DAFB', icon: 'SiReact' },
        { name: 'JavaScript', category: 'Frontend', tier: 'Proficient', color: '#F7DF1E', icon: 'SiJavascript' },
        { name: 'Tailwind CSS', category: 'Frontend', tier: 'Proficient', color: '#06B6D4', icon: 'SiTailwindcss' },
        { name: 'Laravel', category: 'Backend', tier: 'Expert', color: '#FF2D20', icon: 'SiLaravel' },
        { name: 'Docker', category: 'DevOps', tier: 'Intermediate', color: '#2496ED', icon: 'SiDocker' },
      ],
    },
  },
  {
    type: 'timeline',
    title: 'Experience Timeline',
    desc: 'Interactive milestones for work history, education, or roadmaps.',
    icon: <Briefcase size={24} color="#a855f7" />,
    defaultTitle: 'Career Timeline',
    defaultData: {
      items: [
        {
          id: 'item-1',
          role: 'Senior Software Engineer',
          company: 'Tech Studio',
          period: '2023 - Present',
          description: 'Leading frontend architecture and building real-time dashboard systems.',
          bullets: ['Designed design system components', 'Improved performance by 40%'],
          tags: ['React', 'TypeScript'],
        },
        {
          id: 'item-2',
          role: 'Full-Stack Developer',
          company: 'Digital Agency',
          period: '2021 - 2023',
          description: 'Delivered customized client web applications and backend APIs.',
          bullets: ['Built 15+ client web platforms', 'Integrated Stripe payment workflows'],
          tags: ['Laravel', 'MySQL'],
        },
      ],
    },
  },
  {
    type: 'media_reviews',
    title: 'Media & Reviews',
    desc: 'Showcase games, movies, books, or anime with star ratings and reviews.',
    icon: <Gamepad2 size={24} color="#ec4899" />,
    defaultTitle: 'Media & Reviews',
    defaultData: {
      items: [
        {
          id: 'rev-1',
          title: 'Cyberpunk 2077',
          rating: 5,
          status: 'Completed',
          notes: 'Masterpiece narrative, unforgettable city world design.',
          genre: 'Action RPG',
        },
        {
          id: 'rev-2',
          title: 'Interstellar',
          rating: 5,
          status: 'Completed',
          notes: 'Emotional sci-fi storytelling with unmatched soundtrack.',
          genre: 'Sci-Fi Film',
        },
      ],
    },
  },
  {
    type: 'journal',
    title: 'Journal & Articles',
    desc: 'Blog posts, daily reflections, and written thoughts with a reader modal.',
    icon: <BookOpen size={24} color="#f4a261" />,
    defaultTitle: 'Journal & Thoughts',
    defaultData: {
      items: [
        {
          id: 'entry-1',
          title: 'Building with Fluid Modularity',
          date: new Date().toISOString().split('T')[0],
          mood: 'Focused',
          moodEmoji: '🎯',
          excerpt: 'Why creating customizable component systems makes software joyful.',
          content: 'Building customizable component blocks allows users to express their digital identity without technical barriers.\n\nEvery pixel should feel intentional, fast, and delightful.',
        },
      ],
    },
  },
  {
    type: 'specs_grid',
    title: 'Specs & Gear Grid',
    desc: 'Display PC specs, photography equipment, desk setup, or audio gear.',
    icon: <Cpu size={24} color="#fbbf24" />,
    defaultTitle: 'Hardware & Gear',
    defaultData: {
      items: [
        { category: 'Processor', name: 'AMD Ryzen 5 5600', detail: '6 Cores / 12 Threads', icon: 'Cpu' },
        { category: 'Graphics', name: 'NVIDIA RTX 4060', detail: '8GB GDDR6 DLSS 3', icon: 'Tv' },
        { category: 'Memory', name: '32GB DDR4 3200MHz', detail: 'Dual Channel High Speed', icon: 'Layers' },
        { category: 'Display', name: '27" 1440p 165Hz IPS', detail: 'Ultra-low latency', icon: 'Monitor' },
      ],
    },
  },
  {
    type: 'stacked_deck',
    title: 'Stacked Photo Deck',
    desc: 'Interactive photo card stack with browse controls.',
    icon: <Layers size={24} color="#06b6d4" />,
    defaultTitle: 'Photo Highlights',
    defaultData: {
      caption: 'Gallery Stack',
      images: [
        '/images/projects/template.png',
        '/images/projects/advance-quiz-platform.png',
      ],
    },
  },
  {
    type: 'gallery',
    title: 'Photo Gallery',
    desc: 'Responsive photo grid with aspect ratio options and full-screen lightbox modal with keyboard navigation.',
    icon: <Layers size={24} color="#38bdf8" />,
    defaultTitle: 'Visual Gallery',
    defaultData: {
      columns: 3,
      aspectRatio: 'square',
      showCaptions: true,
      items: [
        {
          id: 'photo-1',
          src: '/images/projects/template.png',
          title: 'Design System Explorations',
          caption: 'Dark UI and neon glow components',
          location: 'Tokyo, JP',
          date: '2026',
          tag: 'UI Design',
        },
        {
          id: 'photo-2',
          src: '/images/projects/advance-quiz-platform.png',
          title: 'Quiz Platform Architecture',
          caption: 'Interactive real-time multiplayer scoring',
          location: 'Remote',
          date: '2026',
          tag: 'Development',
        },
      ],
    },
  },
  {
    type: 'events',
    title: 'Calendar & Events',
    desc: 'Schedule feed with 1-click Google Calendar sync, interactive monthly calendar widget, and live stream status.',
    icon: <Sparkles size={24} color="#f43f5e" />,
    defaultTitle: 'Upcoming Events & Streams',
    defaultData: {
      defaultView: 'list',
      showFilters: true,
      items: [
        {
          id: 'evt-1',
          title: 'Live Coding: Interactive Profile Engine',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          startTime: '19:00',
          endTime: '21:00',
          time: '19:00 - 21:00 UTC',
          platform: 'Twitch / YouTube',
          location: 'Online Stream',
          type: 'Stream',
          status: 'Upcoming',
          description: 'Deep dive into state management, CSS tokens, and fluid layout mechanics in React.',
          topics: ['React', 'FramerMotion', 'DesignSystems'],
          linkLabel: 'Watch on Twitch',
          linkUrl: 'https://twitch.tv',
        },
        {
          id: 'evt-2',
          title: 'Modern Web Architecture Meetup',
          date: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
          startTime: '18:30',
          endTime: '20:30',
          time: '18:30 - 20:30 PST',
          platform: 'San Francisco, CA',
          location: 'Moscone Center',
          type: 'Meetup',
          status: 'Registration Open',
          description: 'Keynote discussion on agentic developer tools and localized UI design engines.',
          topics: ['Keynote', 'WebDev', 'Meetup'],
          linkLabel: 'Get Tickets',
          linkUrl: 'https://eventbrite.com',
        },
      ],
    },
  },
];

export default function AddBlockModal({ onAddBlock, onClose }) {
  const handleSelect = (preset) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: preset.type,
      title: preset.defaultTitle,
      subtitle: '',
      data: preset.defaultData,
    };
    onAddBlock(newBlock);
    onClose();
  };

  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(onClose);

  return (
    <div className="editor-modal-backdrop" onClick={handleBackdropClick}>
      {hintVisible && (
        <div className="modal-double-click-hint">
          <span>Click once more outside to close (or use ✕)</span>
        </div>
      )}
      <motion.div
        className="editor-modal-dialog modal-md"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="editor-modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Block Library</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              Choose a block to add to your current tab
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="editor-modal-body add-block-grid">
          {BLOCK_PRESETS.map((preset) => (
            <motion.div
              key={preset.type}
              onClick={() => handleSelect(preset)}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="add-block-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {preset.icon}
                </div>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f1f5f9' }}>{preset.title}</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5', flex: 1 }}>{preset.desc}</p>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-color, #00f0aa)', fontSize: '0.78rem', fontWeight: 600 }}>
                <Plus size={14} /> Add to Tab
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
