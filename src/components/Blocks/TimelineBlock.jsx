import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

export default function TimelineBlock({ data = {} }) {
  const { items = [] } = data;
  const list = Array.isArray(items) ? items : [];

  const [previewImage, setPreviewImage] = useState(null);
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(() => setPreviewImage(null));

  if (list.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#666', fontSize: '0.85rem' }}>
        No timeline entries yet. Click Edit to add milestones.
      </div>
    );
  }

  return (
    <>
      <div className="timeline-block">
        {list.map((item, idx) => {
          const rawImages = Array.isArray(item.images)
            ? item.images
            : Array.isArray(item.gallery)
            ? item.gallery
            : item.imageUrl
            ? [item.imageUrl]
            : [];
          
          const images = rawImages.filter(Boolean);

          return (
            <div key={item.id || idx} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-meta">
                  <h3 className="timeline-role">{item.role || item.title}</h3>
                  {item.period && (
                    <span className="timeline-date">
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {item.period}
                    </span>
                  )}
                </div>

                {item.company && (
                  <p className="timeline-company">{item.company}{item.location ? ` • ${item.location}` : ''}</p>
                )}

                {item.description && <p className="timeline-desc">{item.description}</p>}

                {/* Multiple Images / Work Samples Gallery */}
                {images.length > 0 && (
                  <div className={`timeline-gallery-grid cols-${Math.min(images.length, 3)}`}>
                    {images.map((img, iIdx) => {
                      const src = typeof img === 'string' ? img : img.src || img.url;
                      if (!src) return null;
                      return (
                        <div
                          key={iIdx}
                          className="timeline-gallery-item"
                          onClick={() => setPreviewImage(src)}
                          title="Click to view full image"
                        >
                          <OptimizedImage
                            src={src}
                            alt={`${item.role || 'Experience'} sample ${iIdx + 1}`}
                            className="timeline-gallery-img"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {item.bullets && item.bullets.length > 0 && (
                  <ul className="timeline-bullets">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="card-tags" style={{ marginTop: '14px', marginBottom: 0 }}>
                    {(Array.isArray(item.tags)
                      ? item.tags
                      : item.tags.split(',').map((t) => t.trim()).filter(Boolean)
                    ).map((tag, tIdx) => (
                      <span key={tIdx} className="card-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="timeline-lightbox-backdrop"
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
            <motion.div
              className="timeline-lightbox-dialog"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="timeline-lightbox-img-wrap">
                <button
                  type="button"
                  className="timeline-lightbox-close"
                  onClick={() => setPreviewImage(null)}
                  title="Close preview"
                >
                  <X size={20} />
                </button>
                <img
                  src={previewImage}
                  alt="Enlarged timeline view"
                  className="timeline-lightbox-img"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
