import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { NavItem } from '@/types';
import { mainNav } from '@/data/navigation';
import { cn } from '@/utils/cn';

interface DesktopNavProps {
  /** Header is over a dark hero (transparent) */
  onDark: boolean;
}

const isActive = (item: NavItem, pathname: string) => {
  const paths = [item.to, ...(item.children?.map((c) => c.to.split('#')[0]) ?? [])];
  return paths.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(`${p}/`)));
};

/**
 * Disclosure-pattern navigation (recommended for site menus over ARIA menubar):
 * each group is a button with aria-expanded that reveals a panel of links.
 * Opens on hover for pointer users and on click/Enter/Space/ArrowDown for keyboard users; Escape closes.
 */
export function DesktopNav({ onDark }: DesktopNavProps) {
  const [open, setOpen] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  // Close when route changes or on outside click
  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const onKeyDown = (e: KeyboardEvent, label: string) => {
    if (e.key === 'Escape') {
      setOpen(null);
      (navRef.current?.querySelector(`[data-trigger="${label}"]`) as HTMLElement | null)?.focus();
    }
    if (e.key === 'ArrowDown' && open !== label) {
      e.preventDefault();
      setOpen(label);
      window.setTimeout(() => (navRef.current?.querySelector(`[data-panel="${label}"] a`) as HTMLElement | null)?.focus(), 30);
    }
  };

  const linkBase = cn(
    'relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-[0.9375rem] font-semibold transition-colors',
    onDark ? 'text-white/90 hover:bg-white/10 hover:text-white' : 'text-navy-900 hover:bg-navy-50 hover:text-royal-700',
  );

  return (
    <nav ref={navRef} aria-label="Main" className="hidden xl:block">
      <ul className="flex items-center gap-0.5">
        {mainNav.map((item) => {
          const active = isActive(item, pathname);
          const indicator = active && <span className={cn('absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full', onDark ? 'bg-gold-300' : 'bg-royal-600')} aria-hidden />;

          if (!item.children) {
            return (
              <li key={item.label}>
                <NavLink to={item.to} className={linkBase} aria-current={active ? 'page' : undefined}>
                  {item.label}
                  {indicator}
                </NavLink>
              </li>
            );
          }

          const isOpen = open === item.label;
          return (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => {
                window.clearTimeout(closeTimer.current);
                setOpen(item.label);
              }}
              onMouseLeave={() => {
                closeTimer.current = window.setTimeout(() => setOpen((o) => (o === item.label ? null : o)), 120);
              }}
              onKeyDown={(e) => onKeyDown(e, item.label)}
            >
              <button
                type="button"
                data-trigger={item.label}
                className={linkBase}
                aria-expanded={isOpen}
                aria-controls={`nav-panel-${item.label.replace(/\W+/g, '-')}`}
                onClick={() => setOpen(isOpen ? null : item.label)}
              >
                {item.label}
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden />
                {indicator}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={`nav-panel-${item.label.replace(/\W+/g, '-')}`}
                    data-panel={item.label}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3"
                  >
                    <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white p-2 shadow-lift">
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.to + child.label}>
                            <Link to={child.to} className="group flex items-start gap-3 rounded-xl px-4 py-3 transition hover:bg-royal-50 focus-visible:bg-royal-50">
                              <span className="flex-1">
                                <span className="block text-sm font-semibold text-navy-950 group-hover:text-royal-700">{child.label}</span>
                                {child.description && <span className="mt-0.5 block text-xs text-ink-muted">{child.description}</span>}
                              </span>
                              <ArrowRight className="mt-0.5 h-4 w-4 -translate-x-1 text-royal-600 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
