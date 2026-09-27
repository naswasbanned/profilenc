import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  MapPin,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { safeUrl } from '../../lib/safeUrl';

export default function GalleryBlock({ data = {} }) {
  const {
    items = [],
    columns,
    aspectRatio = 'square', // 'square' | 'wide' | 'tall' | 'natural'
    showCaptions = true,
  } = data;

  const photos = Array.isArray(items) ? items : [];
  const [activeIdx, setActiveIdx] = useState(null);
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(() => setActiveIdx(null));

  // Dynamic columns: matches photo count up to the maximum selected in the edit block (default 3, max 4)
  const maxCols = typeof columns === 'number' && columns >= 1 ? Math.min(columns, 4) : 3;
  const dynamicCols = Math.min(Math.max(photos.length, 1), maxCols);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, photos.length]);

  if (photos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '36px', color: 'var(--card-text-muted, var(--color-text-secondary, #8b949e))', fontSize: '0.85rem' }}>
        No photos in this gallery yet. Click Edit to add photos.
      </div>
    );
  }

  const activePhoto = activeIdx !== null ? photos[activeIdx] : null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % photos.length);
  };

  return (
    <>
      <div className={`gallery-grid cols-${dynamicCols} ratio-${aspectRatio || 'square'}`}>
        {photos.map((item, idx) => {
          const src = typeof item === 'string' ? item : item.src || item.url || item.imageUrl;
          const title = item.title || item.caption || '';
          const location = item.location || '';
          const date = item.date || '';

          if (!src) return null;

          return (
            <div
              key={item.id || idx}
              className="gallery-card"
              onClick={() => setActiveIdx(idx)}
            >
              <div className="gallery-img-wrap">
                <OptimizedImage
                  src={src}
                  alt={title || `Gallery photo ${idx + 1}`}
                  className="gallery-card-img"
                />
                <div className="gallery-card-overlay">
                  <div className="gallery-overlay-badge">
                    <Maximize2 size={13} />
                  </div>
                  {showCaptions && (title || location || date) && (
                    <div className="gallery-overlay-info">
                      {title && <h4 className="gallery-overlay-title">{title}</h4>}
                      <div className="gallery-overlay-meta">
                        {location && (
                          <span>
                            <MapPin size={10} /> {location}
                          </span>
                        )}
                        {date && (
                          <span>
                            <Calendar size={10} /> {date}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Photo Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            className="gallery-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            {hintVisible && (
              <div className="modal-double-click-hint">
                <span>Click once more outside to close (or use ✕)</span>
              </div>
            )}
            <div className="gallery-lightbox-container" onClick={(e) => e.stopPropagation()}>
              {/* Top Controls */}
              <div className="gallery-lightbox-header">
                <span className="gallery-lightbox-counter">
                  {activeIdx + 1} / {photos.length}
                </span>
                <button
                  type="button"
                  className="gallery-lightbox-close"
                  onClick={() => setActiveIdx(null)}
                  title="Close (Esc)"
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Main Image Area with Nav Arrows */}
              <div className="gallery-lightbox-stage">
                {photos.length > 1 && (
                  <button
                    type="button"
                    className="gallery-nav-btn prev"
                    onClick={handlePrev}
                    title="Previous photo (Left Arrow)"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                <div className="gallery-lightbox-image-wrap">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activePhoto.id || activeIdx}
                      src={activePhoto.url || activePhoto.src || activePhoto.imageUrl || (typeof activePhoto === 'string' ? activePhoto : '')}
                      alt={activePhoto.alt || activePhoto.title || `Photo ${activeIdx + 1}`}
                      className="gallery-lightbox-img"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                    />
                  </AnimatePresence>
                </div>

                {photos.length > 1 && (
                  <button
                    type="button"
                    className="gallery-nav-btn next"
                    onClick={handleNext}
                    title="Next photo (Right Arrow)"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

              {/* Bottom Caption & Meta Footer */}
              {(activePhoto.title || activePhoto.caption || activePhoto.description || activePhoto.location || activePhoto.date || activePhoto.linkUrl) && (
                <div className="gallery-lightbox-footer">
                  <div className="gallery-lightbox-info">
                    {(activePhoto.title || activePhoto.caption) && (
                      <h3 className="gallery-lightbox-title">
                        {activePhoto.title || activePhoto.caption}
                      </h3>
                    )}
                    {activePhoto.description && (
                      <p className="gallery-lightbox-desc">{activePhoto.description}</p>
                    )}
                    <div className="gallery-lightbox-meta">
                      {activePhoto.location && (
                        <span>
                          <MapPin size={12} /> {activePhoto.location}
                        </span>
                      )}
                      {activePhoto.date && (
                        <span>
                          <Calendar size={12} /> {activePhoto.date}
                        </span>
                      )}
                      {activePhoto.tag && (
                        <span className="gallery-lightbox-tag">
                          <Tag size={11} /> {activePhoto.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {safeUrl(activePhoto.linkUrl) && (
                    <a
                      href={safeUrl(activePhoto.linkUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gallery-lightbox-link"
                    >
                      <span>{activePhoto.linkLabel || 'View Source'}</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
