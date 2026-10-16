import { BedDouble, CalendarRange, Layers, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FeeComponent } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ResponsiveTable, type Column } from '@/components/ui/ResponsiveTable';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { computeFeeTotals, yearWiseSchedule, type FeeTotals } from '@/utils/fees';
import { formatDuration, formatINR } from '@/utils/format';
import { cn } from '@/utils/cn';
import { feeKindMeta, sortFees } from './feeMeta';

interface FeeBreakdownTableProps {
  /** Fee components already adjusted for the selected academic year */
  fees: FeeComponent[];
  durationYears: number;
  caption: ReactNode;
  className?: string;
}

/** Component-wise fee table, grouped tuition → other → one-time → optional, with subtotals. */
export function FeeBreakdownTable({ fees, durationYears, caption, className }: FeeBreakdownTableProps) {
  const totals = computeFeeTotals(fees, durationYears);
  const shortProgram = durationYears < 1;

  const columns: Column<FeeComponent>[] = [
    {
      key: 'label',
      header: 'Fee component',
      cell: (f) => (
        <span className="block">
          <span className="block">{f.label}</span>
          {f.note && <span className="mt-0.5 block text-xs font-normal text-ink-muted">{f.note}</span>}
        </span>
      ),
    },
    { key: 'kind', header: 'Category', cell: (f) => <Badge tone={feeKindMeta[f.kind].tone}>{feeKindMeta[f.kind].label}</Badge> },
    {
      key: 'charged',
      header: 'Charged',
      cell: (f) => (f.kind === 'one-time' ? 'Once, at admission' : f.kind === 'optional' ? 'Per year, if opted' : 'Every year'),
    },
    { key: 'amount', header: shortProgram ? 'Annual rate' : 'Amount / year', numeric: true, cell: (f) => <span className="font-semibold text-navy-950">{formatINR(f.amount)}</span> },
  ];

  return (
    <ResponsiveTable
      className={className}
      caption={caption}
      columns={columns}
      rows={sortFees(fees)}
      rowKey={(f) => f.label}
      stackOnMobile
      footer={<FeeSubtotals totals={totals} shortProgram={shortProgram} durationYears={durationYears} />}
    />
  );
}

function FeeSubtotals({ totals, shortProgram, durationYears }: { totals: FeeTotals; shortProgram: boolean; durationYears: number }) {
  const rows = [
    { label: 'Tuition (per year)', value: totals.tuition },
    { label: 'Other charges (per year)', value: totals.other },
    { label: 'One-time charges', value: totals.oneTime },
    { label: shortProgram ? `Total for ${formatDuration(durationYears)} (excl. optional)` : 'First-year total (excl. optional)', value: totals.firstYear, strong: true },
    { label: 'Optional hostel & transport (per year)', value: totals.optional, muted: true },
  ];
  return (
    <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className={cn('flex items-baseline justify-between gap-4', r.strong && 'sm:col-span-2 border-t border-navy-200 pt-2 text-base')}>
          <dt className={cn('font-semibold', r.muted ? 'text-ink-muted' : 'text-navy-900')}>{r.label}</dt>
          <dd className={cn('tabular-nums', r.strong ? 'font-extrabold text-royal-800' : r.muted ? 'font-semibold text-ink-muted' : 'font-bold text-navy-950')}>{formatINR(r.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

interface YearScheduleTableProps {
  fees: FeeComponent[];
  durationYears: number;
  caption: ReactNode;
  className?: string;
}

type ScheduleRow = ReturnType<typeof yearWiseSchedule>[number];

/** Year-by-year payable amounts (year 1 includes one-time charges; optional facilities excluded). */
export function YearScheduleTable({ fees, durationYears, caption, className }: YearScheduleTableProps) {
  const rows = yearWiseSchedule({ fees, durationYears });
  const totals = computeFeeTotals(fees, durationYears);
  const columns: Column<ScheduleRow>[] = [
    { key: 'year', header: 'Year', cell: (r) => (durationYears < 1 ? `Program (${formatDuration(durationYears)})` : `Year ${r.year}`) },
    { key: 'tuition', header: 'Tuition', numeric: true, cell: (r) => formatINR(r.tuition) },
    { key: 'other', header: 'Other charges', numeric: true, cell: (r) => formatINR(r.other) },
    { key: 'oneTime', header: 'One-time', numeric: true, cell: (r) => (r.oneTime ? formatINR(r.oneTime) : '—') },
    { key: 'total', header: 'Payable', numeric: true, cell: (r) => <span className="font-bold text-navy-950">{formatINR(r.total)}</span> },
  ];
  return (
    <ResponsiveTable
      className={className}
      caption={caption}
      columns={columns}
      rows={rows}
      rowKey={(r) => String(r.year)}
      stackOnMobile
      footer={
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span>Whole-program total (excl. optional hostel & transport)</span>
          <span className="text-base font-extrabold tabular-nums text-royal-800">{formatINR(totals.programTotal)}</span>
        </div>
      }
    />
  );
}

interface FeeSummaryCardsProps {
  fees: FeeComponent[];
  durationYears: number;
  className?: string;
}

/** Headline fee figures: first year, subsequent years, whole program and optional facilities. */
export function FeeSummaryCards({ fees, durationYears, className }: FeeSummaryCardsProps) {
  const t = computeFeeTotals(fees, durationYears);
  const multiYear = durationYears > 1;
  const cards = [
    {
      icon: Wallet,
      label: durationYears < 1 ? 'Total course fee' : 'First-year total',
      value: formatINR(t.firstYear),
      hint: 'Tuition + other charges + one-time admission fees',
      highlight: true,
    },
    {
      icon: CalendarRange,
      label: 'Each subsequent year',
      value: multiYear ? formatINR(t.subsequentYear) : 'Not applicable',
      hint: multiYear ? 'Tuition + other charges (no one-time fees)' : 'Program completes within one year',
    },
    {
      icon: Layers,
      label: 'Whole-program total',
      value: formatINR(t.programTotal),
      hint: `For ${formatDuration(durationYears)}, excluding optional facilities`,
    },
    {
      icon: BedDouble,
      label: 'Optional: hostel & transport',
      value: t.optional ? `${formatINR(t.optional)}/yr` : 'Not applicable',
      hint: 'Only if you opt in; varies by room type / route',
    },
  ];

  return (
    <Stagger as="ul" className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {cards.map((c) => (
        <StaggerItem as="li" key={c.label}>
          <div className={cn('card card-hover relative h-full overflow-hidden p-5', c.highlight && 'border-royal-200 bg-gradient-to-br from-royal-700 to-navy-900 text-white')}>
            <span className={cn('grid h-10 w-10 place-items-center rounded-xl', c.highlight ? 'bg-white/15 text-gold-300' : 'bg-royal-50 text-royal-700')}>
              <c.icon className="h-5 w-5" aria-hidden />
            </span>
            <p className={cn('mt-4 text-xs font-bold uppercase tracking-wider', c.highlight ? 'text-royal-100' : 'text-ink-muted')}>{c.label}</p>
            <p className={cn('mt-1 font-display text-2xl font-extrabold tabular-nums', c.highlight ? 'text-white' : 'text-navy-950')}>{c.value}</p>
            <p className={cn('mt-1.5 text-xs leading-relaxed', c.highlight ? 'text-royal-100' : 'text-ink-muted')}>{c.hint}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
