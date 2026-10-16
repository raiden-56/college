import type { Stat } from '@/types';
import { cn } from '@/utils/cn';
import { CountUp } from '@/components/motion/CountUp';
import { DemoBadge } from './DemoBadge';

interface StatBlockProps {
  stat: Stat;
  light?: boolean;
  className?: string;
  decimals?: number;
}

/** Big animated number with label; shows a demo badge for unverified values. */
export function StatBlock({ stat, light, className, decimals }: StatBlockProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className={cn('font-display text-4xl font-extrabold tracking-tight sm:text-5xl', light ? 'text-white' : 'text-navy-950')}>
        <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={decimals} />
      </span>
      <span className={cn('mt-2 text-sm font-medium', light ? 'text-navy-100' : 'text-ink-muted')}>{stat.label}</span>
      {stat.isDemo && <DemoBadge light={light} className="mt-2 self-start" />}
    </div>
  );
}
