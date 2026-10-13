import { useRef } from 'react';
import { resizeFreeCrop } from '../../lib/imageEdit';

const HANDLES = [
  { id: 'right', label: 'Resize crop width', width: true, height: false },
  { id: 'bottom', label: 'Resize crop height', width: false, height: true },
  { id: 'corner', label: 'Resize crop', width: true, height: true },
];

/**
 * Edge and corner handles for Free crop mode. The crop box stays centred in
 * the stage (react-easy-crop centres it), so a 1px edge drag changes the size
 * by 2px. Every update goes through resizeFreeCrop with the bounds supplied
 * by ImageEditor.
 *
 * @param {object} props
 * @param {{width:number,height:number}} props.size    Current (clamped) crop size.
 * @param {{width:number,height:number}} props.bounds  Free-crop bounds.
 * @param {(size: {width:number,height:number}) => void} props.onChange
 */
export default function FreeCropHandles({ size, bounds, onChange }) {
  const dragRef = useRef(null);

  const handlePointerDown = (handle) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startSize: size,
    };
  };

  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    e.stopPropagation();
    const dWidth = drag.handle.width ? (e.clientX - drag.startX) * 2 : 0;
    const dHeight = drag.handle.height ? (e.clientY - drag.startY) * 2 : 0;
    onChange(resizeFreeCrop(drag.startSize, { dWidth, dHeight }, bounds));
  };

  const handlePointerEnd = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    e.stopPropagation();
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
  };

  const handleKeyDown = (handle) => (e) => {
    const step = e.altKey ? 1 : 10;
    let dWidth = 0;
    let dHeight = 0;
    if (handle.width && e.key === 'ArrowRight') dWidth = step;
    else if (handle.width && e.key === 'ArrowLeft') dWidth = -step;
    else if (handle.height && e.key === 'ArrowDown') dHeight = step;
    else if (handle.height && e.key === 'ArrowUp') dHeight = -step;
    else return;
    e.preventDefault();
    e.stopPropagation();
    onChange(resizeFreeCrop(size, { dWidth, dHeight }, bounds));
  };

  return (
    <div
      className="ie-handles"
      style={{ width: `${size.width}px`, height: `${size.height}px` }}
    >
      {HANDLES.map((handle) => (
        <button
          key={handle.id}
          type="button"
          className={`ie-handle ie-handle-${handle.id}`}
          aria-label={handle.label}
          onPointerDown={handlePointerDown(handle)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onKeyDown={handleKeyDown(handle)}
        />
      ))}
    </div>
  );
}
