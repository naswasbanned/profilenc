import { useState, useEffect, useCallback } from 'react';
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
  const stateMap = {
    profile, skills, projects, experience, services,
    specs, setup, storyGames, currentlyPlaying, backlog,
    philosophy, movies, moviesWatching, moviesBacklog, diaryEntries,
  };

  // Fetch all data on mount
  useEffect(() => {
    fetchApi('/api/content/profile').then(setProfile);
    fetchApi('/api/content/dev-skills').then(setSkills);
    fetchApi('/api/content/dev-projects').then(setProjects);
    fetchApi('/api/content/dev-experience').then(setExperience);
    fetchApi('/api/content/dev-services').then(setServices);
    fetchApi('/api/content/hobbies-specs').then(setSpecs);
    fetchApi('/api/content/hobbies-setup').then(setSetup);
    fetchApi('/api/content/hobbies-story-games').then(setStoryGames);
    fetchApi('/api/content/hobbies-currently-playing').then(setCurrentlyPlaying);
    fetchApi('/api/content/hobbies-backlog').then(setBacklog);
    fetchApi('/api/content/hobbies-philosophy').then(setPhilosophy);
    fetchApi('/api/content/hobbies-movies').then(setMovies);
    fetchApi('/api/content/hobbies-movies-watching').then(setMoviesWatching);
    fetchApi('/api/content/hobbies-movies-backlog').then(setMoviesBacklog);
    fetchApi('/api/content/diary-entries').then(setDiaryEntries);
  }, []);

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
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  }, [token, saving, activeSection, stateMap]);

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
            <button
              type="button"
              className={`admin-save-btn ${saveSuccess ? 'success' : ''}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <><Loader2 size={16} className="spin" /> Saving…</>
              ) : saveSuccess ? (
                <><Check size={16} /> Saved!</>
              ) : (
                <><Save size={16} /> Save Changes</>
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
      </main>
    </div>
  );
}
