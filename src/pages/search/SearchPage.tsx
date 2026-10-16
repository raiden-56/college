import { ArrowRight, ArrowUpRight, FileText, Search } from 'lucide-react';
import { useMemo, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { SearchResult } from '@/types';
import { quickLinks } from '@/data/navigation';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Button, ButtonLink } from '@/components/ui/Button';
import { FilterChips, SearchInput } from '@/components/ui/Filters';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/States';
import { useDebounce } from '@/hooks/useDebounce';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { groupResults, searchOrder, searchSite } from '@/utils/searchIndex';
import { resultIcons } from '@/utils/searchIcons';
import { cn } from '@/utils/cn';

const typeLabels: Record<SearchResult['type'], string> = {
  Page: 'Pages',
  Program: 'Programs',
  Department: 'Departments',
  Faculty: 'Faculty',
  'News & Notices': 'News & notices',
  Event: 'Events',
  Download: 'Downloads',
  FAQ: 'FAQs',
};

const suggestions = ['B.Tech', 'MBA', 'Hostel', 'Scholarship', 'Fee structure', 'Exam timetable', 'Placements', 'Anti-ragging'];

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps query words found in `text` in <mark> for scanning. */
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map(escapeRegExp);
  if (words.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${words.join('|')})`, 'gi');
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-gold-100 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

const typeSlug = (type: string) => type.toLowerCase().replace(/[^a-z]+/g, '-');

function ResultItem({ result, query }: { result: SearchResult; query: string }) {
  const Icon = resultIcons[result.type];
  const body: ReactNode = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-700 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-bold leading-snug text-navy-950 group-hover:text-royal-700">
          <Highlight text={result.title} query={query} />
        </span>
        <span className="mt-1 line-clamp-2 block text-sm text-ink-muted">
          <Highlight text={result.description} query={query} />
        </span>
        <span className="mt-1.5 block truncate text-xs font-medium text-navy-500">
          {result.external ? (
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" aria-hidden /> Document · opens in a new tab
            </span>
          ) : (
            result.to
          )}
        </span>
      </span>
      {result.external ? (
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-navy-400 transition group-hover:text-royal-700" aria-hidden />
      ) : (
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-navy-400 transition group-hover:translate-x-0.5 group-hover:text-royal-700" aria-hidden />
      )}
    </>
  );
  const className = 'group flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-4 transition hover:border-royal-200 hover:shadow-card sm:p-5';

  return result.external ? (
    <a href={result.to} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link to={result.to} className={className}>
      {body}
    </Link>
  );
}

export default function SearchPage() {
  const [filters, setFilter] = useUrlFilters({ q: '', type: 'all' });
  const [, setParams] = useSearchParams();
  const query = filters.q;
  const debounced = useDebounce(query, 200);
  const trimmed = debounced.trim();

  const results = useMemo(() => searchSite(trimmed, 200), [trimmed]);
  const counts = useMemo(() => {
    const map = new Map<SearchResult['type'], number>();
    results.forEach((r) => map.set(r.type, (map.get(r.type) ?? 0) + 1));
    return map;
  }, [results]);

  const activeType = searchOrder.includes(filters.type as SearchResult['type']) ? (filters.type as SearchResult['type']) : 'all';
  const filtered = activeType === 'all' ? results : results.filter((r) => r.type === activeType);
  const groups = groupResults(filtered);

  const chipOptions = [
    { value: 'all', label: 'All', count: results.length },
    ...searchOrder
      .filter((t) => (counts.get(t) ?? 0) > 0 || t === activeType)
      .map((t) => ({ value: t, label: typeLabels[t], count: counts.get(t) ?? 0 })),
  ];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilter('q', query.trim());
  };

  const runSuggestion = (s: string) => {
    // One URL update: new query, type filter cleared
    setParams(new URLSearchParams({ q: s }), { replace: true, preventScrollReset: true });
  };

  const statusText = !trimmed
    ? 'Enter a keyword to search the website.'
    : results.length === 0
      ? `No results for “${trimmed}”.`
      : activeType === 'all'
        ? `${results.length} result${results.length === 1 ? '' : 's'} for “${trimmed}”.`
        : `${filtered.length} of ${results.length} results for “${trimmed}”, showing ${typeLabels[activeType]}.`;

  return (
    <>
      <Seo
        title={trimmed ? `Search: ${trimmed}` : 'Search'}
        description="Search programs, departments, faculty, news, events, downloads and FAQs across the Bapuji College Karwar website."
        noindex
      />
      <PageHero eyebrow="Search" title="Search the website" description="Find programs, departments, faculty, notices, events, documents and answers to common questions.">
        <form role="search" onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-3 sm:flex-row" aria-label="Site search">
          <SearchInput
            value={query}
            onChange={(v) => setFilter('q', v)}
            label="Search the website"
            placeholder="Try “MBA”, “hostel” or “exam timetable”"
            size="lg"
            className="flex-1 text-ink"
          />
          <Button type="submit" variant="gold" size="lg" icon={<Search className="h-4 w-4" aria-hidden />}>
            Search
          </Button>
        </form>
      </PageHero>

      <Section tone="alt" labelledBy="search-results-heading" size="sm" className="min-h-[50vh]">
        <h2 id="search-results-heading" className="sr-only">
          Search results
        </h2>
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm font-medium text-ink-muted">
          {statusText}
        </p>

        {!trimmed && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-lg font-bold">Popular searches</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => runSuggestion(s)}
                      className="rounded-full border border-navy-100 bg-surface-alt px-3.5 py-1.5 text-sm font-medium text-navy-800 transition hover:border-royal-300 hover:text-royal-700"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold">Quick links</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {quickLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-royal-700">
                      <ArrowRight className="h-4 w-4 text-royal-600 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/sitemap" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-royal-700">
                    <ArrowRight className="h-4 w-4 text-royal-600 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    Full sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {trimmed && results.length > 0 && (
          <>
            <FilterChips label="Filter results by type" value={activeType} onChange={(v) => setFilter('type', v)} options={chipOptions} className="mt-6" />
            {groups.length > 0 ? (
              <div className="mt-8 space-y-10">
                {groups.map((group) => (
                  <section key={group.type} aria-labelledby={`results-${typeSlug(group.type)}`}>
                    <h3 id={`results-${typeSlug(group.type)}`} className="flex items-center gap-2 text-lg font-bold">
                      {typeLabels[group.type]}
                      <span className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-700">{group.items.length}</span>
                    </h3>
                    <ul className={cn('mt-4 grid gap-3', group.items.length > 1 && 'lg:grid-cols-2')}>
                      {group.items.map((r) => (
                        <li key={r.id}>
                          <ResultItem result={r} query={trimmed} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <EmptyState
                className="mt-8"
                title={`No ${typeLabels[activeType as SearchResult['type']]?.toLowerCase() ?? 'results'} match “${trimmed}”`}
                description="Other result types do match — show everything instead."
                action={
                  <Button variant="secondary" onClick={() => setFilter('type', 'all')}>
                    Show all results
                  </Button>
                }
              />
            )}
          </>
        )}

        {trimmed && results.length === 0 && (
          <EmptyState
            className="mt-8"
            title={`Nothing found for “${trimmed}”`}
            description={
              <>
                <p>Check the spelling, use fewer words, or try one of these:</p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {suggestions.slice(0, 6).map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => runSuggestion(s)}
                        className="rounded-full border border-navy-100 bg-surface-alt px-3 py-1.5 text-sm font-medium text-navy-800 transition hover:border-royal-300 hover:text-royal-700"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            }
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink to="/sitemap" variant="secondary">
                  Browse the sitemap
                </ButtonLink>
                <ButtonLink to="/contact" variant="ghost">
                  Contact us
                </ButtonLink>
              </div>
            }
          />
        )}
      </Section>
    </>
  );
}
