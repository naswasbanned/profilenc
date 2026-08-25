import { motion } from 'framer-motion';
import { Code2, Gamepad2 } from 'lucide-react';
import './SideToggle.css';

export default function SideToggle({ activeSide, onToggle }) {
  const isHobbies = activeSide === 'cs' || activeSide === 'hobbies';

  return (
    <motion.div
      className="side-toggle-wrapper"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
    >
      <button
        className={`toggle-option ${activeSide === 'dev' ? 'active dev-active' : ''}`}
        onClick={() => onToggle('dev')}
      >
        <Code2 size={16} className="toggle-icon" />
        <span className="toggle-label">Developer</span>
      </button>

      <motion.div
        className="toggle-track"
        onClick={() => onToggle(activeSide === 'dev' ? 'cs' : 'dev')}
        style={{
          justifyContent: activeSide === 'dev' ? 'flex-start' : 'flex-end',
        }}
      >
        <motion.div
          className="toggle-thumb"
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>

      <button
        className={`toggle-option ${isHobbies ? 'active cs-active' : ''}`}
        onClick={() => onToggle('cs')}
      >
        <Gamepad2 size={16} className="toggle-icon" />
        <span className="toggle-label">Hobbies</span>
      </button>
    </motion.div>
  );
}
