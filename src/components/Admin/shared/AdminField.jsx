import { useState } from 'react';
import { X, Plus } from 'lucide-react';

/**
 * AdminField — Reusable form field component.
 *
 * Props:
 *   label      — field label text
 *   value      — current value
 *   onChange   — (newValue) => void
 *   type       — 'text' | 'textarea' | 'number' | 'select' | 'color' | 'date' | 'url' | 'tags' | 'urls' | 'mood'
 *   options    — array of { value, label } for select, or strings for mood
 *   placeholder
 *   fullWidth  — span both columns in grid
 *   moodMap    — { key: { emoji } } for mood selector
 */
export default function AdminField({
  label,
  value,
  onChange,
  type = 'text',
  options = [],
  placeholder = '',
  fullWidth = false,
  moodMap = null,
}) {
  const [tagInput, setTagInput] = useState('');

  const cls = `admin-field${fullWidth ? ' full-width' : ''}`;

  // Tags (array of strings)
  if (type === 'tags') {
    const tags = Array.isArray(value) ? value : [];
    const addTag = () => {
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setTagInput('');
      }
    };
    return (
      <div className={cls}>
        <label className="admin-field-label">{label}</label>
        <div className="admin-field-tags">
          {tags.map((tag, i) => (
            <span key={i} className="admin-tag">
              {tag}
              <button
                type="button"
                className="admin-tag-remove"
                onClick={() => onChange(tags.filter((_, idx) => idx !== i))}
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <span className="admin-tag-add">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add…"
            />
          </span>
        </div>
      </div>
    );
  }

  // URLs array
  if (type === 'urls') {
    const urls = Array.isArray(value) ? value : [];
    return (
      <div className={cls}>
        <label className="admin-field-label">{label}</label>
        <div className="admin-url-list">
          {urls.map((url, i) => (
            <div key={i} className="admin-url-item">
              <input
                className="admin-field-input"
                value={url}
                onChange={(e) => {
                  const updated = [...urls];
                  updated[i] = e.target.value;
                  onChange(updated);
                }}
                placeholder="URL"
              />
              <button
                type="button"
                className="admin-url-remove-btn"
                onClick={() => onChange(urls.filter((_, idx) => idx !== i))}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-url-add-btn"
            onClick={() => onChange([...urls, ''])}
          >
            <Plus size={12} /> Add URL
          </button>
        </div>
      </div>
    );
  }

  // Mood selector
  if (type === 'mood') {
    const moods = options.length ? options : [
      'excited', 'focused', 'proud', 'amused', 'mysterious', 'opinionated', 'exhausted', 'reflective',
    ];
    return (
      <div className={cls}>
        <label className="admin-field-label">{label}</label>
        <div className="admin-mood-grid">
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              className={`admin-mood-option ${value === mood ? 'selected' : ''}`}
              onClick={() => onChange(mood)}
            >
              {moodMap?.[mood]?.emoji || '📝'} {mood}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Color
  if (type === 'color') {
    return (
      <div className={cls}>
        <label className="admin-field-label">{label}</label>
        <div className="admin-field-color-wrapper">
          <input
            type="color"
            className="admin-field-color-input"
            value={value || '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            className="admin-field-input"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#hex"
            style={{ flex: 1 }}
          />
        </div>
      </div>
    );
  }

  // Select
  if (type === 'select') {
    return (
      <div className={cls}>
        <label className="admin-field-label">{label}</label>
        <select
          className="admin-field-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Textarea
  if (type === 'textarea') {
    return (
      <div className={cls}>
        <label className="admin-field-label">{label}</label>
        <textarea
          className="admin-field-input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  }

  // Default: text / number / date / url
  return (
    <div className={cls}>
      <label className="admin-field-label">{label}</label>
      <input
        type={type}
        className="admin-field-input"
        value={value ?? ''}
        onChange={(e) =>
          onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)
        }
        placeholder={placeholder}
      />
    </div>
  );
}
