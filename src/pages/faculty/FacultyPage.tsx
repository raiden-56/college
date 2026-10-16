import { ArrowRight, Users } from 'lucide-react';
import { useMemo } from 'react';
import type { Designation } from '@/types';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { Button, ButtonLink } from '@/components/ui/Button';
import { DemoNotice } from '@/components/ui/DemoBadge';
import { FilterSelect, ResultsSummary, SearchInput } from '@/components/ui/Filters';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/States';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { FacultyCard } from '@/components/cards/FacultyCard';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { usePagination } from '@/hooks/usePagination';
import { departments, getDepartment } from '@/data/departments';
import { designations, faculty, specializations } from '@/data/faculty';
import { images } from '@/data/images';
import { matchesQuery } from '@/utils/search';

const PAGE_SIZE = 9;

/** Seniority order used to sort the directory (most senior first, then alphabetical). */
const designationRank: Record<Designation, number> = {
  Principal: 0,
  'Professor & Head': 1,
  Professor: 2,
  'Associate Professor': 3,
  'Assistant Professor': 4,
  'Visiting Faculty': 5,
};

const sortName = (name: string) => name.replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, '');

const directory = [...faculty].sort(
  (a, b) => designationRank[a.designation] - designationRank[b.designation] || sortName(a.name).localeCompare(sortName(b.name)),
);

const departmentOptions = departments
  .filter((d) => faculty.some((f) => f.departmentSlug === d.slug))
  .map((d) => ({ value: d.slug, label: d.shortName }))
  .sort((a, b) => a.label.localeCompare(b.label));

const designationOptions = [...designations]
  .sort((a, b) => designationRank[a] - designationRank[b])
  .map((d) => ({ value: d, label: d }));

const specializationOptions = specializations.map((s) => ({ value: s, label: s }));

const defaults = { q: '', dept: 'all', designation: 'all', specialization: 'all' };

export default function FacultyPage() {
  const [filters, setFilter, resetFilters, activeCount] = useUrlFilters(defaults);

  const results = useMemo(
    () =>
      directory.filter(
        (f) =>
          (filters.dept === 'all' || f.departmentSlug === filters.dept) &&
          (filters.designation === 'all' || f.designation === filters.designation) &&
          (filters.specialization === 'all' || f.specialization === filters.specialization) &&
          matchesQuery(
            filters.q,
            f.name,
            f.designation,
            f.specialization,
            f.qualification,
            getDepartment(f.departmentSlug)?.name,
            f.subjects.join(' '),
            f.researchInterests.join(' '),
          ),
      ),
    [filters.q, filters.dept, filters.designation, filters.specialization],
  );

  const { page, pageCount, pageItems, total, start, end, setPage } = usePagination(results, PAGE_SIZE);

  // Any filter change returns to the first page of results.
  const update = (key: keyof typeof defaults, value: string) => {
    setFilter(key, value);
    setPage(1);
  };
  const reset = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <>
      <Seo
        title="Faculty Directory"
        description="Search our faculty directory by department, designation or specialisation and view qualifications, subjects taught, research interests and publications."
      />
      <PageHero
        eyebrow="Academics"
        title="Faculty directory"
        description="Meet the teachers, researchers and mentors who guide our students in classrooms, laboratories and beyond."
        image={images.lecture}
        actions={
          <ButtonLink to="/departments" variant="gold" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Browse departments
          </ButtonLink>
        }
        aside={
          <div className="glass flex items-center gap-4 rounded-2xl p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400 text-navy-950">
              <Users className="h-6 w-6" aria-hidden />
            </span>
            <p className="text-sm text-navy-100">
              <span className="block font-display text-2xl font-extrabold text-white">{faculty.length} profiles</span>
              across {departmentOptions.length} departments
            </p>
          </div>
        }
      />

      <Section tone="alt" labelledBy="faculty-list-heading">
        <h2 id="faculty-list-heading" className="sr-only">
          Search the faculty directory
        </h2>
        <DemoNotice className="mb-6" title="Fictional faculty profiles">
          Every profile in this directory is a placeholder. Names, photographs, credentials and publications must be replaced with approved
          staff records (with each person’s consent) before launch.
        </DemoNotice>

        <form role="search" aria-label="Filter faculty" onSubmit={(e) => e.preventDefault()} className="card grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] xl:items-end">
          <SearchInput
            value={filters.q}
            onChange={(v) => update('q', v)}
            label="Search by name, subject or research area"
            placeholder="Search faculty…"
            showLabel
            className="md:col-span-2 xl:col-span-1 [&_label]:text-xs [&_label]:uppercase [&_label]:tracking-wide [&_label]:text-ink-muted"
          />
          <FilterSelect label="Department" value={filters.dept} onChange={(v) => update('dept', v)} options={departmentOptions} allLabel="All departments" />
          <FilterSelect label="Designation" value={filters.designation} onChange={(v) => update('designation', v)} options={designationOptions} allLabel="All designations" />
          <FilterSelect
            label="Specialisation"
            value={filters.specialization}
            onChange={(v) => update('specialization', v)}
            options={specializationOptions}
            allLabel="All specialisations"
            className="md:col-span-2 xl:col-span-1"
          />
        </form>

        <div className="mt-8">
          <ResultsSummary id="faculty-results" start={start} end={end} total={total} noun="faculty members" onReset={reset} activeFilters={activeCount} />
        </div>

        {pageItems.length > 0 ? (
          <>
            <Stagger key={`${page}|${JSON.stringify(filters)}`} as="ul" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((f) => (
                <StaggerItem as="li" key={f.slug}>
                  <FacultyCard faculty={f} />
                </StaggerItem>
              ))}
            </Stagger>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} scrollTargetId="faculty-results" />
          </>
        ) : (
          <EmptyState
            className="mt-6"
            title="No faculty match these filters"
            description="Try a different name or subject, or clear the filters to see the full directory."
            action={
              <Button variant="primary" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        )}
      </Section>

      <EnquiryCTA />
    </>
  );
}
