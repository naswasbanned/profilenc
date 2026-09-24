import Field from './Field';
import ImageUploadPicker from '../ImageUploadPicker';

/**
 * Image field. Wraps the existing upload picker so the block editor keeps one
 * upload path, and adds the shared label / hint treatment around it.
 */
export default function ImageField({ label, value, onChange, hint }) {
  return (
    <Field label={label} hint={hint}>
      <div className="bf-image-field">
        <ImageUploadPicker label="" value={value || ''} onChange={onChange} />
      </div>
    </Field>
  );
}
