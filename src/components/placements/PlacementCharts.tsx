import { Info, Table2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts';
import type { DepartmentPlacement, PlacementYear } from '@/types';
import { placementMethodology, placementRate } from '@/data/placements';
import { getDepartment } from '@/data/departments';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { formatNumber } from '@/utils/format';

/**
 * Chart colours mirror tailwind.config.ts (Recharts needs raw values for SVG attributes).
 * Pair royal-700 / gold-400 validated for colour-vision deficiency separation; gold is below 3:1
 * contrast on white, so every chart ships with a data table and a legend (never colour alone).
 */
const C = {
  royal: '#1d3fd8', // royal-700
  gold: '#dbad38', // gold-400
  grid: '#d9e3f5', // navy-100
  axis: '#475569', // ink-muted
  ink: '#0f1d40', // navy-900
  surface: '#ffffff',
};

const axisTick = { fill: C.axis, fontSize: 12 };

/* ------------------------------------------------------------------ */
/* Shared frame: title, scope (year / eligible / placed), methodology, table */
/* ------------------------------------------------------------------ */

interface ChartFrameProps {
  id: string;
  title: string;
  subtitle: string;
  facts: { label: string; value: ReactNode }[];
  children: ReactNode;
  table: ReactNode;
  note?: ReactNode;
}

function ChartFrame({ id, title, subtitle, facts, children, table, note }: ChartFrameProps) {
  return (
    <figure className="card flex h-full flex-col p-5 sm:p-6" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id={`${id}-title`} className="text-lg font-bold">
            {title}
          </h3>
          <p id={`${id}-desc`} className="mt-1 text-sm text-ink-muted">
            {subtitle}
          </p>
        </div>
        <DemoBadge />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
        {facts.map((f) => (
          <div key={f.label} className="rounded-lg bg-surface-sunken px-3 py-2">
            <dt className="font-semibold uppercase tracking-wide text-ink-muted">{f.label}</dt>
            <dd className="mt-0.5 text-sm font-bold text-navy-950">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 min-w-0 flex-1">{children}</div>

      <figcaption className="mt-4 flex gap-2 rounded-xl bg-royal-50/60 p-3 text-xs leading-relaxed text-ink-soft">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-royal-700" aria-hidden />
        <span>
          <strong className="text-navy-900">How this is calculated: </strong>
          {note ?? placementMethodology}
        </span>
      </figcaption>

      <details className="group mt-3 rounded-xl border border-navy-100">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-royal-700 hover:bg-royal-50 [&::-webkit-details-marker]:hidden">
          <Table2 className="h-4 w-4" aria-hidden />
          <span className="group-open:hidden">View data table</span>
          <span className="hidden group-open:inline">Hide data table</span>
        </summary>
        <div className="p-3 pt-1">{table}</div>
      </details>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */

function TooltipShell({ title, rows }: { title: ReactNode; rows: { key: string; color?: string; label: string; value: string }[] }) {
  return (
    <div className="rounded-xl border border-navy-100 bg-white px-3.5 py-2.5 text-xs shadow-lift">
      <p className="font-bold text-navy-950">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-2 text-ink-soft">
            {r.color && <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: r.color }} aria-hidden />}
            <span>{r.label}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums text-navy-950">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Placement rate trend                                             */
/* ------------------------------------------------------------------ */

interface RatePoint {
  year: string;
  rate: number;
  placed: number;
  eligible: number;
}

function RateTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as RatePoint;
  return (
    <TooltipShell
      title={`Academic year ${p.year}`}
      rows={[
        { key: 'rate', color: C.royal, label: 'Placement rate', value: `${p.rate}%` },
        { key: 'placed', label: 'Placed / eligible', value: `${formatNumber(p.placed)} / ${formatNumber(p.eligible)}` },
      ]}
    />
  );
}

export function PlacementRateCard({ years, selectedYear }: { years: PlacementYear[]; selectedYear: string }) {
  const data: RatePoint[] = years.map((y) => ({ year: y.academicYear, rate: placementRate(y), placed: y.studentsPlaced, eligible: y.eligibleStudents }));
  const first = years[0];
  const last = years[years.length - 1];
  const totalEligible = years.reduce((s, y) => s + y.eligibleStudents, 0);
  const totalPlaced = years.reduce((s, y) => s + y.studentsPlaced, 0);

  return (
    <ChartFrame
      id="chart-rate"
      title="Placement rate trend"
      subtitle={`Share of eligible students placed, ${first.academicYear} to ${last.academicYear}. The selected year (${selectedYear}) is highlighted.`}
      facts={[
        { label: 'Academic years', value: `${first.academicYear} – ${last.academicYear}` },
        { label: 'Eligible (all years)', value: formatNumber(totalEligible) },
        { label: 'Placed (all years)', value: formatNumber(totalPlaced) },
      ]}
      table={
        <ResponsiveTable
          caption="Placement rate by academic year (demo data)"
          rows={data}
          rowKey={(r) => r.year}
          columns={[
            { key: 'year', header: 'Academic year', cell: (r) => r.year },
            { key: 'eligible', header: 'Eligible', numeric: true, cell: (r) => formatNumber(r.eligible) },
            { key: 'placed', header: 'Placed', numeric: true, cell: (r) => formatNumber(r.placed) },
            { key: 'rate', header: 'Rate', numeric: true, cell: (r) => `${r.rate}%` },
          ]}
        />
      }
    >
      <div className="h-[260px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 20, bottom: 4, left: -8 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="year" tick={axisTick} tickLine={false} axisLine={{ stroke: C.grid }} interval="preserveStartEnd" />
            <YAxis domain={[50, 100]} ticks={[50, 60, 70, 80, 90, 100]} tickFormatter={(v: number) => `${v}%`} tick={axisTick} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={RateTooltip} cursor={{ stroke: C.grid, strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="rate"
              name="Placement rate"
              stroke={C.royal}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={(p) => {
                const selected = (p.payload as RatePoint).year === selectedYear;
                return <circle key={`dot-${p.index}`} cx={p.cx} cy={p.cy} r={selected ? 7 : 4} fill={selected ? C.gold : C.royal} stroke={C.surface} strokeWidth={2} />;
              }}
              activeDot={{ r: 6, fill: C.royal, stroke: C.surface, strokeWidth: 2 }}
            >
              <LabelList
                dataKey="rate"
                position="top"
                offset={12}
                content={(props) => {
                  const { x, y, value, index } = props;
                  if (data[Number(index)]?.year !== selectedYear) return null;
                  return (
                    <text x={Number(x)} y={Number(y) - 12} textAnchor="middle" fill={C.ink} fontSize={12} fontWeight={700}>
                      {`${value}%`}
                    </text>
                  );
                }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Placed vs eligible                                               */
/* ------------------------------------------------------------------ */

function CountTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <TooltipShell
      title={`Academic year ${label}`}
      rows={payload.map((e) => ({ key: String(e.dataKey), color: e.color, label: String(e.name), value: formatNumber(Number(e.value)) }))}
    />
  );
}

export function PlacedVsEligibleCard({ years, selectedYear }: { years: PlacementYear[]; selectedYear: string }) {
  const data = years.map((y) => ({ year: y.academicYear, eligible: y.eligibleStudents, placed: y.studentsPlaced, higher: y.higherStudies }));
  const sel = years.find((y) => y.academicYear === selectedYear) ?? years[years.length - 1];

  return (
    <ChartFrame
      id="chart-counts"
      title="Placed vs eligible students"
      subtitle="Number of eligible final-year students and number placed, by academic year."
      facts={[
        { label: 'Selected year', value: sel.academicYear },
        { label: 'Eligible', value: formatNumber(sel.eligibleStudents) },
        { label: 'Placed', value: `${formatNumber(sel.studentsPlaced)} (${placementRate(sel)}%)` },
      ]}
      table={
        <ResponsiveTable
          caption="Eligible and placed students by academic year (demo data)"
          rows={data}
          rowKey={(r) => r.year}
          columns={[
            { key: 'year', header: 'Academic year', cell: (r) => r.year },
            { key: 'eligible', header: 'Eligible', numeric: true, cell: (r) => formatNumber(r.eligible) },
            { key: 'placed', header: 'Placed', numeric: true, cell: (r) => formatNumber(r.placed) },
            { key: 'higher', header: 'Higher studies*', numeric: true, cell: (r) => formatNumber(r.higher) },
          ]}
          footer={<span className="text-xs font-normal">* Reported separately; not included in the eligible count.</span>}
        />
      }
    >
      <div className="h-[260px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -8 }} barGap={2} barCategoryGap="28%">
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="year" tick={axisTick} tickLine={false} axisLine={{ stroke: C.grid }} interval="preserveStartEnd" />
            <YAxis tick={axisTick} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => formatNumber(v)} />
            <Tooltip content={CountTooltip} cursor={{ fill: C.grid, fillOpacity: 0.4 }} />
            <Legend verticalAlign="top" align="left" iconType="square" iconSize={10} wrapperStyle={{ paddingBottom: 12 }} formatter={(value: string) => <span className="text-xs font-medium text-ink-soft">{value}</span>} />
            <Bar dataKey="eligible" name="Eligible students" fill={C.gold} maxBarSize={24} radius={[4, 4, 0, 0]} />
            <Bar dataKey="placed" name="Students placed" fill={C.royal} maxBarSize={24} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Department-wise outcomes                                         */
/* ------------------------------------------------------------------ */

interface DeptRow {
  slug: string;
  name: string;
  eligible: number;
  placed: number;
  rate: number;
}

function DeptTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload as DeptRow;
  return (
    <TooltipShell
      title={r.name}
      rows={[
        { key: 'rate', color: C.royal, label: 'Placement rate', value: `${r.rate}%` },
        { key: 'count', label: 'Placed / eligible', value: `${r.placed} / ${r.eligible}` },
      ]}
    />
  );
}

export function DepartmentOutcomesCard({ rows, selectedYear }: { rows: DepartmentPlacement[]; selectedYear: string }) {
  const data: DeptRow[] = rows
    .map((r) => ({
      slug: r.departmentSlug,
      name: getDepartment(r.departmentSlug)?.shortName ?? r.departmentSlug,
      eligible: r.eligible,
      placed: r.placed,
      rate: placementRate({ studentsPlaced: r.placed, eligibleStudents: r.eligible }),
    }))
    .sort((a, b) => b.rate - a.rate);
  const eligible = data.reduce((s, r) => s + r.eligible, 0);
  const placed = data.reduce((s, r) => s + r.placed, 0);

  return (
    <ChartFrame
      id="chart-departments"
      title={`Department-wise outcomes, ${selectedYear}`}
      subtitle="Placement rate for each department in the selected academic year, highest first."
      facts={[
        { label: 'Academic year', value: selectedYear },
        { label: 'Eligible (departments)', value: formatNumber(eligible) },
        { label: 'Placed (departments)', value: formatNumber(placed) },
      ]}
      note={`Department rate = students placed ÷ eligible students in that department × 100. Department totals cover programs with a placement process and may differ from the institution-wide figure. ${placementMethodology}`}
      table={
        <ResponsiveTable
          caption={`Department-wise placement outcomes, ${selectedYear} (demo data)`}
          rows={data}
          rowKey={(r) => r.slug}
          stackOnMobile
          columns={[
            { key: 'name', header: 'Department', cell: (r) => r.name },
            { key: 'eligible', header: 'Eligible', numeric: true, cell: (r) => r.eligible },
            { key: 'placed', header: 'Placed', numeric: true, cell: (r) => r.placed },
            { key: 'rate', header: 'Rate', numeric: true, cell: (r) => `${r.rate}%` },
          ]}
        />
      }
    >
      <div style={{ height: data.length * 40 + 32 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 0 }} barCategoryGap="30%">
            <CartesianGrid stroke={C.grid} horizontal={false} />
            <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v: number) => `${v}%`} tick={axisTick} tickLine={false} axisLine={{ stroke: C.grid }} />
            <YAxis type="category" dataKey="name" tick={axisTick} tickLine={false} axisLine={false} width={124} />
            <Tooltip content={DeptTooltip} cursor={{ fill: C.grid, fillOpacity: 0.4 }} />
            <Bar dataKey="rate" name="Placement rate" fill={C.royal} maxBarSize={20} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="rate" position="right" formatter={(v: unknown) => `${v}%`} fill={C.ink} fontSize={12} fontWeight={600} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
