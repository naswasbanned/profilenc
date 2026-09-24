/** Editing schema for the `skills` block. */
const skills = {
  type: 'skills',
  label: 'Skills and tools',
  blurb: 'Badges for the tools you work with. Brand icons are detected from the name.',
  groups: [
    {
      id: 'items',
      title: 'Skills',
      repeatable: {
        key: 'items',
        itemLabel: 'Skill',
        titleKey: 'name',
        emptyHint: 'No skills yet. Add a language, framework or tool.',
        defaultItem: { name: '', category: '', tier: 'Proficient', color: '', icon: '' },
        exampleItem: { name: 'Go', category: 'Backend', tier: 'Proficient', color: '#00ADD8', icon: 'go' },
        fields: [
          { key: 'name', type: 'text', label: 'Name', placeholder: 'Go, Next.js, Figma', required: true, max: 40 },
          { key: 'category', type: 'text', label: 'Group', placeholder: 'Languages, Frontend, Design', hint: 'Skills are grouped by this label.', max: 30 },
          {
            key: 'tier',
            type: 'choice',
            label: 'Level',
            fallback: 'Proficient',
            options: [
              { value: 'Expert', label: 'Expert' },
              { value: 'Proficient', label: 'Proficient' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Beginner', label: 'Beginner' },
            ],
          },
          { key: 'icon', type: 'techIcon', label: 'Icon and colour' },
        ],
      },
    },
  ],
};

export default skills;
