/** Editing schema for the `specs_grid` block. */
const specsGrid = {
  type: 'specs_grid',
  label: 'Gear and specs',
  blurb: 'Hardware, software or equipment, grouped by category.',
  groups: [
    {
      id: 'items',
      title: 'Items',
      repeatable: {
        key: 'items',
        itemLabel: 'Item',
        titleKey: 'name',
        emptyHint: 'No gear yet. Add a keyboard, a camera, a machine.',
        defaultItem: { category: '', name: '', detail: '', icon: '' },
        exampleItem: { category: 'GPU', name: 'RTX 4080 Super', detail: '16GB GDDR6X', icon: '' },
        fields: [
          { key: 'name', type: 'text', label: 'Name', placeholder: 'RTX 4080 Super', required: true, max: 60 },
          { key: 'category', type: 'text', label: 'Category', placeholder: 'GPU, Audio, Desk', hint: 'Used to group items.', max: 30 },
          { key: 'detail', type: 'text', label: 'Detail', placeholder: '16GB GDDR6X', max: 60 },
          { key: 'icon', type: 'text', label: 'Icon name', placeholder: 'Leave empty to pick one automatically', hint: 'Advanced. The category usually picks the right icon.', max: 30 },
        ],
      },
    },
  ],
};

export default specsGrid;
