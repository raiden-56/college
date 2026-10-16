import { ArrowRight, CalendarX2, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { upcomingEvents } from '@/data/events';
import { sortedPosts } from '@/data/news';
import { EventCard } from '@/components/cards/EventCard';
import { NewsCard } from '@/components/cards/NewsCard';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/States';

/** Upcoming events (lead card + compact rows) beside a notice-board style list of the latest news and notices. */
export function EventsAndNews() {
  const events = upcomingEvents().slice(0, 4);
  const [lead, ...rest] = events;
  const posts = sortedPosts.slice(0, 5);

  return (
    <Section id="whats-on" ariaLabel="Upcoming events and latest news" size="lg">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
        <section aria-labelledby="events-heading">
          <SectionHeading
            id="events-heading"
            eyebrow="Events"
            title="Upcoming on campus"
            action={
              <ButtonLink to="/events" variant="secondary" size="sm" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Events calendar
              </ButtonLink>
            }
            className="!mb-8"
          />
          {lead ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal>
                <EventCard event={lead} />
              </Reveal>
              {rest.length > 0 && (
                <Stagger as="ul" className="space-y-4">
                  {rest.map((e) => (
                    <StaggerItem as="li" key={e.slug}>
                      <EventCard event={e} variant="row" />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarX2 className="h-7 w-7" aria-hidden />}
              title="No upcoming events right now"
              description="New workshops, fests and talks are added regularly."
              action={
                <ButtonLink to="/events" variant="secondary" size="sm">
                  Browse past events
                </ButtonLink>
              }
            />
          )}
        </section>

        <Reveal direction="left">
          <section aria-labelledby="news-heading" className="h-full rounded-3xl border border-navy-100 bg-surface-alt p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4 px-1">
              <h2 id="news-heading" className="flex items-center gap-2.5 text-2xl font-extrabold">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-300">
                  <Megaphone className="h-5 w-5" aria-hidden />
                </span>
                News &amp; notices
              </h2>
            </div>
            <ul className="mt-4 divide-y divide-navy-100">
              {posts.map((post) => (
                <li key={post.slug} className="py-1">
                  <NewsCard post={post} variant="list" />
                </li>
              ))}
            </ul>
            <Link to="/news" className="link mt-4 inline-flex items-center gap-1.5 px-1 text-sm">
              All news &amp; notices <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </Reveal>
      </div>
    </Section>
  );
}
