import { ArrowRight, BookOpen, Building2, GraduationCap, Users } from 'lucide-react';
import { useMemo } from 'react';
import type { DisciplineId } from '@/types';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button, ButtonLink } from '@/components/ui/Button';
import { FilterChips, ResultsSummary, SearchInput } from '@/components/ui/Filters';
import { EmptyState } from '@/components/ui/States';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { DepartmentCard } from '@/components/cards/DepartmentCard';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { departments, disciplineLabels } from '@/data/departments';
import { programs } from '@/data/programs';
import { faculty } from '@/data/faculty';
import { images } from '@/data/images';
import { matchesQuery } from '@/utils/search';

/** Only offer disciplines that actually have departments, in the order defined by disciplineLabels. */
const disciplineOptions = (Object.keys(disciplineLabels) as DisciplineId[])
  .map((id) => ({ id, count: departments.filter((d) => d.discipline === id).length }))
  .filter((o) => o.count > 0);

const sortedDepartments = [...departments].sort((a, b) => a.name.localeCompare(b.name));

export default function DepartmentsPage() {
  const [filters, setFilter, resetFilters, activeCount] = useUrlFilters({ q: '', discipline: 'all' });

  const results = useMemo(
    () =>
      sortedDepartments.filter(
        (d) =>
          (filters.discipline === 'all' || d.discipline === filters.discipline) &&
          matchesQuery(
            filters.q,
            d.name,
            d.shortName,
            d.tagline,
            d.overview,
            disciplineLabels[d.discipline],
            d.research.join(' '),
            d.labs.map((l) => l.name).join(' '),
          ),
      ),
    [filters.q, filters.discipline],
  );

  return (
    <>
      <Seo
        title="Academic Departments"
        description="Explore our academic departments across engineering, computing, sciences, commerce, humanities, law and education — programs, faculty, labs and research."
      />
      <PageHero
        eyebrow="Academics"
        title="Academic departments"
        description="Each department brings together dedicated faculty, specialised laboratories and an active research culture. Find the one that matches your interests."
        image={images.lecture}
        actions={
          <>
            <ButtonLink to="/programs" variant="gold" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Find a program
            </ButtonLink>
            <ButtonLink to="/faculty" variant="outline-light">
              Faculty directory
            </ButtonLink>
          </>
        }
        aside={
          <dl className="glass grid grid-cols-3 gap-px overflow-hidden rounded-2xl text-center">
            {[
              { label: 'Departments', value: departments.length, icon: Building2 },
              { label: 'Programs', value: programs.length, icon: GraduationCap },
              { label: 'Faculty listed', value: faculty.length, icon: Users },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center bg-navy-950/30 px-4 py-4 sm:px-6">
                <s.icon className="h-5 w-5 text-gold-300" aria-hidden />
                <dt className="order-last text-xs font-semibold text-navy-200">{s.label}</dt>
                <dd className="mt-2 font-display text-2xl font-extrabold text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section tone="alt" labelledBy="departments-heading">
        <SectionHeading
          id="departments-heading"
          eyebrow="Browse"
          title="Find a department"
          description="Search by subject, research area or laboratory, or filter by discipline."
        />

        <div className="card space-y-4 p-4 sm:p-5">
          <SearchInput
            value={filters.q}
            onChange={(v) => setFilter('q', v)}
            label="Search departments"
            placeholder="Search e.g. machine learning, VLSI, moot court…"
            size="lg"
          />
          <div>
            <p aria-hidden className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Discipline
            </p>
            <FilterChips
              label="Filter by discipline"
              value={filters.discipline}
              onChange={(v) => setFilter('discipline', v)}
              options={[
                { value: 'all', label: 'All', count: departments.length },
                ...disciplineOptions.map((o) => ({ value: o.id, label: disciplineLabels[o.id], count: o.count })),
              ]}
            />
          </div>
        </div>

        <div className="mt-8">
          <ResultsSummary
            id="department-results"
            start={results.length ? 1 : 0}
            end={results.length}
            total={results.length}
            noun={results.length === 1 ? 'department' : 'departments'}
            onReset={resetFilters}
            activeFilters={activeCount}
          />
        </div>

        {results.length > 0 ? (
          <Stagger key={`${filters.q}|${filters.discipline}`} as="ul" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((d) => (
              <StaggerItem as="li" key={d.slug}>
                <DepartmentCard department={d} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            className="mt-6"
            title="No departments match your search"
            description="Try a broader term, check the spelling or show all disciplines."
            action={
              <Button variant="primary" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        )}
      </Section>

      <Section labelledBy="departments-help-heading" size="sm">
        <div className="grid items-center gap-6 rounded-3xl border border-navy-100 bg-surface-alt p-6 sm:p-10 md:grid-cols-[auto_1fr_auto]">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-900 text-gold-300">
            <BookOpen className="h-7 w-7" aria-hidden />
          </span>
          <div>
            <h2 id="departments-help-heading" className="text-xl font-bold sm:text-2xl">
              Not sure which department fits you?
            </h2>
            <p className="mt-1 text-ink-muted">Use the course finder to compare programs by level, eligibility and duration, or talk to an admissions counsellor.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/programs" variant="primary">
              Course finder
            </ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Ask a counsellor
            </ButtonLink>
          </div>
        </div>
      </Section>

      <EnquiryCTA />
    </>
  );
}
