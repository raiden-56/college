import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
  /** Visual header content (logo etc.). Title is still used as the accessible name. */
  header?: ReactNode;
  footer?: ReactNode;
}

/** Off-canvas panel (mobile navigation, filters). Modal semantics with focus trap and Escape to close. */
export function Drawer({ open, onClose, title, children, side = 'right', className, header, footer }: DrawerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusTrap(ref, open, onClose);
  useLockBodyScroll(open);
  const from = side === 'right' ? '100%' : '-100%';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: from }}
            animate={{ x: 0 }}
            exit={{ x: from }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className={cn('absolute inset-y-0 flex w-full max-w-sm flex-col bg-white shadow-lift', side === 'right' ? 'right-0' : 'left-0', className)}
          >
            <div className="flex items-center justify-between gap-4 border-b border-navy-100 px-5 py-4">
              {header ?? (
                <h2 id={titleId} className="text-lg font-bold">
                  {title}
                </h2>
              )}
              {header && (
                <h2 id={titleId} className="sr-only">
                  {title}
                </h2>
              )}
              <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-800 hover:bg-navy-100" aria-label="Close">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
            {footer && <div className="border-t border-navy-100 p-5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
