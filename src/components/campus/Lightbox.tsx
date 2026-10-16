import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryItem } from '@/data/gallery';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { SmartImage } from '@/components/ui/SmartImage';

interface LightboxProps {
  items: GalleryItem[];
  /** Index of the open item, or null when closed */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Accessible image lightbox: modal dialog with focus trap, Escape to close,
 * ←/→ keys and buttons to navigate, a caption and an "n of total" counter announced politely.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const open = index !== null && items.length > 0;
  useFocusTrap(ref, open, onClose);
  useLockBodyScroll(open);

  const count = items.length;
  const current = open ? items[Math.min(index, count - 1)] : null;
  const position = open ? Math.min(index, count - 1) : 0;

  const navRef = useRef({ position, count, onNavigate });
  useEffect(() => {
    navRef.current = { position, count, onNavigate };
  }, [position, count, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      const { position: p, count: c, onNavigate: nav } = navRef.current;
      if (c < 2) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nav((p + 1) % c);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nav((p - 1 + c) % c);
      }
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [open]);

  const control =
    'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy-950 disabled:opacity-40';

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="on-dark fixed inset-0 z-[90] flex flex-col bg-navy-950/95 text-white backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <h2 id={titleId} className="text-sm font-semibold text-white">
              <span className="sr-only">Image viewer: </span>
              <span aria-live="polite">
                {position + 1} of {count}
              </span>
              <span className="ml-3 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-gold-200">{current.category}</span>
            </h2>
            <button type="button" onClick={onClose} className={control} aria-label="Close image viewer" data-autofocus>
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:gap-4 sm:px-6">
            <button type="button" onClick={() => onNavigate((position - 1 + count) % count)} className={`${control} hidden sm:grid`} aria-label="Previous image" disabled={count < 2}>
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <figure className="flex h-full min-h-0 w-full max-w-6xl flex-col items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  className="flex min-h-0 w-full flex-1 items-center justify-center"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <SmartImage
                    image={{ src: current.image.src.replace(/w=\d+/, 'w=2000'), alt: current.image.alt }}
                    className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-lift sm:max-h-[74vh]"
                  />
                </motion.div>
              </AnimatePresence>
              <figcaption className="mt-4 max-w-3xl px-2 text-center text-sm leading-relaxed text-navy-100 sm:text-base">{current.caption}</figcaption>
            </figure>
            <button type="button" onClick={() => onNavigate((position + 1) % count)} className={`${control} hidden sm:grid`} aria-label="Next image" disabled={count < 2}>
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>

          {/* Mobile navigation row */}
          <div className="flex items-center justify-center gap-4 px-4 pb-6 pt-3 sm:hidden">
            <button type="button" onClick={() => onNavigate((position - 1 + count) % count)} className={control} aria-label="Previous image" disabled={count < 2}>
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <span className="text-sm text-navy-200" aria-hidden>
              {position + 1} / {count}
            </span>
            <button type="button" onClick={() => onNavigate((position + 1) % count)} className={control} aria-label="Next image" disabled={count < 2}>
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>
          <p className="hidden pb-4 text-center text-xs text-navy-300 sm:block">Use ← and → to browse, Esc to close.</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
