import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';

interface LogoProps {
  light?: boolean;
  className?: string;
  compact?: boolean;
}

/** Institutional mark + wordmark. Replace the SVG with the official logo file when available. */
export function Logo({ light, className, compact }: LogoProps) {
  return (
    <Link to="/" className={cn('group inline-flex min-w-0 items-center gap-2.5 rounded-lg sm:gap-3', className)} aria-label={`${siteConfig.name} — home`}>
      <svg viewBox="0 0 64 64" className="h-10 w-10 shrink-0 drop-shadow-sm sm:h-11 sm:w-11 transition-transform duration-500 group-hover:rotate-[-6deg]" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? '#ffffff' : '#0f1d40'} />
        <path d="M32 12 10 23l22 11 18-9v13h4V23L32 12Z" fill={light ? '#0f1d40' : '#ffffff'} />
        <path d="M18 31v9c0 4 6.3 8 14 8s14-4 14-8v-9l-14 7-14-7Z" fill="#c9962a" />
      </svg>
      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className={cn('truncate font-display text-base font-extrabold tracking-tight sm:text-xl xl:text-lg', light ? 'text-white' : 'text-navy-950')}>Bapuji College Karwar</span>
          <span className={cn('mt-1 truncate text-[0.625rem] font-semibold uppercase tracking-[0.1em] sm:text-[0.6875rem] sm:tracking-[0.16em] xl:tracking-[0.1em]', light ? 'text-gold-200' : 'text-royal-700')}>
            Arts &amp; Commerce<span className="hidden sm:inline"> · Sadashivgad</span>
          </span>
        </span>
      )}
    </Link>
  );
}
