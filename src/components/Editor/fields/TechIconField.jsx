import Field from './Field';
import { POPULAR_TECH_PRESETS, TechIcon, resolveTechIcon } from '../../../lib/techIconUtils';

/**
 * Brand icon and colour for a skill badge.
 *
 * The icon is guessed from the skill name, so the common case needs no input at
 * all. Presets set name, icon and brand colour in one tap, and the colour can
 * still be overridden by hand.
 *
 * @param {object} item     The whole skill row, needed to resolve the preview.
 * @param {Function} onItemChange (field, value) => void
 */
export default function TechIconField({ label, item = {}, onItemChange, hint }) {
  const resolved = resolveTechIcon(item.name, item.icon, item.color);

  const applyPreset = (preset) => {
    onItemChange('name', preset.name);
    onItemChange('icon', preset.slug);
    onItemChange('color', preset.color);
  };

  return (
    <Field label={label} hint={hint || 'The icon is detected from the name. Pick a preset to set everything at once.'}>
      <div className="bf-tech">
        <div className="bf-tech-preview">
          <TechIcon name={item.name} icon={item.icon} color={item.color || resolved.color} size={22} />
          <span className="bf-tech-slug">{resolved.slug || 'auto'}</span>
          <label className="bf-tech-color" title="Badge colour">
            <input
              type="color"
              value={item.color || resolved.color || '#00f0aa'}
              onChange={(e) => onItemChange('color', e.target.value)}
            />
            <span>Colour</span>
          </label>
        </div>

        <div className="bf-tech-presets">
          {POPULAR_TECH_PRESETS.slice(0, 18).map((preset) => (
            <button
              key={preset.slug}
              type="button"
              className={`bf-tech-preset ${resolved.slug === preset.slug ? 'is-active' : ''}`}
              onClick={() => applyPreset(preset)}
              title={preset.name}
            >
              <TechIcon name={preset.name} icon={preset.slug} color={preset.color} size={15} />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </Field>
  );
}
