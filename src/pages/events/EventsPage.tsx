import { ArrowRight, CalendarDays, Clock, LayoutGrid, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { EventCalendar } from '@/components/events/EventCalendar';
import { EventCard } from '@/components/cards/EventCard';
import { Button, ButtonLink } from '@/components/ui/Button';
import { FilterSelect, ResultsSummary, SearchInput } from '@/components/ui/Filters';
import { Pagination } from '@/components/ui/Pagination';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { eventCategories, pastEvents, upcomingEvents } from '@/data/events';
import { images } from '@/data/images';
import { usePagination } from '@/hooks/usePagination';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import type { CollegeEvent } from '@/types';
import { cn } from '@/utils/cn';
import { formatDateRange, formatTime } from '@/utils/format';
import { matchesQuery } from '@/utils/search';

const ARCHIVE_PAGE_SIZE = 6;

export default function EventsPage() {
  const [now] = useState(() => new Date());
  // Two groups so "clear filters" keeps the chosen tab and view.
  const [display, setDisplay] = useUrlFilters({ tab: 'upcoming', view: 'list' });
  const [filters, setFilter, resetFilters, filterCount] = useUrlFilters({ q: '', category: 'all' });
  const tab = display.tab === 'past' ? 'past' : 'upcoming';
  const view = display.view === 'calendar' ? 'calendar' : 'list';

  const matches = useMemo(
    () => (e: CollegeEvent) =>
      (filters.category === 'all' || e.category === filters.category) && matchesQuery(filters.q, e.title, e.summary, e.venue, e.organizer, e.category, e.content.join(' ')),
    [filters.category, filters.q],
  );

  const upcoming = useMemo(() => upcomingEvents(now).filter(matches), [now, matches]);
  const past = useMemo(() => pastEvents(now).filter(matches), [now, matches]);
  const all = useMemo(() => [...upcoming, ...past], [upcoming, past]);
  const archive = usePagination(past, ARCHIVE_PAGE_SIZE);

  const nextEvent = upcomingEvents(now)[0];

  const update = (key: keyof typeof filters, value: string) => {
    setFilter(key, value);
    archive.setPage(1);
  };
  const clearFilters = () => {
    resetFilters();
    archive.setPage(1);
  };

  const empty = (what: string) => (
    <EmptyState
      title={`No ${what} match your search`}
      description="Try a different keyword or category."
      action={
        filterCount > 0 ? (
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : undefined
      }
    />
  );

  const upcomingPanel = (
    <div>
      <ResultsSummary start={upcoming.length ? 1 : 0} end={upcoming.length} total={upcoming.length} noun="upcoming events" onReset={clearFilters} activeFilters={filterCount} />
      {upcoming.length === 0 ? (
        <div className="mt-6">{empty('upcoming events')}</div>
      ) : (
        <Stagger key={`${filters.q}-${filters.category}`} as="ul" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((e) => (
            <StaggerItem as="li" key={e.slug}>
              <EventCard event={e} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );

  const pastPanel = (
    <div>
      <ResultsSummary id="archive-results" start={archive.start} end={archive.end} total={archive.total} noun="past events" onReset={clearFilters} activeFilters={filterCount} />
      {archive.total === 0 ? (
        <div className="mt-6">{empty('past events')}</div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {archive.pageItems.map((e) => (
            <li key={e.slug}>
              <EventCard event={e} variant="row" className="h-full" />
            </li>
          ))}
        </ul>
      )}
      <Pagination page={archive.page} pageCount={archive.pageCount} onPageChange={archive.setPage} scrollTargetId="archive-results" />
    </div>
  );

  return (
    <>
      <Seo
        title="Events"
        description="Upcoming workshops, seminars, conferences, festivals, sports and admission events at Bapuji College Karwar — browse as a list or month calendar, or explore the archive."
      />
      <PageHero
        eyebrow="Events"
        title="What’s happening on campus"
        description="Workshops, conferences, festivals, sports and open days — find an event, add it to your calendar and register."
        image={images.concert}
        actions={
          <ButtonLink to="/events?view=calendar" variant="gold" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
            Open calendar
          </ButtonLink>
        }
        aside={
          nextEvent && (
            <Link to={`/events/${nextEvent.slug}`} className="glass group block max-w-sm rounded-3xl p-6 transition hover:bg-white/15 lg:w-80">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">Next up</p>
              <p className="mt-2 text-lg font-bold leading-snug text-white">{nextEvent.title}</p>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-navy-100">
                <Clock className="h-4 w-4 text-gold-300" aria-hidden />
                {formatDateRange(nextEvent.startDate, nextEvent.endDate)} · {formatTime(nextEvent.startDate)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-100">
                <MapPin className="h-4 w-4 text-gold-300" aria-hidden />
                {nextEvent.venue}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          )
        }
      />

      <Section tone="alt" labelledBy="events-heading">
        <SectionHeading
          id="events-heading"
          eyebrow="Browse"
          title={view === 'calendar' ? 'Event calendar' : tab === 'past' ? 'Event archive' : 'Upcoming events'}
          description="Search by keyword, filter by category, and switch between list and calendar views."
        />

        <div className="card grid gap-4 p-4 sm:p-6 md:grid-cols-[2fr_1fr_auto] md:items-end">
          <SearchInput label="Search events" showLabel value={filters.q} onChange={(v) => update('q', v)} placeholder="Title, venue or organiser" />
          <FilterSelect label="Category" value={filters.category} onChange={(v) => update('category', v)} allLabel="All categories" options={eventCategories.map((c) => ({ value: c, label: c }))} />
          <div>
            <p className="field-label text-xs uppercase tracking-wide text-ink-muted" id="view-toggle-label">
              View
            </p>
            <div role="group" aria-labelledby="view-toggle-label" className="inline-flex rounded-full border border-navy-100 bg-white p-1">
              {(
                [
                  { id: 'list', label: 'List', icon: <LayoutGrid className="h-4 w-4" aria-hidden /> },
                  { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="h-4 w-4" aria-hidden /> },
                ] as const
              ).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={view === o.id}
                  onClick={() => setDisplay('view', o.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition',
                    view === o.id ? 'bg-navy-900 text-white shadow-card' : 'text-ink-muted hover:text-navy-900',
                  )}
                >
                  {o.icon}
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filterCount > 0 && view === 'calendar' && (
          <div className="mt-4">
            <ResultsSummary start={all.length ? 1 : 0} end={all.length} total={all.length} noun="events shown on the calendar" onReset={clearFilters} activeFilters={filterCount} />
          </div>
        )}

        <div className="mt-8">
          {view === 'calendar' ? (
            <EventCalendar events={all} today={now} />
          ) : (
            <Tabs
              label="Upcoming or past events"
              value={tab}
              onChange={(id) => {
                setDisplay('tab', id);
                archive.setPage(1);
              }}
              tabs={[
                { id: 'upcoming', label: `Upcoming (${upcoming.length})`, content: upcomingPanel },
                { id: 'past', label: `Past events (${past.length})`, content: pastPanel },
              ]}
            />
          )}
        </div>
        <p className="mt-10 text-center text-sm text-ink-muted">
          Want to host or propose an event?{' '}
          <Link to="/contact" className="link">
            Contact the events office
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
