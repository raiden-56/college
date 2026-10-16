import { FlaskConical, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

interface DemoBadgeProps {
  /** Short label, default "Demo data" */
  label?: string;
  className?: string;
  light?: boolean;
}

/**
 * Small inline label marking illustrative/unverified content. Renders nothing when VITE_DEMO_MODE=false,
 * so it is safe to leave in place once verified data is loaded.
 */
export function DemoBadge({ label = 'Demo data', className, light }: DemoBadgeProps) {
  if (!siteConfig.demoMode) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 align-middle text-[0.6875rem] font-semibold uppercase tracking-wide',
        light ? 'border-gold-300/50 bg-gold-300/10 text-gold-200' : 'border-gold-300 bg-gold-50 text-gold-800',
        className,
      )}
      title="Illustrative content — replace with verified institutional data"
    >
      <FlaskConical className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

interface DemoNoticeProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

/** Callout explaining that a block contains illustrative values (only rendered in demo mode). */
export function DemoNotice({ children, className, title = 'Illustrative content' }: DemoNoticeProps) {
  if (!siteConfig.demoMode) return null;
  return (
    <div role="note" className={cn('flex gap-3 rounded-xl border border-gold-200 bg-gold-50/70 p-4 text-sm text-gold-900', className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-0.5 text-gold-900/90">{children}</div>
      </div>
    </div>
  );
}
