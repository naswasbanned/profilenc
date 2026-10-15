import { useEffect, useId, useRef, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { normalizeSuggestQuery, nextActiveIndex } from '../../lib/inboxSuggest';

const DEBOUNCE_MS = 200;
const UNAVAILABLE = 'Suggestions unavailable';

function SuggestAvatar({ user }) {
  const [failed, setFailed] = useState(false);
  if (user.avatarUrl && !failed) {
    return (
      <img
        className="suggest-avatar"
        src={user.avatarUrl}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className="suggest-avatar suggest-avatar-fallback" aria-hidden="true">
      {(user.username || '?').charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Username input with prefix suggestions (ARIA 1.2 combobox with a listbox popup).
 * Typing a full username by hand keeps working: suggestions are only a shortcut.
 */
export default function UserSuggestInput({ value, onChange, id, disabled = false, onChosen }) {
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (i) => `${uid}-opt-${i}`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Latest finished lookup. Anything not matching the current query counts as "searching".
  const [result, setResult] = useState({ q: '', users: [], error: '' });

  const requestId = useRef(0);
  // Query that was just picked from the list: no lookup is needed for it.
  const [skipQuery, setSkipQuery] = useState('');

  const q = normalizeSuggestQuery(value);

  useEffect(() => {
    if (!q || q === skipQuery) return undefined;
    const myId = ++requestId.current;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch(`/api/inbox/suggest-users?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (myId !== requestId.current) return;
        if (!res.ok) {
          let message = UNAVAILABLE;
          if (res.status === 429) {
            try {
              const body = await res.json();
              if (body?.error) message = body.error;
            } catch {
              /* keep the generic message */
            }
          }
          if (myId !== requestId.current) return;
          setResult({ q, users: [], error: message });
          return;
        }
        const data = await res.json();
        if (myId !== requestId.current) return;
        const users = Array.isArray(data?.users) ? data.users.slice(0, 6) : [];
        setResult({ q, users, error: '' });
      } catch (err) {
        if (err?.name === 'AbortError' || myId !== requestId.current) return;
        setResult({ q, users: [], error: UNAVAILABLE });
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
      requestId.current += 1;
    };
  }, [q, skipQuery]);

  const current = result.q === q;
  const users = q && current ? result.users : [];
  const error = q && current ? result.error : '';
  const searching = Boolean(q) && !current && q !== skipQuery;
  const popupVisible = open && Boolean(q) && q !== skipQuery;
  const hasOptions = popupVisible && users.length > 0;
  const activeIndex = hasOptions && active >= 0 && active < users.length ? active : -1;

  let announcement = '';
  if (popupVisible) {
    if (error) announcement = error;
    else if (searching) announcement = 'Searching';
    else if (users.length === 0) announcement = 'No matches';
    else announcement = `${users.length} ${users.length === 1 ? 'suggestion' : 'suggestions'} available`;
  }

  const choose = (user) => {
    setSkipQuery(normalizeSuggestQuery(user.username));
    onChange(user.username);
    setOpen(false);
    setActive(-1);
    if (onChosen) onChosen(user);
  };

  const handleChange = (event) => {
    setSkipQuery('');
    onChange(event.target.value);
    setOpen(true);
    setActive(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (users.length === 0) return;
      event.preventDefault();
      if (!popupVisible) {
        setOpen(true);
        setActive(event.key === 'ArrowDown' ? 0 : users.length - 1);
        return;
      }
      setActive(nextActiveIndex(activeIndex, users.length, event.key));
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0) {
        event.preventDefault();
        choose(users[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      if (popupVisible) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        setActive(-1);
      }
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className="inbox-field">
      <input
        id={id}
        className="inbox-input"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={hasOptions}
        aria-controls={hasOptions ? listId : undefined}
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="@username"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={40}
        disabled={disabled}
      />
      <div className="dash-visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>
      {popupVisible && (
        <div className="suggest-popup">
          {users.length > 0 ? (
            <ul className="suggest-list" role="listbox" id={listId} aria-label="Matching usernames">
              {users.map((user, i) => (
                <li
                  key={user.username}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === activeIndex}
                  className="suggest-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(user)}
                >
                  <SuggestAvatar user={user} />
                  <span className="suggest-name">@{user.username}</span>
                  {user.displayName && user.displayName.toLowerCase() !== user.username.toLowerCase() && (
                    <span className="suggest-display">{user.displayName}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="suggest-status" role="presentation">
              {error || (searching ? 'Searching...' : 'No matches')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
