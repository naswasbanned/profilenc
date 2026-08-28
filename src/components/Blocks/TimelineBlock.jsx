import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

export default function TimelineBlock({ data = {} }) {
  const { items = [] } = data;
  const list = Array.isArray(items) ? items : [];

  const [previewImage, setPreviewImage] = useState(null);

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
                    {item.tags.map((tag, tIdx) => (
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
            className="article-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(5,5,8,0.92)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '88vh',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
              <img
                src={previewImage}
                alt="Enlarged view"
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
