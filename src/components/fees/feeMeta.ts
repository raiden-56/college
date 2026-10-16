import type { FeeComponent } from '@/types';
import type { BadgeTone } from '@/components/ui/Badge';
import { feeAcademicYears, type FeeYearId } from '@/utils/fees';

type FeeKind = FeeComponent['kind'];

/** Display order and labelling for fee component categories. */
export const feeKindOrder: FeeKind[] = ['tuition', 'other', 'one-time', 'optional'];

export const feeKindMeta: Record<FeeKind, { label: string; tone: BadgeTone; description: string }> = {
  tuition: { label: 'Tuition', tone: 'royal', description: 'Academic fee charged every year of the program.' },
  other: { label: 'Other charges', tone: 'sky', description: 'Examination, library, laboratory and development fees, charged every year.' },
  'one-time': { label: 'One-time', tone: 'gold', description: 'Charged once, at the time of admission (first year only).' },
  optional: { label: 'Optional', tone: 'slate', description: 'Hostel and transport — payable only if you opt for the facility.' },
};

export const sortFees = (fees: FeeComponent[]) => [...fees].sort((a, b) => feeKindOrder.indexOf(a.kind) - feeKindOrder.indexOf(b.kind));

/** The fee year shown by default: the currently approved schedule (falls back to the first listed). */
export const defaultFeeYear: FeeYearId = (feeAcademicYears.find((y) => y.status.startsWith('Approved')) ?? feeAcademicYears[0]).id;

export const isFeeYearId = (value: string): value is FeeYearId => feeAcademicYears.some((y) => y.id === value);

export const feeYearTone = (status: (typeof feeAcademicYears)[number]['status']): BadgeTone =>
  status.startsWith('Approved') ? 'green' : status === 'Proposed' ? 'gold' : 'slate';
