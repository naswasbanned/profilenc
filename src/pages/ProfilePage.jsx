import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Sparkles,
  Folder,
  Terminal,
  BookOpen,
  Cpu,
  Gamepad2,
  Code2,
  Briefcase,
  Star,
  User,
  Film,
  Music,
  Heart,
  Globe,
  Activity,
  Coffee,
  Rocket,
  Shield,
  Flame,
} from 'lucide-react';
import BlockRenderer from '../components/Blocks/BlockRenderer';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import '../components/Blocks/Blocks.css';

const TAB_ICON_MAP = {
  Folder,
  Code2,
  Briefcase,
  Layers,
  Cpu,
  Gamepad2,
  BookOpen,
  Sparkles,
  Star,
  User,
  Film,
  Music,
  Heart,
  Terminal,
  Globe,
  Activity,
  Coffee,
  Rocket,
  Shield,
  Flame,
};

function renderTabIcon(icon) {
  if (icon === 'none' || icon === false || icon === 'text-only') return null;
  const IconComponent = (icon && TAB_ICON_MAP[icon]) || (icon ? null : Folder);
  if (!IconComponent) return null;
  return <IconComponent size={14} />;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

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

export function ProfileCanvas({
  username,
  content,
  isEditing = false,
  activeTabId,
  setActiveTabId,
  onEditBlock,
  onMoveBlock,
  onDeleteBlock,
}) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { theme } = useTheme();
  const isOwner = authUser?.username?.toLowerCase() === username?.toLowerCase();

  const tabs = (content?.tabs || []).filter((t) => t.enabled !== false);
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const blocks = currentTab?.blocks || [];

  const tabBgColor = theme?.tabs?.[currentTab?.id]?.backgroundColor || theme?.global?.backgroundColor || '#090a0f';
  const tabBgGradient = theme?.tabs?.[currentTab?.id]?.backgroundGradient || theme?.global?.backgroundGradient || null;

  return (
    <div
      className="app"
      style={{
        backgroundColor: tabBgColor,
        backgroundImage: tabBgGradient || undefined,
        minHeight: '100vh',
        transition: 'background-color 0.35s ease, background-image 0.35s ease',
      }}
    >
      {/* Edit FAB for profile owner */}
      {isOwner && !isEditing && (
        <button
          type="button"
          className="profile-edit-fab"
          onClick={() => navigate(`/@${username}/edit`)}
          title="Open Visual Editor"
        >
          ✏️ Edit Profile
        </button>
      )}

      {/* Dynamic Tab Navigation Bar (if more than 1 tab) */}
      {tabs.length > 1 && (
        <nav
          style={{
            position: 'sticky',
            top: isEditing ? '52px' : 0,
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px 20px',
            background: 'rgba(10, 10, 15, 0.75)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === currentTab?.id;
            const tabIcon = renderTabIcon(tab.icon);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full, 9999px)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--accent-color, var(--color-accent-primary))' : 'var(--color-border-subtle, rgba(255,255,255,0.08))',
                  background: isActive ? 'color-mix(in srgb, var(--accent-color, var(--color-accent-primary)) 14%, transparent)' : 'var(--color-surface-raised, rgba(255,255,255,0.03))',
                  color: isActive ? 'var(--accent-color, var(--color-accent-primary))' : 'var(--color-text-muted, #aaa)',
                  fontFamily: 'var(--font-family, var(--font-body))',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast)',
                }}
              >
                {tabIcon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Blocks Canvas */}
      <main style={{ minHeight: '80vh', padding: '40px 0 60px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab?.id || 'main'}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {blocks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', color: '#666' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '12px' }}>This tab is currently empty.</p>
                {isEditing && (
                  <p style={{ fontSize: '0.85rem', color: '#888' }}>
                    Click <strong>"+ Add Block"</strong> in the top toolbar to insert content.
                  </p>
                )}
              </div>
            ) : (
              blocks.map((block, idx) => (
                <BlockRenderer
                  key={block.id || idx}
                  block={block}
                  index={idx}
                  totalBlocks={blocks.length}
                  isEditing={isEditing}
                  onEditBlock={onEditBlock}
                  onMoveBlock={onMoveBlock}
                  onDeleteBlock={onDeleteBlock}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Profile Footer */}
      <footer className="app-footer dev">
        <p>© {new Date().getFullYear()} {username} • Built with GNC Engine</p>
      </footer>
    </div>
  );
}

export default function ProfilePage() {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, '');

  const [theme, setTheme] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTabId, setActiveTabId] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function load() {
      try {
        const [themeRes, contentRes, profileRes] = await Promise.all([
          fetch(`${API_BASE}/api/u/${username}/theme`),
          fetch(`${API_BASE}/api/u/${username}/content`),
          fetch(`${API_BASE}/api/u/${username}`),
        ]);

        if (!profileRes.ok) {
          if (profileRes.status === 404) setError('Profile not found');
          else if (profileRes.status === 403) setError('This profile is private');
          else setError('Failed to load profile');
          setLoading(false);
          return;
        }

        const rawData = contentRes.ok ? await contentRes.json() : {};
        const normalized = normalizeModularContent(rawData, username);

        setTheme(themeRes.ok ? await themeRes.json() : {});
        setContent(normalized);
        setActiveTabId(normalized.tabs?.[0]?.id || null);
        setLoading(false);
      } catch {
        setError('Failed to load profile');
        setLoading(false);
      }
    }

    load();
  }, [username]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>{error}</h2>
        <p>The profile you're looking for doesn't exist or isn't accessible.</p>
        <a href="/" style={{ color: '#00d4ff', textDecoration: 'underline', marginTop: '8px' }}>Go Home</a>
      </div>
    );
  }

  return (
    <ThemeProvider username={username} initialTheme={theme}>
      <ProfileCanvas
        username={username}
        content={content}
        isEditing={false}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
      />
    </ThemeProvider>
  );
}
