import {
  Accessibility,
  ArrowRight,
  BookMarked,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Clock,
  FileCheck2,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Laptop,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareWarning,
  MonitorSmartphone,
  PartyPopper,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { IntegrationCard } from '@/components/student/IntegrationCard';
import { NewsCard } from '@/components/cards/NewsCard';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { FilterChips } from '@/components/ui/Filters';
import { Section, SectionHeading } from '@/components/ui/Section';
import { siteConfig } from '@/config/site';
import { images } from '@/data/images';
import { officialNotices } from '@/data/news';
import {
  academicCalendar,
  academicYear,
  antiRaggingDownloads,
  antiRaggingSquad,
  calendarDownload,
  clubCategories,
  clubs,
  counselling,
  equalOpportunity,
  examDownloads,
  handbook,
  studyResources,
  timetableDownloads,
  welfareServices,
  type AcademicTerm,
} from '@/data/studentCorner';
import { cn } from '@/utils/cn';
import { formatDate, formatLongDate } from '@/utils/format';

const tiles: { id: string; label: string; icon: ReactNode }[] = [
  { id: 'calendar', label: 'Academic calendar', icon: <CalendarDays className="h-5 w-5" aria-hidden /> },
  { id: 'exams', label: 'Exam schedules', icon: <ClipboardList className="h-5 w-5" aria-hidden /> },
  { id: 'results', label: 'Results', icon: <FileCheck2 className="h-5 w-5" aria-hidden /> },
  { id: 'timetables', label: 'Timetables', icon: <Clock className="h-5 w-5" aria-hidden /> },
  { id: 'syllabus', label: 'Syllabus & resources', icon: <BookOpen className="h-5 w-5" aria-hidden /> },
  { id: 'notices', label: 'Notices & circulars', icon: <Megaphone className="h-5 w-5" aria-hidden /> },
  { id: 'handbook', label: 'Student handbook', icon: <BookMarked className="h-5 w-5" aria-hidden /> },
  { id: 'scholarships', label: 'Scholarships', icon: <HandCoins className="h-5 w-5" aria-hidden /> },
  { id: 'internships', label: 'Internships', icon: <BriefcaseBusiness className="h-5 w-5" aria-hidden /> },
  { id: 'clubs', label: 'Clubs & activities', icon: <PartyPopper className="h-5 w-5" aria-hidden /> },
  { id: 'counselling', label: 'Counselling & welfare', icon: <HeartHandshake className="h-5 w-5" aria-hidden /> },
  { id: 'grievance', label: 'Grievance redressal', icon: <MessageSquareWarning className="h-5 w-5" aria-hidden /> },
  { id: 'anti-ragging', label: 'Anti-ragging', icon: <ShieldAlert className="h-5 w-5" aria-hidden /> },
  { id: 'accessibility', label: 'Equal opportunity', icon: <Accessibility className="h-5 w-5" aria-hidden /> },
  { id: 'portals', label: 'ERP & LMS', icon: <MonitorSmartphone className="h-5 w-5" aria-hidden /> },
];

const kindTone = { Teaching: 'royal', Examinations: 'red', Break: 'green', Induction: 'gold' } as const;

const dayStart = (iso: string) => new Date(`${iso}T00:00:00`).getTime();
const dayEnd = (iso: string) => new Date(`${iso}T23:59:59`).getTime();
const tel = (phone: string) => `tel:${phone.replace(/[\s-]/g, '')}`;

function useTermStatus(terms: AcademicTerm[]) {
  return useMemo(() => {
    const now = Date.now();
    const current = terms.filter((t) => dayStart(t.start) <= now && now <= dayEnd(t.end));
    const next = terms.find((t) => dayStart(t.start) > now);
    // Main term to feature: prefer a teaching/exam period over overlapping induction weeks
    const featured = current.find((t) => t.kind !== 'Induction') ?? current[0];
    const progress = featured ? Math.min(100, Math.max(0, Math.round(((now - dayStart(featured.start)) / (dayEnd(featured.end) - dayStart(featured.start))) * 100))) : 0;
    const daysLeft = featured ? Math.ceil((dayEnd(featured.end) - now) / 86_400_000) : 0;
    return { currentIds: new Set(current.map((t) => t.id)), featured, next, progress, daysLeft };
  }, [terms]);
}

function BlockHeading({ id, icon, children }: { id: string; icon: ReactNode; children: ReactNode }) {
  return (
    <h3 id={id} className="flex items-center gap-3 text-xl font-bold">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-300">{icon}</span>
      {children}
    </h3>
  );
}

export default function StudentCornerPage() {
  const { currentIds, featured, next, progress, daysLeft } = useTermStatus(academicCalendar);
  const [clubFilter, setClubFilter] = useState('all');
  const shownClubs = clubFilter === 'all' ? clubs : clubs.filter((c) => c.category === clubFilter);
  const latestNotices = officialNotices.slice(0, 5);
  const examNotices = officialNotices.filter((p) => p.category === 'Examination Notice').slice(0, 3);

  return (
    <>
      <Seo
        title="Student Corner"
        description="Academic calendar, exam schedules, results, timetables, notices, handbook, clubs, counselling, grievance redressal and anti-ragging help for Bapuji College students."
      />
      <PageHero
        eyebrow="Student Corner"
        title="Everything you need for campus life, in one place"
        description="Calendars, exams, notices, support services and student activities — organised so you can find what you need in a couple of clicks."
        image={images.studentsOutdoor}
        actions={
          <>
            <ButtonLink to="#notices" variant="gold" icon={<Megaphone className="h-4 w-4" aria-hidden />}>
              Latest notices
            </ButtonLink>
            <ButtonLink to="#anti-ragging" variant="outline-light" icon={<ShieldAlert className="h-4 w-4" aria-hidden />}>
              Anti-ragging help
            </ButtonLink>
          </>
        }
      />

      {/* Quick access */}
      <Section tone="alt" size="sm" labelledBy="quick-access-heading">
        <h2 id="quick-access-heading" className="sr-only">
          Quick access
        </h2>
        <Stagger as="ul" stagger={0.03} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map((t) => (
            <StaggerItem as="li" key={t.id}>
              <a
                href={`#${t.id}`}
                className={cn(
                  'group flex h-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-sm font-semibold shadow-card transition hover:-translate-y-0.5 hover:shadow-lift sm:p-4',
                  t.id === 'anti-ragging' ? 'border-red-200 text-red-800 hover:border-red-300' : 'border-navy-100 text-navy-900 hover:border-royal-200 hover:text-royal-800',
                )}
              >
                <span
                  className={cn(
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors',
                    t.id === 'anti-ragging' ? 'bg-red-50 text-red-700 group-hover:bg-red-600 group-hover:text-white' : 'bg-royal-50 text-royal-700 group-hover:bg-royal-700 group-hover:text-white',
                  )}
                >
                  {t.icon}
                </span>
                <span className="leading-snug">{t.label}</span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-6">
          <p role="note" className="flex flex-col gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden />
              <span>
                <strong>Ragging is a criminal offence and is strictly prohibited.</strong> National Anti-Ragging Helpline (24×7, toll-free):
              </span>
            </span>
            <a href={tel(siteConfig.contacts.antiRaggingHelpline)} className="shrink-0 font-display text-lg font-extrabold text-red-800 underline-offset-4 hover:underline">
              {siteConfig.contacts.antiRaggingHelpline}
            </a>
          </p>
        </Reveal>
      </Section>

      {/* Academic calendar */}
      <Section id="calendar" labelledBy="calendar-heading">
        <SectionHeading
          id="calendar-heading"
          eyebrow={`Academic year ${academicYear}`}
          title="Academic calendar"
          description="Key term dates for all UG and PG programs. Department-specific dates are announced through official notices."
          action={<DemoBadge label="Dates to be confirmed" />}
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <Reveal className="space-y-5">
            <div className="on-dark relative overflow-hidden rounded-3xl bg-navy-radial p-6 text-white shadow-lift sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">Today</p>
              <p className="mt-1 text-lg font-semibold">{formatLongDate(new Date())}</p>
              {featured ? (
                <>
                  <p className="mt-6 text-sm text-navy-100">Current period</p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-white">{featured.label}</p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${featured.label} progress`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-navy-100">
                    {progress}% complete · {daysLeft} day{daysLeft === 1 ? '' : 's'} remaining (ends {formatDate(featured.end)})
                  </p>
                </>
              ) : (
                <p className="mt-6 text-navy-100">No term is in session today.</p>
              )}
              {next && (
                <p className="mt-6 border-t border-white/15 pt-4 text-sm text-navy-100">
                  <span className="font-semibold text-white">Up next:</span> {next.label} from {formatDate(next.start)}
                </p>
              )}
            </div>
            <DownloadLink title={calendarDownload.title} url={calendarDownload.url} sizeKb={calendarDownload.sizeKb} showPreview />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-x-auto rounded-xl border border-navy-100 bg-white shadow-card" role="region" aria-label="Academic calendar table (scrollable)" tabIndex={0}>
              <table className="table-base min-w-[560px]">
                <caption className="sr-only">Academic calendar {academicYear}. The current period is highlighted.</caption>
                <thead>
                  <tr>
                    <th scope="col">Period</th>
                    <th scope="col">Starts</th>
                    <th scope="col">Ends</th>
                    <th scope="col">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {academicCalendar.map((t) => {
                    const isCurrent = currentIds.has(t.id);
                    const isPast = dayEnd(t.end) < Date.now();
                    return (
                      <tr key={t.id} aria-current={isCurrent ? 'true' : undefined} className={cn(isCurrent && 'bg-gold-50 hover:bg-gold-50', isPast && 'text-ink-muted')}>
                        <th scope="row" className={cn('border-b border-navy-100 px-4 py-3 text-left font-semibold', isCurrent ? 'border-l-4 border-l-gold-400 text-navy-950' : isPast ? 'text-ink-muted' : 'text-navy-900')}>
                          <span className="flex flex-wrap items-center gap-2">
                            {t.label}
                            {isCurrent && <Badge tone="gold">Current</Badge>}
                          </span>
                          {t.note && <span className="mt-0.5 block text-xs font-normal text-ink-muted">{t.note}</span>}
                        </th>
                        <td>
                          <time dateTime={t.start}>{formatDate(t.start)}</time>
                        </td>
                        <td>
                          <time dateTime={t.end}>{formatDate(t.end)}</time>
                        </td>
                        <td>
                          <Badge tone={kindTone[t.kind]}>{t.kind}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Exams & results */}
      <Section tone="alt" labelledBy="exams-results-heading">
        <SectionHeading id="exams-results-heading" eyebrow="Examinations" title="Exam schedules & results" description="Timetables, rules and forms from the Controller of Examinations, and where to find your results." />
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div id="exams" className="scroll-mt-32">
              <BlockHeading id="exams-heading" icon={<ClipboardList className="h-5 w-5" aria-hidden />}>
                Examination schedules
              </BlockHeading>
              <ul className="mt-5 space-y-3">
                {examDownloads.map((d) => (
                  <li key={d.id}>
                    <DownloadLink title={d.title} url={d.url} sizeKb={d.sizeKb} showPreview />
                  </li>
                ))}
              </ul>
              {examNotices.length > 0 && (
                <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Recent examination notices</p>
                  <ul className="mt-3 divide-y divide-navy-100">
                    {examNotices.map((p) => (
                      <li key={p.slug} className="py-3 first:pt-0 last:pb-0">
                        <Link to={`/news/${p.slug}`} className="font-semibold leading-snug text-navy-950 hover:text-royal-700 hover:underline">
                          {p.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          <time dateTime={p.date}>{formatDate(p.date)}</time>
                          {p.referenceNo && <> · Ref. {p.referenceNo}</>}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <ButtonLink to={`/news?type=official&category=${encodeURIComponent('Examination Notice')}`} variant="secondary" className="mt-5" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                All examination notices
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div id="results" className="scroll-mt-32 space-y-5">
              <BlockHeading id="results-heading" icon={<FileCheck2 className="h-5 w-5" aria-hidden />}>
                Results & result portal
              </BlockHeading>
              <IntegrationCard
                title="Results portal"
                url={siteConfig.portals.results}
                icon={<GraduationCap className="h-6 w-6" aria-hidden />}
                actionLabel="Check results on the official portal"
                description="Semester results are published on the official results portal. Log in with your university registration number on that portal only."
                pendingHelp={
                  <>
                    Results are announced through{' '}
                    <Link to={`/news?type=official&category=${encodeURIComponent('Examination Notice')}`} className="link">
                      official examination notices
                    </Link>
                    ; for help, email{' '}
                    <a href={`mailto:${siteConfig.contacts.examinations.email}`} className="link">
                      {siteConfig.contacts.examinations.email}
                    </a>
                    .
                  </>
                }
              />
              <div className="card p-6">
                <h4 className="font-bold">After results are declared</h4>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink-soft">
                  <li>Check your marks and credits carefully on the official portal.</li>
                  <li>Apply for photocopy or revaluation within the notified window.</li>
                  <li>Register for supplementary examinations if required.</li>
                  <li>Collect grade cards from the examination section when notified.</li>
                </ol>
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <a href={tel(siteConfig.contacts.examinations.phone)} className="link inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" aria-hidden />
                    {siteConfig.contacts.examinations.phone}
                  </a>
                  <a href={`mailto:${siteConfig.contacts.examinations.email}`} className="link inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" aria-hidden />
                    {siteConfig.contacts.examinations.email}
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Timetables & syllabus */}
      <Section labelledBy="learning-heading">
        <SectionHeading id="learning-heading" eyebrow="Classes" title="Timetables, syllabus & study resources" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div id="timetables" className="scroll-mt-32">
              <BlockHeading id="timetables-heading" icon={<Clock className="h-5 w-5" aria-hidden />}>
                Timetables
              </BlockHeading>
              <ul className="mt-5 space-y-3">
                {timetableDownloads.map((d) => (
                  <li key={d.id}>
                    <DownloadLink title={d.title} url={d.url} sizeKb={d.sizeKb} showPreview />
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-muted">
                Section-wise timetables are on each{' '}
                <Link to="/departments" className="link">
                  department page
                </Link>{' '}
                under “Resources”.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div id="syllabus" className="scroll-mt-32">
              <BlockHeading id="syllabus-heading" icon={<BookOpen className="h-5 w-5" aria-hidden />}>
                Syllabus & study resources
              </BlockHeading>
              <ul className="mt-5 space-y-3">
                {studyResources.map((r) => (
                  <li key={r.title}>
                    <Link to={r.to} className="group flex items-center gap-4 rounded-xl border border-navy-100 bg-white p-4 transition hover:border-royal-200 hover:shadow-card">
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-navy-950 group-hover:text-royal-800">{r.title}</span>
                        <span className="mt-0.5 block text-sm text-ink-muted">{r.text}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-royal-700 transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Notices & handbook */}
      <Section id="notices" tone="sunken" labelledBy="notices-heading">
        <SectionHeading
          id="notices-heading"
          eyebrow="Official"
          title="Notices & circulars"
          description="The five most recent official notices. Always rely on the official notice (with reference number) over messages forwarded on social media."
          action={
            <ButtonLink to="/news?type=official" variant="primary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              All official notices
            </ButtonLink>
          }
        />
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <Reveal className="card divide-y divide-navy-100 p-2 sm:p-3">
            {latestNotices.map((p) => (
              <NewsCard key={p.slug} post={p} variant="list" />
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <div id="handbook" className="on-dark relative isolate flex h-full scroll-mt-32 flex-col overflow-hidden rounded-3xl bg-navy-950 p-6 text-white shadow-lift sm:p-8">
              <ParallaxImage image={images.library} strength={10} className="absolute inset-0 -z-20" imgClassName="opacity-30" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/85 to-navy-900/50" aria-hidden />
              <BookMarked className="h-8 w-8 text-gold-300" aria-hidden />
              <h3 className="mt-4 text-2xl font-extrabold text-white">Student handbook</h3>
              <p className="mt-2 text-sm text-navy-100">Academic regulations, attendance rules, code of conduct, support services and important contacts — read it once at the start of every year.</p>
              <div className="mt-auto pt-6">
                <ExternalButtonLink href={handbook.url} download variant="gold">
                  Download handbook (PDF, 2.5 MB)
                </ExternalButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Scholarships & internships */}
      <Section labelledBy="opportunities-heading">
        <SectionHeading id="opportunities-heading" eyebrow="Opportunities" title="Scholarships & internships" />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              id: 'scholarships',
              title: 'Scholarships & fee concessions',
              text: 'Merit and need-based institutional scholarships, plus guidance on government scholarship portals.',
              to: '/admissions#scholarships',
              cta: 'View scholarships',
              image: images.groupStudy,
              icon: <HandCoins className="h-5 w-5" aria-hidden />,
            },
            {
              id: 'internships',
              title: 'Internship opportunities',
              text: 'Internships, live projects and training programmes coordinated by the Training & Placement Cell.',
              to: '/placements',
              cta: 'Training & placements',
              image: images.meeting,
              icon: <BriefcaseBusiness className="h-5 w-5" aria-hidden />,
            },
          ].map((o, i) => (
            <Reveal key={o.id} delay={i * 0.08}>
              <article id={o.id} className="card card-hover group relative flex h-full scroll-mt-32 flex-col overflow-hidden sm:flex-row">
                <div className="aspect-[16/9] overflow-hidden sm:aspect-auto sm:w-2/5">
                  <ParallaxImage image={o.image} strength={8} className="h-full min-h-[10rem] w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-50 text-gold-700">{o.icon}</span>
                  <h3 className="mt-3 text-lg font-bold">
                    <Link to={o.to} className="after:absolute after:inset-0 after:content-['']">
                      {o.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{o.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-royal-700" aria-hidden>
                    {o.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Clubs */}
      <Section id="clubs" tone="alt" labelledBy="clubs-heading">
        <SectionHeading
          id="clubs-heading"
          eyebrow="Student life"
          title="Clubs & student activities"
          description="Join a club in your first week — it is the fastest way to find your people. Registrations open during the induction programme and the club fair."
          action={<DemoBadge label="Club list to be confirmed" />}
        />
        <FilterChips
          label="Club category"
          value={clubFilter}
          onChange={setClubFilter}
          options={[{ value: 'all', label: 'All', count: clubs.length }, ...clubCategories.map((c) => ({ value: c, label: c, count: clubs.filter((x) => x.category === c).length }))]}
        />
        <p className="sr-only" aria-live="polite">
          Showing {shownClubs.length} clubs
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shownClubs.map((c) => (
            <li key={c.name} className="card card-hover p-5">
              <Badge tone="navy">{c.category}</Badge>
              <h3 className="mt-3 text-base font-bold">{c.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">{c.description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-muted">
          See what’s coming up on the{' '}
          <Link to="/events" className="link">
            events calendar
          </Link>
          .
        </p>
      </Section>

      {/* Counselling, welfare & grievance */}
      <Section id="counselling" labelledBy="counselling-heading">
        <SectionHeading id="counselling-heading" eyebrow="Wellbeing" title="Counselling & student welfare" description="Asking for help is a sign of strength. Support is free, confidential and available to every student." />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="card overflow-hidden">
            <div className="border-b border-navy-100 bg-gradient-to-br from-royal-50 to-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <HeartHandshake className="h-7 w-7 text-royal-700" aria-hidden />
                <h3 className="text-xl font-bold">{counselling.title}</h3>
                <Badge tone="green">Confidential</Badge>
              </div>
              <p className="mt-3 text-ink-soft">{counselling.description}</p>
            </div>
            <dl className="grid gap-4 p-6 text-sm sm:grid-cols-2 sm:p-8">
              <div>
                <dt className="font-semibold text-navy-900">Where</dt>
                <dd className="mt-0.5 flex items-start gap-1.5 text-ink-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                  {counselling.location}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">When</dt>
                <dd className="mt-0.5 flex items-start gap-1.5 text-ink-muted">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                  {counselling.hours}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Book confidentially</dt>
                <dd className="mt-0.5 space-y-1">
                  <a href={`mailto:${counselling.email}`} className="link flex items-center gap-1.5">
                    <Mail className="h-4 w-4" aria-hidden />
                    {counselling.email}
                  </a>
                  <a href={tel(counselling.phone)} className="link flex items-center gap-1.5">
                    <Phone className="h-4 w-4" aria-hidden />
                    {counselling.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-navy-900">Status</dt>
                <dd className="mt-1">
                  <DemoBadge label="Contact to be verified" />
                </dd>
              </div>
            </dl>
            <p role="note" className="mx-6 mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-900 sm:mx-8 sm:mb-8">
              {counselling.emergencyNote}
            </p>
          </Reveal>
          <div className="space-y-6">
            <Stagger as="ul" className="grid gap-3">
              {welfareServices.map((w) => (
                <StaggerItem as="li" key={w.title} className="rounded-2xl border border-navy-100 bg-white p-4">
                  <h3 className="text-base font-bold">{w.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-muted">{w.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal>
              <div id="grievance" className="scroll-mt-32 rounded-2xl border border-gold-200 bg-gold-50/60 p-5">
                <div className="flex items-center gap-2">
                  <MessageSquareWarning className="h-5 w-5 text-gold-700" aria-hidden />
                  <h3 className="text-base font-bold">Grievance redressal</h3>
                </div>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Raise academic, administrative or welfare concerns with the Student Grievance Redressal Committee. Grievances are acknowledged and tracked to closure.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ButtonLink to="/feedback" size="sm" variant="primary">
                    Submit a grievance
                  </ButtonLink>
                  <a href={`mailto:${siteConfig.contacts.grievance.email}`} className="btn btn-sm btn-secondary">
                    <Mail className="h-4 w-4" aria-hidden />
                    Email the cell
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Anti-ragging — deliberately prominent */}
      <section id="anti-ragging" aria-labelledby="anti-ragging-heading" className="on-dark relative isolate overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-red-950 via-navy-950 to-navy-950" aria-hidden />
        <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-red-600/30 blur-3xl" aria-hidden />
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <p className="eyebrow eyebrow-light">
                <span className="h-px w-6 bg-gold-300" aria-hidden />
                Zero tolerance
              </p>
              <h2 id="anti-ragging-heading" className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Anti-ragging: help is one call away
              </h2>
              <p className="mt-4 max-w-xl text-navy-100">
                Ragging in any form — physical, verbal, online or psychological — is a punishable offence. If you experience or witness ragging, report it. Complaints are handled confidentially and promptly.
              </p>
              <div className="mt-8 rounded-3xl border border-red-300/40 bg-red-600/15 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-red-200">National Anti-Ragging Helpline · 24×7 · toll-free</p>
                <a href={tel(siteConfig.contacts.antiRaggingHelpline)} className="mt-2 block font-display text-4xl font-extrabold tracking-tight text-white hover:text-gold-300 sm:text-5xl">
                  {siteConfig.contacts.antiRaggingHelpline}
                </a>
                <p className="mt-3 text-sm text-navy-100">
                  College grievance line:{' '}
                  <a href={tel(siteConfig.contacts.grievance.phone)} className="font-semibold text-white underline-offset-4 hover:underline">
                    {siteConfig.contacts.grievance.phone}
                  </a>{' '}
                  ·{' '}
                  <a href={`mailto:${siteConfig.contacts.grievance.email}`} className="font-semibold text-white underline-offset-4 hover:underline">
                    {siteConfig.contacts.grievance.email}
                  </a>
                </p>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {antiRaggingDownloads.map((d) => (
                  <li key={d.id}>
                    <DownloadLink title={d.title} url={d.url} sizeKb={d.sizeKb} showPreview className="h-full" />
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-navy-200">Every student and parent must submit the anti-ragging undertaking at admission, as required by the applicable regulations.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="glass rounded-3xl p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-white">Anti-Ragging Squad</h3>
                  <DemoBadge light label="Names to be configured" />
                </div>
                <ul className="mt-5 divide-y divide-white/10">
                  {antiRaggingSquad.map((m) => (
                    <li key={m.role} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-white">{m.role}</p>
                        <p className="text-sm text-navy-200">{m.name}</p>
                      </div>
                      <a href={tel(m.phone)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:underline">
                        <Phone className="h-4 w-4" aria-hidden />
                        {m.phone}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink to="/feedback" variant="gold" size="sm">
                    Report confidentially
                  </ButtonLink>
                  <ButtonLink to="/disclosures?category=Committees" variant="outline-light" size="sm">
                    Committee details
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Equal opportunity */}
      <Section id="accessibility" tone="alt" labelledBy="accessibility-heading">
        <SectionHeading
          id="accessibility-heading"
          eyebrow="Inclusion"
          title="Equal opportunity & accessibility support"
          description="Every student deserves a fair chance to learn and take part. Tell us what you need — early requests help us arrange support before examinations."
        />
        <Stagger as="ul" className="grid gap-5 md:grid-cols-3">
          {equalOpportunity.map((e) => (
            <StaggerItem as="li" key={e.title} className="card card-hover p-6">
              <Accessibility className="h-7 w-7 text-royal-700" aria-hidden />
              <h3 className="mt-3 text-lg font-bold">{e.title}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{e.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 text-sm text-ink-muted">
          Read our{' '}
          <Link to="/accessibility" className="link">
            website accessibility statement
          </Link>{' '}
          or contact the Equal Opportunity Cell through the{' '}
          <Link to="/feedback" className="link">
            grievance &amp; feedback page
          </Link>
          .
        </p>
      </Section>

      {/* Portals */}
      <Section id="portals" labelledBy="portals-heading">
        <SectionHeading id="portals-heading" eyebrow="Online systems" title="ERP & learning management system" description="Attendance, fee receipts, course material and assignments live in the college’s student systems." />
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <IntegrationCard
              title="Student ERP"
              url={siteConfig.portals.erp}
              icon={<MonitorSmartphone className="h-6 w-6" aria-hidden />}
              description="Attendance, internal marks, fee payments and receipts, hall tickets and profile updates."
              pendingHelp={
                <>
                  For attendance or fee records, contact your department office or{' '}
                  <a href={`mailto:${siteConfig.contacts.accounts.email}`} className="link">
                    {siteConfig.contacts.accounts.email}
                  </a>
                  .
                </>
              }
            />
          </Reveal>
          <Reveal delay={0.08}>
            <IntegrationCard
              title="Learning management system"
              url={siteConfig.portals.lms}
              icon={<Laptop className="h-6 w-6" aria-hidden />}
              description="Course material, lecture recordings, assignments, quizzes and announcements from your teachers."
              pendingHelp="Your course teachers will share course material and assignment links directly in the meantime."
            />
          </Reveal>
        </div>
        <DemoNotice className="mt-8" title="About these portals">
          Portal links appear automatically once the college configures them. Never enter your student credentials on a page that is not the official portal.
        </DemoNotice>
      </Section>
    </>
  );
}
