import { ExternalLink, PlugZap } from 'lucide-react';
import type { ReactNode } from 'react';
import { ExternalButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface IntegrationCardProps {
  title: string;
  description: ReactNode;
  /** Portal URL from siteConfig.portals — empty string means the integration is not configured yet */
  url: string;
  icon: ReactNode;
  actionLabel?: string;
  /** Shown while the integration is pending, e.g. where to get help meanwhile */
  pendingHelp?: ReactNode;
  className?: string;
}

/**
 * Entry point to an external student system (ERP, LMS, results). When the portal URL is not configured
 * it renders a clearly labelled "integration pending" card — never a fake login or lookup form.
 */
export function IntegrationCard({ title, description, url, icon, actionLabel = `Open ${title}`, pendingHelp, className }: IntegrationCardProps) {
  const pending = !url;
  return (
    <div className={cn('card relative flex h-full flex-col overflow-hidden p-6', pending && 'border-dashed', className)}>
      <div className="flex items-start gap-4">
        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', pending ? 'bg-slate-100 text-slate-600' : 'bg-royal-50 text-royal-700')}>{icon}</span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug">{title}</h3>
          {pending ? (
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              <PlugZap className="h-3.5 w-3.5" aria-hidden />
              Integration pending
            </p>
          ) : (
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Official portal</p>
          )}
        </div>
      </div>
      <div className="mt-4 text-sm text-ink-muted">{description}</div>
      {pending ? (
        <div className="mt-auto pt-5 text-sm text-ink-soft">
          <p className="rounded-xl bg-surface-alt p-3">
            This website is not yet connected to the {title.toLowerCase()}. {pendingHelp ?? 'Please use the link shared by your department or contact the college office.'}
          </p>
        </div>
      ) : (
        <div className="mt-auto pt-5">
          <ExternalButtonLink href={url} variant="primary" iconRight={<ExternalLink className="h-4 w-4" aria-hidden />}>
            {actionLabel}
          </ExternalButtonLink>
        </div>
      )}
    </div>
  );
}
