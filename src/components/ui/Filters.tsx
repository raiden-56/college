import { Search, X } from 'lucide-react';
import { useId, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  /** Show the label visually (otherwise it is screen-reader only) */
  showLabel?: boolean;
  size?: 'md' | 'lg';
}

/** Search field with a clear button. Label is always present for assistive tech. */
export function SearchInput({ value, onChange, label, placeholder, className, showLabel, size = 'md' }: SearchInputProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className={showLabel ? 'field-label' : 'sr-only'}>
        {label}
      </label>
      <div className="relative">
        <Search className={cn('pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-400', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn('field-input pl-11 pr-11 [&::-webkit-search-cancel-button]:hidden', size === 'lg' && 'py-3.5 text-base')}
          autoComplete="off"
        />
        {value && (
          <button type="button" onClick={() => onChange('')} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-navy-500 hover:bg-navy-50" aria-label="Clear search">
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  /** Label for the "show everything" option; omit to require a choice */
  allLabel?: string;
  className?: string;
}

/** Native <select> styled for filter bars (native = best mobile & screen-reader support). */
export function FilterSelect({ label, value, onChange, options, allLabel, className }: FilterSelectProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label text-xs uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field-input cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2327458c%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10">
        {allLabel && <option value="all">{allLabel}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FilterChipsProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: ReactNode; count?: number }[];
  className?: string;
}

/**
 * Single-select chip group (radio semantics). Good for 2–8 options such as categories.
 * Roving tabindex: Tab enters the group on the selected chip; arrow keys / Home / End move and select.
 */
export function FilterChips({ label, value, onChange, options, className }: FilterChipsProps) {
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in step) next = (selectedIndex + step[e.key] + options.length) % options.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = options.length - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(options[next].value);
    (e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next] ?? null)?.focus();
  };

  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className={cn('scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1', className)}>
      {options.map((o, i) => {
        const checked = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={i === selectedIndex ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
              checked ? 'border-navy-900 bg-navy-900 text-white shadow-card' : 'border-navy-200 bg-white text-navy-800 hover:border-royal-400 hover:text-royal-700',
            )}
          >
            {o.label}
            {o.count !== undefined && <span className={cn('rounded-full px-1.5 text-xs', checked ? 'bg-white/20' : 'bg-navy-50 text-ink-muted')}>{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

interface ResultsSummaryProps {
  start: number;
  end: number;
  total: number;
  noun: string;
  onReset?: () => void;
  activeFilters?: number;
  id?: string;
}

/** "Showing 1–9 of 24 programs" + reset link. Announced politely to screen readers when filters change. */
export function ResultsSummary({ start, end, total, noun, onReset, activeFilters = 0, id }: ResultsSummaryProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
      <p id={id} aria-live="polite" className="scroll-mt-36">
        {total === 0 ? `No ${noun} found` : `Showing ${start}–${end} of ${total} ${noun}`}
      </p>
      {onReset && activeFilters > 0 && (
        <button type="button" onClick={onReset} className="link inline-flex items-center gap-1 text-sm">
          <X className="h-3.5 w-3.5" aria-hidden /> Clear {activeFilters} filter{activeFilters > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}
