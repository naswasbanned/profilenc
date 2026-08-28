import { useState } from 'react';
import { Save, ChevronDown, ChevronRight } from 'lucide-react';

const CONTENT_KEYS = [
  { key: 'profile', label: 'Profile Info', description: 'Name, bio, avatar, contact details, footer' },
  { key: 'dev-skills', label: 'Skills', description: 'Tech stack and skill categories' },
  { key: 'dev-projects', label: 'Projects', description: 'Portfolio projects' },
  { key: 'dev-experience', label: 'Experience', description: 'Work history and roles' },
  { key: 'dev-services', label: 'Services', description: 'Services offered' },
  { key: 'hobbies-specs', label: 'PC Specs', description: 'Hardware specifications' },
  { key: 'hobbies-setup', label: 'Setup', description: 'Desk and peripherals setup' },
  { key: 'hobbies-story-games', label: 'Story Games', description: 'Narrative game reviews' },
  { key: 'hobbies-currently-playing', label: 'Currently Playing', description: 'Active games' },
  { key: 'hobbies-backlog', label: 'Game Backlog', description: 'Games to play' },
  { key: 'hobbies-philosophy', label: 'Gaming Philosophy', description: 'Gaming thoughts' },
  { key: 'hobbies-movies', label: 'Movies', description: 'Movie reviews and ratings' },
  { key: 'hobbies-movies-watching', label: 'Watching Now', description: 'Currently watching' },
  { key: 'hobbies-movies-backlog', label: 'Watchlist', description: 'Movies to watch' },
  { key: 'diary-entries', label: 'Diary Entries', description: 'Journal entries' },
];

function JsonEditor({ value, onChange }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState('');

  const handleChange = (newText) => {
    setText(newText);
    try {
      const parsed = JSON.parse(newText);
      setError('');
      onChange(parsed);
    } catch {
      setError('Invalid JSON');
    }
  };

  return (
    <div className="json-editor">
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        className="json-textarea"
        spellCheck={false}
      />
      {error && <span className="json-error">{error}</span>}
    </div>
  );
}

export default function ContentPanel({ content, onSave }) {
  const [expanded, setExpanded] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [saving, setSaving] = useState(null);

  const handleContentChange = (key, data) => {
    setEditedContent((prev) => ({ ...prev, [key]: data }));
  };

  const handleSave = async (key) => {
    const data = editedContent[key];
    if (!data) return;

    setSaving(key);
    try {
      await onSave(key, data);
      setEditedContent((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (err) {
      console.error(`Failed to save ${key}:`, err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="content-panel">
      <p className="editor-hint">
        Edit content data as JSON. Changes save per section.
      </p>

      <div className="content-sections">
        {CONTENT_KEYS.map(({ key, label, description }) => {
          const hasContent = content?.[key] !== undefined;
          const isExpanded = expanded === key;
          const hasEdits = editedContent[key] !== undefined;

          return (
            <div key={key} className={`content-section ${isExpanded ? 'expanded' : ''}`}>
              <button
                className="content-section-header"
                onClick={() => setExpanded(isExpanded ? null : key)}
              >
                <div className="content-section-info">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <div>
                    <span className="content-section-label">{label}</span>
                    <span className="content-section-desc">{description}</span>
                  </div>
                </div>
                <div className="content-section-badges">
                  {hasContent && <span className="content-badge active">Active</span>}
                  {hasEdits && <span className="content-badge edited">Edited</span>}
                </div>
              </button>

              {isExpanded && (
                <div className="content-section-body">
                  {hasContent || hasEdits ? (
                    <>
                      <JsonEditor
                        value={editedContent[key] || content[key]}
                        onChange={(data) => handleContentChange(key, data)}
                      />
                      {hasEdits && (
                        <button
                          className="editor-save-btn"
                          onClick={() => handleSave(key)}
                          disabled={saving === key}
                        >
                          {saving === key ? 'Saving...' : <><Save size={14} /> Save {label}</>}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="content-empty">No content yet. Add JSON data to populate this section.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
