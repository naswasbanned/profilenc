import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Quote,
  Calendar,
  Sparkles,
  PenLine,
  Eye,
  X,
  Play,
} from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import './DiarySide.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Mood → emoji + color mapping
const moodMap = {
  excited: { emoji: '🔥', color: '#ff6b6b' },
  focused: { emoji: '🎯', color: '#74b9ff' },
  proud: { emoji: '💪', color: '#a29bfe' },
  amused: { emoji: '😂', color: '#ffeaa7' },
  mysterious: { emoji: '🤫', color: '#dfe6e9' },
  opinionated: { emoji: '🗣️', color: '#fd79a8' },
  exhausted: { emoji: '😴', color: '#636e72' },
  reflective: { emoji: '🪞', color: '#81ecec' },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function isVideoUrl(url) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
}

function getUrlAspectRatio(url) {
  if (!url) return null;
  const match = url.match(/(\d+)x(\d+)/i);
  if (match) {
    const w = parseInt(match[1], 10);
    const h = parseInt(match[2], 10);
    if (w && h) return w / h;
  }
  return null;
}

// Media Attachment Component
function DiaryMediaAttachment({ entry, onOpenModal }) {
  const mediaSrc = entry.video || entry.image;
  const isVideo = Boolean(
    entry.video ||
    entry.type === 'video' ||
    entry.mediaType === 'video' ||
    isVideoUrl(mediaSrc)
  );

  // Determine initial 16:9 state (from JSON config or URL dimensions)
  const [is16By9, setIs16By9] = useState(() => {
    if (isVideo) return false;
    if (entry.aspectRatio === '16:9' || entry.aspectRatio === '16/9') return true;
    if (entry.aspectRatio && entry.aspectRatio !== '16:9') return false;
    const urlRatio = getUrlAspectRatio(mediaSrc);
    if (urlRatio) {
      return Math.abs(urlRatio - 16 / 9) < 0.08;
    }
    return false;
  });

  const handleImageLoad = (e) => {
    if (!isVideo && e.target?.naturalWidth && e.target?.naturalHeight) {
      const ratio = e.target.naturalWidth / e.target.naturalHeight;
      const matches169 = Math.abs(ratio - 16 / 9) < 0.08;
      setIs16By9(matches169);
    }
  };

  const handleOpen = () => {
    onOpenModal({
      src: mediaSrc,
      isVideo,
      alt: entry.title || 'Diary attachment',
      date: formatDate(entry.date),
      caption: entry.content,
    });
  };

  // Rule: View Attachment & blur ONLY when media is NOT 16:9 OR media is video.
  // If 16:9 and not video -> show clean right away.
  const needsAttachmentOverlay = isVideo || !is16By9;

  return (
    <div
      className={`diary-entry-image-container ${
        needsAttachmentOverlay ? 'is-attachment-blurred' : 'is-direct-169'
      }`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleOpen();
        }
      }}
      aria-label="View attached media"
    >
      <div
        className={`diary-image-media-wrapper ${
          needsAttachmentOverlay ? 'blurred-wrapper' : 'clean-wrapper'
        }`}
      >
        {isVideo ? (
          <video
            src={mediaSrc}
            className="diary-media-element blurred-element"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={mediaSrc}
            alt={entry.title || 'Diary image'}
            className={`diary-media-element ${
              needsAttachmentOverlay ? 'blurred-element' : 'clean-element'
            }`}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
      </div>

      {needsAttachmentOverlay && (
        <div className="diary-image-overlay">
          <button
            type="button"
            className="diary-view-attachment-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
          >
            {isVideo ? <Play size={16} /> : <Eye size={16} />}
            <span>{isVideo ? 'View Video' : 'View Attachment'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function DiarySide({ profile, visibility = null, entries }) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      }
    };
    if (selectedMedia) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedMedia]);

  // ⚠️ CRITICAL: Gate on ALL data props before mounting animated container.
  // See AGENTS.md — Framer Motion Data-Gating Rule.
  const isReady = profile && entries;
  if (!isReady) {
    return (
      <div className="diary-side">
        <div className="diary-bg-grain" />
        <div className="diary-bg-glow" />
      </div>
    );
  }

  // Filter hidden entries
  const activeEntries = (entries || []).filter((e) => !e.hidden);

  return (
    <motion.div
      key="diary-loaded"
      className="diary-side"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ambient background */}
      <div className="diary-bg-grain" />
      <div className="diary-bg-glow" />

      {/* Hero Section */}
      {visibility?.hero !== false && (
        <motion.section className="diary-hero" variants={itemVariants}>
          <div className="diary-hero-content">
            {visibility?.avatar !== false && profile.avatar && (
              <div className="diary-avatar-wrapper">
                <div className="diary-avatar">
                  <OptimizedImage
                    src={profile.avatar}
                    alt="Profile"
                    className="diary-avatar-img"
                    width={120}
                    height={120}
                  />
                </div>
              </div>
            )}
            <div className="diary-hero-text">
              {visibility?.name !== false && profile.name && (
                <h1 className="diary-name">{profile.name}</h1>
              )}
              {visibility?.tagline !== false && profile.tagline && (
                <p className="diary-tagline">
                  <PenLine size={16} />
                  <span>{profile.tagline}</span>
                </p>
              )}
              {visibility?.bio !== false && profile.bio && (
                <p className="diary-bio">{profile.bio}</p>
              )}
              {visibility?.bio !== false && (
                <div className="diary-stats-row">
                  <div className="diary-stat">
                    <span className="diary-stat-value">{activeEntries.length}</span>
                    <span className="diary-stat-label">posts</span>
                  </div>
                  <div className="diary-stat">
                    <span className="diary-stat-value">
                      {activeEntries.reduce((sum, e) => sum + (e.likes || 0), 0)}
                    </span>
                    <span className="diary-stat-label">likes</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Pinned Quote */}
      {visibility?.pinnedQuote !== false && profile.pinnedQuote && (
        <motion.section className="diary-section diary-pinned" variants={itemVariants}>
          <div className="diary-pinned-card">
            <Quote size={24} className="diary-quote-icon" />
            <p className="diary-pinned-text">{profile.pinnedQuote}</p>
            <div className="diary-pinned-label">
              <Bookmark size={14} />
              <span>Pinned</span>
            </div>
          </div>
        </motion.section>
      )}

      {/* Diary Feed */}
      {visibility?.broadcasts !== false && activeEntries.length > 0 && (
        <motion.section className="diary-section" variants={itemVariants}>
          <h2 className="diary-section-title">
            <Sparkles size={20} />
            <span>Recent Broadcasts</span>
          </h2>

          <div className="diary-feed">
            {activeEntries.map((entry) => {
              const mood = moodMap[entry.mood] || { emoji: '📝', color: '#f4a261' };
              const hasMedia = Boolean(entry.image || entry.video);

              return (
                <motion.article
                  key={entry.id}
                  className="diary-entry-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Entry Header */}
                  <div className="diary-entry-header">
                    <div className="diary-entry-avatar-mini">
                      <OptimizedImage
                        src={profile.avatar}
                        alt="Profile"
                        className="diary-avatar-img-mini"
                        width={36}
                        height={36}
                      />
                    </div>
                    <div className="diary-entry-meta">
                      <span className="diary-entry-author">{profile.name}</span>
                      <span className="diary-entry-time">
                        <Calendar size={12} />
                        {timeAgo(entry.date)}
                      </span>
                    </div>
                    <div
                      className="diary-mood-badge"
                      style={{ '--mood-color': mood.color }}
                    >
                      <span>{mood.emoji}</span>
                      <span className="diary-mood-label">{entry.mood}</span>
                    </div>
                  </div>

                  {/* Entry Content */}
                  <p className="diary-entry-content">{entry.content}</p>

                  {/* Media Attachment (16:9 direct or blurred with View Attachment button) */}
                  {hasMedia && (
                    <DiaryMediaAttachment
                      entry={entry}
                      onOpenModal={setSelectedMedia}
                    />
                  )}

                  {/* Entry Footer — social interaction bar */}
                  <div className="diary-entry-footer">
                    <div className="diary-entry-actions">
                      <button className="diary-action-btn" type="button" aria-label="Like post">
                        <Heart size={18} />
                      </button>
                      <button className="diary-action-btn" type="button" aria-label="Comment on post">
                        <MessageCircle size={18} />
                      </button>
                      <button className="diary-action-btn" type="button" aria-label="Share post">
                        <Share2 size={18} />
                      </button>
                    </div>
                    {entry.likes > 0 && (
                      <span className="diary-likes-count">
                        {entry.likes} likes
                      </span>
                    )}
                  </div>

                  {/* Date line */}
                  <span className="diary-entry-date">{formatDate(entry.date)}</span>
                </motion.article>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Lightbox / Zoomed Singular Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            className="diary-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              className="diary-modal-wrapper"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="diary-modal-header">
                <div className="diary-modal-meta">
                  <span className="diary-modal-title">
                    {selectedMedia.isVideo ? 'Video Preview' : 'Attachment View'}
                  </span>
                  {selectedMedia.date && (
                    <span className="diary-modal-date">{selectedMedia.date}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="diary-modal-close-btn"
                  onClick={() => setSelectedMedia(null)}
                  aria-label="Close media preview"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="diary-modal-image-box">
                {selectedMedia.isVideo ? (
                  <video
                    src={selectedMedia.src}
                    controls
                    autoPlay
                    className="diary-modal-video"
                  />
                ) : (
                  <img
                    src={selectedMedia.src}
                    alt={selectedMedia.alt}
                    className="diary-modal-img"
                  />
                )}
              </div>

              {selectedMedia.caption && (
                <div className="diary-modal-caption">
                  <p>{selectedMedia.caption}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
