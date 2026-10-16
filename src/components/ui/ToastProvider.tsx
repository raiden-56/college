import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ToastContext, type ToastOptions } from './toast-context';

interface ToastItem extends Required<Omit<ToastOptions, 'description'>> {
  id: number;
  description?: string;
}

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const tones = {
  success: 'border-emerald-200 text-emerald-700',
  error: 'border-red-200 text-red-700',
  info: 'border-royal-200 text-royal-700',
};

/** Global toast notifications. Messages are announced via an aria-live region. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => setItems((prev) => prev.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    ({ title, description, tone = 'info', duration = 6000 }: ToastOptions) => {
      const id = ++counter.current;
      setItems((prev) => [...prev.slice(-3), { id, title, description, tone, duration }]);
      if (duration > 0) window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-relevant="additions" className="pointer-events-none fixed inset-x-0 top-20 z-[90] flex flex-col items-center gap-3 px-4 sm:left-auto sm:right-6 sm:top-24 sm:items-end">
        <AnimatePresence initial={false}>
          {items.map((t) => {
            const Icon = icons[t.tone];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                role={t.tone === 'error' ? 'alert' : 'status'}
                className={cn('pointer-events-auto flex w-full max-w-sm gap-3 rounded-2xl border bg-white p-4 shadow-lift', tones[t.tone])}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-950">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-sm text-ink-muted">{t.description}</p>}
                </div>
                <button type="button" onClick={() => dismiss(t.id)} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-muted hover:bg-navy-50" aria-label="Dismiss notification">
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
