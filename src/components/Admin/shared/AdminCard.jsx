import { useState } from 'react';
import { ChevronDown, GripVertical, Trash2 } from 'lucide-react';

/**
 * AdminCard — Collapsible CRUD card wrapper.
 *
 * Props:
 *   title       — card header title
 *   subtitle    — optional subtext
 *   onDelete    — delete handler (shows delete button if provided)
 *   defaultOpen — start expanded
 *   children    — form content
 */
export default function AdminCard({
  title,
  subtitle,
  onDelete,
  defaultOpen = false,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="admin-card">
      <div className="admin-card-header" onClick={() => setIsOpen((v) => !v)}>
        <div className="admin-card-header-left">
          <GripVertical size={14} className="admin-card-drag" />
          <span className="admin-card-title">{title || 'Untitled'}</span>
          {subtitle && <span className="admin-card-subtitle">{subtitle}</span>}
        </div>
        <div className="admin-card-actions">
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
