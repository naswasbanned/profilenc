import { useId, useState } from 'react';
import Field from './Field';

/**
 * One item per line, stored as an array of strings. Used for lists that read
 * naturally as text, such as the deliverables of a service.
 */
export default function LinesField({ label, value, onChange, hint, placeholder, rows = 4 }) {
  const id = useId();

  // The textarea keeps its own draft text, including a trailing blank line
  // while it's being typed. `value` (the saved array) only overwrites the
  // draft when it changes for a reason other than this field's own onChange
  // below — for example switching to a different card. Deriving the text
  // straight from `value` on every render fought the array's stripped blank
  // lines and reset the textarea before Enter could start a new one.
  //
  // Comparing against the last array this field emitted, rather than the
  // last text, is what tells "the parent gave us back what we just sent"
  // apart from "the parent handed us a genuinely different value" — the two
  // cases render-phase state adjustment is meant for.
  const incomingLines = Array.isArray(value) ? value : [];
  const [text, setText] = useState(() => incomingLines.join('\n'));
  const [lastSeenValue, setLastSeenValue] = useState(incomingLines);

  if (incomingLines !== lastSeenValue && incomingLines.join('\n') !== lastSeenValue.join('\n')) {
    setLastSeenValue(incomingLines);
    setText(incomingLines.join('\n'));
  }

  const handleChange = (e) => {
    const next = e.target.value;
    setText(next);
    const lines = next
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    setLastSeenValue(lines);
    onChange(lines);
  };

  return (
    <Field label={label} hint={hint || 'One per line.'} htmlFor={id}>
      <textarea
        id={id}
        className="bf-input bf-textarea"
        rows={rows}
        value={text}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </Field>
  );
}
