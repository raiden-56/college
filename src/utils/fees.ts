import type { FeeComponent, Program } from '@/types';

/** Academic years for which a fee schedule is published. Revision factors are ILLUSTRATIVE. */
export const feeAcademicYears = [
  { id: '2027-28', label: '2027–28', revision: 1.05, status: 'Proposed' as const },
  { id: '2026-27', label: '2026–27', revision: 1, status: 'Approved (demo)' as const },
  { id: '2025-26', label: '2025–26', revision: 0.95, status: 'Archived' as const },
];

export type FeeYearId = (typeof feeAcademicYears)[number]['id'];

const roundTo = (n: number, step = 100) => Math.round(n / step) * step;

/** Apply a year's revision factor to every component. */
export const feesForYear = (fees: FeeComponent[], yearId: FeeYearId): FeeComponent[] => {
  const revision = feeAcademicYears.find((y) => y.id === yearId)?.revision ?? 1;
  return fees.map((f) => ({ ...f, amount: roundTo(f.amount * revision) }));
};

export interface FeeTotals {
  tuition: number;
  other: number;
  oneTime: number;
  optional: number;
  /** Year 1 = tuition + other + one-time */
  firstYear: number;
  /** Each subsequent year = tuition + other */
  subsequentYear: number;
  /** Whole program, excluding optional hostel/transport */
  programTotal: number;
}

export const computeFeeTotals = (fees: FeeComponent[], durationYears: number): FeeTotals => {
  const sum = (kind: FeeComponent['kind']) => fees.filter((f) => f.kind === kind).reduce((acc, f) => acc + f.amount, 0);
  const tuition = sum('tuition');
  const other = sum('other');
  const oneTime = sum('one-time');
  const optional = sum('optional');
  const years = Math.max(durationYears, 0.5);
  const annual = tuition + other;
  // Programs shorter than a year are charged pro-rata on the annual amount.
  const programTotal = years < 1 ? roundTo(annual * years) + oneTime : annual * years + oneTime;
  return {
    tuition,
    other,
    oneTime,
    optional,
    firstYear: (years < 1 ? roundTo(annual * years) : annual) + oneTime,
    subsequentYear: annual,
    programTotal,
  };
};

/** Year-by-year breakdown rows for a program (year 1 includes one-time charges). */
export const yearWiseSchedule = (program: Pick<Program, 'fees' | 'durationYears'>) => {
  const totals = computeFeeTotals(program.fees, program.durationYears);
  const years = Math.max(1, Math.ceil(program.durationYears));
  return Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    tuition: program.durationYears < 1 ? roundTo(totals.tuition * program.durationYears) : totals.tuition,
    other: program.durationYears < 1 ? roundTo(totals.other * program.durationYears) : totals.other,
    oneTime: i === 0 ? totals.oneTime : 0,
    total: i === 0 ? totals.firstYear : totals.subsequentYear,
  }));
};
