import type { Leader, Stat } from '@/types';
import { images, portraits } from './images';

/**
 * Institutional profile content: statistics, leadership, history and values.
 * Values flagged isDemo must be replaced with verified figures before launch.
 */

export const institutionStats: Stat[] = [
  { label: 'Years of excellence', value: new Date().getFullYear() - 1987, suffix: '+' },
  { label: 'Programs offered', value: 20, isDemo: true },
  { label: 'Faculty members', value: 240, suffix: '+', isDemo: true },
  { label: 'Students on campus', value: 5200, suffix: '+', isDemo: true },
  { label: 'Alumni worldwide', value: 32000, suffix: '+', isDemo: true },
];

export const whyChooseUs = [
  { icon: 'GraduationCap', title: 'Teaching that knows your name', text: 'Small class sizes, a mentor for every student and faculty who are active researchers and practitioners.' },
  { icon: 'Building2', title: 'Modern infrastructure', text: 'Smart classrooms, specialised labs, a digital library and a 40-acre green campus designed for learning.' },
  { icon: 'Handshake', title: 'Real industry exposure', text: 'Live projects, internships, guest lectures and an industry advisory board that shapes the curriculum.' },
  { icon: 'HeartHandshake', title: 'Support at every step', text: 'Counselling, scholarships, accessibility support and a welfare team that looks after students and families.' },
];

export const coreValues = [
  { icon: 'Scale', title: 'Integrity', text: 'We act honestly and transparently in teaching, research and administration.' },
  { icon: 'Lightbulb', title: 'Curiosity', text: 'We encourage questions, experimentation and a lifelong love of learning.' },
  { icon: 'Users', title: 'Inclusion', text: 'We welcome every learner and remove barriers to participation.' },
  { icon: 'Leaf', title: 'Responsibility', text: 'We prepare graduates who serve society and protect the environment.' },
  { icon: 'Award', title: 'Excellence', text: 'We set high standards and support everyone in reaching them.' },
];

export const vision =
  'To be a leading institution of higher learning that transforms lives through excellent teaching, meaningful research and service to society.';

export const mission = [
  'Offer rigorous, relevant and inclusive programs that develop knowledge, skills and character.',
  'Foster research, innovation and entrepreneurship that address real-world challenges.',
  'Build lasting partnerships with industry, government and communities.',
  'Provide a safe, supportive and sustainable campus where every learner can thrive.',
];

export const milestones = [
  { year: 1987, title: 'Founded', text: 'The college is established with programs in science, commerce and mechanical engineering.' },
  { year: 1992, title: 'School of Commerce & Management', text: 'Business programs launched to meet regional demand.' },
  { year: 1998, title: 'Computer Science department', text: 'Computing programs introduced, followed by ECE in 1999.' },
  { year: 2005, title: 'Department of Education', text: 'Teacher education begins with the B.Ed. program.' },
  { year: 2008, title: 'School of Law', text: 'Integrated BA LL.B. program launched.' },
  { year: 2015, title: 'Research centre recognised', text: 'Doctoral programs commence in selected disciplines (to be verified).' },
  { year: 2021, title: 'Innovation & incubation centre', text: 'Maker space and start-up incubation support opened to all students.' },
  { year: 2026, title: 'AI & ML Lab', text: 'New computing infrastructure for AI teaching and research.' },
];

export const awards = [
  'Recognition for green campus initiatives (details to be verified)',
  'Best NSS unit award at university level (details to be verified)',
  'Faculty awards for teaching excellence (details to be verified)',
  'Student achievements in national competitions (see News)',
];

export const principal = {
  name: 'Dr. Suresh Raghavan',
  designation: 'Principal',
  photo: portraits.m2,
  message: [
    'Welcome to Crestwood College. For nearly four decades, we have believed that education is about more than degrees — it is about developing people who think clearly, act ethically and contribute to their communities.',
    'Our faculty combine teaching excellence with research and industry experience. Our campus offers the facilities students need to explore, build and lead. And our support services ensure that no student walks their journey alone.',
    'I invite you to explore our programs, visit our campus and discover what makes the Crestwood community special.',
  ],
};

export const chairman = {
  name: 'Mr. Venkatesh Prasad',
  designation: 'Chairman, Crestwood Educational Trust',
  photo: portraits.m1,
  message: [
    'Our founders established Crestwood with a simple promise: quality higher education that is accessible, values-driven and relevant to society.',
    'As we grow, we remain committed to transparent governance, investment in people and infrastructure, and a campus where every student feels they belong.',
  ],
};

/** DEMO LEADERSHIP — fictional names. Replace with approved governance records. */
export const leaders: Leader[] = [
  { name: chairman.name, designation: chairman.designation, photo: chairman.photo, role: 'management', bio: 'Leads the trust’s strategic direction and long-term investment in academic quality.' },
  { name: 'Mrs. Kavitha Prasad', designation: 'Secretary, Crestwood Educational Trust', photo: portraits.f1, role: 'management', bio: 'Oversees institutional development, compliance and community partnerships.' },
  { name: principal.name, designation: principal.designation, photo: principal.photo, role: 'administration', bio: 'Academic head of the college, responsible for teaching, research and student welfare.' },
  { name: 'Dr. Nandini Bhat', designation: 'Vice Principal (Academics)', photo: portraits.f3, role: 'administration', bio: 'Coordinates curriculum, academic calendar and quality initiatives with the IQAC.' },
  { name: 'Dr. Harish Rao', designation: 'Dean, Research & Development', photo: portraits.m8, role: 'administration', bio: 'Leads research policy, grants and doctoral programs.' },
  { name: 'Mr. Anil Joseph', designation: 'Registrar', photo: portraits.m5, role: 'administration', bio: 'Heads administration, records and statutory compliance.' },
  { name: 'Prof. (Retd.) R. Krishnan', designation: 'Member, Governing Body (Academic Expert)', photo: portraits.m7, role: 'governing-body', bio: 'Former university professor providing academic oversight.' },
  { name: 'Ms. Deepa Menon', designation: 'Member, Governing Body (Industry Representative)', photo: portraits.f5, role: 'governing-body', bio: 'Industry leader advising on employability and partnerships.' },
  { name: 'University Nominee', designation: 'Member, Governing Body', photo: portraits.m3, role: 'governing-body', bio: 'Nominee of the affiliating university (to be configured).' },
];

export const infrastructureHighlights = [
  { label: 'Campus area', value: '40 acres', isDemo: true },
  { label: 'Laboratories', value: '60+', isDemo: true },
  { label: 'Library volumes', value: '1.2 lakh+', isDemo: true },
  { label: 'Smart classrooms', value: '85', isDemo: true },
  { label: 'Hostel capacity', value: '1,400 beds', isDemo: true },
  { label: 'Seminar halls', value: '6', isDemo: true },
];

export const campusHeroImage = images.heroCampus;
