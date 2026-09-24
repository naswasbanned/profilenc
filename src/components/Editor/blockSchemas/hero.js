/** Editing schema for the `hero` block. */
const hero = {
  type: 'hero',
  label: 'Intro header',
  blurb: 'The top of your page: your name, what you do, and where people can reach you.',
  groups: [
    {
      id: 'identity',
      title: 'About you',
      fields: [
        { key: 'name', type: 'text', label: 'Full name', placeholder: 'Alex Rivers', required: true, max: 50 },
        { key: 'tagline', type: 'text', label: 'Role or tagline', placeholder: 'Full-stack engineer', max: 70 },
        { key: 'bio', type: 'textarea', label: 'Short bio', placeholder: 'Two or three sentences about your work.', max: 320, rows: 4 },
        { key: 'avatarUrl', type: 'image', label: 'Profile photo', hint: 'A square photo works best.' },
        { key: 'statusBadge', type: 'text', label: 'Status pill', placeholder: 'Available for freelance', hint: 'Small badge next to your name. Leave empty to hide it.', max: 40 },
      ],
    },
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        {
          key: 'align',
          type: 'choice',
          label: 'Arrangement',
          fallback: 'center',
          options: [
            { value: 'center', label: 'Centered' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'split-left', label: 'Photo left' },
            { value: 'split-right', label: 'Photo right' },
          ],
        },
      ],
    },
    {
      id: 'actions',
      title: 'Buttons',
      repeatable: {
        key: 'actions',
        itemLabel: 'Button',
        titleKey: 'label',
        emptyHint: 'No buttons yet. Add one so visitors know what to do next.',
        defaultItem: { label: '', url: '', primary: true },
        exampleItem: { label: 'Get in touch', url: 'mailto:hello@example.com', primary: true },
        fields: [
          { key: 'label', type: 'text', label: 'Button text', placeholder: 'Get in touch', max: 28 },
          { key: 'url', type: 'url', label: 'Link', placeholder: 'mailto:hello@example.com', hint: 'A web address, or mailto: for email.' },
          { key: 'primary', type: 'toggle', label: 'Highlight this button' },
        ],
      },
    },
    {
      id: 'socials',
      title: 'Social links',
      repeatable: {
        key: 'socials',
        itemLabel: 'Link',
        titleKey: 'label',
        emptyHint: 'No social links yet.',
        defaultItem: { platform: 'Github', label: 'GitHub', url: '' },
        exampleItem: { platform: 'Github', label: 'GitHub', url: 'https://github.com/yourname' },
        fields: [
          {
            key: 'platform',
            type: 'choice',
            label: 'Platform',
            fallback: 'Github',
            options: [
              { value: 'Github', label: 'GitHub' },
              { value: 'Linkedin', label: 'LinkedIn' },
              { value: 'Twitter', label: 'X' },
              { value: 'Instagram', label: 'Instagram' },
              { value: 'Youtube', label: 'YouTube' },
              { value: 'Mail', label: 'Email' },
              { value: 'Globe', label: 'Website' },
            ],
          },
          { key: 'label', type: 'text', label: 'Label', placeholder: 'GitHub', max: 24 },
          { key: 'url', type: 'url', label: 'Link', placeholder: 'https://github.com/yourname' },
        ],
      },
    },
  ],
};

export default hero;
