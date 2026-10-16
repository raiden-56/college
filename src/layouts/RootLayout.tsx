import { Suspense } from 'react';
import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { PageSkeleton } from '@/components/ui/States';
import { useHashScroll } from '@/hooks/useHashScroll';

/** Public website shell. Admin routes (future) should use a separate layout and auth boundary. */
export function RootLayout() {
  const navigation = useNavigation();
  useHashScroll();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none" aria-busy={navigation.state === 'loading' || undefined}>
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
      <CookieConsent />
      <ScrollRestoration getKey={(location) => location.pathname} />
    </>
  );
}
