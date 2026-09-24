import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Code2,
  Palette,
  Gamepad2,
  PenLine,
  Layout,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';
import { useUiTheme } from '../hooks/useUiTheme';

const TEMPLATE_OPTIONS = [
  { slug: 'developer', name: 'Developer', icon: <Code2 size={20} />, color: 'var(--mint)', desc: 'Code stack, work experience & repositories' },
  { slug: 'designer', name: 'Designer', icon: <Palette size={20} />, color: 'var(--coral)', desc: 'Visual portfolio, services & rate cards' },
  { slug: 'gamer', name: 'Gamer / Streamer', icon: <Gamepad2 size={20} />, color: 'var(--lavender)', desc: 'Streaming schedule, game reviews & gear setup' },
  { slug: 'minimal', name: 'Minimal Writer', icon: <PenLine size={20} />, color: 'var(--butter)', desc: 'Editorial essays, reading notes & focus reader' },
  { slug: 'creative', name: 'Creative Multi-Hyphenate', icon: <Layout size={20} />, color: 'var(--blue)', desc: 'Modular canvas mixing all available blocks' },
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
  const [usernameStatus, setUsernameStatus] = useState(null); // null, 'checking', 'available', 'taken'
  const { theme, toggleTheme } = useUiTheme();

  useEffect(() => {
    document.title = 'Profilenc — Create Account';
  }, []);


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
    }, 400);

    return () => clearTimeout(timer);
  }, [form.username, checkUsername]);

  const handleStep1 = (e) => {
    e.preventDefault();
    if (usernameStatus === 'taken') {
      setError('Username is already taken');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleRegister = async () => {
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
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Matrix Texture */}
      <div className="raw-grid-matrix" aria-hidden="true" />

      <motion.div
        className={`auth-card ${step === 2 ? 'auth-card-wide' : ''}`}
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
          <div className="auth-eyebrow">
            {step === 1 ? 'Get Started' : 'Starter Foundation'}
          </div>
          <h1 className="auth-title">
            {step === 1 ? 'Create your profile' : 'Pick a starter template'}
          </h1>
          <p className="auth-sub">
            {step === 1
              ? 'Claim your personal link and start building your modular page.'
              : 'Choose a foundation — you can customize all blocks and colors anytime in the editor.'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>
            <span>01</span> Account
          </div>
          <div className="auth-step-line" />
          <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
            <span>02</span> Template
          </div>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span className="error-tag">Error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Account Details */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="auth-form">
            <div className="auth-field">
              <label>Claim Username</label>
              <div className="auth-username-wrap">
                <span className="auth-username-prefix">profilenc.my.id/@</span>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    }))
                  }
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
              <label>Email Address</label>
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit">
              <span>Continue to Templates</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Step 2: Template Selection */}
        {step === 2 && (
          <div className="template-selection">
            <div className="template-options">
              {TEMPLATE_OPTIONS.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  className={`template-option ${form.templateSlug === t.slug ? 'selected' : ''}`}
                  style={{ '--tmpl-color': t.color }}
                  onClick={() => setForm((p) => ({ ...p, templateSlug: t.slug }))}
                >
                  <div className="tmpl-top">
                    <div className="tmpl-icon">{t.icon}</div>
                    {form.templateSlug === t.slug && (
                      <span className="tmpl-active-badge">Selected</span>
                    )}
                  </div>
                  <h4>{t.name}</h4>
                  <p>{t.desc}</p>
                </button>
              ))}
            </div>

            <div className="template-actions">
              <button
                type="button"
                className="auth-submit auth-submit-secondary"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="button"
                className="auth-submit"
                onClick={handleRegister}
                disabled={loading}
              >
                <span>{loading ? 'Creating Profile...' : 'Initialize Profile'}</span>
                <UserPlus size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="auth-switch">
            <span>Already have an account?</span>
            <Link to="/login">Log in →</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
