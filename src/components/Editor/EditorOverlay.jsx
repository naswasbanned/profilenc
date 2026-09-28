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
  Search,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemePanel from './panels/ThemePanel';
import BlockEditorModal from './BlockEditorModal';
import AddBlockModal from './AddBlockModal';
import TabManagerModal from './TabManagerModal';
import AccountSettingsModal from './AccountSettingsModal';
import EditorSearchPalette from './EditorSearchPalette';
import EditorModal from '../primitives/EditorModal';
import { useSyncedUiTheme } from '../../hooks/useUiTheme';
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
  const [themePanelInitial, setThemePanelInitial] = useState(null);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showTabManager, setShowTabManager] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [accountSettingsTab, setAccountSettingsTab] = useState('profile');
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSearchPalette, setShowSearchPalette] = useState(false);
  const [dismissedToast, setDismissedToast] = useState(false);
  const [saving, setSaving] = useState(false);

  // Universal Dark/Light Theme State synchronized with Landing Page & entire app
  const { theme: editorTheme, toggleTheme: toggleEditorTheme } = useSyncedUiTheme({
    value: propEditorTheme,
    onChange: propSetEditorTheme,
  });

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

  // Ctrl+K / Cmd+K to open search palette, Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchPalette((v) => !v);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  // Dispatch an action from the search palette
  const handleSearchAction = useCallback((action) => {
    switch (action.type) {
      case 'callback':
        if (action.key === 'save') handleSave();
        else if (action.key === 'undo') onUndo?.();
        else if (action.key === 'redo') onRedo?.();
        else if (action.key === 'preview') window.open(`/@${username}`, '_blank');
        else if (action.key === 'exit') handleExit();
        else if (action.key === 'toggleEditorTheme') toggleEditorTheme?.();
        break;
      case 'open-theme':
        setThemePanelInitial(action.section ? { section: action.section, field: action.field || null } : null);
        setShowThemeDrawer(true);
        break;
      case 'open-add-block':
        setShowAddBlockModal(true);
        break;
      case 'open-tab-manager':
        setShowTabManager(true);
        break;
      case 'open-account-settings':
        if (action.tab) setAccountSettingsTab(action.tab);
        setShowAccountSettings(true);
        break;
      case 'open-block-editor': {
        const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
        const block = (currentTab?.blocks || []).find((b) => b.id === action.blockId);
        if (block) setEditingBlock(block);
        break;
      }
      default:
        break;
    }
  }, [handleSave, onUndo, onRedo, username, handleExit, toggleEditorTheme, tabs, activeTabId, setEditingBlock]);

  // Collect user blocks from the active tab for the search palette
  const activeBlocks = (() => {
    const tab = tabs.find((t) => t.id === activeTabId) || tabs[0];
    return (tab?.blocks || []).map((b) => ({ id: b.id, type: b.type, title: b.title || b.type }));
  })();

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
            onClick={() => setShowSearchPalette(true)}
            title="Search editor (Ctrl+K)"
          >
            <Search size={15} />
            <span>Search</span>
          </button>

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

      {/* Search Command Palette */}
      <EditorSearchPalette
        isOpen={showSearchPalette}
        onClose={() => setShowSearchPalette(false)}
        onAction={handleSearchAction}
        userBlocks={activeBlocks}
        editorTheme={editorTheme}
      />

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
            onAnimationComplete={() => {
              // Clear the initial section after theme panel has opened
              // so subsequent opens don't re-scroll
            }}
          >
            <div className="editor-panel-header">
              <h3>Theme & Colors</h3>
              <button
                type="button"
                className="editor-panel-collapse"
                onClick={() => { setShowThemeDrawer(false); setThemePanelInitial(null); }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="editor-panel-body">
              <ThemePanel tabs={tabs} initialSection={themePanelInitial?.section} scrollToField={themePanelInitial?.field} />
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
            activeTabId={activeTabId}
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
            initialTab={accountSettingsTab}
            onClose={() => { setShowAccountSettings(false); setAccountSettingsTab('profile'); }}
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
          <EditorModal
            onClose={() => setShowExitModal(false)}
            editorTheme={editorTheme}
            size="modal-sm"
            dialogStyle={{ maxWidth: '480px' }}
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
          </EditorModal>
        )}
      </AnimatePresence>
    </>
  );
}
