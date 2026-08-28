import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Code2,
  Palette,
  Gamepad2,
  PenLine,
  Layout,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

const TEMPLATE_OPTIONS = [
  { slug: 'developer', name: 'Developer', icon: <Code2 size={24} />, color: '#64ffda', desc: 'Portfolio for devs' },
  { slug: 'designer', name: 'Designer', icon: <Palette size={24} />, color: '#f472b6', desc: 'Visual-first portfolio' },
  { slug: 'gamer', name: 'Gamer', icon: <Gamepad2 size={24} />, color: '#a855f7', desc: 'Gaming profile & setup' },
  { slug: 'minimal', name: 'Minimal', icon: <Layout size={24} />, color: '#fbbf24', desc: 'Clean single-page' },
  { slug: 'creative', name: 'Creative', icon: <PenLine size={24} />, color: '#34d399', desc: 'Artistic & vibrant' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, checkUsername } = useAuth();
  const [step, setStep] = useState(1); // 1 = account, 2 = template
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    templateSlug: 'developer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null, 'checking', 'available', 'taken', 'invalid'

  // Debounced username check
  useEffect(() => {
    if (!form.username || form.username.length < 3) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const result = await checkUsername(form.username);
        setUsernameStatus(result.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.username, checkUsername]);

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (usernameStatus === 'taken') {
      setError('Username already taken');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const user = await register(
        form.username,
        form.email,
        form.password,
        form.templateSlug
      );
      navigate(`/@${user.username}/edit`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-effects">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <motion.div
        className="auth-card auth-card-wide"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={20} />
            <span>GNC</span>
          </div>
          <h1>{step === 1 ? 'Create Your Account' : 'Choose a Template'}</h1>
          <p>{step === 1 ? 'Start building your profile in seconds' : 'Pick a starting point — you can change everything later'}</p>
        </div>

        {/* Step indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span> Account
          </div>
          <div className="auth-step-line" />
          <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span> Template
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Step 1: Account details */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="auth-form">
            <div className="auth-field">
              <label>Username</label>
              <div className="auth-username-wrap">
                <span className="auth-username-prefix">gnc.web.id/@</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                  placeholder="yourname"
                  required
                  autoFocus
                  minLength={3}
                  maxLength={30}
                />
                {usernameStatus && (
                  <span className={`username-status ${usernameStatus}`}>
                    {usernameStatus === 'checking' && '...'}
                    {usernameStatus === 'available' && <Check size={16} />}
                    {usernameStatus === 'taken' && <X size={16} />}
                  </span>
                )}
              </div>
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit">
              Continue <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Step 2: Template selection */}
        {step === 2 && (
          <div className="template-selection">
            <div className="template-options">
              {TEMPLATE_OPTIONS.map((t) => (
                <motion.button
                  key={t.slug}
                  className={`template-option ${form.templateSlug === t.slug ? 'selected' : ''}`}
                  style={{ '--tmpl-color': t.color }}
                  onClick={() => setForm((p) => ({ ...p, templateSlug: t.slug }))}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="tmpl-icon">{t.icon}</div>
                  <h4>{t.name}</h4>
                  <p>{t.desc}</p>
                  {form.templateSlug === t.slug && (
                    <div className="tmpl-check"><Check size={16} /></div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="template-actions">
              <button
                className="auth-submit auth-submit-secondary"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                className="auth-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : <>Create Profile <UserPlus size={16} /></>}
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
