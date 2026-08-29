import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Calendar,
  User,
  ExternalLink,
  Film,
  Tag,
} from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { parseVideoUrl } from '../../utils/videoUtils';

export default function VideoGalleryBlock({ data = {} }) {
  const {
    items = [],
    columns = 3,
    aspectRatio = '16:9', // '16:9' | '9:16' | 'square' | '4:3'
    showCaptions = true,
  } = data;

  const rawVideos = Array.isArray(items) ? items : [];
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeIdx, setActiveIdx] = useState(null);
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(() => setActiveIdx(null));

  // Extract unique categories / tags
  const tags = useMemo(() => {
    const set = new Set();
    rawVideos.forEach((v) => {
      if (v.tag && typeof v.tag === 'string') {
        v.tag.split(',').forEach((t) => {
          const trimmed = t.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return ['All', ...Array.from(set)];
  }, [rawVideos]);

  // Filtered video list
  const filteredVideos = useMemo(() => {
    if (selectedTag === 'All') return rawVideos;
    return rawVideos.filter((v) => {
      if (!v.tag) return false;
      return v.tag
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .includes(selectedTag.toLowerCase());
    });
  }, [rawVideos, selectedTag]);

  // Keyboard navigation for Cinema Lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null ? (prev + 1) % filteredVideos.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null ? (prev - 1 + filteredVideos.length) % filteredVideos.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, filteredVideos.length]);

  if (rawVideos.length === 0) {
    return (
      <div className="video-empty-state">
        <Film size={24} />
        <p>No videos in this gallery yet. Click Edit to add video clips.</p>
      </div>
    );
  }

  const activeVideo = activeIdx !== null ? filteredVideos[activeIdx] : null;
  const activeParsed = activeVideo ? parseVideoUrl(activeVideo.videoUrl || activeVideo.url || '') : null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + filteredVideos.length) % filteredVideos.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % filteredVideos.length);
  };

  return (
    <div className="video-gallery-block">
      {/* Category / Tag Filter Tabs */}
      {tags.length > 2 && (
        <div className="video-gallery-filter-bar">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`video-gallery-filter-btn ${selectedTag === tag ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Video Cards Grid */}
      <div className={`video-gallery-grid cols-${columns || 3} ratio-${aspectRatio.replace(':', '-')}`}>
        {filteredVideos.map((item, idx) => {
          const url = item.videoUrl || item.url || item.src || '';
          const parsed = parseVideoUrl(url);
          const poster = item.posterUrl || item.imageUrl || item.thumbnailUrl || parsed.thumbnailUrl || parsed.fallbackThumbnailUrl || '/images/projects/template.png';
          const title = item.title || item.name || '';
          const caption = item.caption || item.description || '';
          const duration = item.duration || '';
          const author = item.author || item.creator || '';
          const date = item.date || '';
          const tag = item.tag || '';

          return (
            <motion.div
              key={item.id || idx}
              className="video-gallery-card"
              onClick={() => setActiveIdx(idx)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="video-gallery-poster-wrap">
                <OptimizedImage
                  src={poster}
                  alt={title || `Video ${idx + 1}`}
                  className="video-gallery-poster-img"
                />

                {/* Top Badges */}
                <div className="video-gallery-top-badges">
                  {tag && <span className="video-tag-pill">{tag.split(',')[0].trim()}</span>}
                  {duration && (
                    <span className="video-duration-pill">
                      <Clock size={10} /> {duration}
                    </span>
                  )}
                </div>

                {/* Hover Play Button Overlay */}
                <div className="video-gallery-card-overlay">
                  <div className="video-gallery-card-play-btn">
                    <Play size={20} className="video-card-play-icon" />
                  </div>
                </div>
              </div>

              {/* Card Meta & Captions */}
              {showCaptions && (title || caption || author || date) && (
                <div className="video-gallery-card-info">
                  {title && <h4 className="video-gallery-card-title">{title}</h4>}
                  {caption && <p className="video-gallery-card-caption">{caption}</p>}
                  <div className="video-gallery-card-meta">
                    {author && (
                      <span className="video-meta-author">
                        <User size={10} /> {author}
                      </span>
                    )}
                    {date && (
                      <span className="video-meta-date">
                        <Calendar size={10} /> {date}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Cinema Lightbox Modal Player */}
      <AnimatePresence>
        {activeIdx !== null && activeVideo && (
          <div className="video-lightbox-backdrop" onClick={handleBackdropClick}>
            {hintVisible && (
              <div className="modal-double-click-hint">
                <span>Click once more outside to close (or use ✕)</span>
              </div>
            )}

            {/* Navigation Arrows */}
            {filteredVideos.length > 1 && (
              <>
                <button
                  type="button"
                  className="video-lightbox-nav prev"
                  onClick={handlePrev}
                  title="Previous video (← Arrow Left)"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className="video-lightbox-nav next"
                  onClick={handleNext}
                  title="Next video (→ Arrow Right)"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Lightbox Container */}
            <motion.div
              className="video-lightbox-cinema"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Lightbox Header Bar */}
              <div className="video-lightbox-header">
                <div className="video-lightbox-header-info">
                  <span className="video-lightbox-counter">
                    VIDEO {activeIdx + 1} OF {filteredVideos.length}
                  </span>
                  {activeVideo.tag && <span className="video-lightbox-tag">{activeVideo.tag}</span>}
                </div>
                <button
                  type="button"
                  className="video-lightbox-close"
                  onClick={() => setActiveIdx(null)}
                  title="Close cinema player (Esc)"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Active Video Player Screen */}
              <div className="video-lightbox-player-screen">
                {activeParsed?.isDirect ? (
                  <video
                    src={activeVideo.videoUrl || activeVideo.url}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="video-lightbox-active-player"
                  />
                ) : (
                  <iframe
                    src={activeParsed?.embedUrl || activeVideo.videoUrl || activeVideo.url}
                    title={activeVideo.title || 'Video Player'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="video-lightbox-active-player"
                  />
                )}
              </div>

              {/* Video Info Drawer */}
              {(activeVideo.title || activeVideo.caption || activeVideo.author || activeVideo.videoUrl) && (
                <div className="video-lightbox-footer">
                  <div className="video-lightbox-footer-text">
                    {activeVideo.title && <h3 className="video-lightbox-title">{activeVideo.title}</h3>}
                    {activeVideo.caption && <p className="video-lightbox-caption">{activeVideo.caption}</p>}
                    <div className="video-lightbox-meta-row">
                      {activeVideo.author && (
                        <span>
                          <User size={11} /> {activeVideo.author}
                        </span>
                      )}
                      {activeVideo.date && (
                        <span>
                          <Calendar size={11} /> {activeVideo.date}
                        </span>
                      )}
                      {activeVideo.duration && (
                        <span>
                          <Clock size={11} /> {activeVideo.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {(activeVideo.videoUrl || activeVideo.url) && (
                    <a
                      href={activeVideo.videoUrl || activeVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-lightbox-watch-btn"
                    >
                      <span>Watch Source</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
