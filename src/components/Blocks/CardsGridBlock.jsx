import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Maximize2, X } from 'lucide-react';
import { useDoubleBackdropClose } from '../../hooks/useDoubleBackdropClose';
import OptimizedImage from '../OptimizedImage/OptimizedImage';
import { safeUrl } from '../../lib/safeUrl';

export default function CardsGridBlock({ data = {} }) {
  const {
    columns = 2,
    items = [],
  } = data;

  const [activeModalImage, setActiveModalImage] = useState(null);
  const { handleBackdropClick, hintVisible } = useDoubleBackdropClose(() => setActiveModalImage(null));

  const cardList = Array.isArray(items) ? items : [];

  if (cardList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#666', fontSize: '0.85rem' }}>
        No items in this cards grid yet. Click Edit to add items.
      </div>
    );
  }

  return (
    <>
      <div className={`cards-grid cols-${columns}`}>
        {cardList.map((item, idx) => {
          const img = item.image || item.imageUrl || item.coverImage;
          return (
            <div
              key={item.id || idx}
              className="card-item"
            >
              {img && (
                <div
                  className="card-media"
                  onClick={() => setActiveModalImage({ src: img, title: item.title })}
                  style={{ cursor: 'pointer' }}
                >
                  <OptimizedImage
                    src={img}
                    alt={item.title}
                    className="card-img"
                    width={400}
                    height={220}
                  />
                  {item.badge && <span className="card-badge">{item.badge}</span>}
                </div>
              )}

              <div className="card-content">
                {item.category && !img && (
                  <span className="spec-category">{item.category}</span>
                )}
                <h3 className="card-title">{item.title}</h3>
              {item.description && <p className="card-desc">{item.description}</p>}

              {item.tags && item.tags.length > 0 && (
                <div className="card-tags">
                  {(Array.isArray(item.tags)
                    ? item.tags
                    : item.tags.split(',').map((t) => t.trim()).filter(Boolean)
                  ).map((tag, tIdx) => (
                    <span key={tIdx} className="card-tag">{tag}</span>
                  ))}
                </div>
              )}

              {(item.linkUrl || item.actionLabel) && (
                <div className="card-footer">
                  {safeUrl(item.linkUrl) ? (
                    <a
                      href={safeUrl(item.linkUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-action-btn"
                    >
                      <span>{item.actionLabel || 'View Project'}</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="card-action-btn">{item.actionLabel}</span>
                  )}
                  {item.price && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-color, #00d4ff)' }}>
                      {item.price}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          );
        })}
    </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {activeModalImage && (
          <motion.div
            className="image-zoom-backdrop"
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
              className="image-zoom-dialog"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="image-zoom-img-wrap">
                <button
                  type="button"
                  className="image-zoom-close"
                  onClick={() => setActiveModalImage(null)}
                  title="Close image"
                >
                  <X size={20} />
                </button>
                <img
                  src={activeModalImage.src}
                  alt={activeModalImage.title || 'Zoomed card image'}
                  className="image-zoom-img"
                />
              </div>
              {activeModalImage.title && (
                <div className="image-zoom-caption">
                  {activeModalImage.title}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
