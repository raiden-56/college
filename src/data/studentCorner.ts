import type { DownloadItem } from '@/types';

/**
 * DEMO STUDENT CORNER CONTENT — calendar dates, club names, squad composition and contacts are
 * illustrative. Replace with the approved academic calendar and committee notifications each year.
 */

export interface AcademicTerm {
  id: string;
  label: string;
  start: string; // ISO date
  end: string; // ISO date
  kind: 'Teaching' | 'Examinations' | 'Break' | 'Induction';
  note?: string;
}

export const academicYear = '2026–27';

export const academicCalendar: AcademicTerm[] = [
  { id: 't1', label: 'Induction programme — first-year students', start: '2026-07-27', end: '2026-08-07', kind: 'Induction' },
  { id: 't2', label: 'Odd semester — classes', start: '2026-08-03', end: '2026-11-20', kind: 'Teaching', note: 'Internal assessments in weeks 6 and 12' },
  { id: 't3', label: 'Odd semester — end examinations', start: '2026-11-25', end: '2026-12-15', kind: 'Examinations', note: 'Practical examinations precede theory papers' },
  { id: 't4', label: 'Winter break', start: '2026-12-16', end: '2027-01-03', kind: 'Break' },
  { id: 't5', label: 'Even semester — classes', start: '2027-01-04', end: '2027-04-23', kind: 'Teaching', note: 'Internal assessments in weeks 6 and 12' },
  { id: 't6', label: 'Even semester — end examinations', start: '2027-04-28', end: '2027-05-21', kind: 'Examinations' },
  { id: 't7', label: 'Summer vacation & internships', start: '2027-05-24', end: '2027-07-25', kind: 'Break', note: 'Recommended window for summer internships' },
];

const pdf = (id: string, title: string, sizeKb: number): DownloadItem => ({ id, title, url: '/downloads/placeholder.pdf', sizeKb, fileType: 'PDF' });

export const calendarDownload = pdf('sc-cal', `Academic Calendar ${academicYear}`, 210);

export const examDownloads: DownloadItem[] = [
  pdf('sc-exam-tt', 'End-semester examination timetable — Odd semester 2026', 320),
  pdf('sc-exam-rules', 'Examination rules & code of conduct', 160),
  pdf('sc-exam-reval', 'Revaluation & photocopy application procedure', 120),
  pdf('sc-exam-form', 'Supplementary examination application form', 90),
];

export const timetableDownloads: DownloadItem[] = [
  pdf('sc-tt-ug', 'Master timetable — UG programs (current semester)', 280),
  pdf('sc-tt-pg', 'Master timetable — PG programs (current semester)', 190),
  pdf('sc-tt-lab', 'Laboratory batch schedule', 140),
];

export const handbook = pdf('sc-handbook', `Student Handbook ${academicYear}`, 2600);

export const studyResources = [
  { title: 'Central library & e-resources', text: 'Books, journals and databases; reading hall open late during examinations.', to: '/campus' },
  { title: 'Department resources', text: 'Scheme & syllabus, lab manuals and department timetables on each department page.', to: '/departments' },
  { title: 'Program syllabus', text: 'Semester-wise subjects for every program, on the program pages.', to: '/programs' },
];

export type ClubCategory = 'Technical' | 'Cultural' | 'Literary' | 'Sports' | 'Social service' | 'Professional';

export interface Club {
  name: string;
  category: ClubCategory;
  description: string;
}

export const clubs: Club[] = [
  { name: 'Coding Club', category: 'Technical', description: 'Weekly problem-solving, hackathon prep and open-source sprints.' },
  { name: 'Robotics & Drone Society', category: 'Technical', description: 'Builds rovers, drones and competition robots in the innovation lab.' },
  { name: 'IoT Makers', category: 'Technical', description: 'Low-cost sensor projects for campus and community problems.' },
  { name: 'Music Club', category: 'Cultural', description: 'Classical, contemporary and fusion ensembles; performs at UTSAV.' },
  { name: 'Dance Collective', category: 'Cultural', description: 'Classical and contemporary dance, workshops and inter-college events.' },
  { name: 'Theatre & Film Society', category: 'Cultural', description: 'Street plays, stage productions and short-film screenings.' },
  { name: 'Literary & Debate Society', category: 'Literary', description: 'Debates, MUNs, quizzes and the student magazine.' },
  { name: 'Photography Club', category: 'Literary', description: 'Photo-walks, exhibitions and event coverage.' },
  { name: 'Sports Council', category: 'Sports', description: 'Team trials, inter-department leagues and the Annual Sports Meet.' },
  { name: 'Yoga & Wellness Circle', category: 'Sports', description: 'Morning yoga, mindfulness sessions and fitness challenges.' },
  { name: 'NSS Unit', category: 'Social service', description: 'Community service, blood donation camps and village outreach.' },
  { name: 'Eco Club', category: 'Social service', description: 'Campus sustainability drives, tree planting and waste audits.' },
  { name: 'Entrepreneurship Cell', category: 'Professional', description: 'Ideation sprints, founder talks and the incubation pipeline.' },
  { name: 'IEEE & ACM Student Chapters', category: 'Professional', description: 'Technical talks, workshops and competitions (chapter status to be verified).' },
];

export const clubCategories: ClubCategory[] = ['Technical', 'Cultural', 'Literary', 'Sports', 'Social service', 'Professional'];

export const counselling = {
  title: 'Student Wellness & Counselling Centre',
  description:
    'Free, confidential support from qualified counsellors for stress, anxiety, relationships, academic pressure or anything else on your mind. Sessions are private and are not shared with faculty or parents without your consent, except where safety requires it.',
  location: 'Student Services Building, Room 104',
  hours: 'Mon–Fri, 9:30 AM – 5:00 PM (appointments and walk-ins)',
  email: 'wellness@bgvsacc.org',
  phone: '+91 80 4000 1700',
  emergencyNote: 'In an emergency, contact campus security or call 112. For mental health support at any hour, the national Tele-MANAS helpline is 14416.',
};

export const welfareServices = [
  { title: 'Mentor–mentee system', text: 'Every student is assigned a faculty mentor for academic and personal guidance.' },
  { title: 'Health centre', text: 'On-campus first aid and visiting doctor; tie-up with a nearby hospital (to be configured).' },
  { title: 'Peer support', text: 'Trained student volunteers run peer listening circles and study groups.' },
  { title: 'Women’s cell', text: 'Safety, awareness programmes and support; works with the Internal Complaints Committee.' },
];

export const antiRaggingSquad = [
  { role: 'Chairperson — Anti-Ragging Squad', name: 'Senior faculty member (to be configured)', phone: '+91 80 4000 1801' },
  { role: 'Member — Hostel Warden (Men)', name: 'Name to be configured', phone: '+91 80 4000 1802' },
  { role: 'Member — Hostel Warden (Women)', name: 'Name to be configured', phone: '+91 80 4000 1803' },
  { role: 'Member — Student Welfare Officer', name: 'Name to be configured', phone: '+91 80 4000 1804' },
];

export const antiRaggingDownloads: DownloadItem[] = [
  pdf('ar-undertaking', 'Anti-ragging undertaking (student & parent)', 90),
  pdf('ar-policy', 'Anti-Ragging Policy & Committee', 210),
];

export const equalOpportunity = [
  { title: 'Accessibility support', text: 'Ramps, lifts, accessible washrooms, scribe and extra-time provisions for eligible students, and accessible digital material on request.' },
  { title: 'Equal Opportunity Cell', text: 'Guidance and support for students from disadvantaged groups; works with the SC/ST and OBC cells.' },
  { title: 'Reasonable accommodations', text: 'Individual learning plans arranged with the student, department and examination section.' },
];
