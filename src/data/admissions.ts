/**
 * Admission cycle content. Dates are ILLUSTRATIVE for the 2027–28 cycle — publish the official
 * schedule from the admission notification.
 */
export const admissionCycle = '2027–28';

export const admissionSteps = [
  { icon: 'Search', title: 'Explore programs', text: 'Compare programs, eligibility and fees using the course finder.' },
  { icon: 'MessageSquare', title: 'Submit an enquiry', text: 'Share your details; a counsellor will call you within two working days.' },
  { icon: 'FileText', title: 'Apply & upload documents', text: 'Complete the application and upload marks cards and entrance scores.' },
  { icon: 'ClipboardCheck', title: 'Counselling & verification', text: 'Attend counselling / interview and original document verification.' },
  { icon: 'BadgeCheck', title: 'Confirm your seat', text: 'Pay the first-year fee to receive your admission confirmation.' },
];

export const importantDates = [
  { label: 'Applications open', date: '2026-11-01', note: 'All programs' },
  { label: 'Campus Open Day', date: '2026-11-08', note: 'Tours, counselling & lab demos' },
  { label: 'Early-bird application deadline', date: '2027-01-31', note: 'Priority counselling' },
  { label: 'PG entrance test', date: '2027-04-18', note: 'MBA, M.Tech, MCA (where applicable)' },
  { label: 'UG counselling begins', date: '2027-06-10', note: 'As per university / state schedule' },
  { label: 'Classes commence', date: '2027-08-02', note: 'Induction program for first-year students' },
];

export const requiredDocuments = [
  { name: '10th (SSLC) marks card', required: true },
  { name: '12th / PUC marks card (or provisional)', required: true },
  { name: 'Graduation marks cards & degree certificate (PG applicants)', required: false },
  { name: 'Entrance exam score card (where applicable)', required: false },
  { name: 'Transfer certificate from last institution', required: true },
  { name: 'Migration certificate (other boards / universities)', required: false },
  { name: 'Caste / category certificate (if claiming reservation)', required: false },
  { name: 'Income certificate (for fee concessions / scholarships)', required: false },
  { name: 'Aadhaar card or other government photo ID', required: true },
  { name: 'Four recent passport-size photographs', required: true },
  { name: 'Medical fitness certificate', required: true },
  { name: 'Anti-ragging undertaking (student & parent)', required: true },
];

export const scholarships = [
  { icon: 'Trophy', title: 'Merit scholarships', text: 'Fee waivers for high achievers in qualifying exams — tiered by score.', value: 'Up to 50% tuition (demo)' },
  { icon: 'HeartHandshake', title: 'Need-based concessions', text: 'Support for students from economically weaker families, assessed on income documents.', value: 'Case by case' },
  { icon: 'Landmark', title: 'Government scholarships', text: 'Guidance for state and central schemes via the national scholarship portal.', value: 'As per scheme' },
  { icon: 'Medal', title: 'Sports & cultural', text: 'For students representing the state or nation in sports, arts or culture.', value: 'Up to 25% tuition (demo)' },
];
