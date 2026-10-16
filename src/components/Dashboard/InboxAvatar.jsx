import { useState } from 'react';

/** Round profile picture with a letter fallback (no picture, or the image fails to load). */
export default function InboxAvatar({ url, name, size = 24 }) {
  const [failed, setFailed] = useState(false);
  const style = { '--avatar-size': `${size}px` };
  if (url && !failed) {
    return (
      <img
        className="suggest-avatar"
        style={style}
        src={url}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className="suggest-avatar suggest-avatar-fallback" style={style} aria-hidden="true">
      {(name || '?').charAt(0).toUpperCase()}
    </span>
  );
}
