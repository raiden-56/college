import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { routeLabels } from '@/data/navigation';
import { cn } from '@/utils/cn';

export interface Crumb {
  label: string;
  to?: string;
}

/** Build crumbs from the URL; the final crumb uses `currentLabel` (e.g. a program's name). */
// eslint-disable-next-line react-refresh/only-export-components
export function useAutoCrumbs(currentLabel: string): Crumb[] {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: Crumb[] = [{ label: 'Home', to: '/' }];
  segments.forEach((seg, i) => {
    const to = `/${segments.slice(0, i + 1).join('/')}`;
    const isLast = i === segments.length - 1;
    crumbs.push({ label: isLast ? currentLabel : (routeLabels[seg] ?? seg.replace(/-/g, ' ')), to: isLast ? undefined : to });
  });
  return crumbs;
}

interface BreadcrumbsProps {
  items: Crumb[];
  light?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, light, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex flex-wrap items-center gap-1.5 text-sm', light ? 'text-navy-100' : 'text-ink-muted')}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
              {item.to && !last ? (
                <Link to={item.to} className={cn('inline-flex items-center gap-1 rounded hover:underline', light ? 'hover:text-white' : 'hover:text-royal-700')}>
                  {i === 0 && <Home className="h-3.5 w-3.5" aria-hidden />}
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn('font-semibold', light ? 'text-white' : 'text-navy-900')}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
