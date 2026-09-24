/** Editing schema for the `gallery` block. */
const gallery = {
  type: 'gallery',
  label: 'Photo gallery',
  blurb: 'A grid of photos. Visitors can open any photo full screen.',
  groups: [
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        {
          key: 'columns',
          type: 'choice',
          label: 'Photos per row',
          fallback: 3,
          options: [
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
          ],
        },
        {
          key: 'aspectRatio',
          type: 'choice',
          label: 'Photo shape',
          fallback: 'square',
          options: [
            { value: 'square', label: 'Square' },
            { value: 'wide', label: 'Landscape' },
            { value: 'tall', label: 'Portrait' },
            { value: 'natural', label: 'Original' },
          ],
        },
        { key: 'showCaptions', type: 'toggle', label: 'Show captions under photos' },
      ],
    },
    {
      id: 'items',
      title: 'Photos',
      repeatable: {
        key: 'items',
        itemLabel: 'Photo',
        titleKey: 'title',
        emptyHint: 'No photos yet.',
        defaultItem: { src: '', title: '', description: '', location: '', date: '', tag: '', linkUrl: '', linkLabel: '' },
        exampleItem: { src: '', title: 'Kyoto sunset', description: 'Shot on a walk through Gion.', location: 'Kyoto, Japan', date: '2026', tag: 'Photography', linkUrl: '', linkLabel: '' },
        fields: [
          { key: 'src', type: 'image', label: 'Photo', aliases: ['image', 'url'] },
          { key: 'title', type: 'text', label: 'Title', placeholder: 'Kyoto sunset', max: 60 },
          { key: 'description', type: 'textarea', label: 'Description', placeholder: 'Shown when the photo opens full screen.', max: 240, rows: 3 },
          { key: 'location', type: 'text', label: 'Location', placeholder: 'Kyoto, Japan', max: 40 },
          { key: 'date', type: 'text', label: 'Date', placeholder: '2026 or Oct 2025', max: 24 },
          { key: 'tag', type: 'text', label: 'Category', placeholder: 'Photography', max: 24 },
          { key: 'linkUrl', type: 'url', label: 'Link', placeholder: 'https://example.com' },
          { key: 'linkLabel', type: 'text', label: 'Link text', placeholder: 'View full set', max: 24 },
        ],
      },
    },
  ],
};

export default gallery;
