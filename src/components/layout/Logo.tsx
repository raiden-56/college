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
    <Link to="/" className={cn('group inline-flex items-center gap-3 rounded-lg', className)} aria-label={`${siteConfig.name} — home`}>
      <svg viewBox="0 0 64 64" className="h-11 w-11 shrink-0 drop-shadow-sm transition-transform duration-500 group-hover:rotate-[-6deg]" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? '#ffffff' : '#0f1d40'} />
        <path d="M32 12 10 23l22 11 18-9v13h4V23L32 12Z" fill={light ? '#0f1d40' : '#ffffff'} />
        <path d="M18 31v9c0 4 6.3 8 14 8s14-4 14-8v-9l-14 7-14-7Z" fill="#c9962a" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn('font-display text-lg font-extrabold tracking-tight sm:text-xl', light ? 'text-white' : 'text-navy-950')}>Crestwood College</span>
          <span className={cn('mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.6875rem]', light ? 'text-gold-200' : 'text-royal-700')}>
            Arts · Science · Technology
          </span>
        </span>
      )}
    </Link>
  );
}
