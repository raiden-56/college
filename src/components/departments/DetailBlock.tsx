import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/utils/cn';

interface DetailBlockProps {
  id: string;
  title: string;
  icon: LucideIcon;
  description?: ReactNode;
  /** Extra element aligned with the heading (e.g. a "view all" link) */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * A titled sub-section of a dense detail page (department / faculty profile).
 * Anchor offset clears the fixed header plus the mobile sticky section strip.
 */
export function DetailBlock({ id, title, icon: Icon, description, action, children, className }: DetailBlockProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn('scroll-mt-16 lg:scroll-mt-6', className)}>
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-700">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 id={headingId} className="text-2xl font-extrabold leading-tight sm:text-[1.75rem]">
              {title}
            </h2>
            {description && <p className="mt-1 max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p>}
          </div>
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  );
}
