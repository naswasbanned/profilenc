import { useRef, useState } from 'react';
import InboxAvatar from './InboxAvatar';
import {
  senderLabel,
  subjectOf,
  previewOf,
  formatListTime,
  moveActive,
  isDirect,
} from '../../lib/inbox';

/** Message rows as a listbox of buttons. Arrow keys move focus, Enter or Space opens. */
export default function InboxMessageList({ items, selectedId, onOpen, label }) {
  const rowRefs = useRef(new Map());
  const [focusId, setFocusId] = useState(null);

  const ids = items.map((m) => m.id);
  const tabbableId = ids.includes(focusId)
    ? focusId
    : ids.includes(selectedId)
      ? selectedId
      : ids[0];

  const handleKeyDown = (event, id) => {
    const next = moveActive(items, id, event.key);
    if (next == null) return;
    event.preventDefault();
    setFocusId(next);
    rowRefs.current.get(next)?.focus();
  };

  return (
    <ul className="inbox-rows" role="listbox" aria-label={label}>
      {items.map((m) => {
        const unread = m.status === 'NEW';
        const selected = m.id === selectedId;
        const direct = isDirect(m);
        const classes = ['inbox-row'];
        if (unread) classes.push('is-unread');
        if (selected) classes.push('is-selected');
        return (
          <li key={m.id} className="inbox-row-item" role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={selected}
              className={classes.join(' ')}
              tabIndex={m.id === tabbableId ? 0 : -1}
              ref={(el) => {
                if (el) rowRefs.current.set(m.id, el);
                else rowRefs.current.delete(m.id);
              }}
              onClick={() => onOpen(m)}
              onFocus={() => setFocusId(m.id)}
              onKeyDown={(e) => handleKeyDown(e, m.id)}
            >
              <span className="inbox-row-top">
                <span className="inbox-row-sender">
                  <InboxAvatar url={m.sender_avatar_url} name={senderLabel(m)} size={28} />
                  <span className="dash-visually-hidden">{direct ? 'Direct message from' : 'Contact form from'}</span>
                  <span className="inbox-row-name">{senderLabel(m)}</span>
                </span>
                <span className="inbox-row-time">
                  {unread && <span className="inbox-unread-dot" aria-hidden="true" />}
                  {unread && <span className="dash-visually-hidden">Unread, </span>}
                  {formatListTime(m.created_at)}
                </span>
              </span>
              <span className="inbox-row-subject">{subjectOf(m)}</span>
              <span className="inbox-row-preview">{previewOf(m)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
