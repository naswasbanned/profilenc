import { useId, useState } from 'react';
import Field from './Field';
import { clampToRange, parseDraft } from '../../../lib/rangeValue';

/** Slider plus an exact number input with a unit suffix; both stay in sync. */
export default function RangeField({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
}) {
  const sliderId = useId();
  const inputId = useId();
  const committed = clampToRange(value, min, max, step) ?? min;
  // draft is null while the user is not typing in the number box.
  const [draft, setDraft] = useState(null);

  const commitDraft = () => {
    const next = parseDraft(draft, min, max, step);
    setDraft(null);
    if (next !== null && next !== committed) onChange(next);
  };

  return (
    <Field label={label} hint={hint} htmlFor={sliderId}>
      <div className="bf-range">
        <input
          id={sliderId}
          className="bf-range-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={committed}
          aria-valuetext={`${committed}${unit ? ` ${unit}` : ''}`}
          onChange={(e) => {
            setDraft(null);
            const next = clampToRange(e.target.value, min, max, step);
            if (next !== null) onChange(next);
          }}
        />
        <div className="bf-range-number">
          <input
            id={inputId}
            className="bf-input bf-range-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-label={`${label} in ${unit || 'units'}`}
            value={draft ?? String(committed)}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commitDraft();
              } else if (e.key === 'Escape') {
                setDraft(null);
              }
            }}
          />
          {unit && <span className="bf-range-unit" aria-hidden="true">{unit}</span>}
        </div>
      </div>
    </Field>
  );
}
