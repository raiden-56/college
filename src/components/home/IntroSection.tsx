import { ArrowRight, Check } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { images } from '@/data/images';
import { departments } from '@/data/departments';
import { ParallaxImage, ParallaxLayer } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';

const highlights = [
  `${departments.length} academic departments under one campus, from engineering to law and education`,
  'Curriculum shaped with industry advisors, with internships and live projects built in',
  'Mentoring, counselling and accessibility support from the first day to graduation',
];

/** College introduction: layered image collage beside a short welcome and a link to the About page. */
export function IntroSection() {
  return (
    <Section id="home-intro" labelledBy="intro-heading" size="lg" className="overflow-hidden">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal direction="right" className="relative pb-10 sm:pb-12">
          <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-royal-100/70 blur-3xl" aria-hidden />
          <div className="relative mr-12 sm:mr-24">
            <ParallaxImage image={images.campusAerial} strength={8} className="aspect-[4/5] rounded-3xl shadow-lift sm:aspect-square" />
          </div>
          <ParallaxLayer offset={36} className="absolute bottom-0 right-0 w-[52%]">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border-[6px] border-white bg-navy-100 shadow-lift">
              <SmartImage image={images.library} className="h-full w-full object-cover" />
            </div>
          </ParallaxLayer>
          <div className="absolute left-3 top-6 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-lift sm:-left-4 sm:top-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-100">Established</p>
            <p className="mt-1 font-display text-3xl font-extrabold leading-none text-gold-300">{siteConfig.established}</p>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            id="intro-heading"
            eyebrow={`Welcome to ${siteConfig.shortName}`}
            title="A college where curiosity grows into character"
            description={`Since ${siteConfig.established}, ${siteConfig.shortName} has offered rigorous, values-driven higher education in ${siteConfig.address.city}. We teach students to think clearly, work with others and use what they learn for the good of their communities.`}
            className="!mb-8"
          />
          <Reveal delay={0.1}>
            <ul className="space-y-4">
              {highlights.map((h) => (
                <li key={h} className="flex gap-3 text-ink-soft">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royal-50 text-royal-700">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink to="/about" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Discover our college
              </ButtonLink>
              <ButtonLink to="/about/leadership" variant="ghost" size="lg">
                Leadership &amp; governance
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
