/** Editing schema for the `video_gallery` block. */
const videoGallery = {
  type: 'video_gallery',
  label: 'Video gallery',
  blurb: 'Several videos in a grid. Each one opens in a full screen player.',
  groups: [
    {
      id: 'layout',
      title: 'Layout',
      fields: [
        {
          key: 'columns',
          type: 'choice',
          label: 'Videos per row',
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
          label: 'Thumbnail shape',
          fallback: '16:9',
          options: [
            { value: '16:9', label: '16:9' },
            { value: '4:3', label: '4:3' },
            { value: '9:16', label: 'Vertical' },
            { value: 'square', label: 'Square' },
          ],
        },
        { key: 'showCaptions', type: 'toggle', label: 'Show captions under thumbnails' },
      ],
    },
    {
      id: 'items',
      title: 'Videos',
      repeatable: {
        key: 'items',
        itemLabel: 'Video',
        titleKey: 'title',
        emptyHint: 'No videos yet.',
        defaultItem: { videoUrl: '', title: '', caption: '', posterUrl: '', duration: '', author: '', date: '', tag: '' },
        exampleItem: { videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Architecture deep dive', caption: 'How the system fits together.', posterUrl: '', duration: '12:45', author: 'Alex Rivers', date: 'Aug 2026', tag: 'Tutorial' },
        fields: [
          { key: 'videoUrl', type: 'url', label: 'Video link', placeholder: 'https://www.youtube.com/watch?v=...', required: true },
          { key: 'title', type: 'text', label: 'Title', placeholder: 'Architecture deep dive', max: 70 },
          { key: 'caption', type: 'textarea', label: 'Caption', placeholder: 'One line about the video.', max: 200, rows: 2 },
          { key: 'posterUrl', type: 'image', label: 'Thumbnail', hint: 'Leave empty to use the platform thumbnail.' },
          { key: 'duration', type: 'text', label: 'Duration', placeholder: '12:45', max: 10 },
          { key: 'author', type: 'text', label: 'Creator', placeholder: 'Alex Rivers', max: 40 },
          { key: 'date', type: 'text', label: 'Date', placeholder: 'Aug 2026', max: 24 },
          { key: 'tag', type: 'text', label: 'Category', placeholder: 'Tutorial', max: 24 },
        ],
      },
    },
  ],
};

export default videoGallery;
