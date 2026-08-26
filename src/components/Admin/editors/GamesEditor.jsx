import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminField from '../shared/AdminField';

const STATUS_OPTIONS = ['Completed', 'In Progress', 'Dropped', 'On Hold'];

const subtabs = [
  { id: 'story', label: 'Story Games' },
  { id: 'playing', label: 'Currently Playing' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'philosophy', label: 'Philosophy' },
];

export default function GamesEditor({
  storyGames, setStoryGames,
  currentlyPlaying, setCurrentlyPlaying,
  backlog, setBacklog,
  philosophy, setPhilosophy,
  token,
}) {
  const [activeTab, setActiveTab] = useState('story');

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

      {/* Story Games */}
      {activeTab === 'story' && storyGames && (
        <div>
          {storyGames.map((game, i) => (
            <AdminCard
              key={i}
              title={game.title || 'New Game'}
              subtitle={`${game.hours || 0}h — ${game.status || 'N/A'}`}
              onDelete={() => deleteItem(storyGames, setStoryGames, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Title" value={game.title} onChange={(v) => updateItem(storyGames, setStoryGames, i, 'title', v)} fullWidth />
                <AdminField label="Status" value={game.status} onChange={(v) => updateItem(storyGames, setStoryGames, i, 'status', v)} type="select" options={STATUS_OPTIONS} />
                <AdminField label="Hours" value={game.hours} onChange={(v) => updateItem(storyGames, setStoryGames, i, 'hours', v)} type="number" />
                <AdminField label="Rating" value={game.rating} onChange={(v) => updateItem(storyGames, setStoryGames, i, 'rating', v)} />
                <AdminField label="Genre" value={game.genre} onChange={(v) => updateItem(storyGames, setStoryGames, i, 'genre', v)} />
                <AdminField label="Description" value={game.description} onChange={(v) => updateItem(storyGames, setStoryGames, i, 'description', v)} type="textarea" fullWidth />
                <AdminField label="Image" value={game.image} onChange={(v) => updateItem(storyGames, setStoryGames, i, 'image', v)} type="image" token={token} fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setStoryGames([...storyGames, { title: '', status: 'In Progress', hours: 0, rating: '', description: '', genre: '', image: '' }])}
          >
            <Plus size={16} /> Add Game
          </button>
        </div>
      )}

      {/* Currently Playing */}
      {activeTab === 'playing' && currentlyPlaying && (
        <div>
          {currentlyPlaying.map((game, i) => (
            <AdminCard
              key={i}
              title={game.title || 'New Game'}
              subtitle={`${game.progress || 0}%`}
              onDelete={() => deleteItem(currentlyPlaying, setCurrentlyPlaying, i)}
            >
              <div className="admin-field-grid">
                <AdminField label="Title" value={game.title} onChange={(v) => updateItem(currentlyPlaying, setCurrentlyPlaying, i, 'title', v)} fullWidth />
                <AdminField label="Progress (%)" value={game.progress} onChange={(v) => updateItem(currentlyPlaying, setCurrentlyPlaying, i, 'progress', v)} type="number" />
                <AdminField label="Genre" value={game.genre} onChange={(v) => updateItem(currentlyPlaying, setCurrentlyPlaying, i, 'genre', v)} />
                <AdminField label="Image" value={game.image} onChange={(v) => updateItem(currentlyPlaying, setCurrentlyPlaying, i, 'image', v)} type="image" token={token} fullWidth />
              </div>
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setCurrentlyPlaying([...currentlyPlaying, { title: '', progress: 0, genre: '', image: '' }])}
          >
            <Plus size={16} /> Add Game
          </button>
        </div>
      )}

      {/* Backlog (simple string list) */}
      {activeTab === 'backlog' && backlog && (
        <div>
          <div className="admin-form-group">
            <div className="admin-form-group-title">Game Backlog</div>
            <div className="admin-string-list">
              {backlog.map((title, i) => (
                <div key={i} className="admin-string-item">
                  <input
                    className="admin-field-input"
                    value={title}
                    onChange={(e) => {
                      const updated = [...backlog];
                      updated[i] = e.target.value;
                      setBacklog(updated);
                    }}
                    placeholder="Game title"
                  />
                  <button
                    type="button"
                    className="admin-url-remove-btn"
                    onClick={() => setBacklog(backlog.filter((_, idx) => idx !== i))}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-add-btn"
              onClick={() => setBacklog([...backlog, ''])}
            >
              <Plus size={16} /> Add to Backlog
            </button>
          </div>
        </div>
      )}

      {/* Philosophy */}
      {activeTab === 'philosophy' && philosophy && (
        <div>
          {philosophy.map((item, i) => (
            <AdminCard
              key={i}
              title={item.title || 'New Philosophy'}
              onDelete={() => deleteItem(philosophy, setPhilosophy, i)}
            >
              <AdminField label="Title" value={item.title} onChange={(v) => updateItem(philosophy, setPhilosophy, i, 'title', v)} fullWidth />
              <AdminField label="Text" value={item.text} onChange={(v) => updateItem(philosophy, setPhilosophy, i, 'text', v)} type="textarea" fullWidth />
            </AdminCard>
          ))}
          <button
            type="button"
            className="admin-add-btn"
            onClick={() => setPhilosophy([...philosophy, { title: '', text: '' }])}
          >
            <Plus size={16} /> Add Philosophy
          </button>
        </div>
      )}
    </div>
  );
}
