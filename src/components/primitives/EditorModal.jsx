import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import { readStoredUiTheme } from '../../hooks/useUiTheme';

/**
 * Shared shell for every editor modal: backdrop, double-click-to-close hint and
 * the animated dialog surface. Callers supply only the modal body markup
 * (usually `.editor-modal-header`, `.editor-modal-body`, `.editor-modal-footer`).
 *
 * @param {object} props
 * @param {Function} props.onClose            Called on the second backdrop click.
 * @param {string}  [props.size]              Dialog size class: `modal-sm` | `modal-md` | `modal-lg`.
 * @param {string}  [props.dialogClassName]   Extra classes for the dialog.
 * @param {object}  [props.dialogStyle]       Inline style for the dialog.
 * @param {string}  [props.editorTheme]       `dark` | `light`. Falls back to the stored UI theme.
 * @param {boolean} [props.fadeBackdrop]      Animate the backdrop opacity as well.
 * @param {object}  [props.dialogMotionProps] Extra framer-motion props merged into the dialog.
 * @param {boolean} [props.portal]            Render into `document.body`.
 * @param {React.ReactNode} props.children
 */
export default function EditorModal({
  onClose,
  size = '',
  dialogClassName = '',
  dialogStyle,
  editorTheme,
  fadeBackdrop = false,
  dialogMotionProps = {},
  portal = false,
  children,
}) {
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(onClose);
  const resolvedTheme = editorTheme || readStoredUiTheme(true);

  // Freeze the page behind the modal, otherwise a scroll that starts over the
  // backdrop (or past the end of a pane) moves the canvas instead.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      // Keeps the layout from shifting when the scrollbar disappears
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  const dialogClasses = ['editor-modal-dialog', size, dialogClassName]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {hintVisible && (
        <div className="modal-double-click-hint">
          <span>Click once more outside to close (or use ✕)</span>
        </div>
      )}
      <motion.div
        className={dialogClasses}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        style={dialogStyle}
        {...dialogMotionProps}
      >
        {children}
      </motion.div>
    </>
  );

  const backdrop = fadeBackdrop ? (
    <motion.div
      className="editor-modal-backdrop"
      data-editor-theme={resolvedTheme}
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {body}
    </motion.div>
  ) : (
    <div
      className="editor-modal-backdrop"
      data-editor-theme={resolvedTheme}
      onClick={handleBackdropClick}
    >
      {body}
    </div>
  );

  if (portal && typeof document !== 'undefined') {
    return createPortal(backdrop, document.body);
  }

  return backdrop;
}
