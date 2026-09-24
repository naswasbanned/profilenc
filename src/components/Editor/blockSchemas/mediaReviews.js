/** Editing schema for the `media_reviews` block. */
const mediaReviews = {
  type: 'media_reviews',
  label: 'Reviews',
  blurb: 'Games, films or books with a rating and your notes.',
  groups: [
    {
      id: 'items',
      title: 'Reviews',
      repeatable: {
        key: 'items',
        itemLabel: 'Review',
        titleKey: 'title',
        emptyHint: 'No reviews yet.',
        defaultItem: { title: '', rating: 4, status: '', genre: '', notes: '', coverImage: '' },
        exampleItem: { title: 'Cyberpunk 2077', rating: 4, status: 'Completed', genre: 'Action RPG', notes: 'Great city, messy launch.', coverImage: '' },
        fields: [
          { key: 'title', type: 'text', label: 'Title', placeholder: 'Cyberpunk 2077', required: true, max: 70 },
          {
            key: 'rating',
            type: 'choice',
            label: 'Rating',
            fallback: 4,
            options: [
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
            ],
          },
          { key: 'status', type: 'text', label: 'Status', placeholder: 'Completed, Playing, Dropped', max: 24 },
          { key: 'genre', type: 'text', label: 'Genre', placeholder: 'Action RPG', max: 30 },
          { key: 'notes', type: 'textarea', label: 'Your notes', placeholder: 'What you thought of it.', max: 300, rows: 3 },
          { key: 'coverImage', type: 'image', label: 'Cover image', aliases: ['image', 'imageUrl'] },
        ],
      },
    },
  ],
};

export default mediaReviews;
