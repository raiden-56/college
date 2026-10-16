import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Department } from '@/types';
import { programsByDepartment } from '@/data/programs';
import { facultyByDepartment } from '@/data/faculty';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

interface DepartmentCardProps {
  department: Department;
  variant?: 'compact' | 'detailed';
  className?: string;
  headingLevel?: 'h2' | 'h3';
}

/** Department tile — compact (icon + name) for browsing, detailed for the directory. */
export function DepartmentCard({ department, variant = 'detailed', className, headingLevel: Heading = 'h3' }: DepartmentCardProps) {
  const Icon = getIcon(department.icon);
  const programCount = programsByDepartment(department.slug).length;
  const facultyCount = facultyByDepartment(department.slug).length;

  return (
    <article className={cn('card card-hover group relative flex h-full flex-col overflow-hidden p-6', className)}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-royal-50 transition-transform duration-500 group-hover:scale-150" aria-hidden />
      <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-gold-300 shadow-card transition-colors group-hover:bg-royal-700 group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <Heading className="relative mt-5 text-lg font-bold leading-snug">
        <Link to={`/departments/${department.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {variant === 'compact' ? department.shortName : department.name}
        </Link>
      </Heading>
      <p className="relative mt-2 text-sm text-ink-muted">{department.tagline}</p>
      {variant === 'detailed' && (
        <p className="relative mt-4 text-xs font-semibold uppercase tracking-wide text-navy-600">
          {programCount} program{programCount === 1 ? '' : 's'} · {facultyCount} faculty listed · Est. {department.established}
        </p>
      )}
      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-royal-700" aria-hidden>
        Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
    </article>
  );
}
