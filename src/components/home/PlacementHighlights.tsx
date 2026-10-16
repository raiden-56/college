import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { latestPlacementYear, placementRate, recruiters } from '@/data/placements';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { Section, SectionHeading } from '@/components/ui/Section';
import { formatNumber } from '@/utils/format';

/**
 * Placement snapshot. Every figure here is illustrative (isDemo) — it is always shown with the academic year,
 * eligible/placed counts, a demo notice and a link to the full methodology. Never present these as real results.
 */
export function PlacementHighlights() {
  const y = latestPlacementYear;
  if (!y) return null;
  const rate = placementRate(y);
  const sectors = Array.from(new Set(recruiters.map((r) => r.sector))).slice(0, 8);
  const recruitersDemo = recruiters.some((r) => r.isDemo);

  const facts = [
    { label: 'Eligible students', value: formatNumber(y.eligibleStudents) },
    { label: 'Students placed', value: formatNumber(y.studentsPlaced) },
    { label: 'Companies visited', value: formatNumber(y.companiesVisited) },
    { label: 'Median package (CTC)', value: `₹${y.medianPackageLpa} LPA` },
  ];

  return (
    <Section id="placements" labelledBy="placements-heading" size="lg">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="placements-heading"
            eyebrow="Placements & careers"
            title="Preparing graduates for meaningful careers"
            description="The Training & Placement Cell runs aptitude training, mock interviews, internships and recruitment drives from the third year onwards — and supports students choosing higher studies or entrepreneurship."
            className="!mb-8"
          />
          <Reveal delay={0.05}>
            {y.isDemo && (
              <DemoNotice title="Illustrative placement figures">
                The numbers for {y.academicYear} are sample values that demonstrate how results will be reported. They are not the college’s actual placement
                record and will be replaced with figures verified by the Training &amp; Placement Cell.
              </DemoNotice>
            )}
            <div className="mt-6 flex gap-3 rounded-2xl border border-navy-100 bg-surface-alt p-5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
              <div>
                <h3 className="text-base font-bold">How the placement rate is calculated</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  Students placed ÷ eligible students × 100. Students who opted for higher studies or entrepreneurship are reported separately and excluded
                  from the eligible count.
                </p>
              </div>
            </div>
            <ButtonLink to="/placements" className="mt-8" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Full report &amp; methodology
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal direction="left" className="on-dark relative overflow-hidden rounded-3xl bg-navy-radial p-6 text-white shadow-lift sm:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/10 blur-2xl" aria-hidden />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-navy-100">
              Academic year <span className="text-white">{y.academicYear}</span>
            </p>
            {y.isDemo && <DemoBadge light label="Illustrative" />}
          </div>

          <p className="relative mt-6 font-display text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
            <CountUp value={rate} decimals={1} suffix="%" />
          </p>
          <p className="relative mt-2 text-navy-100">
            placement rate — {formatNumber(y.studentsPlaced)} of {formatNumber(y.eligibleStudents)} eligible students placed
          </p>
          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-gold-400 to-gold-200"
              style={{ width: `${rate}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <dl className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse">
                <dt className="text-xs font-medium uppercase tracking-wide text-navy-200">{f.label}</dt>
                <dd className="font-display text-2xl font-bold text-white">{f.value}</dd>
              </div>
            ))}
          </dl>

          {sectors.length > 0 && (
            <div className="relative mt-8">
              <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                Recruiter sectors {recruitersDemo && <DemoBadge light label="Placeholder" />}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sectors.map((s) => (
                  <li key={s} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-navy-100">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
