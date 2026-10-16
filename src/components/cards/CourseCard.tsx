import { ArrowUpRight, Clock, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Program } from '@/types';
import { getDepartment } from '@/data/departments';
import { degreeLevelLabels } from '@/data/programs';
import { formatDuration } from '@/utils/format';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';

interface CourseCardProps {
  program: Program;
  className?: string;
  /** Heading level for the card title to keep the page outline valid */
  headingLevel?: 'h2' | 'h3';
}

const levelTone: Record<Program['level'], string> = {
  UG: 'bg-royal-600',
  PG: 'bg-navy-800',
  Doctoral: 'bg-gold-600',
  Diploma: 'bg-sky-700',
  Certificate: 'bg-emerald-700',
};

/** Program summary card. The whole card is clickable via the title link's stretched pseudo-element. */
export function CourseCard({ program, className, headingLevel: Heading = 'h3' }: CourseCardProps) {
  const dept = getDepartment(program.departmentSlug);
  return (
    <article className={cn('card card-hover group relative flex h-full flex-col overflow-hidden', className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage image={program.image} decorative className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" aria-hidden />
        <span className={cn('absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow', levelTone[program.level])}>
          {degreeLevelLabels[program.level]}
        </span>
        {dept && <span className="absolute bottom-3 left-4 text-xs font-semibold text-white/90">{dept.shortName}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="text-lg font-bold leading-snug">
          <Link to={`/programs/${program.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {program.name}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{program.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-navy-700">
          <li className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-royal-600" aria-hidden />
            {formatDuration(program.durationYears)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-royal-600" aria-hidden />
            {program.eligibilityTag}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-royal-600" aria-hidden />
            {program.modes.join(' / ')}
          </li>
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-royal-700" aria-hidden>
          View details <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      {/* Focus ring for the stretched link */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
    </article>
  );
}
