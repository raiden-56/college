import { images } from '@/data/images';
import { institutionStats } from '@/data/institution';
import { siteConfig } from '@/config/site';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/Section';
import { StatBlock } from '@/components/ui/StatBlock';

/** Full-bleed navy band with a drifting photograph and animated institutional statistics. */
export function StatsBand() {
  const hasDemo = siteConfig.demoMode && institutionStats.some((s) => s.isDemo);

  return (
    <section aria-labelledby="stats-heading" className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <ParallaxImage image={images.graduation} strength={16} className="absolute inset-0 -z-20" imgClassName="opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950 via-navy-950/90 to-royal-950/80" aria-hidden />
      <div className="absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" aria-hidden />

      <div className="container grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:items-center lg:gap-16">
        <SectionHeading
          id="stats-heading"
          light
          eyebrow="At a glance"
          title="A community built over decades"
          description="Thousands of graduates, hundreds of educators and one shared commitment to learning that lasts."
          className="!mb-0"
        />
        <Stagger as="ul" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3" stagger={0.1}>
          {institutionStats.map((stat) => (
            <StaggerItem as="li" key={stat.label} className="border-l border-white/15 pl-5">
              <StatBlock stat={stat} light />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      {hasDemo && (
        <p className="container mt-12 text-xs text-navy-200">Figures marked “Demo data” are placeholders awaiting verification by the institution.</p>
      )}
    </section>
  );
}
