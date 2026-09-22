import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  EyeOff,
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
  Shield,
  Flame,
  Rocket,
} from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';

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
  Shield,
  Flame,
  Rocket,
};

function renderIconPreview(iconName) {
  if (!iconName || iconName === 'none') {
    return <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--fn-editor-muted)' }}>TXT</span>;
  }
  const IconComponent = TAB_ICON_MAP[iconName] || Folder;
  return <IconComponent size={16} />;
}

export default function TabManagerModal({ tabs = [], onSaveTabs, onClose, editorTheme = 'dark' }) {
  const [tabList, setTabList] = useState(() => JSON.parse(JSON.stringify(tabs || [])));
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(onClose);

  const handleAddTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab = {
      id: newId,
      label: 'New Tab',
      slug: `tab-${tabList.length + 1}`,
      icon: 'Folder',
      blocks: [],
      enabled: true,
    };
    setTabList([...tabList, newTab]);
  };

  const handleRemoveTab = (id) => {
    if (tabList.length <= 1) {
      alert('You must have at least one tab.');
      return;
    }
    setTabList(tabList.filter((t) => t.id !== id));
  };

  const handleRename = (id, newLabel) => {
    setTabList(
      tabList.map((t) =>
        t.id === id ? { ...t, label: newLabel, slug: newLabel.toLowerCase().replace(/[^a-z0-9-]/g, '-') } : t
      )
    );
  };

  const handleIconChange = (id, newIcon) => {
    setTabList(
      tabList.map((t) => (t.id === id ? { ...t, icon: newIcon } : t))
    );
  };

  const handleToggle = (id) => {
    setTabList(
      tabList.map((t) => (t.id === id ? { ...t, enabled: t.enabled === false ? true : false } : t))
    );
  };

  const handleSave = () => {
    onSaveTabs(tabList);
    onClose();
  };

  return (
    <div className="editor-modal-backdrop" data-editor-theme={editorTheme} onClick={handleBackdropClick}>
      {hintVisible && (
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
      >
        <div className="editor-modal-header">
          <div>
            <h3>Manage Tabs</h3>
            <p style={{ marginTop: '2px' }}>
              Rename, customize icons, or reorder profile navigation tabs
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="editor-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Reorder.Group axis="y" values={tabList} onReorder={setTabList} style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
            {tabList.map((tab) => (
              <Reorder.Item
                key={tab.id}
                value={tab}
                className={`tab-manager-row ${tab.enabled === false ? 'is-disabled' : ''}`}
              >
                <div className="tab-manager-main-row">
                  <div className="tab-manager-drag-handle" title="Drag to reorder">
                    <GripVertical size={16} />
                  </div>
                  
                  <input
                    type="text"
                    value={tab.label}
                    onChange={(e) => handleRename(tab.id, e.target.value)}
                    className="tab-manager-input"
                    placeholder="Tab Label"
                  />

                  <div className="tab-manager-actions">
                    <button
                      type="button"
                      onClick={() => handleToggle(tab.id)}
                      className={`tab-manager-action-btn ${tab.enabled === false ? 'is-off' : ''}`}
                      title={tab.enabled === false ? 'Show tab' : 'Hide tab'}
                    >
                      {tab.enabled === false ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveTab(tab.id)}
                      className="tab-manager-action-btn is-delete"
                      title="Delete tab"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="tab-manager-sub-row">
                  <div className="tab-manager-icon-picker">
                    <div className="tab-manager-icon-preview" title="Icon preview">
                      {renderIconPreview(tab.icon)}
                    </div>
                    <select
                      value={tab.icon !== undefined ? tab.icon : 'Folder'}
                      onChange={(e) => handleIconChange(tab.id, e.target.value)}
                      className="editor-select tab-manager-select"
                      title="Tab Icon / Logo"
                    >
                      <option value="none">No Logo (Text Only)</option>
                      <option value="Folder">Folder</option>
                      <option value="Code2">Code</option>
                      <option value="Briefcase">Briefcase</option>
                      <option value="Layers">Layers</option>
                      <option value="Cpu">CPU / Gear</option>
                      <option value="Gamepad2">Gaming</option>
                      <option value="BookOpen">Journal</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Star">Star</option>
                      <option value="User">Profile</option>
                      <option value="Film">Film</option>
                      <option value="Music">Music</option>
                      <option value="Heart">Heart</option>
                      <option value="Terminal">Terminal</option>
                      <option value="Globe">Globe</option>
                      <option value="Activity">Activity</option>
                      <option value="Coffee">Coffee</option>
                      <option value="Shield">Shield</option>
                      <option value="Flame">Flame</option>
                      <option value="Rocket">Rocket</option>
                    </select>
                  </div>

                  <div className="tab-manager-meta">
                    {tab.enabled === false && (
                      <span className="tab-manager-status-badge">Hidden</span>
                    )}
                    <span className="tab-manager-slug-badge">
                      #{tab.slug || tab.id}
                    </span>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <button
            type="button"
            onClick={handleAddTab}
            className="tab-manager-add-btn"
          >
            <Plus size={16} /> <span>Add Custom Tab</span>
          </button>
        </div>

        <div className="editor-modal-footer">
          <button type="button" onClick={onClose} className="editor-btn editor-btn-ghost">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="editor-btn editor-btn-save active-dirty">
            <Save size={16} /> <span>Save Tabs</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
