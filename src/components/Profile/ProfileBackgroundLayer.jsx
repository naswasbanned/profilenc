/**
 * Custom background image with its overlay, shared by the profile canvas and
 * the editor preview so both render the same backdrop.
 * `background` is the result of `getCanvasBackground`.
 */
export default function ProfileBackgroundLayer({ background }) {
  if (!background?.backgroundImage) return null;
  const blur = background.backgroundBlur;

  return (
    <div className="profile-bg-layer" aria-hidden="true">
      <div
        className="profile-bg-image"
        style={{
          backgroundImage: `url(${background.backgroundImage})`,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
      />
      <div
        className="profile-bg-overlay"
        style={{
          backgroundColor: background.backgroundOverlayColor,
          opacity: background.backgroundOverlayOpacity,
        }}
      />
    </div>
  );
}
