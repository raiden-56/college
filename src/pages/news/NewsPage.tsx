import { ArrowRight, BadgeCheck, CalendarDays, Newspaper } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { NoticeBoard } from '@/components/news/NoticeBoard';
import { NewsCard } from '@/components/cards/NewsCard';
import { Button, ButtonLink } from '@/components/ui/Button';
import { FilterSelect, ResultsSummary, SearchInput } from '@/components/ui/Filters';
import { Pagination } from '@/components/ui/Pagination';
import { Section } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { images } from '@/data/images';
import { postCategories, sortedPosts } from '@/data/news';
import { usePagination } from '@/hooks/usePagination';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import type { Post } from '@/types';
import { formatDate } from '@/utils/format';
import { matchesQuery } from '@/utils/search';

type PostType = 'all' | 'official' | 'news';
const typeIds: PostType[] = ['all', 'official', 'news'];

const monthKey = (iso: string) => iso.slice(0, 7);
const monthLabel = (key: string) => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(`${key}-01T00:00:00`));
const monthOptions = Array.from(new Set(sortedPosts.map((p) => monthKey(p.date)))).map((k) => ({ value: k, label: monthLabel(k) }));

const matchesType = (p: Post, type: PostType) => type === 'all' || (type === 'official' ? p.isOfficialNotice : !p.isOfficialNotice);

export default function NewsPage() {
  // Separate groups so "clear filters" keeps the selected tab.
  const [typeFilter, setTypeFilter] = useUrlFilters({ type: 'all' });
  const [filters, setFilter, resetFilters, filterCount] = useUrlFilters({ q: '', category: 'all', month: 'all' });
  const type: PostType = typeIds.includes(typeFilter.type as PostType) ? (typeFilter.type as PostType) : 'all';

  // Everything except the type filter — used for the tab counts.
  const baseFiltered = useMemo(
    () =>
      sortedPosts.filter(
        (p) =>
          (filters.category === 'all' || p.category === filters.category) &&
          (filters.month === 'all' || monthKey(p.date) === filters.month) &&
          matchesQuery(filters.q, p.title, p.excerpt, p.content.join(' '), p.category, p.referenceNo, p.issuedBy, p.tags?.join(' ')),
      ),
    [filters.category, filters.month, filters.q],
  );

  const featured = sortedPosts[0];
  const showFeatured = filterCount === 0 && !!featured;
  const results = useMemo(
    () => baseFiltered.filter((p) => matchesType(p, type) && !(showFeatured && p.slug === featured.slug)),
    [baseFiltered, type, showFeatured, featured],
  );

  const pageSize = type === 'official' ? 10 : 9;
  const { page, pageCount, pageItems, total, start, end, setPage } = usePagination(results, pageSize);

  const update = (key: keyof typeof filters, value: string) => {
    setFilter(key, value);
    setPage(1);
  };
  const reset = () => {
    resetFilters();
    setPage(1);
  };

  const counts = {
    all: baseFiltered.length,
    official: baseFiltered.filter((p) => p.isOfficialNotice).length,
    news: baseFiltered.filter((p) => !p.isOfficialNotice).length,
  };
  const noun = type === 'official' ? 'official notices' : type === 'news' ? 'news stories' : 'posts';

  const panel = (
    <div>
      <div className="card grid gap-4 p-4 sm:p-6 md:grid-cols-[2fr_1fr_1fr] md:items-end">
        <SearchInput label="Search news and notices" showLabel value={filters.q} onChange={(v) => update('q', v)} placeholder="Keyword, reference no. or office" />
        <FilterSelect label="Category" value={filters.category} onChange={(v) => update('category', v)} allLabel="All categories" options={postCategories.map((c) => ({ value: c, label: c }))} />
        <FilterSelect label="Month" value={filters.month} onChange={(v) => update('month', v)} allLabel="Any date" options={monthOptions} />
      </div>

      <div className="mt-6">
        <ResultsSummary id="news-results" start={start} end={end} total={total} noun={showFeatured && matchesType(featured, type) ? `${noun} (latest one featured above)` : noun} onReset={reset} activeFilters={filterCount} />
      </div>

      {total === 0 ? (
        <EmptyState
          className="mt-6"
          title={`No ${noun} found`}
          description="Try a different keyword, choose another month or category, or switch tabs."
          action={
            <Button variant="secondary" size="sm" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : type === 'official' ? (
        <NoticeBoard posts={pageItems} className="mt-6" />
      ) : (
        <Stagger key={`${type}-${page}-${filters.q}-${filters.category}-${filters.month}`} as="ul" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((p) => (
            <StaggerItem as="li" key={p.slug}>
              <NewsCard post={p} />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} scrollTargetId="news-results" />
    </div>
  );

  return (
    <>
      <Seo
        title="News & Notices"
        description="Official notices, circulars and examination updates, plus campus news and student achievements from Bapuji College Karwar — searchable by category and date."
      />
      <PageHero
        eyebrow="News & notices"
        title="News, notices & circulars"
        description="Official notices carry a reference number and issuing office. Campus stories celebrate what our students and faculty are up to."
        image={images.writing}
        actions={
          <>
            <ButtonLink to="/news?type=official" variant="gold" icon={<BadgeCheck className="h-4 w-4" aria-hidden />}>
              Official notices
            </ButtonLink>
            <ButtonLink to="/events" variant="outline-light" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
              Upcoming events
            </ButtonLink>
          </>
        }
      />

      {showFeatured && (
        <Section size="sm" labelledBy="featured-heading">
          <h2 id="featured-heading" className="sr-only">
            Latest
          </h2>
          <Reveal>
            <article className="card group relative grid overflow-hidden lg:grid-cols-[1.3fr_1fr]">
              <ParallaxImage image={featured.image} strength={10} className="aspect-[16/9] lg:aspect-auto lg:min-h-[22rem]" imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <p className="eyebrow">
                  <span className="h-px w-6 bg-royal-600" aria-hidden />
                  Latest {featured.isOfficialNotice ? 'official notice' : 'story'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-ink-muted">
                  {featured.isOfficialNotice && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-2.5 py-0.5 font-semibold text-white">
                      <BadgeCheck className="h-3.5 w-3.5 text-gold-300" aria-hidden /> Official notice
                    </span>
                  )}
                  <span className="rounded-full bg-sky-50 px-2.5 py-0.5 font-semibold text-sky-800">{featured.category}</span>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  {featured.referenceNo && <span className="font-mono">Ref. {featured.referenceNo}</span>}
                </div>
                <h3 className="mt-4 text-balance text-2xl font-extrabold leading-tight sm:text-3xl">
                  <Link to={`/news/${featured.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-royal-800">
                    {featured.title}
                  </Link>
                </h3>
                <p className="mt-3 text-ink-muted">{featured.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-semibold text-royal-700" aria-hidden>
                  Read the full {featured.isOfficialNotice ? 'notice' : 'story'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
            </article>
          </Reveal>
        </Section>
      )}

      <Section tone="alt" labelledBy="all-posts-heading" className={showFeatured ? 'pt-6 sm:pt-8' : undefined}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              <span className="h-px w-6 bg-royal-600" aria-hidden />
              Browse
            </p>
            <h2 id="all-posts-heading" className="mt-3 text-3xl font-extrabold sm:text-4xl">
              All news & notices
            </h2>
          </div>
          <p className="flex items-center gap-2 text-sm text-ink-muted">
            <Newspaper className="h-4 w-4" aria-hidden />
            {sortedPosts.length} posts in the archive
          </p>
        </div>
        <Tabs
          label="Filter by post type"
          variant="underline"
          value={type}
          onChange={(id) => {
            setTypeFilter('type', id);
            setPage(1);
          }}
          tabs={[
            { id: 'all', label: `All (${counts.all})`, content: panel },
            {
              id: 'official',
              label: (
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4" aria-hidden /> Official notices ({counts.official})
                </span>
              ),
              content: panel,
            },
            { id: 'news', label: `College news (${counts.news})`, content: panel },
          ]}
        />
      </Section>
    </>
  );
}
