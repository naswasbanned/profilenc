import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminField from '../shared/AdminField';

const TYPE_OPTIONS = ['Movie', 'Series', 'Anime', 'Documentary', 'Animation'];
const STATUS_OPTIONS = ['Completed', 'Watching', 'On Hold', 'Plan to Watch', 'Dropped'];

const subtabs = [
  { id: 'movies', label: 'Favorite Movies & Series' },
  { id: 'watching', label: 'Currently Watching' },
  { id: 'backlog', label: 'Watchlist Backlog' },
];

export default function MoviesEditor({
  movies,
  setMovies,
  moviesWatching,
  setMoviesWatching,
  moviesBacklog,
  setMoviesBacklog,
}) {
  const [activeTab, setActiveTab] = useState('movies');

  const updateItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const deleteItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="admin-subtabs">
        {subtabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-subtab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Favorite Movies & Series */}
      {activeTab === 'movies' && movies && (
        <div>
          {movies.map((movie, i) => (
            <AdminCard
              key={i}
              title={movie.title || 'New Entry'}
              subtitle={`${movie.type || 'Movie'} • ★ ${movie.rating || 'N/A'}`}
              onDelete={() => deleteItem(movies, setMovies, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Title" value={movie.title} onChange={(v) => updateItem(movies, setMovies, i, 'title', v)} fullWidth />
                <AdminField label="Type" value={movie.type} onChange={(v) => updateItem(movies, setMovies, i, 'type', v)} type="select" options={TYPE_OPTIONS} />
                <AdminField label="Status" value={movie.status} onChange={(v) => updateItem(movies, setMovies, i, 'status', v)} type="select" options={STATUS_OPTIONS} />
                <AdminField label="Rating" value={movie.rating} onChange={(v) => updateItem(movies, setMovies, i, 'rating', v)} placeholder="10 or MASTERPIECE" />
                <AdminField label="Year" value={movie.year} onChange={(v) => updateItem(movies, setMovies, i, 'year', v)} placeholder="e.g. 2023 or 2008 - 2013" />
                <AdminField label="Genre" value={movie.genre} onChange={(v) => updateItem(movies, setMovies, i, 'genre', v)} placeholder="Sci-Fi / Drama" />
                <AdminField label="Seasons / Episodes" value={movie.episodes} onChange={(v) => updateItem(movies, setMovies, i, 'episodes', v)} placeholder="e.g. 5 Seasons (62 eps)" />
                <AdminField label="Director / Creator" value={movie.director} onChange={(v) => updateItem(movies, setMovies, i, 'director', v)} placeholder="e.g. Christopher Nolan" />
                <AdminField label="Image URL" value={movie.image} onChange={(v) => updateItem(movies, setMovies, i, 'image', v)} type="url" fullWidth placeholder="/images/gaming/story-games/e33.jpg" />
                <AdminField label="Review / Synopsis" value={movie.description} onChange={(v) => updateItem(movies, setMovies, i, 'description', v)} type="textarea" fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() =>
              setMovies([
                ...movies,
                {
                  title: '',
                  type: 'Movie',
                  status: 'Completed',
                  year: '',
                  rating: 10,
                  genre: '',
                  description: '',
                  image: '',
                },
              ])
            }
          >
            <Plus size={16} /> Add Movie / Series
          </button>
        </div>
      )}

      {/* Currently Watching */}
      {activeTab === 'watching' && moviesWatching && (
        <div>
          {moviesWatching.map((item, i) => (
            <AdminCard
              key={i}
              title={item.title || 'New Show'}
              subtitle={`${item.currentEpisode || ''} (${item.progress || 0}%)`}
              onDelete={() => deleteItem(moviesWatching, setMoviesWatching, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Title" value={item.title} onChange={(v) => updateItem(moviesWatching, setMoviesWatching, i, 'title', v)} fullWidth />
                <AdminField label="Type" value={item.type} onChange={(v) => updateItem(moviesWatching, setMoviesWatching, i, 'type', v)} type="select" options={TYPE_OPTIONS} />
                <AdminField label="Current Episode / Season" value={item.currentEpisode} onChange={(v) => updateItem(moviesWatching, setMoviesWatching, i, 'currentEpisode', v)} placeholder="e.g. S2 E6" />
                <AdminField label="Progress (%)" value={item.progress} onChange={(v) => updateItem(moviesWatching, setMoviesWatching, i, 'progress', v)} type="number" />
                <AdminField label="Genre" value={item.genre} onChange={(v) => updateItem(moviesWatching, setMoviesWatching, i, 'genre', v)} />
                <AdminField label="Image URL" value={item.image} onChange={(v) => updateItem(moviesWatching, setMoviesWatching, i, 'image', v)} type="url" fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() =>
              setMoviesWatching([
                ...moviesWatching,
                {
                  title: '',
                  type: 'Series',
                  currentEpisode: 'S1 E1',
                  progress: 0,
                  genre: '',
                  image: '',
                },
              ])
            }
          >
            <Plus size={16} /> Add Currently Watching
          </button>
        </div>
      )}

      {/* Watchlist Backlog */}
      {activeTab === 'backlog' && moviesBacklog && (
        <div>
          <div className="admin-form-group">
            <div className="admin-form-group-title">Movies & Series Watchlist</div>
            <div className="admin-string-list">
              {moviesBacklog.map((title, i) => (
                <div key={i} className="admin-string-item">
                  <input
                    className="admin-field-input"
                    value={title}
                    onChange={(e) => {
                      const updated = [...moviesBacklog];
                      updated[i] = e.target.value;
                      setMoviesBacklog(updated);
                    }}
                    placeholder="Movie or series title"
                  />
                  <button
                    type="button"
                    className="admin-url-remove-btn"
                    onClick={() => setMoviesBacklog(moviesBacklog.filter((_, idx) => idx !== i))}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-add-btn"
              onClick={() => setMoviesBacklog([...moviesBacklog, ''])}
            >
              <Plus size={16} /> Add to Watchlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
