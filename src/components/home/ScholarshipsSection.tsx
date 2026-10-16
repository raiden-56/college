import { ArrowRight } from 'lucide-react';
import { scholarships } from '@/data/admissions';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getIcon } from '@/utils/icons';

/** Scholarship overview: intro column + 2 × 2 cards linking to the detailed admissions section. */
export function ScholarshipsSection() {
  return (
    <Section id="scholarships" tone="alt" labelledBy="scholarships-heading" size="lg">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="scholarships-heading"
            eyebrow="Scholarships & financial support"
            title="Talent should never be priced out"
            description="Merit awards, need-based concessions, government schemes and sports & cultural scholarships help make a Bapuji College education affordable."
            className="!mb-8"
          />
          <Reveal>
            <ButtonLink to="/admissions#scholarships" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Eligibility &amp; how to apply
            </ButtonLink>
            <p className="mt-4 text-sm text-ink-muted">Amounts marked “demo” are illustrative until the scholarship policy for the cycle is published.</p>
          </Reveal>
        </div>

        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2">
          {scholarships.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <StaggerItem as="li" key={s.title}>
                <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-6">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-300 via-gold-400 to-royal-500 opacity-70 transition-opacity group-hover:opacity-100" aria-hidden />
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700 transition-colors group-hover:bg-navy-900 group-hover:text-gold-300">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{s.text}</p>
                  <p className="mt-5 inline-flex self-start rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-800">{s.value}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
