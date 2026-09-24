import { Reorder, useDragControls } from 'framer-motion';

/**
 * Reorderable row whose drag starts from a handle rather than the whole card.
 *
 * With the default listener the entire row is a drag target, so on a touch
 * screen a scroll gesture that begins on a row moves the item instead of
 * scrolling the list. `dragListener={false}` plus explicit drag controls limits
 * dragging to the element that calls `startDrag`.
 *
 * @param {Function} children  Render prop receiving `{ startDrag }`.
 */
export default function SortableRow({ value, className = '', children }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={value}
      className={className}
      dragListener={false}
      dragControls={dragControls}
    >
      {children({ startDrag: (event) => dragControls.start(event) })}
    </Reorder.Item>
  );
}
