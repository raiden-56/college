import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Testimonial } from '@/types';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { cn } from '@/utils/cn';

interface TestimonialCarouselProps {
  items: Testimonial[];
  light?: boolean;
  /** Auto-advance interval in ms (0 disables). Auto-play stops on hover/focus and under reduced motion. */
  interval?: number;
  label?: string;
}

/**
 * Accessible carousel (WAI-ARIA carousel pattern): previous/next buttons, slide picker,
 * pause control, aria-roledescription, live region only while paused.
 */
export function TestimonialCarousel({ items, light, interval = 7000, label = 'Testimonials' }: TestimonialCarouselProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(!reduce && interval > 0);
  const [hovering, setHovering] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (!playing || hovering || count < 2) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [playing, hovering, count, interval]);

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + count) % count);
  };

  if (count === 0) return null;
  const current = items[index];

  const control = cn('grid h-11 w-11 place-items-center rounded-full border transition', light ? 'border-white/25 text-white hover:bg-white hover:text-navy-950' : 'border-navy-200 bg-white text-navy-900 hover:border-royal-400 hover:text-royal-700');

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div className="relative min-h-[22rem] sm:min-h-[19rem]" aria-live={playing ? 'off' : 'polite'}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <TestimonialCard testimonial={current} light={light} size="lg" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="group" aria-label="Choose testimonial">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show testimonial ${i + 1}: ${t.name}`}
              aria-current={i === index ? 'true' : undefined}
              className={cn('h-2.5 rounded-full transition-all', i === index ? 'w-8 bg-gold-400' : light ? 'w-2.5 bg-white/30 hover:bg-white/60' : 'w-2.5 bg-navy-200 hover:bg-navy-400')}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {interval > 0 && (
            <button type="button" onClick={() => setPlaying((p) => !p)} className={control} aria-label={playing ? 'Pause automatic rotation' : 'Start automatic rotation'}>
              {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            </button>
          )}
          <button type="button" onClick={() => go(index - 1)} className={control} aria-label="Previous testimonial">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={() => go(index + 1)} className={control} aria-label="Next testimonial">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
