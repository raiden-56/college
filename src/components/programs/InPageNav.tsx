import { useEffect, useRef, type ReactNode } from 'react';
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
  className?: string;
  /** Optional trailing action (e.g. an Apply button) shown on wide screens */
  action?: ReactNode;
}

/**
 * Sticky "on this page" bar that sits under the fixed header. Highlights the section in view and
 * keeps the active link scrolled into view on narrow screens. Sections should carry `scroll-mt-16`.
 */
export function InPageNav({ items, label, className, action }: InPageNavProps) {
  const active = useActiveSection(items.map((i) => i.id));
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${CSS.escape(active)}"]`);
    if (!list || !link) return;
    const target = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label={label} className={cn('sticky top-[4.25rem] z-30 border-b border-navy-100 bg-white/90 shadow-[0_6px_20px_-14px_rgba(15,29,64,0.35)] backdrop-blur-xl', className)}>
      <div className="container flex items-center gap-4">
        <ul ref={listRef} className="scrollbar-none mask-fade-x lg:[mask-image:none] -mx-2 flex flex-1 gap-1 overflow-x-auto px-2 py-2">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'relative inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'bg-navy-900 text-white' : 'text-ink-muted hover:bg-navy-50 hover:text-navy-900',
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        {action && <div className="hidden shrink-0 lg:block">{action}</div>}
      </div>
    </nav>
  );
}
