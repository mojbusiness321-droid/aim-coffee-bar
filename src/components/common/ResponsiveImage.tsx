import React, { useState, useRef, useEffect } from 'react';
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached / completed on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, []);

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
      {/* Skeleton placeholder (fades out gracefully when loaded) */}
      <div
        className={`absolute inset-0 bg-espresso-200/60 dark:bg-espresso-700/60 transition-opacity duration-300 pointer-events-none ${
          loaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
        aria-hidden="true"
      />

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
        {/* Standard Fallback Image */}
        <img
          ref={imgRef}
          src={`${basePath}-960.jpg`}
          srcSet={`${basePath}-480.jpg 480w, ${basePath}-960.jpg 960w, ${basePath}-1600.jpg 1600w`}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            setLoaded(true);
            // Fallback to relative or direct jpg if format negotiation fails
            const target = e.currentTarget;
            if (!target.src.endsWith('-960.jpg')) {
              target.src = getAssetUrl(`images/${imageKey}-960.jpg`);
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </picture>
    </div>
  );
};
