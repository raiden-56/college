import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { siteConfig } from '@/config/site';

/** Router-level error boundary. Rendered without the main layout, so it stays minimal and dependency-free. */
export default function ErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  // A failed lazy chunk usually means a new deployment — a reload fixes it.
  const chunkError = error instanceof Error && /dynamically imported module|Loading chunk/i.test(error.message);

  return (
    <main className="on-dark grid min-h-screen place-items-center bg-navy-radial px-4 py-16 text-center text-white">
      <title>{`${is404 ? 'Page not found' : 'Something went wrong'} | ${siteConfig.shortName}`}</title>
      <div className="max-w-lg">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-gold-300">
          <AlertTriangle className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">{is404 ? 'Page not found' : 'Something went wrong'}</h1>
        <p className="mt-4 text-navy-100">
          {chunkError
            ? 'The website has been updated since you opened it. Please reload to get the latest version.'
            : 'We’re sorry — this page couldn’t be displayed. Please try again, or return to the homepage.'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="btn btn-lg btn-gold">
            <RefreshCw className="h-4 w-4" aria-hidden /> Reload page
          </button>
          <Link to="/" className="btn btn-lg btn-outline-light">
            <Home className="h-4 w-4" aria-hidden /> Go to homepage
          </Link>
        </div>
        <p className="mt-8 text-sm text-navy-200">
          Need help? Call {siteConfig.contacts.main.phone} or email{' '}
          <a href={`mailto:${siteConfig.contacts.main.email}`} className="font-semibold text-white underline">
            {siteConfig.contacts.main.email}
          </a>
        </p>
      </div>
    </main>
  );
}
