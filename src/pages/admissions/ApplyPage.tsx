import { ArrowRight, CheckCircle2, Clock, ExternalLink, FileText, Mail, Phone, PlugZap, Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { SmartImage } from '@/components/ui/SmartImage';
import { AdmissionEnquiryForm } from '@/components/forms/AdmissionEnquiryForm';
import { Reveal } from '@/components/motion/Reveal';
import { ImportantDates } from '@/components/admissions/AdmissionTimelines';
import { admissionCycle, requiredDocuments } from '@/data/admissions';
import { getProgram, degreeLevelLabels } from '@/data/programs';
import { images } from '@/data/images';
import { siteConfig } from '@/config/site';
import { formatDuration } from '@/utils/format';

const nextSteps = [
  { title: 'We review your enquiry', text: 'An admissions counsellor reads your details and preferred program.' },
  { title: 'A counsellor contacts you', text: 'Usually within two working days, by phone or email.' },
  { title: 'Application & documents', text: 'You receive the application link and document checklist for your program.' },
  { title: 'Counselling & confirmation', text: 'Attend counselling / verification and pay the first-year fee to confirm your seat.' },
];

export default function ApplyPage() {
  const [params, setParams] = useSearchParams();
  const program = getProgram(params.get('program') ?? '');
  const portal = siteConfig.portals.application;
  const admissions = siteConfig.contacts.admissions;
  const keyDocs = requiredDocuments.filter((d) => d.required);

  const clearProgram = () =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('program');
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  return (
    <>
      <Seo
        title="Apply / Enquire"
        description={`Start your ${admissionCycle} admission: send an enquiry to the admissions team, check documents to keep ready and key dates, or continue to the online application portal.`}
      />
      <PageHero
        eyebrow={`Admissions ${admissionCycle}`}
        title="Apply / Enquire"
        description="Tell us what you would like to study. Our admissions team will guide you through eligibility, documents, fees and the application itself."
        image={images.groupStudy}
      />

      <Section tone="alt">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-14">
          <div className="min-w-0 space-y-8">
            {/* Application portal status */}
            <Reveal>
              {portal ? (
                <section aria-labelledby="portal-heading" className="card flex flex-col gap-5 border-royal-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                  <div>
                    <Badge tone="green">Applications open online</Badge>
                    <h2 id="portal-heading" className="mt-3 text-2xl font-extrabold">
                      Online application portal
                    </h2>
                    <p className="mt-2 text-sm text-ink-muted">Complete your application, upload documents and track its status on the institution’s secure application portal.</p>
                  </div>
                  <ExternalButtonLink href={portal} variant="primary" size="lg" className="shrink-0" iconRight={<ExternalLink className="h-4 w-4" aria-hidden />}>
                    Continue to application portal
                  </ExternalButtonLink>
                </section>
              ) : (
                <section aria-labelledby="portal-heading" className="relative overflow-hidden rounded-2xl border border-dashed border-gold-300 bg-gold-50/60 p-6 sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-100 text-gold-700">
                      <PlugZap className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <Badge tone="gold">Integration pending</Badge>
                      <h2 id="portal-heading" className="mt-3 text-2xl font-extrabold">
                        Online applications open soon
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-gold-900/90">
                        The online application portal has not been connected to this website yet. Until it is, please send an enquiry below — the admissions team will
                        share the application link and help you complete it. No application is created or submitted from this page.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </Reveal>

            {/* Enquiry form — primary action */}
            <Reveal as="section" aria-labelledby="enquiry-heading" className="card scroll-mt-28 p-6 sm:p-8" id="enquiry">
              <p className="eyebrow">
                <span className="h-px w-6 bg-royal-600" aria-hidden />
                Step 1
              </p>
              <h2 id="enquiry-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Start with an admission enquiry
              </h2>
              <p className="mt-2 text-sm text-ink-muted">This is an enquiry, not an application. It takes about two minutes.</p>

              {program && (
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-royal-100 bg-royal-50/60 p-4 sm:flex-row sm:items-center">
                  <SmartImage image={program.image} decorative className="h-20 w-full shrink-0 rounded-xl object-cover sm:h-16 sm:w-24" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-royal-700">Selected program</p>
                    <p className="font-semibold text-navy-950">{program.name}</p>
                    <p className="text-xs text-ink-muted">
                      {degreeLevelLabels[program.level]} · {formatDuration(program.durationYears)} · {program.eligibilityTag}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-3 text-sm">
                    <Link to={`/programs/${program.slug}`} className="link">
                      Details
                    </Link>
                    <button type="button" onClick={clearProgram} className="link inline-flex items-center gap-1" aria-label={`Clear selected program ${program.name}`}>
                      <X className="h-3.5 w-3.5" aria-hidden /> Change
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <AdmissionEnquiryForm key={program?.slug ?? 'none'} defaultProgram={program?.slug ?? ''} />
              </div>
            </Reveal>

            <Reveal className="flex flex-col items-start gap-4 rounded-2xl bg-navy-radial p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="font-display text-lg font-bold text-white">Still choosing a program?</p>
                <p className="text-sm text-navy-100">Compare eligibility, curriculum and fees in the course finder.</p>
              </div>
              <ButtonLink to="/programs" variant="gold" icon={<Search className="h-4 w-4" aria-hidden />}>
                Explore programs
              </ButtonLink>
            </Reveal>
          </div>

          {/* Side panel */}
          <aside className="space-y-5" aria-label="Application help">
            <Reveal direction="left" className="card p-6">
              <h2 className="text-lg font-bold">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {nextSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">{i + 1}</span>
                    <div className="text-sm">
                      <p className="font-semibold text-navy-900">{s.title}</p>
                      <p className="text-ink-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal direction="left" delay={0.05} className="card p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <FileText className="h-5 w-5 text-royal-600" aria-hidden /> Documents to keep ready
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                {keyDocs.map((d) => (
                  <li key={d.name} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    {d.name}
                  </li>
                ))}
              </ul>
              <Link to="/admissions#documents" className="link mt-4 inline-flex items-center gap-1 text-sm">
                Full interactive checklist <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </Reveal>

            <Reveal direction="left" delay={0.1} className="card p-6">
              <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold">
                Key dates <DemoBadge label="Illustrative" />
              </h2>
              <div className="mt-4">
                <ImportantDates variant="compact" limit={3} />
              </div>
              <Link to="/admissions#dates" className="link mt-4 inline-flex items-center gap-1 text-sm">
                All important dates <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </Reveal>

            <Reveal direction="left" delay={0.15} className="rounded-2xl bg-navy-900 p-6 text-white">
              <h2 className="text-lg font-bold text-white">Admissions office</h2>
              <ul className="mt-4 space-y-3 text-sm text-navy-100">
                <li>
                  <a href={`tel:${admissions.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 font-semibold hover:text-white hover:underline">
                    <Phone className="h-4 w-4 text-gold-300" aria-hidden /> {admissions.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${admissions.email}`} className="inline-flex items-center gap-2 break-all font-semibold hover:text-white hover:underline">
                    <Mail className="h-4 w-4 shrink-0 text-gold-300" aria-hidden /> {admissions.email}
                  </a>
                </li>
                <li className="inline-flex items-center gap-2 text-navy-200">
                  <Clock className="h-4 w-4 text-gold-300" aria-hidden /> {admissions.hours}
                </li>
              </ul>
              <ButtonLink to="/admissions#visit" variant="outline-light" size="sm" className="mt-5">
                Book a campus visit
              </ButtonLink>
            </Reveal>
          </aside>
        </div>
      </Section>
    </>
  );
}
