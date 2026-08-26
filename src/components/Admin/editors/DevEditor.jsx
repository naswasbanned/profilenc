import { useState } from 'react';
import { Plus } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminField from '../shared/AdminField';

const TIER_OPTIONS = ['Expert', 'Proficient', 'Intermediate', 'Beginner'];
const CATEGORY_OPTIONS = ['Frontend', 'Backend', 'Tools', 'Database', 'DevOps', 'Other'];
const STATUS_OPTIONS = ['Available', 'Limited Slots', 'Booked', 'Paused'];

const subtabs = [
  { id: 'skills', label: 'Tech Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services & Commissions' },
];

export default function DevEditor({
  skills,
  setSkills,
  projects,
  setProjects,
  experience,
  setExperience,
  services,
  setServices,
  token,
}) {
  const [activeTab, setActiveTab] = useState('skills');

  const updateItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const deleteItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const moveItem = (list, setList, fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) return;
    const updated = [...list];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setList(updated);
  };

  return (
    <div>
      <div className="admin-subtabs">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-subtab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills */}
      {activeTab === 'skills' && skills && (
        <div>
          {skills.map((skill, i) => (
            <AdminCard
              key={i}
              index={i}
              totalCount={skills.length}
              onMove={(from, to) => moveItem(skills, setSkills, from, to)}
              title={skill.name || 'New Skill'}
              subtitle={skill.tier}
              hidden={Boolean(skill.hidden)}
              onToggleHide={() => updateItem(skills, setSkills, i, 'hidden', !skill.hidden)}
              onDelete={() => deleteItem(skills, setSkills, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Name" value={skill.name} onChange={(v) => updateItem(skills, setSkills, i, 'name', v)} />
                <AdminField label="Tier" value={skill.tier} onChange={(v) => updateItem(skills, setSkills, i, 'tier', v)} type="select" options={TIER_OPTIONS} />
                <AdminField label="Category" value={skill.category} onChange={(v) => updateItem(skills, setSkills, i, 'category', v)} type="select" options={CATEGORY_OPTIONS} />
                <AdminField label="Experience" value={skill.experience} onChange={(v) => updateItem(skills, setSkills, i, 'experience', v)} />
                <AdminField label="Icon (SI key)" value={skill.icon} onChange={(v) => updateItem(skills, setSkills, i, 'icon', v)} />
                <AdminField label="Color" value={skill.color} onChange={(v) => updateItem(skills, setSkills, i, 'color', v)} type="color" />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setSkills([...skills, { name: '', tier: 'Beginner', category: 'Frontend', icon: '', color: '#ffffff', experience: '', hidden: false }])}
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>
      )}

      {/* Projects */}
      {activeTab === 'projects' && projects && (
        <div>
          {projects.map((project, i) => (
            <AdminCard
              key={i}
              index={i}
              totalCount={projects.length}
              onMove={(from, to) => moveItem(projects, setProjects, from, to)}
              title={project.title || 'New Project'}
              subtitle={`★ ${project.stars || 0}`}
              hidden={Boolean(project.hidden)}
              onToggleHide={() => updateItem(projects, setProjects, i, 'hidden', !project.hidden)}
              onDelete={() => deleteItem(projects, setProjects, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Title" value={project.title} onChange={(v) => updateItem(projects, setProjects, i, 'title', v)} fullWidth />
                <AdminField label="Description" value={project.description} onChange={(v) => updateItem(projects, setProjects, i, 'description', v)} type="textarea" fullWidth />
                <AdminField label="Stars" value={project.stars} onChange={(v) => updateItem(projects, setProjects, i, 'stars', v)} type="number" />
                <AdminField label="Image" value={project.image} onChange={(v) => updateItem(projects, setProjects, i, 'image', v)} type="image" token={token} fullWidth />
                <AdminField label="Tech Stack" value={project.tech} onChange={(v) => updateItem(projects, setProjects, i, 'tech', v)} type="tags" fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setProjects([...projects, { title: '', description: '', tech: [], stars: 0, image: '', hidden: false }])}
          >
            <Plus size={16} /> Add Project
          </button>
        </div>
      )}

      {/* Experience */}
      {activeTab === 'experience' && experience && (
        <div>
          {experience.map((exp, i) => (
            <AdminCard
              key={i}
              index={i}
              totalCount={experience.length}
              onMove={(from, to) => moveItem(experience, setExperience, from, to)}
              title={exp.role || 'New Role'}
              subtitle={exp.company}
              hidden={Boolean(exp.hidden)}
              onToggleHide={() => updateItem(experience, setExperience, i, 'hidden', !exp.hidden)}
              onDelete={() => deleteItem(experience, setExperience, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Role" value={exp.role} onChange={(v) => updateItem(experience, setExperience, i, 'role', v)} fullWidth />
                <AdminField label="Company / Organization" value={exp.company} onChange={(v) => updateItem(experience, setExperience, i, 'company', v)} />
                <AdminField label="Period" value={exp.period} onChange={(v) => updateItem(experience, setExperience, i, 'period', v)} placeholder="e.g. 2023 — Present" />
                <AdminField label="Live / Project Link (Optional)" value={exp.link} onChange={(v) => updateItem(experience, setExperience, i, 'link', v)} type="url" placeholder="https://example.com" />
                <AdminField label="GitHub Repository (Optional)" value={exp.github} onChange={(v) => updateItem(experience, setExperience, i, 'github', v)} type="url" placeholder="https://github.com/..." />
                <AdminField label="Description" value={exp.description} onChange={(v) => updateItem(experience, setExperience, i, 'description', v)} type="textarea" fullWidth />
                <AdminField label="Experience Showcase Images" value={exp.images} onChange={(v) => updateItem(experience, setExperience, i, 'images', v)} type="images" token={token} fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setExperience([...experience, { role: '', company: '', period: '', link: '', github: '', description: '', images: [], hidden: false }])}
          >
            <Plus size={16} /> Add Experience
          </button>
        </div>
      )}

      {/* Services & Commissions */}
      {activeTab === 'services' && services && (
        <div>
          {services.map((service, i) => (
            <AdminCard
              key={i}
              index={i}
              totalCount={services.length}
              onMove={(from, to) => moveItem(services, setServices, from, to)}
              title={service.title || 'New Service'}
              subtitle={`${service.startingPrice || 'Price TBD'} • ${service.status || 'Available'}`}
              hidden={Boolean(service.hidden)}
              onToggleHide={() => updateItem(services, setServices, i, 'hidden', !service.hidden)}
              onDelete={() => deleteItem(services, setServices, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Title" value={service.title} onChange={(v) => updateItem(services, setServices, i, 'title', v)} fullWidth />
                <AdminField label="Badge" value={service.badge} onChange={(v) => updateItem(services, setServices, i, 'badge', v)} placeholder="e.g. Popular, High Performance" />
                <AdminField label="Status" value={service.status} onChange={(v) => updateItem(services, setServices, i, 'status', v)} type="select" options={STATUS_OPTIONS} />
                <AdminField label="Icon" value={service.icon} onChange={(v) => updateItem(services, setServices, i, 'icon', v)} placeholder="Globe, Terminal, Layers, Code2" />
                <AdminField label="Starting Price" value={service.startingPrice} onChange={(v) => updateItem(services, setServices, i, 'startingPrice', v)} placeholder="e.g. $150" />
                <AdminField label="Delivery Time" value={service.deliveryTime} onChange={(v) => updateItem(services, setServices, i, 'deliveryTime', v)} placeholder="e.g. 1 - 2 weeks" />
                <AdminField label="Cover Image" value={service.image} onChange={(v) => updateItem(services, setServices, i, 'image', v)} type="image" token={token} fullWidth />
                <AdminField label="Gallery Images" value={service.images} onChange={(v) => updateItem(services, setServices, i, 'images', v)} type="images" token={token} fullWidth />
                <AdminField label="Action URL / Mailto" value={service.actionUrl} onChange={(v) => updateItem(services, setServices, i, 'actionUrl', v)} type="url" fullWidth placeholder="mailto:example@domain.com?subject=Commission" />
                <AdminField label="Description" value={service.description} onChange={(v) => updateItem(services, setServices, i, 'description', v)} type="textarea" fullWidth />
                <AdminField label="Deliverables / Features" value={service.deliverables} onChange={(v) => updateItem(services, setServices, i, 'deliverables', v)} type="tags" fullWidth />
                <AdminField label="Tech Stack" value={service.tech} onChange={(v) => updateItem(services, setServices, i, 'tech', v)} type="tags" fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() =>
              setServices([
                ...services,
                {
                  id: `service-${Date.now()}`,
                  title: '',
                  badge: 'New',
                  icon: 'Globe',
                  status: 'Available',
                  startingPrice: '$100',
                  deliveryTime: '1 week',
                  image: '',
                  images: [],
                  actionUrl: '',
                  description: '',
                  deliverables: [],
                  tech: [],
                },
              ])
            }
          >
            <Plus size={16} /> Add Service
          </button>
        </div>
      )}
    </div>
  );
}

