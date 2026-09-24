/** Editing schema for the `timeline` block. */
const timeline = {
  type: 'timeline',
  label: 'Timeline',
  blurb: 'Jobs, studies or milestones in order, newest first.',
  groups: [
    {
      id: 'items',
      title: 'Entries',
      repeatable: {
        key: 'items',
        itemLabel: 'Entry',
        titleKey: 'role',
        emptyHint: 'No entries yet. Each entry is one role, project or milestone.',
        defaultItem: { role: '', company: '', location: '', period: '', description: '', bullets: [], tags: [], images: [] },
        exampleItem: {
          role: 'Senior software engineer',
          company: 'Acme Labs',
          location: 'Remote',
          period: '2023 - Present',
          description: 'Led the rebuild of the customer dashboard.',
          bullets: ['Cut load time in half', 'Mentored two juniors'],
          tags: ['React', 'Node.js'],
          images: [],
        },
        fields: [
          { key: 'role', type: 'text', label: 'Role or title', placeholder: 'Senior software engineer', required: true, max: 70 },
          { key: 'company', type: 'text', label: 'Company or school', placeholder: 'Acme Labs', max: 70 },
          { key: 'period', type: 'text', label: 'Dates', placeholder: '2023 - Present', hint: 'Free text, so any format works.', max: 40 },
          { key: 'location', type: 'text', label: 'Location', placeholder: 'Remote', max: 40 },
          { key: 'description', type: 'textarea', label: 'Summary', placeholder: 'What you worked on.', max: 300, rows: 3 },
          { key: 'bullets', type: 'lines', label: 'Highlights', placeholder: 'Shipped the new checkout\nGrew usage by 30%' },
          { key: 'tags', type: 'tags', label: 'Tools and skills' },
          { key: 'images', type: 'imageList', label: 'Photos', hint: 'Optional screenshots or photos for this entry.' },
        ],
      },
    },
  ],
};

export default timeline;
