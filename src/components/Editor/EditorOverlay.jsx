import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Eye,
  Palette,
  Layout,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  Undo2,
  Redo2,
  FolderKanban,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemePanel from './panels/ThemePanel';
import BlockEditorModal from './BlockEditorModal';
import AddBlockModal from './AddBlockModal';
import TabManagerModal from './TabManagerModal';
import AccountSettingsModal from './AccountSettingsModal';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import './Editor.css';

export default function EditorOverlay({
  username,
  tabs = [],
  activeTabId,
  hasChanges = false,
  onSelectTab,
  onUpdateTabs,
  onAddBlock,
  onEditBlock,
  onMoveBlock,
  onDeleteBlock,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onSaveAll,
  editingBlock,
  setEditingBlock,
  editorTheme: propEditorTheme,
  setEditorTheme: propSetEditorTheme,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, isDirty: isThemeDirty, resetTheme } = useTheme();

  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showTabManager, setShowTabManager] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [dismissedToast, setDismissedToast] = useState(false);
  const [saving, setSaving] = useState(false);

  // Universal Dark/Light Theme State synchronized with Landing Page & entire app
  const [localEditorTheme, setLocalEditorTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profilenc_theme');
      if (saved) return saved;
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      if (htmlTheme) return htmlTheme;
    }
    return 'dark';
  });

  const editorTheme = propEditorTheme || localEditorTheme;

  // Keep documentElement data-theme and universal storage in sync
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', editorTheme);
    }
  }, [editorTheme]);

  // Real-time synchronization if changed in another window/tab
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'profilenc_theme' && e.newValue && (e.newValue === 'dark' || e.newValue === 'light')) {
        if (propSetEditorTheme) {
          propSetEditorTheme(e.newValue);
        } else {
          setLocalEditorTheme(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [propSetEditorTheme]);

  const toggleEditorTheme = useCallback(() => {
    const next = editorTheme === 'dark' ? 'light' : 'dark';
    if (propSetEditorTheme) {
      propSetEditorTheme(next);
    } else {
      setLocalEditorTheme(next);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('profilenc_theme', next);
      document.documentElement.setAttribute('data-theme', next);
    }
  }, [editorTheme, propSetEditorTheme]);

  const { handleBackdropClick: handleExitBackdropClick, hintVisible: exitHintVisible } = useDoubleBackdropClose(
    () => setShowExitModal(false)
  );

  const isDirty = hasChanges;

  // Whenever user makes new unsaved edits, un-dismiss the reminder toast
  useEffect(() => {
    if (isDirty) {
      setDismissedToast(false);
    }
  }, [isDirty]);

  const handleSave = useCallback(async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await onSaveAll();
      setDismissedToast(true);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [onSaveAll, isDirty, saving]);

  const handleExit = () => {
    if (isDirty) {
      setShowExitModal(true);
    } else {
      navigate(`/@${username}`);
    }
  };

  return (
    <>
      {/* Fixed Editor Top Toolbar */}
      <motion.div
        className="editor-toolbar"
        data-editor-theme={editorTheme}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="editor-toolbar-left">
          <span className="editor-label">
            <span className="fn-logo-mark">
              <img src="/logo.svg" alt="Profilenc" />
            </span>
            <span>Profilenc</span>
          </span>
          <button
            type="button"
            onClick={() => setShowAccountSettings(true)}
            className="editor-user-profile-pill"
            title="Account & Profile Settings (Picture, Username, Password, Logout)"
          >
            <div className="editor-user-avatar-mini">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={username} />
              ) : (
                <span>{(user?.displayName || username || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <span className="editor-user-handle">@{username}</span>
            <Settings size={13} className="editor-user-gear" />
          </button>

          {/* Dedicated Editor UI Dark / Light Mode Toggle beside profile */}
          <button
            type="button"
            className="editor-theme-toggle-btn"
            onClick={toggleEditorTheme}
            title={editorTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={editorTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {editorTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Center Quick Actions */}
        <div className="editor-toolbar-center">
          <button
            type="button"
            className="editor-tab"
            onClick={() => setShowAddBlockModal(true)}
          >
            <Plus size={15} />
            <span>Add Block</span>
          </button>

          <button
            type="button"
            className="editor-tab"
            onClick={() => setShowTabManager(true)}
          >
            <FolderKanban size={15} />
            <span>Manage Tabs</span>
          </button>

          <button
            type="button"
            className={`editor-tab ${showThemeDrawer ? 'active' : ''}`}
            onClick={() => setShowThemeDrawer(!showThemeDrawer)}
          >
            <Palette size={15} />
            <span>Theme & Colors</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="editor-toolbar-right">
          <button
            type="button"
            className="editor-btn editor-btn-ghost"
            onClick={onUndo}
            disabled={!canUndo}
            title={canUndo ? 'Undo change (Ctrl+Z)' : 'Nothing to undo'}
            style={{
              opacity: canUndo ? 1 : 0.4,
              cursor: canUndo ? 'pointer' : 'not-allowed',
            }}
          >
            <Undo2 size={16} />
          </button>

          <button
            type="button"
            className="editor-btn editor-btn-ghost"
            onClick={onRedo}
            disabled={!canRedo}
            title={canRedo ? 'Redo change (Ctrl+Y)' : 'Nothing to redo'}
            style={{
              opacity: canRedo ? 1 : 0.4,
              cursor: canRedo ? 'pointer' : 'not-allowed',
            }}
          >
            <Redo2 size={16} />
          </button>

          <button
            type="button"
            className="editor-btn editor-btn-ghost"
            onClick={() => window.open(`/@${username}`, '_blank')}
            title="Preview public profile"
          >
            <Eye size={16} />
          </button>

          <button
            type="button"
            className={`editor-btn editor-btn-save ${isDirty ? 'active-dirty' : 'muted'} ${saving ? 'is-saving' : ''}`}
            onClick={handleSave}
            disabled={!isDirty || saving}
            title={isDirty ? 'Save changes to live profile' : 'No unsaved changes (Saved)'}
          >
            {saving ? (
              <>
                <Loader2 size={15} className="spin" />
                <span>Saving...</span>
              </>
            ) : isDirty ? (
              <>
                <Save size={15} />
                <span>Save</span>
              </>
            ) : (
              <>
                <Check size={14} color="var(--fn-editor-mint)" />
                <span>Saved</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="editor-btn editor-btn-close"
            onClick={handleExit}
            title="Exit editor"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>

      {/* Mobile Floating Action Dock (Always visible & accessible on phone) */}
      <motion.div
        className="editor-mobile-dock-wrap"
        data-editor-theme={editorTheme}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="editor-mobile-dock">
          <button
            type="button"
            className="editor-mobile-btn primary"
            onClick={() => setShowAddBlockModal(true)}
          >
            <Plus size={16} />
            <span>Add Block</span>
          </button>

          <button
            type="button"
            className="editor-mobile-btn"
            onClick={() => setShowTabManager(true)}
          >
            <FolderKanban size={15} />
            <span>Tabs</span>
          </button>

          <button
            type="button"
            className={`editor-mobile-btn ${showThemeDrawer ? 'active' : ''}`}
            onClick={() => setShowThemeDrawer(!showThemeDrawer)}
          >
            <Palette size={15} />
            <span>Theme</span>
          </button>

          <button
            type="button"
            className={`editor-mobile-btn ${showAccountSettings ? 'active' : ''}`}
            onClick={() => setShowAccountSettings(true)}
          >
            <Settings size={15} />
            <span>Profile</span>
          </button>
        </div>
      </motion.div>

      {/* Theme Drawer (Right Sliding Panel) */}
      <AnimatePresence>
        {showThemeDrawer && (
          <motion.div
            className="editor-panel"
            data-editor-theme={editorTheme}
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="editor-panel-header">
              <h3>Theme & Colors</h3>
              <button
                type="button"
                className="editor-panel-collapse"
                onClick={() => setShowThemeDrawer(false)}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="editor-panel-body">
              <ThemePanel tabs={tabs} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Form Modals (Zero JSON!) */}
      <AnimatePresence>
        {editingBlock && (
          <BlockEditorModal
            block={editingBlock}
            editorTheme={editorTheme}
            onSave={(updatedBlock) => onEditBlock(updatedBlock)}
            onClose={() => setEditingBlock(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddBlockModal && (
          <AddBlockModal
            editorTheme={editorTheme}
            onAddBlock={(newBlock) => onAddBlock(newBlock)}
            onClose={() => setShowAddBlockModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTabManager && (
          <TabManagerModal
            editorTheme={editorTheme}
            tabs={tabs}
            onSaveTabs={(newTabs) => onUpdateTabs(newTabs)}
            onClose={() => setShowTabManager(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccountSettings && (
          <AccountSettingsModal
            editorTheme={editorTheme}
            onClose={() => setShowAccountSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Unsaved Changes Notification Toast (Top Right) */}
      <AnimatePresence>
        {isDirty && !dismissedToast && (
          <motion.div
            className="editor-unsaved-banner"
            data-editor-theme={editorTheme}
            initial={{ y: -15, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -15, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="editor-unsaved-banner-content">
              <div className="editor-unsaved-indicator" />
              <div className="editor-unsaved-text">
                <strong>Unsaved changes</strong>
                <span>Click Save above to publish</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDismissedToast(true)}
              className="editor-unsaved-dismiss"
              title="Dismiss reminder"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Exit Confirmation Guard Modal */}
      <AnimatePresence>
        {showExitModal && (
          <div className="editor-modal-backdrop" data-editor-theme={editorTheme} onClick={handleExitBackdropClick}>
            {exitHintVisible && (
              <div className="modal-double-click-hint">
                <span>Click once more outside to close (or use ✕)</span>
              </div>
            )}
            <motion.div
              className="editor-modal-dialog modal-sm"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '480px' }}
            >
              <div className="editor-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', borderRadius: '50%', background: 'var(--fn-editor-butter)', color: 'var(--fn-editor-ink)', border: '2px solid var(--fn-editor-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h3>Unsaved Changes</h3>
                    <span>You have unsaved edits on your profile</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExitModal(false)}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="editor-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                  You have made changes that haven't been saved yet. If you exit now, your recent edits will be lost.
                </p>
              </div>

              <div className="editor-modal-footer" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/@${username}`)}
                  className="editor-btn editor-btn-ghost"
                  style={{ color: 'var(--fn-editor-coral-dark)' }}
                >
                  Discard & Exit
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowExitModal(false)}
                    className="editor-btn editor-btn-ghost"
                  >
                    Keep Editing
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setSaving(true);
                      try {
                        await onSaveAll();
                        navigate(`/@${username}`);
                      } catch (err) {
                        console.error('Save failed:', err);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="editor-btn editor-btn-save active-dirty"
                  >
                    {saving ? 'Saving...' : 'Save & Exit'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
