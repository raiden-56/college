import { Pause, Play } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Accessible label for the scrolling region */
  label: string;
  speedSeconds?: number;
}

/**
 * Continuously scrolling strip (logos, credentials). Content is duplicated for a seamless loop;
 * the duplicate is hidden from assistive tech. Includes a pause control (WCAG 2.2.2) and stops on hover/focus.
 * Under reduced motion the CSS animation is disabled globally and the strip simply scrolls horizontally.
 */
export function Marquee({ children, className, label, speedSeconds = 40 }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  return (
    <div className={cn('group relative', className)} role="region" aria-label={label}>
      <div className="mask-fade-x scrollbar-none overflow-x-auto motion-safe:overflow-hidden">
        <div
          className="flex w-max animate-marquee gap-4 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${speedSeconds}s`, animationPlayState: paused ? 'paused' : undefined }}
        >
          <div className="flex shrink-0 gap-4">{children}</div>
          <div className="flex shrink-0 gap-4" aria-hidden="true" inert>
            {children}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute -top-9 right-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-current opacity-70 hover:opacity-100 motion-reduce:hidden"
        aria-pressed={paused}
      >
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
        {paused ? 'Play' : 'Pause'}
      </button>
    </div>
  );
}
