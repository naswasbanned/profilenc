import { Info } from 'lucide-react';

/**
 * Read-only explainer, used when a block is edited somewhere other than this
 * form (for example the journal, whose entries are written on the canvas).
 */
export default function NoteField({ label, text }) {
  return (
    <div className="bf-note">
      <span className="bf-note-head">
        <Info size={15} />
        {label}
      </span>
      <p className="bf-note-text">{text}</p>
    </div>
  );
}
