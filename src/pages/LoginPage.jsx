import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Profilenc — Log In';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form.login, form.password);
      if (user.isAdmin || user.username === 'nas' || user.username === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Matrix Grid */}
      <div className="raw-grid-matrix" aria-hidden="true" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/" className="auth-back">
          <ArrowLeft size={14} /> <span>BACK TO HOME</span>
        </Link>

        <div className="auth-header">
          <Link to="/" className="auth-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.svg" alt="Profilenc Logo" style={{ width: '24px', height: '24px' }} />
            <span className="brand-name">PROFILENC</span>
          </Link>
          <h1 className="auth-title">LOG IN</h1>
          <p className="auth-sub">Access your personal profile and studio editor.</p>
        </div>

        {error && (
          <div className="auth-error">
            <span className="error-tag">[ERROR]</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>USERNAME OR EMAIL</label>
            <input
              type="text"
              value={form.login}
              onChange={(e) => setForm((p) => ({ ...p, login: e.target.value }))}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label>PASSWORD</label>
            <div className="auth-password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            <span>{loading ? 'LOGGING IN...' : 'LOG IN TO PROFILE'}</span>
            <LogIn size={15} />
          </button>
        </form>

        <div className="auth-switch">
          <span>DON'T HAVE AN ACCOUNT?</span>
          <Link to="/register">CREATE PROFILE →</Link>
        </div>
      </motion.div>
    </div>
  );
}
