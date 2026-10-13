import {
  FLOAT_SIZE_DEFAULT,
  FLOAT_SIZE_MAX,
  FLOAT_SIZE_MIN,
  FLOAT_SIZE_STEP,
  resolveFloatSize,
} from '../../../lib/floatingPlayer';

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
        { key: 'floating', type: 'toggle', label: 'Floating vinyl', hint: 'Sticks half of the record to the edge of the screen while visitors scroll.' },
        {
          key: 'floatEdge',
          type: 'choice',
          label: 'Stick to',
          fallback: 'right',
          showIf: { key: 'floating', equals: true },
          options: [
            { value: 'top', label: 'Top' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ],
        },
        {
          key: 'floatSize',
          type: 'range',
          label: 'Vinyl size',
          hint: 'Desktop size. On phones the record stays one fixed size.',
          min: FLOAT_SIZE_MIN,
          max: FLOAT_SIZE_MAX,
          step: FLOAT_SIZE_STEP,
          unit: 'px',
          fallback: FLOAT_SIZE_DEFAULT,
          // Maps legacy 'sm'|'md'|'lg'|'xl' values to pixels for display.
          normalize: resolveFloatSize,
          showIf: { key: 'floating', equals: true },
        },
        {
          key: 'floatAlign',
          type: 'choice',
          label: 'Position along the edge',
          fallback: 'center',
          showIf: { key: 'floating', equals: true },
          options: [
            { value: 'start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'End' },
          ],
        },
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
