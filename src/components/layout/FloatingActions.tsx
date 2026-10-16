import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { siteConfig } from '@/config/site';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/utils/cn';

/** Back-to-top control (appears after scrolling) and a contact shortcut (WhatsApp if configured + call). */
export function FloatingActions() {
  const showTop = useScrolled(700);
  const [open, setOpen] = useState(false);
  const wa = siteConfig.whatsappNumber;
  const phone = siteConfig.contacts.admissions.phone.replace(/\s/g, '');
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[65] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="pointer-events-auto flex flex-col items-end gap-2" id="contact-shortcuts">
            {wa && (
              <li>
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent('Hello, I have a question about admissions.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#1f8f4e] px-4 py-2.5 text-sm font-semibold text-white shadow-lift hover:bg-[#187a41]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden /> Chat on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            )}
            <li>
              <a href={`tel:${phone}`} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 shadow-lift hover:text-royal-700">
                <Phone className="h-4 w-4" aria-hidden /> Call admissions
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto flex items-center gap-3">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
              className="grid h-12 w-12 place-items-center rounded-full border border-navy-100 bg-white text-navy-900 shadow-lift transition hover:-translate-y-0.5 hover:text-royal-700"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="contact-shortcuts"
          className={cn('grid h-14 w-14 place-items-center rounded-full shadow-lift transition hover:-translate-y-0.5', open ? 'bg-navy-900 text-white' : 'bg-royal-700 text-white')}
          aria-label={open ? 'Close contact options' : 'Contact us'}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
