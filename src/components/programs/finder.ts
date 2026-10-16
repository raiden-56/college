import type { DegreeLevel, DisciplineId, Program, StudyMode } from '@/types';
import { disciplineLabels, getDepartment } from '@/data/departments';
import { degreeLevelLabels, degreeLevels, programs } from '@/data/programs';
import { matchesQuery } from '@/utils/search';

/** Course-finder filter state (all values are strings so they can live in the URL). */
export const finderDefaults = { q: '', level: 'all', discipline: 'all', duration: 'all', eligibility: 'all', mode: 'all' };
export type FinderFilters = typeof finderDefaults;
export type FinderKey = keyof FinderFilters;

export const durationOptions = [
  { value: 'upto1', label: 'Up to 1 year', test: (y: number) => y <= 1 },
  { value: '2', label: '2 years', test: (y: number) => y > 1 && y <= 2 },
  { value: '3', label: '3 years', test: (y: number) => y > 2 && y <= 3 },
  { value: '4plus', label: '4 years or more', test: (y: number) => y > 3 },
] as const;

export const eligibilityOptions: Program['eligibilityTag'][] = ['10th Pass', '10+2 Science', '10+2 Any Stream', 'Bachelor’s Degree', 'Master’s Degree'];
export const studyModes: StudyMode[] = ['Full-time', 'Part-time', 'Hybrid', 'Online'];

export const sortOptions = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'az', label: 'Name: A–Z' },
  { value: 'za', label: 'Name: Z–A' },
  { value: 'duration-asc', label: 'Duration: shortest first' },
  { value: 'duration-desc', label: 'Duration: longest first' },
] as const;
export type SortValue = (typeof sortOptions)[number]['value'];

const disciplinesInUse = Array.from(new Set(programs.map((p) => p.discipline)));
export const disciplineOptions = (Object.keys(disciplineLabels) as DisciplineId[])
  .filter((d) => disciplinesInUse.includes(d))
  .map((d) => ({ value: d, label: disciplineLabels[d] }));

const levelOf = (value: string): DegreeLevel | null => (degreeLevels as string[]).includes(value) ? (value as DegreeLevel) : null;

/** Does a program match every active filter, optionally ignoring one key (for faceted counts)? */
export const matchesFilters = (p: Program, f: FinderFilters, ignore?: FinderKey) => {
  const dept = getDepartment(p.departmentSlug);
  if (ignore !== 'q' && !matchesQuery(f.q, p.name, p.shortName, p.summary, p.overview, p.careers.join(' '), dept?.name, disciplineLabels[p.discipline])) return false;
  if (ignore !== 'level' && f.level !== 'all' && p.level !== f.level) return false;
  if (ignore !== 'discipline' && f.discipline !== 'all' && p.discipline !== f.discipline) return false;
  if (ignore !== 'duration' && f.duration !== 'all') {
    const opt = durationOptions.find((o) => o.value === f.duration);
    if (opt && !opt.test(p.durationYears)) return false;
  }
  if (ignore !== 'eligibility' && f.eligibility !== 'all' && p.eligibilityTag !== f.eligibility) return false;
  if (ignore !== 'mode' && f.mode !== 'all' && !p.modes.includes(f.mode as StudyMode)) return false;
  return true;
};

export const sortPrograms = (list: Program[], sort: string) => {
  const sorted = [...list];
  switch (sort) {
    case 'az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'za':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'duration-asc':
      return sorted.sort((a, b) => a.durationYears - b.durationYears || a.name.localeCompare(b.name));
    case 'duration-desc':
      return sorted.sort((a, b) => b.durationYears - a.durationYears || a.name.localeCompare(b.name));
    default:
      // Catalogue order (degree level, then featured first)
      return sorted.sort((a, b) => degreeLevels.indexOf(a.level) - degreeLevels.indexOf(b.level) || Number(!!b.featured) - Number(!!a.featured));
  }
};

/** Human-readable label for an active filter value, used by the removable chips. */
export const filterValueLabel = (key: FinderKey, value: string) => {
  switch (key) {
    case 'q':
      return `“${value}”`;
    case 'level': {
      const level = levelOf(value);
      return level ? degreeLevelLabels[level] : value;
    }
    case 'discipline':
      return disciplineLabels[value as DisciplineId] ?? value;
    case 'duration':
      return durationOptions.find((o) => o.value === value)?.label ?? value;
    default:
      return value;
  }
};

export const filterKeyLabel: Record<FinderKey, string> = {
  q: 'Search',
  level: 'Level',
  discipline: 'Discipline',
  duration: 'Duration',
  eligibility: 'Eligibility',
  mode: 'Mode',
};
