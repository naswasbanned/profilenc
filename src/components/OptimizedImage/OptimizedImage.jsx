import { useState, useRef, useEffect } from 'react';
import './OptimizedImage.css';

/**
 * OptimizedImage – drops in wherever <img> is used.
 * Features:
 *  • Native lazy-loading (loading="lazy")
 *  • Blur-up placeholder while loading
 *  • Fade-in transition on load
 *  • Optional responsive sizes via CSS
 *  • decoding="async" for non-blocking decode
 */
export default function OptimizedImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  style,
  wrapperStyle,
  width,
  height,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  // If the image was already cached and loaded before React hydrated
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div
      className={`optimized-image-wrapper ${loaded ? 'loaded' : ''} ${wrapperClassName}`.trim()}
      style={wrapperStyle || style}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`optimized-image ${className}`}
        loading="lazy"
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        {...rest}
      />
    </div>
  );
}
