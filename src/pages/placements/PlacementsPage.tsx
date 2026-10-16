import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileText,
  GraduationCap,
  Handshake,
  Lightbulb,
  Mail,
  MessageSquare,
  Phone,
  Presentation,
  Quote,
  Rocket,
  Search,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { FilterChips, FilterSelect, ResultsSummary } from '@/components/ui/Filters';
import { EmptyState } from '@/components/ui/States';
import { SmartImage } from '@/components/ui/SmartImage';
import { StatBlock } from '@/components/ui/StatBlock';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { DepartmentOutcomesCard, PlacedVsEligibleCard, PlacementRateCard } from '@/components/placements/PlacementCharts';
import { PlacementEnquiryForm } from '@/components/placements/PlacementEnquiryForm';
import { departmentPlacements, latestPlacementYear, placementMethodology, placementRate, placementYears, recruiters } from '@/data/placements';
import { alumni } from '@/data/alumni';
import { testimonials } from '@/data/testimonials';
import { getDepartment } from '@/data/departments';
import { images } from '@/data/images';
import { siteConfig } from '@/config/site';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { formatNumber } from '@/utils/format';

const processSteps = [
  { title: 'Register with the T&P Cell', text: 'Final-year students register at the start of the year, update their profile and confirm eligibility for placement.' },
  { title: 'Pre-placement training', text: 'Aptitude, communication, technical and domain training run alongside classes from the pre-final year.' },
  { title: 'Pre-placement talks', text: 'Recruiters present the role, compensation, location and selection process before students apply.' },
  { title: 'Tests & group discussions', text: 'Online assessments, coding rounds, case analyses or group discussions, depending on the recruiter.' },
  { title: 'Interviews', text: 'Technical, HR and managerial interviews on campus or online, scheduled around the academic calendar.' },
  { title: 'Offer & onboarding', text: 'Offers are recorded by the cell. Students follow the placement policy on accepting offers and receive onboarding support.' },
];

const careerPrograms = [
  {
    icon: Rocket,
    title: 'Career development activities',
    text: 'Year-round programs that build employability from the first year.',
    items: ['Industry talks and alumni sessions', 'Hackathons, case competitions and project expos', 'Certification support in high-demand skills', 'Soft-skills and workplace etiquette workshops'],
  },
  {
    icon: BriefcaseBusiness,
    title: 'Internship opportunities',
    text: 'Structured internships so every student graduates with real work experience.',
    items: ['Summer internships after the 4th and 6th semester', 'Semester-long industry internships (where the curriculum allows)', 'Research internships with faculty and partner labs', 'Internship credits and NOC process handled by the cell'],
  },
  {
    icon: FileText,
    title: 'Resume preparation & interview training',
    text: 'Hands-on preparation for every stage of the selection process.',
    items: ['Resume and LinkedIn profile clinics', 'Mock technical and HR interviews with feedback', 'Aptitude and coding practice tests', 'Group discussion and presentation practice'],
  },
  {
    icon: Compass,
    title: 'Career guidance & higher education',
    text: 'Support for students choosing further study, public service or entrepreneurship.',
    items: ['One-to-one career counselling', 'Guidance for GATE, CAT, GRE, IELTS and civil services', 'Statement-of-purpose reviews and recommendation letters', 'Incubation support for student founders'],
  },
];

const partnerships = [
  { icon: Users, title: 'Industry advisory boards', text: 'Department boards with industry practitioners review curricula and suggest electives. (Members to be configured.)' },
  { icon: Handshake, title: 'MoUs for internships & projects', text: 'Agreements with organisations for internships, live projects and faculty development. (Partner list to be verified.)' },
  { icon: Presentation, title: 'Guest lectures & industry visits', text: 'Regular sessions by practitioners and visits to plants, offices and research centres.' },
  { icon: Lightbulb, title: 'Centres of excellence', text: 'Industry-supported labs for emerging skills, set up where partnerships are confirmed. (Details to be configured.)' },
];

const yearOptions = placementYears.map((y) => ({ value: y.academicYear, label: y.academicYear })).reverse();
const sectors = Array.from(new Set(recruiters.map((r) => r.sector))).sort();
const stories = alumni.filter((a) => ['Technology', 'Finance', 'Entrepreneurship'].includes(a.industry)).slice(0, 3);
const alumniQuote = testimonials.find((t) => t.role === 'Alumni' && t.consentRecorded && /placement/i.test(t.quote));

export default function PlacementsPage() {
  const [filters, setFilter] = useUrlFilters({ year: latestPlacementYear.academicYear, sector: 'all' });
  const selected = placementYears.find((y) => y.academicYear === filters.year) ?? latestPlacementYear;
  const sector = sectors.includes(filters.sector) ? filters.sector : 'all';
  const shownRecruiters = useMemo(() => (sector === 'all' ? recruiters : recruiters.filter((r) => r.sector === sector)), [sector]);
  const deptRows = departmentPlacements.filter((d) => d.academicYear === selected.academicYear);
  const pc = siteConfig.contacts.placements;

  return (
    <>
      <Seo
        title="Training & Placements"
        description="Bapuji College Karwar Training & Placement Cell: placement process, internships, interview training, recruiters, year-wise placement data and methodology."
      />
      <PageHero
        eyebrow="Training & Placement Cell"
        title="Placements & careers"
        description="From first-year skill building to final-year interviews, the Training & Placement Cell helps every student find the right next step — a job, an internship, higher study or a start-up."
        image={images.meeting}
        actions={
          <>
            <a href="#highlights" className={buttonClasses({ variant: 'gold' })}>
              View placement data
            </a>
            <a href="#enquiry" className={buttonClasses({ variant: 'outline-light' })}>
              Recruit from campus
            </a>
          </>
        }
        aside={
          <div className="glass w-full rounded-3xl p-6 sm:w-80">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">At a glance · {latestPlacementYear.academicYear}</p>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-navy-200">Placement rate</dt>
                <dd className="font-display text-3xl font-extrabold text-white">{placementRate(latestPlacementYear)}%</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-200">Recruiters</dt>
                <dd className="font-display text-3xl font-extrabold text-white">{latestPlacementYear.companiesVisited}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-200">Placed / eligible</dt>
                <dd className="font-semibold text-white">
                  {formatNumber(latestPlacementYear.studentsPlaced)} / {formatNumber(latestPlacementYear.eligibleStudents)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-navy-200">Median CTC</dt>
                <dd className="font-semibold text-white">{latestPlacementYear.medianPackageLpa} LPA</dd>
              </div>
            </dl>
            <DemoBadge light className="mt-4" />
          </div>
        }
      />

      {/* T&P cell intro */}
      <Section tone="white" id="tp-cell" labelledBy="tp-cell-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="tp-cell-heading"
              eyebrow="About the cell"
              title="A dedicated team for your career"
              description="The Training & Placement (T&P) Cell connects students with employers, coordinates internships and runs training throughout the program. It works with department placement coordinators, student representatives and our alumni network."
              className="mb-6 sm:mb-8"
            />
            <Reveal>
              <ul className="grid gap-3 sm:grid-cols-2">
                {['Year-round employer outreach', 'Training from the pre-final year', 'Transparent placement policy', 'Support for higher studies & start-ups'].map((t) => (
                  <li key={t} className="flex gap-2.5 text-ink-soft">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${pc.email}`} className="btn btn-md btn-secondary">
                  <Mail className="h-4 w-4" aria-hidden /> {pc.email}
                </a>
                <a href={`tel:${pc.phone.replace(/\s/g, '')}`} className="btn btn-md btn-ghost">
                  <Phone className="h-4 w-4" aria-hidden /> {pc.phone}
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal direction="left" className="relative">
            <ParallaxImage image={images.business} strength={10} className="aspect-[4/3] rounded-3xl shadow-lift" />
            <div className="absolute -bottom-6 -left-2 max-w-[16rem] rounded-2xl border border-navy-100 bg-white p-4 shadow-lift sm:-left-6">
              <p className="text-xs font-bold uppercase tracking-wider text-royal-700">Companies visited</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-navy-950">{latestPlacementYear.companiesVisited}</p>
              <p className="text-xs text-ink-muted">in {latestPlacementYear.academicYear}</p>
              <DemoBadge className="mt-2" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Process */}
      <Section tone="alt" id="process" labelledBy="process-heading">
        <SectionHeading id="process-heading" eyebrow="How it works" title="The placement process" description="Six stages, coordinated by the cell and published in the placement policy at the start of each year." />
        <Stagger as="ol" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((s, i) => (
            <StaggerItem as="li" key={s.title} className="card card-hover relative overflow-hidden p-6">
              <span className="absolute -right-3 -top-6 font-display text-8xl font-extrabold text-navy-50" aria-hidden>
                {i + 1}
              </span>
              <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-navy-900 font-display font-extrabold text-gold-300">
                <span className="sr-only">Step </span>
                {i + 1}
              </span>
              <h3 className="relative mt-4 text-lg font-bold">{s.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">{s.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Career development */}
      <Section tone="white" id="career-development" labelledBy="career-heading">
        <SectionHeading
          id="career-heading"
          eyebrow="Beyond placements"
          title="Training, internships & guidance"
          description="Preparation starts long before the final year. These programs are open to all students and coordinated with departments."
        />
        <Stagger className="grid gap-6 md:grid-cols-2">
          {careerPrograms.map((p) => (
            <StaggerItem key={p.title} as="article" className="card card-hover group flex gap-5 p-6 sm:p-7">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-700 transition group-hover:bg-navy-900 group-hover:text-gold-300">
                <p.icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{p.text}</p>
                <ul className="mt-4 space-y-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-ink-soft">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Highlights & charts */}
      <Section tone="alt" id="highlights" labelledBy="highlights-heading">
        <SectionHeading
          id="highlights-heading"
          eyebrow="Placement highlights"
          title="Year-wise placement record"
          description="Choose an academic year to see its figures. Every chart states the year, eligible students, students placed and how the rate is calculated, and has a data table alternative."
          action={
            <FilterSelect
              label="Academic year"
              value={selected.academicYear}
              onChange={(v) => setFilter('year', v)}
              options={yearOptions}
              className="w-full sm:w-56"
            />
          }
        />

        <DemoNotice title="All placement figures on this page are illustrative" className="mb-8 text-sm">
          These numbers are demo data for layout purposes only. They are not the college’s actual placement results and must be replaced with figures verified by the Training &
          Placement Cell and IQAC before publication. Methodology: {placementMethodology}
        </DemoNotice>

        <Reveal className="card mb-8 p-6 sm:p-8" key={selected.academicYear}>
          <h3 className="text-lg font-bold">
            Academic year {selected.academicYear} <DemoBadge className="ml-2" />
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            <StatBlock stat={{ label: 'Eligible students', value: selected.eligibleStudents }} />
            <StatBlock stat={{ label: 'Students placed', value: selected.studentsPlaced }} />
            <StatBlock stat={{ label: 'Placement rate', value: placementRate(selected), suffix: '%' }} decimals={1} />
            <StatBlock stat={{ label: 'Median CTC (LPA)', value: selected.medianPackageLpa }} decimals={1} />
            <StatBlock stat={{ label: 'Highest CTC (LPA)', value: selected.highestPackageLpa }} decimals={1} />
            <StatBlock stat={{ label: 'Recruiters visited', value: selected.companiesVisited }} />
          </div>
          <p className="mt-6 text-sm text-ink-muted">
            {formatNumber(selected.higherStudies)} students opted for higher studies in {selected.academicYear}; they are reported separately and not counted as eligible for placement. CTC =
            annual cost-to-company as stated in offer letters; LPA = lakh per annum.
          </p>
        </Reveal>

        <div className="grid gap-6 xl:grid-cols-2">
          <Reveal>
            <PlacementRateCard years={placementYears} selectedYear={selected.academicYear} />
          </Reveal>
          <Reveal delay={0.08}>
            <PlacedVsEligibleCard years={placementYears} selectedYear={selected.academicYear} />
          </Reveal>
        </div>
        <Reveal className="mt-6">
          {deptRows.length > 0 ? (
            <DepartmentOutcomesCard rows={deptRows} selectedYear={selected.academicYear} />
          ) : (
            <EmptyState
              title={`Department-wise data for ${selected.academicYear} is not published yet`}
              description="Department-level outcomes are currently available for the latest academic year only."
              action={
                <button type="button" className="btn btn-md btn-secondary" onClick={() => setFilter('year', latestPlacementYear.academicYear)}>
                  Show {latestPlacementYear.academicYear}
                </button>
              }
            />
          )}
        </Reveal>
      </Section>

      {/* Recruiters */}
      <Section tone="white" id="recruiters" labelledBy="recruiters-heading">
        <SectionHeading
          id="recruiters-heading"
          eyebrow="Recruiter directory"
          title="Organisations that recruit from campus"
          description="Filter by sector. Names below are placeholders — real organisations will be listed only after the cell verifies the association and has permission to publish it."
        />
        <div className="space-y-4">
          <FilterChips
            label="Filter recruiters by sector"
            value={sector}
            onChange={(v) => setFilter('sector', v)}
            options={[{ value: 'all', label: 'All sectors', count: recruiters.length }, ...sectors.map((s) => ({ value: s, label: s, count: recruiters.filter((r) => r.sector === s).length }))]}
          />
          <ResultsSummary start={shownRecruiters.length ? 1 : 0} end={shownRecruiters.length} total={shownRecruiters.length} noun="recruiters" onReset={() => setFilter('sector', 'all')} activeFilters={sector === 'all' ? 0 : 1} />
        </div>
        {shownRecruiters.length === 0 ? (
          <EmptyState className="mt-6" icon={<Search className="h-7 w-7" aria-hidden />} title="No recruiters in this sector" action={
              <button type="button" className={buttonClasses({ variant: 'secondary' })} onClick={() => setFilter('sector', 'all')}>
                Show all sectors
              </button>
            }
          />
        ) : (
          <Stagger as="ul" key={sector} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.04}>
            {shownRecruiters.map((r) => (
              <StaggerItem as="li" key={r.name} className="card card-hover flex items-center gap-4 p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface-sunken text-navy-700">
                  <Building2 className="h-6 w-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-navy-950">{r.name}</p>
                  <p className="text-sm text-ink-muted">{r.sector}</p>
                  {r.isDemo && <DemoBadge label="Placeholder" className="mt-1" />}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Section>

      {/* Partnerships */}
      <Section tone="navy" id="partnerships" labelledBy="partnerships-heading">
        <SectionHeading id="partnerships-heading" light eyebrow="Industry partnerships" title="Working with industry" description="Partnerships shape what students learn and the opportunities they get. Specific partners are published once agreements are verified." />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {partnerships.map((p) => (
            <StaggerItem key={p.title} className="glass rounded-2xl p-6 transition hover:-translate-y-1 hover:bg-white/15">
              <p.icon className="h-7 w-7 text-gold-300" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-100">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Success stories */}
      <Section tone="alt" id="success-stories" labelledBy="stories-heading">
        <SectionHeading
          id="stories-heading"
          eyebrow="Student success stories"
          title="Where our graduates go"
          description="A few of the paths our alumni have taken. Stories are illustrative until replaced with consented alumni profiles."
          action={
            <ButtonLink to="/alumni" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Meet our alumni
            </ButtonLink>
          }
        />
        <Stagger className="grid gap-6 md:grid-cols-3">
          {stories.map((a) => (
            <StaggerItem key={a.id} as="article" className="card card-hover group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage image={{ src: a.photo.src, alt: `Portrait of ${a.name}` }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy-900">{a.industry}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">{a.name}</h3>
                <p className="text-sm font-medium text-royal-700">
                  {a.role}, {a.organization}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {a.program} · {a.batch} · {getDepartment(a.departmentSlug)?.shortName}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a.story}</p>
                <DemoBadge className="mt-3" label="Fictional profile" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        {alumniQuote && (
          <Reveal className="mt-10">
            <figure className="relative overflow-hidden rounded-3xl bg-navy-900 p-8 text-white sm:p-10">
              <Quote className="h-10 w-10 text-gold-300" aria-hidden />
              <blockquote className="mt-4 max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
                <p>“{alumniQuote.quote}”</p>
              </blockquote>
              <figcaption className="mt-5 text-sm text-navy-100">
                <span className="font-bold text-white">{alumniQuote.name}</span> · {alumniQuote.context}
              </figcaption>
              <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-royal-600/40 blur-3xl" aria-hidden />
            </figure>
          </Reveal>
        )}
      </Section>

      {/* Enquiry */}
      <Section tone="white" id="enquiry" labelledBy="enquiry-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <SectionHeading
              id="enquiry-heading"
              eyebrow="Placement enquiries"
              title="Recruiters & partners: get in touch"
              description="Hiring, internships, live projects or a guest lecture — tell us what you have in mind and the T&P Cell will respond."
              className="mb-6"
            />
            <Reveal>
              <ul className="space-y-3">
                <li>
                  <a href={`mailto:${pc.email}`} className="card card-hover flex items-center gap-4 p-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal-50 text-royal-700">
                      <Mail className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">Email</span>
                      <span className="font-semibold text-navy-950">{pc.email}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${pc.phone.replace(/\s/g, '')}`} className="card card-hover flex items-center gap-4 p-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-royal-50 text-royal-700">
                      <Phone className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">Phone</span>
                      <span className="font-semibold text-navy-950">{pc.phone}</span>
                    </span>
                  </a>
                </li>
                <li className="flex gap-3 rounded-2xl bg-surface-sunken p-4 text-sm text-ink-soft">
                  <ClipboardCheck className="h-5 w-5 shrink-0 text-royal-700" aria-hidden />
                  Students: please contact your department placement coordinator or visit the T&P Cell for registration and training schedules.
                </li>
                <li className="flex gap-3 rounded-2xl bg-surface-sunken p-4 text-sm text-ink-soft">
                  <GraduationCap className="h-5 w-5 shrink-0 text-royal-700" aria-hidden />
                  Alumni can also support placements as mentors —{' '}
                  <Link to="/alumni#register" className="link">
                    register with the alumni network
                  </Link>
                  .
                </li>
              </ul>
            </Reveal>
          </div>
          <Reveal direction="left" className="card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-royal-700" aria-hidden />
              <h3 className="text-xl font-bold">Send a placement enquiry</h3>
            </div>
            <PlacementEnquiryForm />
          </Reveal>
        </div>
      </Section>

      <EnquiryCTA />
    </>
  );
}
