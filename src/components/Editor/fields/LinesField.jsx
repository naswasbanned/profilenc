import { useId } from 'react';
import Field from './Field';

/**
 * One item per line, stored as an array of strings. Used for lists that read
 * naturally as text, such as the deliverables of a service.
 */
export default function LinesField({ label, value, onChange, hint, placeholder, rows = 4 }) {
  const id = useId();
  const text = Array.isArray(value) ? value.join('\n') : (value || '');

  return (
    <Field label={label} hint={hint || 'One per line.'} htmlFor={id}>
      <textarea
        id={id}
        className="bf-input bf-textarea"
        rows={rows}
        value={text}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          )
        }
      />
    </Field>
  );
}
