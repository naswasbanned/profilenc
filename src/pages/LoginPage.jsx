import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, ArrowLeft, AlertCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('profilenc_theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.title = 'Profilenc — Log In';
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      localStorage.setItem('profilenc_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      return;
    }

    const rect = e?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const y = rect ? rect.top + rect.height / 2 : 0;

    const maxDist = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const endRadius = Math.ceil(maxDist) + 40;

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
      localStorage.setItem('profilenc_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

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
      {/* Background Matrix Texture */}
      <div className="raw-grid-matrix" aria-hidden="true" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="auth-top-bar">
          <Link to="/" className="auth-back">
            <ArrowLeft size={14} /> <span>Back to Home</span>
          </Link>
          <button
            type="button"
            className="fn-theme-toggle fn-theme-toggle-compact"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <div className="auth-header">
          <Link to="/" className="fn-logo">
            <span className="fn-logo-mark">
              <img src="/logo.svg" alt="" aria-hidden="true" />
            </span>
            Profilenc
          </Link>
          <div className="auth-eyebrow">Welcome Back</div>
          <h1 className="auth-title">Log in to your profile</h1>
          <p className="auth-sub">Access your personal profile, modular blocks, and studio editor.</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span className="error-tag">Error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Username or Email</label>
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
            <label>Password</label>
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            <span>{loading ? 'Logging in...' : 'Log in to Profile'}</span>
            <LogIn size={16} />
          </button>
        </form>

        <div className="auth-switch">
          <span>Don't have an account?</span>
          <Link to="/register">Create profile →</Link>
        </div>
      </motion.div>
    </div>
  );
}
