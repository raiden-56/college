import { useRef, type KeyboardEvent } from 'react';
import { feeAcademicYears, type FeeYearId } from '@/utils/fees';
import { cn } from '@/utils/cn';
import { feeYearTone } from './feeMeta';

interface FeeYearSelectorProps {
  value: FeeYearId;
  onChange: (id: FeeYearId) => void;
  label?: string;
  className?: string;
  /** Show the visible group label above the options */
  showLabel?: boolean;
}

const statusDot = { green: 'bg-emerald-500', gold: 'bg-gold-500', slate: 'bg-slate-400' } as const;

/** Academic-year radio group with schedule status (Approved / Proposed / Archived). Arrow keys move the selection. */
export function FeeYearSelector({ value, onChange, label = 'Academic year', className, showLabel = true }: FeeYearSelectorProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, feeAcademicYears.findIndex((y) => y.id === value));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + feeAcademicYears.length) % feeAcademicYears.length;
    onChange(feeAcademicYears[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className={className}>
      {showLabel && <p className="field-label text-xs uppercase tracking-wide text-ink-muted">{label}</p>}
      <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
        {feeAcademicYears.map((y, i) => {
          const checked = y.id === value;
          const tone = feeYearTone(y.status);
          return (
            <button
              key={y.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(y.id)}
              className={cn(
                'flex min-w-[8.5rem] flex-col items-start rounded-xl border px-4 py-2.5 text-left transition',
                checked ? 'border-navy-900 bg-navy-900 text-white shadow-card' : 'border-navy-200 bg-white text-navy-900 hover:border-royal-400',
              )}
            >
              <span className="text-sm font-bold">{y.label}</span>
              <span className={cn('mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium', checked ? 'text-navy-100' : 'text-ink-muted')}>
                <span className={cn('h-1.5 w-1.5 rounded-full', statusDot[tone as keyof typeof statusDot])} aria-hidden />
                {y.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
