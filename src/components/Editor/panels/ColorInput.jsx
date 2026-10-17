const HEX = /^#[0-9a-f]{6}$/i;

/**
 * Native color picker plus a text field, shared by the Theme panel sections.
 * `placeholder` replaces the default hint. `swatch` is the color currently in
 * effect while the field is empty (it follows the theme): it replaces the black
 * default of the native picker and still opens it on click.
 */
export default function ColorInput({ label, value, onChange, fieldId, placeholder = '#000000', swatch }) {
  const showSwatch = !value && Boolean(swatch);
  const picker = (
    <input
      type="color"
      aria-label={`${label} picker`}
      value={HEX.test(value || '') ? value : '#000000'}
      onChange={(e) => onChange(e.target.value)}
      style={showSwatch ? { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' } : undefined}
    />
  );

  return (
    <div className="editor-control" data-theme-field={fieldId}>
      <label>{label}</label>
      <div className="editor-color-input">
        {showSwatch ? (
          <span
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: 8,
              border: '1.5px solid var(--fn-editor-line)',
              background: swatch,
              overflow: 'hidden',
            }}
          >
            {picker}
          </span>
        ) : (
          picker
        )}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="editor-text-input"
        />
      </div>
    </div>
  );
}
