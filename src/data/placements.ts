import type { DepartmentPlacement, PlacementYear, Recruiter } from '@/types';

/**
 * PLACEMENT DATA — ALL VALUES BELOW ARE ILLUSTRATIVE (isDemo: true).
 * Replace with figures verified by the Training & Placement Cell / IQAC.
 * Methodology used for the placement rate: studentsPlaced ÷ eligibleStudents × 100, where
 * "eligible" = final-year students who registered for placement and met the eligibility criteria,
 * excluding students who opted for higher studies or entrepreneurship.
 */
export const placementMethodology =
  'Placement rate = students placed ÷ eligible students × 100. "Eligible students" are final-year students who registered with the Training & Placement Cell and met recruiter criteria; students who opted for higher studies or entrepreneurship are reported separately and excluded from the denominator. Packages are annual cost-to-company (CTC) as stated in offer letters.';

export const placementYears: PlacementYear[] = [
  { academicYear: '2021–22', eligibleStudents: 610, studentsPlaced: 455, companiesVisited: 92, medianPackageLpa: 4.2, highestPackageLpa: 18, higherStudies: 64, isDemo: true },
  { academicYear: '2022–23', eligibleStudents: 640, studentsPlaced: 497, companiesVisited: 105, medianPackageLpa: 4.5, highestPackageLpa: 21, higherStudies: 71, isDemo: true },
  { academicYear: '2023–24', eligibleStudents: 655, studentsPlaced: 502, companiesVisited: 110, medianPackageLpa: 4.6, highestPackageLpa: 19.5, higherStudies: 80, isDemo: true },
  { academicYear: '2024–25', eligibleStudents: 690, studentsPlaced: 548, companiesVisited: 121, medianPackageLpa: 5.0, highestPackageLpa: 24, higherStudies: 77, isDemo: true },
  { academicYear: '2025–26', eligibleStudents: 705, studentsPlaced: 571, companiesVisited: 128, medianPackageLpa: 5.4, highestPackageLpa: 26, higherStudies: 83, isDemo: true },
];

export const departmentPlacements: DepartmentPlacement[] = [
  { departmentSlug: 'computer-science-engineering', academicYear: '2025–26', eligible: 260, placed: 232, isDemo: true },
  { departmentSlug: 'electronics-communication', academicYear: '2025–26', eligible: 110, placed: 88, isDemo: true },
  { departmentSlug: 'mechanical-engineering', academicYear: '2025–26', eligible: 55, placed: 41, isDemo: true },
  { departmentSlug: 'commerce-management', academicYear: '2025–26', eligible: 190, placed: 151, isDemo: true },
  { departmentSlug: 'sciences', academicYear: '2025–26', eligible: 45, placed: 27, isDemo: true },
  { departmentSlug: 'humanities', academicYear: '2025–26', eligible: 25, placed: 15, isDemo: true },
  { departmentSlug: 'law', academicYear: '2025–26', eligible: 20, placed: 17, isDemo: true },
];

/** Placeholder recruiter categories — do not list real company names until verified. */
export const recruiters: Recruiter[] = [
  { name: 'IT Services Company A', sector: 'Information Technology', isDemo: true },
  { name: 'Product Company B', sector: 'Software Products', isDemo: true },
  { name: 'Semiconductor Firm C', sector: 'Electronics', isDemo: true },
  { name: 'Automotive OEM D', sector: 'Manufacturing', isDemo: true },
  { name: 'Bank E', sector: 'Banking & Finance', isDemo: true },
  { name: 'Consulting Firm F', sector: 'Consulting', isDemo: true },
  { name: 'Analytics Firm G', sector: 'Analytics', isDemo: true },
  { name: 'Law Firm H', sector: 'Legal', isDemo: true },
  { name: 'Pharma Company I', sector: 'Life Sciences', isDemo: true },
  { name: 'EdTech Company J', sector: 'Education', isDemo: true },
  { name: 'FMCG Company K', sector: 'Consumer Goods', isDemo: true },
  { name: 'Telecom Operator L', sector: 'Telecom', isDemo: true },
];

export const placementRate = (y: Pick<PlacementYear, 'studentsPlaced' | 'eligibleStudents'>) =>
  y.eligibleStudents === 0 ? 0 : Math.round((y.studentsPlaced / y.eligibleStudents) * 1000) / 10;

export const latestPlacementYear = placementYears[placementYears.length - 1];
