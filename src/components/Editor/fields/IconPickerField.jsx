import Field from './Field';
import { ICON_LIBRARY } from '../../../lib/icons';

/**
 * Icon chooser shown as a grid of real icons, replacing the long dropdown of
 * icon names. `default` keeps whatever the block picks automatically and `none`
 * renders a title with no icon.
 */
export default function IconPickerField({ label, value = 'default', onChange, hint }) {
  const iconNames = Object.keys(ICON_LIBRARY);

  return (
    <Field label={label} hint={hint}>
      <div className="bf-icon-grid" role="group" aria-label={label}>
        <button
          type="button"
          className={`bf-icon-swatch is-text ${value === 'default' ? 'is-active' : ''}`}
          onClick={() => onChange('default')}
          title="Automatic icon"
        >
          Auto
        </button>
        <button
          type="button"
          className={`bf-icon-swatch is-text ${value === 'none' ? 'is-active' : ''}`}
          onClick={() => onChange('none')}
          title="No icon"
        >
          None
        </button>

        {iconNames.map((name) => {
          const IconComponent = ICON_LIBRARY[name];
          return (
            <button
              key={name}
              type="button"
              className={`bf-icon-swatch ${value === name ? 'is-active' : ''}`}
              onClick={() => onChange(name)}
              title={name}
              aria-label={name}
            >
              <IconComponent size={16} />
            </button>
          );
        })}
      </div>
    </Field>
  );
}
