/** Editing schema for the `stacked_deck` block (photo highlights). */
const stackedDeck = {
  type: 'stacked_deck',
  label: 'Photo highlights',
  blurb: 'Photos stacked like printed cards. Visitors flip through them one by one.',
  groups: [
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        {
          key: 'aspectRatio',
          type: 'choice',
          label: 'Card shape',
          hint: 'All photos are cropped to this shape, so the stack stays aligned.',
          fallback: 'landscape',
          options: [
            { value: 'landscape', label: 'Landscape' },
            { value: 'wide', label: 'Wide' },
            { value: 'square', label: 'Square' },
            { value: 'portrait', label: 'Portrait' },
          ],
        },
        {
          key: 'size',
          type: 'choice',
          label: 'Card size',
          hint: 'Maximum width on a desktop. Phones always use the full width.',
          fallback: 'medium',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'full', label: 'Full width' },
          ],
        },
      ],
    },
    {
      id: 'content',
      title: 'Photos',
      fields: [
        { key: 'caption', type: 'text', label: 'Caption', placeholder: 'Shot on a Pentax 17', hint: 'Used as the photo description.', max: 80 },
        { key: 'images', type: 'imageList', label: 'Photos', hint: 'The first photo sits on top of the stack.' },
      ],
    },
  ],
};

export default stackedDeck;
