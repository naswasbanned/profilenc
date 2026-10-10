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
  LayoutDashboard,
  User,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AccountSettingsModal from '../components/Editor/AccountSettingsModal';
import MobileDock from '../components/primitives/MobileDock';
import MobileBrandBar from '../components/primitives/MobileBrandBar';
import { apiFetch } from '../lib/api';
import { normalizeModularContent } from '../lib/profileContent';
import './DashboardPage.css';
import { useUiTheme } from '../hooks/useUiTheme';

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
  const { theme, toggleTheme } = useUiTheme();



  // Auth Guard & Title
  useEffect(() => {
    document.title = 'Profilenc — User Dashboard';
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Profile data fetch for live block stats
  const [profileData, setProfileData] = useState(null);
  const [blockCount, setBlockCount] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchProfileDetails = useCallback(async () => {
    if (!user?.username) return;
    try {
      setFetchLoading(true);
      // Content uses the stored token so private profiles still count for their owner
      const [res, contentRes] = await Promise.all([
        apiFetch(`/api/u/${user.username}`, { token: null }),
        apiFetch(`/api/u/${user.username}/content`),
      ]);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
      if (contentRes.ok) {
        const content = normalizeModularContent(await contentRes.json(), user.username);
        setBlockCount((content.tabs || []).reduce((sum, tab) => sum + (tab.blocks?.length || 0), 0));
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

  // Visitor stats for the last 30 days (null while loading, false on failure)
  const [stats, setStats] = useState(null);
  useEffect(() => {
    if (!user?.username) return;
    let cancelled = false;
    apiFetch('/api/stats?days=30')
      .then((res) => (res.ok ? res.json() : false))
      .catch(() => false)
      .then((data) => { if (!cancelled) setStats(data); });
    return () => { cancelled = true; };
  }, [user?.username]);

  // Fill missing days with zero so the chart has one bar per day, oldest first
  const statsDays = useMemo(() => {
    if (!stats) return [];
    const byDay = new Map(stats.daily.map((d) => [d.day, d.views]));
    return Array.from({ length: stats.days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (stats.days - 1 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return { day: key, views: byDay.get(key) || 0 };
    });
  }, [stats]);
  const statsMax = Math.max(1, ...statsDays.map((d) => d.views));
  const views7 = statsDays.slice(-7).reduce((sum, d) => sum + d.views, 0);


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

      {/* Centered brand, phone only. Static: the dock handles navigation. */}
      <MobileBrandBar />

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
                  {blockCount !== null ? blockCount : (fetchLoading ? '...' : '—')}
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

          {/* Visitor Stats (rendered unconditionally so the stagger reaches it; see AGENTS.md) */}
          <motion.div className="dash-hub-section" variants={itemVariants}>
            <div className="section-title-wrap">
              <h2 className="dash-section-title">VISITOR STATS</h2>
              <span className="section-tag-mono">// LAST 30 DAYS</span>
            </div>

            <div className="dash-hub-card dash-stats-card">
              {stats === null && <p className="hub-desc">Loading stats...</p>}
              {stats === false && <p className="hub-desc">Stats are unavailable right now.</p>}
              {stats && (
                <>
                  <div className="dash-stats-totals">
                    <div>
                      <span className="dash-stats-number">{views7}</span>
                      <span className="hub-tag">VIEWS · 7 DAYS</span>
                    </div>
                    <div>
                      <span className="dash-stats-number">{stats.totalViews}</span>
                      <span className="hub-tag">VIEWS · 30 DAYS</span>
                    </div>
                    <BarChart3 size={22} className="dash-stats-icon" aria-hidden="true" />
                  </div>

                  <div className="dash-stats-chart" role="img" aria-label={`Daily profile views over the last ${stats.days} days, ${stats.totalViews} in total`}>
                    {statsDays.map((d) => (
                      <span
                        key={d.day}
                        className="dash-stats-bar"
                        style={{ height: `${Math.max(3, (d.views / statsMax) * 100)}%` }}
                        title={`${d.day}: ${d.views} view${d.views === 1 ? '' : 's'}`}
                      />
                    ))}
                  </div>

                  <h3 className="hub-title dash-stats-subtitle">Most clicked links</h3>
                  {stats.topClicks.length === 0 ? (
                    <p className="hub-desc">No link clicks yet. Share your profile to start collecting them.</p>
                  ) : (
                    <ol className="dash-stats-clicks">
                      {stats.topClicks.map((c) => {
                        const url = c.target.split('|').slice(1).join('|');
                        return (
                          <li key={c.target}>
                            <span className="dash-stats-url" title={url}>{url}</span>
                            <span className="hub-tag">{c.count}</span>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                  <p className="section-tag-mono dash-stats-note">
                    Counts only. Your own visits and bots are not counted; repeat visits count each time.
                  </p>
                </>
              )}
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
          onUsernameChanged={() => {
            fetchProfileDetails();
          }}
          editorTheme={theme}
        />
      )}

      {/* Phone dock: the only navigation on phones, so it carries the four
          shortcuts people reach for plus a sheet holding the header actions */}
      <MobileDock
        ariaLabel="Dashboard navigation"
        brand={{ label: 'Other settings', Icon: Settings }}
        items={[
          {
            id: 'overview',
            label: 'Home',
            Icon: LayoutDashboard,
            active: !showSettingsModal,
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          },
          {
            id: 'studio',
            label: 'Studio',
            Icon: Edit3,
            onClick: () => navigate(`/@${user?.username}/edit`),
          },
          {
            id: 'profile',
            label: 'Live',
            Icon: ExternalLink,
            onClick: () => window.open(`/@${user?.username}`, '_blank'),
          },
          {
            id: 'account',
            label: 'Account',
            Icon: User,
            active: showSettingsModal,
            onClick: () => setShowSettingsModal(true),
          },
        ]}
        sheet={{
          title: `@${user.username}`,
          rows: [
            ...(user.isAdmin
              ? [{ id: 'admin', label: 'Admin kernel', Icon: Shield, to: '/admin' }]
              : []),
            { id: 'site', label: 'Landing page', Icon: Globe, to: '/' },
            {
              id: 'copy',
              label: copied ? 'Link copied' : 'Copy profile link',
              Icon: copied ? Check : Copy,
              keepOpen: true,
              onClick: handleCopyLink,
            },
            {
              id: 'theme',
              label: theme === 'dark' ? 'Light appearance' : 'Dark appearance',
              Icon: theme === 'dark' ? Sun : Moon,
              keepOpen: true,
              onClick: toggleTheme,
            },
            { id: 'logout', label: 'Log out', Icon: LogOut, variant: 'danger', onClick: handleLogout },
          ],
        }}
      />
    </div>
  );
}
