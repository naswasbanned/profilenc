import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogIn, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { ProfileCanvas, normalizeModularContent } from './ProfilePage';
import EditorOverlay from '../components/Editor/EditorOverlay';
import '../pages/DashboardPage.css';
import '../pages/AuthPages.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

function EditorCanvasInner({
  username,
  content,
  setContent,
  token,
}) {
  const { theme: currentTheme } = useTheme();
  const [activeTabId, setActiveTabId] = useState(() => content?.tabs?.[0]?.id || 'tab-main');
  const [editingBlock, setEditingBlock] = useState(null);

  // Snapshot references for dirty state tracking
  const initialContentStr = useRef(JSON.stringify(content));
  const initialThemeStr = useRef(JSON.stringify(currentTheme));

  const isContentDirty = useMemo(() => {
    return JSON.stringify(content) !== initialContentStr.current;
  }, [content]);

  const isThemeDirty = useMemo(() => {
    return JSON.stringify(currentTheme) !== initialThemeStr.current;
  }, [currentTheme]);

  const hasChanges = isContentDirty || isThemeDirty;

  // Warn user if closing or reloading the browser tab with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const tabs = content?.tabs || [];
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Block Manipulation Handlers
  const handleAddBlock = useCallback((newBlock) => {
    setContent((prev) => {
      const updatedTabs = (prev.tabs || []).map((t) => {
        if (t.id === (currentTab?.id || t.id)) {
          return {
            ...t,
            blocks: [...(t.blocks || []), newBlock],
          };
        }
        return t;
      });
      return { ...prev, tabs: updatedTabs };
    });
  }, [currentTab]);

  const handleEditBlock = useCallback((updatedBlock) => {
    setContent((prev) => {
      const updatedTabs = (prev.tabs || []).map((t) => ({
        ...t,
        blocks: (t.blocks || []).map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
      }));
      return { ...prev, tabs: updatedTabs };
    });
  }, []);

  const handleMoveBlock = useCallback((fromIndex, toIndex) => {
    setContent((prev) => {
      const updatedTabs = (prev.tabs || []).map((t) => {
        if (t.id === currentTab?.id) {
          const blocks = [...(t.blocks || [])];
          const [moved] = blocks.splice(fromIndex, 1);
          blocks.splice(toIndex, 0, moved);
          return { ...t, blocks };
        }
        return t;
      });
      return { ...prev, tabs: updatedTabs };
    });
  }, [currentTab]);

  const handleDeleteBlock = useCallback((blockId) => {
    if (!window.confirm('Delete this block?')) return;
    setContent((prev) => {
      const updatedTabs = (prev.tabs || []).map((t) => ({
        ...t,
        blocks: (t.blocks || []).filter((b) => b.id !== blockId),
      }));
      return { ...prev, tabs: updatedTabs };
    });
  }, []);

  const handleUpdateTabs = useCallback((newTabs) => {
    setContent((prev) => ({ ...prev, tabs: newTabs }));
    if (!newTabs.some((t) => t.id === activeTabId)) {
      setActiveTabId(newTabs[0]?.id || 'tab-main');
    }
  }, [activeTabId]);

  // Master Save Handler
  const handleSaveAll = useCallback(async () => {
    // 1. Save modular tabs structure
    const contentRes = await fetch(`${API_BASE}/api/u/${username}/content/modular_profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    });

    if (!contentRes.ok) throw new Error('Failed to save profile content');

    // 2. Also save current live theme
    const themeRes = await fetch(`${API_BASE}/api/u/${username}/theme`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(currentTheme),
    });

    if (!themeRes.ok) throw new Error('Failed to save theme');

    // Update snapshots to mark as clean & saved
    initialContentStr.current = JSON.stringify(content);
    initialThemeStr.current = JSON.stringify(currentTheme);
  }, [username, token, content, currentTheme]);

  return (
    <div className="editor-page" style={{ paddingTop: '52px', paddingBottom: '90px' }}>
      <ProfileCanvas
        username={username}
        content={content}
        isEditing={true}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        onEditBlock={(block) => setEditingBlock(block)}
        onMoveBlock={handleMoveBlock}
        onDeleteBlock={handleDeleteBlock}
      />

      <EditorOverlay
        username={username}
        tabs={tabs}
        activeTabId={activeTabId}
        hasChanges={hasChanges}
        onSelectTab={setActiveTabId}
        onUpdateTabs={handleUpdateTabs}
        onAddBlock={handleAddBlock}
        onEditBlock={handleEditBlock}
        onMoveBlock={handleMoveBlock}
        onDeleteBlock={handleDeleteBlock}
        onSaveAll={handleSaveAll}
        editingBlock={editingBlock}
        setEditingBlock={setEditingBlock}
      />
    </div>
  );
}

export default function EditorPage() {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, '');
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, token } = useAuth();

  const [theme, setTheme] = useState(null);
  const [content, setContent] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const isOwner = user?.username?.toLowerCase() === username?.toLowerCase();

  // Load all data
  useEffect(() => {
    if (username) {
      document.title = `Profilenc Studio — @${username}`;
    }

    if (authLoading) return;
    if (!token || !username || !isOwner) {
      setDataLoaded(true);
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        const [themeRes, contentRes] = await Promise.all([
          fetch(`${API_BASE}/api/u/${username}/theme`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/u/${username}/content`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (isMounted) {
          const rawContent = contentRes.ok ? await contentRes.json() : {};
          const modular = rawContent?.modular_profile || normalizeModularContent(rawContent, username);

          setTheme(themeRes.ok ? await themeRes.json() : {});
          setContent(modular);
          setDataLoaded(true);
        }
      } catch {
        if (isMounted) {
          setContent(normalizeModularContent({}, username));
          setTheme({});
          setDataLoaded(true);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [token, username, authLoading, isOwner]);

  if (authLoading || !dataLoaded) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner" />
        <p>Loading editor...</p>
      </div>
    );
  }

  // Auth gate checks
  if (!isAuthenticated) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <ShieldAlert size={36} color="#00d4ff" style={{ margin: '0 auto 12px' }} />
            <h1>Login Required</h1>
            <p>You must be logged in as @{username} to edit this profile.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="auth-submit auth-submit-secondary"
              onClick={() => navigate(`/@${username}`)}
            >
              <ArrowLeft size={16} /> View Profile
            </button>
            <button
              type="button"
              className="auth-submit"
              onClick={() => navigate('/login')}
            >
              <LogIn size={16} /> Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <ShieldAlert size={36} color="#ef4444" style={{ margin: '0 auto 12px' }} />
            <h1>Access Denied</h1>
            <p>You are logged in as @{user.username}, but this profile belongs to @{username}.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              className="auth-submit auth-submit-secondary"
              onClick={() => navigate(`/@${username}`)}
            >
              <ArrowLeft size={16} /> View @{username}
            </button>
            <button
              type="button"
              className="auth-submit"
              onClick={() => navigate(`/@${user.username}/edit`)}
            >
              Edit Your Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider username={username} initialTheme={theme}>
      <EditorCanvasInner
        username={username}
        content={content}
        setContent={setContent}
        theme={theme}
        token={token}
      />
    </ThemeProvider>
  );
}
