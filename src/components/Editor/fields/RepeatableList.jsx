import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { ChevronDown, Copy, GripVertical, Plus, Trash2 } from 'lucide-react';
import SortableRow from './SortableRow';

// Ids only need to be unique inside one block, and they are created from event
// handlers, so a module level counter keeps the component body free of
// impure calls.
let idSequence = 0;

function makeItemId(itemLabel) {
  idSequence += 1;
  const slug = itemLabel.toLowerCase().replace(/\s+/g, '-');
  return `${slug}-${idSequence}-${idSequence * 7919}`;
}

/**
 * Repeatable item list used by every block that holds a collection (cards,
 * timeline entries, services, gallery photos...).
 *
 * Rows stay collapsed and show a summary, so a block with ten entries is ten
 * rows instead of ten screens. One row opens at a time, rows drag to reorder,
 * and each row can be duplicated or removed.
 */
export default function RepeatableList({
  items = [],
  onChange,
  itemLabel = 'Item',
  titleKey = 'title',
  defaultItem = {},
  exampleItem,
  emptyHint,
  renderFields,
}) {
  const [openId, setOpenId] = useState(null);

  const list = Array.isArray(items) ? items : [];
  const keyOf = (item, index) => item.id || `${itemLabel}-${index}`;

  const withIds = list.map((item, index) => ({
    ...item,
    id: item.id || `${itemLabel.toLowerCase().replace(/\s+/g, '-')}-${index}`,
  }));

  const addItem = (template) => {
    const id = makeItemId(itemLabel);
    const next = [...withIds, { ...template, id }];
    onChange(next);
    setOpenId(id);
  };

  const updateItem = (index, field, value) => {
    const next = withIds.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const duplicateItem = (index) => {
    const copy = {
      ...withIds[index],
      id: makeItemId(itemLabel),
    };
    const next = [...withIds];
    next.splice(index + 1, 0, copy);
    onChange(next);
    setOpenId(copy.id);
  };

  const removeItem = (index) => {
    onChange(withIds.filter((_, i) => i !== index));
  };

  if (withIds.length === 0) {
    return (
      <div className="bf-empty">
        <p className="bf-empty-text">{emptyHint || `No ${itemLabel.toLowerCase()} yet.`}</p>
        <div className="bf-empty-actions">
          <button type="button" className="bf-btn bf-btn-primary" onClick={() => addItem(defaultItem)}>
            <Plus size={14} /> Add {itemLabel.toLowerCase()}
          </button>
          {exampleItem && (
            <button type="button" className="bf-btn" onClick={() => addItem(exampleItem)}>
              Use an example
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bf-list">
      <Reorder.Group axis="y" values={withIds} onReorder={onChange} className="bf-list-rows">
        {withIds.map((item, index) => {
          const isOpen = openId === item.id;
          const summary = item[titleKey] || `Untitled ${itemLabel.toLowerCase()}`;

          return (
            <SortableRow
              key={keyOf(item, index)}
              value={item}
              className={`bf-row ${isOpen ? 'is-open' : ''}`}
            >
              {({ startDrag }) => (
                <>
                  <div className="bf-row-head">
                    <span
                      className="bf-row-grip"
                      onPointerDown={startDrag}
                      title={`Drag to reorder ${itemLabel.toLowerCase()}`}
                      aria-hidden="true"
                    >
                      <GripVertical size={15} />
                    </span>

                    <button
                      type="button"
                      className="bf-row-summary"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="bf-row-index">{index + 1}</span>
                      <span className="bf-row-title">{summary}</span>
                      <ChevronDown size={15} className={`bf-row-chevron ${isOpen ? 'is-open' : ''}`} />
                    </button>

                    <button
                      type="button"
                      className="bf-row-action"
                      onClick={() => duplicateItem(index)}
                      title={`Duplicate ${itemLabel.toLowerCase()}`}
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      className="bf-row-action is-danger"
                      onClick={() => removeItem(index)}
                      title={`Remove ${itemLabel.toLowerCase()}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="bf-row-body">
                      {renderFields(item, (field, value) => updateItem(index, field, value))}
                    </div>
                  )}
                </>
              )}
            </SortableRow>
          );
        })}
      </Reorder.Group>

      <button type="button" className="bf-btn bf-btn-add" onClick={() => addItem(defaultItem)}>
        <Plus size={14} /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
