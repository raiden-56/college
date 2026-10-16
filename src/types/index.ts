/**
 * Domain models. These mirror the shape a future CMS / REST API should return,
 * so swapping local mock data for a backend only requires changing the data source.
 */

export type DegreeLevel = 'UG' | 'PG' | 'Doctoral' | 'Diploma' | 'Certificate';
export type StudyMode = 'Full-time' | 'Part-time' | 'Online' | 'Hybrid';

export type DisciplineId =
  | 'engineering'
  | 'computer-science'
  | 'science'
  | 'commerce-management'
  | 'arts-humanities'
  | 'law'
  | 'education'
  | 'health-sciences';

export interface ImageAsset {
  src: string;
  alt: string;
}

export interface SemesterSyllabus {
  semester: number;
  subjects: string[];
}

export interface FeeComponent {
  label: string;
  /** Amount in INR for one academic year */
  amount: number;
  /** tuition = academic fees; other = admission, lab, exam, etc.; optional = hostel/transport */
  kind: 'tuition' | 'one-time' | 'other' | 'optional';
  note?: string;
}

export interface Program {
  slug: string;
  name: string;
  shortName: string;
  level: DegreeLevel;
  discipline: DisciplineId;
  departmentSlug: string;
  durationYears: number;
  semesters: number;
  modes: StudyMode[];
  intake: number;
  /** Short eligibility tag used by the course finder filter */
  eligibilityTag: '10+2 Science' | '10+2 Any Stream' | 'Bachelor’s Degree' | 'Master’s Degree' | '10th Pass';
  eligibility: string;
  summary: string;
  overview: string;
  objectives: string[];
  outcomes: string[];
  admissionProcedure: string[];
  syllabus: SemesterSyllabus[];
  /** Per-year fee components (illustrative until approved) */
  fees: FeeComponent[];
  careers: string[];
  placementInfo: string;
  scholarships: string[];
  faqs: FAQ[];
  image: ImageAsset;
  featured?: boolean;
  brochureUrl: string;
}

export interface Department {
  slug: string;
  name: string;
  shortName: string;
  discipline: DisciplineId;
  /** lucide icon name, resolved through utils/icons */
  icon: string;
  established: number;
  tagline: string;
  overview: string;
  vision: string;
  mission: string[];
  hod: { facultySlug: string; message: string };
  labs: { name: string; equipment: string[] }[];
  research: string[];
  collaborations: string[];
  achievements: string[];
  events: { title: string; date: string; type: 'Workshop' | 'Seminar' | 'Conference' | 'Guest Lecture' }[];
  resources: DownloadItem[];
  contact: { email: string; phone: string; location: string };
  image: ImageAsset;
}

export type Designation =
  | 'Professor'
  | 'Associate Professor'
  | 'Assistant Professor'
  | 'Professor & Head'
  | 'Principal'
  | 'Visiting Faculty';

export interface Faculty {
  slug: string;
  name: string;
  designation: Designation;
  departmentSlug: string;
  qualification: string;
  specialization: string;
  bio: string;
  photo: ImageAsset;
  experienceYears: number;
  qualifications: { degree: string; institution: string; year: number }[];
  subjects: string[];
  researchInterests: string[];
  publications: { title: string; venue: string; year: number }[];
  awards: string[];
  memberships: string[];
  /** Only shown when the institution has approved public contact details */
  contact?: { email: string; phone?: string; cabin?: string };
  featured?: boolean;
}

export type PostCategory =
  | 'Announcement'
  | 'Admission Notice'
  | 'Examination Notice'
  | 'College News'
  | 'Student Achievement'
  | 'Circular';

export interface Attachment {
  title: string;
  url: string;
  sizeKb?: number;
}

export interface Post {
  slug: string;
  title: string;
  category: PostCategory;
  /** Official notices are formally issued by the institution and visually distinguished from general news */
  isOfficialNotice: boolean;
  date: string; // ISO
  excerpt: string;
  content: string[]; // paragraphs
  image: ImageAsset;
  attachments?: Attachment[];
  tags?: string[];
  issuedBy?: string;
  referenceNo?: string;
}

export type EventCategory = 'Workshop' | 'Seminar' | 'Sports' | 'Cultural' | 'Conference' | 'Admissions' | 'Alumni';

export interface CollegeEvent {
  slug: string;
  title: string;
  category: EventCategory;
  startDate: string; // ISO date-time
  endDate?: string;
  venue: string;
  summary: string;
  content: string[];
  image: ImageAsset;
  organizer: string;
  registrationUrl?: string;
  attachments?: Attachment[];
}

export interface FAQ {
  question: string;
  answer: string;
  category?: 'Admissions' | 'Fees' | 'Academics' | 'Campus' | 'Placements' | 'General';
}

export interface Testimonial {
  id: string;
  name: string;
  role: 'Student' | 'Alumni' | 'Parent';
  context: string; // e.g. "B.Tech CSE, 2024" or "Parent of a BBA student"
  quote: string;
  rating?: number;
  photo?: ImageAsset;
  videoUrl?: string;
  videoTranscript?: string;
  departmentSlug?: string;
  consentRecorded: boolean;
}

export interface Facility {
  slug: string;
  name: string;
  category: 'Academic' | 'Residential' | 'Sports & Wellness' | 'Student Life' | 'Services';
  icon: string;
  summary: string;
  details: string[];
  image: ImageAsset;
  contact?: string;
  timings?: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  /** True when the value is a placeholder awaiting institutional verification */
  isDemo?: boolean;
}

export interface AlumniStory {
  id: string;
  name: string;
  batch: number;
  departmentSlug: string;
  program: string;
  industry: 'Technology' | 'Finance' | 'Public Service' | 'Research & Academia' | 'Entrepreneurship' | 'Law' | 'Healthcare' | 'Media & Arts';
  role: string;
  organization: string;
  story: string;
  photo: ImageAsset;
  /** Directory listing only shows alumni who opted in */
  directoryConsent: boolean;
  linkedinUrl?: string;
}

export interface PlacementYear {
  academicYear: string; // e.g. "2024–25"
  eligibleStudents: number;
  studentsPlaced: number;
  companiesVisited: number;
  medianPackageLpa: number;
  highestPackageLpa: number;
  higherStudies: number;
  isDemo: boolean;
}

export interface DepartmentPlacement {
  departmentSlug: string;
  academicYear: string;
  eligible: number;
  placed: number;
  isDemo: boolean;
}

export interface Recruiter {
  name: string;
  sector: string;
  isDemo: boolean;
}

export type DisclosureCategory =
  | 'Affiliation & Recognition'
  | 'Regulatory Approvals'
  | 'Accreditation'
  | 'IQAC'
  | 'Annual Reports'
  | 'Policies'
  | 'Committees'
  | 'Fee Structure'
  | 'Audit & Finance'
  | 'Quality Reports';

export interface DownloadItem {
  id: string;
  title: string;
  url: string;
  sizeKb?: number;
  fileType?: 'PDF' | 'DOCX' | 'XLSX';
}

export interface DisclosureDocument extends DownloadItem {
  category: DisclosureCategory;
  academicYear: string;
  publishedOn: string;
  updatedOn: string;
  description?: string;
}

export interface Leader {
  name: string;
  designation: string;
  photo: ImageAsset;
  bio: string;
  role: 'management' | 'administration' | 'governing-body';
}

export interface NavItem {
  label: string;
  to: string;
  description?: string;
  children?: NavItem[];
}

export interface SearchResult {
  id: string;
  type: 'Program' | 'Department' | 'Faculty' | 'News & Notices' | 'Event' | 'Download' | 'FAQ' | 'Page';
  title: string;
  description: string;
  to: string;
  /** For downloads that open a file rather than a route */
  external?: boolean;
}
