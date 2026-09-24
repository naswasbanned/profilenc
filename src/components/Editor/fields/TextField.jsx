import { useId } from 'react';
import Field from './Field';

const URL_PATTERN = /^(https?:\/\/|mailto:|tel:|\/)/i;

/**
 * Single line text field. Pass `kind="url"` to get a gentle link check: the
 * value is never blocked, the user only gets a hint that it looks wrong.
 */
export default function TextField({
  label,
  value = '',
  onChange,
  placeholder,
  hint,
  required = false,
  max,
  kind = 'text',
}) {
  const id = useId();
  const text = value ?? '';
  const tooLong = typeof max === 'number' && text.length > max;
  const badLink = kind === 'url' && text.trim() !== '' && !URL_PATTERN.test(text.trim());

  let error = null;
  if (tooLong) error = `Keep this under ${max} characters.`;
  else if (badLink) error = 'Links usually start with https://';

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={id}
      counter={typeof max === 'number' ? `${text.length}/${max}` : null}
    >
      <input
        id={id}
        type="text"
        className="bf-input"
        value={text}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        inputMode={kind === 'url' ? 'url' : undefined}
        autoComplete="off"
      />
    </Field>
  );
}
