/** Editing schema for the `events` and `calendar` blocks. */
const events = {
  type: 'events',
  label: 'Events and schedule',
  blurb: 'Streams, talks or meetups. Visitors can add them to their own calendar.',
  groups: [
    {
      id: 'layout',
      title: 'Display',
      fields: [
        {
          key: 'defaultView',
          type: 'choice',
          label: 'Opens as',
          fallback: 'list',
          options: [
            { value: 'list', label: 'List' },
            { value: 'calendar', label: 'Calendar' },
          ],
        },
        { key: 'showFilters', type: 'toggle', label: 'Show filter tabs' },
      ],
    },
    {
      id: 'items',
      title: 'Events',
      repeatable: {
        key: 'items',
        itemLabel: 'Event',
        titleKey: 'title',
        emptyHint: 'No events yet.',
        defaultItem: { title: '', date: '', time: '', type: 'Stream', status: 'Upcoming', location: '', platform: '', description: '', topics: [], linkLabel: '', linkUrl: '' },
        exampleItem: {
          title: 'Live build session',
          date: '2026-10-04',
          time: '19:00 - 21:00',
          type: 'Stream',
          status: 'Upcoming',
          location: 'Twitch',
          platform: 'Twitch',
          description: 'Building a profile page from scratch.',
          topics: ['React', 'Live coding'],
          linkLabel: 'Set a reminder',
          linkUrl: 'https://twitch.tv/yourname',
        },
        fields: [
          { key: 'title', type: 'text', label: 'Event title', placeholder: 'Live build session', required: true, max: 70 },
          { key: 'date', type: 'text', label: 'Date', placeholder: '2026-10-04', hint: 'Use YYYY-MM-DD so the calendar can place it.', max: 10 },
          { key: 'time', type: 'text', label: 'Time', placeholder: '19:00 - 21:00', max: 30 },
          {
            key: 'type',
            type: 'choice',
            label: 'Kind',
            fallback: 'Stream',
            options: [
              { value: 'Stream', label: 'Stream' },
              { value: 'Workshop', label: 'Workshop' },
              { value: 'Conference', label: 'Conference' },
              { value: 'Meetup', label: 'Meetup' },
              { value: 'Launch', label: 'Launch' },
            ],
          },
          {
            key: 'status',
            type: 'choice',
            label: 'Status',
            fallback: 'Upcoming',
            options: [
              { value: 'Upcoming', label: 'Upcoming' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'Registration Open', label: 'Registration open' },
              { value: 'Live Now', label: 'Live now' },
              { value: 'Sold Out', label: 'Sold out' },
              { value: 'Completed / Past', label: 'Past' },
            ],
          },
          { key: 'location', type: 'text', label: 'Where', placeholder: 'Twitch, Berlin, Zoom', aliases: ['platform'], max: 60 },
          { key: 'description', type: 'textarea', label: 'Details', placeholder: 'What happens at this event.', max: 300, rows: 3 },
          { key: 'topics', type: 'tags', label: 'Topics' },
          { key: 'linkLabel', type: 'text', label: 'Button text', placeholder: 'Set a reminder', max: 24 },
          { key: 'linkUrl', type: 'url', label: 'Button link', placeholder: 'https://twitch.tv/yourname' },
        ],
      },
    },
  ],
};

export default events;
