import { ArrowRight, Award, BookOpenText, Building2, CalendarDays, FileBadge2, Globe2, GraduationCap, Handshake, Lightbulb, Mail, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { CountUp } from '@/components/motion/CountUp';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ProjectsExplorer } from '@/components/research/ProjectsExplorer';
import { PublicationsExplorer } from '@/components/research/PublicationsExplorer';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { ResponsiveTable, type Column } from '@/components/ui/ResponsiveTable';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { StatBlock } from '@/components/ui/StatBlock';
import { EventCard } from '@/components/cards/EventCard';
import { siteConfig } from '@/config/site';
import { getDepartment } from '@/data/departments';
import { upcomingEvents } from '@/data/events';
import { getFaculty } from '@/data/faculty';
import { images } from '@/data/images';
import {
  collaborations,
  incubation,
  mous,
  patents,
  researchCentres,
  researchFacilities,
  researchResources,
  researchStats,
  studentProjects,
  type Collaboration,
  type Mou,
  type Patent,
} from '@/data/research';
import { formatDate } from '@/utils/format';
import { getIcon } from '@/utils/icons';

const sections = [
  { id: 'centres', label: 'Research centres' },
  { id: 'publications', label: 'Publications' },
  { id: 'projects', label: 'Projects & grants' },
  { id: 'patents', label: 'Patents' },
  { id: 'student-research', label: 'Student research' },
  { id: 'collaborations', label: 'Collaborations' },
  { id: 'mous', label: 'MoUs' },
  { id: 'incubation', label: 'Incubation' },
  { id: 'conferences', label: 'Conferences' },
  { id: 'resources', label: 'Policies & resources' },
];

const patentTone: Record<Patent['status'], BadgeTone> = { Filed: 'sky', Published: 'royal', Granted: 'green' };
const collabIcon: Record<Collaboration['kind'], typeof Building2> = { Industry: Building2, Academic: GraduationCap, 'Government & NGO': Globe2 };

const FacultyLink = ({ slug }: { slug: string }) => {
  const f = getFaculty(slug);
  if (!f) return null;
  return (
    <Link to={`/faculty/${slug}`} className="link">
      {f.name}
    </Link>
  );
};

export default function ResearchPage() {
  const now = new Date();
  const mouColumns: Column<Mou>[] = [
    { key: 'partner', header: 'Partner', cell: (m) => m.partner },
    { key: 'type', header: 'Type', cell: (m) => m.partnerType },
    { key: 'purpose', header: 'Purpose', cell: (m) => <span className="block max-w-xs text-left">{m.purpose}</span> },
    { key: 'signed', header: 'Signed on', cell: (m) => <time dateTime={m.signedOn}>{formatDate(m.signedOn)}</time> },
    { key: 'valid', header: 'Valid until', cell: (m) => <time dateTime={m.validUntil}>{formatDate(m.validUntil)}</time> },
    {
      key: 'status',
      header: 'Status',
      cell: (m) => (new Date(`${m.validUntil}T23:59:59`) >= now ? <Badge tone="green">Active</Badge> : <Badge tone="slate">Expired — renewal due</Badge>),
    },
  ];

  const academicEvents = upcomingEvents(now)
    .filter((e) => ['Conference', 'Seminar', 'Workshop'].includes(e.category))
    .slice(0, 4);

  return (
    <>
      <Seo
        title="Research & Innovation"
        description="Research centres, faculty publications, funded projects, patents, student research, collaborations, MoUs and incubation at Bapuji College Karwar."
      />
      <PageHero
        eyebrow="Research & innovation"
        title="Research that starts with curiosity and ends in impact"
        description="Our faculty and students investigate questions that matter — from language technology and low-power chips to green chemistry, law and public policy."
        image={images.microscope}
        actions={
          <>
            <ButtonLink to="#publications" variant="gold" icon={<BookOpenText className="h-4 w-4" aria-hidden />}>
              Browse publications
            </ButtonLink>
            <ButtonLink to="#projects" variant="outline-light">
              Funded projects
            </ButtonLink>
          </>
        }
        aside={
          <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-6 sm:p-8 lg:w-96">
            {researchStats.map((s) => (
              <StatBlock key={s.label} stat={s} light />
            ))}
          </div>
        }
      />

      <nav aria-label="On this page" className="border-b border-navy-100 bg-white">
        <ul className="container scrollbar-none flex gap-2 overflow-x-auto py-3">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} className="inline-flex rounded-full border border-navy-100 px-3.5 py-1.5 text-sm font-semibold text-navy-800 transition hover:border-royal-300 hover:bg-royal-50 hover:text-royal-800">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Research centres */}
      <Section id="centres" labelledBy="centres-heading">
        <SectionHeading
          id="centres-heading"
          eyebrow="Where research happens"
          title="Research centres & labs"
          description="Six interdisciplinary centres bring faculty, doctoral scholars and undergraduates together around shared problems."
        />
        <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {researchCentres.map((c) => {
            const Icon = getIcon(c.icon);
            const dept = getDepartment(c.departmentSlug);
            return (
              <StaggerItem as="li" key={c.id} className="card card-hover group flex flex-col overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <SmartImage image={c.image} decorative className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-xl bg-white text-royal-700 shadow-card">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold leading-snug">{c.name}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Focus areas">
                    {c.focus.map((f) => (
                      <li key={f} className="chip border-navy-100 bg-navy-50 text-navy-800">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-auto space-y-1 pt-5 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-navy-900">Lead:</dt>
                      <dd>
                        <FacultyLink slug={c.leadSlug} />
                      </dd>
                    </div>
                    {dept && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-navy-900">Department:</dt>
                        <dd>
                          <Link to={`/departments/${dept.slug}`} className="link">
                            {dept.shortName}
                          </Link>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* Publications */}
      <Section id="publications" tone="alt" labelledBy="publications-heading">
        <SectionHeading
          id="publications-heading"
          eyebrow="Scholarship"
          title="Faculty publications"
          description="Search journal articles, conference papers and book chapters by our faculty. Filter by year, department or type."
        />
        <Reveal>
          <PublicationsExplorer />
        </Reveal>
      </Section>

      {/* Projects */}
      <Section id="projects" labelledBy="projects-heading">
        <SectionHeading
          id="projects-heading"
          eyebrow="Funded research"
          title="Research projects & grants"
          description="Sponsored projects led by our faculty as principal investigators. Funding agencies and amounts will be published once verified."
        />
        <DemoNotice className="mb-6" title="Demo project data">
          Project titles, amounts and funding agencies are placeholders. Replace them with sanction letters verified by the R&amp;D Cell.
        </DemoNotice>
        <ProjectsExplorer />
      </Section>

      {/* Patents */}
      <Section id="patents" tone="sunken" labelledBy="patents-heading">
        <SectionHeading
          id="patents-heading"
          eyebrow="Intellectual property"
          title="Patents & innovation"
          description="Inventions from our labs, supported by the IPR cell from disclosure to filing."
          action={<DemoBadge label="Details to be verified" />}
        />
        <Stagger as="ul" className="grid gap-5 md:grid-cols-2">
          {patents.map((p) => (
            <StaggerItem as="li" key={p.id} className="card card-hover flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold-700">
                <FileBadge2 className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={patentTone[p.status]}>{p.status}</Badge>
                  <span className="text-xs font-semibold text-ink-muted">{p.year}</span>
                  <span className="text-xs text-ink-muted">· {getDepartment(p.departmentSlug)?.shortName}</span>
                </div>
                <h3 className="mt-2 text-base font-bold leading-snug">{p.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{p.summary}</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold text-navy-900">Inventors: </span>
                  {p.inventorSlugs.map((s, i) => (
                    <span key={s}>
                      {i > 0 && ', '}
                      <FacultyLink slug={s} />
                    </span>
                  ))}
                </p>
                <p className="mt-1 text-xs text-ink-muted">{p.applicationNo}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Student research */}
      <Section id="student-research" labelledBy="student-research-heading">
        <SectionHeading
          id="student-research-heading"
          eyebrow="Learning by discovery"
          title="Student research projects"
          description="Undergraduate and postgraduate students work on real research questions with faculty mentors — and present them every year at Student Research Day."
          action={
            <ButtonLink to="/events/research-day-2026" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Student Research Day
            </ButtonLink>
          }
        />
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {studentProjects.map((s) => (
            <StaggerItem as="li" key={s.id} className="card card-hover relative flex flex-col overflow-hidden p-6">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-royal-600 via-sky-400 to-gold-400" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-wide text-royal-700">
                {getDepartment(s.departmentSlug)?.shortName} · {s.year}
              </p>
              <h3 className="mt-2 text-base font-bold leading-snug">{s.title}</h3>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                {s.team}
              </p>
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-ink-muted">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                {s.outcome}
              </p>
              <p className="mt-auto pt-4 text-sm">
                <span className="font-semibold text-navy-900">Mentor: </span>
                <FacultyLink slug={s.mentorSlug} />
              </p>
            </StaggerItem>
          ))}
        </Stagger>
        <DemoNotice className="mt-8">Student projects shown are examples. Publish only with the students’ consent and verified outcomes.</DemoNotice>
      </Section>

      {/* Collaborations */}
      <Section id="collaborations" tone="alt" labelledBy="collaborations-heading">
        <SectionHeading
          id="collaborations-heading"
          eyebrow="Partnerships"
          title="Industry & academic collaborations"
          description="Partnerships extend our labs, open internships and bring practitioners into the classroom. Partner names will be published once agreements are confirmed."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {(['Industry', 'Academic', 'Government & NGO'] as const).map((kind, i) => {
            const Icon = collabIcon[kind];
            const items = collaborations.filter((c) => c.kind === kind);
            return (
              <Reveal key={kind} delay={i * 0.08} className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-900 text-gold-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-bold">{kind}</h3>
                </div>
                <ul className="mt-5 divide-y divide-navy-100">
                  {items.map((c) => (
                    <li key={c.id} className="py-4 first:pt-0 last:pb-0">
                      <p className="font-semibold text-navy-950">{c.partner}</p>
                      <p className="text-xs font-semibold uppercase tracking-wide text-royal-700">{c.area}</p>
                      <p className="mt-1 text-sm text-ink-muted">{c.activities.join(' · ')}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* MoUs */}
      <Section id="mous" labelledBy="mous-heading">
        <SectionHeading
          id="mous-heading"
          eyebrow="Formal agreements"
          title="Memoranda of understanding"
          description="Active and recently expired MoUs, with their purpose and validity. Copies are available from the IQAC office on request."
          action={<DemoBadge label="Placeholder partners" />}
        />
        <Reveal>
          <ResponsiveTable caption="Memoranda of understanding (placeholder partners)" columns={mouColumns} rows={mous} rowKey={(m) => m.id} stackOnMobile />
        </Reveal>
      </Section>

      {/* Incubation */}
      <Section id="incubation" tone="navy" labelledBy="incubation-heading" className="overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="incubation-heading" light eyebrow="Incubation & entrepreneurship" title={incubation.name} description={incubation.description} className="mb-8" />
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
              {incubation.offerings.map((o) => {
                const Icon = getIcon(o.icon);
                return (
                  <StaggerItem as="li" key={o.title} className="glass rounded-2xl p-5 transition hover:bg-white/15">
                    <Icon className="h-6 w-6 text-gold-300" aria-hidden />
                    <h3 className="mt-3 text-base font-bold text-white">{o.title}</h3>
                    <p className="mt-1 text-sm text-navy-100">{o.text}</p>
                  </StaggerItem>
                );
              })}
            </Stagger>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/contact" variant="gold" icon={<Lightbulb className="h-4 w-4" aria-hidden />}>
                Pitch an idea
              </ButtonLink>
              <ButtonLink to="/alumni" variant="outline-light">
                Become a mentor
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <ParallaxImage image={incubation.image} strength={14} className="aspect-[4/3] rounded-3xl shadow-lift lg:aspect-[4/5]" />
            <dl className="glass absolute -bottom-6 left-4 right-4 grid grid-cols-3 gap-3 rounded-2xl bg-navy-950/60 p-4 sm:left-8 sm:right-8 sm:p-5">
              {incubation.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs leading-snug text-navy-100">{s.label}</dt>
                  <dd className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                    <CountUp value={s.value} suffix="+" />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="mt-14 text-center text-xs text-navy-200">
          <DemoBadge light className="mr-2" />
          Incubation figures are illustrative and await verification.
        </p>
      </Section>

      {/* Conferences */}
      <Section id="conferences" labelledBy="conferences-heading">
        <SectionHeading
          id="conferences-heading"
          eyebrow="Academic events"
          title="Conferences, seminars & workshops"
          description="Research conversations continue beyond the lab. Upcoming academic events are open to students, faculty and invited guests."
          action={
            <ButtonLink to="/events" variant="secondary" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
              All events
            </ButtonLink>
          }
        />
        {academicEvents.length > 0 ? (
          <Stagger as="ul" className="grid gap-4 md:grid-cols-2">
            {academicEvents.map((e) => (
              <StaggerItem as="li" key={e.slug}>
                <EventCard event={e} variant="row" className="h-full" />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="text-ink-muted">
            No upcoming academic events right now. See the{' '}
            <Link to="/events" className="link">
              events archive
            </Link>
            .
          </p>
        )}
      </Section>

      {/* Policies & resources */}
      <Section id="resources" tone="alt" labelledBy="resources-heading">
        <SectionHeading
          id="resources-heading"
          eyebrow="For researchers"
          title="Research policies & resources"
          description="Policies that govern research conduct, funding and intellectual property, plus the facilities available to faculty and scholars."
        />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <h3 className="text-lg font-bold">Policies & forms</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {researchResources.map((r) => (
                <li key={r.id}>
                  <DownloadLink title={r.title} url={r.url} sizeKb={r.sizeKb} fileType={r.fileType} showPreview className="h-full" />
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold">Facilities</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {researchFacilities.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-royal-600" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card flex gap-4 border-royal-100 bg-royal-50/60 p-6">
              <Handshake className="h-6 w-6 shrink-0 text-royal-700" aria-hidden />
              <div>
                <h3 className="text-base font-bold">Research & Development Cell</h3>
                <p className="mt-1 text-sm text-ink-muted">For collaborations, consultancy or research enquiries, write to the college office and mark your message “R&amp;D Cell”.</p>
                <a href={`mailto:${siteConfig.contacts.main.email}?subject=${encodeURIComponent('R&D Cell enquiry')}`} className="link mt-3 inline-flex items-center gap-1.5 text-sm">
                  <Mail className="h-4 w-4" aria-hidden />
                  {siteConfig.contacts.main.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
