import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Palette,
  ExternalLink,
  LogOut,
  Layout,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './DashboardPage.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !user) {
    return (
      <div className="dashboard-loading">
        <div className="profile-loading-spinner" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg-effects">
        <div className="dashboard-orb orb-1" />
        <div className="dashboard-orb orb-2" />
      </div>

      <nav className="dashboard-nav">
        <Link to="/" className="dashboard-logo">
          <Sparkles size={18} />
          <span>GNC</span>
        </Link>
        <div className="dashboard-nav-right">
          <Link to={`/@${user.username}`} className="dashboard-nav-link">
            <ExternalLink size={14} /> View Profile
          </Link>
          <button className="dashboard-logout" onClick={handleLogout}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </nav>

      <motion.div
        className="dashboard-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="dashboard-header" variants={itemVariants}>
          <div className="dashboard-avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} />
            ) : (
              <span>{(user.displayName || user.username)[0].toUpperCase()}</span>
            )}
          </div>
          <h1>Welcome, {user.displayName || user.username}</h1>
          <p className="dashboard-url">
            gnc.web.id/<span>@{user.username}</span>
          </p>
        </motion.div>

        <div className="dashboard-grid">
          <motion.div
            className="dashboard-card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/@${user.username}/edit`)}
          >
            <div className="dash-card-icon" style={{ '--card-color': '#00d4ff' }}>
              <Palette size={24} />
            </div>
            <h3>Visual Editor</h3>
            <p>Customize colors, fonts, backgrounds, and layout live.</p>
          </motion.div>

          <motion.div
            className="dashboard-card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/@${user.username}`)}
          >
            <div className="dash-card-icon" style={{ '--card-color': '#a855f7' }}>
              <User size={24} />
            </div>
            <h3>View Profile</h3>
            <p>See your public profile as visitors see it.</p>
          </motion.div>

          <motion.div
            className="dashboard-card"
            variants={itemVariants}
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/@${user.username}/edit`)}
          >
            <div className="dash-card-icon" style={{ '--card-color': '#f472b6' }}>
              <Layout size={24} />
            </div>
            <h3>Edit Content</h3>
            <p>Update your projects, skills, bio, and more.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
