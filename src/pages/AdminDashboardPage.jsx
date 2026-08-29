import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  Layout,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  Layers,
  Save,
  CheckCircle,
  MessageSquare,
  Inbox,
  Filter,
  Maximize2,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AdminDashboardPage.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

function formatLastChange(dateStr) {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminDashboardPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'patches' | 'landing' | 'suggestions'

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    publicUsers: 0,
    adminUsers: 0,
    totalBlocks: 0,
    totalPatches: 0,
    totalSuggestions: 0,
    newSuggestions: 0,
  });

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [deleteUserModal, setDeleteUserModal] = useState(null);

  // Patch Notes State
  const [patchNotes, setPatchNotes] = useState([]);
  const [patchesLoading, setPatchesLoading] = useState(true);
  const [editingPatch, setEditingPatch] = useState(null);
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);

  // Landing Page CMS State
  const [landingConfig, setLandingConfig] = useState(null);
  const [landingLoading, setLandingLoading] = useState(true);
  const [savingLanding, setSavingLanding] = useState(false);
  const [landingSaveSuccess, setLandingSaveSuccess] = useState(false);

  // Suggestions State
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [suggestionCategory, setSuggestionCategory] = useState('ALL');
  const [suggestionStatus, setSuggestionStatus] = useState('ALL');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [deleteSuggestionModal, setDeleteSuggestionModal] = useState(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Set document title
  useEffect(() => {
    document.title = 'Profilenc Admin — Kernel Control';
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Fetch stats failed:', err);
    }
  }, [token]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const query = userSearch ? `?search=${encodeURIComponent(userSearch)}` : '';
      const res = await fetch(`${API_BASE}/api/admin/users${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (err) {
      console.error('Fetch users failed:', err);
      showToast('Failed to load users', 'error');
    } finally {
      setUsersLoading(false);
    }
  }, [token, userSearch]);

  // Fetch Patch Notes
  const fetchPatchNotes = useCallback(async () => {
    if (!token) return;
    setPatchesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/patch-notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPatchNotes(data.patchNotes || []);
      }
    } catch (err) {
      console.error('Fetch patch notes failed:', err);
      showToast('Failed to load patch notes', 'error');
    } finally {
      setPatchesLoading(false);
    }
  }, [token]);

  // Fetch Landing Page CMS
  const fetchLandingConfig = useCallback(async () => {
    if (!token) return;
    setLandingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/landing`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setLandingConfig(data.config);
        } else {
          // Defaults
          setLandingConfig({
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
          });
        }
      }
    } catch (err) {
      console.error('Fetch landing config failed:', err);
      showToast('Failed to load landing configuration', 'error');
    } finally {
      setLandingLoading(false);
    }
  }, [token]);

  // Fetch Suggestions
  const fetchSuggestions = useCallback(async () => {
    if (!token) return;
    setSuggestionsLoading(true);
    try {
      const params = new URLSearchParams();
      if (suggestionCategory !== 'ALL') params.append('category', suggestionCategory);
      if (suggestionStatus !== 'ALL') params.append('status', suggestionStatus);
      if (suggestionSearch.trim()) params.append('search', suggestionSearch.trim());

      const res = await fetch(`${API_BASE}/api/admin/suggestions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestionsList(data.suggestions || []);
      }
    } catch (err) {
      console.error('Fetch suggestions failed:', err);
      showToast('Failed to load suggestions', 'error');
    } finally {
      setSuggestionsLoading(false);
    }
  }, [token, suggestionCategory, suggestionStatus, suggestionSearch]);

  // Load data on tab switch
  useEffect(() => {
    if (!token) return;
    fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'patches') fetchPatchNotes();
    if (activeTab === 'landing') fetchLandingConfig();
    if (activeTab === 'suggestions') fetchSuggestions();
  }, [token, activeTab, fetchStats, fetchUsers, fetchPatchNotes, fetchLandingConfig, fetchSuggestions]);

  // --- Handlers: Suggestion Actions ---
  const handleUpdateSuggestionStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/suggestions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update status');
      }

      showToast(`Marked suggestion as ${newStatus}`);
      fetchSuggestions();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteSuggestion = async () => {
    if (!deleteSuggestionModal) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/suggestions/${deleteSuggestionModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete suggestion');
      }

      showToast('Suggestion removed from inbox');
      setDeleteSuggestionModal(null);
      fetchSuggestions();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- Handlers: User Actions ---
  const handleToggleUserAdmin = async (targetUser) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_admin: !targetUser.is_admin }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }

      showToast(`Updated admin status for @${targetUser.username}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleUserPublic = async (targetUser) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${targetUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_public: !targetUser.is_public }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Update failed');
      }

      showToast(`Updated visibility for @${targetUser.username}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserModal) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${deleteUserModal.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }

      showToast(`Deleted user @${deleteUserModal.username}`);
      setDeleteUserModal(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- Handlers: Patch Notes ---
  const handleOpenNewPatch = () => {
    setEditingPatch({
      version: '',
      status: 'UPDATE',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      codename: '',
      title: '',
      changes: [{ type: 'NEW', text: '' }],
      order_num: patchNotes.length,
      is_current: false,
    });
    setIsPatchModalOpen(true);
  };

  const handleEditPatch = (patch) => {
    setEditingPatch({
      ...patch,
      changes: Array.isArray(patch.changes) ? [...patch.changes] : [],
    });
    setIsPatchModalOpen(true);
  };

  const handleSavePatch = async (e) => {
    e.preventDefault();
    if (!editingPatch) return;

    try {
      const isNew = !editingPatch.id;
      const url = isNew ? `${API_BASE}/api/admin/patch-notes` : `${API_BASE}/api/admin/patch-notes/${editingPatch.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPatch),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      showToast(isNew ? 'Release note published!' : 'Release note updated!');
      setIsPatchModalOpen(false);
      setEditingPatch(null);
      fetchPatchNotes();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePatch = async (patchId) => {
    if (!confirm('Are you sure you want to delete this patch note?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/patch-notes/${patchId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Delete failed');
      }

      showToast('Patch note deleted');
      fetchPatchNotes();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // --- Handlers: Landing Page CMS ---
  const handleSaveLanding = async () => {
    if (!landingConfig) return;
    setSavingLanding(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/landing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ config: landingConfig }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      setLandingSaveSuccess(true);
      showToast('Landing page content saved live!');
      setTimeout(() => setLandingSaveSuccess(false), 3000);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingLanding(false);
    }
  };

  // Auth Guard
  if (authLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner" />
        <p>AUTHENTICATING ADMIN PRIVILEGES...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="admin-denied-page">
        <div className="admin-denied-card">
          <div className="denied-icon"><Shield size={36} /></div>
          <h2>ACCESS DENIED</h2>
          <p>You do not have administrator permissions to access the Profilenc Kernel Dashboard.</p>
          <div className="denied-actions">
            <Link to="/dashboard" className="admin-btn-secondary">
              <ArrowLeft size={16} /> Return to Dashboard
            </Link>
            <Link to="/login" className="admin-btn-primary">
              Log In as Administrator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="raw-grid-matrix" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`admin-toast ${toastMessage.type}`}>
          {toastMessage.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand-wrap">
            <Link to="/" className="admin-brand">
              <span className="brand-bracket">[</span>
              <span className="brand-name">PROFILENC</span>
              <span className="brand-bracket">]</span>
            </Link>
            <div className="admin-kernel-badge">KERNEL_ADMIN_CONTROL</div>
          </div>

          <div className="admin-header-nav">
            <Link to="/" target="_blank" className="admin-nav-link">
              <ExternalLink size={14} /> View Live Site
            </Link>
            <Link to="/dashboard" className="admin-nav-link">
              <Layout size={14} /> My Dashboard
            </Link>
            <div className="admin-user-pill">
              <span className="pill-dot" />
              <span>@{user.username}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <main className="admin-main">
        {/* Stats Matrix Bar */}
        <section className="admin-stats-bar">
          <div className="admin-stat-box">
            <div className="stat-label">REGISTERED USERS</div>
            <div className="stat-val">{stats.totalUsers}</div>
            <div className="stat-sub">{stats.publicUsers} public • {stats.adminUsers} admins</div>
          </div>
          <div className="admin-stat-box">
            <div className="stat-label">TOTAL CONTENT BLOCKS</div>
            <div className="stat-val">{stats.totalBlocks}</div>
            <div className="stat-sub">Across all user profiles</div>
          </div>
          <div className="admin-stat-box">
            <div className="stat-label">ENGINE RELEASES</div>
            <div className="stat-val">{stats.totalPatches}</div>
            <div className="stat-sub">Documented in patch notes</div>
          </div>
          <div className="admin-stat-box">
            <div className="stat-label">OPEN SUGGESTIONS</div>
            <div className="stat-val accent">{stats.totalSuggestions || 0}</div>
            <div className="stat-sub">{stats.newSuggestions || 0} unreviewed items</div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="admin-tab-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>[01 // USERS_REGISTRY]</span>
            <span className="tab-count">{stats.totalUsers}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'patches' ? 'active' : ''}`}
            onClick={() => setActiveTab('patches')}
          >
            <FileText size={16} />
            <span>[02 // PATCH_NOTES_ENGINE]</span>
            <span className="tab-count">{stats.totalPatches}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing')}
          >
            <Layers size={16} />
            <span>[03 // LANDING_PAGE_CMS]</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <MessageSquare size={16} />
            <span>[04 // SUGGESTION_BOX]</span>
            {stats.newSuggestions > 0 ? (
              <span className="tab-count highlight">{stats.newSuggestions} NEW</span>
            ) : (
              <span className="tab-count">{stats.totalSuggestions || 0}</span>
            )}
          </button>
        </div>

        {/* ====================================================================
            TAB 1: USERS REGISTRY
            ==================================================================== */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="content-toolbar">
              <div className="toolbar-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by username, email, or display name..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                {userSearch && (
                  <button type="button" onClick={() => setUserSearch('')} className="search-clear-btn">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button type="button" onClick={fetchUsers} className="admin-btn-secondary">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {usersLoading ? (
              <div className="admin-table-loading">Loading users registry...</div>
            ) : usersList.length === 0 ? (
              <div className="admin-empty-state">No users found matching "{userSearch}"</div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>USER / HANDLE</th>
                      <th>EMAIL</th>
                      <th>TEMPLATE</th>
                      <th>BLOCKS</th>
                      <th>RECENT CHANGE</th>
                      <th>JOINED</th>
                      <th>VISIBILITY</th>
                      <th>ROLE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-mini">
                              {u.avatar_url ? (
                                <img src={u.avatar_url} alt="" />
                              ) : (
                                <span>{u.username[0].toUpperCase()}</span>
                              )}
                            </div>
                            <div className="user-info-text">
                              <span className="user-display-name">{u.display_name || u.username}</span>
                              <Link to={`/@${u.username}`} target="_blank" className="user-handle-link">
                                @{u.username} <ExternalLink size={11} />
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="monospace-cell">{u.email}</span>
                        </td>
                        <td>
                          <span className="template-tag">[{u.template_slug || 'CUSTOM'}]</span>
                        </td>
                        <td>
                          <span className="monospace-cell" style={{ fontWeight: 600, color: '#f1f5f9' }}>
                            {u.block_count || 0} {u.block_count === 1 ? 'block' : 'blocks'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="monospace-cell" style={{ color: '#00f0aa', fontSize: '0.82rem', fontWeight: 600 }}>
                              {formatLastChange(u.last_changed_at || u.updated_at || u.created_at)}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {new Date(u.last_changed_at || u.updated_at || u.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="monospace-cell">
                            {new Date(u.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleUserPublic(u)}
                            className={`status-pill-btn ${u.is_public ? 'public' : 'private'}`}
                            title="Click to toggle visibility"
                          >
                            {u.is_public ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>{u.is_public ? 'PUBLIC' : 'PRIVATE'}</span>
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleUserAdmin(u)}
                            className={`role-pill-btn ${u.is_admin ? 'admin' : 'user'}`}
                            title="Click to toggle admin privileges"
                          >
                            <Shield size={12} />
                            <span>{u.is_admin ? 'ADMIN' : 'USER'}</span>
                          </button>
                        </td>
                        <td>
                          <div className="action-btns">
                            <Link to={`/@${u.username}`} target="_blank" className="action-btn" title="View Profile">
                              <ExternalLink size={14} />
                            </Link>
                            {u.id !== user.id && (
                              <button
                                type="button"
                                onClick={() => setDeleteUserModal(u)}
                                className="action-btn danger"
                                title="Delete User"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 2: PATCH NOTES MANAGER
            ==================================================================== */}
        {activeTab === 'patches' && (
          <div className="admin-tab-content">
            <div className="content-toolbar">
              <div className="toolbar-info">
                <h3>ENGINE CHANGELOG & RELEASE TIMELINE</h3>
                <p>Manage release updates displayed on the landing page timeline.</p>
              </div>
              <button type="button" onClick={handleOpenNewPatch} className="admin-btn-primary">
                <Plus size={16} /> New Release Note
              </button>
            </div>

            {patchesLoading ? (
              <div className="admin-table-loading">Loading patch notes...</div>
            ) : patchNotes.length === 0 ? (
              <div className="admin-empty-state">No patch notes published yet.</div>
            ) : (
              <div className="admin-patches-grid">
                {patchNotes.map((p) => (
                  <div key={p.id || p.version} className={`admin-patch-card ${p.is_current ? 'current' : ''}`}>
                    <div className="patch-card-top">
                      <div className="patch-card-version-wrap">
                        <span className="patch-card-ver">{p.version}</span>
                        <span className="patch-card-tag">[{p.status}]</span>
                        {p.is_current && <span className="patch-current-badge">CURRENT RELEASE</span>}
                      </div>
                      <div className="patch-card-actions">
                        <button type="button" onClick={() => handleEditPatch(p)} className="action-btn">
                          <Edit2 size={14} />
                        </button>
                        <button type="button" onClick={() => handleDeletePatch(p.id)} className="action-btn danger">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="patch-card-meta">
                      <span>RELEASE DATE: {p.date}</span>
                      {p.codename && <span>TITLE: {p.codename}</span>}
                    </div>

                    <h4 className="patch-card-title">{p.title}</h4>

                    <div className="patch-card-changes">
                      {Array.isArray(p.changes) &&
                        p.changes.map((c, cIdx) => (
                          <div key={cIdx} className="admin-change-row">
                            <span className={`change-tag ${(c.type || 'new').toLowerCase()}`}>[{c.type || 'NEW'}]</span>
                            <span className="change-desc">{c.text}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            TAB 3: LANDING PAGE CMS
            ==================================================================== */}
        {activeTab === 'landing' && (
          <div className="admin-tab-content">
            {landingLoading ? (
              <div className="admin-table-loading">Loading landing page configuration...</div>
            ) : landingConfig ? (
              <div className="admin-cms-form">
                <div className="cms-section-card">
                  <div className="cms-section-header">
                    <span className="cms-sec-badge">[01 // HERO_SECTION]</span>
                    <h3>HERO MANIFESTO & BRANDING</h3>
                  </div>

                  <div className="cms-fields-grid">
                    <div className="cms-field">
                      <label>TOP BRAND BADGE</label>
                      <input
                        type="text"
                        value={landingConfig.hero?.badge || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            hero: { ...landingConfig.hero, badge: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>MASTHEAD LINE 1 (TOP)</label>
                      <input
                        type="text"
                        value={landingConfig.hero?.mastheadTop || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            hero: { ...landingConfig.hero, mastheadTop: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>MASTHEAD LINE 2 (MIDDLE)</label>
                      <input
                        type="text"
                        value={landingConfig.hero?.mastheadMid || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            hero: { ...landingConfig.hero, mastheadMid: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>MASTHEAD LINE 3 (SUB)</label>
                      <input
                        type="text"
                        value={landingConfig.hero?.mastheadSub || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            hero: { ...landingConfig.hero, mastheadSub: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field full-width">
                      <label>MANIFESTO LEAD PARAGRAPH</label>
                      <textarea
                        rows={3}
                        value={landingConfig.hero?.manifestoLead || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            hero: { ...landingConfig.hero, manifestoLead: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field full-width">
                      <label>DOMAIN CLAIM LABEL</label>
                      <input
                        type="text"
                        value={landingConfig.hero?.claimLabel || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            hero: { ...landingConfig.hero, claimLabel: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="cms-section-card">
                  <div className="cms-section-header">
                    <span className="cms-sec-badge">[02 // MARQUEE_STREAM]</span>
                    <h3>KINETIC MARQUEE BANNER</h3>
                  </div>

                  <div className="cms-field full-width">
                    <label>MARQUEE STREAM TEXT (REPEATABLE BANNER)</label>
                    <input
                      type="text"
                      value={landingConfig.marquee?.text || ''}
                      onChange={(e) =>
                        setLandingConfig({
                          ...landingConfig,
                          marquee: { ...landingConfig.marquee, text: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="cms-section-card">
                  <div className="cms-section-header">
                    <span className="cms-sec-badge">[03 // CALL_TO_ACTION]</span>
                    <h3>BOTTOM CALL TO ACTION (CTA)</h3>
                  </div>

                  <div className="cms-fields-grid">
                    <div className="cms-field">
                      <label>CTA BADGE</label>
                      <input
                        type="text"
                        value={landingConfig.cta?.badge || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            cta: { ...landingConfig.cta, badge: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field">
                      <label>CTA BUTTON LABEL</label>
                      <input
                        type="text"
                        value={landingConfig.cta?.btnLabel || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            cta: { ...landingConfig.cta, btnLabel: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field full-width">
                      <label>CTA MAIN HEADING</label>
                      <input
                        type="text"
                        value={landingConfig.cta?.title || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            cta: { ...landingConfig.cta, title: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="cms-field full-width">
                      <label>CTA DESCRIPTION TEXT</label>
                      <textarea
                        rows={2}
                        value={landingConfig.cta?.text || ''}
                        onChange={(e) =>
                          setLandingConfig({
                            ...landingConfig,
                            cta: { ...landingConfig.cta, text: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Save Toolbar */}
                <div className="cms-save-toolbar">
                  <button
                    type="button"
                    onClick={handleSaveLanding}
                    disabled={savingLanding}
                    className={`admin-btn-primary big ${landingSaveSuccess ? 'success' : ''}`}
                  >
                    {savingLanding ? (
                      <>Saving Live...</>
                    ) : landingSaveSuccess ? (
                      <>
                        <Check size={18} /> Changes Saved Live!
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Publish Landing Page Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ====================================================================
            TAB 4: OPEN SUGGESTION BOX FEED
            ==================================================================== */}
        {activeTab === 'suggestions' && (
          <div className="admin-tab-content">
            <div className="content-toolbar">
              <div className="toolbar-info">
                <h3>COMMUNITY SUGGESTIONS & FEEDBACK INBOX</h3>
                <p>Review feature requests, design thoughts, and bug reports submitted from the landing page.</p>
              </div>

              <button type="button" onClick={fetchSuggestions} className="admin-btn-secondary">
                <RefreshCw size={14} /> Refresh Inbox
              </button>
            </div>

            {/* Filter Controls Bar */}
            <div className="suggestions-filter-bar">
              <div className="filter-group">
                <span className="filter-label">CATEGORY:</span>
                <div className="filter-pills">
                  {['ALL', 'DESIGN', 'TECHNICALITY', 'FEATURE', 'BUG'].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setSuggestionCategory(cat)}
                      className={`filter-pill-btn ${suggestionCategory === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-label">STATUS:</span>
                <div className="filter-pills">
                  {['ALL', 'NEW', 'REVIEWED', 'RESOLVED', 'ARCHIVED'].map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setSuggestionStatus(st)}
                      className={`filter-pill-btn ${suggestionStatus === st ? 'active' : ''}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-search-box">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Search suggestions..."
                  value={suggestionSearch}
                  onChange={(e) => setSuggestionSearch(e.target.value)}
                />
                {suggestionSearch && (
                  <button type="button" onClick={() => setSuggestionSearch('')} className="search-clear-btn">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Suggestions Cards List */}
            {suggestionsLoading ? (
              <div className="admin-table-loading">Loading suggestion inbox...</div>
            ) : suggestionsList.length === 0 ? (
              <div className="admin-empty-state">No suggestions found matching the selected filters.</div>
            ) : (
              <div className="admin-suggestions-grid">
                {suggestionsList.map((sug) => (
                  <div key={sug.id} className={`admin-sug-card ${sug.status.toLowerCase()}`}>
                    <div className="sug-card-top">
                      <div className="sug-badge-group">
                        <span className={`sug-cat-badge ${(sug.category || 'design').toLowerCase()}`}>
                          [{sug.category}]
                        </span>
                        <span className={`sug-status-pill ${(sug.status || 'new').toLowerCase()}`}>
                          {sug.status}
                        </span>
                      </div>

                      <div className="sug-meta-right">
                        <span className="sug-date">
                          <Clock size={12} />
                          {new Date(sug.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="sug-card-body">
                      <h4 className="sug-title">{sug.title}</h4>
                      <p className="sug-message">{sug.message}</p>

                      {/* Submitter info */}
                      {(sug.name || sug.email) && (
                        <div className="sug-submitter-bar">
                          <span className="sub-label">FROM:</span>
                          {sug.name && <span className="sub-name">{sug.name}</span>}
                          {sug.email && <span className="sub-email">({sug.email})</span>}
                        </div>
                      )}

                      {/* Attached Screenshot */}
                      {sug.image_url && (
                        <div className="sug-attachment-box">
                          <span className="attachment-label">ATTACHED SCREENSHOT:</span>
                          <div
                            className="sug-img-thumbnail-wrap"
                            onClick={() => setSelectedImageModal(sug.image_url)}
                          >
                            <img src={sug.image_url} alt="Screenshot" className="sug-img-thumb" />
                            <div className="thumb-zoom-overlay">
                              <Maximize2 size={16} />
                              <span>VIEW FULLSCREEN</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="sug-card-footer">
                      <div className="status-changer-group">
                        <span className="status-changer-label">MARK AS:</span>
                        {['NEW', 'REVIEWED', 'RESOLVED', 'ARCHIVED'].map((st) => (
                          <button
                            type="button"
                            key={st}
                            disabled={sug.status === st}
                            onClick={() => handleUpdateSuggestionStatus(sug.id, st)}
                            className={`status-opt-btn ${sug.status === st ? 'current' : ''}`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeleteSuggestionModal(sug)}
                        className="action-btn danger"
                        title="Delete Suggestion"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Suggestion Modal */}
      {deleteSuggestionModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <span className="modal-badge">[DELETE_SUGGESTION]</span>
              <h3>REMOVE FROM INBOX</h3>
            </div>
            <p className="modal-text">
              Are you sure you want to permanently delete suggestion <strong>"{deleteSuggestionModal.title}"</strong>?
            </p>
            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteSuggestionModal(null)} className="admin-btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleDeleteSuggestion} className="admin-btn-danger">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {selectedImageModal && (
        <div className="admin-modal-overlay" onClick={() => setSelectedImageModal(null)}>
          <div className="admin-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-topbar">
              <span className="modal-badge">[SCREENSHOT_VIEWER]</span>
              <button type="button" onClick={() => setSelectedImageModal(null)} className="lightbox-close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="lightbox-img-wrap">
              <img src={selectedImageModal} alt="Enlarged screenshot" className="lightbox-img" />
            </div>
            <div className="lightbox-footer">
              <a href={selectedImageModal} target="_blank" rel="noopener noreferrer" className="admin-btn-secondary">
                <ExternalLink size={14} /> Open in New Tab
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteUserModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="modal-header">
              <span className="modal-badge">[DELETE_USER_WARNING]</span>
              <h3>CONFIRM ACCOUNT DELETION</h3>
            </div>
            <p className="modal-text">
              Are you sure you want to delete user <strong>@{deleteUserModal.username}</strong> ({deleteUserModal.email})?
              All user content, themes, and uploaded images will be permanently erased.
            </p>
            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteUserModal(null)} className="admin-btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleDeleteUser} className="admin-btn-danger">
                <Trash2 size={16} /> Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patch Note Edit / Create Modal */}
      {isPatchModalOpen && editingPatch && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box wide">
            <div className="modal-header">
              <span className="modal-badge">{editingPatch.id ? '[EDIT_RELEASE_NOTE]' : '[NEW_RELEASE_NOTE]'}</span>
              <h3>{editingPatch.id ? `EDIT ${editingPatch.version}` : 'CREATE NEW RELEASE NOTE'}</h3>
            </div>

            <form onSubmit={handleSavePatch} className="admin-patch-form">
              <div className="form-row-2">
                <div className="cms-field">
                  <label>VERSION (e.g. v1.1.0)</label>
                  <input
                    type="text"
                    required
                    placeholder="v1.1.0"
                    value={editingPatch.version}
                    onChange={(e) => setEditingPatch({ ...editingPatch, version: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>STATUS TAG</label>
                  <select
                    value={editingPatch.status}
                    onChange={(e) => setEditingPatch({ ...editingPatch, status: e.target.value })}
                  >
                    <option value="LATEST UPDATE">LATEST UPDATE</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="BETA RELEASE">BETA RELEASE</option>
                    <option value="SECURITY PATCH">SECURITY PATCH</option>
                    <option value="INITIAL LAUNCH">INITIAL LAUNCH</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="cms-field">
                  <label>RELEASE DATE</label>
                  <input
                    type="text"
                    required
                    placeholder="August 28, 2026"
                    value={editingPatch.date}
                    onChange={(e) => setEditingPatch({ ...editingPatch, date: e.target.value })}
                  />
                </div>
                <div className="cms-field">
                  <label>CODENAME / SUBTITLE</label>
                  <input
                    type="text"
                    placeholder="RELEASE 1.1"
                    value={editingPatch.codename || ''}
                    onChange={(e) => setEditingPatch({ ...editingPatch, codename: e.target.value })}
                  />
                </div>
              </div>

              <div className="cms-field full-width">
                <label>HEADLINE / SUMMARY TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="Photo Gallery, Events Calendar & Smooth Scroll"
                  value={editingPatch.title}
                  onChange={(e) => setEditingPatch({ ...editingPatch, title: e.target.value })}
                />
              </div>

              <div className="cms-field full-width">
                <label className="label-with-action">
                  <span>CHANGELOG ITEMS</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingPatch({
                        ...editingPatch,
                        changes: [...editingPatch.changes, { type: 'NEW', text: '' }],
                      })
                    }
                    className="add-change-btn"
                  >
                    <Plus size={12} /> Add Item
                  </button>
                </label>

                <div className="patch-items-editor">
                  {editingPatch.changes.map((item, idx) => (
                    <div key={idx} className="patch-item-edit-row">
                      <select
                        value={item.type}
                        onChange={(e) => {
                          const updated = [...editingPatch.changes];
                          updated[idx].type = e.target.value;
                          setEditingPatch({ ...editingPatch, changes: updated });
                        }}
                      >
                        <option value="NEW">NEW</option>
                        <option value="IMPROVED">IMPROVED</option>
                        <option value="SYSTEM">SYSTEM</option>
                        <option value="STUDIO">STUDIO</option>
                        <option value="CRITICAL">CRITICAL</option>
                      </select>
                      <input
                        type="text"
                        required
                        placeholder="Feature description or enhancement detail..."
                        value={item.text}
                        onChange={(e) => {
                          const updated = [...editingPatch.changes];
                          updated[idx].text = e.target.value;
                          setEditingPatch({ ...editingPatch, changes: updated });
                        }}
                      />
                      {editingPatch.changes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingPatch.changes.filter((_, i) => i !== idx);
                            setEditingPatch({ ...editingPatch, changes: updated });
                          }}
                          className="remove-change-btn"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="cms-checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={editingPatch.is_current || false}
                    onChange={(e) => setEditingPatch({ ...editingPatch, is_current: e.target.checked })}
                  />
                  <span>Mark as current featured release (displays green highlight)</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsPatchModalOpen(false);
                    setEditingPatch(null);
                  }}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Save size={16} /> Save Release Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
