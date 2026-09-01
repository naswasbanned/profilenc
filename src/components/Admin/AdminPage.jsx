import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminLogin from './AdminLogin';
import ProfileEditor from './editors/ProfileEditor';
import DevEditor from './editors/DevEditor';
import HobbiesEditor from './editors/HobbiesEditor';
import GamesEditor from './editors/GamesEditor';
import MoviesEditor from './editors/MoviesEditor';
import DiaryEditor from './editors/DiaryEditor';
import { Save, Loader2, Check, LogOut } from 'lucide-react';
import './AdminPage.css';

const sectionMeta = {
  profile: { title: 'Profile Settings', desc: 'Manage profile data across all three sections' },
  developer: { title: 'Developer Content', desc: 'Tech stack, projects, experience, and services' },
  hobbies: { title: 'Hobbies & Gear', desc: 'PC specs and peripherals / setup' },
  games: { title: 'Games Library', desc: 'Story games, currently playing, backlog, and philosophy' },
  movies: { title: 'Movies & Series', desc: 'Rated movies, series, currently watching, and watchlist backlog' },
  diary: { title: 'Diary Broadcasts', desc: 'Manage diary posts and broadcasts' },
};

// Map section → which content keys to save
const sectionContentKeys = {
  profile: [{ state: 'profile', key: 'profile' }],
  developer: [
    { state: 'skills', key: 'dev-skills' },
    { state: 'projects', key: 'dev-projects' },
    { state: 'experience', key: 'dev-experience' },
    { state: 'services', key: 'dev-services' },
  ],
  hobbies: [
    { state: 'specs', key: 'hobbies-specs' },
    { state: 'setup', key: 'hobbies-setup' },
  ],
  games: [
    { state: 'storyGames', key: 'hobbies-story-games' },
    { state: 'currentlyPlaying', key: 'hobbies-currently-playing' },
    { state: 'backlog', key: 'hobbies-backlog' },
    { state: 'philosophy', key: 'hobbies-philosophy' },
  ],
  movies: [
    { state: 'movies', key: 'hobbies-movies' },
    { state: 'moviesWatching', key: 'hobbies-movies-watching' },
    { state: 'moviesBacklog', key: 'hobbies-movies-backlog' },
  ],
  diary: [{ state: 'diaryEntries', key: 'diary-entries' }],
};

async function fetchApi(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Snapshot of saved data strings for deep change detection
  const [savedSnapshots, setSavedSnapshots] = useState({});

  // All data states
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState(null);
  const [projects, setProjects] = useState(null);
  const [experience, setExperience] = useState(null);
  const [services, setServices] = useState(null);
  const [specs, setSpecs] = useState(null);
  const [setup, setSetup] = useState(null);
  const [storyGames, setStoryGames] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [backlog, setBacklog] = useState(null);
  const [philosophy, setPhilosophy] = useState(null);
  const [movies, setMovies] = useState(null);
  const [moviesWatching, setMoviesWatching] = useState(null);
  const [moviesBacklog, setMoviesBacklog] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState(null);

  // State lookup for save logic
  const stateMap = useMemo(() => ({
    profile, skills, projects, experience, services,
    specs, setup, storyGames, currentlyPlaying, backlog,
    philosophy, movies, moviesWatching, moviesBacklog, diaryEntries,
  }), [
    profile, skills, projects, experience, services,
    specs, setup, storyGames, currentlyPlaying, backlog,
    philosophy, movies, moviesWatching, moviesBacklog, diaryEntries,
  ]);

  // Helper to load data and save initial snapshot
  const loadContent = useCallback((key, setter) => {
    fetchApi(`/api/content/${key}`).then((data) => {
      if (data !== null && data !== undefined) {
        setSavedSnapshots((prev) => ({ ...prev, [key]: JSON.stringify(data) }));
        setter(data);
      }
    });
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    loadContent('profile', setProfile);
    loadContent('dev-skills', setSkills);
    loadContent('dev-projects', setProjects);
    loadContent('dev-experience', setExperience);
    loadContent('dev-services', setServices);
    loadContent('hobbies-specs', setSpecs);
    loadContent('hobbies-setup', setSetup);
    loadContent('hobbies-story-games', setStoryGames);
    loadContent('hobbies-currently-playing', setCurrentlyPlaying);
    loadContent('hobbies-backlog', setBacklog);
    loadContent('hobbies-philosophy', setPhilosophy);
    loadContent('hobbies-movies', setMovies);
    loadContent('hobbies-movies-watching', setMoviesWatching);
    loadContent('hobbies-movies-backlog', setMoviesBacklog);
    loadContent('diary-entries', setDiaryEntries);
  }, [loadContent]);

  // Calculate dirty state for the currently active section
  const isDirty = useMemo(() => {
    const keys = sectionContentKeys[activeSection] || [];
    return keys.some(({ state, key }) => {
      const currentData = stateMap[state];
      if (currentData === null || currentData === undefined) return false;
      const saved = savedSnapshots[key];
      if (saved === undefined) return false; // Initial load not ready yet
      return JSON.stringify(currentData) !== saved;
    });
  }, [activeSection, stateMap, savedSnapshots]);

  // Set body bg for admin
  useEffect(() => {
    document.body.style.background = '#0a0a0f';
  }, []);

  // Save current section data to backend
  const handleSave = useCallback(async () => {
    if (!token || saving) return;
    setSaving(true);
    setSaveSuccess(false);

    const keys = sectionContentKeys[activeSection] || [];
    const newSnapshots = {};
    try {
      for (const { state, key } of keys) {
        const data = stateMap[state];
        if (data === null || data === undefined) continue;

        const res = await fetch(`/api/content/${key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (res.status === 401) {
          // Token expired
          localStorage.removeItem('admin_token');
          setToken(null);
          return;
        }

        newSnapshots[key] = JSON.stringify(data);
      }
      setSavedSnapshots((prev) => ({ ...prev, ...newSnapshots }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  }, [token, saving, activeSection, stateMap]);

  // Beforeunload prompt if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Ctrl+S / Cmd+S shortcut to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty && !saving) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, isDirty, saving]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  // Show login if no token
  if (!token) {
    return <AdminLogin onLogin={setToken} />;
  }

  const meta = sectionMeta[activeSection];

  return (
    <div className="admin-page">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="admin-content">
        <div className="admin-content-header">
          <div>
            <h1>{meta.title}</h1>
            <p>{meta.desc}</p>
          </div>
          <div className="admin-header-actions">
            {/* Save Status Indicator Pill beside Save Button */}
            <div className={`admin-save-status-pill ${isDirty ? 'is-dirty' : 'is-saved'}`}>
              {saving ? (
                <>
                  <span className="admin-status-dot pulse-saving" />
                  <span>Saving changes...</span>
                </>
              ) : isDirty ? (
                <>
                  <span className="admin-status-dot pulse-dirty" />
                  <span>Unsaved Changes</span>
                </>
              ) : (
                <>
                  <Check size={13} className="admin-status-check" />
                  <span>All changes saved</span>
                </>
              )}
            </div>

            <button
              type="button"
              className={`admin-save-btn ${isDirty ? 'active-dirty' : 'muted'} ${saveSuccess ? 'success' : ''}`}
              onClick={handleSave}
              disabled={!isDirty || saving}
              title={isDirty ? 'Save changes to live profile (Ctrl+S)' : 'No unsaved changes (Saved)'}
            >
              {saving ? (
                <><Loader2 size={16} className="spin" /> Saving…</>
              ) : saveSuccess ? (
                <><Check size={16} /> Saved!</>
              ) : isDirty ? (
                <><Save size={16} /> Save Changes</>
              ) : (
                <><Check size={16} /> Saved</>
              )}
            </button>
            <button type="button" className="admin-logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {activeSection === 'profile' && (
          <ProfileEditor data={profile || {}} setData={setProfile} token={token} />
        )}

        {activeSection === 'developer' && (
          <DevEditor
            skills={skills || []} setSkills={setSkills}
            projects={projects || []} setProjects={setProjects}
            experience={experience || []} setExperience={setExperience}
            services={services || []} setServices={setServices}
            token={token}
          />
        )}

        {activeSection === 'hobbies' && (
          <HobbiesEditor
            specs={specs || []} setSpecs={setSpecs}
            setup={setup || []} setSetup={setSetup}
            token={token}
          />
        )}

        {activeSection === 'games' && (
          <GamesEditor
            storyGames={storyGames || []} setStoryGames={setStoryGames}
            currentlyPlaying={currentlyPlaying || []} setCurrentlyPlaying={setCurrentlyPlaying}
            backlog={backlog || []} setBacklog={setBacklog}
            philosophy={philosophy || []} setPhilosophy={setPhilosophy}
            token={token}
          />
        )}

        {activeSection === 'movies' && (
          <MoviesEditor
            movies={movies || []} setMovies={setMovies}
            moviesWatching={moviesWatching || []} setMoviesWatching={setMoviesWatching}
            moviesBacklog={moviesBacklog || []} setMoviesBacklog={setMoviesBacklog}
            token={token}
          />
        )}

        {activeSection === 'diary' && (
          <DiaryEditor entries={diaryEntries || []} setEntries={setDiaryEntries} token={token} />
        )}

        {/* Persistent Sticky Bottom Action Dock (Attached to the bottom so it's always visible) */}
        <div className={`admin-bottom-action-dock ${isDirty ? 'has-unsaved' : ''}`}>
          <div className="admin-bottom-dock-inner">
            <div className={`admin-save-status-pill ${isDirty ? 'is-dirty' : 'is-saved'}`}>
              {saving ? (
                <>
                  <span className="admin-status-dot pulse-saving" />
                  <span>Saving changes...</span>
                </>
              ) : isDirty ? (
                <>
                  <span className="admin-status-dot pulse-dirty" />
                  <span>Unsaved changes in {meta.title}</span>
                </>
              ) : (
                <>
                  <Check size={13} className="admin-status-check" />
                  <span>All changes saved</span>
                </>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="admin-dock-shortcut-hint">Ctrl+S</span>
              <button
                type="button"
                className={`admin-save-btn ${isDirty ? 'active-dirty' : 'muted'} ${saveSuccess ? 'success' : ''}`}
                onClick={handleSave}
                disabled={!isDirty || saving}
                title={isDirty ? 'Save changes to live profile (Ctrl+S)' : 'No unsaved changes (Saved)'}
              >
                {saving ? (
                  <><Loader2 size={15} className="spin" /> Saving…</>
                ) : saveSuccess ? (
                  <><Check size={15} /> Saved!</>
                ) : isDirty ? (
                  <><Save size={15} /> Save Changes</>
                ) : (
                  <><Check size={15} /> Saved</>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
