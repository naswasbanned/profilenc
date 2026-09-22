import * as React from 'react';
import './avatar.css';

const Avatar = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`ui-avatar ${className}`} {...props} />
));
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef(({ className = '', src, alt = '', onError, ...props }, ref) => {
  const [hasError, setHasError] = React.useState(false);

  if (hasError || !src) return null;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`ui-avatar-image ${className}`}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e);
      }}
      {...props}
    />
  );
});
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`ui-avatar-fallback ${className}`} {...props} />
));
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;
