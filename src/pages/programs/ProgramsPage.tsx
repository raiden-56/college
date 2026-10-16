import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, Building2, Calculator, LayoutGrid, List, MessageCircleQuestion, SlidersHorizontal, X } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button, ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoNotice } from '@/components/ui/DemoBadge';
import { Drawer } from '@/components/ui/Drawer';
import { FilterChips, FilterSelect, ResultsSummary } from '@/components/ui/Filters';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/States';
import { CourseCard } from '@/components/cards/CourseCard';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { FinderFilterPanel } from '@/components/programs/FinderFilterPanel';
import { ProgramListItem } from '@/components/programs/ProgramListItem';
import { disciplineOptions, filterKeyLabel, filterValueLabel, finderDefaults, matchesFilters, sortOptions, sortPrograms, type FinderKey } from '@/components/programs/finder';
import { degreeLevelLabels, degreeLevels, programs } from '@/data/programs';
import { images } from '@/data/images';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { usePagination } from '@/hooks/usePagination';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';

const PAGE_SIZE = 9;

export default function ProgramsPage() {
  const [filters, setFilter, resetFilters, activeCount] = useUrlFilters(finderDefaults);
  const [display, setDisplay] = useUrlFilters({ sort: 'recommended', view: 'grid' });
  const drawer = useDisclosure();

  const filtered = useMemo(() => sortPrograms(programs.filter((p) => matchesFilters(p, filters)), display.sort), [filters, display.sort]);
  const pagination = usePagination(filtered, PAGE_SIZE);
  const { setPage } = pagination;

  const update = (key: FinderKey, value: string) => {
    setFilter(key, value);
    setPage(1);
  };
  const reset = () => {
    resetFilters();
    setPage(1);
  };

  const levelChips = useMemo(() => {
    const base = programs.filter((p) => matchesFilters(p, filters, 'level'));
    return [
      { value: 'all', label: 'All programs', count: base.length },
      ...degreeLevels.map((l) => ({ value: l, label: degreeLevelLabels[l], count: base.filter((p) => p.level === l).length })),
    ];
  }, [filters]);

  const activeChips = (Object.keys(finderDefaults) as FinderKey[])
    .filter((k) => filters[k] !== finderDefaults[k])
    .map((k) => ({ key: k, label: `${filterKeyLabel[k]}: ${filterValueLabel(k, filters[k])}` }));

  const isList = display.view === 'list';

  return (
    <>
      <Seo
        title="Programs & Course Finder"
        description="Explore undergraduate, postgraduate, doctoral, diploma and certificate programs. Filter by discipline, duration, eligibility and study mode."
      />
      <PageHero
        eyebrow="Academics"
        title="Find the program that fits your future"
        description="Search and compare undergraduate, postgraduate, doctoral, diploma and certificate programs across every discipline we teach — then dive into curriculum, fees and admissions in one place."
        image={images.lecture}
        actions={
          <>
            <ExternalButtonLink href="#finder" variant="gold" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Browse programs
            </ExternalButtonLink>
            <ButtonLink to="/fees" variant="outline-light" size="lg" icon={<Calculator className="h-4 w-4" aria-hidden />}>
              Compare fees
            </ButtonLink>
          </>
        }
      >
        <ul className="flex flex-wrap gap-2" aria-label="Catalogue at a glance">
          <li>
            <Badge tone="white">{pluralize(programs.length, 'program')}</Badge>
          </li>
          <li>
            <Badge tone="white">{degreeLevels.length} degree levels</Badge>
          </li>
          <li>
            <Badge tone="white">{disciplineOptions.length} disciplines</Badge>
          </li>
        </ul>
      </PageHero>

      <Section id="finder" tone="alt" labelledBy="finder-heading" className="scroll-mt-4">
        <SectionHeading
          id="finder-heading"
          eyebrow="Course finder"
          title="Explore programs"
          description="Filter by level, discipline, duration, eligibility and study mode. Your selections are saved in the address bar, so you can bookmark or share a filtered view."
        />
        <DemoNotice title="Sample program catalogue" className="mb-8">
          The programs listed here are configurable samples. Program availability, intake, curriculum and fees must be confirmed by the institution before publication.
        </DemoNotice>

        <FilterChips label="Filter by degree level" value={filters.level} onChange={(v) => update('level', v)} options={levelChips} className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block" aria-labelledby="filters-heading">
            <div className="card sticky top-24 p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 id="filters-heading" className="inline-flex items-center gap-2 text-base font-bold">
                  <SlidersHorizontal className="h-4 w-4 text-royal-600" aria-hidden />
                  Refine results
                </h3>
                {activeCount > 0 && (
                  <button type="button" onClick={reset} className="link text-sm">
                    Reset
                  </button>
                )}
              </div>
              <FinderFilterPanel values={filters} onChange={update} showLevel={false} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card">
              <Button variant="secondary" onClick={drawer.open} className="lg:hidden" icon={<SlidersHorizontal className="h-4 w-4" aria-hidden />} aria-haspopup="dialog" aria-expanded={drawer.isOpen}>
                Filters
                {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-royal-700 px-1 text-xs text-white">{activeCount}</span>}
              </Button>
              <div className="hidden flex-1 lg:block">
                <ResultsSummary id="results-summary" start={pagination.start} end={pagination.end} total={pagination.total} noun="programs" onReset={reset} activeFilters={activeCount} />
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <FilterSelect label="Sort by" value={display.sort} onChange={(v) => setDisplay('sort', v)} options={sortOptions.map((o) => ({ value: o.value, label: o.label }))} className="w-56 max-w-full" />
                <div role="radiogroup" aria-label="Result layout" className="flex rounded-full border border-navy-100 bg-surface-alt p-1">
                  {(
                    [
                      { value: 'grid', label: 'Grid view', Icon: LayoutGrid },
                      { value: 'list', label: 'List view', Icon: List },
                    ] as const
                  ).map(({ value, label, Icon }) => {
                    const checked = display.view === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        aria-label={label}
                        title={label}
                        onClick={() => setDisplay('view', value)}
                        className={cn('grid h-9 w-9 place-items-center rounded-full transition', checked ? 'bg-navy-900 text-white shadow-card' : 'text-navy-700 hover:bg-white')}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 lg:hidden">
              <ResultsSummary start={pagination.start} end={pagination.end} total={pagination.total} noun="programs" onReset={reset} activeFilters={activeCount} />
            </div>

            {activeChips.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
                {activeChips.map((chip) => (
                  <li key={chip.key}>
                    <button
                      type="button"
                      onClick={() => update(chip.key, finderDefaults[chip.key])}
                      className="inline-flex items-center gap-1.5 rounded-full border border-royal-200 bg-royal-50 py-1.5 pl-3 pr-2 text-xs font-semibold text-royal-800 transition hover:border-royal-400 hover:bg-royal-100"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      {chip.label}
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={reset} className="link px-2 py-1.5 text-xs">
                    Clear all
                  </button>
                </li>
              </ul>
            )}

            <div className="mt-6">
              {pagination.total === 0 ? (
                <EmptyState
                  title="No programs match these filters"
                  description="Try removing a filter or searching for a broader term such as “engineering” or “management”."
                  action={
                    <Button onClick={reset} variant="primary">
                      Reset all filters
                    </Button>
                  }
                />
              ) : (
                <ul className={cn(isList ? 'space-y-4' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3')}>
                  {pagination.pageItems.map((program, i) => (
                    <motion.li
                      key={`${display.view}-${program.slug}`}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {isList ? <ProgramListItem program={program} /> : <CourseCard program={program} />}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <Pagination page={pagination.page} pageCount={pagination.pageCount} onPageChange={setPage} scrollTargetId="finder-heading" />
          </div>
        </div>
      </Section>

      {/* Mobile / tablet filter drawer */}
      <Drawer
        open={drawer.isOpen}
        onClose={drawer.close}
        title="Filter programs"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={reset} className="flex-1" disabled={activeCount === 0}>
              Reset
            </Button>
            <Button variant="primary" onClick={drawer.close} className="flex-[2]">
              Show {pluralize(pagination.total, 'result')}
            </Button>
          </div>
        }
      >
        <div className="p-5">
          <FinderFilterPanel values={filters} onChange={update} />
        </div>
      </Drawer>

      {/* Guidance band */}
      <section aria-labelledby="guidance-heading" className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
        <ParallaxImage image={images.groupStudy} strength={16} className="absolute inset-0 -z-20" imgClassName="opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/90 to-royal-950/70" aria-hidden />
        <div className="container">
          <Reveal className="max-w-2xl">
            <p className="eyebrow eyebrow-light">
              <span className="h-px w-6 bg-gold-300" aria-hidden />
              Need help choosing?
            </p>
            <h2 id="guidance-heading" className="mt-3 text-balance text-3xl font-extrabold text-white sm:text-4xl">
              Not sure which program is right for you?
            </h2>
            <p className="mt-4 text-lg text-navy-100">Our counsellors can walk you through eligibility, career pathways and fees — or explore at your own pace.</p>
          </Reveal>
          <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { to: '/admissions/apply', icon: MessageCircleQuestion, title: 'Talk to a counsellor', text: 'Send an enquiry and get a call back within two working days.' },
              { to: '/fees', icon: Calculator, title: 'Compare fees', text: 'Year-wise fee schedules and scholarships for every program.' },
              { to: '/departments', icon: Building2, title: 'Meet the departments', text: 'Labs, faculty and research behind each program.' },
            ].map((item) => (
              <StaggerItem as="li" key={item.to}>
                <Link to={item.to} className="glass group flex h-full flex-col rounded-2xl p-6 transition hover:-translate-y-1 hover:bg-white/15">
                  <item.icon className="h-6 w-6 text-gold-300" aria-hidden />
                  <span className="mt-4 font-display text-lg font-bold text-white">{item.title}</span>
                  <span className="mt-1.5 text-sm text-navy-100">{item.text}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-gold-200">
                    Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-navy-200">
            <BookOpenCheck className="h-4 w-4 text-gold-300" aria-hidden />
            Ready to apply? Check eligibility and documents on the{' '}
            <Link to="/admissions" className="font-semibold text-white underline-offset-4 hover:underline">
              Admissions page
            </Link>
            .
          </p>
        </div>
      </section>

      <EnquiryCTA />
    </>
  );
}
