import { describe, expect, it } from 'vitest';
import { dateParts, formatDateRange, formatDuration, formatFileSize, formatINR, initials } from '../format';

describe('format utilities', () => {
  it('formats INR with Indian digit grouping and no decimals', () => {
    expect(formatINR(185000)).toBe('₹1,85,000');
    expect(formatINR(1234567)).toBe('₹12,34,567');
  });

  it('formats durations in years or months', () => {
    expect(formatDuration(4)).toBe('4 years');
    expect(formatDuration(1)).toBe('1 year');
    expect(formatDuration(0.5)).toBe('6 months');
  });

  it('formats date ranges compactly', () => {
    expect(formatDateRange('2026-11-20T09:00:00+05:30', '2026-11-22T18:00:00+05:30')).toBe('20 – 22 Nov 2026');
    expect(formatDateRange('2026-11-08')).toBe('8 Nov 2026');
    expect(formatDateRange('2027-01-30T10:00:00+05:30', '2027-02-01T21:00:00+05:30')).toBe('30 Jan – 1 Feb 2027');
    expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('30 Dec 2026 – 2 Jan 2027');
  });

  it('splits dates for calendar badges', () => {
    expect(dateParts('2026-11-08')).toEqual({ day: '08', month: 'Nov', year: 2026 });
  });

  it('formats file sizes', () => {
    expect(formatFileSize(512)).toBe('512 KB');
    expect(formatFileSize(4800)).toBe('4.7 MB');
    expect(formatFileSize()).toBe('');
  });

  it('builds initials without honorifics', () => {
    expect(initials('Dr. Ananya Rao')).toBe('AR');
    expect(initials('Prof. Arjun Menon')).toBe('AM');
  });
});
