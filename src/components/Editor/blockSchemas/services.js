/** Editing schema for the `services` and `commission` blocks. */
const services = {
  type: 'services',
  label: 'Services and rates',
  blurb: 'What you offer, what it costs, and what is included.',
  groups: [
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        {
          key: 'columns',
          type: 'choice',
          label: 'Cards per row',
          fallback: 2,
          options: [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
          ],
        },
      ],
    },
    {
      id: 'items',
      title: 'Services',
      repeatable: {
        key: 'items',
        itemLabel: 'Service',
        titleKey: 'title',
        emptyHint: 'No services yet. Add the first thing people can book.',
        defaultItem: { title: '', price: '', period: '', status: '', deliveryTime: '', featured: false, description: '', features: [], ctaLabel: '', ctaUrl: '', imageUrl: '' },
        exampleItem: {
          title: 'Full-stack web app',
          price: '$1,200',
          period: 'project',
          status: 'Available',
          deliveryTime: '1-2 weeks',
          featured: true,
          description: 'Design and build a small production app end to end.',
          features: ['Responsive interface', 'Backend and database', '14 days of support'],
          ctaLabel: 'Book this',
          ctaUrl: 'mailto:hello@example.com',
          imageUrl: '',
        },
        fields: [
          { key: 'title', type: 'text', label: 'Service name', placeholder: 'Full-stack web app', required: true, max: 60 },
          { key: 'price', type: 'text', label: 'Price', placeholder: '$1,200 or $50/hr', max: 24 },
          { key: 'period', type: 'text', label: 'Per', placeholder: 'project, month, hour', hint: 'Shown after the price.', max: 20 },
          { key: 'status', type: 'text', label: 'Availability', placeholder: 'Available, 2 slots left', max: 30 },
          { key: 'deliveryTime', type: 'text', label: 'Turnaround', placeholder: '1-2 weeks', max: 30 },
          { key: 'description', type: 'textarea', label: 'Description', placeholder: 'What this service covers.', max: 280, rows: 3 },
          { key: 'features', type: 'lines', label: 'What is included', placeholder: 'Responsive interface\nBackend and database' },
          { key: 'ctaLabel', type: 'text', label: 'Button text', placeholder: 'Book this', max: 24 },
          { key: 'ctaUrl', type: 'url', label: 'Button link', placeholder: 'mailto:hello@example.com' },
          { key: 'imageUrl', type: 'image', label: 'Image', aliases: ['image'] },
          { key: 'featured', type: 'toggle', label: 'Highlight this service' },
        ],
      },
    },
  ],
};

export default services;
