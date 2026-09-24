import { useId } from 'react';
import Field from './Field';

/** Multi line text field. */
export default function TextAreaField({
  label,
  value = '',
  onChange,
  placeholder,
  hint,
  required = false,
  max,
  rows = 3,
}) {
  const id = useId();
  const text = value ?? '';
  const error = typeof max === 'number' && text.length > max
    ? `Keep this under ${max} characters.`
    : null;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={id}
      counter={typeof max === 'number' ? `${text.length}/${max}` : null}
    >
      <textarea
        id={id}
        className="bf-input bf-textarea"
        rows={rows}
        value={text}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
