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

export default function GalleryBlock({ data = {} }) {
  const {
    items = [],
    columns = 3,
    aspectRatio = 'square', // 'square' | 'wide' | 'tall' | 'natural'
    showCaptions = true,
  } = data;

  const photos = Array.isArray(items) ? items : [];
  const [activeIdx, setActiveIdx] = useState(null);
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(() => setActiveIdx(null));

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
      <div style={{ textAlign: 'center', padding: '36px', color: '#888', fontSize: '0.85rem' }}>
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
      <div className={`gallery-grid cols-${columns || 3} ratio-${aspectRatio || 'square'}`}>
        {photos.map((item, idx) => {
          const src = typeof item === 'string' ? item : item.src || item.url || item.imageUrl;
          const title = item.title || item.caption || '';
          const location = item.location || '';
          const date = item.date || '';

          if (!src) return null;

          return (
            <motion.div
              key={item.id || idx}
              className="gallery-card"
              onClick={() => setActiveIdx(idx)}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
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
            </motion.div>
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
                >
                  <X size={20} />
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

                <motion.div
                  key={activeIdx}
                  className="gallery-lightbox-image-wrap"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                >
                  <img
                    src={typeof activePhoto === 'string' ? activePhoto : activePhoto.src || activePhoto.url || activePhoto.imageUrl}
                    alt={activePhoto.title || `Photo ${activeIdx + 1}`}
                    className="gallery-lightbox-img"
                  />
                </motion.div>

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
                  <div>
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

                  {activePhoto.linkUrl && (
                    <a
                      href={activePhoto.linkUrl}
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
