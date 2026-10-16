import { describe, expect, it } from 'vitest';
import type { FeeComponent } from '@/types';
import { computeFeeTotals, feesForYear, yearWiseSchedule } from '../fees';

const fees: FeeComponent[] = [
  { label: 'Tuition', amount: 100000, kind: 'tuition' },
  { label: 'Admission', amount: 10000, kind: 'one-time' },
  { label: 'Lab', amount: 5000, kind: 'other' },
  { label: 'Exam', amount: 5000, kind: 'other' },
  { label: 'Hostel', amount: 100000, kind: 'optional' },
];

describe('computeFeeTotals', () => {
  it('separates tuition, other, one-time and optional charges', () => {
    const t = computeFeeTotals(fees, 4);
    expect(t.tuition).toBe(100000);
    expect(t.other).toBe(10000);
    expect(t.oneTime).toBe(10000);
    expect(t.optional).toBe(100000);
  });

  it('adds one-time charges only to the first year and excludes optional charges from totals', () => {
    const t = computeFeeTotals(fees, 4);
    expect(t.firstYear).toBe(120000);
    expect(t.subsequentYear).toBe(110000);
    expect(t.programTotal).toBe(110000 * 4 + 10000);
  });

  it('pro-rates programs shorter than a year', () => {
    const t = computeFeeTotals(fees, 0.5);
    expect(t.firstYear).toBe(55000 + 10000);
    expect(t.programTotal).toBe(65000);
  });
});

describe('feesForYear', () => {
  it('applies the revision factor and rounds to the nearest 100', () => {
    const revised = feesForYear(fees, '2027-28');
    expect(revised[0].amount).toBe(105000);
    expect(feesForYear([{ label: 'x', amount: 1234, kind: 'other' }], '2027-28')[0].amount).toBe(1300);
  });

  it('keeps amounts for the base year', () => {
    expect(feesForYear(fees, '2026-27').map((f) => f.amount)).toEqual(fees.map((f) => f.amount));
  });
});

describe('yearWiseSchedule', () => {
  it('returns one row per year with one-time charges in year 1', () => {
    const rows = yearWiseSchedule({ fees, durationYears: 3 });
    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({ year: 1, oneTime: 10000, total: 120000 });
    expect(rows[2]).toMatchObject({ year: 3, oneTime: 0, total: 110000 });
  });
});
