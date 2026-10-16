import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { departments, getDepartment } from '@/data/departments';
import { getFaculty } from '@/data/faculty';
import { researchProjects, type ResearchProject } from '@/data/research';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { formatINR } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { FilterChips, FilterSelect, ResultsSummary } from '@/components/ui/Filters';
import { ResponsiveTable, type Column } from '@/components/ui/ResponsiveTable';
import { EmptyState } from '@/components/ui/States';

const columns: Column<ResearchProject>[] = [
  { key: 'title', header: 'Project', cell: (p) => <span className="block max-w-sm text-left">{p.title}</span> },
  {
    key: 'pi',
    header: 'Principal investigator',
    cell: (p) => {
      const pi = getFaculty(p.piSlug);
      return pi ? (
        <Link to={`/faculty/${pi.slug}`} className="link">
          {pi.name}
        </Link>
      ) : (
        '—'
      );
    },
  },
  { key: 'dept', header: 'Department', cell: (p) => getDepartment(p.departmentSlug)?.shortName ?? '—' },
  { key: 'agency', header: 'Funding agency', cell: (p) => <span className="text-ink-muted">{p.fundingAgency}</span> },
  { key: 'amount', header: 'Amount', numeric: true, cell: (p) => formatINR(p.amount) },
  { key: 'period', header: 'Period', cell: (p) => `${p.startYear}–${p.endYear}` },
  { key: 'status', header: 'Status', cell: (p) => <Badge tone={p.status === 'Ongoing' ? 'green' : 'slate'}>{p.status}</Badge> },
];

/** Funded research projects with status / department filters (URL keys: gstatus, gdept). */
export function ProjectsExplorer() {
  const [filters, setFilter, reset, activeCount] = useUrlFilters({ gstatus: 'all', gdept: 'all' });

  const byDept = useMemo(() => researchProjects.filter((p) => filters.gdept === 'all' || p.departmentSlug === filters.gdept), [filters.gdept]);
  const filtered = useMemo(() => byDept.filter((p) => filters.gstatus === 'all' || p.status === filters.gstatus), [byDept, filters.gstatus]);
  const totalAmount = filtered.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="field-label text-xs uppercase tracking-wide text-ink-muted" id="project-status-label">
            Status
          </p>
          <FilterChips
            label="Project status"
            value={filters.gstatus}
            onChange={(v) => setFilter('gstatus', v)}
            options={[
              { value: 'all', label: 'All', count: byDept.length },
              { value: 'Ongoing', label: 'Ongoing', count: byDept.filter((p) => p.status === 'Ongoing').length },
              { value: 'Completed', label: 'Completed', count: byDept.filter((p) => p.status === 'Completed').length },
            ]}
          />
        </div>
        <FilterSelect
          className="md:w-72"
          label="Department"
          value={filters.gdept}
          onChange={(v) => setFilter('gdept', v)}
          allLabel="All departments"
          options={departments.map((d) => ({ value: d.slug, label: d.shortName }))}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1">
          <ResultsSummary start={filtered.length ? 1 : 0} end={filtered.length} total={filtered.length} noun="projects" onReset={reset} activeFilters={activeCount} />
        </div>
        <DemoBadge label="Demo amounts" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No projects match these filters"
          description="Try another department or status."
          action={
            <Button variant="secondary" size="sm" onClick={reset}>
              Show all projects
            </Button>
          }
        />
      ) : (
        <ResponsiveTable
          className="mt-6"
          caption="Funded research projects and grants (illustrative)"
          captionHidden
          columns={columns}
          rows={filtered}
          rowKey={(p) => p.id}
          stackOnMobile
          footer={<span>Total sanctioned (shown projects): {formatINR(totalAmount)} — demo figure</span>}
        />
      )}
    </div>
  );
}
