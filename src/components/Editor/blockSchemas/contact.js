/** Editing schema for the `contact` block. */
const contact = {
  type: 'contact',
  label: 'Contact form',
  blurb: 'Let visitors send you a message. Replies are not sent by email: messages arrive in your dashboard inbox.',
  groups: [
    {
      id: 'settings',
      title: 'Form',
      fields: [
        {
          key: 'mode',
          type: 'choice',
          label: 'Who can send',
          fallback: 'either',
          options: [
            { value: 'anonymous', label: 'Anyone, no login' },
            { value: 'login', label: 'Logged-in users only' },
            { value: 'either', label: 'Anyone, optional anonymous' },
          ],
          hint: 'Optional anonymous lets logged-in visitors choose to hide their name.',
        },
        { key: 'intro', type: 'textarea', label: 'Intro text', placeholder: 'Ask me anything or say hello.', max: 280, rows: 2 },
        { key: 'submitLabel', type: 'text', label: 'Button label', placeholder: 'Send message', max: 24 },
        { key: 'successMessage', type: 'text', label: 'Success message', placeholder: 'Thanks, your message was sent.', max: 120 },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        {
          key: 'align',
          type: 'choice',
          label: 'Position',
          fallback: 'center',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
          hint: 'Where the form card sits in the block. Small screens always use the full width.',
        },
        {
          key: 'size',
          type: 'choice',
          label: 'Size',
          fallback: 'compact',
          options: [
            { value: 'compact', label: 'Compact' },
            { value: 'full', label: 'Full width' },
          ],
        },
      ],
    },
    {
      id: 'fields',
      title: 'Fields',
      repeatable: {
        key: 'fields',
        itemLabel: 'Field',
        titleKey: 'label',
        max: 8,
        emptyHint: 'Add at least one field.',
        defaultItem: { id: '', label: '', type: 'text', required: false, options: [], maxLength: 200 },
        exampleItem: { id: 'f-message', label: 'Message', type: 'textarea', required: true, options: [], maxLength: 2000 },
        fields: [
          { key: 'label', type: 'text', label: 'Label', placeholder: 'Message', required: true, max: 60 },
          {
            key: 'type',
            type: 'choice',
            label: 'Type',
            fallback: 'text',
            options: [
              { value: 'text', label: 'Short text' },
              { value: 'textarea', label: 'Long text' },
              { value: 'email', label: 'Email' },
              { value: 'select', label: 'Dropdown' },
            ],
          },
          { key: 'required', type: 'toggle', label: 'Required' },
          { key: 'options', type: 'lines', label: 'Choices', hint: 'One choice per line. Used by Dropdown fields only.', rows: 3 },
          { key: 'maxLength', type: 'range', label: 'Max length', min: 10, max: 5000, step: 10, unit: 'chars', fallback: 200 },
        ],
      },
    },
  ],
};

export default contact;
