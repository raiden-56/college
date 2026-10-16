import { z } from 'zod';

/** Shared validation rules. The backend must re-validate — client checks are for UX only. */

const name = z
  .string()
  .trim()
  .min(2, 'Please enter your full name.')
  .max(80, 'Name is too long.')
  .regex(/^[\p{L} .'-]+$/u, 'Name can contain letters, spaces, dots, apostrophes and hyphens only.');

const email = z.string().trim().min(1, 'Email is required.').email('Enter a valid email address, e.g. name@example.com.');

/** Indian mobile numbers (10 digits, starting 6–9) with optional +91 / 0 prefix and spaces. */
const phone = z
  .string()
  .trim()
  .min(1, 'Phone number is required.')
  .transform((v) => v.replace(/[\s-]/g, ''))
  .refine((v) => /^(\+91|91|0)?[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit mobile number.');

const message = (min = 10, max = 1000) =>
  z.string().trim().min(min, `Please write at least ${min} characters.`).max(max, `Please keep it under ${max} characters.`);

const consent = z.boolean().refine((v) => v, 'Please accept to continue.');

export const qualificationOptions = [
  '10th / SSLC',
  '12th / PUC (Science)',
  '12th / PUC (Commerce)',
  '12th / PUC (Arts)',
  'Diploma',
  'Bachelor’s degree',
  'Master’s degree',
  'Other',
] as const;

export const admissionEnquirySchema = z.object({
  fullName: name,
  email,
  phone,
  program: z.string().min(1, 'Please choose a preferred course.'),
  qualification: z.enum(qualificationOptions, { message: 'Please select your highest qualification.' }),
  message: z.string().trim().max(1000, 'Please keep it under 1000 characters.').optional().or(z.literal('')),
  consent,
});
export type AdmissionEnquiryInput = z.input<typeof admissionEnquirySchema>;

export const campusVisitSchema = z.object({
  fullName: name,
  email,
  phone,
  visitDate: z
    .string()
    .min(1, 'Choose a preferred date.')
    .refine((v) => new Date(`${v}T23:59:59`).getTime() >= Date.now(), 'Please choose a future date.')
    .refine((v) => new Date(`${v}T12:00:00`).getDay() !== 0, 'The campus is closed for visits on Sundays.'),
  visitors: z.coerce.number({ message: 'Enter number of visitors.' }).int().min(1, 'At least 1 visitor.').max(10, 'For groups larger than 10, please call us.'),
  interest: z.string().optional(),
});
export type CampusVisitInput = z.input<typeof campusVisitSchema>;

export const contactSchema = z.object({
  fullName: name,
  email,
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .refine((v) => v === '' || /^(\+91|91|0)?[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit mobile number.')
    .optional(),
  department: z.string().min(1, 'Choose who your message is for.'),
  subject: z.string().trim().min(3, 'Please add a subject.').max(120),
  message: message(20),
});
export type ContactInput = z.input<typeof contactSchema>;

export const feedbackCategories = [
  'Teaching & academic experience',
  'Infrastructure & facilities',
  'Administration & services',
  'Hostel & transport',
  'Library & resources',
  'Suggestion',
] as const;

export const feedbackSchema = z.object({
  respondentType: z.enum(['Student', 'Parent', 'Faculty', 'Alumni', 'Visitor'], { message: 'Tell us who you are.' }),
  category: z.enum(feedbackCategories, { message: 'Please select a category.' }),
  rating: z.number({ message: 'Please choose a rating.' }).int().min(1, 'Please choose a rating.').max(5),
  comments: message(15, 1500),
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().email('Enter a valid email address.').optional().or(z.literal('')),
  allowPublic: z.boolean(),
});
export type FeedbackInput = z.input<typeof feedbackSchema>;

export const grievanceSchema = z.object({
  fullName: name,
  email,
  phone,
  role: z.enum(['Student', 'Parent', 'Staff', 'Other'], { message: 'Please select your role.' }),
  office: z.enum(['Grievance Redressal Cell', 'Anti-Ragging Committee', 'Internal Complaints Committee', 'Examination Section', 'Equal Opportunity Cell'], {
    message: 'Please select where this should go.',
  }),
  description: message(30, 3000),
  confidential: z.boolean(),
});
export type GrievanceInput = z.input<typeof grievanceSchema>;

export const alumniRegistrationSchema = z.object({
  fullName: name,
  email,
  phone,
  batch: z.coerce
    .number({ message: 'Enter your graduation year.' })
    .int()
    .min(1987, 'Our first batch graduated after 1987.')
    .max(new Date().getFullYear(), 'Graduation year cannot be in the future.'),
  program: z.string().min(1, 'Select your program.'),
  organization: z.string().trim().max(120).optional(),
  role: z.string().trim().max(120).optional(),
  mentor: z.boolean(),
  directoryConsent: z.boolean(),
});
export type AlumniRegistrationInput = z.input<typeof alumniRegistrationSchema>;

export const newsletterSchema = z.object({ email });
export type NewsletterInput = z.input<typeof newsletterSchema>;
