import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

const DEFAULT_SECTIONS = [
  { id: 'dev', label: 'Developer', icon: 'Code2', enabled: true },
  { id: 'hobbies', label: 'Hobbies', icon: 'Gamepad2', enabled: true },
  { id: 'diary', label: 'Diary', icon: 'BookHeart', enabled: true },
];

export default function SectionPanel({ config, onSave }) {
  const [sections, setSections] = useState(() => {
    if (config && config.length > 0) return config;
    return DEFAULT_SECTIONS;
  });
  const [saving, setSaving] = useState(false);

  const handleReorder = (newOrder) => {
    setSections(newOrder);
  };

  const toggleSection = (id) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const renameSection = (id, newLabel) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, label: newLabel } : s))
    );
  };

  const updateIcon = (id, newIcon) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, icon: newIcon } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(sections);
    } catch (err) {
      console.error('Failed to save sections:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-panel">
      <p className="editor-hint">
        Drag to reorder tabs. Toggle visibility, edit labels, or change icons.
      </p>

      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={handleReorder}
        className="section-list"
      >
        {sections.map((section) => (
          <Reorder.Item
            key={section.id}
            value={section}
            className={`section-item ${section.enabled ? '' : 'disabled'}`}
          >
            <div className="section-grip">
              <GripVertical size={16} />
            </div>

            <input
              type="text"
              value={section.label}
              onChange={(e) => renameSection(section.id, e.target.value)}
              className="section-label-input"
              style={{ flex: 1 }}
            />

            <select
              value={section.icon || 'default'}
              onChange={(e) => updateIcon(section.id, e.target.value)}
              className="editor-select"
              style={{ width: '130px', fontSize: '0.78rem', padding: '6px 8px' }}
              title="Section Icon / Logo"
            >
              <option value="default">Default Icon</option>
              <option value="none">No Icon (Text Only)</option>
              <option value="Code2">Code 💻</option>
              <option value="Gamepad2">Hobbies 🎮</option>
              <option value="BookHeart">Diary 📖</option>
              <option value="Sparkles">Sparkles ✨</option>
              <option value="Star">Star ⭐</option>
              <option value="Briefcase">Career 💼</option>
              <option value="Layers">Layers 🗂️</option>
              <option value="Cpu">Tech ⚙️</option>
              <option value="Coffee">Coffee ☕</option>
            </select>

            <button
              type="button"
              className="section-toggle"
              onClick={() => toggleSection(section.id)}
              title={section.enabled ? 'Hide section' : 'Show section'}
            >
              {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button
        type="button"
        className="editor-save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Layout'}
      </button>
    </div>
  );
}
