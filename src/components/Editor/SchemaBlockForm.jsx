import {
  ChecklistField,
  ChoiceField,
  IconPickerField,
  ImageField,
  ImageListField,
  LinesField,
  NoteField,
  RepeatableList,
  TagsField,
  TechIconField,
  TextAreaField,
  TextField,
  ToggleField,
} from './fields';

/**
 * Reads a field value, honouring `aliases` for keys that older saved content
 * may use (for example a card cover stored as `imageUrl` instead of `image`).
 */
function readValue(values, field) {
  if (!values) return field.fallback ?? '';
  const keys = [field.key, ...(field.aliases || [])];
  for (const key of keys) {
    const candidate = values[key];
    // An empty array (no highlights yet, no tags yet) is a real, present
    // value, not a missing one. Treating it as missing fell through to the
    // fallback on every render, which for `lines` meant a freshly typed
    // newline was wiped out as soon as it produced an empty array.
    if (Array.isArray(candidate)) return candidate;
    if (candidate !== undefined && candidate !== null && candidate !== '') return candidate;
  }
  return values[field.key] ?? field.fallback ?? '';
}

/**
 * Renders one schema field against a value bag.
 *
 * @param {object} field   Field description from a block schema.
 * @param {object} values  Object the field reads from.
 * @param {Function} onChange  (key, value) => void
 */
function SchemaField({ field, values, onChange }) {
  const value = readValue(values, field);
  const set = (next) => onChange(field.key, next);

  switch (field.type) {
    case 'textarea':
      return (
        <TextAreaField
          label={field.label}
          hint={field.hint}
          required={field.required}
          max={field.max}
          rows={field.rows}
          placeholder={field.placeholder}
          value={value}
          onChange={set}
        />
      );
    case 'choice':
      return (
        <ChoiceField
          label={field.label}
          hint={field.hint}
          options={field.options}
          value={value}
          onChange={set}
        />
      );
    case 'toggle':
      return (
        <ToggleField label={field.label} hint={field.hint} value={value} onChange={set} />
      );
    case 'checklist':
      return (
        <ChecklistField
          label={field.label}
          hint={field.hint}
          placeholder={field.placeholder}
          value={value}
          onChange={set}
        />
      );
    case 'note':
      return <NoteField label={field.label} text={field.text} />;
    case 'techIcon':
      return (
        <TechIconField
          label={field.label}
          hint={field.hint}
          item={values}
          onItemChange={onChange}
        />
      );
    case 'lines':
      return (
        <LinesField
          label={field.label}
          hint={field.hint}
          placeholder={field.placeholder}
          rows={field.rows}
          value={value}
          onChange={set}
        />
      );
    case 'image':
      return (
        <ImageField label={field.label} hint={field.hint} value={value} onChange={set} />
      );
    case 'imageList':
      return (
        <ImageListField label={field.label} hint={field.hint} value={value} onChange={set} />
      );
    case 'icon':
      return (
        <IconPickerField label={field.label} hint={field.hint} value={value} onChange={set} />
      );
    case 'tags':
      return (
        <TagsField
          label={field.label}
          hint={field.hint}
          placeholder={field.placeholder}
          value={value}
          onChange={set}
        />
      );
    case 'url':
    case 'text':
    default:
      return (
        <TextField
          label={field.label}
          hint={field.hint}
          required={field.required}
          max={field.max}
          placeholder={field.placeholder}
          kind={field.type === 'url' ? 'url' : 'text'}
          value={value}
          onChange={set}
        />
      );
  }
}

/**
 * Renders a single schema group: either a set of plain fields, or a repeatable
 * collection whose rows reuse the same field renderer.
 */
export default function SchemaBlockForm({ group, data, onFieldChange, onListChange }) {
  if (group.repeatable) {
    const list = group.repeatable;
    return (
      <RepeatableList
        items={data?.[list.key] || []}
        onChange={(next) => onListChange(list.key, next)}
        itemLabel={list.itemLabel}
        titleKey={list.titleKey}
        defaultItem={list.defaultItem}
        exampleItem={list.exampleItem}
        emptyHint={list.emptyHint}
        renderFields={(item, setItemField) => (
          <div className="bf-fields">
            {list.fields.map((field) => (
              <SchemaField
                key={field.key}
                field={field}
                values={item}
                onChange={setItemField}
              />
            ))}
          </div>
        )}
      />
    );
  }

  return (
    <div className="bf-fields">
      {group.fields.map((field) => (
        <SchemaField
          key={field.key}
          field={field}
          values={data}
          onChange={onFieldChange}
        />
      ))}
    </div>
  );
}
