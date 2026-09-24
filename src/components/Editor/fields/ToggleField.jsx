import { useId } from 'react';
import Field from './Field';

/** On/off switch for boolean block options. */
export default function ToggleField({ label, value = false, onChange, hint }) {
  const id = useId();
  const checked = Boolean(value);

  return (
    <Field hint={hint}>
      <label className="bf-toggle" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="bf-toggle-track" aria-hidden="true">
          <span className="bf-toggle-knob" />
        </span>
        <span className="bf-toggle-label">{label}</span>
      </label>
    </Field>
  );
}
