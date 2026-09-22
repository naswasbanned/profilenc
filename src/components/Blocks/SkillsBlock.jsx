import { useState } from 'react';
import { Code2 } from 'lucide-react';
import { TechIcon } from '../../utils/techIconUtils';

export default function SkillsBlock({ data = {} }) {
  const { items = [] } = data;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const skillList = Array.isArray(items) ? items : [];

  if (skillList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#666', fontSize: '0.85rem' }}>
        No skills added yet. Click Edit to add skills.
      </div>
    );
  }

  // Extract categories
  const categories = ['All', ...new Set(skillList.map((s) => s.category).filter(Boolean))];

  const filtered = selectedCategory === 'All'
    ? skillList
    : skillList.filter((s) => s.category === selectedCategory);

  // Group by category if viewing 'All'
  const grouped = categories
    .filter((c) => c !== 'All')
    .map((cat) => ({
      category: cat,
      skills: skillList.filter((s) => s.category === cat),
    }));

  return (
    <div className="skills-block-wrap">
      {/* Category Pills Filter (if more than 1 category) */}
      {categories.length > 2 && (
        <div className="skills-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`skills-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {selectedCategory !== 'All' ? (
        <div className="skills-grid">
          {filtered.map((skill, idx) => (
            <div
              key={idx}
              className="skill-pill"
              style={{ '--pill-color': skill.color || '#00d4ff' }}
            >
              <span className="skill-icon" style={{ color: skill.color || '#00d4ff' }}>
                <TechIcon
                  name={skill.name}
                  icon={skill.icon}
                  color={skill.color || '#00d4ff'}
                  size={15}
                />
              </span>
              <span>{skill.name}</span>
              {skill.tier && <span className="skill-tier">{skill.tier}</span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="skills-categories-grid">
          {grouped.map((group) => (
            <div key={group.category} className="skills-category">
              <h4 className="skills-category-title">
                <Code2 size={15} />
                <span>{group.category}</span>
              </h4>
              <div className="skills-grid">
                {group.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="skill-pill"
                    style={{ '--pill-color': skill.color || '#00d4ff' }}
                  >
                    <span className="skill-icon" style={{ color: skill.color || '#00d4ff' }}>
                      <TechIcon
                        name={skill.name}
                        icon={skill.icon}
                        color={skill.color || '#00d4ff'}
                        size={15}
                      />
                    </span>
                    <span>{skill.name}</span>
                    {skill.tier && <span className="skill-tier">{skill.tier}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
