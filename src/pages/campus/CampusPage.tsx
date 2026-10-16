import { ArrowRight, Compass, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { FilterChips } from '@/components/ui/Filters';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ParallaxLayer } from '@/components/motion/Parallax';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { FacilityBlock } from '@/components/campus/FacilityBlock';
import { facilities, facilityCategories } from '@/data/facilities';
import { infrastructureHighlights } from '@/data/institution';
import { images } from '@/data/images';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { getIcon } from '@/utils/icons';

export default function CampusPage() {
  const [filters, setFilter] = useUrlFilters({ category: 'all' });
  const category = (facilityCategories as string[]).includes(filters.category) ? filters.category : 'all';
  const shown = category === 'all' ? facilities : facilities.filter((f) => f.category === category);

  const chipOptions = [
    { value: 'all', label: 'All facilities', count: facilities.length },
    ...facilityCategories.map((c) => ({ value: c, label: c, count: facilities.filter((f) => f.category === c).length })),
  ];

  return (
    <>
      <Seo
        title="Campus & Facilities"
        description="Explore Crestwood College’s campus: library, labs, smart classrooms, hostels, sports, health care, transport, Wi-Fi and accessibility facilities."
      />
      <PageHero
        eyebrow="Campus life"
        title="Campus & facilities"
        description="A green, accessible campus with the spaces students need to learn, build, perform, play and rest — from a four-floor library and specialised labs to hostels, sports grounds and wellness services."
        image={images.heroCampus}
        size="lg"
        actions={
          <>
            <ButtonLink to="/campus/virtual-tour" variant="gold" icon={<Compass className="h-4 w-4" aria-hidden />}>
              Virtual tour
            </ButtonLink>
            <ButtonLink to="/campus/gallery" variant="outline-light" icon={<Images className="h-4 w-4" aria-hidden />}>
              Photo gallery
            </ButtonLink>
          </>
        }
      />

      <Section tone="white" id="facilities" labelledBy="facilities-heading">
        <SectionHeading
          id="facilities-heading"
          eyebrow="Facilities & amenities"
          title="Everything you need, on one campus"
          description="Filter by category or jump straight to a facility. Timings and contacts are listed where available — please confirm with the relevant office before visiting."
        />

        <FilterChips label="Filter facilities by category" value={category} onChange={(v) => setFilter('category', v)} options={chipOptions} />

        <nav aria-label="Jump to a facility" className="mt-6">
          <Stagger as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" stagger={0.04} key={category}>
            {shown.map((f) => {
              const Icon = getIcon(f.icon);
              return (
                <StaggerItem as="li" key={f.slug}>
                  <a
                    href={`#facility-${f.slug}`}
                    className="group flex h-full items-center gap-3 rounded-2xl border border-navy-100 bg-surface-alt p-3 text-sm font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:border-royal-200 hover:bg-white hover:shadow-card"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-royal-700 shadow-card transition group-hover:bg-navy-900 group-hover:text-gold-300">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="leading-snug">{f.name}</span>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        </nav>

        <p className="sr-only" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? 'facility' : 'facilities'}
          {category !== 'all' ? ` in ${category}` : ''}.
        </p>

        <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
          {shown.map((f, i) => (
            <FacilityBlock key={f.slug} facility={f} reverse={i % 2 === 1} />
          ))}
        </div>
      </Section>

      <Section tone="navy" id="infrastructure" labelledBy="infrastructure-heading" className="overflow-hidden">
        <ParallaxLayer offset={40} className="pointer-events-none absolute -right-24 top-0 h-80 w-80">
          <div className="h-full w-full rounded-full bg-royal-600/30 blur-3xl" aria-hidden />
        </ParallaxLayer>
        <SectionHeading
          id="infrastructure-heading"
          light
          eyebrow="Infrastructure at a glance"
          title="Built for learning at scale"
          description="Key campus figures. Values marked as demo data are illustrative and will be replaced with verified figures from the estate office and IQAC."
        />
        <Stagger as="ul" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {infrastructureHighlights.map((h) => (
            <StaggerItem as="li" key={h.label} className="glass flex flex-col rounded-2xl p-5 transition hover:-translate-y-1 hover:bg-white/15">
              <span className="font-display text-2xl font-extrabold text-white sm:text-3xl">{h.value}</span>
              <span className="mt-1 text-sm text-navy-100">{h.label}</span>
              {h.isDemo && <DemoBadge light className="mt-3 self-start" />}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="alt" id="explore" labelledBy="explore-heading">
        <SectionHeading id="explore-heading" eyebrow="Explore more" title="See the campus before you visit" align="center" />
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { to: '/campus/gallery', title: 'Photo gallery', text: 'Classrooms, labs, festivals, sports and hostel life — browse photos by category.', image: images.concert, icon: Images },
            { to: '/campus/virtual-tour', title: 'Virtual tour', text: 'Walk through key stops on campus, from the main gate to the sports complex.', image: images.campusAerial, icon: Compass },
          ].map((t, i) => (
            <Reveal key={t.to} delay={i * 0.1}>
              <Link to={t.to} className="group relative isolate flex min-h-[320px] flex-col justify-end overflow-hidden rounded-3xl p-6 text-white shadow-card transition hover:shadow-lift sm:p-8">
                <SmartImage image={t.image} decorative className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/50 to-navy-950/5" aria-hidden />
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gold-400 text-navy-950">
                  <t.icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="font-display text-2xl font-extrabold">{t.title}</span>
                <span className="mt-2 max-w-md text-navy-100">{t.text}</span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                  Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <EnquiryCTA title="Come and see the campus for yourself" description="Book a guided campus visit or talk to our admissions team about hostels, transport and facilities." />
    </>
  );
}
