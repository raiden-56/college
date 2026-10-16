import { AlertTriangle, SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Friendly message when a list or search has no results. */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center rounded-3xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center', className)}>
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-royal-50 text-royal-700">{icon ?? <SearchX className="h-7 w-7" aria-hidden />}</div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      {description && <div className="mt-2 max-w-md text-sm text-ink-muted">{description}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Recoverable error message (failed fetch, missing integration). */
export function ErrorState({ title = 'Something went wrong', description, action, className }: ErrorStateProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-center rounded-3xl border border-red-200 bg-red-50/60 px-6 py-12 text-center', className)}>
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-100 text-red-700">
        <AlertTriangle className="h-7 w-7" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg font-bold text-red-900">{title}</h3>
      {description && <div className="mt-2 max-w-md text-sm text-red-900/80">{description}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Shimmering placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-navy-100/70', className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

/** Card-shaped skeleton matching CourseCard / NewsCard proportions. */
export function CardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden>
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-6">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Full-page loading skeleton shown while a lazy route chunk loads. */
export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      <div className="bg-navy-950 pb-16 pt-28">
        <div className="container space-y-4">
          <Skeleton className="h-4 w-40 bg-white/10" />
          <Skeleton className="h-10 w-2/3 bg-white/10" />
          <Skeleton className="h-5 w-1/2 bg-white/10" />
        </div>
      </div>
      <div className="container grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
