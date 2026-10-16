import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { ImageAsset } from '@/types';
import { SmartImage } from '@/components/ui/SmartImage';

interface ParallaxImageProps {
  image: ImageAsset;
  /** How far (in %) the image travels across the scroll range. 10–20 feels natural. */
  strength?: number;
  className?: string;
  imgClassName?: string;
  /** Overlay rendered above the image (gradients, text) */
  children?: ReactNode;
  priority?: boolean;
}

/**
 * Image that drifts slower than the page while its frame scrolls through the viewport.
 * The image is over-scaled so the motion never reveals empty edges. Static when reduced motion is on.
 */
export function ParallaxImage({ image, strength = 15, className, imgClassName, children, priority }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale: 1 + strength / 50 }}>
        <SmartImage image={image} className={cn('h-full w-full object-cover', imgClassName)} priority={priority} />
      </motion.div>
      {children}
    </div>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  /** Pixels of travel over the element's scroll range. Negative values move up faster. */
  offset?: number;
  className?: string;
}

/** Moves its children at a different speed to the page for layered depth. */
export function ParallaxLayer({ children, offset = 60, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}
