import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface HorizontalScrollerProps {
  /** Accessible name for the list, e.g. "Featured faculty" */
  label: string;
  /** <li> elements; give each a fixed width plus `shrink-0 snap-start` */
  children: ReactNode;
  className?: string;
  light?: boolean;
}

/**
 * Snap-scrolling horizontal list with previous/next buttons. Works with touch, trackpad, shift+wheel and keyboard
 * (Tab moves through the cards; the browser scrolls focused cards into view). Buttons disable at either end.
 */
export function HorizontalScroller({ label, children, className, light }: HorizontalScrollerProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [measure]);

  const scroll = (direction: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' });
  };

  const control = cn(
    'grid h-11 w-11 place-items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-40',
    light ? 'border-white/25 text-white enabled:hover:bg-white enabled:hover:text-navy-950' : 'border-navy-200 bg-white text-navy-900 shadow-card enabled:hover:border-royal-400 enabled:hover:text-royal-700',
  );

  const hideControls = edges.start && edges.end;

  return (
    <div className={cn('relative', className)}>
      <div className={cn('mb-4 flex justify-end gap-2', hideControls && 'hidden')}>
        <button type="button" className={control} onClick={() => scroll(-1)} disabled={edges.start} aria-controls={listId} aria-label={`Scroll ${label} backward`}>
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" className={control} onClick={() => scroll(1)} disabled={edges.end} aria-controls={listId} aria-label={`Scroll ${label} forward`}>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
      <ul
        id={listId}
        ref={listRef}
        aria-label={label}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-8 pt-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8"
      >
        {children}
      </ul>
    </div>
  );
}
