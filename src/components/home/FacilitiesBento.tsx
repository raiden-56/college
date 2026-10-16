import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Facility } from '@/types';
import { facilities } from '@/data/facilities';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';
import { getIcon } from '@/utils/icons';

const highlighted = ['library', 'laboratories', 'hostels', 'sports'];

/** Grid placement for each bento tile (sm: 2 columns, lg: 4 × 2). */
const spans = [
  'sm:col-span-2 lg:row-span-2 min-h-[20rem]',
  'sm:col-span-2 min-h-[15rem]',
  'min-h-[15rem]',
  'min-h-[15rem]',
];

/** Campus facilities as an image bento grid plus a compact list of everything else. */
export function FacilitiesBento() {
  const featured = highlighted.map((slug) => facilities.find((f) => f.slug === slug)).filter((f): f is Facility => Boolean(f));
  const others = facilities.filter((f) => !highlighted.includes(f.slug));

  return (
    <Section id="facilities" tone="sunken" labelledBy="facilities-heading" size="lg">
      <SectionHeading
        id="facilities-heading"
        eyebrow="Campus & facilities"
        title="Everything you need to learn, live and play"
        description="Libraries, laboratories, residences and sports grounds designed around how students actually spend their day."
        action={
          <ButtonLink to="/campus" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Explore all facilities
          </ButtonLink>
        }
      />

      <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:h-[36rem] lg:grid-cols-4 lg:grid-rows-2">
        {featured.map((f, i) => {
          const Icon = getIcon(f.icon);
          return (
            <StaggerItem
              as="li"
              key={f.slug}
              className={cn('group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl bg-navy-900 p-6 text-white shadow-card lg:min-h-0', spans[i])}
            >
              <SmartImage image={f.image} decorative className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-navy-950/5" aria-hidden />
              <span className="glass grid h-11 w-11 place-items-center rounded-xl text-gold-300">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className={cn('mt-4 font-bold text-white', i === 0 ? 'text-2xl' : 'text-xl')}>
                <Link to="/campus" className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                  {f.name}
                </Link>
              </h3>
              <p className={cn('mt-1.5 text-sm text-navy-100', i === 0 ? 'max-w-md' : 'line-clamp-2')}>{f.summary}</p>
              <ArrowUpRight
                className="absolute right-5 top-5 h-5 w-5 text-white/70 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-300"
                aria-hidden
              />
              <span className="pointer-events-none absolute inset-0 rounded-3xl ring-gold-300 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
            </StaggerItem>
          );
        })}
      </Stagger>

      {others.length > 0 && (
        <Reveal className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-navy-700">Also on campus</h3>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {others.map((f) => {
              const Icon = getIcon(f.icon);
              return (
                <li key={f.slug} className="inline-flex items-center gap-2 rounded-full border border-navy-100 bg-white px-4 py-2 text-sm font-medium text-navy-800 shadow-sm">
                  <Icon className="h-4 w-4 text-royal-600" aria-hidden />
                  {f.name}
                </li>
              );
            })}
          </ul>
        </Reveal>
      )}
    </Section>
  );
}
