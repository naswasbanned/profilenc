import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  LogOut,
  Shield,
  Sun,
  Moon,
  Copy,
  Check,
  Edit3,
  Globe,
  Settings,
  Layers,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AccountSettingsModal from '../components/Editor/AccountSettingsModal';
import './DashboardPage.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Universal Theme Synchronization
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('profilenc_theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      localStorage.setItem('profilenc_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      return;
    }

    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const y = rect ? rect.top + rect.height / 2 : 0;

    const maxDist = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const endRadius = Math.ceil(maxDist) + 40;

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
      localStorage.setItem('profilenc_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  // Auth Guard & Title
  useEffect(() => {
    document.title = 'Profilenc — User Dashboard';
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Profile data fetch for live block stats
  const [profileData, setProfileData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchProfileDetails = useCallback(async () => {
    if (!user?.username) return;
    try {
      setFetchLoading(true);
      const res = await fetch(`${API_BASE}/api/u/${user.username}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
    } catch (err) {
      console.error('Failed to load profile details:', err);
    } finally {
      setFetchLoading(false);
    }
  }, [user?.username]);

  useEffect(() => {
    if (user?.username) {
      fetchProfileDetails();
    }
  }, [user?.username, fetchProfileDetails]);

  // Derive total blocks
  const blockCount = useMemo(() => {
    if (!profileData?.sections) return null;
    const sec = profileData.sections;
    if (Array.isArray(sec)) {
      return sec.reduce((acc, tab) => acc + (tab?.blocks?.length || 0), 0);
    }
    if (sec.tabs && Array.isArray(sec.tabs)) {
      return sec.tabs.reduce((acc, tab) => acc + (tab?.blocks?.length || 0), 0);
    }
    return null;
  }, [profileData]);

  // Copy Profile URL
  const handleCopyLink = useCallback(() => {
    if (!user?.username) return;
    const url = `${window.location.origin}/@${user.username}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, [user?.username]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="dashboard-loading" data-theme={theme}>
        <div className="profile-loading-spinner" />
      </div>
    );
  }

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="dashboard-page" data-theme={theme}>
      <div className="raw-grid-matrix" />

      {/* Top Navigation */}
      <header className="dashboard-header-bar">
        <div className="dashboard-nav-container">
          <div className="dashboard-brand-wrap">
            <Link to="/" className="dashboard-brand">
              <img src="/logo.svg" alt="Profilenc Logo" className="brand-logo-img" />
              <span className="brand-title">PROFILENC</span>
            </Link>
            <span className="dashboard-mode-badge">USER_DASHBOARD</span>
          </div>

          <div className="dashboard-nav-actions">
            <button
              type="button"
              className="dash-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>

            {user.isAdmin && (
              <Link to="/admin" className="dash-nav-btn admin-badge-link">
                <Shield size={14} />
                <span>ADMIN KERNEL</span>
              </Link>
            )}

            <Link to={`/@${user.username}`} target="_blank" className="dash-nav-btn">
              <ExternalLink size={14} />
              <span>VIEW LIVE</span>
            </Link>

            <button type="button" onClick={handleLogout} className="dash-logout-btn">
              <LogOut size={14} />
              <span>LOG OUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-main-content">
        <motion.div
          className="dashboard-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* User Hero Overview Card */}
          <motion.div className="dash-hero-card" variants={itemVariants}>
            <div className="hero-card-meta-top">
              <div className="hero-badge-strip">
                <span className="hero-status-pill">
                  <span className="pulsing-dot" />
                  SESSION_ACTIVE
                </span>
                <span className="hero-tier-pill">
                  {user.isAdmin ? 'ROLE: ADMINISTRATOR' : 'ROLE: STANDARD_USER'}
                </span>
              </div>
              {formattedJoinDate && (
                <div className="hero-joined-date">
                  <Calendar size={13} />
                  <span>MEMBER SINCE {formattedJoinDate.toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="hero-card-body">
              <div className="hero-avatar-wrap">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName || user.username}
                    className="hero-avatar-img"
                  />
                ) : (
                  <div className="hero-avatar-fallback">
                    {(user.displayName || user.username)[0].toUpperCase()}
                  </div>
                )}
                <span className={`hero-visibility-badge ${user.isPublic ? 'public' : 'private'}`}>
                  {user.isPublic ? <Eye size={11} /> : <EyeOff size={11} />}
                  <span>{user.isPublic ? 'PUBLIC' : 'PRIVATE'}</span>
                </span>
              </div>

              <div className="hero-info-text">
                <h1 className="hero-display-name">
                  {user.displayName || user.username}
                </h1>
                <div className="hero-url-row">
                  <div className="hero-url-badge">
                    <span className="hero-url-prefix">profilenc.my.id/</span>
                    <span className="hero-url-handle">@{user.username}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="hero-copy-btn"
                    title="Copy Profile URL"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                  <Link
                    to={`/@${user.username}`}
                    target="_blank"
                    className="hero-visit-btn"
                    title="Visit Live Page"
                  >
                    <ExternalLink size={13} />
                    <span>VISIT</span>
                  </Link>
                </div>
                {user.bio ? (
                  <p className="hero-bio-text">{user.bio}</p>
                ) : (
                  <p className="hero-bio-placeholder">
                    No bio configured yet. Customize your bio in Account Settings.
                  </p>
                )}
              </div>

              <div className="hero-actions-col">
                <Link to={`/@${user.username}/edit`} className="dash-btn-primary">
                  <Edit3 size={15} />
                  <span>LAUNCH STUDIO</span>
                </Link>
                <Link to={`/@${user.username}`} target="_blank" className="dash-btn-secondary">
                  <Globe size={15} />
                  <span>VIEW PUBLIC SITE</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(true)}
                  className="dash-btn-outline"
                >
                  <Settings size={15} />
                  <span>ACCOUNT SETTINGS</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Metrics Strip */}
          <motion.div className="dash-metrics-strip" variants={itemVariants}>
            <div className="dash-metric-card">
              <span className="metric-tag">01 // VISIBILITY</span>
              <div className="metric-value-row">
                <span className={`metric-status-dot ${user.isPublic ? 'active' : 'inactive'}`} />
                <span className="metric-value-text">
                  {user.isPublic ? 'Publicly Visible' : 'Private Profile'}
                </span>
              </div>
              <span className="metric-sub">
                {user.isPublic ? 'Discoverable by all visitors' : 'Only visible when signed in'}
              </span>
            </div>

            <div className="dash-metric-card">
              <span className="metric-tag">02 // ACTIVE PRESET</span>
              <div className="metric-value-row">
                <span className="metric-preset-pill">
                  [{user.templateSlug || profileData?.user?.templateSlug || 'field-notes'}]
                </span>
              </div>
              <span className="metric-sub">Design template layout style</span>
            </div>

            <div className="dash-metric-card">
              <span className="metric-tag">03 // CONTENT BLOCKS</span>
              <div className="metric-value-row">
                <span className="metric-number">
                  {blockCount !== null ? blockCount : (fetchLoading ? '...' : 'Loaded')}
                </span>
                <span className="metric-unit">blocks</span>
              </div>
              <span className="metric-sub">Published to your profile tabs</span>
            </div>

            <div className="dash-metric-card">
              <span className="metric-tag">04 // ACCOUNT ROLE</span>
              <div className="metric-value-row">
                <span className={`metric-role-pill ${user.isAdmin ? 'admin' : 'standard'}`}>
                  {user.isAdmin ? 'KERNEL_ADMIN' : 'STANDARD_USER'}
                </span>
              </div>
              <span className="metric-sub">
                {user.isAdmin ? 'Full platform administration access' : 'Standard portfolio account'}
              </span>
            </div>
          </motion.div>

          {/* Navigation Hub Cards Grid */}
          <motion.div className="dash-hub-section" variants={itemVariants}>
            <div className="section-title-wrap">
              <h2 className="dash-section-title">CONTROL HUBS</h2>
              <span className="section-tag-mono">// DIRECT WORKSPACES</span>
            </div>

            <div className="dash-hub-grid">
              {/* Card 1: Studio Editor */}
              <div
                className="dash-hub-card coral-hub"
                onClick={() => navigate(`/@${user.username}/edit`)}
              >
                <div className="hub-card-header">
                  <div className="hub-icon-wrap coral">
                    <Layers size={22} />
                  </div>
                  <span className="hub-tag">01 // STUDIO</span>
                </div>
                <div className="hub-card-content">
                  <h3 className="hub-title">Visual Block Studio</h3>
                  <p className="hub-desc">
                    Customize modular blocks, adjust typography, fine-tune colors, and reorder tabs live with instant visual feedback.
                  </p>
                </div>
                <div className="hub-card-footer">
                  <span className="hub-action-link">
                    Open Editor Studio <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Card 2: Live Showcase */}
              <div
                className="dash-hub-card mint-hub"
                onClick={() => window.open(`/@${user.username}`, '_blank')}
              >
                <div className="hub-card-header">
                  <div className="hub-icon-wrap mint">
                    <Globe size={22} />
                  </div>
                  <span className="hub-tag">02 // SHOWCASE</span>
                </div>
                <div className="hub-card-content">
                  <h3 className="hub-title">Live Public Profile</h3>
                  <p className="hub-desc">
                    Inspect your personal page exactly as visitors, clients, and potential collaborators see it on the web.
                  </p>
                </div>
                <div className="hub-card-footer">
                  <span className="hub-action-link">
                    View Live Site <ExternalLink size={14} />
                  </span>
                </div>
              </div>

              {/* Card 3: Account Config */}
              <div
                className="dash-hub-card lavender-hub"
                onClick={() => setShowSettingsModal(true)}
              >
                <div className="hub-card-header">
                  <div className="hub-icon-wrap lavender">
                    <Settings size={22} />
                  </div>
                  <span className="hub-tag">03 // CONFIG</span>
                </div>
                <div className="hub-card-content">
                  <h3 className="hub-title">Account & Credentials</h3>
                  <p className="hub-desc">
                    Update your avatar, display name, handle username, biography, profile visibility, or update security password.
                  </p>
                </div>
                <div className="hub-card-footer">
                  <span className="hub-action-link">
                    Manage Settings <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Card 4 (Admin): Kernel Admin Console */}
              {user.isAdmin && (
                <div
                  className="dash-hub-card amber-hub"
                  onClick={() => navigate('/admin')}
                >
                  <div className="hub-card-header">
                    <div className="hub-icon-wrap amber">
                      <Shield size={22} />
                    </div>
                    <span className="hub-tag">04 // KERNEL</span>
                  </div>
                  <div className="hub-card-content">
                    <h3 className="hub-title">Admin Kernel Console</h3>
                    <p className="hub-desc">
                      Manage user registries, release patch notes, update landing page CMS blocks, and review community feedback.
                    </p>
                  </div>
                  <div className="hub-card-footer">
                    <span className="hub-action-link">
                      Enter Kernel Console <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Account Settings Modal */}
      {showSettingsModal && (
        <AccountSettingsModal
          onClose={() => setShowSettingsModal(false)}
          onUsernameChanged={(newUsername) => {
            fetchProfileDetails();
          }}
          editorTheme={theme}
        />
      )}
    </div>
  );
}
