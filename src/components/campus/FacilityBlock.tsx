import { CheckCircle2, Clock, Mail } from 'lucide-react';
import type { Facility } from '@/types';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';

interface FacilityBlockProps {
  facility: Facility;
  /** Put the photo on the right on large screens (alternating rhythm) */
  reverse?: boolean;
}

/** Split layout for one facility: parallax photo + icon, description, details, timings and contact. */
export function FacilityBlock({ facility: f, reverse }: FacilityBlockProps) {
  const Icon = getIcon(f.icon);
  const headingId = `facility-${f.slug}-heading`;
  return (
    <article id={`facility-${f.slug}`} aria-labelledby={headingId} className="scroll-mt-32 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <Reveal direction={reverse ? 'left' : 'right'} className={cn('relative', reverse && 'lg:order-2')}>
        <ParallaxImage image={f.image} strength={10} className="aspect-[4/3] rounded-3xl shadow-lift" />
        <div className="pointer-events-none absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border border-navy-100 bg-white/95 px-4 py-3 shadow-card backdrop-blur sm:left-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-300">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-royal-700">{f.category}</span>
        </div>
        <div className={cn('absolute -z-10 hidden h-40 w-40 rounded-full bg-royal-100 blur-2xl lg:block', reverse ? '-left-10 -top-10' : '-right-10 -top-10')} aria-hidden />
      </Reveal>

      <Reveal direction={reverse ? 'right' : 'left'} delay={0.1} className="pt-4 lg:pt-0">
        <h3 id={headingId} className="text-2xl font-extrabold sm:text-3xl">
          {f.name}
        </h3>
        <p className="mt-3 text-pretty text-base leading-relaxed text-ink-soft sm:text-lg">{f.summary}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {f.details.map((d) => (
            <li key={d} className="flex gap-2.5 text-sm text-ink-soft">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
              <span>{d}</span>
            </li>
          ))}
        </ul>
        {(f.timings || f.contact) && (
          <dl className="mt-6 flex flex-wrap gap-3">
            {f.timings && (
              <div className="flex items-center gap-2 rounded-xl bg-surface-sunken px-3.5 py-2 text-sm">
                <Clock className="h-4 w-4 text-royal-700" aria-hidden />
                <dt className="sr-only">Timings</dt>
                <dd className="font-medium text-navy-900">{f.timings}</dd>
              </div>
            )}
            {f.contact && (
              <div className="flex min-w-0 items-center gap-2 rounded-xl bg-surface-sunken px-3.5 py-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-royal-700" aria-hidden />
                <dt className="sr-only">Contact</dt>
                <dd className="min-w-0 break-all">
                  <a href={`mailto:${f.contact}`} className="link">
                    {f.contact}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        )}
      </Reveal>
    </article>
  );
}
