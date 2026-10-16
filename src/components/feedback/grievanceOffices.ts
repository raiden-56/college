import type { GrievanceInput } from '@/utils/schemas';

/**
 * Where grievances are routed, what each office handles and its target response time.
 * Timelines are indicative — confirm against the institution's approved grievance policy and UGC regulations.
 */
export const grievanceOffices: { value: GrievanceInput['office']; handles: string; timeline: string; icon: string }[] = [
  { value: 'Grievance Redressal Cell', handles: 'Academic, administrative, fee, facility and general complaints.', timeline: '15 working days', icon: 'Scale' },
  { value: 'Anti-Ragging Committee', handles: 'Any form of ragging, bullying or harassment of students.', timeline: 'first action within 24 hours', icon: 'ShieldCheck' },
  { value: 'Internal Complaints Committee', handles: 'Sexual harassment complaints under the POSH Act and UGC regulations.', timeline: 'acknowledgement within 7 days; inquiry completed within 90 days', icon: 'HeartHandshake' },
  { value: 'Examination Section', handles: 'Results, revaluation, hall tickets, marks cards and examination conduct.', timeline: '10 working days', icon: 'ClipboardCheck' },
  { value: 'Equal Opportunity Cell', handles: 'Discrimination, accessibility and support for students from disadvantaged groups or with disabilities.', timeline: '15 working days', icon: 'Accessibility' },
];
