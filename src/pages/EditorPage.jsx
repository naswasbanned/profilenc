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
  const { theme: currentTheme, setIsDirty: setThemeIsDirty } = useTheme();
  const [activeTabId, setActiveTabId] = useState(() => content?.tabs?.[0]?.id || 'tab-main');
  const [editingBlock, setEditingBlock] = useState(null);

  // State snapshots for real-time dirty state tracking with reactive re-render
  const [savedContentStr, setSavedContentStr] = useState(() => JSON.stringify(content));
  const [savedThemeStr, setSavedThemeStr] = useState(() => JSON.stringify(currentTheme));

  const isContentDirty = useMemo(() => {
    return JSON.stringify(content) !== savedContentStr;
  }, [content, savedContentStr]);

  const isThemeDirty = useMemo(() => {
    return JSON.stringify(currentTheme) !== savedThemeStr;
  }, [currentTheme, savedThemeStr]);

  const hasChanges = isContentDirty || isThemeDirty;

  const tabs = content?.tabs || [];
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // History state: past, present, future snapshots of modular content
  const [history, setHistory] = useState(() => ({
    past: [],
    present: { content, activeTabId: content?.tabs?.[0]?.id || 'tab-main' },
    future: [],
  }));

  // Update content and push previous state into history past
  const updateContentWithHistory = useCallback((updater, optionalTabId = null) => {
    setHistory((curr) => {
      const prevContent = curr.present.content;
      const newContent = typeof updater === 'function' ? updater(prevContent) : updater;

      if (!newContent) return curr;

      // Avoid pushing identical consecutive states
      if (JSON.stringify(prevContent) === JSON.stringify(newContent)) {
        return curr;
      }

      setContent(newContent);
      const targetTabId = optionalTabId || curr.present.activeTabId;

      return {
        past: [...curr.past.slice(-35), curr.present],
        present: { content: newContent, activeTabId: targetTabId },
        future: [],
      };
    });
  }, [setContent]);

  // Undo Handler — reverts deleted/modified blocks, tab updates, etc.
  const handleUndo = useCallback(() => {
    setHistory((curr) => {
      if (curr.past.length === 0) return curr;

      const previous = curr.past[curr.past.length - 1];
      const newPast = curr.past.slice(0, curr.past.length - 1);

      setContent(previous.content);
      if (previous.activeTabId) {
        setActiveTabId(previous.activeTabId);
      }

      return {
        past: newPast,
        present: previous,
        future: [curr.present, ...curr.future],
      };
    });
  }, [setContent, setActiveTabId]);

  // Redo Handler — restores forward state
  const handleRedo = useCallback(() => {
    setHistory((curr) => {
      if (curr.future.length === 0) return curr;

      const next = curr.future[0];
      const newFuture = curr.future.slice(1);

      setContent(next.content);
      if (next.activeTabId) {
        setActiveTabId(next.activeTabId);
      }

      return {
        past: [...curr.past, curr.present],
        present: next,
        future: newFuture,
      };
    });
  }, [setContent, setActiveTabId]);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y / Ctrl+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );
      if (isInput) return;

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Block Manipulation Handlers with History Tracking
  const handleAddBlock = useCallback((newBlock) => {
    updateContentWithHistory((prev) => {
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
    }, activeTabId);
  }, [currentTab, activeTabId, updateContentWithHistory]);

  const handleEditBlock = useCallback((updatedBlock) => {
    updateContentWithHistory((prev) => {
      const updatedTabs = (prev.tabs || []).map((t) => ({
        ...t,
        blocks: (t.blocks || []).map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
      }));
      return { ...prev, tabs: updatedTabs };
    }, activeTabId);
  }, [activeTabId, updateContentWithHistory]);

  const handleMoveBlock = useCallback((fromIndex, toIndex) => {
    updateContentWithHistory((prev) => {
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
    }, activeTabId);
  }, [currentTab, activeTabId, updateContentWithHistory]);

  const handleDeleteBlock = useCallback((blockId) => {
    updateContentWithHistory((prev) => {
      const updatedTabs = (prev.tabs || []).map((t) => ({
        ...t,
        blocks: (t.blocks || []).filter((b) => b.id !== blockId),
      }));
      return { ...prev, tabs: updatedTabs };
    }, activeTabId);
  }, [activeTabId, updateContentWithHistory]);

  const handleUpdateTabs = useCallback((newTabs) => {
    let nextTabId = activeTabId;
    if (!newTabs.some((t) => t.id === activeTabId)) {
      nextTabId = newTabs[0]?.id || 'tab-main';
      setActiveTabId(nextTabId);
    }
    updateContentWithHistory((prev) => ({ ...prev, tabs: newTabs }), nextTabId);
  }, [activeTabId, updateContentWithHistory]);

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

    // Update reactive snapshots to immediately mark as clean & saved
    setSavedContentStr(JSON.stringify(content));
    setSavedThemeStr(JSON.stringify(currentTheme));
    if (setThemeIsDirty) setThemeIsDirty(false);
  }, [username, token, content, currentTheme, setThemeIsDirty]);

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
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
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
