import { AlertTriangle, CalendarClock, CalendarPlus2, Download, Eye, FileText, FolderOpen, Mail, Phone, Scale, ShieldAlert, ShieldCheck, Users } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { DocumentPreviewModal } from '@/components/disclosures/DocumentPreviewModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { FilterSelect, ResultsSummary, SearchInput } from '@/components/ui/Filters';
import { Section, SectionHeading } from '@/components/ui/Section';
import { EmptyState } from '@/components/ui/States';
import { siteConfig } from '@/config/site';
import { disclosureCategories, disclosureYears, disclosures } from '@/data/disclosures';
import { images } from '@/data/images';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import type { DisclosureCategory, DisclosureDocument } from '@/types';
import { cn } from '@/utils/cn';
import { formatDate, formatFileSize } from '@/utils/format';
import { matchesQuery } from '@/utils/search';

const slugify = (c: string) => `cat-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
const tel = (phone: string) => `tel:${phone.replace(/[\s-]/g, '')}`;

interface Committee {
  name: string;
  icon: ReactNode;
  purpose: string;
  contacts: { label: string; href: string; icon: ReactNode }[];
  docQuery: string;
}

const committees: Committee[] = [
  {
    name: 'Internal Complaints Committee (ICC)',
    icon: <ShieldCheck className="h-6 w-6" aria-hidden />,
    purpose: 'Prevention and redressal of sexual harassment of women at the workplace and on campus; complaints are handled confidentially.',
    contacts: [{ label: 'icc@crestwood.edu.in', href: 'mailto:icc@crestwood.edu.in', icon: <Mail className="h-4 w-4" aria-hidden /> }],
    docQuery: 'Internal Complaints',
  },
  {
    name: 'Anti-Ragging Committee & Squad',
    icon: <ShieldAlert className="h-6 w-6" aria-hidden />,
    purpose: 'Ensures a ragging-free campus through awareness, vigilance and prompt action on complaints.',
    contacts: [
      { label: `National helpline ${siteConfig.contacts.antiRaggingHelpline}`, href: tel(siteConfig.contacts.antiRaggingHelpline), icon: <Phone className="h-4 w-4" aria-hidden /> },
      { label: siteConfig.contacts.grievance.phone, href: tel(siteConfig.contacts.grievance.phone), icon: <Phone className="h-4 w-4" aria-hidden /> },
    ],
    docQuery: 'Anti-Ragging',
  },
  {
    name: 'Student Grievance Redressal Committee',
    icon: <Scale className="h-6 w-6" aria-hidden />,
    purpose: 'Time-bound redressal of academic, administrative and welfare grievances raised by students and parents.',
    contacts: [
      { label: siteConfig.contacts.grievance.email, href: `mailto:${siteConfig.contacts.grievance.email}`, icon: <Mail className="h-4 w-4" aria-hidden /> },
      { label: siteConfig.contacts.grievance.phone, href: tel(siteConfig.contacts.grievance.phone), icon: <Phone className="h-4 w-4" aria-hidden /> },
    ],
    docQuery: 'Grievance',
  },
  {
    name: 'SC/ST Cell & Equal Opportunity Cell',
    icon: <Users className="h-6 w-6" aria-hidden />,
    purpose: 'Safeguards the interests of students and staff from SC/ST, OBC and other under-represented groups, and supports equal access.',
    contacts: [{ label: 'eoc@crestwood.edu.in', href: 'mailto:eoc@crestwood.edu.in', icon: <Mail className="h-4 w-4" aria-hidden /> }],
    docQuery: 'SC/ST',
  },
];

function DocumentRow({ doc, onPreview }: { doc: DisclosureDocument; onPreview: (d: DisclosureDocument) => void }) {
  const revised = doc.updatedOn !== doc.publishedOn;
  return (
    <li className="group flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-4 transition hover:border-royal-200 hover:shadow-card sm:flex-row sm:items-center sm:p-5">
      <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700 sm:grid">
        <FileText className="h-6 w-6" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="font-bold leading-snug text-navy-950">{doc.title}</h4>
        {doc.description && <p className="mt-0.5 text-sm text-ink-muted">{doc.description}</p>}
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Academic year</dt>
            <dd>
              <Badge tone="navy">{doc.academicYear}</Badge>
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="inline-flex items-center gap-1">
              <CalendarPlus2 className="h-3.5 w-3.5" aria-hidden />
              Published
            </dt>
            <dd>
              <time dateTime={doc.publishedOn}>{formatDate(doc.publishedOn)}</time>
            </dd>
          </div>
          <div className={cn('flex items-center gap-1', revised && 'font-semibold text-royal-800')}>
            <dt className="inline-flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
              Last updated
            </dt>
            <dd>
              <time dateTime={doc.updatedOn}>{formatDate(doc.updatedOn)}</time>
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="sr-only">File</dt>
            <dd>
              {doc.fileType ?? 'PDF'}
              {doc.sizeKb ? ` · ${formatFileSize(doc.sizeKb)}` : ''}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" size="sm" onClick={() => onPreview(doc)} icon={<Eye className="h-4 w-4" aria-hidden />} aria-label={`Preview ${doc.title}`}>
          Preview
        </Button>
        <a href={doc.url} download className="btn btn-sm btn-primary" aria-label={`Download ${doc.title} (${doc.fileType ?? 'PDF'})`}>
          <Download className="h-4 w-4" aria-hidden />
          Download
        </a>
      </div>
    </li>
  );
}

export default function DisclosuresPage() {
  const [filters, setFilter, reset, activeCount] = useUrlFilters({ q: '', category: 'all', year: 'all' });
  const [, setParams] = useSearchParams();
  const [preview, setPreview] = useState<DisclosureDocument | null>(null);

  const filtered = useMemo(
    () =>
      disclosures.filter(
        (d) =>
          (filters.category === 'all' || d.category === filters.category) &&
          (filters.year === 'all' || d.academicYear === filters.year) &&
          matchesQuery(filters.q, d.title, d.description, d.category, d.academicYear),
      ),
    [filters],
  );

  const groups = useMemo(
    () =>
      disclosureCategories
        .map((c) => ({ category: c, docs: filtered.filter((d) => d.category === c).sort((a, b) => b.updatedOn.localeCompare(a.updatedOn)) }))
        .filter((g) => g.docs.length > 0),
    [filtered],
  );

  const totalFor = (c: DisclosureCategory) => disclosures.filter((d) => d.category === c).length;
  const latestUpdate = disclosures.reduce((max, d) => (d.updatedOn > max ? d.updatedOn : max), '');

  return (
    <>
      <Seo
        title="Mandatory Disclosures"
        description="Affiliation, approvals, accreditation, IQAC reports, annual reports, policies, committees, fee structure and audited statements — searchable and downloadable."
      />
      <PageHero
        eyebrow="Transparency"
        title="Mandatory disclosures & public documents"
        description="Statutory and quality-assurance documents in one place. Search, filter by category or academic year, preview and download."
        image={images.libraryReading}
        aside={
          <dl className="glass grid grid-cols-2 gap-6 rounded-3xl p-6 lg:w-80">
            <div>
              <dt className="text-xs text-navy-100">Documents</dt>
              <dd className="font-display text-3xl font-extrabold text-white">{disclosures.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-navy-100">Categories</dt>
              <dd className="font-display text-3xl font-extrabold text-white">{disclosureCategories.length}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-navy-100">Last updated</dt>
              <dd className="font-semibold text-white">
                <time dateTime={latestUpdate}>{formatDate(latestUpdate)}</time>
              </dd>
            </div>
          </dl>
        }
      />

      <Section size="sm" tone="white" ariaLabel="Compliance notice" className="pb-0 sm:pb-0">
        <Reveal>
          <div role="note" className="flex flex-col gap-3 rounded-2xl border-2 border-gold-300 bg-gold-50 p-5 text-gold-900 sm:flex-row sm:items-start sm:p-6">
            <AlertTriangle className="h-6 w-6 shrink-0 text-gold-700" aria-hidden />
            <div>
              <p className="font-bold text-navy-950">Important</p>
              <p className="mt-1">Confirm applicable requirements with the institution and its regulators before treating this page as compliant.</p>
              <p className="mt-2 text-sm text-gold-900/85">
                Documents currently link to placeholder files. Upload the official, signed versions and review this list against the latest requirements of the affiliating university and each regulator.
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section id="documents" labelledBy="documents-heading">
        <SectionHeading id="documents-heading" eyebrow="Document library" title="Browse disclosures" action={<DemoBadge label="Placeholder files" />} />

        <div className="card grid gap-4 p-4 sm:p-6 md:grid-cols-[2fr_1fr_1fr] md:items-end">
          <SearchInput label="Search documents" showLabel value={filters.q} onChange={(v) => setFilter('q', v)} placeholder="e.g. AQAR, fee refund, ICC" />
          <FilterSelect label="Category" value={filters.category} onChange={(v) => setFilter('category', v)} allLabel="All categories" options={disclosureCategories.map((c) => ({ value: c, label: c }))} />
          <FilterSelect label="Academic year" value={filters.year} onChange={(v) => setFilter('year', v)} allLabel="All years" options={disclosureYears.map((y) => ({ value: y, label: y }))} />
        </div>

        <div className="mt-6">
          <ResultsSummary id="disclosure-results" start={filtered.length ? 1 : 0} end={filtered.length} total={filtered.length} noun="documents" onReset={reset} activeFilters={activeCount} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)]">
          <nav aria-label="Disclosure categories" className="hidden lg:block">
            <div className="sticky top-32">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Jump to category</p>
              <ul className="mt-3 space-y-1">
                {disclosureCategories.map((c) => {
                  const count = filtered.filter((d) => d.category === c).length;
                  return (
                    <li key={c}>
                      {count > 0 ? (
                        <a href={`#${slugify(c)}`} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy-800 transition hover:bg-royal-50 hover:text-royal-800">
                          {c}
                          <span className="rounded-full bg-navy-50 px-2 text-xs text-ink-muted">{count}</span>
                        </a>
                      ) : (
                        <span className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-ink-muted/60">
                          {c}
                          <span className="text-xs">0</span>
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <div className="min-w-0">
            {groups.length === 0 ? (
              <EmptyState
                title="No documents found"
                description="Try another keyword, category or academic year."
                icon={<FolderOpen className="h-7 w-7" aria-hidden />}
                action={
                  <Button variant="secondary" size="sm" onClick={reset}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <div className="space-y-12">
                {groups.map((g) => (
                  <section key={g.category} id={slugify(g.category)} aria-labelledby={`${slugify(g.category)}-heading`} className="scroll-mt-32">
                    <Reveal>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-navy-100 pb-3">
                        <h3 id={`${slugify(g.category)}-heading`} className="text-xl font-bold">
                          {g.category}
                        </h3>
                        <span className="text-sm text-ink-muted">
                          {g.docs.length} of {totalFor(g.category)} document{totalFor(g.category) === 1 ? '' : 's'}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-3">
                        {g.docs.map((d) => (
                          <DocumentRow key={d.id} doc={d} onPreview={setPreview} />
                        ))}
                      </ul>
                    </Reveal>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section id="committees" tone="alt" labelledBy="committees-heading">
        <SectionHeading
          id="committees-heading"
          eyebrow="Statutory committees"
          title="Mandatory committees"
          description="Students, staff and parents can approach these committees directly. Composition and minutes are published under “Committees” above."
          action={<DemoBadge label="Contacts to be verified" />}
        />
        <Stagger as="ul" className="grid gap-5 md:grid-cols-2">
          {committees.map((c) => (
            <StaggerItem as="li" key={c.name} className="card card-hover flex flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-900 text-gold-300">{c.icon}</span>
                <h3 className="text-lg font-bold leading-snug">{c.name}</h3>
              </div>
              <p className="mt-3 text-sm text-ink-muted">{c.purpose}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {c.contacts.map((ct) => (
                  <li key={ct.label}>
                    <a href={ct.href} className="link inline-flex items-center gap-1.5">
                      {ct.icon}
                      {ct.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => {
                    // One URL update (q only) so category/year filters don't hide the results.
                    setParams({ q: c.docQuery }, { replace: true, preventScrollReset: true });
                    document.getElementById('documents')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="link text-sm"
                >
                  View related documents
                </button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-8 text-sm text-ink-muted">
          To raise a complaint online, use the{' '}
          <Link to="/feedback" className="link">
            grievance &amp; feedback form
          </Link>
          . For anti-ragging help, see the{' '}
          <Link to="/student-corner#anti-ragging" className="link">
            Student Corner
          </Link>
          .
        </p>
      </Section>

      <DocumentPreviewModal doc={preview} onClose={() => setPreview(null)} />
    </>
  );
}
