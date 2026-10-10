import { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { getCanvasStyleAttributes } from '../../lib/canvasStyle';

/**
 * Renders a block popup into `document.body`. A block sits inside a
 * transformed (animated) wrapper, which would trap a `position: fixed` popup
 * under the footer and tab bar. The canvas data-* attributes come along so
 * preset selectors still style the popup, and the block id so link clicks
 * inside the popup are attributed to their block (see lib/stats.js).
 */
export const BlockIdContext = createContext(null);

export default function CanvasPortal({ children }) {
  const { theme } = useTheme();
  const blockId = useContext(BlockIdContext);
  return createPortal(
    <div className="canvas-portal" data-block-id={blockId || undefined} {...getCanvasStyleAttributes(theme)}>{children}</div>,
    document.body
  );
}
