import { useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import UserSuggestInput from './UserSuggestInput';
import { normalizeRecipient } from '../../lib/inbox';

export const MAX_LENGTH = 2000;

/** Controlled compose form. The draft lives in the container so it survives navigation. */
export default function InboxCompose({
  draft,
  onDraftChange,
  onSend,
  onCancel,
  sending,
  error,
  autoFocus,
}) {
  const messageRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      const el = document.getElementById('inbox-to');
      if (el) el.focus();
    }
  }, [autoFocus]);

  const tooLong = draft.message.length > MAX_LENGTH;
  const canSend =
    !sending && normalizeRecipient(draft.to) !== '' && draft.message.trim() !== '' && !tooLong;

  const submit = (event) => {
    event.preventDefault();
    if (canSend) onSend();
  };

  return (
    <form className="inbox-compose" onSubmit={submit} noValidate aria-label="New message">
      <div className="inbox-pane-head">
        <button type="button" className="inbox-back-btn" onClick={onCancel}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </button>
        <h3 className="inbox-pane-title">New message</h3>
      </div>

      <div className="inbox-compose-body">
        <label className="inbox-label" htmlFor="inbox-to">TO</label>
        <UserSuggestInput
          id="inbox-to"
          value={draft.to}
          onChange={(to) => onDraftChange({ ...draft, to })}
          disabled={sending}
          onChosen={() => messageRef.current?.focus()}
        />

        <label className="inbox-label" htmlFor="inbox-message">MESSAGE</label>
        <textarea
          id="inbox-message"
          ref={messageRef}
          className="inbox-textarea"
          value={draft.message}
          onChange={(e) => onDraftChange({ ...draft, message: e.target.value })}
          placeholder="Write your message"
          disabled={sending}
        />

        <div className="inbox-compose-row">
          <span className={`inbox-counter${tooLong ? ' over' : ''}`} role="status">
            {draft.message.length} / {MAX_LENGTH}
          </span>
          <div className="inbox-compose-actions">
            <button type="button" className="inbox-action-btn" onClick={onCancel} disabled={sending}>
              Cancel
            </button>
            <button type="submit" className="dash-btn-primary inbox-send-btn" disabled={!canSend}>
              {sending ? (
                <Loader2 size={15} className="spin" aria-hidden="true" />
              ) : (
                <Send size={15} aria-hidden="true" />
              )}
              <span>{sending ? 'SENDING' : 'SEND'}</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="inbox-feedback error" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
