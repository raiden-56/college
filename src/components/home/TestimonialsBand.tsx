import { ArrowRight } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { siteConfig } from '@/config/site';
import { Reveal } from '@/components/motion/Reveal';
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Section, SectionHeading } from '@/components/ui/Section';

/** Navy testimonials band with the accessible carousel (consented testimonials only). */
export function TestimonialsBand() {
  const items = testimonials.filter((t) => t.consentRecorded);
  if (items.length === 0) return null;

  return (
    <Section id="testimonials" tone="navy" labelledBy="testimonials-heading" size="lg" className="overflow-hidden">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-royal-500/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" aria-hidden />
      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            id="testimonials-heading"
            light
            eyebrow="In their words"
            title="Students, alumni and parents on life at Crestwood"
            description="Honest reflections from people who know the college best — shared with their written consent."
            className="!mb-8"
          />
          <Reveal className="flex flex-wrap items-center gap-4">
            <ButtonLink to="/testimonials" variant="outline-light" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              More stories
            </ButtonLink>
            {siteConfig.demoMode && <DemoBadge light label="Demo testimonials" />}
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <TestimonialCarousel items={items} light label="Testimonials from students, alumni and parents" />
        </Reveal>
      </div>
    </Section>
  );
}
