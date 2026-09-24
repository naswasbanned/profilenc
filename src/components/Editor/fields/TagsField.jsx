import { useId } from 'react';
import { X } from 'lucide-react';
import Field from './Field';

/**
 * Tag list editor. Blocks store tags either as an array or as a comma string,
 * so the value is normalised on the way in and always written back as an array.
 */
function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
}

export default function TagsField({ label, value, onChange, hint, placeholder }) {
  const id = useId();
  const tags = toArray(value);

  const commit = (raw) => {
    const next = toArray(raw);
    onChange(next);
  };

  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="text"
        className="bf-input"
        defaultValue={tags.join(', ')}
        placeholder={placeholder || 'React, Node.js, Figma'}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit(e.currentTarget.value);
          }
        }}
      />

      {tags.length > 0 && (
        <div className="bf-tag-row">
          {tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="bf-tag">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                aria-label={`Remove ${tag}`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}
