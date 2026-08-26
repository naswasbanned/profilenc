import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import ProfileEditor from './editors/ProfileEditor';
import DevEditor from './editors/DevEditor';
import HobbiesEditor from './editors/HobbiesEditor';
import GamesEditor from './editors/GamesEditor';
import MoviesEditor from './editors/MoviesEditor';
import DiaryEditor from './editors/DiaryEditor';
import './AdminPage.css';

const sectionMeta = {
  profile: { title: 'Profile Settings', desc: 'Manage profile data across all three sections' },
  developer: { title: 'Developer Content', desc: 'Tech stack, projects, experience, and services' },
  hobbies: { title: 'Hobbies & Gear', desc: 'PC specs and peripherals / setup' },
  games: { title: 'Games Library', desc: 'Story games, currently playing, backlog, and philosophy' },
  movies: { title: 'Movies & Series', desc: 'Rated movies, series, currently watching, and watchlist backlog' },
  diary: { title: 'Diary Broadcasts', desc: 'Manage diary posts and broadcasts' },
};

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('profile');

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

  // Fetch all data on mount
  useEffect(() => {
    fetchJson('/data/profile.json').then(setProfile);
    fetchJson('/data/dev-skills.json').then(setSkills);
    fetchJson('/data/dev-projects.json').then(setProjects);
    fetchJson('/data/dev-experience.json').then(setExperience);
    fetchJson('/data/dev-services.json').then(setServices);
    fetchJson('/data/hobbies-specs.json').then(setSpecs);
    fetchJson('/data/hobbies-setup.json').then(setSetup);
    fetchJson('/data/hobbies-story-games.json').then(setStoryGames);
    fetchJson('/data/hobbies-currently-playing.json').then(setCurrentlyPlaying);
    fetchJson('/data/hobbies-backlog.json').then(setBacklog);
    fetchJson('/data/hobbies-philosophy.json').then(setPhilosophy);
    fetchJson('/data/hobbies-movies.json').then(setMovies);
    fetchJson('/data/hobbies-movies-watching.json').then(setMoviesWatching);
    fetchJson('/data/hobbies-movies-backlog.json').then(setMoviesBacklog);
    fetchJson('/data/diary-entries.json').then(setDiaryEntries);
  }, []);

  // Set body bg for admin
  useEffect(() => {
    document.body.style.background = '#0a0a0f';
  }, []);

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
        </div>

        {activeSection === 'profile' && (
          <ProfileEditor data={profile} setData={setProfile} />
        )}

        {activeSection === 'developer' && (
          <DevEditor
            skills={skills} setSkills={setSkills}
            projects={projects} setProjects={setProjects}
            experience={experience} setExperience={setExperience}
            services={services} setServices={setServices}
          />
        )}

        {activeSection === 'hobbies' && (
          <HobbiesEditor
            specs={specs} setSpecs={setSpecs}
            setup={setup} setSetup={setSetup}
          />
        )}

        {activeSection === 'games' && (
          <GamesEditor
            storyGames={storyGames} setStoryGames={setStoryGames}
            currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying}
            backlog={backlog} setBacklog={setBacklog}
            philosophy={philosophy} setPhilosophy={setPhilosophy}
          />
        )}

        {activeSection === 'movies' && (
          <MoviesEditor
            movies={movies} setMovies={setMovies}
            moviesWatching={moviesWatching} setMoviesWatching={setMoviesWatching}
            moviesBacklog={moviesBacklog} setMoviesBacklog={setMoviesBacklog}
          />
        )}

        {activeSection === 'diary' && (
          <DiaryEditor entries={diaryEntries} setEntries={setDiaryEntries} />
        )}
      </main>
    </div>
  );
}
