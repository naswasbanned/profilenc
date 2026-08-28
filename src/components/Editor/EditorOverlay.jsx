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
  FolderKanban,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemePanel from './panels/ThemePanel';
import BlockEditorModal from './BlockEditorModal';
import AddBlockModal from './AddBlockModal';
import TabManagerModal from './TabManagerModal';
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
  onSaveAll,
  editingBlock,
  setEditingBlock,
}) {
  const navigate = useNavigate();
  const { theme, isDirty: isThemeDirty, resetTheme } = useTheme();

  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showTabManager, setShowTabManager] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [dismissedToast, setDismissedToast] = useState(false);
  const [saving, setSaving] = useState(false);

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
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="editor-toolbar-left">
          <span className="editor-label">
            <Palette size={16} /> Visual Editor
          </span>
          <span className="editor-editing-tag">@{username}</span>
        </div>

        {/* Center Quick Actions */}
        <div className="editor-toolbar-center">
          <button
            type="button"
            className="editor-tab active"
            onClick={() => setShowAddBlockModal(true)}
            style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-primary)' }}
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
          {isDirty && (
            <button className="editor-btn editor-btn-ghost" onClick={resetTheme} title="Reset theme changes">
              <Undo2 size={16} />
            </button>
          )}

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
                <Check size={14} color="#00f0aa" />
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
        </div>
      </motion.div>

      {/* Theme Drawer (Right Sliding Panel) */}
      <AnimatePresence>
        {showThemeDrawer && (
          <motion.div
            className="editor-panel"
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
            onSave={(updatedBlock) => onEditBlock(updatedBlock)}
            onClose={() => setEditingBlock(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddBlockModal && (
          <AddBlockModal
            onAddBlock={(newBlock) => onAddBlock(newBlock)}
            onClose={() => setShowAddBlockModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTabManager && (
          <TabManagerModal
            tabs={tabs}
            onSaveTabs={(newTabs) => onUpdateTabs(newTabs)}
            onClose={() => setShowTabManager(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Unsaved Changes Notification Toast (Top Right) */}
      <AnimatePresence>
        {isDirty && !dismissedToast && (
          <motion.div
            className="editor-unsaved-banner"
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
          <div className="editor-modal-backdrop" onClick={() => setShowExitModal(false)}>
            <motion.div
              className="editor-modal-dialog modal-sm"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '480px' }}
            >
              <div className="editor-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Unsaved Changes</h3>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>You have unsaved edits on your profile</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExitModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="editor-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
                  You have made changes that haven't been saved yet. If you exit now, your recent edits will be lost.
                </p>
              </div>

              <div className="editor-modal-footer" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/@${username}`)}
                  className="editor-btn editor-btn-close"
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  Discard & Exit
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowExitModal(false)}
                    className="editor-btn editor-btn-ghost"
                    style={{ fontSize: '0.78rem', padding: '8px 14px' }}
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
                    style={{ fontSize: '0.78rem', padding: '8px 16px' }}
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
