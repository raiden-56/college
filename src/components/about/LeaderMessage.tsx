import { ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ImageAsset } from '@/types';
import { Reveal } from '@/components/motion/Reveal';
import { ParallaxLayer } from '@/components/motion/Parallax';
import { SmartImage } from '@/components/ui/SmartImage';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { cn } from '@/utils/cn';

interface LeaderMessageProps {
  person: { name: string; designation: string; photo: ImageAsset };
  paragraphs: string[];
  eyebrow: string;
  title: string;
  /** id for the <h2>, pair with the parent Section's labelledBy */
  headingId: string;
  /** Show only the first N paragraphs and link to the full message */
  excerpt?: number;
  moreLink?: { to: string; label: string };
  /** Put the portrait on the right on large screens */
  reverse?: boolean;
}

/** Portrait + signed message from a leader (principal, chairman). */
export function LeaderMessage({ person, paragraphs, eyebrow, title, headingId, excerpt, moreLink, reverse }: LeaderMessageProps) {
  const shown = excerpt ? paragraphs.slice(0, excerpt) : paragraphs;
  const [lead, ...rest] = shown;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <Reveal className={cn('relative mx-auto w-full max-w-sm lg:max-w-none', reverse && 'lg:order-2')}>
        <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-royal-100 via-sky-50 to-gold-100 sm:-inset-3 sm:rotate-2" aria-hidden />
        <figure className="relative overflow-hidden rounded-3xl bg-navy-100 shadow-lift">
          <SmartImage image={{ src: person.photo.src, alt: `Portrait of ${person.name}, ${person.designation}` }} className="aspect-[4/5] w-full object-cover object-top" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent p-5 pt-16 text-white">
            <p className="font-display text-lg font-bold">{person.name}</p>
            <p className="text-sm text-navy-100">{person.designation}</p>
          </figcaption>
        </figure>
        <ParallaxLayer offset={24} className="absolute -bottom-6 -right-3 hidden sm:block">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-400 text-navy-950 shadow-glow">
            <Quote className="h-7 w-7" aria-hidden />
          </span>
        </ParallaxLayer>
      </Reveal>

      <Reveal>
        <p className="eyebrow">
          <span className="h-px w-6 bg-royal-600" aria-hidden />
          {eyebrow}
        </p>
        <h2 id={headingId} className="mt-3 text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
          {title}
        </h2>
        <blockquote className="mt-6">
          {lead && <p className="border-l-4 border-gold-400 pl-5 font-display text-lg font-semibold leading-relaxed text-navy-900 sm:text-xl">{lead}</p>}
          {rest.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </blockquote>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm">
            <span className="block font-display text-base font-bold text-navy-950">— {person.name}</span>
            <span className="text-ink-muted">{person.designation}</span>
          </p>
          <DemoBadge label="Fictional name" />
        </div>
        {moreLink && (
          <Link to={moreLink.to} className="link mt-6 inline-flex items-center gap-1.5">
            {moreLink.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </Reveal>
    </div>
  );
}
