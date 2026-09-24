/**
 * Label + hint + error + counter wrapper shared by every editor field.
 *
 * Keeping this in one place is what makes the block editor feel consistent:
 * the label sits above the control, the hint explains the field in plain words,
 * and validation messages always appear in the same spot.
 */
export default function Field({
  label,
  hint,
  error,
  required = false,
  counter,
  htmlFor,
  children,
}) {
  return (
    <div className={`bf-field ${error ? 'has-error' : ''}`}>
      {label && (
        <div className="bf-field-top">
          <label className="bf-field-label" htmlFor={htmlFor}>
            {label}
            {required && <span className="bf-field-required" aria-hidden="true">*</span>}
          </label>
          {counter && <span className="bf-field-counter">{counter}</span>}
        </div>
      )}

      {children}

      {error ? (
        <p className="bf-field-error">{error}</p>
      ) : (
        hint && <p className="bf-field-hint">{hint}</p>
      )}
    </div>
  );
}
