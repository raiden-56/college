import type { SearchResult } from '@/types';
import { programs, degreeLevelLabels } from '@/data/programs';
import { departments } from '@/data/departments';
import { faculty } from '@/data/faculty';
import { posts } from '@/data/news';
import { events } from '@/data/events';
import { disclosures } from '@/data/disclosures';
import { faqs } from '@/data/faqs';
import { getDepartment } from '@/data/departments';
import { scoreMatch } from './search';

interface IndexEntry extends SearchResult {
  keywords: string;
  /** Short names / abbreviations, weighted like the title */
  aliases?: string;
}

const pages: IndexEntry[] = [
  { id: 'page-admissions', type: 'Page', title: 'Admissions', description: 'Eligibility, process, important dates and documents', to: '/admissions', keywords: 'apply application admission enquiry dates documents prospectus' },
  { id: 'page-fees', type: 'Page', title: 'Fee Structure', description: 'Course-wise fees, payment and refund policy', to: '/fees', keywords: 'fees tuition hostel transport payment refund' },
  { id: 'page-placements', type: 'Page', title: 'Placements & Careers', description: 'Training, recruiters and placement statistics', to: '/placements', keywords: 'jobs recruitment careers internship salary package' },
  { id: 'page-campus', type: 'Page', title: 'Campus Facilities', description: 'Library, labs, hostels, sports and more', to: '/campus', keywords: 'hostel library lab sports gym cafeteria transport wifi' },
  { id: 'page-student', type: 'Page', title: 'Student Corner', description: 'Calendar, exams, results, notices and welfare', to: '/student-corner', keywords: 'timetable calendar exam results syllabus anti-ragging grievance' },
  { id: 'page-contact', type: 'Page', title: 'Contact Us', description: 'Address, phone numbers, map and enquiry form', to: '/contact', keywords: 'address phone email map directions visit' },
  { id: 'page-research', type: 'Page', title: 'Research & Innovation', description: 'Research centres, publications and incubation', to: '/research', keywords: 'research publications patents incubation mou' },
  { id: 'page-alumni', type: 'Page', title: 'Alumni Network', description: 'Alumni stories, events and registration', to: '/alumni', keywords: 'alumni reunion mentorship' },
  { id: 'page-disclosures', type: 'Page', title: 'Mandatory Disclosures', description: 'Approvals, accreditation, IQAC and policies', to: '/disclosures', keywords: 'naac aicte ugc iqac aqar nirf disclosure policy committee' },
];

let cache: IndexEntry[] | null = null;

export const buildSearchIndex = (): IndexEntry[] => {
  if (cache) return cache;
  cache = [
    ...programs.map<IndexEntry>((p) => ({
      id: `program-${p.slug}`,
      type: 'Program',
      title: p.name,
      description: `${degreeLevelLabels[p.level]} · ${p.summary}`,
      to: `/programs/${p.slug}`,
      aliases: p.shortName,
      keywords: `${p.level} ${p.careers.join(' ')}`,
    })),
    ...departments.map<IndexEntry>((d) => ({
      id: `dept-${d.slug}`,
      type: 'Department',
      title: d.name,
      description: d.tagline,
      to: `/departments/${d.slug}`,
      aliases: d.shortName,
      keywords: d.research.join(' '),
    })),
    ...faculty.map<IndexEntry>((f) => ({
      id: `faculty-${f.slug}`,
      type: 'Faculty',
      title: f.name,
      description: `${f.designation}, ${getDepartment(f.departmentSlug)?.shortName ?? ''} · ${f.specialization}`,
      to: `/faculty/${f.slug}`,
      keywords: `${f.subjects.join(' ')} ${f.researchInterests.join(' ')}`,
    })),
    ...posts.map<IndexEntry>((p) => ({
      id: `post-${p.slug}`,
      type: 'News & Notices',
      title: p.title,
      description: p.excerpt,
      to: `/news/${p.slug}`,
      keywords: `${p.category} ${(p.tags ?? []).join(' ')}`,
    })),
    ...events.map<IndexEntry>((e) => ({
      id: `event-${e.slug}`,
      type: 'Event',
      title: e.title,
      description: e.summary,
      to: `/events/${e.slug}`,
      keywords: `${e.category} ${e.venue} ${e.organizer}`,
    })),
    ...disclosures.map<IndexEntry>((d) => ({
      id: `download-${d.id}`,
      type: 'Download',
      title: d.title,
      description: `${d.category} · ${d.academicYear}`,
      to: d.url,
      external: true,
      keywords: d.description ?? '',
    })),
    ...faqs.map<IndexEntry>((f, i) => ({
      id: `faq-${i}`,
      type: 'FAQ',
      title: f.question,
      description: f.answer,
      to: f.category === 'Fees' ? '/fees#faqs' : f.category === 'Campus' ? '/campus' : '/admissions#faqs',
      keywords: f.category ?? '',
    })),
    ...pages,
  ];
  return cache;
};

export const searchOrder: SearchResult['type'][] = ['Page', 'Program', 'Department', 'Faculty', 'News & Notices', 'Event', 'Download', 'FAQ'];

/** Ranked results for a query. */
export const searchSite = (query: string, limit = 50): SearchResult[] => {
  if (!query.trim()) return [];
  return buildSearchIndex()
    .map((entry) => ({
      entry,
      score: scoreMatch(query, [
        { text: entry.title, weight: 4 },
        { text: entry.aliases ?? '', weight: 4 },
        { text: entry.keywords, weight: 2 },
        { text: entry.description, weight: 1 },
      ]),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry: { keywords: _keywords, aliases: _aliases, ...result } }) => result);
};

/** Results grouped by type, in a stable display order. */
export const groupResults = (results: SearchResult[]) =>
  searchOrder
    .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
    .filter((g) => g.items.length > 0);
