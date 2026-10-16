import type { CollegeEvent } from '@/types';
import { images } from './images';

/** DEMO EVENTS — replace with events published via the CMS. */
export const events: CollegeEvent[] = [
  {
    slug: 'open-day-2026',
    title: 'Campus Open Day 2026',
    category: 'Admissions',
    startDate: '2026-11-08T09:30:00+05:30',
    endDate: '2026-11-08T16:00:00+05:30',
    venue: 'Main Auditorium & Campus',
    summary: 'Meet faculty, tour the labs and hostels, and get your admission questions answered.',
    content: [
      'Prospective students and parents are invited to Campus Open Day. The day includes department presentations, guided campus tours, lab demonstrations and one-to-one counselling with the admissions team.',
      'Registration is recommended so we can plan tours. Walk-ins are welcome subject to capacity.',
    ],
    image: images.campusAerial,
    organizer: 'Office of Admissions',
    registrationUrl: '/contact#visit',
  },
  {
    slug: 'techfest-ignite-2026',
    title: 'IGNITE — Annual Technical Festival',
    category: 'Conference',
    startDate: '2026-11-20T09:00:00+05:30',
    endDate: '2026-11-22T18:00:00+05:30',
    venue: 'Engineering Blocks A–C',
    summary: 'Three days of hackathons, robotics challenges, project expos and tech talks.',
    content: [
      'IGNITE brings together students from colleges across the region for hackathons, robotics challenges, paper presentations and an innovation expo.',
      'External participants can register online; Crestwood students register through their department coordinators.',
    ],
    image: images.robotics,
    organizer: 'Student Council & Engineering Departments',
    registrationUrl: '/contact',
  },
  {
    slug: 'genai-workshop',
    title: 'Generative AI in Practice — Hands-on Workshop',
    category: 'Workshop',
    startDate: '2026-11-14T10:00:00+05:30',
    endDate: '2026-11-14T16:00:00+05:30',
    venue: 'AI & ML Lab, Block A',
    summary: 'A practical, one-day workshop on building responsible applications with modern AI tools.',
    content: ['Participants will learn prompt design, retrieval techniques and evaluation methods, and discuss responsible use of AI in academic and professional work. Laptops required.'],
    image: images.coding,
    organizer: 'Department of Computer Science & Engineering',
  },
  {
    slug: 'annual-sports-meet-2026',
    title: 'Annual Sports Meet',
    category: 'Sports',
    startDate: '2026-12-15T08:00:00+05:30',
    endDate: '2026-12-17T17:00:00+05:30',
    venue: 'College Sports Complex',
    summary: 'Track and field, team sports and inter-department championships.',
    content: ['The Annual Sports Meet features athletics, football, basketball, volleyball, cricket and indoor games. Inter-department trophies are awarded at the closing ceremony.'],
    image: images.sportsTrack,
    organizer: 'Department of Physical Education',
  },
  {
    slug: 'utsav-cultural-fest-2027',
    title: 'UTSAV — Inter-College Cultural Festival',
    category: 'Cultural',
    startDate: '2027-01-30T10:00:00+05:30',
    endDate: '2027-02-01T21:00:00+05:30',
    venue: 'Open Air Theatre',
    summary: 'Music, dance, theatre, literary events and a food street celebrating campus culture.',
    content: ['UTSAV is the college’s flagship cultural festival, with performances, competitions and workshops by students from across the state.'],
    image: images.concert,
    organizer: 'Cultural Committee',
  },
  {
    slug: 'national-conference-intelligent-systems',
    title: 'National Conference on Intelligent Systems',
    category: 'Conference',
    startDate: '2027-02-20T09:00:00+05:30',
    endDate: '2027-02-21T17:30:00+05:30',
    venue: 'Seminar Hall 1',
    summary: 'Paper presentations and keynotes on AI, data science and intelligent systems.',
    content: ['The conference invites original research papers. Accepted papers will be presented in technical sessions. Call for papers and important dates are in the attached brochure.'],
    image: images.conference,
    organizer: 'Department of Computer Science & Engineering',
    attachments: [{ title: 'Call for Papers', url: '/downloads/placeholder.pdf', sizeKb: 310 }],
  },
  {
    slug: 'alumni-homecoming-2026',
    title: 'Alumni Homecoming 2026',
    category: 'Alumni',
    startDate: '2026-12-20T17:00:00+05:30',
    venue: 'Central Lawn',
    summary: 'An evening for graduates of all batches to reconnect with friends and faculty.',
    content: ['All alumni are invited to the annual homecoming. The evening includes a campus walk, batch reunions, and recognition of alumni achievers.'],
    image: images.friends,
    organizer: 'Alumni Association',
    registrationUrl: '/alumni#register',
  },
  {
    slug: 'budget-analysis-panel',
    title: 'Union Budget Analysis Panel',
    category: 'Seminar',
    startDate: '2027-02-02T14:00:00+05:30',
    venue: 'Management Block Seminar Room',
    summary: 'Faculty and industry experts discuss the key announcements of the Union Budget.',
    content: ['A panel discussion analysing the Union Budget’s implications for businesses, taxation and personal finance. Open to all students.'],
    image: images.business,
    organizer: 'School of Commerce & Management',
  },
  // Past events (archive)
  {
    slug: 'convocation-2026',
    title: 'Annual Convocation 2026',
    category: 'Conference',
    startDate: '2026-08-22T10:00:00+05:30',
    venue: 'Main Auditorium',
    summary: 'Degrees were conferred on graduating students of the 2026 batch.',
    content: ['The Annual Convocation celebrated the achievements of the graduating batch. Rank holders and medal winners were felicitated.'],
    image: images.graduation,
    organizer: 'Office of the Principal',
  },
  {
    slug: 'literary-festival-2026',
    title: 'Crestwood Literary Festival 2026',
    category: 'Cultural',
    startDate: '2026-02-05T10:00:00+05:30',
    endDate: '2026-02-06T18:00:00+05:30',
    venue: 'Arts Block',
    summary: 'Readings, panels and writing workshops with authors and students.',
    content: ['The literary festival featured readings, panel discussions and creative writing workshops.'],
    image: images.humanities,
    organizer: 'Department of Humanities & Social Sciences',
  },
  {
    slug: 'research-day-2026',
    title: 'Student Research Day 2026',
    category: 'Seminar',
    startDate: '2026-04-10T09:30:00+05:30',
    venue: 'Science Block',
    summary: 'Poster and oral presentations of student research projects across departments.',
    content: ['Over a hundred student projects were presented across science, engineering, management and humanities. (Demo figure — replace with verified count.)'],
    image: images.microscope,
    organizer: 'Research & Development Cell',
  },
];

export const eventCategories = Array.from(new Set(events.map((e) => e.category)));
export const getEvent = (slug: string) => events.find((e) => e.slug === slug);

/** Events that have not yet ended, soonest first. `now` is injectable for testing. */
export const upcomingEvents = (now: Date = new Date()) =>
  events
    .filter((e) => new Date(e.endDate ?? e.startDate).getTime() >= now.getTime())
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

export const pastEvents = (now: Date = new Date()) =>
  events
    .filter((e) => new Date(e.endDate ?? e.startDate).getTime() < now.getTime())
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
