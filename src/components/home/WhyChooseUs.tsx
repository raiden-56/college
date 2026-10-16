import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { images } from '@/data/images';
import { whyChooseUs } from '@/data/institution';
import { siteConfig } from '@/config/site';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getIcon } from '@/utils/icons';

/** Why choose us: parallax photograph with a floating tagline card beside four numbered reasons. */
export function WhyChooseUs() {
  return (
    <Section id="why-us" labelledBy="why-heading" size="lg" className="overflow-hidden">
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="relative order-last pb-8 lg:order-first">
          <ParallaxImage image={images.groupStudy} strength={10} className="aspect-[4/5] rounded-3xl shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]" />
          <Reveal delay={0.15} className="absolute bottom-0 left-4 right-4 rounded-2xl border border-navy-100 bg-white/95 p-5 shadow-lift backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs">
            <Sparkles className="h-5 w-5 text-gold-500" aria-hidden />
            <p className="mt-2 font-display text-lg font-bold leading-snug text-navy-950">{siteConfig.tagline}</p>
            <p className="mt-1 text-sm text-ink-muted">Every student is paired with a faculty mentor from the first semester.</p>
          </Reveal>
        </div>

        <div>
          <SectionHeading
            id="why-heading"
            eyebrow="Why Crestwood"
            title="Four reasons families choose us"
            description="Great teaching, the right facilities, real-world exposure and care for every learner — working together."
          />
          <Stagger as="ul" className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {whyChooseUs.map((item, i) => {
              const Icon = getIcon(item.icon);
              return (
                <StaggerItem as="li" key={item.title} className="group">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-royal-50 text-royal-700 transition-colors duration-300 group-hover:bg-navy-900 group-hover:text-gold-300">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="font-display text-sm font-extrabold tracking-widest text-gold-600" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
          <Reveal className="mt-10">
            <Link to="/testimonials" className="link inline-flex items-center gap-1.5">
              Hear it from our students <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
