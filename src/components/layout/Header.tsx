import { motion } from 'framer-motion';
import { GraduationCap, Menu, Search } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/utils/cn';
import { AnnouncementBar } from './AnnouncementBar';
import { DesktopNav } from './DesktopNav';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { SearchDialog } from './SearchDialog';

/**
 * Fixed site header. Transparent over the dark page hero, turning solid white once scrolled;
 * the announcement bar collapses on scroll to save space.
 */
export function Header() {
  const scrolled = useScrolled(24);
  const mobile = useDisclosure();
  const search = useDisclosure();
  const { pathname } = useLocation();
  const onDark = !scrolled;

  const { close: closeMobile } = mobile;
  const { open: openSearch, close: closeSearch } = search;

  // Close overlays on navigation
  useEffect(() => {
    closeMobile();
    closeSearch();
  }, [pathname, closeMobile, closeSearch]);

  // Keyboard shortcuts: "/" or Ctrl/Cmd+K open search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <motion.div initial={false} animate={{ height: scrolled ? 0 : 'auto', opacity: scrolled ? 0 : 1 }} transition={{ duration: 0.25 }} className="overflow-hidden" inert={scrolled}>
          <AnnouncementBar />
        </motion.div>
        <div className={cn('transition-all duration-300', scrolled ? 'border-b border-navy-100/80 bg-white/90 shadow-[0_8px_30px_-12px_rgba(15,29,64,0.18)] backdrop-blur-xl' : 'on-dark bg-gradient-to-b from-navy-950/60 to-transparent')}>
          <div className={cn('container flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300', scrolled ? 'h-[4.25rem]' : 'h-20')}>
            <Logo light={onDark} />
            {/* Menu sits on the right, just before the search and apply icons. */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:gap-4">
              <DesktopNav onDark={onDark} />
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={search.open}
                  className={cn('grid h-11 w-11 place-items-center rounded-full transition', onDark ? 'text-white hover:bg-white/10' : 'text-navy-900 hover:bg-navy-50')}
                  aria-label="Search the website (shortcut: /)"
                  aria-haspopup="dialog"
                >
                  <Search className="h-5 w-5" aria-hidden />
                </button>
                {/* Desktop only: the full "Apply Now" button lives in the top bar and this shortcut
                    stays after the top bar collapses on scroll. Below xl, Apply Now is in the menu drawer
                    so the menu button always has room. */}
                <Link
                  to="/admissions/apply"
                  className="hidden h-11 w-11 place-items-center rounded-full bg-gold-400 xl:grid text-navy-950 shadow-sm transition hover:bg-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                  aria-label="Apply now"
                  title="Apply now"
                >
                  <GraduationCap className="h-5 w-5" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={mobile.open}
                  className={cn('grid h-11 w-11 place-items-center rounded-full transition xl:hidden', onDark ? 'text-white hover:bg-white/10' : 'text-navy-900 hover:bg-navy-50')}
                  aria-label="Open menu"
                  aria-haspopup="dialog"
                  aria-expanded={mobile.isOpen}
                >
                  <Menu className="h-6 w-6" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileNav open={mobile.isOpen} onClose={mobile.close} />
      <SearchDialog open={search.isOpen} onClose={search.close} />
    </>
  );
}
