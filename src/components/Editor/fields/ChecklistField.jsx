import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import Field from './Field';

// Ids are created from event handlers, so the counter sits outside the
// component to keep the render body free of impure calls.
let taskSequence = 0;

function makeTaskId() {
  taskSequence += 1;
  return `task-${taskSequence}-${taskSequence * 7919}`;
}

/**
 * Checklist of small sub-items, each with a title and a done state.
 *
 * Adding is a single input plus Enter, which is the fastest path when someone
 * is typing out five or six steps in a row.
 */
export default function ChecklistField({ label, value, onChange, hint, placeholder }) {
  const [draft, setDraft] = useState('');
  const tasks = Array.isArray(value) ? value : [];

  const addTask = () => {
    const title = draft.trim();
    if (!title) return;
    onChange([...tasks, { id: makeTaskId(), title, completed: false }]);
    setDraft('');
  };

  const toggleTask = (index) => {
    onChange(tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task)));
  };

  const renameTask = (index, title) => {
    onChange(tasks.map((task, i) => (i === index ? { ...task, title } : task)));
  };

  const removeTask = (index) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  const doneCount = tasks.filter((task) => task.completed).length;

  return (
    <Field
      label={label}
      hint={hint}
      counter={tasks.length > 0 ? `${doneCount}/${tasks.length} done` : null}
    >
      <div className="bf-checklist">
        {tasks.map((task, index) => (
          <div className="bf-check-row" key={task.id || index}>
            <button
              type="button"
              className={`bf-check-box ${task.completed ? 'is-done' : ''}`}
              onClick={() => toggleTask(index)}
              title={task.completed ? 'Mark as not done' : 'Mark as done'}
              aria-pressed={task.completed}
            >
              {task.completed && <Check size={12} />}
            </button>

            <input
              type="text"
              className={`bf-input bf-check-input ${task.completed ? 'is-done' : ''}`}
              value={task.title || ''}
              onChange={(e) => renameTask(index, e.target.value)}
              placeholder="Step title"
            />

            <button
              type="button"
              className="bf-row-action is-danger"
              onClick={() => removeTask(index)}
              title="Remove step"
              aria-label="Remove step"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        <div className="bf-check-add">
          <input
            type="text"
            className="bf-input"
            value={draft}
            placeholder={placeholder || 'Add a step and press Enter'}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTask();
              }
            }}
          />
          <button type="button" className="bf-btn" onClick={addTask} disabled={!draft.trim()}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    </Field>
  );
}
