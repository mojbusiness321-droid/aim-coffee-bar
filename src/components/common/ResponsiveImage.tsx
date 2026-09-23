import React, { useState } from 'react';
import { getAssetUrl } from '../../utils/assets';

interface Props {
  imageKey: string;
  alt: string;
  className?: string;
  aspectRatio?: '16:9' | '4:5' | '4:3' | '1:1';
  priority?: boolean;
  sizes?: string;
}

export const ResponsiveImage: React.FC<Props> = ({
  imageKey,
  alt,
  className = '',
  aspectRatio = '4:5',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}) => {
  const [loaded, setLoaded] = useState(false);

  // Map aspect ratio to CSS classes
  const aspectClass = {
    '16:9': 'aspect-[16/9]',
    '4:5': 'aspect-[4/5]',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  }[aspectRatio];

  const basePath = getAssetUrl(`images/${imageKey}`);

  return (
    <div className={`relative overflow-hidden bg-espresso-100 dark:bg-espresso-800 ${aspectClass} ${className}`}>
      {/* Skeleton / Blur background */}
      {!loaded && (
        <div
          className="absolute inset-0 bg-espresso-200/50 dark:bg-espresso-700/50 animate-pulse"
          aria-hidden="true"
        />
      )}

      <picture>
        {/* AVIF Source */}
        <source
          type="image/avif"
          srcSet={`${basePath}-480.avif 480w, ${basePath}-960.avif 960w, ${basePath}-1600.avif 1600w`}
          sizes={sizes}
        />
        {/* WebP Source */}
        <source
          type="image/webp"
          srcSet={`${basePath}-480.webp 480w, ${basePath}-960.webp 960w, ${basePath}-1600.webp 1600w`}
          sizes={sizes}
        />
        {/* Fallback Image */}
        <img
          src={`${basePath}-960.jpg`}
          srcSet={`${basePath}-480.jpg 480w, ${basePath}-960.jpg 960w, ${basePath}-1600.jpg 1600w`}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      </picture>
    </div>
  );
};
