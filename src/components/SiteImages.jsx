import { useState } from 'react';
import { SITE_IMAGES } from '../data/bookingData.js';

export function FortsBrandLogo({ className = 'w-12 h-12' }) {
  const [imgError, setImgError] = useState(false);

  if (!SITE_IMAGES.logo || imgError) {
    return null;
  }

  return (
    <img
      src={SITE_IMAGES.logo}
      alt="The Forts Riverside Private Resort Logo"
      onError={() => setImgError(true)}
      className={`${className} rounded-full object-contain shadow-xs shrink-0`}
    />
  );
}

export function SmartResortImage({ localSrc, fallbackSrc, alt, className }) {
  const [useFallback, setUseFallback] = useState(!localSrc);
  const activeSrc = useFallback ? fallbackSrc : localSrc;

  return (
    <img
      src={activeSrc}
      alt={alt}
      onError={() => {
        if (!useFallback && fallbackSrc) {
          setUseFallback(true);
        }
      }}
      className={className}
    />
  );
}
