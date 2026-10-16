import { ArrowUpRight } from 'lucide-react';
import type { Leader } from '@/types';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';

interface LeaderCardProps {
  leader: Leader;
  onOpen: () => void;
  className?: string;
  headingLevel?: 'h3' | 'h4';
}

/**
 * Profile card for a member of management / administration / governing body.
 * The whole card is clickable through the stretched "View profile" button, which opens a dialog.
 */
export function LeaderCard({ leader, onOpen, className, headingLevel: Heading = 'h3' }: LeaderCardProps) {
  return (
    <article className={cn('card card-hover group relative flex h-full flex-col overflow-hidden', className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-100 sm:aspect-[4/4]">
        <SmartImage
          image={{ src: leader.photo.src, alt: `Portrait of ${leader.name}` }}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/70 to-transparent" aria-hidden />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Heading className="text-lg font-bold leading-snug">{leader.name}</Heading>
        <p className="mt-1 text-sm font-semibold text-royal-700">{leader.designation}</p>
        <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{leader.bio}</p>
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-royal-700 after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-0"
        >
          View full profile
          <span className="sr-only">: {leader.name}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[button:focus-visible]:ring-2" aria-hidden />
    </article>
  );
}
