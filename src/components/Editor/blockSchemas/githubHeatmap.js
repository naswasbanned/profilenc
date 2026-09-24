/** Editing schema for the `github_heatmap` block. */
const githubHeatmap = {
  type: 'github_heatmap',
  label: 'GitHub activity',
  blurb: 'Your public contribution calendar, pulled live from GitHub.',
  groups: [
    {
      id: 'content',
      title: 'Account',
      fields: [
        { key: 'username', type: 'text', label: 'GitHub username', placeholder: 'octocat', required: true, hint: 'Only public contributions are counted.', max: 39 },
        { key: 'showStats', type: 'toggle', label: 'Show the totals bar' },
      ],
    },
  ],
};

export default githubHeatmap;
