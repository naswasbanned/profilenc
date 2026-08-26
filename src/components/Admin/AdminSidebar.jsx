import {
  User,
  Code2,
  Gamepad2,
  Swords,
  Film,
  BookHeart,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'developer', label: 'Developer', icon: Code2 },
  { id: 'hobbies', label: 'Hobbies', icon: Gamepad2 },
  { id: 'games', label: 'Games', icon: Swords },
  { id: 'movies', label: 'Movies & Series', icon: Film },
  { id: 'diary', label: 'Diary', icon: BookHeart },
];

export default function AdminSidebar({ activeSection, onSectionChange }) {
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2>// ADMIN</h2>
        <p>Content Manager</p>
      </div>

      <nav className="admin-sidebar-nav">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              type="button"
              className={`admin-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
            >
              <Icon size={16} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="admin-sidebar-back">
        <button
          type="button"
          className="admin-back-btn"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={14} />
          <span>Back to Site</span>
        </button>
      </div>
    </aside>
  );
}
