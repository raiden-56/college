import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock,
  Download,
  FlaskConical,
  GraduationCap,
  Handshake,
  Mail,
  MapPin,
  MessageSquareQuote,
  Microscope,
  Phone,
  Target,
  Telescope,
  Trophy,
  Users,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { EmptyState } from '@/components/ui/States';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { CourseCard } from '@/components/cards/CourseCard';
import { DepartmentCard } from '@/components/cards/DepartmentCard';
import { FacultyCard } from '@/components/cards/FacultyCard';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { InPageNav, type InPageNavItem } from '@/components/about/InPageNav';
import { DetailBlock } from '@/components/departments/DetailBlock';
import NotFoundPage from '@/pages/NotFoundPage';
import { siteConfig } from '@/config/site';
import { departments, disciplineLabels, getDepartment } from '@/data/departments';
import { facultyByDepartment, getFaculty } from '@/data/faculty';
import { programsByDepartment } from '@/data/programs';
import { getIcon } from '@/utils/icons';
import { dateParts, formatLongDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const navItems: InPageNavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'hod-message', label: 'HOD’s message' },
  { id: 'programs', label: 'Programs' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'labs', label: 'Laboratories' },
  { id: 'research', label: 'Research' },
  { id: 'collaborations', label: 'Collaborations' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'events', label: 'Events' },
  { id: 'resources', label: 'Syllabus & downloads' },
  { id: 'contact', label: 'Contact' },
];

const eventTone = { Workshop: 'royal', Seminar: 'sky', Conference: 'gold', 'Guest Lecture': 'green' } as const;

const truncate = (text: string, max = 155) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

export default function DepartmentDetailPage() {
  const { slug = '' } = useParams();
  const dept = getDepartment(slug);
  if (!dept) return <NotFoundPage />;

  const Icon = getIcon(dept.icon);
  const hod = getFaculty(dept.hod.facultySlug);
  const deptPrograms = programsByDepartment(dept.slug);
  const deptFaculty = facultyByDepartment(dept.slug);
  const publications = deptFaculty
    .flatMap((f) => f.publications.map((p) => ({ ...p, author: f.name, authorSlug: f.slug })))
    .sort((a, b) => b.year - a.year);
  const today = new Date().toISOString().slice(0, 10);
  const events = [...dept.events].sort((a, b) => a.date.localeCompare(b.date));
  const related = [...departments.filter((d) => d.slug !== dept.slug)]
    .sort((a, b) => Number(b.discipline === dept.discipline) - Number(a.discipline === dept.discipline))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: dept.name,
    description: dept.tagline,
    url: `${siteConfig.url}/departments/${dept.slug}`,
    email: dept.contact.email,
    telephone: dept.contact.phone,
    foundingDate: String(dept.established),
    parentOrganization: { '@type': 'CollegeOrUniversity', name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <>
      <Seo title={dept.name} description={truncate(`${dept.tagline}. ${dept.overview}`)} image={dept.image.src} jsonLd={jsonLd} />
      <PageHero
        eyebrow={disciplineLabels[dept.discipline]}
        title={dept.name}
        crumbLabel={dept.shortName}
        description={dept.tagline}
        image={dept.image}
        actions={
          <>
            <ButtonLink to="#programs" variant="gold" icon={<GraduationCap className="h-4 w-4" aria-hidden />}>
              Programs offered
            </ButtonLink>
            <ButtonLink to="#contact" variant="outline-light" icon={<Mail className="h-4 w-4" aria-hidden />}>
              Contact department
            </ButtonLink>
          </>
        }
        aside={
          <div className="glass w-full rounded-2xl p-5 sm:w-72">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-400 text-navy-950">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <p className="font-display font-bold text-white">{dept.shortName}</p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Established', value: dept.established },
                { label: 'Programs', value: deptPrograms.length },
                { label: 'Faculty listed', value: deptFaculty.length },
                { label: 'Laboratories', value: dept.labs.length },
              ].map((f) => (
                <div key={f.label} className="rounded-xl bg-white/5 p-3">
                  <dt className="text-xs text-navy-200">{f.label}</dt>
                  <dd className="font-display text-xl font-extrabold text-white">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <Section containerClassName="lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[15rem_minmax(0,1fr)]" ariaLabel={`${dept.shortName} department details`}>
        <InPageNav items={navItems} label="Department sections" variant="sidebar" />

        <div className="mt-10 min-w-0 space-y-16 sm:space-y-20 lg:mt-0">
          {/* Overview + vision & mission */}
          <DetailBlock id="overview" title="Overview" icon={BookOpenText}>
            <Reveal className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <p className="text-[1.0625rem] leading-relaxed text-ink-soft">{dept.overview}</p>
              <div className="overflow-hidden rounded-2xl shadow-card">
                <SmartImage image={dept.image} className="aspect-[16/10] w-full object-cover xl:aspect-square" />
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Reveal className="on-dark relative overflow-hidden rounded-2xl bg-navy-radial p-6 text-white sm:p-8">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-royal-500/30 blur-2xl" aria-hidden />
                <h3 className="relative flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-gold-300">
                  <Telescope className="h-4 w-4" aria-hidden /> Vision
                </h3>
                <p className="relative mt-3 font-display text-xl font-bold leading-snug text-white">{dept.vision}</p>
              </Reveal>
              <Reveal delay={0.08} className="card p-6 sm:p-8">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-royal-700">
                  <Target className="h-4 w-4" aria-hidden /> Mission
                </h3>
                <ul className="mt-3 space-y-3">
                  {dept.mission.map((m, i) => (
                    <li key={m} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-royal-50 text-xs font-bold text-royal-800" aria-hidden>
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </DetailBlock>

          {/* HOD message */}
          <DetailBlock id="hod-message" title="Message from the Head of Department" icon={MessageSquareQuote}>
            <Reveal className="card relative overflow-hidden p-6 sm:p-8">
              <span className="absolute -right-4 -top-8 font-display text-[9rem] leading-none text-royal-50" aria-hidden>
                “
              </span>
              <div className="relative grid gap-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
                {hod && (
                  <SmartImage
                    image={{ src: hod.photo.src, alt: `Photograph of ${hod.name}` }}
                    className="h-28 w-28 rounded-2xl object-cover object-top shadow-card sm:h-32 sm:w-32"
                  />
                )}
                <div className={cn(!hod && 'sm:col-span-2')}>
                  <blockquote className="font-display text-lg font-semibold leading-relaxed text-navy-900">{dept.hod.message}</blockquote>
                  {hod ? (
                    <p className="mt-4 text-sm">
                      <Link to={`/faculty/${hod.slug}`} className="link">
                        {hod.name}
                      </Link>
                      <span className="block text-ink-muted">
                        {hod.designation}, {dept.shortName}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-ink-muted">Head of Department</p>
                  )}
                </div>
              </div>
            </Reveal>
          </DetailBlock>

          {/* Programs */}
          <DetailBlock
            id="programs"
            title="Programs offered"
            icon={GraduationCap}
            description="Eligibility, syllabus, fees and career outcomes are on each program page."
            action={
              <Link to="/programs" className="link inline-flex items-center gap-1 text-sm">
                All programs <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          >
            {deptPrograms.length > 0 ? (
              <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {deptPrograms.map((p) => (
                  <StaggerItem as="li" key={p.slug}>
                    <CourseCard program={p} />
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <EmptyState title="No programs listed yet" description="Programs for this department will be published soon. Contact the department office for details." />
            )}
          </DetailBlock>

          {/* Faculty */}
          <DetailBlock
            id="faculty"
            title="Faculty"
            icon={Users}
            description="Teachers and researchers in the department."
            action={
              <Link to={`/faculty?dept=${dept.slug}`} className="link inline-flex items-center gap-1 text-sm">
                Open in faculty directory <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          >
            {deptFaculty.length > 0 ? (
              <>
                <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {deptFaculty.map((f) => (
                    <StaggerItem as="li" key={f.slug}>
                      <FacultyCard faculty={f} compact />
                    </StaggerItem>
                  ))}
                </Stagger>
                <DemoNotice className="mt-6" title="Fictional profiles">
                  Faculty names, photographs and credentials are placeholders until approved staff records are published.
                </DemoNotice>
              </>
            ) : (
              <EmptyState title="Faculty profiles coming soon" description="Profiles will appear here once approved by the department." />
            )}
          </DetailBlock>

          {/* Labs */}
          <DetailBlock id="labs" title="Laboratories & equipment" icon={FlaskConical} description="Hands-on facilities available to students of the department.">
            <Stagger as="ul" className="grid gap-5 md:grid-cols-2">
              {dept.labs.map((lab) => (
                <StaggerItem as="li" key={lab.name} className="card card-hover group p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-300 transition-colors group-hover:bg-royal-700 group-hover:text-white">
                      <Microscope className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="text-lg font-bold leading-snug">{lab.name}</h3>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Equipment in ${lab.name}`}>
                    {lab.equipment.map((e) => (
                      <li key={e} className="chip border-navy-100 bg-surface-alt text-navy-800">
                        {e}
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </Stagger>
          </DetailBlock>

          {/* Research & publications */}
          <DetailBlock
            id="research"
            title="Research & publications"
            icon={Telescope}
            action={
              <Link to="/research" className="link inline-flex items-center gap-1 text-sm">
                Research at the college <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal className="card p-6">
                <h3 className="text-lg font-bold">Research areas</h3>
                <ul className="mt-4 space-y-3">
                  {dept.research.map((r) => (
                    <li key={r} className="flex gap-3 text-sm text-ink-soft">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold-400" aria-hidden />
                      {r}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.08} className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">Recent faculty publications</h3>
                  <DemoBadge label="Sample entries" />
                </div>
                {publications.length > 0 ? (
                  <ol className="mt-4 divide-y divide-navy-100">
                    {publications.map((p) => (
                      <li key={`${p.authorSlug}-${p.title}`} className="py-3 first:pt-0 last:pb-0">
                        <p className="text-sm font-semibold leading-snug text-navy-950">{p.title}</p>
                        <p className="mt-1 text-xs text-ink-muted">
                          <Link to={`/faculty/${p.authorSlug}`} className="font-semibold text-royal-700 hover:underline">
                            {p.author}
                          </Link>{' '}
                          · {p.venue} · {p.year}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-sm text-ink-muted">Publication lists will be added from faculty profiles.</p>
                )}
              </Reveal>
            </div>
          </DetailBlock>

          {/* Collaborations */}
          <DetailBlock id="collaborations" title="Projects & industry collaborations" icon={Handshake}>
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
              {dept.collaborations.map((c) => (
                <StaggerItem as="li" key={c} className="flex gap-3 rounded-2xl border border-navy-100 bg-surface-alt p-5 text-sm leading-relaxed text-ink-soft">
                  <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
                  {c}
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-4 text-xs text-ink-muted">Partner organisations are named only after formal agreements are in place.</p>
          </DetailBlock>

          {/* Achievements */}
          <DetailBlock id="achievements" title="Achievements" icon={Trophy}>
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dept.achievements.map((a) => {
                const pending = /to be verified/i.test(a);
                return (
                  <StaggerItem as="li" key={a} className="card card-hover relative overflow-hidden p-5">
                    <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gold-400 to-royal-500" aria-hidden />
                    <Trophy className="h-5 w-5 text-gold-600" aria-hidden />
                    <p className="mt-3 text-sm font-semibold leading-snug text-navy-950">{a.replace(/\s*\(details to be verified\)/i, '')}</p>
                    {pending && (
                      <Badge tone="gold" className="mt-3">
                        Pending verification
                      </Badge>
                    )}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </DetailBlock>

          {/* Events */}
          <DetailBlock
            id="events"
            title="Workshops, seminars & events"
            icon={CalendarDays}
            action={
              <Link to="/events" className="link inline-flex items-center gap-1 text-sm">
                Events calendar <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            }
          >
            {events.length > 0 ? (
              <Stagger as="ul" className="space-y-3">
                {events.map((e) => {
                  const d = dateParts(e.date);
                  const upcoming = e.date >= today;
                  return (
                    <StaggerItem as="li" key={`${e.date}-${e.title}`} className="card card-hover flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
                      <time dateTime={e.date} className="grid w-16 shrink-0 place-items-center rounded-xl bg-navy-900 py-2 text-white">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gold-300">{d.month}</span>
                        <span className="font-display text-2xl font-extrabold leading-none">{d.day}</span>
                        <span className="text-[0.6875rem] text-navy-200">{d.year}</span>
                      </time>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={eventTone[e.type]}>{e.type}</Badge>
                          <Badge tone={upcoming ? 'green' : 'slate'}>{upcoming ? 'Upcoming' : 'Held'}</Badge>
                        </div>
                        <h3 className="mt-2 font-bold leading-snug">{e.title}</h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                          <Clock className="h-3.5 w-3.5" aria-hidden />
                          {formatLongDate(e.date)}
                        </p>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            ) : (
              <EmptyState title="No events scheduled" description="Check the college events calendar for upcoming activities." />
            )}
          </DetailBlock>

          {/* Resources */}
          <DetailBlock
            id="resources"
            title="Syllabus & downloadable resources"
            icon={Download}
            description="Semester-wise subjects for each program are also listed on the program pages."
          >
            <ul className="grid gap-3 md:grid-cols-2">
              {dept.resources.map((r) => (
                <li key={r.id}>
                  <DownloadLink title={r.title} url={r.url} sizeKb={r.sizeKb} fileType={r.fileType} showPreview />
                </li>
              ))}
            </ul>
            {deptPrograms.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-navy-900">Program syllabi:</span>
                {deptPrograms.map((p) => (
                  <Link key={p.slug} to={`/programs/${p.slug}`} className="chip border-royal-200 bg-royal-50 text-royal-800 transition hover:bg-royal-100">
                    {p.shortName}
                  </Link>
                ))}
              </div>
            )}
          </DetailBlock>

          {/* Contact */}
          <DetailBlock id="contact" title="Contact the department" icon={Mail}>
            <Reveal className="on-dark relative grid gap-6 overflow-hidden rounded-3xl bg-navy-radial p-6 text-white sm:p-8 md:grid-cols-2">
              <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-royal-500/30 blur-3xl" aria-hidden />
              <div className="relative">
                <h3 className="text-xl font-bold text-white">{dept.name}</h3>
                {hod && <p className="mt-1 text-sm text-navy-100">Head of Department: {hod.name}</p>}
                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                    <a href={`mailto:${dept.contact.email}`} className="break-all font-semibold text-white hover:underline">
                      {dept.contact.email}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                    <a href={`tel:${dept.contact.phone.replace(/\s/g, '')}`} className="font-semibold text-white hover:underline">
                      {dept.contact.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                    <span className="text-navy-100">
                      {dept.contact.location}, {siteConfig.shortName} campus
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative rounded-2xl bg-white/5 p-5">
                <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-gold-300">Office hours</h4>
                <dl className="mt-3 space-y-2 text-sm">
                  {siteConfig.officeHours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt className="text-navy-100">{h.days}</dt>
                      <dd className="text-right font-semibold text-white">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink to="/admissions/apply" variant="gold" size="sm">
                    Admission enquiry
                  </ButtonLink>
                  <ButtonLink to="/contact#visit" variant="outline-light" size="sm">
                    Visit campus
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </DetailBlock>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="alt" labelledBy="related-departments-heading">
          <SectionHeading
            id="related-departments-heading"
            eyebrow="Keep exploring"
            title="Related departments"
            action={
              <ButtonLink to="/departments" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                All departments
              </ButtonLink>
            }
          />
          <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((d) => (
              <StaggerItem as="li" key={d.slug}>
                <DepartmentCard department={d} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      <EnquiryCTA />
    </>
  );
}
