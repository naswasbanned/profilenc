import { motion } from 'framer-motion';
import { X, Trash2, AlertTriangle, Layers } from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';

export default function DeleteBlockModal({ block, onConfirm, onClose }) {
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(onClose);

  if (!block) return null;

  const blockTypeLabel = (block.type || 'Block').replace(/_/g, ' ');
  const itemCount = block.data?.items?.length || block.data?.images?.length || 0;

  return (
    <div className="editor-modal-backdrop" onClick={handleBackdropClick}>
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
        <div className="editor-modal-header" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trash2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                Delete Block
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Confirm removing this block from tab
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            title="Cancel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="editor-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
            Are you sure you want to delete this block? All content and settings configured inside it will be removed.
          </p>

          {/* Block Preview Card */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: '#06070a',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00f0aa',
                  flexShrink: 0,
                }}
              >
                <Layers size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {block.title || blockTypeLabel}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                  {blockTypeLabel} {itemCount > 0 ? `• ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : ''}
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                flexShrink: 0,
              }}
            >
              To Delete
            </span>
          </div>

          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.76rem',
              color: '#fbbf24',
            }}
          >
            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
            <span>You can undo this action with <strong>Ctrl+Z</strong> before saving.</span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="editor-modal-footer"
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="editor-btn editor-btn-ghost"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="editor-btn editor-btn-close"
            style={{
              fontSize: '0.82rem',
              padding: '8px 18px',
              background: '#ef4444',
              color: '#ffffff',
              border: '1px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trash2 size={14} />
            <span>Delete Block</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
