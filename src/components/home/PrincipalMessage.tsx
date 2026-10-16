import { ArrowRight, Quote } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { principal } from '@/data/institution';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';

/** Principal's welcome: framed portrait with an overlapping name card beside the message. */
export function PrincipalMessage() {
  return (
    <Section id="principal" tone="alt" labelledBy="principal-heading" size="lg" className="overflow-hidden">
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Reveal direction="right" className="relative mx-auto w-full max-w-sm pb-10 lg:max-w-none">
          <div className="absolute inset-x-0 bottom-10 top-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-gold-300 sm:translate-x-6 sm:translate-y-6" aria-hidden />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-navy-100 shadow-lift">
            <SmartImage image={{ src: principal.photo.src, alt: `Portrait of ${principal.name}, ${principal.designation}` }} className="h-full w-full object-cover object-top" />
          </div>
          <div className="on-dark absolute bottom-0 left-5 right-5 rounded-2xl bg-navy-900 p-5 text-white shadow-lift">
            <p className="font-display text-lg font-bold text-white">{principal.name}</p>
            <p className="text-sm text-gold-200">
              {principal.designation}, {siteConfig.shortName}
            </p>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            id="principal-heading"
            eyebrow="From the Principal’s desk"
            title="Education is about more than degrees"
            description={siteConfig.demoMode ? <DemoBadge label="Demo profile" /> : undefined}
            className="!mb-6"
          />
          <Reveal delay={0.1}>
            <figure>
              <Quote className="h-10 w-10 text-royal-200" aria-hidden />
              <blockquote className="mt-4 space-y-4 text-lg leading-relaxed text-ink-soft">
                {principal.message.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </blockquote>
              <figcaption className="mt-6 border-l-4 border-gold-400 pl-4">
                <span className="block font-display font-bold text-navy-950">{principal.name}</span>
                <span className="block text-sm text-ink-muted">{principal.designation}</span>
              </figcaption>
            </figure>
            <ButtonLink to="/about/leadership" variant="secondary" className="mt-8" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Meet our leadership
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
