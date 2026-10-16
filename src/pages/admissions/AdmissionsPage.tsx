import { ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, Clock, FileText, GraduationCap, HandCoins, Info, Mail, MapPin, MessageSquare, Phone, Route, UserRoundCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { DegreeLevel } from '@/types';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { Tabs } from '@/components/ui/Tabs';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { FaqSection } from '@/components/sections/FaqSection';
import { AdmissionEnquiryForm } from '@/components/forms/AdmissionEnquiryForm';
import { CampusVisitForm } from '@/components/forms/CampusVisitForm';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { InPageNav } from '@/components/programs/InPageNav';
import { DocumentChecklist } from '@/components/admissions/DocumentChecklist';
import { ImportantDates, ProcessTimeline } from '@/components/admissions/AdmissionTimelines';
import { datesWithStatus } from '@/components/admissions/dates';
import { admissionCycle, scholarships } from '@/data/admissions';
import { programs, degreeLevelLabels } from '@/data/programs';
import { faqs } from '@/data/faqs';
import { images } from '@/data/images';
import { fullAddress, siteConfig } from '@/config/site';
import { formatDate, formatLongDate, pluralize } from '@/utils/format';
import { getIcon } from '@/utils/icons';

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'process', label: 'Process' },
  { id: 'dates', label: 'Key dates' },
  { id: 'documents', label: 'Documents' },
  { id: 'instructions', label: 'How to apply' },
  { id: 'enquiry', label: 'Enquire' },
  { id: 'visit', label: 'Visit' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'prospectus', label: 'Prospectus' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'contact', label: 'Contact' },
];

type EligibilityLevel = Extract<DegreeLevel, 'UG' | 'PG' | 'Doctoral' | 'Diploma'>;

const levelCriteria: Record<EligibilityLevel, { summary: string; points: string[] }> = {
  UG: {
    summary: 'For school leavers who have completed 10+2 (or equivalent) from a recognised board.',
    points: [
      'Pass in 10+2 / PUC or equivalent with the subject combination required by the program.',
      'Minimum aggregate marks as prescribed by the university / regulator (relaxation for reserved categories as per norms).',
      'Valid entrance exam score or state counselling allotment where applicable (e.g. engineering, law).',
      'Lateral entry to the second year for diploma holders in eligible engineering programs, subject to seats.',
    ],
  },
  PG: {
    summary: 'For graduates holding a recognised bachelor’s degree in a relevant discipline.',
    points: [
      'Bachelor’s degree of the required duration with the minimum aggregate prescribed for the program.',
      'Entrance test score (institutional or national, e.g. for MBA / M.Tech / MCA) where applicable.',
      'Group discussion / personal interview for selected programs.',
      'Final-year students may apply provisionally and submit results before the notified date.',
    ],
  },
  Doctoral: {
    summary: 'For postgraduates seeking to pursue research under an approved supervisor.',
    points: [
      'Master’s degree (or equivalent) with the minimum marks prescribed under the applicable Ph.D. regulations.',
      'Qualifying the doctoral entrance test, or exemption through UGC-NET / JRF / equivalent as per norms.',
      'Presentation of a research proposal before the Doctoral / Research Advisory Committee.',
      'Admission subject to availability of supervisors and research seats in the department.',
    ],
  },
  Diploma: {
    summary: 'For graduates and working professionals who want focused, practical skills.',
    points: [
      'Bachelor’s degree in any discipline (or as specified for the diploma).',
      'Short interview / aptitude assessment to confirm readiness.',
      'Work experience is welcome but not mandatory unless stated.',
      'Weekend / hybrid batches for working professionals where offered.',
    ],
  },
};

const eligibilityLevels: EligibilityLevel[] = ['UG', 'PG', 'Doctoral', 'Diploma'];

const instructions = [
  { icon: Route, title: 'Choose your program', text: 'Use the course finder to compare eligibility, curriculum and fees. You may list up to two preferences.' },
  { icon: FileText, title: 'Prepare scanned documents', text: 'Clear PDF / JPG scans under 2 MB each. Name files clearly, e.g. “12th-marks-card.pdf”.' },
  { icon: UserRoundCheck, title: 'Fill in details carefully', text: 'Use your name exactly as on your marks cards, and a mobile number and email you check regularly.' },
  { icon: BadgeCheck, title: 'Track and respond', text: 'Watch for calls and emails from the admissions office about counselling, interviews and verification.' },
];

const prospectusDocs = [
  { title: `Prospectus ${admissionCycle}`, meta: 'Programs, campus & policies', sizeKb: 4200 },
  { title: 'Admission guidelines & seat matrix', meta: 'Eligibility, reservation & process', sizeKb: 640 },
  { title: 'Fee structure — all programs', meta: 'Illustrative until approved', sizeKb: 420 },
  { title: 'Scholarship policy & application form', meta: 'Merit and need-based support', sizeKb: 300 },
];

const admissionFaqs = faqs.filter((f) => f.category === 'Admissions');

export default function AdmissionsPage() {
  const [level, setLevel] = useState<EligibilityLevel>('UG');
  const dates = datesWithStatus();
  const nextDate = dates.find((d) => d.status === 'next');
  const applicationsOpen = dates.find((d) => d.label.toLowerCase().includes('applications open'));
  const admissions = siteConfig.contacts.admissions;

  return (
    <>
      <Seo
        title={`Admissions ${admissionCycle}`}
        description={`Admissions ${admissionCycle}: eligibility, step-by-step process, important dates, documents checklist, scholarships and how to enquire or book a campus visit.`}
      />
      <PageHero
        eyebrow={`Admissions ${admissionCycle}`}
        title="Begin your journey with us"
        description="Everything you need to apply — eligibility, process, key dates, documents and scholarships — plus a counsellor who will guide you at every step."
        image={images.studentsOutdoor}
        size="lg"
        actions={
          <>
            <ButtonLink to="/admissions/apply" variant="gold" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Apply / Enquire
            </ButtonLink>
            <ExternalButtonLink href="#visit" variant="outline-light" size="lg" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
              Book a campus visit
            </ExternalButtonLink>
          </>
        }
        aside={
          nextDate && (
            <div className="glass w-full rounded-2xl p-6 lg:w-80">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">Up next</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-white">{nextDate.label}</p>
              <p className="mt-1 text-sm text-navy-100">
                <time dateTime={nextDate.date}>{formatLongDate(nextDate.date)}</time>
              </p>
              {nextDate.note && <p className="mt-1 text-xs text-navy-200">{nextDate.note}</p>}
              <a href="#dates" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 hover:text-white">
                All important dates <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          )
        }
      />

      <InPageNav
        items={navItems}
        label="Admissions sections"
        action={
          <ButtonLink to="/admissions/apply" variant="primary" size="sm">
            Apply / Enquire
          </ButtonLink>
        }
      />

      {/* Overview */}
      <Section id="overview" tone="white" labelledBy="overview-heading" className="scroll-mt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="overview-heading"
              eyebrow="Overview"
              title={
                applicationsOpen && applicationsOpen.status !== 'past'
                  ? `Admissions for ${admissionCycle} open on ${formatDate(applicationsOpen.date)}`
                  : `Admissions for ${admissionCycle} are open`
              }
              description="We admit students to undergraduate, postgraduate, doctoral, diploma and certificate programs on the basis of merit, entrance scores and university / regulator norms. Start with an enquiry — our counsellors will help you choose the right program and walk you through every step."
              className="mb-8"
            />
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: GraduationCap, title: pluralize(programs.length, 'program'), text: 'Across five degree levels' },
                { icon: MessageSquare, title: 'Personal counselling', text: 'Call back within two working days' },
                { icon: HandCoins, title: 'Scholarships', text: 'Merit, need-based & government' },
                { icon: MapPin, title: 'Campus visits', text: 'Monday to Saturday, by request' },
              ].map((h) => (
                <StaggerItem as="li" key={h.title}>
                  <div className="card card-hover flex h-full gap-4 p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-700">
                      <h.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-bold text-navy-950">{h.title}</p>
                      <p className="text-sm text-ink-muted">{h.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal direction="left" className="relative">
            <ParallaxImage image={images.campusAerial} strength={12} className="aspect-[4/3] rounded-3xl shadow-lift" />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-5 shadow-lift sm:left-auto sm:w-72">
              <p className="text-xs font-bold uppercase tracking-wider text-royal-700">Admissions helpline</p>
              <a href={`tel:${admissions.phone.replace(/\s/g, '')}`} className="mt-1 block font-display text-lg font-extrabold text-navy-950 hover:text-royal-700">
                {admissions.phone}
              </a>
              <p className="text-xs text-ink-muted">{admissions.hours}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Eligibility */}
      <Section id="eligibility" tone="alt" labelledBy="eligibility-heading" className="scroll-mt-16">
        <SectionHeading
          id="eligibility-heading"
          eyebrow="Eligibility & criteria"
          title="Who can apply"
          description="General criteria by level, followed by the specific eligibility for each program. The university / regulator notification for the cycle prevails."
        />
        <Tabs
          label="Eligibility by degree level"
          value={level}
          onChange={(v) => setLevel(v as EligibilityLevel)}
          tabs={eligibilityLevels.map((l) => {
            const levelPrograms = programs.filter((p) => p.level === l);
            return {
              id: l,
              label: degreeLevelLabels[l],
              content: (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                  <div className="card h-fit p-6">
                    <h3 className="text-lg font-bold">{degreeLevelLabels[l]} admissions</h3>
                    <p className="mt-2 text-sm text-ink-muted">{levelCriteria[l].summary}</p>
                    <ul className="mt-5 space-y-3 text-sm text-ink-soft">
                      {levelCriteria[l].points.map((pt) => (
                        <li key={pt} className="flex gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-muted">Program-specific eligibility</h3>
                    <ul className="space-y-3">
                      {levelPrograms.map((p) => (
                        <li key={p.slug} className="rounded-xl border border-navy-100 bg-white p-4 transition hover:border-royal-200 hover:shadow-card">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Link to={`/programs/${p.slug}`} className="font-semibold text-navy-950 hover:text-royal-700 hover:underline">
                              {p.name}
                            </Link>
                            <Badge tone="royal">{p.eligibilityTag}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-ink-muted">{p.eligibility}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            };
          })}
        />
      </Section>

      {/* Process */}
      <Section id="process" tone="white" labelledBy="process-heading" className="scroll-mt-16">
        <SectionHeading id="process-heading" eyebrow="Step by step" title="The admission process" description="Five clear steps from first enquiry to confirmed seat." align="center" />
        <ProcessTimeline />
      </Section>

      {/* Important dates */}
      <Section id="dates" tone="navy" labelledBy="dates-heading" className="scroll-mt-16">
        <SectionHeading
          id="dates-heading"
          light
          eyebrow={`Calendar ${admissionCycle}`}
          title="Important dates"
          description={
            <>
              Key milestones for the {admissionCycle} admission cycle <DemoBadge light label="Illustrative" />
            </>
          }
        />
        <ImportantDates />
        <p className="mt-8 text-sm text-navy-200">Dates are indicative. Official dates are published in the admission notification and on the News &amp; Notices page.</p>
      </Section>

      {/* Documents */}
      <Section id="documents" tone="white" labelledBy="documents-heading" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
          <div>
            <SectionHeading
              id="documents-heading"
              eyebrow="Be prepared"
              title="Documents checklist"
              description="Tick documents off as you gather them — your progress is saved on this device. Print the list to carry to verification."
              className="mb-6"
            />
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm text-sky-900">
              <p className="flex items-center gap-2 font-semibold">
                <Info className="h-4 w-4" aria-hidden /> At verification
              </p>
              <p className="mt-1">Carry originals plus two self-attested photocopies of each document. Provisional certificates are accepted where final ones are awaited.</p>
            </div>
          </div>
          <Reveal>
            <DocumentChecklist />
          </Reveal>
        </div>
      </Section>

      {/* Parallax band */}
      <div className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
        <ParallaxImage image={images.graduation} strength={20} className="absolute inset-0 -z-20" imgClassName="opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-transparent" aria-hidden />
        <Reveal className="container">
          <p className="max-w-xl text-balance font-display text-2xl font-extrabold leading-snug text-white sm:text-4xl">“Every great career begins with a single conversation.”</p>
          <p className="mt-4 text-navy-100">Our counsellors are here to help you choose with confidence.</p>
        </Reveal>
      </div>

      {/* Instructions */}
      <Section id="instructions" tone="alt" labelledBy="instructions-heading" className="scroll-mt-16">
        <SectionHeading
          id="instructions-heading"
          eyebrow="Application instructions"
          title="How to apply"
          description="Follow these guidelines to make your application smooth and complete."
          action={
            <ButtonLink to="/admissions/apply" variant="primary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Go to Apply / Enquire
            </ButtonLink>
          }
        />
        <Stagger as="ol" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {instructions.map((s, i) => (
            <StaggerItem as="li" key={s.title}>
              <div className="card card-hover relative h-full overflow-hidden p-6">
                <span className="absolute -right-2 -top-4 font-display text-7xl font-extrabold text-navy-50" aria-hidden>
                  {i + 1}
                </span>
                <s.icon className="relative h-7 w-7 text-royal-600" aria-hidden />
                <h3 className="relative mt-4 text-lg font-bold">{s.title}</h3>
                <p className="relative mt-2 text-sm text-ink-muted">{s.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <DemoNotice title="Online application portal" className="mt-8">
          {siteConfig.portals.application
            ? 'Online applications are handled on the institution’s application portal, linked from the Apply / Enquire page.'
            : 'The online application portal is an integration point and is not yet connected. Until it is, start with an enquiry and the admissions team will share the application link.'}
        </DemoNotice>
      </Section>

      {/* Enquiry */}
      <Section id="enquiry" tone="white" labelledBy="enquiry-heading" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-14">
          <div>
            <SectionHeading
              id="enquiry-heading"
              eyebrow="Ask us anything"
              title="Admission enquiry"
              description="Share a few details and an admissions counsellor will get back to you within two working days."
              className="mb-6"
            />
            <ul className="space-y-3 text-sm text-ink-soft">
              {['Personalised program guidance', 'Eligibility and document checks', 'Fee, instalment and scholarship advice', 'Hostel and transport information'].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="card p-6 sm:p-8">
            <AdmissionEnquiryForm />
          </Reveal>
        </div>
      </Section>

      {/* Campus visit */}
      <Section id="visit" tone="alt" labelledBy="visit-heading" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] lg:gap-14">
          <Reveal className="card order-2 p-6 sm:p-8 lg:order-1">
            <CampusVisitForm />
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              id="visit-heading"
              eyebrow="See it for yourself"
              title="Request a campus visit"
              description="Tour classrooms, labs, the library, hostels and sports facilities, and meet faculty and current students."
              className="mb-6"
            />
            <div className="relative h-48 overflow-hidden rounded-2xl shadow-card sm:h-56">
              <ParallaxImage image={images.library} strength={12} className="absolute inset-0" />
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-ink-muted">
              <Clock className="h-4 w-4 text-royal-600" aria-hidden /> Visits run Monday–Saturday, 10 AM – 4 PM.
            </p>
          </div>
        </div>
      </Section>

      {/* Scholarships */}
      <Section id="scholarships" tone="white" labelledBy="scholarships-heading" className="scroll-mt-16">
        <SectionHeading
          id="scholarships-heading"
          eyebrow="Financial support"
          title="Scholarships"
          description="Merit, need-based, government, sports and cultural scholarships help talented students thrive regardless of background."
          action={
            <ButtonLink to="/fees#scholarships" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Fees & concessions
            </ButtonLink>
          }
        />
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scholarships.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <StaggerItem as="li" key={s.title}>
                <div className="card card-hover group flex h-full flex-col p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700 transition group-hover:bg-gold-400 group-hover:text-navy-950">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-muted">{s.text}</p>
                  <p className="mt-4 border-t border-navy-100 pt-3 text-sm font-bold text-royal-700">{s.value}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* Prospectus */}
      <Section id="prospectus" tone="sunken" labelledBy="prospectus-heading" className="scroll-mt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="prospectus-heading"
              eyebrow="Downloads"
              title="Prospectus & admission guides"
              description="Download the prospectus and guidelines to read offline or share with your family."
              className="mb-6"
            />
            <ul className="space-y-3">
              {prospectusDocs.map((d) => (
                <li key={d.title}>
                  <DownloadLink title={d.title} url="/downloads/placeholder.pdf" sizeKb={d.sizeKb} fileType="PDF" meta={d.meta} showPreview />
                </li>
              ))}
            </ul>
          </div>
          <Reveal direction="left" className="hidden lg:block">
            <ParallaxImage image={images.libraryReading} strength={14} className="aspect-[4/3] rounded-3xl shadow-lift" />
          </Reveal>
        </div>
      </Section>

      <FaqSection
        faqs={admissionFaqs}
        id="faqs"
        tone="white"
        title="Admission FAQs"
        description="Quick answers to the questions applicants ask most."
        aside={
          <div className="card p-6 text-sm">
            <p className="font-semibold text-navy-900">Didn’t find your answer?</p>
            <p className="mt-1 text-ink-muted">Send an enquiry and a counsellor will reply personally.</p>
            <ExternalButtonLink href="#enquiry" variant="primary" size="sm" className="mt-4">
              Ask a question
            </ExternalButtonLink>
          </div>
        }
      />

      {/* Contact */}
      <Section id="contact" tone="navy" labelledBy="contact-heading" className="scroll-mt-16">
        <SectionHeading id="contact-heading" light eyebrow="Admission office" title="Talk to the admissions team" description="Reach us by phone or email, or drop in during office hours." />
        <Stagger as="ul" className="grid gap-5 md:grid-cols-3">
          <StaggerItem as="li" className="glass rounded-2xl p-6">
            <Phone className="h-6 w-6 text-gold-300" aria-hidden />
            <h3 className="mt-4 text-lg font-bold text-white">Phone</h3>
            <a href={`tel:${admissions.phone.replace(/\s/g, '')}`} className="mt-1 block font-semibold text-navy-100 hover:text-white hover:underline">
              {admissions.phone}
            </a>
            <p className="mt-1 text-sm text-navy-200">{admissions.hours}</p>
          </StaggerItem>
          <StaggerItem as="li" className="glass rounded-2xl p-6">
            <Mail className="h-6 w-6 text-gold-300" aria-hidden />
            <h3 className="mt-4 text-lg font-bold text-white">Email</h3>
            <a href={`mailto:${admissions.email}`} className="mt-1 block break-all font-semibold text-navy-100 hover:text-white hover:underline">
              {admissions.email}
            </a>
            <p className="mt-1 text-sm text-navy-200">We reply within one working day.</p>
          </StaggerItem>
          <StaggerItem as="li" className="glass rounded-2xl p-6">
            <MapPin className="h-6 w-6 text-gold-300" aria-hidden />
            <h3 className="mt-4 text-lg font-bold text-white">Visit the office</h3>
            <p className="mt-1 text-sm text-navy-100">{fullAddress}</p>
            <dl className="mt-3 space-y-1 text-sm">
              {siteConfig.officeHours.map((h) => (
                <div key={h.days} className="flex justify-between gap-3">
                  <dt className="text-navy-200">{h.days}</dt>
                  <dd className="font-semibold text-white">{h.time}</dd>
                </div>
              ))}
            </dl>
          </StaggerItem>
        </Stagger>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/admissions/apply" variant="gold" size="lg">
            Apply / Enquire
          </ButtonLink>
          <ButtonLink to="/contact" variant="outline-light" size="lg">
            All contacts &amp; map
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
