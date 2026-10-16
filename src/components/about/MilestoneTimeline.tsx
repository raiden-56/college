import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/utils/cn';

export interface Milestone {
  year: number;
  title: string;
  text: string;
}

interface MilestoneTimelineProps {
  items: Milestone[];
  className?: string;
}

/**
 * Vertical timeline whose line draws itself as the reader scrolls through it.
 * Single column on mobile (line on the left); alternating left/right cards from `md`.
 */
export function MilestoneTimeline({ items, className }: MilestoneTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Track + scroll-linked fill (positioned without Tailwind transforms so framer's scaleY can own `transform`) */}
      <span className="absolute bottom-2 left-[calc(1rem-1px)] top-2 w-0.5 rounded-full bg-navy-100 md:left-[calc(50%-1px)]" aria-hidden />
      <motion.span
        className="absolute bottom-2 left-[calc(1rem-1px)] top-2 w-0.5 origin-top rounded-full bg-gradient-to-b from-royal-600 via-royal-500 to-gold-400 md:left-[calc(50%-1px)]"
        style={reduce ? undefined : { scaleY: fill }}
        aria-hidden
      />

      <ol className="relative space-y-8 md:space-y-2">
        {items.map((m, i) => {
          const right = i % 2 === 1;
          return (
            <li key={`${m.year}-${m.title}`} className="relative pl-12 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              {/* Node */}
              <span className="absolute left-4 top-7 -translate-x-1/2 md:left-1/2" aria-hidden>
                <motion.span
                  className="grid h-4 w-4 place-items-center rounded-full border-2 border-royal-600 bg-white shadow-[0_0_0_6px_rgba(37,82,235,0.12)]"
                  initial={{ scale: 0.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '0px 0px -30% 0px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                </motion.span>
              </span>

              <motion.div
                className={cn('md:py-3', right ? 'md:col-start-2' : 'md:col-start-1 md:text-right')}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -80px 0px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <article className="card card-hover group relative overflow-hidden p-5 sm:p-6">
                  <span
                    className={cn(
                      'pointer-events-none absolute -top-2 select-none font-display text-6xl font-extrabold text-navy-50 transition-colors group-hover:text-royal-50 sm:text-7xl',
                      right ? 'right-4' : 'right-4 md:left-4 md:right-auto',
                    )}
                    aria-hidden
                  >
                    {m.year}
                  </span>
                  <p className="relative">
                    <span className="chip border-royal-200 bg-royal-50 font-bold text-royal-800">
                      <time dateTime={String(m.year)}>{m.year}</time>
                    </span>
                  </p>
                  <h3 className="relative mt-3 text-lg font-bold leading-snug">{m.title}</h3>
                  <p className="relative mt-1.5 text-sm leading-relaxed text-ink-muted">{m.text}</p>
                </article>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
