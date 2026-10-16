import { BookMarked, BookOpenText, FileText, Presentation } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { departments, getDepartment } from '@/data/departments';
import { getFaculty } from '@/data/faculty';
import { publicationTypes, publicationYears, publications, type Publication, type PublicationType } from '@/data/research';
import { usePagination } from '@/hooks/usePagination';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { matchesQuery } from '@/utils/search';
import { cn } from '@/utils/cn';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { FilterChips, FilterSelect, ResultsSummary, SearchInput } from '@/components/ui/Filters';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/States';

const typeTone: Record<PublicationType, BadgeTone> = { Journal: 'royal', Conference: 'sky', 'Book chapter': 'gold' };
const typeIcon: Record<PublicationType, typeof FileText> = { Journal: BookOpenText, Conference: Presentation, 'Book chapter': BookMarked };

const PAGE_SIZE = 8;

function Authors({ pub }: { pub: Publication }) {
  return (
    <p className="mt-1.5 text-sm text-ink-soft">
      {pub.authors.map((name, i) => {
        const slug = pub.facultySlugs.find((s) => getFaculty(s)?.name === name);
        return (
          <span key={`${name}-${i}`}>
            {i > 0 && ', '}
            {slug ? (
              <Link to={`/faculty/${slug}`} className="link relative z-10 font-medium">
                {name}
              </Link>
            ) : (
              name
            )}
          </span>
        );
      })}
    </p>
  );
}

/** Searchable, filterable, paginated faculty publication list. Filter state lives in the URL (p* keys). */
export function PublicationsExplorer() {
  const [filters, setFilter, resetFilters, activeCount] = useUrlFilters({ pq: '', pyear: 'all', pdept: 'all', ptype: 'all' });

  const filtered = useMemo(
    () =>
      publications.filter(
        (p) =>
          (filters.pyear === 'all' || String(p.year) === filters.pyear) &&
          (filters.pdept === 'all' || p.departmentSlug === filters.pdept) &&
          (filters.ptype === 'all' || p.type === filters.ptype) &&
          matchesQuery(filters.pq, p.title, p.venue, p.authors.join(' '), getDepartment(p.departmentSlug)?.shortName),
      ),
    [filters],
  );

  const typeCounts = useMemo(() => {
    const base = publications.filter(
      (p) =>
        (filters.pyear === 'all' || String(p.year) === filters.pyear) &&
        (filters.pdept === 'all' || p.departmentSlug === filters.pdept) &&
        matchesQuery(filters.pq, p.title, p.venue, p.authors.join(' ')),
    );
    return { all: base.length, ...Object.fromEntries(publicationTypes.map((t) => [t, base.filter((p) => p.type === t).length])) } as Record<string, number>;
  }, [filters.pyear, filters.pdept, filters.pq]);

  const { page, pageCount, pageItems, total, start, end, setPage } = usePagination(filtered, PAGE_SIZE);

  const update = (key: keyof typeof filters, value: string) => {
    setFilter(key, value);
    setPage(1);
  };
  const reset = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <div>
      <div className="card p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr] md:items-end">
          <SearchInput label="Search publications" showLabel value={filters.pq} onChange={(v) => update('pq', v)} placeholder="Title, author, venue or keyword" />
          <FilterSelect label="Year" value={filters.pyear} onChange={(v) => update('pyear', v)} allLabel="All years" options={publicationYears.map((y) => ({ value: String(y), label: String(y) }))} />
          <FilterSelect label="Department" value={filters.pdept} onChange={(v) => update('pdept', v)} allLabel="All departments" options={departments.map((d) => ({ value: d.slug, label: d.shortName }))} />
        </div>
        <FilterChips
          className="mt-4"
          label="Publication type"
          value={filters.ptype}
          onChange={(v) => update('ptype', v)}
          options={[{ value: 'all', label: 'All types', count: typeCounts.all }, ...publicationTypes.map((t) => ({ value: t, label: t, count: typeCounts[t] }))]}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1">
          <ResultsSummary id="publications-results" start={start} end={end} total={total} noun="publications" onReset={reset} activeFilters={activeCount} />
        </div>
        <DemoBadge label="Illustrative records" />
      </div>

      {total === 0 ? (
        <EmptyState
          className="mt-6"
          title="No publications match your filters"
          description="Try a different keyword, or widen the year, department or type filters."
          action={
            <Button variant="secondary" size="sm" onClick={reset}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <ol className="mt-6 space-y-3" start={start}>
          {pageItems.map((pub) => {
            const Icon = typeIcon[pub.type];
            return (
              <li key={pub.id} className="group flex gap-4 rounded-2xl border border-navy-100 bg-white p-4 transition hover:border-royal-200 hover:shadow-card sm:p-5">
                <span className={cn('hidden h-11 w-11 shrink-0 place-items-center rounded-xl sm:grid', pub.type === 'Book chapter' ? 'bg-gold-50 text-gold-700' : pub.type === 'Conference' ? 'bg-sky-50 text-sky-700' : 'bg-royal-50 text-royal-700')}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={typeTone[pub.type]}>{pub.type}</Badge>
                    <span className="text-xs font-semibold text-ink-muted">{pub.year}</span>
                    <span className="text-xs text-ink-muted" aria-hidden>
                      ·
                    </span>
                    <span className="text-xs text-ink-muted">{getDepartment(pub.departmentSlug)?.shortName}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold leading-snug text-navy-950 group-hover:text-royal-800">{pub.title}</h3>
                  <Authors pub={pub} />
                  <p className="mt-1 text-sm italic text-ink-muted">{pub.venue}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} scrollTargetId="publications-results" />
    </div>
  );
}
