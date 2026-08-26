import { useState, useRef } from 'react';
import { ChevronDown, GripVertical, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * AdminCard — Collapsible CRUD card wrapper with visibility toggle and drag-and-drop reordering.
 *
 * Props:
 *   title        — card header title
 *   subtitle     — optional subtext
 *   hidden       — boolean, whether the item is hidden/draft
 *   onToggleHide — () => void, visibility toggle handler
 *   onDelete     — delete handler (shows delete button if provided)
 *   defaultOpen  — start expanded
 *   index        — number, current item index
 *   totalCount   — number, total items in current list
 *   onMove       — (fromIndex, toIndex) => void
 *   children     — form content
 */
export default function AdminCard({
  title,
  subtitle,
  hidden = false,
  onToggleHide,
  onDelete,
  defaultOpen = false,
  index = undefined,
  totalCount = undefined,
  onMove = undefined,
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState(null); // 'top' | 'bottom' | null
  const cardRef = useRef(null);

  const canMove = typeof index === 'number' && typeof onMove === 'function';
  const canMoveUp = canMove && index > 0;
  const canMoveDown = canMove && typeof totalCount === 'number' && index < totalCount - 1;

  const handleDragStart = (e) => {
    if (!canMove) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOverPosition(null);
  };

  const handleDragOver = (e) => {
    if (!canMove) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const pos = e.clientY < midY ? 'top' : 'bottom';
      if (pos !== dragOverPosition) {
        setDragOverPosition(pos);
      }
    }
  };

  const handleDragLeave = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.relatedTarget)) {
      setDragOverPosition(null);
    }
  };

  const handleDrop = (e) => {
    if (!canMove) return;
    e.preventDefault();
    const fromIndexStr = e.dataTransfer.getData('text/plain');
    if (fromIndexStr === '') return;
    const fromIndex = parseInt(fromIndexStr, 10);
    if (isNaN(fromIndex) || fromIndex === index) {
      setDragOverPosition(null);
      return;
    }

    let targetIndex = index;
    if (dragOverPosition === 'bottom' && fromIndex < index) {
      targetIndex = index;
    } else if (dragOverPosition === 'bottom' && fromIndex > index) {
      targetIndex = index + 1;
    } else if (dragOverPosition === 'top' && fromIndex < index) {
      targetIndex = Math.max(0, index - 1);
    } else if (dragOverPosition === 'top' && fromIndex > index) {
      targetIndex = index;
    }

    setDragOverPosition(null);
    onMove(fromIndex, targetIndex);
  };

  return (
    <div
      ref={cardRef}
      className={`admin-card ${hidden ? 'is-hidden' : ''} ${isDragging ? 'is-dragging' : ''} ${
        dragOverPosition === 'top' ? 'drag-over-top' : ''
      } ${dragOverPosition === 'bottom' ? 'drag-over-bottom' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="admin-card-header" onClick={() => setIsOpen((v) => !v)}>
        <div className="admin-card-header-left">
          {canMove ? (
            <div
              className="admin-card-drag-handle"
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              title="Drag to reorder"
            >
              <GripVertical size={15} className="admin-card-drag" />
            </div>
          ) : (
            <GripVertical size={14} className="admin-card-drag" />
          )}

          {canMove && (
            <div className="admin-card-reorder-btns" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="admin-card-reorder-btn"
                disabled={!canMoveUp}
                onClick={() => onMove(index, index - 1)}
                title="Move up"
              >
                <ArrowUp size={11} />
              </button>
              <button
                type="button"
                className="admin-card-reorder-btn"
                disabled={!canMoveDown}
                onClick={() => onMove(index, index + 1)}
                title="Move down"
              >
                <ArrowDown size={11} />
              </button>
            </div>
          )}

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
