import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '../OptimizedImage/OptimizedImage';

// Deck shape and width are set per block from the editor. The stack layers are
// absolutely positioned, so the container needs a concrete ratio rather than
// following the image.
const DECK_RATIOS = {
  landscape: '16 / 10',
  wide: '21 / 9',
  square: '1 / 1',
  portrait: '4 / 5',
};

const DECK_SIZES = {
  small: '340px',
  medium: '480px',
  large: '640px',
  full: '100%',
};

export default function StackedDeckBlock({ data = {} }) {
  const {
    images = [],
    caption = '',
    aspectRatio = 'landscape',
    size = 'medium',
  } = data;

  const [currentIndex, setCurrentIndex] = useState(0);

  const imgList = Array.isArray(images) ? images : [];
  const total = imgList.length;

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: 'var(--card-text-muted, var(--color-text-secondary, #8b949e))', fontSize: '0.85rem' }}>
        No images added to this stacked deck. Click Edit to add images.
      </div>
    );
  }

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const currentItem = typeof imgList[currentIndex] === 'string'
    ? { src: imgList[currentIndex], title: caption }
    : imgList[currentIndex];

  return (
    <div className="stacked-deck-wrap">
      <div
        className="deck-container"
        data-deck-ratio={aspectRatio}
        data-deck-size={size}
        style={{
          aspectRatio: DECK_RATIOS[aspectRatio] || DECK_RATIOS.landscape,
          maxWidth: DECK_SIZES[size] || DECK_SIZES.medium,
        }}
      >
        {/* Layer cards mimicking stack thickness */}
        <div className="deck-layer layer-back" />
        <div className="deck-layer layer-mid" />

        {/* Main Card */}
        <div className="deck-main-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%', height: '100%' }}
            >
              <OptimizedImage
                src={currentItem?.src || currentItem}
                alt={currentItem?.title || `Slide ${currentIndex + 1}`}
                className="deck-img"
                width={500}
                height={320}
              />
            </motion.div>
          </AnimatePresence>

          {/* Indicator Badge */}
          <div className="deck-badge">
            <Layers size={12} />
            <span>{currentIndex + 1} / {total}</span>
          </div>

          {/* Nav Controls */}
          {total > 1 && (
            <div className="deck-controls">
              <button
                type="button"
                className="deck-nav-btn"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="deck-nav-btn"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
