import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Compass, MapPin } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { images } from '@/data/images';
import { upcomingEvents } from '@/data/events';
import { programs } from '@/data/programs';
import { departments } from '@/data/departments';
import { ButtonLink } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { dateParts, formatTime } from '@/utils/format';

const ease = [0.22, 1, 0.36, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});

/**
 * Full-screen home hero: campus photograph with a slow settle-in zoom and scroll-linked drift,
 * content that eases away as the visitor scrolls, and a floating "next on campus" card.
 * Transforms are skipped under prefers-reduced-motion.
 */
export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const upcoming = upcomingEvents();
  const nextEvent = upcoming.find((e) => e.category === 'Admissions') ?? upcoming[0];
  const eventDate = nextEvent ? dateParts(nextEvent.startDate) : null;

  return (
    <section
      ref={ref}
      aria-labelledby="home-hero-heading"
      className="on-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-950 pb-28 pt-36 text-white sm:pt-44 lg:pb-32"
    >
      {/* Background photograph: scroll drift (outer) + one-off slow zoom on load (inner) */}
      <motion.div className="absolute inset-0 -z-30" style={reduce ? undefined : { y: bgY, scale: bgScale }} aria-hidden>
        <motion.div className="h-full w-full" initial={{ scale: 1.14 }} animate={{ scale: 1 }} transition={{ duration: 9, ease: [0.16, 1, 0.3, 1] }}>
          <SmartImage image={images.heroCampus} decorative priority className="h-full w-full object-cover" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-20 bg-hero-fade" aria-hidden />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-navy-950/95 via-navy-950/60 to-navy-950/10" aria-hidden />
      <div
        className="absolute inset-0 -z-10 bg-grid-faint bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
        aria-hidden
      />
      <div className="absolute -left-40 top-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-royal-600/25 blur-3xl" aria-hidden />

      <motion.div
        className="container grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_21rem] xl:gap-20"
        style={reduce ? { opacity: contentOpacity } : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl">
          <motion.p className="eyebrow eyebrow-light" {...rise(0.1)}>
            <span className="h-px w-8 bg-gold-300" aria-hidden />
            {siteConfig.shortName} · Est. {siteConfig.established} · {siteConfig.address.city}
          </motion.p>
          <motion.h1 id="home-hero-heading" className="mt-6 text-balance text-[2.6rem] font-extrabold leading-[1.04] text-white sm:text-6xl lg:text-7xl" {...rise(0.2)}>
            <span className="sr-only">{siteConfig.name}: </span>
            Learn deeply.{' '}
            <span className="bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 bg-clip-text text-transparent">Lead responsibly.</span>
          </motion.h1>
          <motion.p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-navy-100 sm:text-xl" {...rise(0.35)}>
            Undergraduate, postgraduate and doctoral programs across engineering, sciences, management, law, humanities and education — taught by
            mentors who know your name, on a green campus in {siteConfig.address.city}’s Electronic City.
          </motion.p>

          <motion.div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4" {...rise(0.5)}>
            <ButtonLink to="/programs" variant="gold" size="lg" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Explore Programs
            </ButtonLink>
            <ButtonLink to="/admissions/apply" variant="outline-light" size="lg">
              Apply Now
            </ButtonLink>
            <Link
              to="/campus/virtual-tour"
              className="group inline-flex items-center gap-3 rounded-full py-2 pl-1 pr-3 text-base font-semibold text-white transition hover:text-gold-200"
            >
              <span className="glass grid h-12 w-12 place-items-center rounded-full transition group-hover:scale-105 group-hover:bg-white/20">
                <Compass className="h-5 w-5 text-gold-300" aria-hidden />
              </span>
              Virtual Campus Tour
            </Link>
          </motion.div>

          <motion.dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6 text-sm" {...rise(0.65)}>
            {[
              { term: 'Programs', value: programs.length },
              { term: 'Departments', value: departments.length },
              { term: 'Years of teaching', value: new Date().getFullYear() - siteConfig.established },
            ].map((item) => (
              <div key={item.term} className="flex flex-col-reverse">
                <dt className="text-navy-200">{item.term}</dt>
                <dd className="font-display text-2xl font-extrabold text-white">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {nextEvent && eventDate && (
          <motion.aside
            aria-label="Next on campus"
            className="w-full max-w-sm lg:mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease }}
          >
            <div className="glass rounded-3xl p-6 shadow-lift motion-safe:animate-float">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-300">Next on campus</p>
              <div className="mt-4 flex gap-4">
                <div className="flex w-16 shrink-0 flex-col items-center rounded-2xl bg-white py-2.5 text-navy-950 shadow-card">
                  <span className="text-xs font-bold uppercase tracking-wider text-royal-700">{eventDate.month}</span>
                  <span className="font-display text-2xl font-extrabold leading-none">{eventDate.day}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold leading-snug text-white">{nextEvent.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-100">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gold-300" aria-hidden />
                    <time dateTime={nextEvent.startDate}>{formatTime(nextEvent.startDate)}</time>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-navy-100">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-300" aria-hidden />
                    <span className="truncate">{nextEvent.venue}</span>
                  </p>
                </div>
              </div>
              <Link
                to={`/events/${nextEvent.slug}`}
                className="mt-5 inline-flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-navy-950"
              >
                Details &amp; registration
                <ArrowUpRight className="h-4 w-4" aria-hidden />
                <span className="sr-only">: {nextEvent.title}</span>
              </Link>
            </div>
          </motion.aside>
        )}
      </motion.div>

      <a
        href="#recognition"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy-100 transition hover:text-white sm:flex"
      >
        Scroll to explore
        <ChevronDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
