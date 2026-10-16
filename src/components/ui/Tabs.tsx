import { motion } from 'framer-motion';
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name for the tab list */
  label: string;
  variant?: 'pill' | 'underline';
  className?: string;
  listClassName?: string;
  panelClassName?: string;
}

/**
 * WAI-ARIA tabs with automatic activation: Arrow keys, Home and End move between tabs.
 * Controlled — keep `value` in state (or the URL) so tabs are linkable.
 */
export function Tabs({ tabs, value, onChange, label, variant = 'pill', className, listClassName, panelClassName }: TabsProps) {
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === value));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (activeIndex + keys[e.key] + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  const active = tabs[activeIndex];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn(
          'scrollbar-none flex gap-1 overflow-x-auto',
          variant === 'pill' ? 'rounded-full border border-navy-100 bg-white p-1 shadow-card' : 'border-b border-navy-100',
          listClassName,
        )}
      >
        {tabs.map((tab, i) => {
          const selected = i === activeIndex;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition-colors',
                variant === 'pill' ? 'rounded-full' : '-mb-px',
                selected ? (variant === 'pill' ? 'text-white' : 'text-royal-700') : 'text-ink-muted hover:text-navy-900',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className={cn('absolute', variant === 'pill' ? 'inset-0 rounded-full bg-navy-900' : 'inset-x-2 bottom-0 h-0.5 rounded-full bg-royal-600')}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
                  aria-hidden
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          );
        })}
      </div>
      {active && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${active.id}`}
          aria-labelledby={`${baseId}-tab-${active.id}`}
          tabIndex={0}
          className={cn('mt-8 focus-visible:ring-offset-4', panelClassName)}
        >
          <motion.div key={active.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {active.content}
          </motion.div>
        </div>
      )}
    </div>
  );
}
