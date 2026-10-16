import type { DisclosureCategory, DisclosureDocument } from '@/types';

/**
 * Disclosure documents. All files currently point to a placeholder PDF. Upload the official,
 * signed documents and confirm applicable requirements with the affiliating university and regulators.
 */
const doc = (
  id: string,
  title: string,
  category: DisclosureCategory,
  academicYear: string,
  publishedOn: string,
  updatedOn: string = publishedOn,
  description?: string,
): DisclosureDocument => ({ id, title, category, academicYear, publishedOn, updatedOn, description, url: '/downloads/placeholder.pdf', fileType: 'PDF', sizeKb: 180 + id.length * 37 });

export const disclosures: DisclosureDocument[] = [
  doc('d01', 'University Affiliation Letter', 'Affiliation & Recognition', '2026–27', '2026-06-10', '2026-06-10', 'Continuation of affiliation for all programs.'),
  doc('d02', 'UGC Recognition under Section 2(f) & 12(B)', 'Affiliation & Recognition', '2025–26', '2025-04-02'),
  doc('d03', 'AICTE Extension of Approval (EoA)', 'Regulatory Approvals', '2026–27', '2026-05-28', '2026-05-28', 'Approval for technical programs and intake.'),
  doc('d04', 'Bar Council of India Approval — School of Law', 'Regulatory Approvals', '2026–27', '2026-03-15'),
  doc('d05', 'NCTE Recognition Order — B.Ed.', 'Regulatory Approvals', '2025–26', '2025-07-01'),
  doc('d06', 'NAAC Accreditation Certificate', 'Accreditation', '2024–25', '2024-11-20', '2024-11-20', 'Grade and validity to be configured.'),
  doc('d07', 'NBA Accreditation — Eligible Programs', 'Accreditation', '2025–26', '2025-09-05'),
  doc('d08', 'IQAC Composition & Meeting Minutes', 'IQAC', '2026–27', '2026-08-12', '2026-10-01'),
  doc('d09', 'Annual Quality Assurance Report (AQAR)', 'IQAC', '2025–26', '2026-09-20'),
  doc('d10', 'Self Study Report (SSR)', 'IQAC', '2024–25', '2024-06-30'),
  doc('d11', 'Annual Report 2025–26', 'Annual Reports', '2025–26', '2026-08-30'),
  doc('d12', 'Annual Report 2024–25', 'Annual Reports', '2024–25', '2025-08-28'),
  doc('d13', 'Anti-Ragging Policy & Committee', 'Policies', '2026–27', '2026-07-15', '2026-08-20'),
  doc('d14', 'Grievance Redressal Policy', 'Policies', '2026–27', '2026-07-15'),
  doc('d15', 'Code of Conduct for Students & Staff', 'Policies', '2026–27', '2026-07-15'),
  doc('d16', 'Examination & Evaluation Policy', 'Policies', '2026–27', '2026-07-20'),
  doc('d17', 'Research & Publication Ethics Policy', 'Policies', '2025–26', '2025-08-11'),
  doc('d18', 'Internal Complaints Committee (ICC)', 'Committees', '2026–27', '2026-07-10', '2026-07-10', 'Composition and contact details.'),
  doc('d19', 'Anti-Ragging Committee & Squad', 'Committees', '2026–27', '2026-07-10'),
  doc('d20', 'SC/ST Cell, OBC Cell & Equal Opportunity Cell', 'Committees', '2026–27', '2026-07-10'),
  doc('d21', 'Student Grievance Redressal Committee', 'Committees', '2026–27', '2026-07-10'),
  doc('d22', 'Approved Fee Structure 2026–27', 'Fee Structure', '2026–27', '2026-05-30', '2026-06-15'),
  doc('d23', 'Fee Refund Policy', 'Fee Structure', '2026–27', '2026-05-30'),
  doc('d24', 'Audited Financial Statements 2025–26', 'Audit & Finance', '2025–26', '2026-09-30'),
  doc('d25', 'Audited Financial Statements 2024–25', 'Audit & Finance', '2024–25', '2025-09-29'),
  doc('d26', 'Feedback Analysis & Action Taken Report', 'Quality Reports', '2025–26', '2026-07-31'),
  doc('d27', 'Academic & Administrative Audit Report', 'Quality Reports', '2025–26', '2026-06-25'),
  doc('d28', 'Mandatory Disclosure (AICTE format)', 'Regulatory Approvals', '2026–27', '2026-06-30', '2026-09-12'),
];

export const disclosureCategories: DisclosureCategory[] = [
  'Affiliation & Recognition',
  'Regulatory Approvals',
  'Accreditation',
  'IQAC',
  'Annual Reports',
  'Policies',
  'Committees',
  'Fee Structure',
  'Audit & Finance',
  'Quality Reports',
];

export const disclosureYears = Array.from(new Set(disclosures.map((d) => d.academicYear))).sort().reverse();
