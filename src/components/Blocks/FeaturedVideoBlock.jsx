import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  ExternalLink,
  Film,
  Sparkles,
} from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { parseVideoUrl } from '../../utils/videoUtils';

export default function FeaturedVideoBlock({ data = {} }) {
  const {
    videoUrl = '',
    posterUrl = '',
    title = '',
    badge = '',
    description = '',
    aspectRatio = '16:9', // '16:9' | '21:9' | '4:3'
    autoplay = false,
    muted = true,
    loop = false,
    actions = [],
  } = data;

  const [isPlaying, setIsPlaying] = useState(Boolean(autoplay));

  const parsed = useMemo(() => parseVideoUrl(videoUrl), [videoUrl]);

  const effectivePoster = useMemo(() => {
    if (posterUrl) return posterUrl;
    if (parsed.thumbnailUrl) return parsed.thumbnailUrl;
    if (parsed.fallbackThumbnailUrl) return parsed.fallbackThumbnailUrl;
    return '/images/projects/template.png';
  }, [posterUrl, parsed]);

  if (!videoUrl && !title && !description) {
    return (
      <div className="video-empty-state">
        <Film size={24} />
        <p>No video configured yet. Click Edit to add a video URL.</p>
      </div>
    );
  }

  return (
    <div className="featured-video-container">
      {/* Cinematic Ambient Glow & Video Frame */}
      <div className={`featured-video-frame ratio-${aspectRatio.replace(':', '-')}`}>
        {isPlaying ? (
          <div className="featured-video-player-wrap">
            {parsed.isDirect ? (
              <video
                src={videoUrl}
                poster={effectivePoster}
                controls
                autoPlay
                muted={muted}
                loop={loop}
                playsInline
                preload="metadata"
                className="featured-video-element"
              />
            ) : (
              <iframe
                src={parsed.embedUrl || videoUrl}
                title={title || 'Featured Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="featured-video-element"
              />
            )}
          </div>
        ) : (
          <div
            className="featured-video-facade"
            onClick={() => setIsPlaying(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setIsPlaying(true);
            }}
          >
            <OptimizedImage
              src={effectivePoster}
              alt={title || 'Featured Video Poster'}
              className="featured-video-poster"
            />
            <div className="featured-video-overlay">
              <motion.div
                className="featured-video-play-btn"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="featured-video-play-glow" />
                <Play size={28} className="featured-video-play-icon" />
              </motion.div>

              <div className="featured-video-facade-meta">
                {badge && <span className="featured-video-badge">{badge}</span>}
                <span className="featured-video-platform-tag">
                  <Film size={11} /> {parsed.platform}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Content & Metadata Footer */}
      {(title || description || (actions && actions.length > 0)) && (
        <div className="featured-video-info">
          <div className="featured-video-info-main">
            {badge && !isPlaying && <div className="featured-video-info-badge">{badge}</div>}
            {title && <h3 className="featured-video-title">{title}</h3>}
            {description && <p className="featured-video-desc">{description}</p>}
          </div>

          {actions && actions.length > 0 && (
            <div className="featured-video-actions">
              {actions.map((act, idx) => {
                if (!act.label || !act.url) return null;
                return (
                  <a
                    key={idx}
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`featured-video-btn ${act.primary ? 'primary' : 'secondary'}`}
                  >
                    <span>{act.label}</span>
                    <ExternalLink size={13} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
