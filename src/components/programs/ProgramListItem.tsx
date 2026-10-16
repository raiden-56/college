import { ArrowRight, Clock, GraduationCap, MonitorSmartphone, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Program } from '@/types';
import { getDepartment } from '@/data/departments';
import { degreeLevelLabels } from '@/data/programs';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/utils/format';
import { cn } from '@/utils/cn';

interface ProgramListItemProps {
  program: Program;
  className?: string;
  headingLevel?: 'h2' | 'h3';
}

/** Compact horizontal program row for the course finder's list view. Whole row is clickable. */
export function ProgramListItem({ program, className, headingLevel: Heading = 'h3' }: ProgramListItemProps) {
  const dept = getDepartment(program.departmentSlug);
  return (
    <article className={cn('card card-hover group relative flex flex-col overflow-hidden sm:flex-row', className)}>
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-52">
        <SmartImage image={program.image} decorative className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/30 to-transparent" aria-hidden />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="navy">{degreeLevelLabels[program.level]}</Badge>
          {dept && <span className="text-xs font-semibold text-royal-700">{dept.shortName}</span>}
        </div>
        <Heading className="text-lg font-bold leading-snug">
          <Link to={`/programs/${program.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {program.name}
          </Link>
        </Heading>
        <p className="line-clamp-2 text-sm text-ink-muted">{program.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-navy-700">
          <li className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-royal-600" aria-hidden />
            {formatDuration(program.durationYears)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-royal-600" aria-hidden />
            {program.eligibilityTag}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <MonitorSmartphone className="h-3.5 w-3.5 text-royal-600" aria-hidden />
            {program.modes.join(' / ')}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-royal-600" aria-hidden />
            {program.intake} seats
          </li>
        </ul>
      </div>
      <span className="hidden shrink-0 items-center pr-6 text-royal-700 md:flex" aria-hidden>
        <span className="grid h-11 w-11 place-items-center rounded-full border border-navy-100 transition group-hover:border-royal-600 group-hover:bg-royal-700 group-hover:text-white">
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
    </article>
  );
}
