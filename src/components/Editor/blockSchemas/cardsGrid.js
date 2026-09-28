/**
 * Editing schema for the `cards_grid` block.
 *
 * The schema is the single description of a block's editing surface: field
 * order, plain-language labels, hints and defaults. `SchemaBlockForm` renders
 * it, so adding a field never means writing markup again.
 */
const cardsGrid = {
  type: 'cards_grid',
  label: 'Project cards',
  blurb: 'A grid of cards. Each card can hold an image, a short description, tags and a link.',
  groups: [
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        {
          key: 'columns',
          type: 'choice',
          label: 'Cards per row',
          hint: 'Phones always show one card per row.',
          fallback: 2,
          options: [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
          ],
        },
      ],
    },
    {
      id: 'items',
      title: 'Cards',
      repeatable: {
        key: 'items',
        itemLabel: 'Card',
        titleKey: 'title',
        emptyHint: 'No cards yet. Each card is one project, product or link.',
        defaultItem: {
          title: '',
          badge: '',
          image: '',
          description: '',
          bullets: [],
          tags: [],
          linkUrl: '',
          actionLabel: 'View project',
        },
        exampleItem: {
          title: 'Portfolio site',
          badge: 'Featured',
          image: '',
          description: 'A personal site built with React and deployed on a small VPS.',
          bullets: ['Loads in under a second on mobile', 'Content edited without a redeploy'],
          tags: ['React', 'Vite'],
          linkUrl: 'https://example.com',
          actionLabel: 'View project',
        },
        fields: [
          {
            key: 'title',
            type: 'text',
            label: 'Card title',
            placeholder: 'Portfolio site',
            required: true,
            max: 60,
          },
          {
            key: 'badge',
            type: 'text',
            label: 'Badge',
            placeholder: 'Featured',
            hint: 'Small tag shown on the image corner. Leave empty to hide it.',
            max: 20,
          },
          {
            key: 'image',
            type: 'image',
            label: 'Cover image',
            hint: 'Wide images look best. Visitors can tap it to zoom.',
            // Older cards stored the cover under a different key
            aliases: ['imageUrl', 'coverImage'],
          },
          {
            key: 'description',
            type: 'textarea',
            label: 'Short description',
            placeholder: 'What it is, in one or two sentences.',
            max: 220,
            rows: 3,
          },
          {
            key: 'bullets',
            type: 'lines',
            label: 'Highlights',
            placeholder: 'Handles 10k requests a day\nShipped in two weeks',
            hint: 'One highlight per line. Shown as a dotted list under the description.',
          },
          {
            key: 'tags',
            type: 'tags',
            label: 'Tags',
            hint: 'Press Enter to save. Use these for tools or categories.',
          },
          {
            key: 'linkUrl',
            type: 'url',
            label: 'Link',
            placeholder: 'https://example.com',
            hint: 'Where the card button sends visitors.',
          },
          {
            key: 'actionLabel',
            type: 'text',
            label: 'Button label',
            placeholder: 'View project',
            max: 24,
          },
        ],
      },
    },
  ],
};

export default cardsGrid;
