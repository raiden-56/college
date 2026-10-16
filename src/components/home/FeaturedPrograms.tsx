import { ArrowRight, Compass } from 'lucide-react';
import { useState } from 'react';
import type { DegreeLevel } from '@/types';
import { degreeLevelLabels, degreeLevels, featuredPrograms, programs } from '@/data/programs';
import { CourseCard } from '@/components/cards/CourseCard';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { FilterChips } from '@/components/ui/Filters';
import { Section, SectionHeading } from '@/components/ui/Section';

type LevelFilter = 'all' | DegreeLevel;

/** Featured programs with level chips, followed by a course-finder prompt. */
export function FeaturedPrograms() {
  const [level, setLevel] = useState<LevelFilter>('all');
  const levels = degreeLevels.filter((l) => featuredPrograms.some((p) => p.level === l));
  const shown = level === 'all' ? featuredPrograms : featuredPrograms.filter((p) => p.level === level);

  return (
    <Section id="featured-programs" labelledBy="programs-heading" size="lg">
      <SectionHeading
        id="programs-heading"
        eyebrow="Featured programs"
        title="Find the program that fits your ambition"
        description="A selection of our most sought-after degrees. Every program combines strong foundations with labs, projects and internships."
        action={
          <ButtonLink to="/programs" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            View all {programs.length} programs
          </ButtonLink>
        }
      />

      {levels.length > 1 && (
        <FilterChips
          label="Filter featured programs by level"
          value={level}
          onChange={(v) => setLevel(v as LevelFilter)}
          options={[
            { value: 'all', label: 'All featured', count: featuredPrograms.length },
            ...levels.map((l) => ({ value: l, label: degreeLevelLabels[l], count: featuredPrograms.filter((p) => p.level === l).length })),
          ]}
          className="mb-8"
        />
      )}
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} featured program{shown.length === 1 ? '' : 's'}
      </p>

      <Stagger key={level} as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((program) => (
          <StaggerItem as="li" key={program.slug}>
            <CourseCard program={program} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="on-dark mt-12 flex flex-col gap-6 overflow-hidden rounded-3xl bg-navy-radial p-6 text-white shadow-lift sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold-300">
            <Compass className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className="font-display text-xl font-bold text-white">Not sure where to start?</p>
            <p className="mt-1 max-w-xl text-sm text-navy-100">
              Use the course finder to compare programs by level, eligibility and study mode, then check the fee structure for each.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <ButtonLink to="/programs" variant="gold">
            Open course finder
          </ButtonLink>
          <ButtonLink to="/fees" variant="outline-light">
            Fee structure
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
