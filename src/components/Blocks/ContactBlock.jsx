import { useState, useEffect, useRef, useId } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Loader2, Check, AlertCircle, LogIn, Mail } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { contactPlaceholder } from '../../lib/contactPlaceholder';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const DEFAULT_MAX = { text: 200, email: 200, select: 200, textarea: 5000 };

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    let script = document.querySelector('script[data-turnstile]');
    if (!script) {
      script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.dataset.turnstile = 'true';
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve(window.turnstile));
    script.addEventListener('error', reject);
  });
}

/**
 * Public contact form. Submissions land in the profile owner's dashboard inbox.
 * The block fetches nothing on mount, so it needs no data gating.
 */
export default function ContactBlock({ data = {}, block, isEditing = false, isPreview = false }) {
  const { username: rawName } = useParams();
  const username = (rawName || '').replace(/^@/, '').toLowerCase();
  const { user, loading: authLoading } = useAuth();
  const formId = useId();

  const fields = Array.isArray(data.fields) ? data.fields : [];
  const mode = ['anonymous', 'login', 'either'].includes(data.mode) ? data.mode : 'either';
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const disabledByEditor = isEditing || isPreview;

  const [values, setValues] = useState({});
  const [anonymous, setAnonymous] = useState(false);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [successText, setSuccessText] = useState('');
  const [token, setToken] = useState('');
  const renderedAt = useRef(0);
  const turnstileEl = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const needsWidget = Boolean(siteKey) && status !== 'sent' && !disabledByEditor;
  useEffect(() => {
    if (!needsWidget) return undefined;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !turnstileEl.current || !ts) return;
        widgetId.current = ts.render(turnstileEl.current, {
          sitekey: siteKey,
          callback: (t) => setToken(t),
          'expired-callback': () => setToken(''),
        });
      })
      .catch(() => setError('Could not load the verification check.'));
    return () => {
      cancelled = true;
      if (widgetId.current !== null && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, [needsWidget, siteKey]);

  const isOwner = Boolean(user) && user.username?.toLowerCase() === username;
  const needsLogin = mode === 'login' && !user && !authLoading;

  const setValue = (id, value) => setValues((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabledByEditor || status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const res = await apiFetch(`/api/u/${encodeURIComponent(username)}/messages`, {
        method: 'POST',
        body: {
          block_id: block?.id,
          answers: values,
          anonymous: mode === 'either' && Boolean(user) && anonymous,
          website,
          rendered_at: renderedAt.current,
          turnstile_token: token || undefined,
        },
      });
      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      if (!res.ok) {
        setError(body?.error || 'Could not send your message.');
        setStatus('error');
        if (widgetId.current !== null && window.turnstile) {
          window.turnstile.reset(widgetId.current);
          setToken('');
        }
        return;
      }
      setSuccessText(body?.message || data.successMessage || 'Message sent.');
      setStatus('sent');
    } catch {
      setError('Could not send your message. Check your connection and try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setValues({});
    setAnonymous(false);
    setToken('');
    setError('');
    setStatus('idle');
    renderedAt.current = Date.now();
  };

  const align = ['left', 'center', 'right'].includes(data.align) ? data.align : 'center';
  const size = data.size === 'full' ? 'full' : 'compact';
  const rootClass = `contact-block contact-align-${align} contact-size-${size}`;

  const intro = typeof data.intro === 'string' && data.intro.trim() ? data.intro : '';
  const submitLabel = (typeof data.submitLabel === 'string' && data.submitLabel.trim()) || 'Send message';

  if (isOwner && !disabledByEditor) {
    return (
      <div className={rootClass}>
        <p className="contact-block-note">
          <Mail size={16} aria-hidden="true" />
          This is your contact form. Visitors will see a form here; their messages arrive in your dashboard inbox.
        </p>
      </div>
    );
  }

  if (needsLogin && !disabledByEditor) {
    return (
      <div className={rootClass}>
        {intro && <h4 className="contact-intro">{intro}</h4>}
        <p className="contact-block-note">
          <LogIn size={16} aria-hidden="true" />
          <span>
            <Link className="contact-block-link" to="/login">Log in</Link> to send a message.
          </span>
        </p>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div className={`${rootClass} contact-block-success`} role="status">
        <p className="contact-block-note">
          <Check size={16} aria-hidden="true" />
          {successText}
        </p>
        <button type="button" className="hero-btn secondary contact-block-submit" onClick={reset}>
          Send another
        </button>
      </div>
    );
  }

  const submitDisabled =
    disabledByEditor || status === 'sending' || fields.length === 0 || (Boolean(siteKey) && !token);

  return (
    <div className={rootClass}>
      {intro && <h4 className="contact-intro">{intro}</h4>}

      <form className="contact-block-form" onSubmit={handleSubmit} noValidate={false}>
        {fields.map((field) => {
          const inputId = `${formId}-${field.id}`;
          const max = Math.min(
            Number.isFinite(field.maxLength) && field.maxLength > 0 ? field.maxLength : DEFAULT_MAX[field.type] || 200,
            5000
          );
          const value = values[field.id] || '';
          return (
            <div className="contact-block-field" key={field.id}>
              <label className="contact-block-label" htmlFor={inputId}>
                {field.label}
                {field.required && <span aria-hidden="true"> *</span>}
              </label>
              {field.type === 'textarea' ? (
                <>
                  <textarea
                    id={inputId}
                    className="contact-block-input"
                    value={value}
                    required={Boolean(field.required)}
                    maxLength={max}
                    placeholder={contactPlaceholder(field.label)}
                    aria-describedby={`${inputId}-count`}
                    onChange={(e) => setValue(field.id, e.target.value)}
                  />
                  <span className="contact-block-counter" id={`${inputId}-count`}>{value.length} / {max}</span>
                </>
              ) : field.type === 'select' ? (
                <select
                  id={inputId}
                  className="contact-block-input"
                  value={value}
                  required={Boolean(field.required)}
                  onChange={(e) => setValue(field.id, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {(Array.isArray(field.options) ? field.options : []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={inputId}
                  className="contact-block-input"
                  type={field.type === 'email' ? 'email' : 'text'}
                  value={value}
                  required={Boolean(field.required)}
                  maxLength={max}
                  placeholder={contactPlaceholder(field.label)}
                  onChange={(e) => setValue(field.id, e.target.value)}
                />
              )}
            </div>
          );
        })}

        {mode === 'either' && user && (
          <label className="contact-block-check">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Send anonymously
          </label>
        )}

        {/* Honeypot: hidden from people, filled in by naive bots */}
        <div className="contact-block-hp" aria-hidden="true">
          <label htmlFor={`${formId}-website`}>Website</label>
          <input
            id={`${formId}-website`}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {siteKey && !disabledByEditor && <div ref={turnstileEl} />}

        <div aria-live="polite">
          {error && (
            <p className="contact-block-error" role="alert">
              <AlertCircle size={14} aria-hidden="true" /> {error}
            </p>
          )}
        </div>

        <button type="submit" className="hero-btn primary contact-block-submit" disabled={submitDisabled} title={disabledByEditor ? 'Submitting is disabled while editing' : undefined} aria-busy={status === 'sending'}>
          {status === 'sending' ? (
            <Loader2 size={16} className="contact-block-spin" aria-hidden="true" />
          ) : (
            <Send size={16} aria-hidden="true" />
          )}
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
