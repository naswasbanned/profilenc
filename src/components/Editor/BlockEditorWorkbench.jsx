import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import BlockRenderer from '../Blocks/BlockRenderer';
import SchemaBlockForm from './SchemaBlockForm';
import { useTheme } from '../../contexts/ThemeContext';
import { getCanvasBackground, getCanvasStyleAttributes } from '../../lib/canvasStyle';

// Phones start with the preview collapsed: the fields need the whole screen.
// Read outside the component so the render body stays free of impure calls.
function prefersPreviewOpen() {
  if (typeof window === 'undefined') return true;
  return !window.matchMedia('(max-width: 768px)').matches;
}

/** Fixed desktop width used to render the preview at 1:1 before scaling. */
const PREVIEW_DESKTOP_W = 1200;

/**
 * Guided editing surface for schema driven blocks.
 *
 * One group at a time on every screen size, so the form never becomes a long
 * scroll, plus a live preview rendered with the real `BlockRenderer` so the
 * result can never drift from what the profile shows.
 */
export default function BlockEditorWorkbench({
  schema,
  block,
  activeTabId,
  title,
  subtitle,
  icon,
  onHeadingChange,
  formData,
  onFieldChange,
  onListChange,
}) {
  const showHeading = block.type !== 'hero';

  // The preview has to carry the same wrapper class, data attributes and
  // background as the real canvas, otherwise block styles that key off them
  // render differently here than on the published page.
  const { theme } = useTheme();
  const canvasAttributes = getCanvasStyleAttributes(theme);
  const background = getCanvasBackground(theme, activeTabId);

  // The heading group edits the block frame (title, subtitle, icon) which lives
  // next to `data`, so it gets its own value bag.
  const groups = useMemo(() => {
    const headingGroup = {
      id: 'heading',
      title: 'Heading',
      isHeading: true,
      fields: [
        {
          key: 'title',
          type: 'text',
          label: 'Section title',
          placeholder: 'Featured projects',
          hint: 'Shown above the block. Leave empty to hide the heading.',
          max: 60,
        },
        {
          key: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          placeholder: 'Selected client work',
          max: 90,
        },
        {
          key: 'icon',
          type: 'icon',
          label: 'Heading icon',
          hint: 'Auto picks an icon that matches the block type.',
        },
      ],
    };

    return showHeading ? [headingGroup, ...schema.groups] : schema.groups;
  }, [schema.groups, showHeading]);

  const [stepIndex, setStepIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(prefersPreviewOpen);
  const step = groups[Math.min(stepIndex, groups.length - 1)];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === groups.length - 1;

  const previewBlock = {
    ...block,
    title,
    subtitle,
    icon,
    data: formData,
  };

  // --- Dynamic scale for the desktop-width preview -------------------------
  const stageRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  const recalcScale = useCallback(() => {
    if (!stageRef.current) return;
    const padding = 24; // 12px each side
    const availableW = stageRef.current.clientWidth - padding;
    setPreviewScale(Math.min(1, availableW / PREVIEW_DESKTOP_W));
  }, []);

  useEffect(() => {
    recalcScale();
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(recalcScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [recalcScale, showPreview]);

  return (
    <div className={`bf-workbench ${showPreview ? '' : 'is-preview-hidden'}`}>
      {/* Live preview — rendered at real desktop width then scaled down */}
      {showPreview && (
        <aside className="bf-preview">
          <div className="bf-preview-head">
            <Eye size={13} />
            <span>Live preview</span>
            <button
              type="button"
              className="bf-preview-toggle"
              onClick={() => setShowPreview(false)}
              title="Hide preview"
            >
              <EyeOff size={13} />
              <span>Hide</span>
            </button>
          </div>
          <div className="bf-preview-stage" ref={stageRef}>
            <div
              className="bf-preview-scaler"
              style={{
                width: PREVIEW_DESKTOP_W,
                transformOrigin: 'top left',
                transform: `scale(${previewScale})`,
              }}
            >
              <div
                className="app bf-preview-canvas"
                {...canvasAttributes}
                style={{
                  backgroundColor: background.backgroundColor,
                  backgroundImage: background.backgroundGradient || undefined,
                }}
              >
                <BlockRenderer
                  block={previewBlock}
                  index={0}
                  totalBlocks={1}
                  isEditing={false}
                  disableReveal
                />
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Fields */}
      <div className="bf-panel">
        <nav className="bf-steps" aria-label="Editing steps">
          {!showPreview && (
            <button
              type="button"
              className="bf-step bf-step-preview"
              onClick={() => setShowPreview(true)}
              title="Show preview"
            >
              <Eye size={14} />
              <span className="bf-step-label">Preview</span>
            </button>
          )}

          {groups.map((group, index) => (
            <button
              key={group.id}
              type="button"
              className={`bf-step ${index === stepIndex ? 'is-active' : ''}`}
              onClick={() => setStepIndex(index)}
              aria-current={index === stepIndex ? 'step' : undefined}
            >
              <span className="bf-step-index">{index + 1}</span>
              <span className="bf-step-label">{group.title}</span>
            </button>
          ))}
        </nav>

        <div className="bf-panel-scroll">
          {isFirst && schema.blurb && <p className="bf-blurb">{schema.blurb}</p>}

          <SchemaBlockForm
            group={step}
            data={step.isHeading ? { title, subtitle, icon } : formData}
            onFieldChange={step.isHeading ? onHeadingChange : onFieldChange}
            onListChange={onListChange}
          />
        </div>

        <div className="bf-step-nav">
          <button
            type="button"
            className="bf-btn"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="bf-step-count">
            Step {stepIndex + 1} of {groups.length}
          </span>
          <button
            type="button"
            className="bf-btn bf-btn-primary"
            onClick={() => setStepIndex((i) => Math.min(groups.length - 1, i + 1))}
            disabled={isLast}
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
