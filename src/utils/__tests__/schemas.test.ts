import { describe, expect, it } from 'vitest';
import { admissionEnquirySchema, campusVisitSchema, contactSchema, feedbackSchema } from '../schemas';

const validEnquiry = {
  fullName: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '+91 98450 12345',
  program: 'bca',
  qualification: '12th / PUC (Science)',
  message: '',
  consent: true,
};

describe('admissionEnquirySchema', () => {
  it('accepts a valid enquiry and normalises the phone number', () => {
    const parsed = admissionEnquirySchema.parse(validEnquiry);
    expect(parsed.phone).toBe('+919845012345');
  });

  it.each([
    ['phone', '12345', /10-digit/],
    ['phone', '5845012345', /10-digit/],
    ['email', 'not-an-email', /valid email/],
    ['fullName', 'A', /full name/],
    ['program', '', /preferred course/],
  ])('rejects invalid %s', (field, value, message) => {
    const result = admissionEnquirySchema.safeParse({ ...validEnquiry, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues.find((i) => i.path[0] === field)?.message).toMatch(message);
  });

  it('requires consent', () => {
    const result = admissionEnquirySchema.safeParse({ ...validEnquiry, consent: false });
    expect(result.success).toBe(false);
  });
});

describe('campusVisitSchema', () => {
  const base = { fullName: 'Ravi Kumar', email: 'ravi@example.com', phone: '9876543210', visitors: '2' };

  it('rejects past dates', () => {
    expect(campusVisitSchema.safeParse({ ...base, visitDate: '2020-01-06' }).success).toBe(false);
  });

  it('rejects Sundays and coerces visitor count', () => {
    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
    const iso = nextSunday.toISOString().slice(0, 10);
    expect(campusVisitSchema.safeParse({ ...base, visitDate: iso }).success).toBe(false);

    const monday = new Date(nextSunday);
    monday.setDate(monday.getDate() + 1);
    const ok = campusVisitSchema.safeParse({ ...base, visitDate: monday.toISOString().slice(0, 10) });
    expect(ok.success).toBe(true);
    expect(ok.data?.visitors).toBe(2);
  });
});

describe('contactSchema', () => {
  it('allows an empty optional phone but validates a provided one', () => {
    const base = { fullName: 'Asha Rao', email: 'asha@example.com', department: 'admissions', subject: 'Hostel', message: 'Is hostel available for first-year students?' };
    expect(contactSchema.safeParse({ ...base, phone: '' }).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, phone: '123' }).success).toBe(false);
  });
});

describe('feedbackSchema', () => {
  it('requires a rating between 1 and 5', () => {
    const base = { respondentType: 'Student', category: 'Suggestion', comments: 'More evening library hours please.', allowPublic: false };
    expect(feedbackSchema.safeParse({ ...base, rating: 0 }).success).toBe(false);
    expect(feedbackSchema.safeParse({ ...base, rating: 4 }).success).toBe(true);
  });
});
