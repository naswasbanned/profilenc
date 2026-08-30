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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--accent-color, #00d4ff)' : 'rgba(255,255,255,0.08)',
                background: selectedCategory === cat ? 'color-mix(in srgb, var(--accent-color, #00d4ff) 15%, transparent)' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === cat ? 'var(--accent-color, #00d4ff)' : '#aaa',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
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
        grouped.map((group) => (
          <div key={group.category} className="skills-category">
            <h4 className="skills-category-title">
              <Code2 size={16} />
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
        ))
      )}
    </div>
  );
}
