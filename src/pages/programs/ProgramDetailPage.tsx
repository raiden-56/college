import { ArrowRight, Award, BookOpen, Briefcase, Building2, CalendarDays, CheckCircle2, Clock, Download, GraduationCap, Layers, MonitorSmartphone, Phone, Target, Users } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Program } from '@/types';
import NotFoundPage from '@/pages/NotFoundPage';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { Tabs } from '@/components/ui/Tabs';
import { Accordion } from '@/components/ui/Accordion';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { CourseCard } from '@/components/cards/CourseCard';
import { FacultyCard } from '@/components/cards/FacultyCard';
import { AdmissionEnquiryForm } from '@/components/forms/AdmissionEnquiryForm';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { InPageNav } from '@/components/programs/InPageNav';
import { FeeBreakdownTable, FeeSummaryCards, YearScheduleTable } from '@/components/fees/FeeTables';
import { FeeYearSelector } from '@/components/fees/FeeYearSelector';
import { defaultFeeYear, feeKindMeta, feeKindOrder } from '@/components/fees/feeMeta';
import { getProgram, programs, degreeLevelLabels } from '@/data/programs';
import { getDepartment } from '@/data/departments';
import { facultyByDepartment } from '@/data/faculty';
import { admissionCycle, importantDates } from '@/data/admissions';
import { siteConfig } from '@/config/site';
import { computeFeeTotals, feesForYear, type FeeYearId } from '@/utils/fees';
import { formatDate, formatDuration, formatINR } from '@/utils/format';
import { courseLd, faqLd } from '@/utils/structuredData';
import { cn } from '@/utils/cn';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'outcomes', label: 'Outcomes' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'duration', label: 'Duration & intake' },
  { id: 'admission', label: 'Admission' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'fees', label: 'Fees' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'careers', label: 'Careers' },
  { id: 'placements', label: 'Placements' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'brochure', label: 'Brochure' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'apply', label: 'Apply' },
];

export default function ProgramDetailPage() {
  const { slug = '' } = useParams();
  const program = getProgram(slug);
  if (!program) return <NotFoundPage />;
  return <ProgramDetail key={program.slug} program={program} />;
}

function Block({ id, eyebrow, title, children, action }: { id: string; eyebrow: string; title: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-16 border-b border-navy-100 py-12 first:pt-0 last:border-b-0 last:pb-0">
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            <span className="h-px w-6 bg-royal-600" aria-hidden />
            {eyebrow}
          </p>
          <h2 id={`${id}-heading`} className="mt-2 text-balance text-2xl font-extrabold sm:text-3xl">
            {title}
          </h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ProgramDetail({ program }: { program: Program }) {
  const dept = getDepartment(program.departmentSlug);
  const [semester, setSemester] = useState(String(program.syllabus[0]?.semester ?? 1));
  const [feeYear, setFeeYear] = useState<FeeYearId>(defaultFeeYear);

  const fees = feesForYear(program.fees, feeYear);
  const totals = computeFeeTotals(fees, program.durationYears);
  const facultyList = facultyByDepartment(program.departmentSlug).slice(0, 3);
  const classesBegin = importantDates.find((d) => d.label.toLowerCase().includes('classes'));
  const applyHref = `/admissions/apply?program=${program.slug}`;
  const phone = siteConfig.contacts.admissions.phone;

  const related = [
    ...programs.filter((p) => p.slug !== program.slug && p.departmentSlug === program.departmentSlug),
    ...programs.filter((p) => p.slug !== program.slug && p.departmentSlug !== program.departmentSlug && p.discipline === program.discipline),
    ...programs.filter((p) => p.slug !== program.slug && p.discipline !== program.discipline && p.level === program.level),
  ].slice(0, 3);

  const facts = [
    { icon: GraduationCap, label: 'Level', value: degreeLevelLabels[program.level] },
    { icon: Clock, label: 'Duration', value: `${formatDuration(program.durationYears)} · ${program.semesters} ${program.semesters === 1 ? 'semester' : 'semesters'}` },
    {
      icon: Users,
      label: 'Intake',
      value: (
        <>
          {program.intake} seats <DemoBadge light label="Sample" className="ml-1" />
        </>
      ),
    },
    { icon: MonitorSmartphone, label: 'Study mode', value: program.modes.join(' / ') },
    {
      icon: Building2,
      label: 'Department',
      value: dept ? (
        <Link to={`/departments/${dept.slug}`} className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-gold-300">
          {dept.shortName}
        </Link>
      ) : (
        '—'
      ),
    },
  ];

  return (
    <>
      <Seo title={program.name} description={program.summary} image={program.image.src} jsonLd={[courseLd(program), faqLd(program.faqs)]} />
      <PageHero
        eyebrow={`${degreeLevelLabels[program.level]} program`}
        title={program.name}
        crumbLabel={program.shortName}
        description={program.summary}
        image={program.image}
        actions={
          <>
            <ButtonLink to={applyHref} variant="gold" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Apply Now
            </ButtonLink>
            <ExternalButtonLink href={program.brochureUrl} download variant="outline-light" size="lg" icon={<Download className="h-4 w-4" aria-hidden />}>
              Download brochure
            </ExternalButtonLink>
          </>
        }
        aside={
          <div className="glass w-full rounded-2xl p-6 lg:w-80">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">Key facts</p>
            <dl className="mt-4 space-y-3.5">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wide text-navy-200">{f.label}</dt>
                    <dd className="text-sm font-semibold text-white">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="white">{program.eligibilityTag}</Badge>
          <Badge tone="white">Admissions {admissionCycle}</Badge>
        </div>
      </PageHero>

      <InPageNav
        items={navItems}
        label="Program sections"
        action={
          <ButtonLink to={applyHref} variant="primary" size="sm">
            Apply Now
          </ButtonLink>
        }
      />

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-16">
          <div className="min-w-0">
            <Block id="overview" eyebrow="Overview" title="About the program">
              <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_15rem]">
                <div className="prose-college">
                  <p className="text-lg font-medium text-navy-900">{program.summary}</p>
                  <p>{program.overview}</p>
                </div>
                <ParallaxImage image={program.image} strength={10} className="h-56 rounded-2xl shadow-card md:h-full md:min-h-[14rem]" />
              </div>
            </Block>

            <Block id="outcomes" eyebrow="What you will gain" title="Objectives & learning outcomes">
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  { title: 'Program objectives', icon: Target, items: program.objectives },
                  { title: 'Learning outcomes', icon: CheckCircle2, items: program.outcomes },
                ].map((group, gi) => (
                  <Reveal key={group.title} delay={gi * 0.08} className="h-full">
                    <div className="card card-hover h-full p-6">
                      <h3 className="flex items-center gap-2.5 text-lg font-bold">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-royal-50 text-royal-700">
                          <group.icon className="h-5 w-5" aria-hidden />
                        </span>
                        {group.title}
                      </h3>
                      <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                        {group.items.map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Block>

            <Block id="eligibility" eyebrow="Who can apply" title="Eligibility">
              <div className="rounded-2xl border border-royal-100 bg-gradient-to-br from-royal-50 to-white p-6 sm:p-8">
                <Badge tone="royal" icon={<GraduationCap className="h-3.5 w-3.5" aria-hidden />}>
                  {program.eligibilityTag}
                </Badge>
                <p className="mt-4 text-base leading-relaxed text-ink-soft">{program.eligibility}</p>
                <p className="mt-4 text-sm text-ink-muted">
                  Final eligibility, reservations and relaxations follow the affiliating university and regulator norms for the {admissionCycle} cycle.{' '}
                  <Link to="/admissions#eligibility" className="link">
                    See admission criteria
                  </Link>
                </p>
              </div>
            </Block>

            <Block id="duration" eyebrow="Program structure" title="Duration & intake">
              <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: Clock, label: 'Duration', value: formatDuration(program.durationYears) },
                  { icon: Layers, label: 'Semesters', value: String(program.semesters) },
                  { icon: Users, label: 'Annual intake', value: `${program.intake} seats`, demo: true },
                  { icon: MonitorSmartphone, label: 'Study mode', value: program.modes.join(' / ') },
                ].map((s) => (
                  <StaggerItem as="li" key={s.label}>
                    <div className="card card-hover h-full p-5">
                      <s.icon className="h-5 w-5 text-royal-600" aria-hidden />
                      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-muted">{s.label}</p>
                      <p className="mt-1 font-display text-xl font-extrabold text-navy-950">{s.value}</p>
                      {s.demo && <DemoBadge label="Sample" className="mt-2" />}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
              {classesBegin && (
                <p className="mt-5 inline-flex items-center gap-2 text-sm text-ink-muted">
                  <CalendarDays className="h-4 w-4 text-royal-600" aria-hidden />
                  {admissionCycle} intake: classes commence on <strong className="text-navy-900">{formatDate(classesBegin.date)}</strong> (illustrative).
                </p>
              )}
            </Block>

            <Block id="admission" eyebrow="How to join" title="Admission procedure">
              <ol className="relative space-y-5 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-navy-100">
                {program.admissionProcedure.map((step, i) => (
                  <Reveal as="li" key={step} delay={i * 0.06} className="relative flex gap-4">
                    <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-900 font-display text-sm font-extrabold text-white shadow-card">{i + 1}</span>
                    <p className="pt-2 text-ink-soft">{step}</p>
                  </Reveal>
                ))}
              </ol>
              <p className="mt-6 text-sm">
                <Link to="/admissions#process" className="link">
                  Read the full admissions process
                </Link>
              </p>
            </Block>

            <Block id="curriculum" eyebrow="What you will study" title="Curriculum & semester-wise syllabus">
              <Tabs
                label="Syllabus by semester"
                variant="underline"
                value={semester}
                onChange={setSemester}
                panelClassName="mt-6"
                tabs={program.syllabus.map((s) => ({
                  id: String(s.semester),
                  label: program.syllabus.length > 4 ? `Sem ${s.semester}` : `Semester ${s.semester}`,
                  content: (
                    <div>
                      <h3 className="sr-only">Semester {s.semester} subjects</h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {s.subjects.map((subject, i) => (
                          <li key={subject} className="flex items-center gap-3 rounded-xl border border-navy-100 bg-surface-alt p-4 transition hover:border-royal-200 hover:bg-white hover:shadow-card">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-royal-700 shadow-sm">{String(i + 1).padStart(2, '0')}</span>
                            <span className="text-sm font-semibold text-navy-900">{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ),
                }))}
              />
              <p className="mt-5 flex gap-2 text-sm text-ink-muted">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                Indicative scheme. The affiliating university’s current regulation and syllabus prevail; electives depend on demand and faculty availability.
              </p>
            </Block>

            <Block
              id="fees"
              eyebrow="Investment"
              title="Fee structure"
              action={
                <ButtonLink to={`/fees?program=${program.slug}${feeYear === defaultFeeYear ? '' : `&year=${feeYear}`}`} variant="secondary" size="sm" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  Full fee details
                </ButtonLink>
              }
            >
              <DemoNotice title="Illustrative until approved" className="mb-6">
                All fees shown are sample figures for demonstration. Official fees are published only after approval by the competent authority.
              </DemoNotice>
              <FeeYearSelector value={feeYear} onChange={setFeeYear} className="mb-6" />
              <FeeSummaryCards fees={fees} durationYears={program.durationYears} />
              <ul className="mt-6 grid gap-2 text-xs text-ink-muted sm:grid-cols-2" aria-label="Fee categories explained">
                {feeKindOrder.map((k) => (
                  <li key={k} className="flex items-start gap-2">
                    <Badge tone={feeKindMeta[k].tone} className="shrink-0">
                      {feeKindMeta[k].label}
                    </Badge>
                    <span className="pt-1">{feeKindMeta[k].description}</span>
                  </li>
                ))}
              </ul>
              <FeeBreakdownTable className="mt-8" fees={fees} durationYears={program.durationYears} caption={`${program.shortName} — fee components, ${feeYear.replace('-', '–')}`} />
              <h3 className="mt-10 text-lg font-bold">Year-wise payment schedule</h3>
              <YearScheduleTable className="mt-4" fees={fees} durationYears={program.durationYears} caption={`${program.shortName} — year-wise payable amounts`} />
            </Block>

            <Block id="faculty" eyebrow="Who will teach you" title="Faculty & department">
              {dept && (
                <Reveal className="card mb-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{dept.name}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{dept.tagline}</p>
                  </div>
                  <ButtonLink to={`/departments/${dept.slug}`} variant="secondary" size="sm" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                    Visit department
                  </ButtonLink>
                </Reveal>
              )}
              {facultyList.length > 0 ? (
                <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {facultyList.map((f) => (
                    <StaggerItem as="li" key={f.slug}>
                      <FacultyCard faculty={f} compact />
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : (
                <p className="text-ink-muted">Faculty profiles for this program will be published soon.</p>
              )}
              <p className="mt-6 text-sm">
                <Link to="/faculty" className="link">
                  Browse the full faculty directory
                </Link>
              </p>
            </Block>

            <Block id="careers" eyebrow="Where it leads" title="Career opportunities">
              <Stagger as="ul" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {program.careers.map((c) => (
                  <StaggerItem as="li" key={c}>
                    <div className="group flex h-full items-center gap-3 rounded-xl border border-navy-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-royal-200 hover:shadow-card">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-50 text-gold-700 transition group-hover:bg-gold-400 group-hover:text-navy-950">
                        <Briefcase className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="text-sm font-semibold text-navy-900">{c}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Block>

            <Block id="placements" eyebrow="Industry readiness" title="Internships & placements">
              <div className="relative overflow-hidden rounded-2xl bg-navy-radial p-6 text-white sm:p-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-royal-500/30 blur-3xl" aria-hidden />
                <p className="relative max-w-2xl leading-relaxed text-navy-100">{program.placementInfo}</p>
                <ul className="relative mt-5 grid gap-2 text-sm text-navy-100 sm:grid-cols-2">
                  {['Mandatory internship / field project', 'Aptitude & soft-skills training', 'Resume reviews and mock interviews', 'Campus recruitment drives'].map((t) => (
                    <li key={t} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-6">
                  <ButtonLink to="/placements" variant="gold" size="sm" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                    View placement outcomes
                  </ButtonLink>
                </div>
              </div>
            </Block>

            <Block id="scholarships" eyebrow="Financial support" title="Scholarships">
              <ul className="space-y-3">
                {program.scholarships.map((s) => (
                  <li key={s} className="flex gap-3 rounded-xl border border-navy-100 bg-white p-4">
                    <Award className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden />
                    <span className="text-ink-soft">{s}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-ink-muted">
                Eligibility and amounts are subject to institutional policy and scheme rules.{' '}
                <Link to="/admissions#scholarships" className="link">
                  Explore all scholarships
                </Link>
              </p>
            </Block>

            <Block id="brochure" eyebrow="Take it with you" title="Downloads">
              <div className="grid gap-3">
                <DownloadLink title={`${program.shortName} — program brochure`} url={program.brochureUrl} fileType="PDF" meta={`Admissions ${admissionCycle}`} showPreview />
                {dept?.resources[0] && <DownloadLink title={`${dept.shortName} — ${dept.resources[0].title}`} url={dept.resources[0].url} sizeKb={dept.resources[0].sizeKb} fileType={dept.resources[0].fileType} showPreview />}
              </div>
            </Block>

            <Block id="faqs" eyebrow="Questions" title="Program FAQs">
              <Accordion items={program.faqs.map((f, i) => ({ id: String(i), title: f.question, content: <p className="leading-relaxed">{f.answer}</p> }))} defaultOpen={['0']} headingLevel="h3" />
            </Block>
          </div>

          {/* Sticky apply card (desktop) */}
          <aside className="hidden lg:block" aria-label="Apply for this program">
            <div className="sticky top-[8.5rem] space-y-4">
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-br from-navy-900 to-royal-800 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">Admissions {admissionCycle}</p>
                  <p className="mt-2 font-display text-xl font-extrabold text-white">{program.shortName}</p>
                  <p className="mt-3 text-sm text-navy-100">{program.durationYears < 1 ? 'Total course fee' : 'First-year fee'} (excl. optional)</p>
                  <p className="font-display text-2xl font-extrabold tabular-nums text-white">
                    {formatINR(totals.firstYear)} <DemoBadge light label="Illustrative" />
                  </p>
                </div>
                <div className="space-y-3 p-6">
                  <ButtonLink to={applyHref} variant="gold" className="w-full">
                    Apply Now
                  </ButtonLink>
                  <ExternalButtonLink href="#apply" variant="secondary" className="w-full">
                    Ask a question
                  </ExternalButtonLink>
                  <a href={program.brochureUrl} download className="link flex items-center justify-center gap-2 pt-1 text-sm">
                    <Download className="h-4 w-4" aria-hidden /> Download brochure
                  </a>
                </div>
              </div>
              <div className="card p-5 text-sm">
                <p className="font-semibold text-navy-900">Talk to admissions</p>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="mt-2 flex items-center gap-2 font-semibold text-royal-700 hover:underline">
                  <Phone className="h-4 w-4" aria-hidden /> {phone}
                </a>
                <p className="mt-1 text-xs text-ink-muted">{siteConfig.contacts.admissions.hours}</p>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section id="apply" tone="alt" labelledBy="apply-heading" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
          <div>
            <SectionHeading
              id="apply-heading"
              eyebrow="Apply Now"
              title={`Take the next step towards ${program.shortName}`}
              description="Start your application, or send us a question first — a counsellor will help you with eligibility, documents, fees and scholarships."
              className="mb-8"
            />
            <ol className="space-y-4">
              {['Send an enquiry or start your application.', 'A counsellor contacts you within two working days.', 'Complete documents, counselling and verification.', 'Pay the first-year fee to confirm your seat.'].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-royal-700 text-xs font-bold text-white">{i + 1}</span>
                  <span className="pt-0.5 text-ink-soft">{t}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={applyHref} variant="primary" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Apply Now
              </ButtonLink>
              <ButtonLink to={`/fees?program=${program.slug}`} variant="secondary" size="lg">
                Compare fees
              </ButtonLink>
            </div>
          </div>
          <Reveal className="card p-6 sm:p-8">
            <h3 className="text-xl font-bold">Ask about {program.shortName}</h3>
            <p className="mb-6 mt-1 text-sm text-ink-muted">This enquiry is not an application — it simply connects you with the admissions team.</p>
            <AdmissionEnquiryForm defaultProgram={program.slug} />
          </Reveal>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="white" labelledBy="related-heading">
          <SectionHeading
            id="related-heading"
            eyebrow="Keep exploring"
            title="Related programs"
            action={
              <ButtonLink to="/programs" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                All programs
              </ButtonLink>
            }
          />
          <Stagger as="ul" className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3')}>
            {related.map((p) => (
              <StaggerItem as="li" key={p.slug}>
                <CourseCard program={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}
    </>
  );
}
