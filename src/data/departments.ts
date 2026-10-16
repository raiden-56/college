import type { Department, DisciplineId } from '@/types';
import { images } from './images';

const resources = (code: string): Department['resources'] => [
  { id: `${code}-syl`, title: 'Scheme & Syllabus (current regulation)', url: '/downloads/placeholder.pdf', sizeKb: 820, fileType: 'PDF' },
  { id: `${code}-tt`, title: 'Department Timetable — current semester', url: '/downloads/placeholder.pdf', sizeKb: 140, fileType: 'PDF' },
  { id: `${code}-lab`, title: 'Laboratory Manual', url: '/downloads/placeholder.pdf', sizeKb: 1640, fileType: 'PDF' },
];

export const disciplineLabels: Record<DisciplineId, string> = {
  engineering: 'Engineering & Technology',
  'computer-science': 'Computer Science & IT',
  science: 'Science',
  'commerce-management': 'Commerce & Management',
  'arts-humanities': 'Arts & Humanities',
  law: 'Law',
  education: 'Education',
  'health-sciences': 'Health Sciences',
};

export const departments: Department[] = [
  {
    slug: 'computer-science-engineering',
    name: 'Department of Computer Science & Engineering',
    shortName: 'Computer Science',
    discipline: 'computer-science',
    icon: 'Cpu',
    established: 1998,
    tagline: 'Software, systems and intelligent computing',
    overview:
      'The Department of Computer Science & Engineering offers undergraduate, postgraduate and doctoral programs that balance strong computing fundamentals with modern specialisations in artificial intelligence, data science, cloud and cyber security. Students learn through studio-style labs, open-source contribution, hackathons and semester-long industry projects.',
    vision: 'To be a centre of excellence in computing education and research that creates responsible technologists for a digital society.',
    mission: [
      'Deliver a rigorous, outcome-based curriculum aligned with industry and research needs.',
      'Foster research, innovation and entrepreneurship through labs and incubation support.',
      'Instil ethics, teamwork and lifelong learning in every graduate.',
    ],
    hod: {
      facultySlug: 'dr-ananya-rao',
      message:
        'Computing shapes nearly every field today. Our goal is to help students think clearly about problems, build reliable systems and use technology responsibly. We invite you to explore our labs, meet our faculty and see the projects our students build.',
    },
    labs: [
      { name: 'AI & Machine Learning Lab', equipment: ['GPU workstations', 'Jupyter compute cluster', 'Edge AI kits'] },
      { name: 'Cloud & DevOps Lab', equipment: ['Private cloud sandbox', 'Container orchestration cluster', 'CI/CD toolchain'] },
      { name: 'Cyber Security Lab', equipment: ['Isolated network range', 'Packet analysers', 'CTF practice environment'] },
      { name: 'Programming Studio', equipment: ['72 networked workstations', 'Dual-monitor pair programming bays'] },
    ],
    research: ['Natural language processing for Indian languages', 'Privacy-preserving machine learning', 'Distributed systems and cloud reliability', 'Computer vision for agriculture'],
    collaborations: ['Industry advisory board with software and product companies (to be configured)', 'Open-source mentorship programs', 'Joint research projects with partner universities'],
    achievements: ['Student teams placed in national-level hackathons (details to be verified)', 'Faculty research grants in AI and security (details to be verified)', 'Active ACM and IEEE student chapters'],
    events: [
      { title: 'Generative AI in Practice — Hands-on Workshop', date: '2026-11-14', type: 'Workshop' },
      { title: 'Secure Coding Guest Lecture', date: '2026-12-03', type: 'Guest Lecture' },
      { title: 'National Conference on Intelligent Systems', date: '2027-02-20', type: 'Conference' },
    ],
    resources: resources('cse'),
    contact: { email: 'hod.cse@bgvsacc.org', phone: '+91 80 4000 2100', location: 'Block A, 3rd Floor' },
    image: images.coding,
  },
  {
    slug: 'electronics-communication',
    name: 'Department of Electronics & Communication Engineering',
    shortName: 'Electronics & Comm.',
    discipline: 'engineering',
    icon: 'CircuitBoard',
    established: 1999,
    tagline: 'Signals, embedded systems and connected devices',
    overview:
      'The ECE department prepares engineers who design the hardware and communication systems behind modern technology — from VLSI and embedded systems to wireless networks and the Internet of Things. Project-based learning and an industry-sponsored embedded lab give students practical design experience.',
    vision: 'To develop competent electronics engineers who innovate in communication and embedded technologies for societal benefit.',
    mission: [
      'Provide strong foundations in circuits, signals and systems.',
      'Promote hands-on design through labs, projects and industry collaboration.',
      'Encourage research in VLSI, IoT and communication systems.',
    ],
    hod: {
      facultySlug: 'dr-vikram-iyer',
      message:
        'Electronics is where ideas become devices. Our students design, prototype and test real systems from their second year onwards, building the confidence employers value.',
    },
    labs: [
      { name: 'VLSI Design Lab', equipment: ['EDA tool licences', 'FPGA development boards'] },
      { name: 'Embedded & IoT Lab', equipment: ['Microcontroller kits', 'Sensor modules', 'LoRa & BLE gateways'] },
      { name: 'Communication Systems Lab', equipment: ['Spectrum analysers', 'Software-defined radios', 'Antenna trainer kits'] },
    ],
    research: ['Low-power VLSI design', 'IoT for smart agriculture', '5G and wireless communication', 'Biomedical signal processing'],
    collaborations: ['Embedded systems training partnership (to be configured)', 'Joint IoT projects with local industry'],
    achievements: ['Student satellite and drone club projects', 'Funded projects in IoT (details to be verified)'],
    events: [
      { title: 'PCB Design Bootcamp', date: '2026-11-21', type: 'Workshop' },
      { title: 'Seminar on Semiconductor Careers', date: '2027-01-16', type: 'Seminar' },
    ],
    resources: resources('ece'),
    contact: { email: 'hod.ece@bgvsacc.org', phone: '+91 80 4000 2200', location: 'Block B, 2nd Floor' },
    image: images.circuit,
  },
  {
    slug: 'mechanical-engineering',
    name: 'Department of Mechanical Engineering',
    shortName: 'Mechanical',
    discipline: 'engineering',
    icon: 'Cog',
    established: 1987,
    tagline: 'Design, manufacturing and sustainable energy',
    overview:
      'One of the founding departments of the college, Mechanical Engineering combines classical engineering science with modern tools such as CAD/CAE, additive manufacturing, robotics and electric mobility. Students participate in design competitions and complete industry internships.',
    vision: 'To nurture mechanical engineers who design sustainable products and processes for a changing world.',
    mission: [
      'Teach engineering fundamentals with modern design and simulation tools.',
      'Enable experiential learning through workshops, competitions and internships.',
      'Advance research in manufacturing, thermal systems and e-mobility.',
    ],
    hod: {
      facultySlug: 'dr-rajesh-kulkarni',
      message:
        'From our foundry to our 3D printing lab, the department is built for making things. We encourage students to learn by building — and to think about sustainability in every design decision.',
    },
    labs: [
      { name: 'CAD/CAM Centre', equipment: ['CAD/CAE workstations', 'CNC turning and milling centres'] },
      { name: 'Additive Manufacturing Lab', equipment: ['FDM and resin 3D printers', '3D scanner'] },
      { name: 'Thermal Engineering Lab', equipment: ['IC engine test rigs', 'Heat transfer apparatus'] },
    ],
    research: ['Electric vehicle powertrains', 'Additive manufacturing of composites', 'Renewable thermal energy storage'],
    collaborations: ['Automotive design competition partnerships', 'MSME manufacturing cluster projects'],
    achievements: ['Student formula-style racing team', 'Industry-sponsored final year projects'],
    events: [
      { title: 'EV Technology Workshop', date: '2026-12-10', type: 'Workshop' },
      { title: 'Guest Lecture: Lean Manufacturing', date: '2027-01-22', type: 'Guest Lecture' },
    ],
    resources: resources('mech'),
    contact: { email: 'hod.mech@bgvsacc.org', phone: '+91 80 4000 2300', location: 'Block C, Ground Floor' },
    image: images.engineeringLab,
  },
  {
    slug: 'sciences',
    name: 'Department of Physical & Life Sciences',
    shortName: 'Sciences',
    discipline: 'science',
    icon: 'FlaskConical',
    established: 1987,
    tagline: 'Physics, chemistry, mathematics and biotechnology',
    overview:
      'The Department of Physical & Life Sciences offers B.Sc. and M.Sc. programs with strong laboratory training and undergraduate research opportunities. Students work alongside faculty on funded projects and present at student research symposia.',
    vision: 'To foster scientific curiosity and research excellence that addresses local and global challenges.',
    mission: [
      'Build conceptual depth through inquiry-based teaching.',
      'Provide well-equipped laboratories and early research exposure.',
      'Promote interdisciplinary science and scientific outreach.',
    ],
    hod: {
      facultySlug: 'dr-meera-nair',
      message:
        'Science is a way of asking good questions. Our small-group labs and mentored projects let students experience research from their very first year.',
    },
    labs: [
      { name: 'Instrumentation Lab', equipment: ['UV-Vis spectrophotometer', 'HPLC', 'FTIR'] },
      { name: 'Biotechnology Lab', equipment: ['PCR thermal cycler', 'Laminar air flow', 'Gel documentation system'] },
      { name: 'Physics Lab', equipment: ['Optics benches', 'Solid-state physics kits'] },
    ],
    research: ['Green chemistry and catalysis', 'Plant biotechnology', 'Materials for energy storage', 'Mathematical modelling'],
    collaborations: ['Research collaborations with national laboratories (to be configured)', 'Science outreach with local schools'],
    achievements: ['Student research presentations at state symposia', 'Faculty publications in peer-reviewed journals'],
    events: [
      { title: 'National Science Day Exhibition', date: '2027-02-28', type: 'Seminar' },
      { title: 'Workshop on Laboratory Safety', date: '2026-11-07', type: 'Workshop' },
    ],
    resources: resources('sci'),
    contact: { email: 'hod.science@bgvsacc.org', phone: '+91 80 4000 2400', location: 'Science Block, 1st Floor' },
    image: images.scienceLab,
  },
  {
    slug: 'commerce-management',
    name: 'School of Commerce & Management',
    shortName: 'Commerce & Management',
    discipline: 'commerce-management',
    icon: 'BriefcaseBusiness',
    established: 1992,
    tagline: 'Business, finance, analytics and entrepreneurship',
    overview:
      'The School of Commerce & Management offers B.Com, BBA and MBA programs designed with industry input. Case-based teaching, live projects, a student-run investment club and the entrepreneurship cell prepare graduates for careers in finance, consulting, marketing and analytics.',
    vision: 'To develop ethical business leaders and entrepreneurs with a global outlook.',
    mission: [
      'Integrate theory with live projects, case studies and internships.',
      'Develop analytical, communication and leadership skills.',
      'Encourage entrepreneurship and social responsibility.',
    ],
    hod: {
      facultySlug: 'dr-sanjay-mehta',
      message:
        'Business education should be practical and principled. Our students learn to analyse data, communicate decisions and lead teams — with integrity at the core.',
    },
    labs: [
      { name: 'Finance & Trading Lab', equipment: ['Market data terminals', 'Portfolio simulation software'] },
      { name: 'Business Analytics Lab', equipment: ['Spreadsheet & BI tools', 'Statistical software'] },
    ],
    research: ['Behavioural finance', 'MSME growth and digital adoption', 'Sustainable supply chains'],
    collaborations: ['Professional body partnerships for certifications (to be configured)', 'Corporate mentorship program'],
    achievements: ['Student teams in inter-collegiate business plan competitions', 'Active entrepreneurship cell'],
    events: [
      { title: 'Union Budget Analysis Panel', date: '2027-02-02', type: 'Seminar' },
      { title: 'Design Thinking for Startups', date: '2026-11-28', type: 'Workshop' },
    ],
    resources: resources('com'),
    contact: { email: 'dean.commerce@bgvsacc.org', phone: '+91 80 4000 2500', location: 'Management Block, 2nd Floor' },
    image: images.business,
  },
  {
    slug: 'humanities',
    name: 'Department of Humanities & Social Sciences',
    shortName: 'Humanities',
    discipline: 'arts-humanities',
    icon: 'BookOpen',
    established: 1987,
    tagline: 'Literature, economics, psychology and media',
    overview:
      'The Department of Humanities & Social Sciences offers liberal arts programs that develop critical thinking, writing and research skills. Students choose combinations across English, economics, psychology and media studies, and engage through the literary society, debate club and community projects.',
    vision: 'To cultivate thoughtful, articulate citizens who understand society and contribute to it.',
    mission: [
      'Offer interdisciplinary programs grounded in reading, writing and inquiry.',
      'Encourage research, debate and creative expression.',
      'Connect classroom learning with community engagement.',
    ],
    hod: {
      facultySlug: 'dr-farah-khan',
      message:
        'The humanities teach us to read closely, argue fairly and listen carefully — skills that matter in every career. We welcome curious students who enjoy ideas.',
    },
    labs: [
      { name: 'Language & Communication Lab', equipment: ['Interactive language software', 'Recording booths'] },
      { name: 'Psychology Lab', equipment: ['Standardised psychometric tools', 'Observation room'] },
      { name: 'Media Studio', equipment: ['Podcast setup', 'Video editing suites'] },
    ],
    research: ['Postcolonial literature', 'Development economics', 'Adolescent mental health', 'Digital media cultures'],
    collaborations: ['Community literacy partnerships', 'Student exchange interest network (to be configured)'],
    achievements: ['Annual literary festival', 'Student-run magazine and podcast'],
    events: [
      { title: 'Bapuji College Literary Festival', date: '2027-01-29', type: 'Conference' },
      { title: 'Workshop: Academic Writing', date: '2026-11-19', type: 'Workshop' },
    ],
    resources: resources('hum'),
    contact: { email: 'hod.humanities@bgvsacc.org', phone: '+91 80 4000 2600', location: 'Arts Block, 1st Floor' },
    image: images.humanities,
  },
  {
    slug: 'law',
    name: 'School of Law',
    shortName: 'Law',
    discipline: 'law',
    icon: 'Scale',
    established: 2008,
    tagline: 'Integrated and postgraduate legal education',
    overview:
      'The School of Law offers an integrated five-year BA LL.B. and a one-year LL.M. Students learn through moot courts, legal aid clinics, court visits and internships with advocates, firms and NGOs.',
    vision: 'To shape skilled, ethical legal professionals committed to justice and the rule of law.',
    mission: [
      'Provide clinical legal education alongside doctrinal teaching.',
      'Promote access to justice through legal aid and outreach.',
      'Encourage legal research and policy engagement.',
    ],
    hod: {
      facultySlug: 'prof-arjun-menon',
      message:
        'Law is learned in libraries and practised in courtrooms and communities. Our clinics and moots ensure students experience both before they graduate.',
    },
    labs: [
      { name: 'Moot Court Hall', equipment: ['Courtroom layout', 'Recording system'] },
      { name: 'Legal Aid Clinic', equipment: ['Client consultation rooms', 'Legal database access'] },
    ],
    research: ['Constitutional law', 'Technology and data protection law', 'Environmental law'],
    collaborations: ['District legal services authority outreach (to be configured)', 'Internship network with law firms'],
    achievements: ['Moot court competition participation', 'Legal literacy camps in nearby villages'],
    events: [
      { title: 'Intra-College Moot Court Competition', date: '2026-12-12', type: 'Conference' },
      { title: 'Seminar on Data Protection Law', date: '2027-01-09', type: 'Seminar' },
    ],
    resources: resources('law'),
    contact: { email: 'director.law@bgvsacc.org', phone: '+91 80 4000 2700', location: 'Law School Building' },
    image: images.law,
  },
  {
    slug: 'education',
    name: 'Department of Education',
    shortName: 'Education',
    discipline: 'education',
    icon: 'School',
    established: 2005,
    tagline: 'Preparing reflective, inclusive teachers',
    overview:
      'The Department of Education offers the two-year B.Ed. program with structured school internships, micro-teaching labs and a strong focus on inclusive and technology-enabled pedagogy.',
    vision: 'To prepare reflective, compassionate and skilled teachers for every classroom.',
    mission: [
      'Blend educational theory with extensive school-based practice.',
      'Promote inclusive education and educational technology.',
      'Support teacher research and professional development.',
    ],
    hod: {
      facultySlug: 'dr-lakshmi-srinivasan',
      message:
        'Great teachers change lives. Our program gives student-teachers the knowledge, practice and reflection they need to make that difference.',
    },
    labs: [
      { name: 'Micro-teaching Lab', equipment: ['Video recording for feedback', 'Smart board'] },
      { name: 'Educational Technology Lab', equipment: ['Learning management system', 'Content authoring tools'] },
      { name: 'Psychology Resource Centre', equipment: ['Assessment tools', 'Child development resources'] },
    ],
    research: ['Inclusive classroom practices', 'Technology integration in schools', 'Assessment for learning'],
    collaborations: ['Partner schools for internship (to be configured)'],
    achievements: ['Community teaching programs', 'Teacher development workshops for local schools'],
    events: [{ title: 'Workshop on Inclusive Pedagogy', date: '2026-12-05', type: 'Workshop' }],
    resources: resources('edu'),
    contact: { email: 'hod.education@bgvsacc.org', phone: '+91 80 4000 2800', location: 'Education Block' },
    image: images.education,
  },
];

export const getDepartment = (slug: string) => departments.find((d) => d.slug === slug);
