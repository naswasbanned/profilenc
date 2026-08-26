import { useState } from 'react';
import { ChevronDown, GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';

/**
 * AdminCard — Collapsible CRUD card wrapper with visibility toggle.
 *
 * Props:
 *   title        — card header title
 *   subtitle     — optional subtext
 *   hidden       — boolean, whether the item is hidden/draft
 *   onToggleHide — () => void, visibility toggle handler
 *   onDelete     — delete handler (shows delete button if provided)
 *   defaultOpen  — start expanded
 *   children     — form content
 */
export default function AdminCard({
  title,
  subtitle,
  hidden = false,
  onToggleHide,
  onDelete,
  defaultOpen = false,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`admin-card ${hidden ? 'is-hidden' : ''}`}>
      <div className="admin-card-header" onClick={() => setIsOpen((v) => !v)}>
        <div className="admin-card-header-left">
          <GripVertical size={14} className="admin-card-drag" />
          <span className="admin-card-title">{title || 'Untitled'}</span>
          {subtitle && <span className="admin-card-subtitle">{subtitle}</span>}
          {hidden && <span className="admin-draft-badge">Draft / Hidden</span>}
        </div>
        <div className="admin-card-actions">
          {onToggleHide && (
            <button
              type="button"
              className={`admin-card-action-btn visibility ${hidden ? 'hidden-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleHide();
              }}
              title={hidden ? 'Hidden (Click to publish)' : 'Visible (Click to hide)'}
            >
              {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="admin-card-action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`admin-card-chevron ${isOpen ? 'open' : ''}`}
          />
        </div>
      </div>
      {isOpen && <div className="admin-card-body">{children}</div>}
    </div>
  );
}
