import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Reveal } from '@/components/motion/Reveal';

type Tone = 'white' | 'alt' | 'navy' | 'sunken';

const toneClasses: Record<Tone, string> = {
  white: 'bg-white',
  alt: 'bg-surface-alt',
  sunken: 'bg-surface-sunken',
  navy: 'on-dark bg-navy-radial text-white',
};

interface SectionProps {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  /** Accessible name when the section has no visible heading id */
  ariaLabel?: string;
  labelledBy?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'py-12 sm:py-14', md: 'py-16 sm:py-20', lg: 'py-20 sm:py-28' };

/** Page section with consistent vertical rhythm and background tones. */
export function Section({ id, tone = 'white', className, containerClassName, children, ariaLabel, labelledBy, size = 'md' }: SectionProps) {
  return (
    <section id={id} aria-label={ariaLabel} aria-labelledby={labelledBy} className={cn('relative', sizes[size], toneClasses[tone], className)}>
      <div className={cn('container', containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
  /** id applied to the <h2>, pair with Section labelledBy */
  id?: string;
  action?: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

/** Eyebrow + title + description block used to open every section. */
export function SectionHeading({ eyebrow, title, description, align = 'left', light, id, action, className, as: Heading = 'h2' }: SectionHeadingProps) {
  const centered = align === 'center';
  // Let callers override the default bottom margin via className (clsx doesn't dedupe conflicting utilities)
  const customMargin = !!className && /(^|\s)!?mb-/.test(className);
  return (
    <Reveal className={cn('flex flex-col gap-6', !customMargin && 'mb-10 sm:mb-12', !centered && action && 'md:flex-row md:items-end md:justify-between', className)}>
      <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
        {eyebrow && (
          <p className={cn('eyebrow', light && 'eyebrow-light', centered && 'justify-center')}>
            <span className={cn('h-px w-6', light ? 'bg-gold-300' : 'bg-royal-600')} aria-hidden />
            {eyebrow}
          </p>
        )}
        <Heading id={id} className={cn('mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl', light ? 'text-white' : 'text-navy-950')}>
          {title}
        </Heading>
        {description && <p className={cn('mt-4 text-pretty text-base leading-relaxed sm:text-lg', light ? 'text-navy-100' : 'text-ink-muted')}>{description}</p>}
      </div>
      {action && <div className={cn('shrink-0', centered && 'mx-auto')}>{action}</div>}
    </Reveal>
  );
}
