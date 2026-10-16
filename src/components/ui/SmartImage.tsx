import { GraduationCap } from 'lucide-react';
import { useState, type ImgHTMLAttributes } from 'react';
import type { ImageAsset } from '@/types';
import { cn } from '@/utils/cn';

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  image: ImageAsset;
  /** Above-the-fold images: eager load with high fetch priority */
  priority?: boolean;
  /** Mark purely decorative images so screen readers skip them */
  decorative?: boolean;
}

/**
 * Lazy-loaded image with a soft fade-in and a branded fallback if the source fails.
 * Always pass meaningful alt text through `image.alt` unless `decorative`.
 */
export function SmartImage({ image, priority, decorative, className, ...rest }: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (status === 'error') {
    return (
      <div
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : image.alt}
        aria-hidden={decorative || undefined}
        className={cn('flex items-center justify-center bg-gradient-to-br from-navy-800 via-royal-800 to-navy-950 text-white/40', className)}
      >
        <GraduationCap className="h-10 w-10" aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={image.src}
      alt={decorative ? '' : image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={cn('bg-navy-100 transition-opacity duration-700', status === 'loaded' ? 'opacity-100' : 'opacity-0', className)}
      {...rest}
    />
  );
}
