import { useState } from 'react';
import {
  SiLaravel,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiDocker,
  SiMysql,
  SiPhp,
  SiTypescript,
  SiJavascript,
  SiGit,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiLinux,
  SiVuedotjs,
  SiNextdotjs,
  SiFigma,
} from 'react-icons/si';
import {
  FaJava,
  FaDocker,
  FaGitAlt,
  FaJs,
  FaPython,
  FaPhp,
  FaReact,
  FaNodeJs,
  FaLaravel,
  FaGamepad,
  FaHtml5,
  FaCss3Alt,
} from 'react-icons/fa6';
import { Code2, Globe, Layers, Terminal, Sparkles, Cpu } from 'lucide-react';

const iconMap = {
  SiLaravel: <SiLaravel />,
  FaLaravel: <FaLaravel />,
  SiReact: <SiReact />,
  FaReact: <FaReact />,
  SiTailwindcss: <SiTailwindcss />,
  SiNodedotjs: <SiNodedotjs />,
  FaNodeJs: <FaNodeJs />,
  FaJava: <FaJava />,
  SiDocker: <SiDocker />,
  FaDocker: <FaDocker />,
  SiMysql: <SiMysql />,
  SiPhp: <SiPhp />,
  FaPhp: <FaPhp />,
  SiTypescript: <SiTypescript />,
  SiJavascript: <SiJavascript />,
  FaJs: <FaJs />,
  SiGit: <SiGit />,
  FaGitAlt: <FaGitAlt />,
  SiPython: <SiPython />,
  FaPython: <FaPython />,
  SiPostgresql: <SiPostgresql />,
  SiMongodb: <SiMongodb />,
  SiLinux: <SiLinux />,
  SiVuedotjs: <SiVuedotjs />,
  SiNextdotjs: <SiNextdotjs />,
  SiFigma: <SiFigma />,
  SiHtml5: <FaHtml5 />,
  SiCss3: <FaCss3Alt />,
  FaHtml5: <FaHtml5 />,
  FaCss3: <FaCss3Alt />,
  FaGamepad: <FaGamepad />,
  Code2: <Code2 size={16} />,
  Globe: <Globe size={16} />,
  Layers: <Layers size={16} />,
  Terminal: <Terminal size={16} />,
  Cpu: <Cpu size={16} />,
};

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
                {iconMap[skill.icon] || <Sparkles size={14} />}
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
                    {iconMap[skill.icon] || <Sparkles size={14} />}
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
