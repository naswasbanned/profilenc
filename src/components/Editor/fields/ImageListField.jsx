import { Plus, Trash2 } from 'lucide-react';
import Field from './Field';
import ImageUploadPicker from '../ImageUploadPicker';

/**
 * Ordered list of images, stored as an array of URLs. Used by blocks that hold
 * several pictures without any other per-image data, such as the photo deck and
 * timeline attachments.
 */
export default function ImageListField({ label, value, onChange, hint }) {
  const images = Array.isArray(value) ? value : [];

  const setImage = (index, url) => {
    onChange(images.map((image, i) => (i === index ? url : image)));
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <Field label={label} hint={hint}>
      <div className="bf-image-list">
        {images.map((image, index) => (
          <div className="bf-image-row" key={`${index}-${image || 'empty'}`}>
            <span className="bf-image-index">{index + 1}</span>
            <div className="bf-image-row-picker">
              <ImageUploadPicker label="" value={image} onChange={(url) => setImage(index, url)} />
            </div>
            <button
              type="button"
              className="bf-row-action is-danger"
              onClick={() => removeImage(index)}
              title="Remove image"
              aria-label="Remove image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          className="bf-btn bf-btn-add"
          onClick={() => onChange([...images, ''])}
        >
          <Plus size={14} /> Add image
        </button>
      </div>
    </Field>
  );
}
