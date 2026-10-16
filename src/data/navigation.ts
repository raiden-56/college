import type { NavItem } from '@/types';

export const mainNav: NavItem[] = [
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'Overview & History', to: '/about', description: 'Our story, vision, mission and values' },
      { label: 'Leadership & Governance', to: '/about/leadership', description: 'Management, principal and governing body' },
      { label: 'Accreditation & Disclosures', to: '/disclosures', description: 'Approvals, IQAC and mandatory disclosures' },
      { label: 'Campus Facilities', to: '/campus', description: 'Libraries, labs, hostels and more' },
    ],
  },
  {
    label: 'Academics',
    to: '/programs',
    children: [
      { label: 'Programs & Courses', to: '/programs', description: 'Find UG, PG, doctoral and diploma programs' },
      { label: 'Departments', to: '/departments', description: 'Explore our academic departments' },
      { label: 'Faculty Directory', to: '/faculty', description: 'Meet our teachers and researchers' },
      { label: 'Research & Innovation', to: '/research', description: 'Centres, publications and incubation' },
      { label: 'Placements & Careers', to: '/placements', description: 'Training, recruiters and placement records' },
    ],
  },
  {
    label: 'Admissions',
    to: '/admissions',
    children: [
      { label: 'Admissions Hub', to: '/admissions', description: 'Eligibility, process and key dates' },
      { label: 'Fee Structure', to: '/fees', description: 'Course-wise fees and payment details' },
      { label: 'Scholarships', to: '/admissions#scholarships', description: 'Merit and need-based support' },
      { label: 'Apply / Enquire', to: '/admissions/apply', description: 'Start your application enquiry' },
    ],
  },
  {
    label: 'Campus Life',
    to: '/campus',
    children: [
      { label: 'Facilities & Amenities', to: '/campus', description: 'Everything on our 40-acre campus' },
      { label: 'Gallery', to: '/campus/gallery', description: 'Photos from campus and events' },
      { label: 'Virtual Tour', to: '/campus/virtual-tour', description: 'Explore the campus online' },
      { label: 'Student Corner', to: '/student-corner', description: 'Calendar, exams, notices and support' },
      { label: 'Alumni Network', to: '/alumni', description: 'Stories, mentorship and reunions' },
      { label: 'Testimonials', to: '/testimonials', description: 'Hear from students and parents' },
    ],
  },
  {
    label: 'News & Events',
    to: '/news',
    children: [
      { label: 'News & Notices', to: '/news', description: 'Official notices and college news' },
      { label: 'Events Calendar', to: '/events', description: 'Workshops, fests, sports and more' },
    ],
  },
  { label: 'Contact', to: '/contact' },
];

export const quickLinks: NavItem[] = [
  { label: 'Admissions', to: '/admissions' },
  { label: 'Courses', to: '/programs' },
  { label: 'Fees', to: '/fees' },
  { label: 'Faculty', to: '/faculty' },
  { label: 'Placements', to: '/placements' },
  { label: 'Contact', to: '/contact' },
];

export const footerColumns: { title: string; links: NavItem[] }[] = [
  {
    title: 'Academics',
    links: [
      { label: 'Programs & Courses', to: '/programs' },
      { label: 'Departments', to: '/departments' },
      { label: 'Faculty', to: '/faculty' },
      { label: 'Research', to: '/research' },
      { label: 'Student Corner', to: '/student-corner' },
    ],
  },
  {
    title: 'Admissions',
    links: [
      { label: 'Admissions Hub', to: '/admissions' },
      { label: 'Apply / Enquire', to: '/admissions/apply' },
      { label: 'Fee Structure', to: '/fees' },
      { label: 'Scholarships', to: '/admissions#scholarships' },
      { label: 'Placements', to: '/placements' },
    ],
  },
  {
    title: 'Campus',
    links: [
      { label: 'Facilities', to: '/campus' },
      { label: 'Gallery', to: '/campus/gallery' },
      { label: 'Virtual Tour', to: '/campus/virtual-tour' },
      { label: 'Events', to: '/events' },
      { label: 'Alumni', to: '/alumni' },
    ],
  },
  {
    title: 'Institution',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Mandatory Disclosures', to: '/disclosures' },
      { label: 'News & Notices', to: '/news' },
      { label: 'Feedback & Grievance', to: '/feedback' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
];

export const legalLinks: NavItem[] = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Accessibility', to: '/accessibility' },
  { label: 'Sitemap', to: '/sitemap' },
  { label: 'Disclosures', to: '/disclosures' },
];

/** Human readable names for route segments, used by breadcrumbs */
export const routeLabels: Record<string, string> = {
  about: 'About',
  leadership: 'Leadership & Governance',
  programs: 'Programs',
  departments: 'Departments',
  faculty: 'Faculty',
  admissions: 'Admissions',
  apply: 'Apply / Enquire',
  fees: 'Fee Structure',
  campus: 'Campus',
  gallery: 'Gallery',
  'virtual-tour': 'Virtual Tour',
  placements: 'Placements',
  alumni: 'Alumni',
  testimonials: 'Testimonials',
  feedback: 'Feedback',
  research: 'Research',
  'student-corner': 'Student Corner',
  news: 'News & Notices',
  events: 'Events',
  disclosures: 'Disclosures',
  contact: 'Contact',
  search: 'Search',
  privacy: 'Privacy Policy',
  accessibility: 'Accessibility',
  sitemap: 'Sitemap',
};
