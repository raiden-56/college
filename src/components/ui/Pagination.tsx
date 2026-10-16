import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { pageRange } from '@/utils/pagination';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Element id to scroll back to after changing page (usually the results heading) */
  scrollTargetId?: string;
}

export function Pagination({ page, pageCount, onPageChange, className, scrollTargetId }: PaginationProps) {
  if (pageCount <= 1) return null;

  const go = (p: number) => {
    onPageChange(p);
    if (scrollTargetId) document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const btn = 'grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition';

  return (
    <nav aria-label="Pagination" className={cn('mt-10 flex items-center justify-center gap-1.5', className)}>
      <button type="button" onClick={() => go(page - 1)} disabled={page === 1} className={cn(btn, 'border border-navy-100 bg-white text-navy-800 hover:border-royal-300 disabled:opacity-40')} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      {pageRange(page, pageCount).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-ink-muted" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
            className={cn(btn, p === page ? 'bg-navy-900 text-white shadow-card' : 'text-navy-800 hover:bg-navy-50')}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" onClick={() => go(page + 1)} disabled={page === pageCount} className={cn(btn, 'border border-navy-100 bg-white text-navy-800 hover:border-royal-300 disabled:opacity-40')} aria-label="Next page">
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
