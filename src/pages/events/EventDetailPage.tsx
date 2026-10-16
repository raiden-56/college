import { ArrowRight, CalendarCheck, CalendarPlus, Clock, ExternalLink, FileText, Lock, MapPin, Tag, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { campusMapUrl, categoryStyles, downloadIcs, isPastEvent } from '@/components/events/eventUtils';
import { ShareActions } from '@/components/news/ShareActions';
import { EventCard } from '@/components/cards/EventCard';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { Section, SectionHeading } from '@/components/ui/Section';
import { useToast } from '@/components/ui/toast-context';
import { fullAddress } from '@/config/site';
import { getEvent, upcomingEvents } from '@/data/events';
import { cn } from '@/utils/cn';
import { formatDateRange, formatLongDate, formatTime } from '@/utils/format';
import { eventLd } from '@/utils/structuredData';
import NotFoundPage from '@/pages/NotFoundPage';

export default function EventDetailPage() {
  const { slug = '' } = useParams();
  const [now] = useState(() => new Date());
  const toast = useToast();
  const event = getEvent(slug);
  if (!event) return <NotFoundPage />;

  const past = isPastEvent(event, now);
  const sameDay = !event.endDate || new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString();
  const timeRange = event.endDate ? `${formatTime(event.startDate)} – ${formatTime(event.endDate)}` : formatTime(event.startDate);

  const upcoming = upcomingEvents(now).filter((e) => e.slug !== event.slug);
  const related = [...upcoming.filter((e) => e.category === event.category), ...upcoming.filter((e) => e.category !== event.category)].slice(0, 3);

  const addToCalendar = () => {
    downloadIcs(event);
    toast({ tone: 'success', title: 'Calendar file downloaded', description: 'Open the .ics file to add this event to your calendar app.' });
  };

  const facts = [
    {
      icon: <CalendarCheck className="h-5 w-5" aria-hidden />,
      label: 'Date',
      value: <time dateTime={event.startDate}>{sameDay ? formatLongDate(event.startDate) : formatDateRange(event.startDate, event.endDate)}</time>,
    },
    { icon: <Clock className="h-5 w-5" aria-hidden />, label: 'Time', value: sameDay ? timeRange : `Starts ${formatTime(event.startDate)} daily (IST)` },
    { icon: <MapPin className="h-5 w-5" aria-hidden />, label: 'Venue', value: event.venue },
    { icon: <UserRound className="h-5 w-5" aria-hidden />, label: 'Organiser', value: event.organizer },
  ];

  const registration = past ? (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>
        <strong className="block text-navy-950">Registration closed</strong>
        This event has ended. Browse the{' '}
        <Link to="/events" className="link">
          upcoming events
        </Link>
        .
      </p>
    </div>
  ) : event.registrationUrl ? (
    <ButtonLink to={event.registrationUrl} variant="primary" size="lg" className="w-full" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
      Register / RSVP
    </ButtonLink>
  ) : (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <strong className="block">Open to all — no registration required</strong>
      Questions?{' '}
      <Link to="/contact" className="link">
        Contact the organisers
      </Link>
      .
    </div>
  );

  return (
    <>
      <Seo title={event.title} description={event.summary} image={event.image.src} jsonLd={eventLd(event)} />
      <PageHero
        eyebrow={`${event.category}${past ? ' · Past event' : ''}`}
        title={event.title}
        description={event.summary}
        image={event.image}
        crumbLabel={event.title.length > 48 ? `${event.title.slice(0, 45)}…` : event.title}
        size="lg"
        actions={
          past ? undefined : (
            <>
              {event.registrationUrl && (
                <ButtonLink to={event.registrationUrl} variant="gold">
                  Register now
                </ButtonLink>
              )}
              <Button variant="outline-light" onClick={addToCalendar} icon={<CalendarPlus className="h-4 w-4" aria-hidden />}>
                Add to calendar
              </Button>
            </>
          )
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="white" icon={<CalendarCheck className="h-3.5 w-3.5" aria-hidden />}>
            {formatDateRange(event.startDate, event.endDate)}
          </Badge>
          <Badge tone="white" icon={<MapPin className="h-3.5 w-3.5" aria-hidden />}>
            {event.venue}
          </Badge>
          {past && <Badge tone="white">Event has ended</Badge>}
        </div>
      </PageHero>

      <Section labelledBy="about-event-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div className="min-w-0">
            <Reveal>
              <ParallaxImage image={event.image} strength={10} className="aspect-[16/9] rounded-3xl shadow-lift" />
            </Reveal>
            <h2 id="about-event-heading" className="mt-10 text-2xl font-extrabold sm:text-3xl">
              About this event
            </h2>
            <div className="prose-college mt-4">
              {event.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {event.attachments && event.attachments.length > 0 && (
              <section aria-labelledby="event-attachments-heading" className="mt-10">
                <h3 id="event-attachments-heading" className="flex items-center gap-2 text-xl font-bold">
                  <FileText className="h-5 w-5 text-royal-700" aria-hidden />
                  Documents
                </h3>
                <ul className="mt-4 grid gap-3">
                  {event.attachments.map((a) => (
                    <li key={a.title}>
                      <DownloadLink title={a.title} url={a.url} sizeKb={a.sizeKb} showPreview />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-10 flex flex-col gap-4 border-t border-navy-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link to={`/events?category=${encodeURIComponent(event.category)}`} className={cn('chip w-fit transition hover:shadow-card', categoryStyles[event.category].chip)}>
                <Tag className="h-3.5 w-3.5" aria-hidden />
                More {event.category.toLowerCase()} events
              </Link>
              <ShareActions title={event.title} />
            </div>
          </div>

          <aside aria-label="Event details" className="lg:sticky lg:top-32 lg:self-start">
            <Reveal className="card overflow-hidden">
              <div className="border-b border-navy-100 bg-surface-alt px-6 py-4">
                <h2 className="text-lg font-bold">Event details</h2>
              </div>
              <dl className="space-y-4 p-6">
                {facts.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-700">{f.icon}</span>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{f.label}</dt>
                      <dd className="mt-0.5 font-semibold text-navy-950">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="space-y-3 border-t border-navy-100 p-6">
                {registration}
                {!past && (
                  <Button variant="secondary" className="w-full" onClick={addToCalendar} icon={<CalendarPlus className="h-4 w-4" aria-hidden />}>
                    Add to calendar (.ics)
                  </Button>
                )}
                <ExternalButtonLink href={campusMapUrl} variant="ghost" className="w-full" icon={<ExternalLink className="h-4 w-4" aria-hidden />}>
                  Open campus in maps
                </ExternalButtonLink>
                <p className="text-center text-xs text-ink-muted">{fullAddress}</p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="alt" labelledBy="related-events-heading">
          <SectionHeading
            id="related-events-heading"
            eyebrow="Don’t miss"
            title="More upcoming events"
            action={
              <ButtonLink to="/events" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                All events
              </ButtonLink>
            }
          />
          <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <StaggerItem as="li" key={e.slug}>
                <EventCard event={e} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}
    </>
  );
}
