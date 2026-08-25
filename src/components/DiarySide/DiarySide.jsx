import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Quote,
  Calendar,
  Sparkles,
  PenLine,
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

export default function DiarySide({ profile, entries }) {
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
      <motion.section className="diary-hero" variants={itemVariants}>
        <div className="diary-hero-content">
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
          <div className="diary-hero-text">
            <h1 className="diary-name">{profile.name}</h1>
            <p className="diary-tagline">
              <PenLine size={16} />
              <span>{profile.tagline}</span>
            </p>
            <p className="diary-bio">{profile.bio}</p>
            <div className="diary-stats-row">
              <div className="diary-stat">
                <span className="diary-stat-value">{entries.length}</span>
                <span className="diary-stat-label">posts</span>
              </div>
              <div className="diary-stat">
                <span className="diary-stat-value">
                  {entries.reduce((sum, e) => sum + (e.likes || 0), 0)}
                </span>
                <span className="diary-stat-label">likes</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Pinned Quote */}
      {profile.pinnedQuote && (
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
      <motion.section className="diary-section" variants={itemVariants}>
        <h2 className="diary-section-title">
          <Sparkles size={20} />
          <span>Recent Broadcasts</span>
        </h2>

        <div className="diary-feed">
          {entries.map((entry) => {
            const mood = moodMap[entry.mood] || { emoji: '📝', color: '#f4a261' };
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

                {/* Entry Image (optional) */}
                {entry.image && (
                  <div className="diary-entry-image">
                    <OptimizedImage
                      src={entry.image}
                      alt={entry.title || 'Diary image'}
                      className="diary-img"
                      width={600}
                      height={300}
                    />
                  </div>
                )}

                {/* Entry Footer — social interaction bar */}
                <div className="diary-entry-footer">
                  <div className="diary-entry-actions">
                    <button className="diary-action-btn" type="button">
                      <Heart size={18} />
                    </button>
                    <button className="diary-action-btn" type="button">
                      <MessageCircle size={18} />
                    </button>
                    <button className="diary-action-btn" type="button">
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
    </motion.div>
  );
}
