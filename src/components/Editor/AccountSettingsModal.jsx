import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Lock,
  LogOut,
  Save,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  Shield,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import EditorModal from '../primitives/EditorModal';
import ImageUploadPicker from './ImageUploadPicker';
import './Editor.css';

export default function AccountSettingsModal({ onClose, onUsernameChanged, editorTheme }) {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout, checkUsername, deleteAccount } = useAuth();

  const currentEditorTheme = editorTheme || (typeof window !== 'undefined' ? localStorage.getItem('profilenc_theme') || document.documentElement.getAttribute('data-theme') || 'dark' : 'dark');

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'session'

  // Profile Form State
  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isPublic, setIsPublic] = useState(user?.isPublic !== false);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState({ state: 'clean', msg: '' }); // 'clean' | 'checking' | 'available' | 'taken' | 'invalid'

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Status feedback
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Advanced Options / Account Deletion State
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmUsername, setDeleteConfirmUsername] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Compute if Profile Details have unsaved changes
  const isProfileDirty = useMemo(() => {
    const curName = (displayName || '').trim();
    const initName = (user?.displayName || user?.username || '').trim();
    const curUser = (username || '').toLowerCase().trim();
    const initUser = (user?.username || '').toLowerCase().trim();
    const curAvatar = (avatarUrl || '').trim();
    const initAvatar = (user?.avatarUrl || '').trim();
    const curBio = (bio || '').trim();
    const initBio = (user?.bio || '').trim();
    const curPublic = isPublic !== false;
    const initPublic = user?.isPublic !== false;

    return (
      curName !== initName ||
      curUser !== initUser ||
      curAvatar !== initAvatar ||
      curBio !== initBio ||
      curPublic !== initPublic
    );
  }, [displayName, username, avatarUrl, bio, isPublic, user]);

  // Compute if Security & Password has unsaved input
  const isSecurityDirty = useMemo(() => {
    return Boolean(currentPassword || newPassword || confirmPassword);
  }, [currentPassword, newPassword, confirmPassword]);

  // Live username availability checker with debounce
  useEffect(() => {
    const trimmed = username.toLowerCase().trim();
    if (!trimmed || trimmed === user?.username?.toLowerCase()) {
      setUsernameStatus({ state: 'clean', msg: '' });
      return;
    }

    if (!/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/.test(trimmed)) {
      setUsernameStatus({ state: 'invalid', msg: '3-30 chars, lowercase letters, numbers, and hyphens only' });
      return;
    }

    setUsernameStatus({ state: 'checking', msg: 'Checking availability...' });
    const timer = setTimeout(async () => {
      try {
        const res = await checkUsername(trimmed);
        if (res.available) {
          setUsernameStatus({ state: 'available', msg: 'Username is available!' });
        } else {
          setUsernameStatus({ state: 'taken', msg: res.reason || 'Username is already taken' });
        }
      } catch (err) {
        setUsernameStatus({ state: 'invalid', msg: 'Unable to check username' });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [username, user?.username, checkUsername]);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (savingProfile || !isProfileDirty) return;

    if (usernameStatus.state === 'taken' || usernameStatus.state === 'invalid') {
      setProfileMsg({ type: 'error', text: 'Please resolve username issues before saving.' });
      return;
    }

    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const oldUsername = user?.username;
      const res = await updateProfile({
        displayName: displayName.trim(),
        username: username.toLowerCase().trim(),
        avatarUrl: avatarUrl.trim(),
        bio: bio.trim(),
        isPublic,
      });

      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });

      const newUsername = res.user?.username;
      if (newUsername && newUsername !== oldUsername) {
        if (onUsernameChanged) onUsernameChanged(newUsername);
        navigate(`/@${newUsername}/edit`, { replace: true });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e?.preventDefault();
    if (savingPassword) return;

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'All password fields are required.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg({ type: '', text: '' });

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmUsername.trim().toLowerCase() !== user?.username?.toLowerCase()) {
      setDeleteError('Please type your exact username to confirm');
      return;
    }
    setDeletingAccount(true);
    setDeleteError('');
    try {
      await deleteAccount(deleteConfirmUsername.trim());
      onClose();
      navigate('/');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account');
      setDeletingAccount(false);
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === 'profile' && isProfileDirty && !savingProfile) {
          handleSaveProfile();
        } else if (activeTab === 'security' && isSecurityDirty && !savingPassword) {
          handleChangePassword();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, isProfileDirty, savingProfile, isSecurityDirty, savingPassword]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <EditorModal
      onClose={onClose}
      editorTheme={currentEditorTheme}
      dialogClassName="account-settings-modal"
      dialogStyle={{ borderRadius: 18 }}
      fadeBackdrop
      portal
      dialogMotionProps={{
        layout: true,
        transition: {
          layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.2, ease: 'easeOut' },
          scale: { duration: 0.2, ease: 'easeOut' },
          y: { duration: 0.2, ease: 'easeOut' },
        },
      }}
    >
        {/* Header */}
        <motion.div layout="position" className="editor-modal-header account-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '50%', background: 'var(--fn-editor-coral)', color: 'var(--fn-editor-ink)', border: '2px solid var(--fn-editor-ink)', boxShadow: 'var(--fn-editor-shadow-xs)', flexShrink: 0 }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>
                Account & Profile Settings
              </h3>
              <span>
                Modify your public profile identity, credentials, and visibility
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </motion.div>

        {/* Tab Navigation (Segmented Pill Control matching sidebar) */}
        <motion.div layout="position" className="account-tabs-nav-wrapper">
          <div className="account-tabs-nav">
            {[
              { id: 'profile', label: 'Profile Details', icon: User },
              { id: 'security', label: 'Security & Password', icon: Lock },
              { id: 'session', label: 'Session & Logout', icon: LogOut },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`account-tab-btn ${isActive ? 'active' : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="accountActiveTabPill"
                      className="account-tab-indicator"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 9999,
                        background: 'var(--fn-editor-coral)',
                        border: '2px solid var(--fn-editor-ink)',
                        boxShadow: 'var(--fn-editor-shadow-xs)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Modal Body */}
        <motion.div layout className="editor-modal-body" style={{ padding: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {/* --- TAB 1: PROFILE DETAILS --- */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profileMsg.text && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: profileMsg.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: profileMsg.type === 'success' ? '#166534' : 'var(--fn-editor-coral-dark)',
                    border: `1.5px solid ${profileMsg.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}
                >
                  {profileMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              {/* Avatar Section with Live Preview */}
              <div className="account-avatar-card">
                <div className="account-avatar-preview">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName || username}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--fn-editor-coral-dark)' }}>
                      {(displayName || username || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, width: '100%' }}>
                  <ImageUploadPicker
                    label="Profile Avatar Picture"
                    value={avatarUrl}
                    onChange={(url) => setAvatarUrl(url)}
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: 'var(--fn-editor-ink)' }}>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Nas, Alex Rivers"
                  className="editor-text-input full-width"
                  style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)' }}
                />
              </div>

              {/* Username Handle */}
              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: 'var(--fn-editor-ink)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>Username Handle</span>
                  <span style={{ color: 'var(--fn-editor-muted)', fontSize: '0.71rem', fontWeight: 400 }}>
                    Your link: profilenc.my.id/@{username || 'yourname'}
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fn-editor-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourname"
                    className="editor-text-input full-width"
                    style={{
                      paddingLeft: '28px',
                      color: 'var(--fn-editor-ink)',
                      background: 'var(--fn-editor-paper-light)',
                      border: '2px solid',
                      borderColor:
                        usernameStatus.state === 'available'
                          ? '#16a34a'
                          : usernameStatus.state === 'taken' || usernameStatus.state === 'invalid'
                          ? 'var(--fn-editor-coral-dark)'
                          : 'var(--fn-editor-line)',
                    }}
                  />
                </div>
                {usernameStatus.msg && (
                  <div
                    style={{
                      marginTop: '5px',
                      fontSize: '0.73rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color:
                        usernameStatus.state === 'available'
                          ? '#16a34a'
                          : usernameStatus.state === 'checking'
                          ? 'var(--fn-editor-muted)'
                          : 'var(--fn-editor-coral-dark)',
                    }}
                  >
                    {usernameStatus.state === 'available' && <Check size={12} />}
                    {usernameStatus.state === 'checking' && <Loader2 size={12} className="spin" />}
                    {(usernameStatus.state === 'taken' || usernameStatus.state === 'invalid') && <AlertCircle size={12} />}
                    <span>{usernameStatus.msg}</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: 'var(--fn-editor-ink)' }}>Bio / Headline</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell visitors about yourself, your craft, and what you build..."
                  className="editor-text-input full-width"
                  style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)' }}
                  rows={3}
                />
              </div>

              {/* Public / Private Switch */}
              <div className="account-toggle-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} color={isPublic ? 'var(--fn-editor-coral-dark)' : 'var(--fn-editor-muted)'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fn-editor-ink)' }}>
                      {isPublic ? 'Public Profile' : 'Private Profile'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--fn-editor-muted)' }}>
                    {isPublic
                      ? 'Your profile is accessible to the world and featured in creator showcase'
                      : 'Only you can view your profile when logged in'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className="account-toggle-card-btn"
                  style={{
                    padding: '5px 14px',
                    borderRadius: '9999px',
                    background: isPublic ? 'var(--fn-editor-coral)' : 'var(--fn-editor-paper)',
                    color: 'var(--fn-editor-ink)',
                    border: `2px solid ${isPublic ? 'var(--fn-editor-ink)' : 'var(--fn-editor-line)'}`,
                    boxShadow: isPublic ? 'var(--fn-editor-shadow-xs)' : 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isPublic ? 'Public' : 'Private'}
                </button>
              </div>
            </form>
          )}

          {/* --- TAB 2: SECURITY & PASSWORD --- */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {passwordMsg.text && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: passwordMsg.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: passwordMsg.type === 'success' ? '#166534' : 'var(--fn-editor-coral-dark)',
                    border: `1.5px solid ${passwordMsg.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}
                >
                  {passwordMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: 'var(--fn-editor-ink)' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="editor-text-input full-width"
                    style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)', paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--fn-editor-muted)', cursor: 'pointer' }}
                  >
                    {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: 'var(--fn-editor-ink)' }}>New Password (Min 6 characters)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="editor-text-input full-width"
                    style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)', paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--fn-editor-muted)', cursor: 'pointer' }}
                  >
                    {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: 'var(--fn-editor-ink)' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="editor-text-input full-width"
                  style={{ color: 'var(--fn-editor-ink)', background: 'var(--fn-editor-paper-light)', border: '2px solid var(--fn-editor-line)' }}
                />
              </div>
            </form>
          )}

          {/* --- TAB 3: SESSION & LOGOUT --- */}
          {activeTab === 'session' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Account Overview Card */}
              <div style={{ padding: '16px', background: 'var(--fn-editor-paper-light)', borderRadius: '12px', border: '2px solid var(--fn-editor-line)', boxShadow: 'var(--fn-editor-shadow-xs)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--fn-editor-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Account Overview
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--fn-editor-muted)' }}>Email:</span>
                  <span style={{ color: 'var(--fn-editor-ink)', fontWeight: 600 }}>{user?.email || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--fn-editor-muted)' }}>Username:</span>
                  <span style={{ color: 'var(--fn-editor-coral-dark)', fontWeight: 700 }}>@{user?.username}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--fn-editor-muted)' }}>Account Type:</span>
                  <span style={{ color: 'var(--fn-editor-ink)', fontWeight: 600 }}>{user?.isAdmin ? 'Administrator' : 'Standard Creator'}</span>
                </div>
              </div>

              {/* Logout Box */}
              <div style={{ padding: '16px', background: 'var(--fn-editor-paper-light)', borderRadius: '12px', border: '2px solid var(--fn-editor-line)', boxShadow: 'var(--fn-editor-shadow-xs)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--fn-editor-coral-dark)' }}>
                    Sign Out of Your Account
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--fn-editor-muted)' }}>
                    Logging out will clear your session on this browser.
                  </p>
                </div>

                {showLogoutConfirm ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'var(--fn-editor-coral-dark)',
                        color: '#fffaf0',
                        border: '2px solid var(--fn-editor-ink)',
                        boxShadow: 'var(--fn-editor-shadow-xs)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <LogOut size={14} />
                      <span>Confirm Logout</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="editor-btn editor-btn-ghost"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'var(--fn-editor-paper-light)',
                      color: 'var(--fn-editor-coral-dark)',
                      border: '2px solid var(--fn-editor-line)',
                      boxShadow: 'var(--fn-editor-shadow-xs)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>

              {/* More Options Expandable Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreOptions(!showMoreOptions);
                    if (showMoreOptions) {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmUsername('');
                      setDeleteError('');
                    }
                  }}
                  style={{
                    background: 'var(--fn-editor-paper-light)',
                    border: '2px solid var(--fn-editor-line)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--fn-editor-ink)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={14} color="var(--fn-editor-muted)" />
                    <span>{showMoreOptions ? 'Hide Advanced Options' : 'Show More Options'}</span>
                  </div>
                  {showMoreOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showMoreOptions && (
                  /* Danger Zone: Permanent Delete Account Card */
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(239, 68, 68, 0.05)',
                      borderRadius: '12px',
                      border: '2px solid rgba(239, 68, 68, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trash2 size={16} color="var(--fn-editor-coral-dark)" />
                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--fn-editor-coral-dark)' }}>
                          Delete Account Permanently
                        </h4>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: 'var(--fn-editor-muted)', lineHeight: '1.4' }}>
                        Permanently deletes your account (<strong style={{ color: 'var(--fn-editor-ink)' }}>@{user?.username}</strong>), public profile, pages, blocks, and uploaded media. This action is irreversible.
                      </p>
                    </div>

                    {deleteError && (
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: 'var(--fn-editor-coral-dark)',
                          border: '1.5px solid rgba(239, 68, 68, 0.3)',
                        }}
                      >
                        <AlertCircle size={14} />
                        <span>{deleteError}</span>
                      </div>
                    )}

                    {showDeleteConfirm ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--fn-editor-paper)', border: '2px solid var(--fn-editor-line)' }}>
                          <label style={{ fontSize: '0.75rem', color: 'var(--fn-editor-coral-dark)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                            To confirm deletion, please re-type your username <strong style={{ color: 'var(--fn-editor-ink)' }}>{user?.username}</strong> below:
                          </label>
                          <input
                            type="text"
                            value={deleteConfirmUsername}
                            onChange={(e) => {
                              setDeleteConfirmUsername(e.target.value);
                              setDeleteError('');
                            }}
                            placeholder={user?.username}
                            className="editor-text-input full-width"
                            style={{
                              color: 'var(--fn-editor-ink)',
                              background: 'var(--fn-editor-paper-light)',
                              borderColor: deleteConfirmUsername.trim().toLowerCase() === user?.username?.toLowerCase() ? 'var(--fn-editor-coral-dark)' : 'var(--fn-editor-line)',
                              fontSize: '0.82rem',
                              padding: '8px 12px',
                            }}
                            autoFocus
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount || deleteConfirmUsername.trim().toLowerCase() !== user?.username?.toLowerCase()}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              background: deleteConfirmUsername.trim().toLowerCase() === user?.username?.toLowerCase() ? 'var(--fn-editor-coral-dark)' : 'var(--fn-editor-line)',
                              color: '#fffaf0',
                              border: '2px solid var(--fn-editor-ink)',
                              boxShadow: 'var(--fn-editor-shadow-xs)',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: deleteConfirmUsername.trim().toLowerCase() === user?.username?.toLowerCase() ? 'pointer' : 'not-allowed',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              opacity: deleteConfirmUsername.trim().toLowerCase() === user?.username?.toLowerCase() ? 1 : 0.6,
                            }}
                          >
                            {deletingAccount ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
                            <span>{deletingAccount ? 'Deleting Account...' : 'Permanently Delete My Account'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteConfirmUsername('');
                              setDeleteError('');
                            }}
                            className="editor-btn editor-btn-ghost"
                            style={{ fontSize: '0.8rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.08)',
                          color: 'var(--fn-editor-coral-dark)',
                          border: '2px solid rgba(239, 68, 68, 0.3)',
                          boxShadow: 'var(--fn-editor-shadow-xs)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Delete Account...</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Attached Modal Footer Dock (Always visible & fixed at the bottom of the card) */}
        <motion.div layout="position" className="account-modal-footer">
          {/* Status Pill on the Left (Only appears when unsaved or saving) */}
          {activeTab === 'profile' && (isProfileDirty || savingProfile) ? (
            <div className={`editor-save-status-pill ${savingProfile ? 'is-saving' : 'is-dirty'}`}>
              {savingProfile ? (
                <>
                  <span className="editor-status-dot pulse-saving" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <span className="editor-status-dot pulse-dirty" />
                  <span>Unsaved Changes</span>
                </>
              )}
            </div>
          ) : activeTab === 'security' && (isSecurityDirty || savingPassword) ? (
            <div className={`editor-save-status-pill ${savingPassword ? 'is-saving' : 'is-dirty'}`}>
              {savingPassword ? (
                <>
                  <span className="editor-status-dot pulse-saving" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span className="editor-status-dot pulse-dirty" />
                  <span>Unsaved Password</span>
                </>
              )}
            </div>
          ) : (
            <div />
          )}

          {/* Action Buttons on the Right */}
          <div className="account-modal-footer-actions">
            {activeTab === 'profile' && (
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={!isProfileDirty || savingProfile}
                className={`editor-btn editor-btn-save ${isProfileDirty ? 'active-dirty' : 'muted'}`}
                style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                title={isProfileDirty ? 'Save profile details' : 'No unsaved changes (Saved)'}
              >
                {savingProfile ? (
                  <>
                    <Loader2 size={15} className="spin" />
                    <span>Saving...</span>
                  </>
                ) : isProfileDirty ? (
                  <>
                    <Save size={15} />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Check size={15} color="#16a34a" />
                    <span>Saved</span>
                  </>
                )}
              </button>
            )}

            {activeTab === 'security' && (
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={!isSecurityDirty || savingPassword}
                className={`editor-btn editor-btn-save ${isSecurityDirty ? 'active-dirty' : 'muted'}`}
                style={{ padding: '8px 18px', fontSize: '0.84rem' }}
              >
                {savingPassword ? (
                  <>
                    <Loader2 size={15} className="spin" />
                    <span>Updating...</span>
                  </>
                ) : isSecurityDirty ? (
                  <>
                    <Shield size={15} />
                    <span>Update Password</span>
                  </>
                ) : (
                  <>
                    <Check size={15} color="#16a34a" />
                    <span>Saved</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="editor-btn editor-btn-ghost"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              Close
            </button>
          </div>
        </motion.div>
    </EditorModal>
  );
}
