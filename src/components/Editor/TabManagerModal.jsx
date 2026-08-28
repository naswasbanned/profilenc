import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, Save, Eye, EyeOff } from 'lucide-react';

export default function TabManagerModal({ tabs = [], onSaveTabs, onClose }) {
  const [tabList, setTabList] = useState(() => JSON.parse(JSON.stringify(tabs || [])));

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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 900,
        background: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--color-surface-raised, #12151e)',
          border: '1px solid var(--color-border-normal, rgba(255,255,255,0.08))',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: 'var(--shadow-xl, 0 24px 64px rgba(0,0,0,0.8))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
              Manage Tabs
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              Rename, change tab icon / logo, or reorder profile navigation tabs
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
          <Reorder.Group axis="y" values={tabList} onReorder={setTabList} style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tabList.map((tab) => (
              <Reorder.Item
                key={tab.id}
                value={tab}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr 140px auto auto',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm, 8px)',
                  background: 'var(--color-surface-sunken, rgba(255,255,255,0.02))',
                  border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))',
                  opacity: tab.enabled === false ? 0.4 : 1,
                  cursor: 'grab',
                }}
              >
                <GripVertical size={16} color="#666" style={{ flexShrink: 0 }} />
                
                <input
                  type="text"
                  value={tab.label}
                  onChange={(e) => handleRename(tab.id, e.target.value)}
                  className="editor-text-input"
                  placeholder="Tab Label"
                  style={{ width: '100%' }}
                />

                <select
                  value={tab.icon !== undefined ? tab.icon : 'Folder'}
                  onChange={(e) => handleIconChange(tab.id, e.target.value)}
                  className="editor-select"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '7px 10px' }}
                  title="Tab Icon / Logo"
                >
                  <option value="none">No Logo (Text Only)</option>
                  <option value="Folder">Folder 📁</option>
                  <option value="Code2">Code 💻</option>
                  <option value="Briefcase">Briefcase 💼</option>
                  <option value="Layers">Layers 🗂️</option>
                  <option value="Cpu">CPU / Gear ⚙️</option>
                  <option value="Gamepad2">Gaming 🎮</option>
                  <option value="BookOpen">Journal 📖</option>
                  <option value="Sparkles">Sparkles ✨</option>
                  <option value="Star">Star ⭐</option>
                  <option value="User">Profile 👤</option>
                  <option value="Film">Film 🎬</option>
                  <option value="Music">Music 🎵</option>
                  <option value="Heart">Heart ❤️</option>
                  <option value="Terminal">Terminal &gt;_</option>
                  <option value="Globe">Globe 🌐</option>
                  <option value="Activity">Activity 📊</option>
                  <option value="Coffee">Coffee ☕</option>
                  <option value="Shield">Shield 🛡️</option>
                  <option value="Flame">Flame 🔥</option>
                  <option value="Rocket">Rocket 🚀</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleToggle(tab.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted, #888)', cursor: 'pointer', padding: '4px' }}
                  title={tab.enabled === false ? 'Show tab' : 'Hide tab'}
                >
                  {tab.enabled === false ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRemoveTab(tab.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-danger, #ef4444)', cursor: 'pointer', padding: '4px' }}
                  title="Delete tab"
                >
                  <Trash2 size={16} />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <button
            type="button"
            onClick={handleAddTab}
            className="editor-btn"
            style={{
              background: 'var(--color-accent-dim)',
              color: 'var(--color-accent-primary)',
              border: '1px dashed var(--color-border-strong)',
              width: '100%',
              justifyContent: 'center',
              padding: '10px 14px',
            }}
          >
            <Plus size={16} /> Add Custom Tab
          </button>
        </div>

        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button type="button" onClick={onClose} className="editor-btn editor-btn-ghost">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="editor-btn editor-btn-save">
            <Save size={15} /> Apply Tabs
          </button>
        </div>
      </motion.div>
    </div>
  );
}
