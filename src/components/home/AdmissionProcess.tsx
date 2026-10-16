import { ArrowRight, CalendarDays } from 'lucide-react';
import { admissionCycle, admissionSteps, importantDates } from '@/data/admissions';
import { siteConfig } from '@/config/site';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Section, SectionHeading } from '@/components/ui/Section';
import { formatDate } from '@/utils/format';
import { getIcon } from '@/utils/icons';

/** Admission process as a numbered timeline (vertical on mobile, horizontal on desktop) plus the next key dates. */
export function AdmissionProcess() {
  const today = new Date().toISOString().slice(0, 10);
  const nextDates = importantDates.filter((d) => d.date >= today).slice(0, 3);

  return (
    <Section id="admission-process" labelledBy="admission-steps-heading" size="lg">
      <SectionHeading
        id="admission-steps-heading"
        align="center"
        eyebrow={`Admissions ${admissionCycle}`}
        title="Five steps from enquiry to enrolment"
        description="A clear, transparent process — with a counsellor to guide you at every stage."
      />

      <div className="relative">
        <div
          className="absolute bottom-6 left-7 top-6 w-px bg-gradient-to-b from-royal-200 via-royal-300 to-gold-300 lg:bottom-auto lg:left-[10%] lg:right-[10%] lg:top-7 lg:h-px lg:w-auto lg:bg-gradient-to-r"
          aria-hidden
        />
        <Stagger as="ol" className="relative grid gap-8 lg:grid-cols-5 lg:gap-6" stagger={0.12}>
          {admissionSteps.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <StaggerItem as="li" key={step.title} className="group flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-navy-900 text-gold-300 shadow-card ring-8 ring-white transition-colors duration-300 group-hover:bg-royal-700 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden />
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-gold-400 text-xs font-extrabold text-navy-950" aria-hidden>
                    {i + 1}
                  </span>
                </span>
                <div className="pt-1 lg:pt-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-royal-700">Step {i + 1}</p>
                  <h3 className="mt-1 text-lg font-bold leading-snug">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      <Reveal className="mt-14 grid gap-6 rounded-3xl border border-navy-100 bg-surface-alt p-6 sm:p-8 lg:grid-cols-[minmax(0,1.6fr)_auto] lg:items-center">
        {nextDates.length > 0 ? (
          <div>
            <h3 className="flex flex-wrap items-center gap-2 text-base font-bold">
              <CalendarDays className="h-5 w-5 text-royal-600" aria-hidden /> Key dates ahead
              {siteConfig.demoMode && <DemoBadge label="Illustrative dates" />}
            </h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {nextDates.map((d) => (
                <li key={d.label} className="rounded-2xl bg-white p-4 shadow-card">
                  <p className="font-display text-lg font-extrabold text-navy-950">
                    <time dateTime={d.date}>{formatDate(d.date)}</time>
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-navy-800">{d.label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{d.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-ink-soft">The schedule for the next admission cycle will be published here soon.</p>
        )}
        <div className="flex flex-wrap gap-3 lg:flex-col">
          <ButtonLink to="/admissions/apply" variant="gold" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Apply now
          </ButtonLink>
          <ButtonLink to="/admissions" variant="secondary">
            Admissions hub
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
