import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Check,
  Mail,
  MailOpen,
  Trash2,
} from 'lucide-react';
import InboxAvatar from './InboxAvatar';
import { formatFullDate, isDirect, senderLabel } from '../../lib/inbox';

/** Reading pane: empty state, or one message with its toolbar. */
export default function InboxReader({ message, busy, onBack, onSetStatus, onDelete }) {
  const backRef = useRef(null);

  // A pending delete confirmation is tied to one message id and never carries over.
  const messageId = message?.id ?? null;
  const [confirmId, setConfirmId] = useState(null);
  const confirmingNow = messageId != null && confirmId === messageId;

  useEffect(() => {
    // Move focus to the Back control only when the pane is a full-screen view.
    if (messageId != null && window.matchMedia && !window.matchMedia('(min-width: 900px)').matches) {
      backRef.current?.focus();
    }
  }, [messageId]);

  if (!message) {
    return (
      <div className="inbox-reader inbox-reader-empty">
        <button type="button" className="inbox-back-btn" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </button>
        <div className="inbox-empty-state">
          <MailOpen size={40} aria-hidden="true" />
          <p className="inbox-empty-title">Select a message to read it</p>
          <p className="inbox-empty-sub">Use New message to write to another creator.</p>
        </div>
      </div>
    );
  }

  const direct = isDirect(message);
  const answers = Array.isArray(message.answers) ? message.answers.filter((a) => a && typeof a === 'object') : [];
  const unread = message.status === 'NEW';
  const archived = message.status === 'ARCHIVED';
  const sender = senderLabel(message);

  return (
    <div className="inbox-reader">
      <div className="inbox-reader-toolbar" role="toolbar" aria-label="Message actions">
        <button type="button" className="inbox-back-btn" onClick={onBack} ref={backRef}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </button>
        <button
          type="button"
          className="inbox-action-btn"
          disabled={busy}
          onClick={() => onSetStatus(message, unread ? 'READ' : 'NEW')}
        >
          {unread ? <Check size={14} aria-hidden="true" /> : <Mail size={14} aria-hidden="true" />}
          <span>{unread ? 'Mark as read' : 'Mark as unread'}</span>
        </button>
        <button
          type="button"
          className="inbox-action-btn"
          disabled={busy}
          onClick={() => onSetStatus(message, archived ? 'READ' : 'ARCHIVED')}
        >
          {archived ? <ArchiveRestore size={14} aria-hidden="true" /> : <Archive size={14} aria-hidden="true" />}
          <span>{archived ? 'Unarchive' : 'Archive'}</span>
        </button>
        {confirmingNow ? (
          <span className="inbox-confirm" role="group" aria-label="Confirm delete">
            <button
              type="button"
              className="inbox-action-btn danger"
              disabled={busy}
              onClick={() => {
                setConfirmId(null);
                onDelete(message);
              }}
            >
              <Trash2 size={14} aria-hidden="true" />
              <span>Confirm delete</span>
            </button>
            <button type="button" className="inbox-action-btn" onClick={() => setConfirmId(null)}>
              <span>Cancel</span>
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="inbox-action-btn danger"
            disabled={busy}
            onClick={() => setConfirmId(messageId)}
          >
            <Trash2 size={14} aria-hidden="true" />
            <span>Delete</span>
          </button>
        )}
      </div>

      <div className="inbox-reader-scroll">
        <article className="inbox-message" aria-label={`Message from ${sender}`}>
          <header className="inbox-message-head">
            <h3 className="inbox-message-sender">
              <InboxAvatar url={message.sender_avatar_url} name={sender} size={36} />
              {direct && message.sender_username ? (
                <Link to={`/@${message.sender_username}`}>@{message.sender_username}</Link>
              ) : (
                <span>{sender}</span>
              )}
            </h3>
            <p className="inbox-message-meta">
              <span>{formatFullDate(message.created_at)}</span>
              <span className="inbox-message-source">{direct ? 'Direct message' : 'Contact form'}</span>
              {unread && <span className="inbox-message-flag">Unread</span>}
            </p>
          </header>

          <div className="inbox-message-body">
            {answers.map((a, i) => (
              <div key={a.id ?? i} className="inbox-answer">
                {(!direct || answers.length > 1) && <span className="inbox-answer-label">{a.label}</span>}
                <p className="inbox-answer-value">{String(a.value ?? '')}</p>
              </div>
            ))}
            {answers.length === 0 && <p className="inbox-answer-value">This message has no content.</p>}
          </div>
        </article>
      </div>
    </div>
  );
}
