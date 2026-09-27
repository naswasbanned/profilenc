import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Globe,
  Twitter,
  Youtube,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { safeUrl } from '../../lib/safeUrl';

const socialIcons = {
  Github: <Github size={18} />,
  Linkedin: <Linkedin size={18} />,
  Mail: <Mail size={18} />,
  Instagram: <Instagram size={18} />,
  Twitter: <Twitter size={18} />,
  Youtube: <Youtube size={18} />,
  Globe: <Globe size={18} />,
};

export default function HeroBlock({ data = {} }) {
  const {
    name = 'Your Name',
    tagline = 'Digital Creator & Engineer',
    bio = 'Crafting fluid web experiences, apps, and digital systems.',
    avatarUrl = null,
    statusBadge = null,
    socials = [],
    actions = [],
    align = 'center', // 'center' | 'left' | 'right' | 'split-left' | 'split-right'
  } = data;

  const normalizedAlign = (align === 'middle' ? 'center' : align) || 'center';

  const avatarElement = (
    <div className="hero-avatar-wrap">
      {avatarUrl ? (
        <OptimizedImage
          src={avatarUrl}
          alt={name}
          className="hero-avatar"
          wrapperClassName="hero-avatar-img-wrap"
          width={120}
          height={120}
        />
      ) : (
        <div className="hero-avatar-fallback">
          {name?.[0]?.toUpperCase() || 'U'}
        </div>
      )}

      {statusBadge && (
        <div className="hero-status-badge">
          <span className="hero-status-dot" />
          <span>{statusBadge}</span>
        </div>
      )}
    </div>
  );

  const contentElement = (
    <div className="hero-content-wrap">
      <h1 className="hero-name">{name}</h1>
      {tagline && <p className="hero-tagline">{tagline}</p>}
      {bio && <p className="hero-bio">{bio}</p>}

      {/* Social Links */}
      {socials && socials.length > 0 && (
        <div className="hero-socials">
          {socials.map((s, idx) => {
            const href = safeUrl(s.url);
            if (!href) return null;
            return (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social-link"
              >
                {socialIcons[s.platform] || <Globe size={18} />}
                <span>{s.label || s.platform}</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      {actions && actions.length > 0 && (
        <div className="hero-actions">
          {actions.map((act, idx) => {
            const href = safeUrl(act.url);
            if (!href) return null;
            const isExternal = href.startsWith('http');
            return (
              <a
                key={idx}
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className={`hero-btn ${act.primary ? 'primary' : 'secondary'}`}
              >
                {act.label}
                {isExternal && <ExternalLink size={14} />}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );

  if (normalizedAlign === 'split-left') {
    return (
      <div className="hero-block layout-split layout-split-left">
        <div className="hero-split-media">{avatarElement}</div>
        <div className="hero-split-body">{contentElement}</div>
      </div>
    );
  }

  if (normalizedAlign === 'split-right') {
    return (
      <div className="hero-block layout-split layout-split-right">
        <div className="hero-split-body">{contentElement}</div>
        <div className="hero-split-media">{avatarElement}</div>
      </div>
    );
  }

  return (
    <div className={`hero-block align-${normalizedAlign}`}>
      {avatarElement}
      {contentElement}
    </div>
  );
}
