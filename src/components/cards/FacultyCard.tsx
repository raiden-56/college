import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Faculty } from '@/types';
import { getDepartment } from '@/data/departments';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';

interface FacultyCardProps {
  faculty: Faculty;
  className?: string;
  headingLevel?: 'h2' | 'h3';
  /** Hide the bio for dense grids */
  compact?: boolean;
}

export function FacultyCard({ faculty, className, headingLevel: Heading = 'h3', compact }: FacultyCardProps) {
  const dept = getDepartment(faculty.departmentSlug);
  return (
    <article className={cn('card card-hover group relative flex h-full flex-col overflow-hidden', className)}>
      <div className="relative aspect-[4/4] overflow-hidden bg-navy-100">
        <SmartImage image={{ src: faculty.photo.src, alt: `Photograph of ${faculty.name}` }} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/80 to-transparent" aria-hidden />
        <p className="absolute bottom-3 left-4 right-4 text-xs font-semibold uppercase tracking-wide text-gold-200">{faculty.designation}</p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Heading className="text-lg font-bold leading-snug">
          <Link to={`/faculty/${faculty.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {faculty.name}
          </Link>
        </Heading>
        {dept && <p className="mt-0.5 text-sm font-medium text-royal-700">{dept.shortName}</p>}
        <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
          <li className="flex gap-2">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" aria-hidden />
            <span>{faculty.qualification}</span>
          </li>
          <li className="flex gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" aria-hidden />
            <span>{faculty.specialization}</span>
          </li>
        </ul>
        {!compact && <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{faculty.bio}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-royal-700" aria-hidden>
          View profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
    </article>
  );
}
