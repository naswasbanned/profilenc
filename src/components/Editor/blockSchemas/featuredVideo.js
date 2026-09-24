/** Editing schema for the `featured_video` and `video` blocks. */
const featuredVideo = {
  type: 'featured_video',
  label: 'Featured video',
  blurb: 'One video with a title and a short description.',
  groups: [
    {
      id: 'content',
      title: 'Video',
      fields: [
        { key: 'videoUrl', type: 'url', label: 'Video link', placeholder: 'https://www.youtube.com/watch?v=...', required: true, hint: 'YouTube, Vimeo, Streamable, Loom, or a direct MP4 file.' },
        { key: 'title', type: 'text', label: 'Title', placeholder: 'Welcome to my studio', max: 70 },
        { key: 'badge', type: 'text', label: 'Badge', placeholder: 'Featured', hint: 'Small label above the title.', max: 24 },
        { key: 'description', type: 'textarea', label: 'Description', placeholder: 'What the video shows.', max: 300, rows: 3 },
        { key: 'posterUrl', type: 'image', label: 'Cover image', hint: 'Shown before the video starts.' },
      ],
    },
    {
      id: 'playback',
      title: 'Playback',
      fields: [
        {
          key: 'aspectRatio',
          type: 'choice',
          label: 'Shape',
          fallback: '16:9',
          options: [
            { value: '16:9', label: '16:9' },
            { value: '21:9', label: '21:9' },
            { value: '4:3', label: '4:3' },
          ],
        },
        { key: 'autoplay', type: 'toggle', label: 'Start automatically' },
        { key: 'muted', type: 'toggle', label: 'Start muted', hint: 'Needed for autoplay in most browsers.' },
        { key: 'loop', type: 'toggle', label: 'Loop the video' },
      ],
    },
    {
      id: 'actions',
      title: 'Buttons',
      repeatable: {
        key: 'actions',
        itemLabel: 'Button',
        titleKey: 'label',
        emptyHint: 'No buttons yet. Add one to send viewers somewhere.',
        defaultItem: { label: '', url: '' },
        exampleItem: { label: 'Watch on YouTube', url: 'https://youtube.com/@yourchannel' },
        fields: [
          { key: 'label', type: 'text', label: 'Button text', placeholder: 'Watch on YouTube', max: 28 },
          { key: 'url', type: 'url', label: 'Link', placeholder: 'https://youtube.com/@yourchannel' },
        ],
      },
    },
  ],
};

export default featuredVideo;
