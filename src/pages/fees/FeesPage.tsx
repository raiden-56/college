import { ArrowRight, Banknote, Building, CalendarClock, CreditCard, FileCheck2, Landmark, Mail, Phone, PlugZap, ReceiptText, Split } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { DegreeLevel, Program } from '@/types';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { Tabs } from '@/components/ui/Tabs';
import { ResponsiveTable, type Column } from '@/components/ui/ResponsiveTable';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { FaqSection } from '@/components/sections/FaqSection';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { InPageNav } from '@/components/programs/InPageNav';
import { FeeBreakdownTable, FeeSummaryCards, YearScheduleTable } from '@/components/fees/FeeTables';
import { FeeYearSelector } from '@/components/fees/FeeYearSelector';
import { ProgramSelect } from '@/components/fees/ProgramSelect';
import { defaultFeeYear, feeYearTone, isFeeYearId } from '@/components/fees/feeMeta';
import { getProgram, programs, degreeLevelLabels, degreeLevels } from '@/data/programs';
import { scholarships } from '@/data/admissions';
import { faqs } from '@/data/faqs';
import { images } from '@/data/images';
import { siteConfig } from '@/config/site';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { computeFeeTotals, feeAcademicYears, feesForYear, type FeeYearId } from '@/utils/fees';
import { formatDuration, formatINR } from '@/utils/format';
import { getIcon } from '@/utils/icons';

const navItems = [
  { id: 'calculator', label: 'Fee calculator' },
  { id: 'compare', label: 'All programs' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'payment', label: 'How to pay' },
  { id: 'refunds', label: 'Refunds' },
  { id: 'documents', label: 'Documents' },
  { id: 'faqs', label: 'FAQs' },
];

const feeFaqs = faqs.filter((f) => f.category === 'Fees');

const paymentModes = [
  {
    icon: CreditCard,
    title: 'Online payment',
    text: 'Cards, UPI and net banking through the institution’s payment gateway, with an instant e-receipt.',
    status: 'integration',
  },
  { icon: Landmark, title: 'Bank transfer (NEFT / RTGS / IMPS)', text: 'Transfer to the college fee account below and email the UTR number with the student’s name and application ID.' },
  { icon: Banknote, title: 'Demand draft', text: 'Drawn in favour of the college, payable at the campus city. Write the student’s name and program on the reverse.' },
  { icon: Building, title: 'Accounts office counter', text: 'Card / DD payments at the accounts office during office hours. Cash acceptance is subject to applicable limits.' },
];

const bankDetails = [
  { label: 'Account name', value: 'To be configured' },
  { label: 'Bank & branch', value: 'To be configured' },
  { label: 'Account number', value: 'To be configured' },
  { label: 'IFSC', value: 'To be configured' },
];

const refundSlabs = [
  { when: '15 or more days before the notified last date of admission', refund: '100%', note: 'Minus a processing fee (capped)' },
  { when: 'Less than 15 days before the notified last date', refund: '90%', note: '' },
  { when: 'Up to 15 days after the notified last date', refund: '80%', note: '' },
  { when: '16–30 days after the notified last date', refund: '50%', note: '' },
  { when: 'More than 30 days after the notified last date', refund: 'Nil', note: '' },
];

const feeDocuments = [
  { title: 'Fee structure — all programs', meta: 'Consolidated schedule', sizeKb: 420 },
  { title: 'Fee payment instructions & bank details', meta: 'Accounts office', sizeKb: 180 },
  { title: 'Refund & cancellation policy', meta: 'Official policy', sizeKb: 210 },
  { title: 'Scholarship & concession application form', meta: 'Fillable PDF', sizeKb: 260 },
  { title: 'Hostel & transport fee schedule', meta: 'Optional facilities', sizeKb: 150 },
];

type CompareRow = Program & { annualTuition: number; firstYear: number; programTotal: number };

export default function FeesPage() {
  const [filters, setFilter] = useUrlFilters({ program: programs[0].slug, year: defaultFeeYear as string });
  const program = getProgram(filters.program) ?? programs[0];
  const yearId: FeeYearId = isFeeYearId(filters.year) ? filters.year : defaultFeeYear;
  const year = feeAcademicYears.find((y) => y.id === yearId) ?? feeAcademicYears[0];
  const fees = feesForYear(program.fees, yearId);
  const [level, setLevel] = useState<DegreeLevel>(program.level);

  const compareRows = (lvl: DegreeLevel): CompareRow[] =>
    programs
      .filter((p) => p.level === lvl)
      .map((p) => {
        const t = computeFeeTotals(feesForYear(p.fees, yearId), p.durationYears);
        return { ...p, annualTuition: t.tuition, firstYear: t.firstYear, programTotal: t.programTotal };
      });

  const showBreakdown = (slug: string) => {
    setFilter('program', slug);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const compareColumns: Column<CompareRow>[] = [
    {
      key: 'name',
      header: 'Program',
      cell: (p) => (
        <Link to={`/programs/${p.slug}`} className="hover:text-royal-700 hover:underline">
          {p.shortName}
        </Link>
      ),
    },
    { key: 'duration', header: 'Duration', cell: (p) => formatDuration(p.durationYears) },
    { key: 'tuition', header: 'Annual tuition', numeric: true, cell: (p) => formatINR(p.annualTuition) },
    { key: 'first', header: 'First-year total', numeric: true, cell: (p) => <span className="font-semibold text-navy-950">{formatINR(p.firstYear)}</span> },
    { key: 'total', header: 'Program total', numeric: true, cell: (p) => formatINR(p.programTotal) },
    {
      key: 'action',
      header: <span className="sr-only">Actions</span>,
      cell: (p) => (
        <button type="button" onClick={() => showBreakdown(p.slug)} className="link whitespace-nowrap text-sm" aria-label={`View fee breakdown for ${p.name}`}>
          Breakdown
        </button>
      ),
    },
  ];

  const levelsInUse = degreeLevels.filter((l) => programs.some((p) => p.level === l));

  return (
    <>
      <Seo
        title="Fee Structure"
        description="Program-wise fee structure with tuition, one-time and optional charges, year-wise schedules, scholarships, payment instructions and refund policy."
      />
      <PageHero
        eyebrow="Admissions"
        title="Fee structure"
        description="Transparent, program-wise fees — tuition, other charges, one-time admission fees and optional hostel and transport — with year-wise schedules you can compare."
        image={images.libraryReading}
        actions={
          <>
            <ExternalButtonLink href="#calculator" variant="gold" size="lg">
              Calculate my fees
            </ExternalButtonLink>
            <ExternalButtonLink href="#scholarships" variant="outline-light" size="lg">
              Scholarships
            </ExternalButtonLink>
          </>
        }
      />

      <InPageNav items={navItems} label="Fee structure sections" />

      <Section id="calculator" tone="white" labelledBy="calculator-heading" className="scroll-mt-16">
        <SectionHeading
          id="calculator-heading"
          eyebrow="Fee calculator"
          title="Fees for your program"
          description="Choose a program and academic year to see the complete breakdown. Your selection is saved in the link, so you can share it."
        />
        <DemoNotice title="All fees are illustrative until approved by the institution" className="mb-8">
          Figures on this page are sample values for demonstration. The official fee schedule is published only after approval by the competent fee-regulatory authority, and the approved document prevails.
        </DemoNotice>

        <Reveal className="card mb-8 grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <ProgramSelect value={program.slug} onChange={(v) => setFilter('program', v)} />
          <FeeYearSelector value={yearId} onChange={(v) => setFilter('year', v)} />
        </Reveal>

        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 className="text-xl font-bold">{program.name}</h3>
          <Badge tone={feeYearTone(year.status)}>
            {year.label} · {year.status}
          </Badge>
          <Link to={`/programs/${program.slug}`} className="link inline-flex items-center gap-1 text-sm">
            Program details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <FeeSummaryCards fees={fees} durationYears={program.durationYears} />

        <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div>
            <h3 className="mb-4 text-lg font-bold">Component-wise breakdown</h3>
            <FeeBreakdownTable fees={fees} durationYears={program.durationYears} caption={`${program.shortName} fee components for ${year.label}`} />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Year-wise schedule</h3>
            <YearScheduleTable fees={fees} durationYears={program.durationYears} caption={`${program.shortName} year-wise payable amounts (${year.label} rates)`} />
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              Later years are shown at {year.label} rates for comparison. Fees for subsequent years may be revised as per the approved schedule for that year. Optional hostel and transport charges are excluded from totals.
            </p>
          </div>
        </div>
      </Section>

      <Section id="compare" tone="alt" labelledBy="compare-heading" className="scroll-mt-16">
        <SectionHeading
          id="compare-heading"
          eyebrow="At a glance"
          title="Compare fees across programs"
          description={
            <>
              Annual tuition and first-year totals for every program, at {year.label} rates <DemoBadge />
            </>
          }
        />
        <Tabs
          label="Programs by degree level"
          value={level}
          onChange={(v) => setLevel(v as DegreeLevel)}
          tabs={levelsInUse.map((l) => ({
            id: l,
            label: degreeLevelLabels[l],
            content: <ResponsiveTable caption={`${degreeLevelLabels[l]} programs — fee comparison (${year.label})`} columns={compareColumns} rows={compareRows(l)} rowKey={(p) => p.slug} stackOnMobile />,
          }))}
        />
      </Section>

      <Section id="scholarships" tone="white" labelledBy="scholarships-heading" className="scroll-mt-16">
        <SectionHeading
          id="scholarships-heading"
          eyebrow="Financial support"
          title="Scholarships & concessions"
          description="Talent and circumstance should never be a barrier. Scholarships are applied as tuition waivers; only one institutional scholarship applies at a time."
          action={
            <ButtonLink to="/admissions#scholarships" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Eligibility details
            </ButtonLink>
          }
        />
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scholarships.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <StaggerItem as="li" key={s.title}>
                <div className="card card-hover flex h-full flex-col p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700">
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

      <div className="relative h-56 sm:h-72" aria-hidden>
        <ParallaxImage image={images.studentsOutdoor} strength={18} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-surface-sunken" />
      </div>

      <Section id="payment" tone="sunken" labelledBy="payment-heading" className="scroll-mt-16">
        <SectionHeading
          id="payment-heading"
          eyebrow="Paying your fees"
          title="Payment instructions"
          description="Always quote the student’s name, program and application / enrolment ID. Keep every receipt until your degree is awarded."
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <h3 className="mb-4 text-lg font-bold">Accepted payment modes</h3>
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
              {paymentModes.map((m) => (
                <StaggerItem as="li" key={m.title}>
                  <div className="card card-hover h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <m.icon className="h-6 w-6 text-royal-600" aria-hidden />
                      {m.status === 'integration' && (
                        <Badge tone="gold" icon={<PlugZap className="h-3 w-3" aria-hidden />}>
                          Integration pending
                        </Badge>
                      )}
                    </div>
                    <h4 className="mt-3 font-bold text-navy-950">{m.title}</h4>
                    <p className="mt-1.5 text-sm text-ink-muted">{m.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-4 text-xs text-ink-muted">
              The online payment gateway is an integration point: it will be linked here once the institution’s payment provider is configured. No payments can be made on this demo website.
            </p>
          </div>
          <div className="space-y-5">
            <Reveal className="card p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Landmark className="h-5 w-5 text-royal-600" aria-hidden />
                Bank details
              </h3>
              <dl className="mt-4 divide-y divide-navy-100 text-sm">
                {bankDetails.map((b) => (
                  <div key={b.label} className="flex justify-between gap-4 py-2.5">
                    <dt className="font-semibold text-navy-900">{b.label}</dt>
                    <dd className="text-right italic text-ink-muted">{b.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-ink-muted">Verify bank details with the accounts office by phone before transferring. The college will never ask you to pay into a personal account.</p>
            </Reveal>
            <Reveal className="card p-6" delay={0.08}>
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Split className="h-5 w-5 text-royal-600" aria-hidden />
                Instalments
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                <li className="flex gap-2.5">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                  <span>
                    <strong className="text-navy-900">Instalment 1</strong> — one-time fees plus 50% of the annual fee, at admission / start of the year.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                  <span>
                    <strong className="text-navy-900">Instalment 2</strong> — remaining 50% before the start of the second semester.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                  <span>Instalments are available on request and subject to approval by the accounts office. Late payment may attract a fine as per policy.</span>
                </li>
              </ul>
            </Reveal>
            <Reveal className="rounded-2xl bg-navy-900 p-6 text-white" delay={0.12}>
              <p className="font-bold text-white">Accounts office</p>
              <ul className="mt-3 space-y-2 text-sm text-navy-100">
                <li>
                  <a href={`tel:${siteConfig.contacts.accounts.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-white hover:underline">
                    <Phone className="h-4 w-4 text-gold-300" aria-hidden />
                    {siteConfig.contacts.accounts.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.contacts.accounts.email}`} className="inline-flex items-center gap-2 break-all hover:text-white hover:underline">
                    <Mail className="h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                    {siteConfig.contacts.accounts.email}
                  </a>
                </li>
                <li className="text-navy-200">
                  {siteConfig.officeHours[0].days}, {siteConfig.officeHours[0].time}
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section id="refunds" tone="white" labelledBy="refunds-heading" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-14">
          <div>
            <SectionHeading
              id="refunds-heading"
              eyebrow="Withdrawals"
              title="Refund & cancellation policy"
              description="If you withdraw after paying fees, refunds follow the regulator’s refund guidelines in force for the academic year. This is a summary — the official policy document prevails."
              className="mb-6"
            />
            <ul className="space-y-3 text-sm text-ink-soft">
              {[
                'Submit a written withdrawal request with the original fee receipt to the admissions office.',
                'Original certificates are returned without retaining any document.',
                'Refunds are made to the original payer’s bank account, usually within 15 working days.',
                'Optional hostel and transport charges are refunded pro-rata as per the facility rules.',
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ResponsiveTable
              caption="Typical refund slabs (illustrative summary)"
              columns={[
                { key: 'when', header: 'Withdrawal notice received', cell: (r: (typeof refundSlabs)[number]) => r.when },
                { key: 'refund', header: 'Refund of fees paid', numeric: true, cell: (r: (typeof refundSlabs)[number]) => <span className="font-bold text-navy-950">{r.refund}</span> },
                { key: 'note', header: 'Note', cell: (r: (typeof refundSlabs)[number]) => r.note || '—' },
              ]}
              rows={refundSlabs}
              rowKey={(r) => r.when}
              stackOnMobile
            />
            <DemoNotice title="Confirm the current policy" className="mt-4">
              Slabs reflect the structure commonly prescribed by regulators for higher-education refunds. The institution must publish its approved policy before this summary is relied upon.
            </DemoNotice>
          </div>
        </div>
      </Section>

      <Section id="documents" tone="alt" labelledBy="documents-heading" className="scroll-mt-16">
        <SectionHeading id="documents-heading" eyebrow="Downloads" title="Fee documents" description="Official fee notifications and forms. Placeholder files are shown until the institution uploads approved documents." />
        <Stagger as="ul" className="grid gap-3 md:grid-cols-2">
          {feeDocuments.map((d) => (
            <StaggerItem as="li" key={d.title}>
              <DownloadLink title={d.title} url="/downloads/placeholder.pdf" sizeKb={d.sizeKb} fileType="PDF" meta={d.meta} showPreview />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <FaqSection
        faqs={feeFaqs}
        id="faqs"
        title="Fee questions, answered"
        description="Can’t find what you need? The accounts office is happy to help."
        aside={
          <div className="card p-6 text-sm">
            <p className="font-semibold text-navy-900">Still have a question about fees?</p>
            <p className="mt-1 text-ink-muted">Email the accounts office or speak to an admissions counsellor.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ExternalButtonLink href={`mailto:${siteConfig.contacts.accounts.email}`} variant="secondary" size="sm" icon={<Mail className="h-4 w-4" aria-hidden />}>
                Email accounts
              </ExternalButtonLink>
              <ButtonLink to="/admissions/apply" variant="primary" size="sm">
                Ask admissions
              </ButtonLink>
            </div>
          </div>
        }
      />

      <EnquiryCTA title="Questions about fees or scholarships?" description="Our admissions team can explain the fee schedule, instalments and scholarships that apply to you." />
    </>
  );
}
