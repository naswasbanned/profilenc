/** Editing schema for the `journal` block. */
const journal = {
  type: 'journal',
  label: 'Journal and articles',
  blurb: 'Long form entries with a cover image, mood and markdown body.',
  groups: [
    {
      id: 'info',
      title: 'Entries',
      fields: [
        {
          key: 'journalNote',
          type: 'note',
          label: 'Entries are written on the page',
          text: 'Close this window and use "Quick add entry" on the journal block itself. Writing happens there because an article needs the full width of the page, along with the markdown toolbar and the reader preview.',
        },
      ],
    },
  ],
};

export default journal;
