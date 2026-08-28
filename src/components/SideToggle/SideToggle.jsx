import { motion } from 'framer-motion';
import { Code2, Gamepad2, BookHeart } from 'lucide-react';
import './SideToggle.css';

const tabs = [
  { id: 'dev', label: 'Developer', icon: Code2 },
  { id: 'hobbies', label: 'Hobbies', icon: Gamepad2 },
  { id: 'diary', label: 'Diary', icon: BookHeart },
];

export default function SideToggle({ activeSide, onToggle, sidesVisibility = null }) {
  // Normalize legacy 'cs' value to 'hobbies'
  const active = activeSide === 'cs' ? 'hobbies' : activeSide;

  const visibleTabs = tabs.filter((tab) => {
    if (!sidesVisibility) return true;
    return sidesVisibility[tab.id] !== false;
  });

  // If only 1 or 0 sides are visible, hide top switcher bar
  if (visibleTabs.length <= 1) return null;

  return (
    <motion.div
      className="side-toggle-wrapper"
      initial={{ x: '-50%', y: -80, opacity: 0 }}
      animate={{ x: '-50%', y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
    >
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`toggle-option ${isActive ? `active ${tab.id}-active` : ''}`}
            onClick={() => onToggle(tab.id)}
          >
            {Icon && <Icon size={16} className="toggle-icon" />}
            <span className="toggle-label">{tab.label}</span>
            {isActive && (
              <motion.div
                className="toggle-active-bar"
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </motion.div>
  );
}
