import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useScrolled } from '@/hooks/useScrolled';
import { ButtonLink } from '@/components/ui/Button';
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
          <div className={cn('container flex items-center justify-between gap-4 transition-all duration-300', scrolled ? 'h-[4.25rem]' : 'h-20')}>
            <Logo light={onDark} />
            <DesktopNav onDark={onDark} />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={search.open}
                className={cn('grid h-11 w-11 place-items-center rounded-full transition', onDark ? 'text-white hover:bg-white/10' : 'text-navy-900 hover:bg-navy-50')}
                aria-label="Search the website (shortcut: /)"
                aria-haspopup="dialog"
              >
                <Search className="h-5 w-5" aria-hidden />
              </button>
              <ButtonLink to="/admissions/apply" variant="gold" size="md" className="hidden sm:inline-flex">
                Apply Now
              </ButtonLink>
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
      </header>
      <MobileNav open={mobile.isOpen} onClose={mobile.close} />
      <SearchDialog open={search.isOpen} onClose={search.close} />
    </>
  );
}
