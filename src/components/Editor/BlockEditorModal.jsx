import { useState } from 'react';
import { Save, X } from 'lucide-react';
import EditorModal from '../primitives/EditorModal';
import BlockEditorWorkbench from './BlockEditorWorkbench';
import { getBlockSchema } from './blockSchemas';

export default function BlockEditorModal({
  block,
  editorTheme = 'dark',
  activeTabId,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(block.data || {})));
  const [title, setTitle] = useState(block.title || '');
  const [subtitle, setSubtitle] = useState(block.subtitle || '');
  const [icon, setIcon] = useState(block.icon || 'default');

  const handleFieldChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };















  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...block,
      title,
      subtitle,
      icon,
      data: formData,
    });
    onClose();
  };

  // Blocks with a schema use the guided editor; the rest keep their hand
  // written form until they are converted.
  const schema = getBlockSchema(block.type);

  const handleHeadingChange = (field, value) => {
    if (field === 'title') setTitle(value);
    else if (field === 'subtitle') setSubtitle(value);
    else if (field === 'icon') setIcon(value);
  };

  const handleListChange = (key, nextItems) => {
    setFormData((prev) => ({ ...prev, [key]: nextItems }));
  };

  return (
    <EditorModal
      onClose={onClose}
      editorTheme={editorTheme}
      size="modal-lg"
      dialogClassName={schema ? 'block-editor-guided' : ''}
    >
        {/* Modal Header */}
        <div className="editor-modal-header">
          <div>
            <h3 style={schema ? undefined : { textTransform: 'capitalize' }}>
              {schema ? schema.label : `Edit ${block.type?.replace('_', ' ')} Block`}
            </h3>
            <span>
              {schema
                ? 'Edit on the left, watch the preview update as you type.'
                : 'Customize content, alignments, and items visually'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <BlockEditorWorkbench
            schema={schema}
            block={block}
            activeTabId={activeTabId}
            title={title}
            subtitle={subtitle}
            icon={icon}
            onHeadingChange={handleHeadingChange}
            formData={formData}
            onFieldChange={handleFieldChange}
            onListChange={handleListChange}
          />

          {/* Footer Save Button */}
          <div className="editor-modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="editor-btn editor-btn-ghost"
              style={{ padding: '9px 18px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="editor-btn editor-btn-save active-dirty"
            >
              <Save size={15} /> <span>Apply Changes</span>
            </button>
          </div>
        </form>
    </EditorModal>
  );
}
