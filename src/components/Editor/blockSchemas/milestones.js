/** Editing schema for the `milestones` block (life goals and bucket list). */
const milestones = {
  type: 'milestones',
  label: 'Goals and milestones',
  blurb: 'Things you want to do or have done. Each goal can hold a checklist of steps.',
  groups: [
    {
      id: 'items',
      title: 'Goals',
      repeatable: {
        key: 'items',
        itemLabel: 'Goal',
        titleKey: 'title',
        emptyHint: 'No goals yet. Add the first thing you are working towards.',
        defaultItem: { title: '', category: '', date: '', completed: false, subTasks: [] },
        exampleItem: {
          title: 'Launch a small product',
          category: 'Career',
          date: '2026',
          completed: false,
          subTasks: [
            { id: 'example-step-1', title: 'Pick an idea', completed: true },
            { id: 'example-step-2', title: 'Ship a first version', completed: false },
          ],
        },
        fields: [
          { key: 'title', type: 'text', label: 'Goal', placeholder: 'Launch a small product', required: true, max: 80 },
          { key: 'completed', type: 'toggle', label: 'Already done' },
          { key: 'category', type: 'text', label: 'Category', placeholder: 'Career, Travel, Health', hint: 'Used to group goals.', max: 30 },
          { key: 'date', type: 'text', label: 'Target or date', placeholder: '2026 or Q3', max: 24 },
          {
            key: 'subTasks',
            type: 'checklist',
            label: 'Steps',
            hint: 'Optional. Progress on the goal is drawn from these.',
            placeholder: 'Add a step and press Enter',
          },
        ],
      },
    },
  ],
};

export default milestones;
