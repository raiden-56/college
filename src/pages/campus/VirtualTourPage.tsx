import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CalendarDays, Captions, ChevronLeft, ChevronRight, CheckCircle2, FileText, MapPin, Orbit, Pause, Play, PlugZap, Video } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { tourStops } from '@/components/campus/tourStops';
import { images } from '@/data/images';
import { cn } from '@/utils/cn';

const AUTOPLAY_MS = 9000;

export default function VirtualTourPage() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const count = tourStops.length;
  const stop = tourStops[index];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, count]);

  const go = (next: number, focus = false) => {
    const target = (next + count) % count;
    setIndex(target);
    if (focus) optionRefs.current[target]?.focus();
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const map: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: count - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    go(map[e.key], true);
  };

  // Alternate the pan direction per stop for a gentle Ken Burns effect
  const pan = index % 2 === 0 ? '-3%' : '3%';

  return (
    <>
      <Seo
        title="Virtual Campus Tour"
        description="Take a virtual tour of Bapuji College Karwar — main gate, library, labs, innovation lab, auditorium, hostels and sports complex — then book an in-person visit."
      />
      <PageHero
        eyebrow="Campus"
        title="Virtual campus tour"
        description="Walk through the places you’ll spend your days. Choose a stop to explore it, or press play for a guided tour. When you’re ready, book a visit and see it in person."
        image={images.campusAerial}
        actions={
          <>
            <a href="#tour" className="btn btn-md btn-gold">
              Start the tour
            </a>
            <ButtonLink to="/contact#visit" variant="outline-light" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
              Book a physical visit
            </ButtonLink>
          </>
        }
      />

      <Section tone="alt" id="tour" labelledBy="tour-heading">
        <SectionHeading
          id="tour-heading"
          eyebrow="Tour player"
          title="Explore the campus, stop by stop"
          description="Photographs are stand-ins until 360° panoramas are commissioned. Use the stop list (arrow keys move between stops) or the previous/next controls."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Player */}
          <div className="min-w-0">
            <div className="on-dark relative aspect-[4/3] overflow-hidden rounded-3xl bg-navy-950 shadow-lift sm:aspect-[16/10]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={stop.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={reduce ? false : { scale: 1.04, x: '0%' }}
                    animate={reduce ? undefined : { scale: 1.16, x: pan }}
                    transition={{ duration: 20, ease: 'linear' }}
                  >
                    <SmartImage image={{ src: stop.image.src.replace(/w=\d+/, 'w=1800'), alt: stop.image.alt }} className="h-full w-full object-cover" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-navy-950/30" aria-hidden />

              <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-6 sm:top-6">
                <Badge tone="white" icon={<MapPin className="h-3.5 w-3.5" aria-hidden />}>
                  Stop {index + 1} of {count}
                </Badge>
                <Badge tone="white" icon={<Orbit className="h-3.5 w-3.5" aria-hidden />}>
                  360° pending
                </Badge>
              </div>

              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-4 sm:p-6">
                <h3 className="max-w-[70%] text-2xl font-extrabold text-white sm:text-3xl">{stop.name}</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy-950"
                    aria-label={playing ? 'Pause guided tour' : 'Play guided tour'}
                    aria-pressed={playing}
                  >
                    {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy-950"
                    aria-label="Previous stop"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    className="grid h-11 w-11 place-items-center rounded-full bg-gold-400 text-navy-950 transition hover:bg-gold-300"
                    aria-label="Next stop"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>

              {/* progress bar */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden>
                <motion.div className="h-full bg-gold-400" animate={{ width: `${((index + 1) / count) * 100}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              Now viewing stop {index + 1} of {count}: {stop.name}.
            </p>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={stop.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="card mt-5 p-6 sm:p-7">
                <p className="text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">{stop.description}</p>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
                  {stop.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-ink-soft">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
                {stop.facilitySlug && (
                  <Link to={`/campus#facility-${stop.facilitySlug}`} className="link mt-5 inline-flex items-center gap-1.5 text-sm">
                    More about this facility <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stop list */}
          <div className="card self-start p-3 lg:sticky lg:top-28">
            <p id="tour-stops-label" className="px-3 pb-2 pt-2 text-xs font-bold uppercase tracking-[0.18em] text-royal-700">
              Tour stops
            </p>
            <ul role="listbox" aria-labelledby="tour-stops-label" aria-orientation="vertical" onKeyDown={onListKeyDown} className="space-y-1">
              {tourStops.map((s, i) => {
                const selected = i === index;
                return (
                  <li
                    key={s.id}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => go(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        go(i);
                      }
                    }}
                    className={cn(
                      'group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition',
                      selected ? 'bg-navy-900 text-white shadow-card' : 'text-navy-900 hover:bg-surface-sunken',
                    )}
                  >
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                      <SmartImage image={s.image} decorative className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block text-[0.6875rem] font-bold uppercase tracking-wider', selected ? 'text-gold-300' : 'text-ink-muted')}>Stop {i + 1}</span>
                      <span className="block truncate text-sm font-semibold">{s.name}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="white" id="immersive" labelledBy="immersive-heading">
        <SectionHeading
          id="immersive-heading"
          eyebrow="Coming soon"
          title="Immersive media"
          description="We are preparing 360° panoramas and a narrated video walkthrough. Until they are ready, these clearly marked slots show where they will appear."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-3xl border-2 border-dashed border-royal-200 bg-royal-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-royal-700 shadow-card">
                <Orbit className="h-6 w-6 motion-safe:animate-[spin_12s_linear_infinite]" aria-hidden />
              </span>
              <div>
                <h3 className="text-xl font-bold">360° view</h3>
                <Badge tone="gold" icon={<PlugZap className="h-3 w-3" aria-hidden />} className="mt-1">
                  Integration pending
                </Badge>
              </div>
            </div>
            <p className="mt-5 text-ink-soft">
              Each tour stop will open as an interactive panorama you can drag, swipe or explore with the keyboard. The panoramic photography has not been commissioned yet, so no 360° viewer is
              shown.
            </p>
            <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-ink-soft shadow-card">
              <p className="font-semibold text-navy-900">For the web team</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Add a <code className="rounded bg-navy-50 px-1 font-mono text-xs text-navy-800">panoramaUrl</code> to each stop in{' '}
                  <code className="rounded bg-navy-50 px-1 font-mono text-xs text-navy-800">src/components/campus/tourStops.ts</code>.
                </li>
                <li>Render an accessible panorama viewer (or the provider’s iframe with a descriptive title) in place of the photo in the tour player.</li>
                <li>Keep the photo and text description as the fallback for keyboard, screen-reader and low-bandwidth users.</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card">
            <div className="on-dark relative aspect-video bg-navy-950">
              <SmartImage image={images.graduation} decorative className="h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
                  <Video className="h-6 w-6" aria-hidden />
                </span>
                <p className="mt-3 font-display text-lg font-bold">Video walkthrough</p>
                <p className="text-sm text-navy-100">Being produced — not yet available</p>
              </div>
            </div>
            <div className="flex-1 p-6 sm:p-8">
              <h3 className="text-xl font-bold">Narrated campus walkthrough</h3>
              <p className="mt-2 text-ink-soft">A guided video tour narrated by students is in production. When it is published here, it will include:</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li className="flex gap-2.5">
                  <Captions className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                  Closed captions in English, with additional languages planned
                </li>
                <li className="flex gap-2.5">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />A full text transcript and audio-described version
                </li>
                <li className="flex gap-2.5">
                  <Pause className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                  Player controls that never auto-play with sound
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="sunken" id="visit" labelledBy="visit-heading" size="sm">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 id="visit-heading" className="text-2xl font-extrabold sm:text-3xl">
              Nothing beats being here
            </h2>
            <p className="mt-2 max-w-2xl text-ink-muted">Guided campus visits run Monday to Saturday. Meet faculty, see the labs and hostels, and get your questions answered by our admissions team.</p>
          </div>
          <ButtonLink to="/contact#visit" variant="primary" size="lg" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
            Book a physical visit
          </ButtonLink>
        </Reveal>
      </Section>

      <EnquiryCTA />
    </>
  );
}
