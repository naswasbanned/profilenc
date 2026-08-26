import { useState } from 'react';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', data.token);
      onLogin(data.token);
    } catch {
      setError('Network error. Is the backend running?');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <div className="admin-login-header">
          <Lock size={24} />
          <h2>Admin Login</h2>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <div className="admin-login-field">
          <User size={16} />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="admin-login-field">
          <Lock size={16} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="admin-login-btn" disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
