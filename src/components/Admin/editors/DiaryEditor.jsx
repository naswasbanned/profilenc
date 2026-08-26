import { Plus } from 'lucide-react';
import AdminCard from '../shared/AdminCard';
import AdminField from '../shared/AdminField';

const moodMap = {
  excited: { emoji: '🔥' },
  focused: { emoji: '🎯' },
  proud: { emoji: '💪' },
  amused: { emoji: '😂' },
  mysterious: { emoji: '🤫' },
  opinionated: { emoji: '🗣️' },
  exhausted: { emoji: '😴' },
  reflective: { emoji: '🪞' },
};

export default function DiaryEditor({ entries, setEntries, token }) {
  if (!entries) return null;

  const updateItem = (index, field, value) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const deleteItem = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= entries.length || toIndex >= entries.length) return;
    const updated = [...entries];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setEntries(updated);
  };

  const addEntry = () => {
    const newId = entries.length ? Math.max(...entries.map((e) => e.id || 0)) + 1 : 1;
    setEntries([
      {
        id: newId,
        date: new Date().toISOString().split('T')[0],
        content: '',
        mood: 'reflective',
        image: null,
        likes: 0,
      },
      ...entries,
    ]);
  };

  return (
    <div>
      <button type="button" className="admin-add-btn" onClick={addEntry} style={{ marginTop: 0, marginBottom: 16 }}>
        <Plus size={16} /> New Broadcast
      </button>

      {entries.map((entry, i) => (
        <AdminCard
          key={entry.id || i}
          index={i}
          totalCount={entries.length}
          onMove={(from, to) => moveItem(from, to)}
          title={entry.content?.slice(0, 50) || 'Empty broadcast'}
          subtitle={entry.date}
          hidden={Boolean(entry.hidden)}
          onToggleHide={() => updateItem(i, 'hidden', !entry.hidden)}
          onDelete={() => deleteItem(i)}
          defaultOpen={i === 0 && !entry.content}
        >
          <div className="admin-field-grid">
            <AdminField label="Date" value={entry.date} onChange={(v) => updateItem(i, 'date', v)} type="date" />
            <AdminField label="Content" value={entry.content} onChange={(v) => updateItem(i, 'content', v)} type="textarea" fullWidth />
            <AdminField label="Mood" value={entry.mood} onChange={(v) => updateItem(i, 'mood', v)} type="mood" moodMap={moodMap} fullWidth />
            <AdminField label="Image" value={entry.image || ''} onChange={(v) => updateItem(i, 'image', v || null)} type="image" token={token} fullWidth />
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
