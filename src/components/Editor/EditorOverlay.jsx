import { useState, useCallback } from 'react';
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
  const [saving, setSaving] = useState(false);

  const isDirty = hasChanges || isThemeDirty;

  const handleSave = useCallback(async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    try {
      await onSaveAll();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  }, [onSaveAll, isDirty, saving]);

  const handleExit = () => {
    navigate(`/@${username}`);
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
    </>
  );
}
