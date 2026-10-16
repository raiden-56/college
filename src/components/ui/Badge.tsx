import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'navy' | 'royal' | 'sky' | 'gold' | 'green' | 'red' | 'slate' | 'white';

const tones: Record<BadgeTone, string> = {
  navy: 'border-navy-200 bg-navy-50 text-navy-800',
  royal: 'border-royal-200 bg-royal-50 text-royal-800',
  sky: 'border-sky-200 bg-sky-50 text-sky-800',
  gold: 'border-gold-200 bg-gold-50 text-gold-800',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  red: 'border-red-200 bg-red-50 text-red-800',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  white: 'border-white/30 bg-white/15 text-white backdrop-blur',
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}

export function Badge({ children, tone = 'royal', icon, className }: BadgeProps) {
  return (
    <span className={cn('chip', tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
