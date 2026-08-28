import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import ImageUploadPicker from './ImageUploadPicker';

export default function AccountSettingsModal({ onClose, onUsernameChanged }) {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, logout, checkUsername } = useAuth();

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
    if (savingProfile) return;

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

  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(onClose);

  return (
    <div className="editor-modal-backdrop" onClick={handleBackdropClick}>
      {hintVisible && (
        <div className="modal-double-click-hint">
          <span>Click once more outside to close (or use ✕)</span>
        </div>
      )}
      <motion.div
        className="editor-modal-dialog"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', width: '92vw' }}
      >
        {/* Header */}
        <div className="editor-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '7px', borderRadius: '8px', background: 'rgba(0, 240, 170, 0.12)', color: '#00f0aa' }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                Account & Profile Settings
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Modify your public profile identity, credentials, and visibility
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#090b12',
            padding: '0 16px',
            gap: '8px',
          }}
        >
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #00f0aa' : '2px solid transparent',
                  color: isActive ? '#00f0aa' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="editor-modal-body" style={{ padding: '20px', maxHeight: '68vh', overflowY: 'auto' }}>
          {/* --- TAB 1: PROFILE DETAILS --- */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {profileMsg.text && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: profileMsg.type === 'success' ? 'rgba(0, 240, 170, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                    color: profileMsg.type === 'success' ? '#00f0aa' : '#ef4444',
                    border: `1px solid ${profileMsg.type === 'success' ? 'rgba(0, 240, 170, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}
                >
                  {profileMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              {/* Avatar Section with Live Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#06070a', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', background: '#12151e', border: '2px solid #00f0aa', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName || username}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00f0aa' }}>
                      {(displayName || username || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <ImageUploadPicker
                    label="Profile Avatar Picture"
                    value={avatarUrl}
                    onChange={(url) => setAvatarUrl(url)}
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: '#e2e8f0' }}>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Nas, Alex Rivers"
                  className="editor-text-input full-width"
                  style={{ color: '#f1f5f9', background: '#06070a' }}
                />
              </div>

              {/* Username Handle */}
              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: '#e2e8f0' }}>
                  Username Handle <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>(Your personal link: gnc.web.id/@{username || 'yourname'})</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
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
                      color: '#f1f5f9',
                      background: '#06070a',
                      borderColor:
                        usernameStatus.state === 'available'
                          ? '#00f0aa'
                          : usernameStatus.state === 'taken' || usernameStatus.state === 'invalid'
                          ? '#ef4444'
                          : 'rgba(255,255,255,0.12)',
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
                          ? '#00f0aa'
                          : usernameStatus.state === 'checking'
                          ? '#94a3b8'
                          : '#ef4444',
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
                <label style={{ color: '#e2e8f0' }}>Bio / Headline</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell visitors about yourself, your craft, and what you build..."
                  className="editor-text-input full-width"
                  style={{ color: '#f1f5f9', background: '#06070a' }}
                  rows={3}
                />
              </div>

              {/* Public / Private Switch */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#06070a',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} color={isPublic ? '#00f0aa' : '#94a3b8'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {isPublic ? 'Public Profile' : 'Private Profile'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {isPublic
                      ? 'Your profile is accessible to the world and featured in creator showcase'
                      : 'Only you can view your profile when logged in'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    background: isPublic ? 'rgba(0, 240, 170, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: isPublic ? '#00f0aa' : '#94a3b8',
                    border: `1px solid ${isPublic ? '#00f0aa' : 'rgba(255, 255, 255, 0.15)'}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isPublic ? 'Public' : 'Private'}
                </button>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="editor-btn editor-btn-save active-dirty"
                style={{ padding: '10px 18px', fontSize: '0.85rem', alignSelf: 'flex-start' }}
              >
                {savingProfile ? (
                  <>
                    <Loader2 size={15} className="spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Profile Details</span>
                  </>
                )}
              </button>
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
                    background: passwordMsg.type === 'success' ? 'rgba(0, 240, 170, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                    color: passwordMsg.type === 'success' ? '#00f0aa' : '#ef4444',
                    border: `1px solid ${passwordMsg.type === 'success' ? 'rgba(0, 240, 170, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}
                >
                  {passwordMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: '#e2e8f0' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="editor-text-input full-width"
                    style={{ color: '#f1f5f9', background: '#06070a', paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: '#e2e8f0' }}>New Password (Min 6 characters)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="editor-text-input full-width"
                    style={{ color: '#f1f5f9', background: '#06070a', paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="editor-control" style={{ margin: 0 }}>
                <label style={{ color: '#e2e8f0' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="editor-text-input full-width"
                  style={{ color: '#f1f5f9', background: '#06070a' }}
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="editor-btn editor-btn-save active-dirty"
                style={{ padding: '10px 18px', fontSize: '0.85rem', alignSelf: 'flex-start' }}
              >
                {savingPassword ? (
                  <>
                    <Loader2 size={15} className="spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Shield size={15} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* --- TAB 3: SESSION & LOGOUT --- */}
          {activeTab === 'session' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '16px', background: '#06070a', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Account Overview
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: '#94a3b8' }}>Email:</span>
                  <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{user?.email || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: '#94a3b8' }}>Username:</span>
                  <span style={{ color: '#00f0aa', fontWeight: 600 }}>@{user?.username}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: '#94a3b8' }}>Account Type:</span>
                  <span style={{ color: '#f1f5f9' }}>{user?.isAdmin ? 'Administrator' : 'Standard Creator'}</span>
                </div>
              </div>

              {/* Logout Box */}
              <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.06)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#ef4444' }}>
                    Sign Out of Your Account
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                    Logging out will clear your session on this browser. Any unsaved edits in the editor should be saved first.
                  </p>
                </div>

                {showLogoutConfirm ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        background: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
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
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      fontWeight: 600,
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
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
