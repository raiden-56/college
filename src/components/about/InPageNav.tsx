import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, type MouseEvent } from 'react';
import { cn } from '@/utils/cn';
import { useActiveSection } from './useActiveSection';

export interface InPageNavItem {
  id: string;
  label: string;
}

interface InPageNavProps {
  items: InPageNavItem[];
  /** Accessible name of the navigation landmark */
  label: string;
  /**
   * bar     — full-width sticky strip under the header (horizontally scrollable on small screens).
   * sidebar — horizontal sticky strip on mobile, vertical sticky list beside the content from `lg`.
   *           Place it as a direct child of a `lg:grid` wrapper that also contains the content.
   */
  variant?: 'bar' | 'sidebar';
  className?: string;
}

/**
 * Sticky in-page navigation with scroll-spy. Links are real anchors (work without JS and are shareable);
 * clicks scroll smoothly, update the URL hash and move focus to the target section for keyboard users.
 */
export function InPageNav({ items, label, variant = 'bar', className }: InPageNavProps) {
  const active = useActiveSection(items.map((i) => i.id));
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorId = useId();
  const reduce = useReducedMotion();
  const sidebar = variant === 'sidebar';

  // Keep the active link visible inside the horizontally scrolling strip (without scrolling the page).
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const link = list.querySelector<HTMLElement>(`[data-target="${active}"]`);
    if (!link) return;
    const left = link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
  }, [active, reduce]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, '', `#${id}`);
  };

  return (
    <nav
      aria-label={label}
      className={cn(
        'sticky top-[4.25rem] z-30 border-b border-navy-100 bg-white/90 shadow-[0_10px_24px_-18px_rgba(15,29,64,0.35)] backdrop-blur-xl',
        sidebar && '-mx-4 sm:-mx-6 lg:top-28 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:shadow-none lg:backdrop-blur-none',
        className,
      )}
    >
      <div className={cn(!sidebar && 'container')}>
        {sidebar && <p className="mb-3 hidden text-xs font-bold uppercase tracking-[0.18em] text-ink-muted lg:block">On this page</p>}
        <ul
          ref={listRef}
          className={cn(
            'scrollbar-none flex gap-1 overflow-x-auto py-2',
            sidebar && 'px-4 sm:px-6 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:border-l lg:border-navy-100 lg:p-0',
          )}
        >
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  data-target={item.id}
                  onClick={(e) => onClick(e, item.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'relative block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    sidebar && 'lg:-ml-px lg:rounded-none lg:rounded-r-lg lg:py-2 lg:pl-5',
                    isActive
                      ? cn('text-white', sidebar && 'lg:text-royal-800')
                      : cn('text-ink-muted hover:bg-navy-50 hover:text-navy-900', sidebar && 'lg:hover:bg-transparent lg:hover:text-royal-700'),
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={indicatorId}
                      className={cn(
                        'absolute inset-0 rounded-full bg-navy-900',
                        sidebar && 'lg:rounded-none lg:rounded-r-lg lg:border-l-2 lg:border-royal-600 lg:bg-royal-50',
                      )}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                      aria-hidden
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
