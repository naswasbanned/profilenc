import Field from './Field';

/**
 * A small set of choices shown as pills instead of a dropdown, so the options
 * are visible without a tap. Falls back gracefully for longer option lists by
 * wrapping onto more rows.
 *
 * @param {Array<{value: any, label: string}>} options
 */
export default function ChoiceField({ label, value, onChange, options = [], hint }) {
  return (
    <Field label={label} hint={hint}>
      <div className="bf-choice-row" role="group" aria-label={label}>
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              className={`bf-choice ${isActive ? 'is-active' : ''}`}
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}
