import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { footerColumns, legalLinks } from '@/data/navigation';
import { fullAddress, siteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { Logo } from './Logo';
import { openCookiePreferences } from './cookieEvents';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-navy-950 text-navy-100" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-royal-700/20 blur-3xl" aria-hidden />

      <div className="container relative grid gap-12 pb-12 pt-16 lg:grid-cols-12 lg:pt-20">
        {/* Brand & contact */}
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-200">
            {siteConfig.name} — committed to excellent teaching, meaningful research and service to society since {siteConfig.established}.
          </p>
          <address className="mt-6 space-y-3 text-sm not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
              <span>{fullAddress}</span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
              <a href={`tel:${siteConfig.contacts.main.phone.replace(/\s/g, '')}`} className="hover:text-white hover:underline">
                {siteConfig.contacts.main.phone}
              </a>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
              <a href={`mailto:${siteConfig.contacts.main.email}`} className="hover:text-white hover:underline">
                {siteConfig.contacts.main.email}
              </a>
            </p>
            <p className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
              <span>{siteConfig.officeHours[0].days}: {siteConfig.officeHours[0].time}</span>
            </p>
          </address>
          <ul className="mt-6 flex gap-2" aria-label="Social media">
            {siteConfig.social.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-navy-100 transition hover:-translate-y-0.5 hover:border-gold-300 hover:bg-gold-400 hover:text-navy-950" aria-label={`${s.label} (opens in a new tab)`}>
                  <SocialIcon name={s.icon} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-navy-200 transition hover:text-gold-200 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 sm:col-span-4">
            <div className="grid items-center gap-5 md:grid-cols-2">
              <div>
                <h3 className="font-display text-lg font-bold text-white">Stay informed</h3>
                <p className="mt-1 text-sm text-navy-200">Admission alerts, events and campus news — once a month. Unsubscribe anytime.</p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-xs text-navy-300 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. {siteConfig.affiliation}.
            {siteConfig.demoMode && <span className="ml-1 text-gold-300">Demo website — content is illustrative until verified.</span>}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" onClick={openCookiePreferences} className="hover:text-white hover:underline">
                Cookie preferences
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
