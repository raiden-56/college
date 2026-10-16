import { describe, expect, it } from 'vitest';
import { programs } from '../programs';
import { departments } from '../departments';
import { faculty } from '../faculty';
import { posts } from '../news';
import { events, pastEvents, upcomingEvents } from '../events';
import { alumni } from '../alumni';
import { testimonials } from '../testimonials';
import { placementRate, placementYears } from '../placements';

const unique = (values: string[]) => new Set(values).size === values.length;

/** Guards against broken links when content editors change the data files. */
describe('content integrity', () => {
  it('has unique slugs', () => {
    expect(unique(programs.map((p) => p.slug))).toBe(true);
    expect(unique(departments.map((d) => d.slug))).toBe(true);
    expect(unique(faculty.map((f) => f.slug))).toBe(true);
    expect(unique(posts.map((p) => p.slug))).toBe(true);
    expect(unique(events.map((e) => e.slug))).toBe(true);
  });

  it('references existing departments everywhere', () => {
    const slugs = new Set(departments.map((d) => d.slug));
    programs.forEach((p) => expect(slugs, p.slug).toContain(p.departmentSlug));
    faculty.forEach((f) => expect(slugs, f.slug).toContain(f.departmentSlug));
    alumni.forEach((a) => expect(slugs, a.id).toContain(a.departmentSlug));
    testimonials.filter((t) => t.departmentSlug).forEach((t) => expect(slugs).toContain(t.departmentSlug));
  });

  it('assigns every department head to a faculty member of that department', () => {
    departments.forEach((d) => {
      const hod = faculty.find((f) => f.slug === d.hod.facultySlug);
      expect(hod, d.slug).toBeDefined();
      expect(hod?.departmentSlug).toBe(d.slug);
    });
  });

  it('gives every program a syllabus matching its semester count and a tuition fee', () => {
    programs.forEach((p) => {
      expect(p.syllabus.length, p.slug).toBe(p.semesters);
      expect(p.fees.some((f) => f.kind === 'tuition' && f.amount > 0), p.slug).toBe(true);
    });
  });

  it('splits events into upcoming and past around a given date', () => {
    const now = new Date('2026-10-16T12:00:00+05:30');
    const up = upcomingEvents(now);
    const past = pastEvents(now);
    expect(up.length + past.length).toBe(events.length);
    expect(up.map((e) => e.startDate)).toEqual([...up.map((e) => e.startDate)].sort());
    expect(past.every((e) => new Date(e.endDate ?? e.startDate) < now)).toBe(true);
  });

  it('marks all placement figures as demo and computes rates', () => {
    expect(placementYears.every((y) => y.isDemo)).toBe(true);
    expect(placementRate({ studentsPlaced: 571, eligibleStudents: 705 })).toBe(81);
    expect(placementRate({ studentsPlaced: 0, eligibleStudents: 0 })).toBe(0);
  });
});
