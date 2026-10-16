import type { DownloadItem, ImageAsset } from '@/types';
import { faculty } from './faculty';
import { images } from './images';

/**
 * DEMO RESEARCH DATA — every project, amount, patent, partner and MoU below is illustrative.
 * Replace with records verified by the Research & Development Cell / IQAC before publishing.
 */

export type PublicationType = 'Journal' | 'Conference' | 'Book chapter';

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: PublicationType;
  departmentSlug: string;
  /** Faculty profiles linked from the author list */
  facultySlugs: string[];
}

export interface ResearchCentre {
  id: string;
  name: string;
  /** lucide icon name resolved through utils/icons */
  icon: string;
  departmentSlug: string;
  leadSlug: string;
  focus: string[];
  description: string;
  image: ImageAsset;
}

export type ProjectStatus = 'Ongoing' | 'Completed';

export interface ResearchProject {
  id: string;
  title: string;
  piSlug: string;
  departmentSlug: string;
  fundingAgency: string;
  /** Sanctioned amount in INR (illustrative) */
  amount: number;
  startYear: number;
  endYear: number;
  status: ProjectStatus;
}

export interface Patent {
  id: string;
  title: string;
  inventorSlugs: string[];
  departmentSlug: string;
  status: 'Filed' | 'Published' | 'Granted';
  applicationNo: string;
  year: number;
  summary: string;
}

export interface StudentProject {
  id: string;
  title: string;
  team: string;
  mentorSlug: string;
  departmentSlug: string;
  outcome: string;
  year: number;
}

export interface Collaboration {
  id: string;
  kind: 'Industry' | 'Academic' | 'Government & NGO';
  partner: string;
  area: string;
  activities: string[];
}

export interface Mou {
  id: string;
  partner: string;
  partnerType: 'Industry' | 'University' | 'Research lab' | 'NGO' | 'Professional body';
  purpose: string;
  signedOn: string;
  validUntil: string;
}

const AGENCY = 'Funding agency (to be verified)';

export const researchStats = [
  { label: 'Research centres', value: 6, isDemo: true },
  { label: 'Publications (last 5 years)', value: 140, suffix: '+', isDemo: true },
  { label: 'Funded projects', value: 18, isDemo: true },
  { label: 'Patents filed', value: 9, isDemo: true },
];

export const researchCentres: ResearchCentre[] = [
  {
    id: 'ai-lab',
    name: 'Centre for Applied AI & Language Technologies',
    icon: 'Cpu',
    departmentSlug: 'computer-science-engineering',
    leadSlug: 'dr-ananya-rao',
    focus: ['NLP for Indian languages', 'Responsible AI', 'Educational data mining'],
    description: 'Builds datasets, models and evaluation methods for language technologies, with an emphasis on fairness and transparency.',
    image: images.coding,
  },
  {
    id: 'secure-systems',
    name: 'Secure Systems & Privacy Lab',
    icon: 'ShieldCheck',
    departmentSlug: 'computer-science-engineering',
    leadSlug: 'dr-karthik-reddy',
    focus: ['Intrusion detection', 'Privacy-preserving computation', 'Secure software'],
    description: 'Studies attacks and defences for networked systems and trains student security teams through hands-on research.',
    image: images.circuit,
  },
  {
    id: 'vlsi-iot',
    name: 'VLSI & IoT Research Centre',
    icon: 'CircuitBoard',
    departmentSlug: 'electronics-communication',
    leadSlug: 'dr-vikram-iyer',
    focus: ['Low-power VLSI', 'Hardware security', 'IoT for agriculture'],
    description: 'Designs energy-efficient circuits and low-cost sensor systems, from simulation to working prototypes.',
    image: images.engineeringLab,
  },
  {
    id: 'sustainable-energy',
    name: 'Centre for Sustainable Energy & Mobility',
    icon: 'Leaf',
    departmentSlug: 'mechanical-engineering',
    leadSlug: 'dr-rajesh-kulkarni',
    focus: ['Thermal energy storage', 'EV battery thermal management', 'Additive manufacturing'],
    description: 'Works on cleaner energy systems and electric mobility, partnering with local manufacturers on applied problems.',
    image: images.robotics,
  },
  {
    id: 'green-chemistry',
    name: 'Green Chemistry & Life Sciences Lab',
    icon: 'FlaskConical',
    departmentSlug: 'sciences',
    leadSlug: 'dr-meera-nair',
    focus: ['Heterogeneous catalysis', 'Sustainable synthesis', 'Crop stress biology'],
    description: 'Develops sustainable chemical processes and studies plant resilience, with undergraduate researchers in every project.',
    image: images.scienceLab,
  },
  {
    id: 'policy-society',
    name: 'Centre for Law, Policy & Society',
    icon: 'Scale',
    departmentSlug: 'law',
    leadSlug: 'prof-arjun-menon',
    focus: ['Fundamental rights', 'Data protection', 'Rural livelihoods & policy evaluation'],
    description: 'An interdisciplinary forum for legal, economic and social research that informs public debate and policy.',
    image: images.lawBooks,
  },
];

const fromFaculty: Publication[] = faculty.flatMap((f) =>
  f.publications.map((p, i) => ({
    id: `${f.slug}-${i}`,
    title: p.title,
    authors: [f.name, 'Co-author (demo)'],
    venue: p.venue,
    year: p.year,
    type: (/conference|proceedings/i.test(p.venue) ? 'Conference' : 'Journal') as PublicationType,
    departmentSlug: f.departmentSlug,
    facultySlugs: [f.slug],
  })),
);

const extra: Publication[] = [
  {
    id: 'x01',
    title: 'Benchmarking multilingual sentiment models for low-resource Indian languages',
    authors: ['Dr. Ananya Rao', 'Ms. Divya Sharma', 'Student co-author (demo)'],
    venue: 'Journal name (demo)',
    year: 2025,
    type: 'Journal',
    departmentSlug: 'computer-science-engineering',
    facultySlugs: ['dr-ananya-rao', 'ms-divya-sharma'],
  },
  {
    id: 'x02',
    title: 'A lightweight intrusion detection pipeline for campus networks',
    authors: ['Dr. Karthik Reddy', 'Student co-author (demo)'],
    venue: 'Conference proceedings (demo)',
    year: 2025,
    type: 'Conference',
    departmentSlug: 'computer-science-engineering',
    facultySlugs: ['dr-karthik-reddy'],
  },
  {
    id: 'x03',
    title: 'Low-cost LoRa sensor nodes for soil-moisture monitoring',
    authors: ['Dr. Priya Venkatesh', 'Dr. Vikram Iyer'],
    venue: 'Journal name (demo)',
    year: 2024,
    type: 'Journal',
    departmentSlug: 'electronics-communication',
    facultySlugs: ['dr-priya-venkatesh', 'dr-vikram-iyer'],
  },
  {
    id: 'x04',
    title: 'Phase-change materials for passive battery cooling in two-wheeler EVs',
    authors: ['Dr. Rajesh Kulkarni', 'Mr. Naveen Gowda'],
    venue: 'Conference proceedings (demo)',
    year: 2024,
    type: 'Conference',
    departmentSlug: 'mechanical-engineering',
    facultySlugs: ['dr-rajesh-kulkarni', 'mr-naveen-gowda'],
  },
  {
    id: 'x05',
    title: 'Green catalysis in undergraduate laboratories: a teaching perspective',
    authors: ['Dr. Meera Nair'],
    venue: 'Edited volume on chemistry education (demo)',
    year: 2023,
    type: 'Book chapter',
    departmentSlug: 'sciences',
    facultySlugs: ['dr-meera-nair'],
  },
  {
    id: 'x06',
    title: 'Translation, memory and the regional novel',
    authors: ['Dr. Farah Khan'],
    venue: 'Edited volume on South Asian literature (demo)',
    year: 2022,
    type: 'Book chapter',
    departmentSlug: 'humanities',
    facultySlugs: ['dr-farah-khan'],
  },
  {
    id: 'x07',
    title: 'Digital payments adoption among small retailers: survey evidence',
    authors: ['Dr. Sanjay Mehta', 'Ms. Kavya Pillai'],
    venue: 'Journal name (demo)',
    year: 2023,
    type: 'Journal',
    departmentSlug: 'commerce-management',
    facultySlugs: ['dr-sanjay-mehta', 'ms-kavya-pillai'],
  },
  {
    id: 'x08',
    title: 'Consent and purpose limitation under India’s data protection framework',
    authors: ['Ms. Nisha Thomas', 'Prof. Arjun Menon'],
    venue: 'Law review (demo)',
    year: 2024,
    type: 'Journal',
    departmentSlug: 'law',
    facultySlugs: ['ms-nisha-thomas', 'prof-arjun-menon'],
  },
  {
    id: 'x09',
    title: 'Co-teaching models for inclusive secondary classrooms',
    authors: ['Dr. Lakshmi Srinivasan'],
    venue: 'Edited volume on inclusive education (demo)',
    year: 2021,
    type: 'Book chapter',
    departmentSlug: 'education',
    facultySlugs: ['dr-lakshmi-srinivasan'],
  },
  {
    id: 'x10',
    title: 'Evaluating a rural livelihood mission: a mixed-methods study',
    authors: ['Dr. Rohan Das'],
    venue: 'Conference proceedings (demo)',
    year: 2022,
    type: 'Conference',
    departmentSlug: 'humanities',
    facultySlugs: ['dr-rohan-das'],
  },
  {
    id: 'x11',
    title: 'Drought-responsive gene expression in finger millet',
    authors: ['Dr. Arvind Joshi', 'Student co-author (demo)'],
    venue: 'Journal name (demo)',
    year: 2025,
    type: 'Journal',
    departmentSlug: 'sciences',
    facultySlugs: ['dr-arvind-joshi'],
  },
  {
    id: 'x12',
    title: 'Hardware Trojans in low-power IoT SoCs: a detection survey',
    authors: ['Dr. Vikram Iyer'],
    venue: 'Edited volume on hardware security (demo)',
    year: 2023,
    type: 'Book chapter',
    departmentSlug: 'electronics-communication',
    facultySlugs: ['dr-vikram-iyer'],
  },
];

export const publications: Publication[] = [...fromFaculty, ...extra].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
export const publicationTypes: PublicationType[] = ['Journal', 'Conference', 'Book chapter'];
export const publicationYears = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);

export const researchProjects: ResearchProject[] = [
  { id: 'p01', title: 'Speech and text resources for Kannada and Tulu language technologies', piSlug: 'dr-ananya-rao', departmentSlug: 'computer-science-engineering', fundingAgency: AGENCY, amount: 2450000, startYear: 2025, endYear: 2028, status: 'Ongoing' },
  { id: 'p02', title: 'Federated learning for privacy-preserving healthcare analytics', piSlug: 'dr-karthik-reddy', departmentSlug: 'computer-science-engineering', fundingAgency: AGENCY, amount: 1680000, startYear: 2024, endYear: 2027, status: 'Ongoing' },
  { id: 'p03', title: 'Ultra-low-power SRAM design for edge AI accelerators', piSlug: 'dr-vikram-iyer', departmentSlug: 'electronics-communication', fundingAgency: AGENCY, amount: 3200000, startYear: 2023, endYear: 2026, status: 'Ongoing' },
  { id: 'p04', title: 'IoT-based precision irrigation for smallholder farms', piSlug: 'dr-priya-venkatesh', departmentSlug: 'electronics-communication', fundingAgency: AGENCY, amount: 980000, startYear: 2021, endYear: 2024, status: 'Completed' },
  { id: 'p05', title: 'Thermal energy storage using bio-based phase-change materials', piSlug: 'dr-rajesh-kulkarni', departmentSlug: 'mechanical-engineering', fundingAgency: AGENCY, amount: 1450000, startYear: 2022, endYear: 2025, status: 'Completed' },
  { id: 'p06', title: '3D-printed natural-fibre composites for low-cost prosthetics', piSlug: 'mr-naveen-gowda', departmentSlug: 'mechanical-engineering', fundingAgency: AGENCY, amount: 620000, startYear: 2025, endYear: 2027, status: 'Ongoing' },
  { id: 'p07', title: 'Recyclable solid-acid catalysts for biodiesel production', piSlug: 'dr-meera-nair', departmentSlug: 'sciences', fundingAgency: AGENCY, amount: 2100000, startYear: 2023, endYear: 2026, status: 'Ongoing' },
  { id: 'p08', title: 'Marker-assisted screening of drought tolerance in millets', piSlug: 'dr-arvind-joshi', departmentSlug: 'sciences', fundingAgency: AGENCY, amount: 1150000, startYear: 2020, endYear: 2023, status: 'Completed' },
  { id: 'p09', title: 'Financial literacy and credit access among women-led micro-enterprises', piSlug: 'dr-sanjay-mehta', departmentSlug: 'commerce-management', fundingAgency: AGENCY, amount: 540000, startYear: 2024, endYear: 2026, status: 'Ongoing' },
  { id: 'p10', title: 'Impact evaluation of a district skilling programme', piSlug: 'dr-rohan-das', departmentSlug: 'humanities', fundingAgency: AGENCY, amount: 760000, startYear: 2021, endYear: 2023, status: 'Completed' },
  { id: 'p11', title: 'Legal aid access and outcomes in rural Karnataka', piSlug: 'prof-arjun-menon', departmentSlug: 'law', fundingAgency: AGENCY, amount: 450000, startYear: 2022, endYear: 2024, status: 'Completed' },
  { id: 'p12', title: 'Teacher readiness for inclusive classrooms in government schools', piSlug: 'dr-lakshmi-srinivasan', departmentSlug: 'education', fundingAgency: AGENCY, amount: 580000, startYear: 2025, endYear: 2027, status: 'Ongoing' },
];

export const patents: Patent[] = [
  {
    id: 'pt1',
    title: 'Low-power sensor node with adaptive duty cycling for agricultural monitoring',
    inventorSlugs: ['dr-priya-venkatesh', 'dr-vikram-iyer'],
    departmentSlug: 'electronics-communication',
    status: 'Published',
    applicationNo: 'Application no. (to be verified)',
    year: 2024,
    summary: 'A battery-friendly field sensor that adapts its sampling rate to soil and weather conditions.',
  },
  {
    id: 'pt2',
    title: 'Passive phase-change cooling sleeve for cylindrical battery cells',
    inventorSlugs: ['dr-rajesh-kulkarni', 'mr-naveen-gowda'],
    departmentSlug: 'mechanical-engineering',
    status: 'Filed',
    applicationNo: 'Application no. (to be verified)',
    year: 2025,
    summary: 'A printable sleeve that delays thermal runaway in two-wheeler battery packs without active cooling.',
  },
  {
    id: 'pt3',
    title: 'Reusable solid-acid catalyst composition for transesterification',
    inventorSlugs: ['dr-meera-nair'],
    departmentSlug: 'sciences',
    status: 'Granted',
    applicationNo: 'Patent no. (to be verified)',
    year: 2023,
    summary: 'A catalyst that can be recovered and reused across multiple biodiesel batches.',
  },
  {
    id: 'pt4',
    title: 'System for detecting anomalous traffic in campus Wi-Fi networks',
    inventorSlugs: ['dr-karthik-reddy'],
    departmentSlug: 'computer-science-engineering',
    status: 'Filed',
    applicationNo: 'Application no. (to be verified)',
    year: 2026,
    summary: 'A lightweight detection approach suited to institutions without dedicated security teams.',
  },
];

export const studentProjects: StudentProject[] = [
  { id: 's1', title: 'Kannada speech-to-text for classroom captioning', team: 'Final-year B.Tech CSE team (4 students)', mentorSlug: 'dr-ananya-rao', departmentSlug: 'computer-science-engineering', outcome: 'Presented at Student Research Day; prototype in pilot use', year: 2026 },
  { id: 's2', title: 'Autonomous rover for crop-row inspection', team: 'Multidisciplinary robotics team (6 students)', mentorSlug: 'dr-vikram-iyer', departmentSlug: 'electronics-communication', outcome: 'Qualified for a national robotics final (details to be verified)', year: 2026 },
  { id: 's3', title: 'Bio-based phase-change material for cold storage boxes', team: 'M.Tech thesis (1 student)', mentorSlug: 'dr-rajesh-kulkarni', departmentSlug: 'mechanical-engineering', outcome: 'Conference paper submitted', year: 2025 },
  { id: 's4', title: 'Green synthesis of silver nanoparticles from leaf extracts', team: 'B.Sc. research internship (3 students)', mentorSlug: 'dr-meera-nair', departmentSlug: 'sciences', outcome: 'Poster at a state science symposium', year: 2025 },
  { id: 's5', title: 'UPI adoption among street vendors: a field survey', team: 'BBA live project (5 students)', mentorSlug: 'ms-kavya-pillai', departmentSlug: 'commerce-management', outcome: 'Report shared with a local traders’ association', year: 2025 },
  { id: 's6', title: 'Mapping legal aid awareness in peri-urban Bengaluru', team: 'BA LL.B. clinic project (4 students)', mentorSlug: 'ms-nisha-thomas', departmentSlug: 'law', outcome: 'Findings used to plan legal literacy camps', year: 2026 },
];

export const collaborations: Collaboration[] = [
  { id: 'c1', kind: 'Industry', partner: 'Software product company (partner name to be configured)', area: 'AI & cloud', activities: ['Sponsored final-year projects', 'Guest lectures', 'Internships'] },
  { id: 'c2', kind: 'Industry', partner: 'Embedded systems firm (partner name to be configured)', area: 'IoT & VLSI', activities: ['Lab equipment support', 'Joint prototyping'] },
  { id: 'c3', kind: 'Industry', partner: 'MSME manufacturing cluster (to be configured)', area: 'Manufacturing', activities: ['Consultancy projects', 'Plant visits'] },
  { id: 'c4', kind: 'Academic', partner: 'Partner university — India (to be configured)', area: 'Computer science', activities: ['Joint PhD supervision', 'Faculty exchange'] },
  { id: 'c5', kind: 'Academic', partner: 'Partner university — overseas (to be configured)', area: 'Humanities & social sciences', activities: ['Visiting scholars', 'Online co-taught courses'] },
  { id: 'c6', kind: 'Academic', partner: 'National research laboratory (to be configured)', area: 'Materials & chemistry', activities: ['Instrument access', 'Summer research fellowships'] },
  { id: 'c7', kind: 'Government & NGO', partner: 'District legal services authority (to be configured)', area: 'Law & society', activities: ['Legal literacy camps', 'Field research'] },
  { id: 'c8', kind: 'Government & NGO', partner: 'Agricultural NGO (to be configured)', area: 'Agri-tech', activities: ['Field trials', 'Farmer training'] },
];

export const mous: Mou[] = [
  { id: 'm1', partner: 'Industry partner A (to be configured)', partnerType: 'Industry', purpose: 'Industry-led certification programs, guest lectures and internships', signedOn: '2026-06-18', validUntil: '2029-06-17' },
  { id: 'm2', partner: 'University partner B (to be configured)', partnerType: 'University', purpose: 'Joint research, faculty exchange and co-supervision of doctoral students', signedOn: '2025-09-02', validUntil: '2030-09-01' },
  { id: 'm3', partner: 'Research laboratory C (to be configured)', partnerType: 'Research lab', purpose: 'Access to advanced characterisation instruments and summer fellowships', signedOn: '2024-11-15', validUntil: '2027-11-14' },
  { id: 'm4', partner: 'NGO partner D (to be configured)', partnerType: 'NGO', purpose: 'Community outreach, field research and student volunteering', signedOn: '2024-03-08', validUntil: '2027-03-07' },
  { id: 'm5', partner: 'Professional body E (to be configured)', partnerType: 'Professional body', purpose: 'Student chapter activities, technical talks and competitions', signedOn: '2023-07-21', validUntil: '2026-07-20' },
  { id: 'm6', partner: 'Industry partner F (to be configured)', partnerType: 'Industry', purpose: 'Embedded systems training lab and sponsored projects', signedOn: '2025-01-10', validUntil: '2028-01-09' },
];

export const incubation = {
  name: 'Crestwood Innovation & Incubation Centre',
  description:
    'A pre-incubation and incubation space where students, alumni and faculty turn research and ideas into ventures — with mentoring, prototyping access and help with intellectual property.',
  offerings: [
    { title: 'Ideation & pre-incubation', text: 'Problem-discovery bootcamps, design-thinking sprints and a 12-week validation track.', icon: 'Lightbulb' },
    { title: 'Prototyping access', text: 'Shared access to the additive manufacturing, electronics and computing labs.', icon: 'Cog' },
    { title: 'Mentoring network', text: 'Faculty, alumni and industry mentors matched to each team (mentor network to be configured).', icon: 'Users' },
    { title: 'IP & compliance support', text: 'Guidance on patent searches, filings and company registration through the IPR cell.', icon: 'ShieldCheck' },
  ],
  stats: [
    { label: 'Student start-ups supported', value: 24, isDemo: true },
    { label: 'Ideas in pre-incubation', value: 40, isDemo: true },
    { label: 'Mentors in network', value: 35, isDemo: true },
  ],
  image: images.workshop,
};

const file = (id: string, title: string, sizeKb: number): DownloadItem => ({ id, title, url: '/downloads/placeholder.pdf', sizeKb, fileType: 'PDF' });

export const researchResources: DownloadItem[] = [
  file('r-policy', 'Research Promotion Policy', 240),
  file('r-ethics', 'Research & Publication Ethics Policy', 210),
  file('r-ipr', 'Intellectual Property Rights (IPR) Policy', 260),
  file('r-seed', 'Seed Grant Guidelines & Application Form', 180),
  file('r-plag', 'Plagiarism Prevention Policy', 150),
  file('r-consult', 'Consultancy & Revenue Sharing Policy', 170),
];

export const researchFacilities = [
  'Institutional access to research databases (subscriptions to be configured)',
  'Plagiarism-check software for theses and manuscripts',
  'Central instrumentation facility (HPLC, FTIR, UV-Vis)',
  'GPU compute cluster for AI research',
  'Institutional Ethics Committee for research involving people',
];
