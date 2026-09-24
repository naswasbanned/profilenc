/** Editing schema for the `music_player` block. */
const musicPlayer = {
  type: 'music_player',
  label: 'Music player',
  blurb: 'A spinning record with your tracks. Each track can come from YouTube or SoundCloud.',
  groups: [
    {
      id: 'layout',
      title: 'Player',
      fields: [
        {
          key: 'showEmbed',
          type: 'choice',
          label: 'Display',
          fallback: 'vinyl_only',
          options: [
            { value: 'vinyl_only', label: 'Record only' },
            { value: 'embedded', label: 'Record and player' },
          ],
        },
        {
          key: 'discPosition',
          type: 'choice',
          label: 'Record position',
          fallback: 'center',
          options: [
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ],
        },
        { key: 'autoplay', type: 'toggle', label: 'Start playing automatically', hint: 'Most browsers block sound until the visitor taps.' },
      ],
    },
    {
      id: 'items',
      title: 'Tracks',
      repeatable: {
        key: 'items',
        itemLabel: 'Track',
        titleKey: 'title',
        emptyHint: 'No tracks yet.',
        defaultItem: { title: '', artist: '', embedUrl: '', artworkUrl: '' },
        exampleItem: { title: 'Night drive', artist: 'Alex Rivers', embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', artworkUrl: '' },
        fields: [
          { key: 'title', type: 'text', label: 'Track title', placeholder: 'Night drive', required: true, max: 60 },
          { key: 'artist', type: 'text', label: 'Artist', placeholder: 'Alex Rivers', max: 60 },
          { key: 'embedUrl', type: 'url', label: 'Track link', placeholder: 'https://www.youtube.com/watch?v=...', hint: 'YouTube or SoundCloud.' },
          { key: 'artworkUrl', type: 'image', label: 'Cover art', hint: 'Square artwork looks best on the record.' },
        ],
      },
    },
  ],
};

export default musicPlayer;
