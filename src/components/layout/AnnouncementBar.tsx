import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Megaphone, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcements } from '@/data/announcements';
import { quickLinks } from '@/data/navigation';
import { siteConfig } from '@/config/site';

/** Rotating notices with pause control (WCAG 2.2.2), plus quick contact links on wide screens. */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = announcements.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const current = announcements[index];

  return (
    <div className="on-dark border-b border-white/10 bg-navy-950 text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="container flex h-10 items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2" role="region" aria-label="Announcements" aria-roledescription="carousel">
          <Megaphone className="h-4 w-4 shrink-0 text-gold-300" aria-hidden />
          <div className="relative min-w-0 flex-1 overflow-hidden" aria-live={paused ? 'polite' : 'off'}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={index} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3 }} className="flex min-w-0 items-center gap-2">
                <span className="truncate text-navy-100">{current.text}</span>
                <Link to={current.to} className="inline-flex shrink-0 items-center gap-1 font-semibold text-gold-300 hover:text-gold-200 hover:underline">
                  {current.cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          {count > 1 && (
            <div className="hidden shrink-0 items-center sm:flex">
              <button type="button" onClick={() => setIndex((i) => (i - 1 + count) % count)} className="grid h-7 w-7 place-items-center rounded-full text-navy-200 hover:bg-white/10 hover:text-white" aria-label="Previous announcement">
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button type="button" onClick={() => setPaused((p) => !p)} className="grid h-7 w-7 place-items-center rounded-full text-navy-200 hover:bg-white/10 hover:text-white" aria-label={paused ? 'Resume announcements' : 'Pause announcements'}>
                {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
              </button>
              <button type="button" onClick={() => setIndex((i) => (i + 1) % count)} className="grid h-7 w-7 place-items-center rounded-full text-navy-200 hover:bg-white/10 hover:text-white" aria-label="Next announcement">
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
        <nav aria-label="Quick links" className="hidden items-center gap-4 text-navy-200 lg:flex">
          {quickLinks.slice(0, 3).map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-white">
              {l.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-white/20" aria-hidden />
          <a href={`tel:${siteConfig.contacts.admissions.phone.replace(/\s/g, '')}`} className="hover:text-white">
            {siteConfig.contacts.admissions.phone}
          </a>
        </nav>
      </div>
    </div>
  );
}
