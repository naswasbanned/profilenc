import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCanvas from '../components/Profile/ProfileCanvas';
import { ThemeProvider } from '../contexts/ThemeContext';
import { apiFetch } from '../lib/api';
import { normalizeModularContent } from '../lib/profileContent';

export default function ProfilePage() {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, '');

  const [theme, setTheme] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTabId, setActiveTabId] = useState(null);

  useEffect(() => {
    if (!username) return;

    // Set page title for user profile page
    document.title = `Profilenc, @${username}`;

    async function load() {
      try {
        const [themeRes, contentRes, profileRes] = await Promise.all([
          apiFetch(`/api/u/${username}/theme`, { token: null }),
          apiFetch(`/api/u/${username}/content`, { token: null }),
          apiFetch(`/api/u/${username}`, { token: null }),
        ]);

        if (!profileRes.ok) {
          if (profileRes.status === 404) setError('Profile not found');
          else if (profileRes.status === 403) setError('This profile is private');
          else setError('Failed to load profile');
          setLoading(false);
          return;
        }

        const rawData = contentRes.ok ? await contentRes.json() : {};
        const normalized = normalizeModularContent(rawData, username);

        setTheme(themeRes.ok ? await themeRes.json() : {});
        setContent(normalized);
        setActiveTabId(normalized.tabs?.[0]?.id || null);
        setLoading(false);
      } catch {
        setError('Failed to load profile');
        setLoading(false);
      }
    }

    load();

    return () => {
      document.title = 'Profilenc';
    };
  }, [username]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <h2>{error}</h2>
        <p>The profile you're looking for doesn't exist or isn't accessible.</p>
        <a href="/" style={{ color: '#00d4ff', textDecoration: 'underline', marginTop: '8px' }}>Go Home</a>
      </div>
    );
  }

  return (
    <ThemeProvider username={username} initialTheme={theme}>
      <ProfileCanvas
        username={username}
        content={content}
        isEditing={false}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
      />
    </ThemeProvider>
  );
}
