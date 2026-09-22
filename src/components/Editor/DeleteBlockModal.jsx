import { motion } from 'framer-motion';
import { X, Trash2, AlertTriangle, Layers } from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';

export default function DeleteBlockModal({ block, onConfirm, onClose, editorTheme }) {
  const currentEditorTheme = editorTheme || (typeof window !== 'undefined' ? localStorage.getItem('profilenc_theme') || document.documentElement.getAttribute('data-theme') || 'dark' : 'dark');
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(onClose);

  if (!block) return null;

  const blockTypeLabel = (block.type || 'Block').replace(/_/g, ' ');
  const itemCount = block.data?.items?.length || block.data?.images?.length || 0;

  return (
    <div className="editor-modal-backdrop" data-editor-theme={currentEditorTheme} onClick={handleBackdropClick}>
      {hintVisible && (
        <div className="modal-double-click-hint">
          <span>Click once more outside to close (or use ✕)</span>
        </div>
      )}
      <motion.div
        className="editor-modal-dialog modal-sm delete-block-modal"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px', width: '92vw' }}
      >
        {/* Header */}
        <div className="editor-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '50%',
                background: 'var(--fn-editor-coral)',
                color: 'var(--fn-editor-ink)',
                border: '2px solid var(--fn-editor-ink)',
                boxShadow: 'var(--fn-editor-shadow-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>
                Delete Block
              </h3>
              <span>
                Confirm removing this block from tab
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="editor-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
            Are you sure you want to delete this block? All content and settings configured inside it will be removed.
          </p>

          {/* Block Preview Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--fn-editor-paper-light)',
              border: '2px solid var(--fn-editor-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--fn-editor-paper)',
                  border: '2px solid var(--fn-editor-line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--fn-editor-coral)',
                  flexShrink: 0,
                }}
              >
                <Layers size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: 'var(--fn-editor-ink)',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--fn-editor-display)',
                  }}
                >
                  {block.title || blockTypeLabel}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--fn-editor-muted)', textTransform: 'capitalize', fontFamily: 'var(--fn-editor-body)' }}>
                  {blockTypeLabel} {itemCount > 0 ? `• ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : ''}
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'var(--fn-editor-coral-dark)',
                color: '#ffffff',
                border: '2px solid var(--fn-editor-ink)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: 'var(--fn-editor-mono)',
                flexShrink: 0,
              }}
            >
              To Delete
            </span>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'var(--fn-editor-paper-light)',
              border: '2px solid var(--fn-editor-line)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8rem',
              color: 'var(--fn-editor-ink)',
            }}
          >
            <AlertTriangle size={16} color="var(--fn-editor-butter)" style={{ flexShrink: 0 }} />
            <span>You can undo this action with <strong>Ctrl+Z</strong> before saving.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="editor-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="editor-btn editor-btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="editor-btn"
            style={{
              background: 'var(--fn-editor-coral-dark)',
              color: '#ffffff',
              borderColor: 'var(--fn-editor-ink)',
            }}
          >
            <Trash2 size={15} />
            <span>Delete Block</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
