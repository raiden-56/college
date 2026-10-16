import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CollegeEvent } from '@/types';
import { dateParts, formatDateRange, formatTime } from '@/utils/format';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';

interface EventCardProps {
  event: CollegeEvent;
  className?: string;
  headingLevel?: 'h2' | 'h3';
  variant?: 'card' | 'row';
}

export function EventCard({ event, className, headingLevel: Heading = 'h3', variant = 'card' }: EventCardProps) {
  const { day, month } = dateParts(event.startDate);
  const dateBadge = (
    <div className="flex w-16 shrink-0 flex-col items-center rounded-2xl bg-navy-900 py-2.5 text-white shadow-card">
      <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">{month}</span>
      <span className="font-display text-2xl font-extrabold leading-none">{day}</span>
    </div>
  );
  const details = (
    <ul className="mt-2 space-y-1 text-sm text-ink-muted">
      <li className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 shrink-0 text-royal-600" aria-hidden />
        <span>
          <time dateTime={event.startDate}>{formatDateRange(event.startDate, event.endDate)}</time> · {formatTime(event.startDate)}
        </span>
      </li>
      <li className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-royal-600" aria-hidden />
        {event.venue}
      </li>
    </ul>
  );

  if (variant === 'row') {
    return (
      <article className={cn('group relative flex gap-4 rounded-2xl border border-navy-100 bg-white p-4 transition hover:border-royal-200 hover:shadow-card', className)}>
        {dateBadge}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-royal-700">{event.category}</p>
          <Heading className="mt-1 font-bold leading-snug">
            <Link to={`/events/${event.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-royal-700">
              {event.title}
            </Link>
          </Heading>
          {details}
        </div>
      </article>
    );
  }

  return (
    <article className={cn('card card-hover group relative flex h-full flex-col overflow-hidden', className)}>
      <div className="relative aspect-[16/9] overflow-hidden">
        <SmartImage image={event.image} decorative className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute left-4 top-4">{dateBadge}</div>
        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-900 backdrop-blur">{event.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="text-lg font-bold leading-snug">
          <Link to={`/events/${event.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {event.title}
          </Link>
        </Heading>
        {details}
        <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{event.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-royal-700" aria-hidden>
          Event details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
    </article>
  );
}
