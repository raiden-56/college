import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
  /** Heading level used for each trigger, to fit the page outline */
  headingLevel?: 'h3' | 'h4';
  variant?: 'card' | 'plain';
}

/** Disclosure accordion following the WAI-ARIA pattern (button inside heading, aria-expanded/controls). */
export function Accordion({ items, multiple = false, defaultOpen = [], className, headingLevel: Heading = 'h3', variant = 'card' }: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);

  const toggle = (id: string) =>
    setOpen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : multiple ? [...prev, id] : [id]));

  return (
    <div className={cn(variant === 'card' ? 'space-y-3' : 'divide-y divide-navy-100 border-y border-navy-100', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div
            key={item.id}
            className={cn(variant === 'card' && 'rounded-2xl border bg-white transition-colors', variant === 'card' && (isOpen ? 'border-royal-200 shadow-card' : 'border-navy-100'))}
          >
            <Heading className="m-0 font-sans text-base">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn('flex w-full items-center justify-between gap-4 text-left font-semibold text-navy-950', variant === 'card' ? 'rounded-2xl px-5 py-4 sm:px-6' : 'py-4')}
              >
                <span>{item.title}</span>
                <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300', isOpen ? 'rotate-180 bg-royal-700 text-white' : 'bg-navy-50 text-navy-700')}>
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className={cn('text-ink-soft', variant === 'card' ? 'px-5 pb-5 sm:px-6' : 'pb-5')}>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
