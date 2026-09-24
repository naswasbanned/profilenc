import React, { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './3d-testimonials.css';

/**
 * Marquee Component
 * Smooth horizontal or vertical infinite scrolling marquee with pause on hover
 */
export function Marquee({
  className = '',
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  style = {},
  ...props
}) {
  const marqueeRef = useRef(null);

  const content = useMemo(() => {
    return Array.from({ length: repeat }, (_, i) => (
      <div
        key={i}
        className={`ui-marquee-track ${vertical ? 'track-vertical' : 'track-horizontal'} ${
          reverse ? 'is-reverse' : ''
        }`}
      >
        {children}
      </div>
    ));
  }, [repeat, children, vertical, reverse]);

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={`ui-marquee ${vertical ? 'is-vertical' : 'is-horizontal'} ${
        pauseOnHover ? 'pause-on-hover' : ''
      } ${className}`}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
      style={style}
    >
      {content}
    </div>
  );
}

/**
 * Field Notes Style Creator Profile Card
 * Showcases a real public user profile created on Profilenc
 */
export function CreatorProfileCard({ profile }) {
  if (!profile) return null;
  const username = profile.username || 'user';
  const displayName = profile.displayName || profile.display_name || username;
  const avatarUrl = profile.avatarUrl || profile.avatar_url;
  const templateSlug = profile.templateSlug || profile.template_slug || 'developer';

  // Dynamic user bio / headline directly from the account profile setting
  const bioText = useMemo(() => {
    const raw = profile.bio || profile.headline;
    if (raw && typeof raw === 'string' && raw.trim().length > 0) {
      return raw.trim();
    }
    return '';
  }, [profile.bio, profile.headline]);

  const roleTag = useMemo(() => {
    const t = (templateSlug || '').toLowerCase();
    if (t.includes('gamer')) return 'GAMER';
    if (t.includes('dev')) return 'DEVELOPER';
    if (t.includes('minimal')) return 'MINIMAL';
    return templateSlug ? templateSlug.toUpperCase() : 'CREATOR';
  }, [templateSlug]);

  return (
    <Link to={`/@${username}`} className="ui-creator-profile-card">
      <div className="ui-creator-card-header">
        <div className="ui-creator-user-row">
          <div className="ui-creator-avatar">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span>{displayName[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>

          <div className="ui-creator-identity">
            <div className="ui-creator-display-name">{displayName}</div>
            <div className="ui-creator-handle-row">
              <span className="ui-creator-handle">@{username}</span>
              <span className="ui-creator-badge template">[{roleTag}]</span>
            </div>
          </div>
        </div>

        <div className="ui-creator-action-btn" aria-hidden="true">
          <ArrowUpRight size={14} />
        </div>
      </div>

      <div className="ui-creator-card-body">
        <p className={`ui-creator-bio ${!bioText ? 'is-placeholder' : ''}`}>
          {bioText || 'Tell visitors about yourself, your craft, and what you build...'}
        </p>
      </div>

      <div className="ui-creator-card-footer">
        <span className="ui-creator-status-indicator">
          <span className="ui-creator-dot" /> LIVE
        </span>
        <span className="ui-creator-url-snippet">profilenc.my.id/@{username}</span>
      </div>
    </Link>
  );
}

/**
 * 3D Creator Profiles Showcase
 * 5 alternating vertical marquees in an isometric 3D perspective stage
 * displaying real profiles fetched from data across the full width
 */
export default function ThreeDProfiles({
  profiles = [],
  featuredProfiles,
  className = '',
}) {
  const data = useMemo(() => {
    const list = (profiles && profiles.length > 0)
      ? profiles
      : (featuredProfiles && featuredProfiles.length > 0)
      ? featuredProfiles
      : [];
    return list;
  }, [profiles, featuredProfiles]);

  if (!data || data.length === 0) {
    return null;
  }

  // Ensure enough repetition so the marquee seamlessly fills the 3D stage
  const repeatCount = Math.max(3, Math.ceil(10 / Math.max(1, data.length)));

  // Distribute profiles evenly across 5 columns with offset rotations
  const col1 = data;
  const col2 = data.length > 1 ? [...data.slice(1), ...data.slice(0, 1)] : data;
  const col3 = data.length > 2 ? [...data.slice(2), ...data.slice(0, 2)] : data;
  const col4 = data.length > 3 ? [...data.slice(3), ...data.slice(0, 3)] : data;
  const col5 = data.length > 4 ? [...data.slice(4), ...data.slice(0, 4)] : (data.length > 1 ? [...data.slice(1), ...data.slice(0, 1)] : data);

  return (
    <div className={`ui-3d-stage-viewport ${className}`}>
      {/* 3D Isometric Transform Canvas */}
      <div className="ui-3d-stage-world">
        {/* Column 1: Downward */}
        <Marquee vertical pauseOnHover repeat={repeatCount} style={{ '--duration': '40s' }} className="ui-3d-col ui-3d-col-1">
          {col1.map((p, idx) => (
            <CreatorProfileCard key={`c1-${p.username}-${idx}`} profile={p} />
          ))}
        </Marquee>

        {/* Column 2: Upward */}
        <Marquee vertical pauseOnHover reverse repeat={repeatCount} style={{ '--duration': '46s' }} className="ui-3d-col ui-3d-col-2">
          {col2.map((p, idx) => (
            <CreatorProfileCard key={`c2-${p.username}-${idx}`} profile={p} />
          ))}
        </Marquee>

        {/* Column 3: Downward */}
        <Marquee vertical pauseOnHover repeat={repeatCount} style={{ '--duration': '36s' }} className="ui-3d-col ui-3d-col-3">
          {col3.map((p, idx) => (
            <CreatorProfileCard key={`c3-${p.username}-${idx}`} profile={p} />
          ))}
        </Marquee>

        {/* Column 4: Upward */}
        <Marquee vertical pauseOnHover reverse repeat={repeatCount} style={{ '--duration': '44s' }} className="ui-3d-col ui-3d-col-4">
          {col4.map((p, idx) => (
            <CreatorProfileCard key={`c4-${p.username}-${idx}`} profile={p} />
          ))}
        </Marquee>

        {/* Column 5: Downward */}
        <Marquee vertical pauseOnHover repeat={repeatCount} style={{ '--duration': '38s' }} className="ui-3d-col ui-3d-col-5">
          {col5.map((p, idx) => (
            <CreatorProfileCard key={`c5-${p.username}-${idx}`} profile={p} />
          ))}
        </Marquee>
      </div>

      {/* Four-way edge vignette gradients */}
      <div className="ui-3d-gradient-top" />
      <div className="ui-3d-gradient-bottom" />
      <div className="ui-3d-gradient-left" />
      <div className="ui-3d-gradient-right" />
    </div>
  );
}

// Alias export for compatibility
export { ThreeDProfiles as ThreeDTestimonials };
