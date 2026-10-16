import type { AlumniStory } from '@/types';
import { portraits } from './images';

/**
 * DEMO ALUMNI — fictional people and organisations. Publish real alumni only with written consent;
 * the public directory lists only records where directoryConsent is true.
 */
export const alumni: AlumniStory[] = [
  { id: 'a1', name: 'Nikhil Bhatt', batch: 2012, departmentSlug: 'computer-science-engineering', program: 'B.Tech CSE', industry: 'Technology', role: 'Engineering Director', organization: 'A global software company', story: 'Started as an intern in a campus-placed role and now leads a distributed engineering organisation. Mentors final-year students every year.', photo: portraits.m4, directoryConsent: true },
  { id: 'a2', name: 'Shreya Ghosh', batch: 2015, departmentSlug: 'commerce-management', program: 'MBA', industry: 'Finance', role: 'Vice President, Risk', organization: 'A multinational bank', story: 'Credits case-based learning and the investment club for her interest in risk management.', photo: portraits.f2, directoryConsent: true },
  { id: 'a3', name: 'Arun Prakash', batch: 2009, departmentSlug: 'mechanical-engineering', program: 'B.Tech Mechanical', industry: 'Entrepreneurship', role: 'Founder & CEO', organization: 'An EV components start-up', story: 'Founded a start-up building EV components after a decade in automotive design. Now hires interns from the college.', photo: portraits.m6, directoryConsent: true },
  { id: 'a4', name: 'Fathima Zahra', batch: 2017, departmentSlug: 'law', program: 'BA LLB', industry: 'Law', role: 'Advocate', organization: 'High Court practice', story: 'A former moot court champion who now practises constitutional and service law.', photo: portraits.f5, directoryConsent: true },
  { id: 'a5', name: 'Dr. Kiran Shetty', batch: 2008, departmentSlug: 'sciences', program: 'M.Sc Chemistry', industry: 'Research & Academia', role: 'Senior Scientist', organization: 'A national research laboratory', story: 'Discovered research during an undergraduate project and went on to complete a Ph.D. in catalysis.', photo: portraits.m8, directoryConsent: true },
  { id: 'a6', name: 'Meghana Rao', batch: 2019, departmentSlug: 'electronics-communication', program: 'B.Tech ECE', industry: 'Technology', role: 'Design Verification Engineer', organization: 'A semiconductor company', story: 'Built a portfolio of embedded projects in the IoT lab that led directly to a design role.', photo: portraits.f6, directoryConsent: false },
  { id: 'a7', name: 'Rohit Nair', batch: 2014, departmentSlug: 'humanities', program: 'B.A. EEP', industry: 'Public Service', role: 'Civil Servant', organization: 'Government of India (demo)', story: 'Says the debate club and economics electives shaped his interest in public policy.', photo: portraits.m3, directoryConsent: true },
  { id: 'a8', name: 'Ananya Kapoor', batch: 2020, departmentSlug: 'humanities', program: 'M.A. English', industry: 'Media & Arts', role: 'Editor', organization: 'A publishing house', story: 'Edited the college magazine and now works with debut authors at a publishing house.', photo: portraits.f7, directoryConsent: true },
];

export const alumniIndustries = Array.from(new Set(alumni.map((a) => a.industry))).sort();
export const alumniBatches = Array.from(new Set(alumni.map((a) => a.batch))).sort((a, b) => b - a);
