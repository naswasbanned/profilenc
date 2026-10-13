import { useEffect, useId, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { X, RotateCcw, RotateCw, Check, Loader2, AlertTriangle, ZoomIn, Star } from 'lucide-react';
import EditorModal from '../primitives/EditorModal';
import FreeCropHandles from './FreeCropHandles';
import {
  ADJUSTMENT_RANGES,
  FILTER_PRESETS,
  NEUTRAL_ADJUSTMENTS,
  RATIO_OPTIONS,
  buildFilterOps,
  isAnimatedGif,
  opsToCssFilter,
  ratioValue,
  resizeFreeCrop,
  resolveRatioId,
  rotateBy,
  rotatedBounds,
} from '../../lib/imageEdit';
import { exportEditedImage, loadImage } from '../../lib/imageExport';
import './ImageEditor.css';

const LOAD_ERROR_TEXT = "This image can't be previewed in this browser. You can upload it as is or cancel.";
const EXPORT_ERROR_TEXT = "The edited image couldn't be created. Try again, use the original, or cancel.";
const GIF_NOTICE_TEXT = 'Editing turns this animated GIF into a single still frame.';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const FREE_SEED_FACTOR = 0.8;

const ADJUSTMENT_FIELDS = [
  { key: 'brightness', label: 'Brightness' },
  { key: 'contrast', label: 'Contrast' },
  { key: 'saturation', label: 'Saturation' },
];

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const stopPropagation = (e) => e.stopPropagation();

/**
 * Free-crop bounds per axis: the visible (rotated, zoomed) media, never larger
 * than the stage. A box larger than the media would break react-easy-crop's
 * position clamping and export edge-clamped areas.
 */
function computeFreeBounds(stageSize, mediaSize, rotation, zoom) {
  if (!mediaSize) return null;
  const rotated = rotatedBounds(mediaSize.width, mediaSize.height, rotation);
  const width = rotated.width * zoom;
  const height = rotated.height * zoom;
  return {
    width: stageSize ? Math.min(stageSize.width, width) : width,
    height: stageSize ? Math.min(stageSize.height, height) : height,
  };
}

const seedFreeSize = (bounds) => ({
  width: bounds.width * FREE_SEED_FACTOR,
  height: bounds.height * FREE_SEED_FACTOR,
});

/**
 * Crop / rotate / filter editor shown before an image is uploaded. Loaded
 * lazily through LazyImageEditor so react-easy-crop stays out of page chunks.
 *
 * @param {object} props
 * @param {File} props.file                     Source image.
 * @param {string} [props.recommendedRatio]     Ratio id preselected and marked Recommended.
 * @param {'rect'|'round'} [props.cropShape]
 * @param {'dark'|'light'} [props.editorTheme]
 * @param {{current: HTMLElement|null}} [props.returnFocusRef] Gets focus back on close.
 * @param {(file: File, meta: {edited: boolean}) => void} props.onConfirm
 * @param {() => void} props.onCancel
 */
export default function ImageEditor({
  file,
  recommendedRatio = 'free',
  cropShape = 'rect',
  editorTheme,
  returnFocusRef,
  onConfirm,
  onCancel,
}) {
  const recommendedId = resolveRatioId(recommendedRatio);
  const titleId = useId();
  const zoomId = useId();
  const sliderIdPrefix = useId();

  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const cropperRef = useRef(null);
  const firstChipRef = useRef(null);

  const [objectUrl, setObjectUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [ratioId, setRatioId] = useState(recommendedId);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [freeCropSize, setFreeCropSize] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [mediaSize, setMediaSize] = useState(null);
  const [stageSize, setStageSize] = useState(null);
  const [presetId, setPresetId] = useState('none');
  const [adjustments, setAdjustments] = useState(NEUTRAL_ADJUSTMENTS);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);

  // Decode the source through an object URL; the URL lives exactly as long as
  // this effect run, which also keeps StrictMode's double mount clean.
  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    let cancelled = false;

    loadImage(url)
      .then((img) => {
        if (cancelled) return;
        setObjectUrl(url);
        setImage(img);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    if (file.type === 'image/gif' && typeof file.arrayBuffer === 'function') {
      file.arrayBuffer()
        .then((buffer) => {
          if (!cancelled) setIsAnimated(isAnimatedGif(new Uint8Array(buffer)));
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Track the stage size for the Free crop bounds.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setStageSize((prev) => (
        prev && prev.width === rect.width && prev.height === rect.height
          ? prev
          : { width: rect.width, height: rect.height }
      ));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Initial focus, and focus restore on close.
  useEffect(() => {
    const previouslyActive = document.activeElement;
    // The opener exists when the editor mounts; isConnected below covers the
    // case where it unmounted meanwhile (e.g. the landing upload label).
    const returnTarget = returnFocusRef?.current;
    firstChipRef.current?.focus();
    return () => {
      if (returnTarget && returnTarget.isConnected) returnTarget.focus();
      else if (previouslyActive && previouslyActive.isConnected && typeof previouslyActive.focus === 'function') {
        previouslyActive.focus();
      }
    };
  }, [returnFocusRef]);

  // Escape closes only the editor; page shortcuts behind it are blocked; Tab
  // stays inside the dialog. Capture phase on window runs before any other
  // window/document listener and before React's root listeners.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        onCancel();
        return;
      }

      const key = typeof e.key === 'string' ? e.key.toLowerCase() : '';
      if ((e.ctrlKey || e.metaKey) && (key === 'z' || key === 'y' || key === 'k')) {
        e.stopPropagation();
        return;
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current || document.getElementById(titleId)?.closest('.image-editor-dialog');
        if (!dialog) return;
        const focusables = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR))
          .filter((el) => el.getClientRects().length > 0);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (!dialog.contains(active)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onCancel, titleId]);

  const isFree = ratioId === 'free';
  const freeBounds = computeFreeBounds(stageSize, mediaSize, rotation, zoom);
  // Zero-delta resize = clamp, so the box follows zoom, rotation and stage changes.
  const freeSize = isFree && freeCropSize && freeBounds ? resizeFreeCrop(freeCropSize, {}, freeBounds) : null;

  let aspect;
  if (isFree) {
    if (freeSize) aspect = freeSize.width / freeSize.height;
    else if (mediaSize) aspect = mediaSize.width / mediaSize.height;
    else aspect = 1;
  } else {
    aspect = ratioValue(ratioId);
  }

  const ops = buildFilterOps(presetId, adjustments);
  const cssFilter = opsToCssFilter(ops);
  const adjustmentsAreNeutral = ADJUSTMENT_FIELDS.every(({ key }) => adjustments[key] === NEUTRAL_ADJUSTMENTS[key]);

  const handleMediaSize = (size) => {
    if (!size) return;
    setMediaSize((prev) => (
      prev && prev.width === size.width && prev.height === size.height
        ? prev
        : { width: size.width, height: size.height }
    ));
  };

  const handleMediaLoaded = (size) => {
    handleMediaSize(size);
    if (ratioId === 'free' && !freeCropSize) {
      const bounds = computeFreeBounds(stageSize, size, rotation, zoom);
      if (bounds) setFreeCropSize(seedFreeSize(bounds));
    }
    // Move focus from the first chip to the crop area once it exists.
    if (document.activeElement === firstChipRef.current) {
      stageRef.current?.querySelector('.ie-crop-area')?.focus();
    }
  };

  const handleRatioChange = (id) => {
    setRatioId(id);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (id === 'free') {
      const bounds = computeFreeBounds(stageSize, mediaSize, rotation, 1);
      if (bounds) setFreeCropSize(seedFreeSize(bounds));
    }
  };

  const handleRotate = (delta) => {
    setRotation((r) => rotateBy(r, delta));
  };

  const handleAdjustment = (key, value) => {
    setAdjustments((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleUseOriginal = () => {
    onConfirm(file, { edited: false });
  };

  const handleApply = async () => {
    if (!image || exporting) return;
    const area = cropperRef.current?.getCropData?.()?.croppedAreaPixels || croppedAreaPixels;
    if (!area) return;
    setExporting(true);
    setExportError(false);
    try {
      const edited = await exportEditedImage({ image, file, rotation, crop: area, ops });
      onConfirm(edited, { edited: true });
    } catch (err) {
      console.error('Image export failed:', err);
      setExportError(true);
      setExporting(false);
    }
  };

  const applyDisabled = exporting || !image || !croppedAreaPixels;

  return (
    <div
      style={{ display: 'contents' }}
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
      onKeyDown={stopPropagation}
    >
      <EditorModal
        portal
        size="modal-lg"
        backdropClassName="ie-backdrop"
        dialogClassName="image-editor-dialog"
        editorTheme={editorTheme}
        onClose={onCancel}
        dialogMotionProps={{
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
          'data-lenis-prevent': true,
          ref: dialogRef,
        }}
      >
        <div className="editor-modal-header">
          <h3 id={titleId}>Edit image</h3>
          <button type="button" onClick={onCancel} aria-label="Cancel and close" title="Cancel">
            <X size={18} />
          </button>
        </div>

        <div className="editor-modal-body">
          <div className="ie-stage" ref={stageRef}>
            {objectUrl && image ? (
              <Cropper
                ref={cropperRef}
                image={objectUrl}
                crop={crop}
                zoom={zoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                rotation={rotation}
                aspect={aspect}
                cropSize={freeSize || undefined}
                cropShape={cropShape === 'round' ? 'round' : 'rect'}
                showGrid
                zoomWithScroll
                keyboardStep={10}
                classes={{ cropAreaClassName: 'ie-crop-area' }}
                style={{ mediaStyle: { filter: cssFilter } }}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                setMediaSize={handleMediaSize}
                onMediaLoaded={handleMediaLoaded}
              />
            ) : (
              <div className="ie-stage-message">
                {loadError ? 'Preview unavailable' : <Loader2 size={24} className="ie-spin" aria-label="Loading image" />}
              </div>
            )}
            {freeSize && freeBounds && (
              <FreeCropHandles size={freeSize} bounds={freeBounds} onChange={setFreeCropSize} />
            )}
          </div>

          {loadError && (
            <div className="ie-alert" role="alert">
              <AlertTriangle size={18} aria-hidden="true" />
              <span className="ie-alert-text">{LOAD_ERROR_TEXT}</span>
            </div>
          )}

          {exportError && (
            <div className="ie-alert" role="alert">
              <AlertTriangle size={18} aria-hidden="true" />
              <span className="ie-alert-text">{EXPORT_ERROR_TEXT}</span>
            </div>
          )}

          {isAnimated && (
            <div className="ie-notice" role="status">
              <span className="ie-notice-text">{GIF_NOTICE_TEXT}</span>
              <button type="button" className="ie-btn" onClick={handleUseOriginal}>
                Upload original
              </button>
            </div>
          )}

          <div className="ie-controls">
            <div className="ie-section">
              <p className="ie-section-title">Crop</p>
              <div className="ie-ratio-grid" role="group" aria-label="Aspect ratio">
                {RATIO_OPTIONS.map((option, index) => {
                  const isRecommended = option.id === recommendedId;
                  return (
                    <button
                      key={option.id}
                      ref={index === 0 ? firstChipRef : undefined}
                      type="button"
                      className="ie-chip"
                      aria-pressed={ratioId === option.id}
                      onClick={() => handleRatioChange(option.id)}
                    >
                      {option.label}
                      {isRecommended && (
                        <span className="ie-recommended-badge" title="Recommended" aria-label="Recommended">
                          <Star size={10} fill="currentColor" aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="ie-section">
              <p className="ie-section-title">Zoom and rotate</p>
              <div className="ie-zoom-row">
                <label className="ie-zoom-label" htmlFor={zoomId}>
                  <ZoomIn size={18} aria-hidden="true" />
                  Zoom
                </label>
                <input
                  id={zoomId}
                  type="range"
                  className="ie-range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.01}
                  value={zoom}
                  aria-valuetext={`${Math.round(zoom * 100)}%`}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
                <button type="button" className="ie-icon-btn" aria-label="Rotate left" title="Rotate left" onClick={() => handleRotate(-90)}>
                  <RotateCcw size={18} />
                </button>
                <button type="button" className="ie-icon-btn" aria-label="Rotate right" title="Rotate right" onClick={() => handleRotate(90)}>
                  <RotateCw size={18} />
                </button>
              </div>
            </div>

            <div className="ie-section ie-section-wide">
              <p className="ie-section-title">Filter</p>
              <div className="ie-preset-grid" role="group" aria-label="Filter">
                {FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="ie-preset"
                    aria-pressed={presetId === preset.id}
                    onClick={() => setPresetId(preset.id)}
                  >
                    {objectUrl ? (
                      <img
                        src={objectUrl}
                        alt=""
                        className="ie-thumb"
                        style={{ filter: opsToCssFilter(buildFilterOps(preset.id, NEUTRAL_ADJUSTMENTS)) }}
                      />
                    ) : (
                      <span className="ie-thumb" aria-hidden="true" />
                    )}
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ie-section ie-section-wide">
              <p className="ie-section-title">Adjust</p>
              <div className="ie-adjust-grid">
                {ADJUSTMENT_FIELDS.map(({ key, label }) => {
                  const range = ADJUSTMENT_RANGES[key];
                  const inputId = `${sliderIdPrefix}-${key}`;
                  return (
                    <div className="ie-slider-row" key={key}>
                      <label className="ie-slider-label" htmlFor={inputId}>{label}</label>
                      <span className="ie-slider-value" aria-hidden="true">{adjustments[key]}%</span>
                      <input
                        id={inputId}
                        type="range"
                        className="ie-range"
                        min={range.min}
                        max={range.max}
                        step={range.step}
                        value={adjustments[key]}
                        aria-valuetext={`${adjustments[key]}%`}
                        onChange={(e) => handleAdjustment(key, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                className="ie-link-btn"
                onClick={() => setAdjustments(NEUTRAL_ADJUSTMENTS)}
                disabled={adjustmentsAreNeutral}
              >
                Reset adjustments
              </button>
            </div>
          </div>
        </div>

        <div className="editor-modal-footer">
          <button type="button" className="ie-btn ie-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="ie-btn ie-btn-ghost" onClick={handleUseOriginal}>
            Use original
          </button>
          <button
            type="button"
            className="ie-btn ie-btn-primary"
            onClick={handleApply}
            disabled={applyDisabled}
            aria-busy={exporting}
          >
            {exporting ? <Loader2 size={16} className="ie-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
            Apply
          </button>
        </div>
      </EditorModal>
    </div>
  );
}
