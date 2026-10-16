import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  DoorOpen,
  FileText,
  GraduationCap,
  Lightbulb,
  Mail,
  Phone,
  UserRound,
  Users,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { FacultyCard } from '@/components/cards/FacultyCard';
import { DetailBlock } from '@/components/departments/DetailBlock';
import NotFoundPage from '@/pages/NotFoundPage';
import { siteConfig } from '@/config/site';
import { getDepartment } from '@/data/departments';
import { facultyByDepartment, getFaculty } from '@/data/faculty';
import { images } from '@/data/images';

const truncate = (text: string, max = 155) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

export default function FacultyProfilePage() {
  const { slug = '' } = useParams();
  const person = getFaculty(slug);
  if (!person) return <NotFoundPage />;

  const dept = getDepartment(person.departmentSlug);
  const colleagues = facultyByDepartment(person.departmentSlug).filter((f) => f.slug !== person.slug);
  const qualifications = [...person.qualifications].sort((a, b) => b.year - a.year);
  const publications = [...person.publications].sort((a, b) => b.year - a.year);
  const profileUrl = `${siteConfig.url}/faculty/${person.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.designation,
    description: person.bio,
    image: person.photo.src,
    url: profileUrl,
    knowsAbout: [person.specialization, ...person.researchInterests],
    ...(person.contact?.email ? { email: `mailto:${person.contact.email}` } : {}),
    worksFor: {
      '@type': 'CollegeOrUniversity',
      name: siteConfig.name,
      url: siteConfig.url,
      ...(dept ? { department: { '@type': 'Organization', name: dept.name, url: `${siteConfig.url}/departments/${dept.slug}` } } : {}),
    },
  };

  const facts = [
    { icon: Briefcase, label: 'Experience', value: `${person.experienceYears} years` },
    { icon: BookOpen, label: 'Specialisation', value: person.specialization },
    { icon: GraduationCap, label: 'Highest qualification', value: person.qualification },
    { icon: FileText, label: 'Publications listed', value: String(person.publications.length) },
  ];

  return (
    <>
      <Seo
        title={`${person.name} — ${person.designation}`}
        description={truncate(`${person.name}, ${person.designation}${dept ? `, ${dept.name}` : ''}. ${person.bio}`)}
        image={person.photo.src}
        type="article"
        jsonLd={jsonLd}
      />
      <PageHero
        eyebrow={person.designation}
        title={person.name}
        image={dept?.image ?? images.lecture}
        description={
          <>
            <p>
              {dept ? (
                <Link to={`/departments/${dept.slug}`} className="font-semibold text-white underline decoration-gold-300/60 underline-offset-4 hover:decoration-gold-300">
                  {dept.name}
                </Link>
              ) : (
                'Department to be confirmed'
              )}
            </p>
            <p className="mt-1 text-base text-navy-200">{person.qualification}</p>
          </>
        }
        actions={
          <>
            {person.contact?.email ? (
              <ExternalButtonLink href={`mailto:${person.contact.email}`} variant="gold" icon={<Mail className="h-4 w-4" aria-hidden />}>
                Email {person.name.split(' ').slice(0, 2).join(' ')}
              </ExternalButtonLink>
            ) : (
              <ButtonLink to="#contact" variant="gold" icon={<Mail className="h-4 w-4" aria-hidden />}>
                How to get in touch
              </ButtonLink>
            )}
            <ButtonLink to="/faculty" variant="outline-light" icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
              Faculty directory
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative mx-auto w-48 sm:w-56 lg:w-64">
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-gold-300/40 via-royal-500/30 to-transparent blur-sm" aria-hidden />
            <SmartImage
              image={{ src: person.photo.src, alt: `Photograph of ${person.name}` }}
              priority
              className="relative aspect-[4/5] w-full rounded-3xl object-cover object-top shadow-lift ring-1 ring-white/20"
            />
          </div>
        }
      />

      <Section ariaLabel={`Profile of ${person.name}`}>
        <DemoNotice className="mb-10" title="Fictional profile">
          This profile is a placeholder. The name, photograph, qualifications and publications are illustrative and must be replaced with an
          approved record before launch.
        </DemoNotice>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] xl:gap-16">
          <div className="min-w-0 space-y-14 sm:space-y-16">
            <DetailBlock id="profile" title="Profile" icon={UserRound}>
              <Reveal>
                <p className="text-[1.0625rem] leading-relaxed text-ink-soft">{person.bio}</p>
              </Reveal>
            </DetailBlock>

            <DetailBlock id="qualifications" title="Academic qualifications" icon={GraduationCap}>
              <Reveal>
                <ResponsiveTable
                  caption={`Academic qualifications of ${person.name}`}
                  captionHidden
                  stackOnMobile
                  rows={qualifications}
                  rowKey={(q) => `${q.degree}-${q.year}`}
                  columns={[
                    { key: 'degree', header: 'Degree', cell: (q) => q.degree },
                    { key: 'institution', header: 'Institution', cell: (q) => q.institution },
                    { key: 'year', header: 'Year', cell: (q) => q.year, numeric: true },
                  ]}
                />
              </Reveal>
            </DetailBlock>

            <DetailBlock id="experience" title="Teaching experience" icon={Briefcase}>
              <Reveal className="card grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-8">
                <div className="flex items-baseline gap-2 sm:flex-col sm:items-start sm:gap-0 sm:border-r sm:border-navy-100 sm:pr-8">
                  <span className="font-display text-5xl font-extrabold text-navy-950">{person.experienceYears}</span>
                  <span className="text-sm font-semibold text-ink-muted">years of teaching & research</span>
                </div>
                <div className="text-sm leading-relaxed text-ink-soft">
                  <p>
                    Currently <strong className="font-semibold text-navy-900">{person.designation}</strong>
                    {dept && (
                      <>
                        {' '}
                        in the{' '}
                        <Link to={`/departments/${dept.slug}`} className="link">
                          {dept.name}
                        </Link>
                      </>
                    )}
                    .
                  </p>
                  <p className="mt-2">
                    Teaches {person.subjects.length} {person.subjects.length === 1 ? 'subject' : 'subjects'} and specialises in{' '}
                    {person.specialization.toLowerCase()}.
                  </p>
                </div>
              </Reveal>
            </DetailBlock>

            <DetailBlock id="subjects" title="Subjects taught" icon={BookOpen}>
              <Stagger as="ul" className="grid gap-3 sm:grid-cols-2">
                {person.subjects.map((s) => (
                  <StaggerItem as="li" key={s} className="flex items-center gap-3 rounded-xl border border-navy-100 bg-surface-alt p-4 text-sm font-semibold text-navy-900">
                    <BookOpen className="h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                    {s}
                  </StaggerItem>
                ))}
              </Stagger>
            </DetailBlock>

            <DetailBlock id="research" title="Research interests" icon={Lightbulb}>
              <Reveal>
                <ul className="flex flex-wrap gap-2">
                  {person.researchInterests.map((r) => (
                    <li key={r} className="chip border-royal-200 bg-royal-50 px-4 py-2 text-sm text-royal-800">
                      {r}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </DetailBlock>

            <DetailBlock id="publications" title="Publications" icon={FileText} action={<DemoBadge label="Sample entries" />}>
              {publications.length > 0 ? (
                <ol className="space-y-3">
                  {publications.map((p, i) => (
                    <Reveal as="li" key={p.title} delay={i * 0.04} className="card card-hover flex gap-4 p-5">
                      <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-navy-900 font-display text-sm font-bold text-gold-300">{p.year}</span>
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug text-navy-950">{p.title}</p>
                        <p className="mt-1 text-sm italic text-ink-muted">{p.venue}</p>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-ink-muted">No publications listed yet.</p>
              )}
            </DetailBlock>

            <div className="grid gap-14 md:grid-cols-2 md:gap-8">
              <DetailBlock id="awards" title="Awards & certifications" icon={Award}>
                <ul className="space-y-3">
                  {person.awards.map((a) => (
                    <li key={a} className="flex gap-3 text-sm text-ink-soft">
                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                      {a}
                    </li>
                  ))}
                </ul>
              </DetailBlock>
              <DetailBlock id="memberships" title="Professional memberships" icon={Users}>
                <ul className="space-y-3">
                  {person.memberships.map((m) => (
                    <li key={m} className="flex gap-3 text-sm text-ink-soft">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                      {m}
                    </li>
                  ))}
                </ul>
              </DetailBlock>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Quick facts and contact">
            <Reveal className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">Quick facts</h2>
              <dl className="mt-4 space-y-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-royal-50 text-royal-700">
                      <f.icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{f.label}</dt>
                      <dd className="text-sm font-semibold text-navy-950">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal id="contact" delay={0.06} className="on-dark scroll-mt-12 rounded-2xl bg-navy-radial p-6 text-white shadow-lift">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-gold-300">Official contact</h2>
              {person.contact ? (
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                    <a href={`mailto:${person.contact.email}`} className="break-all font-semibold text-white hover:underline">
                      {person.contact.email}
                    </a>
                  </li>
                  {person.contact.phone && (
                    <li className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                      <a href={`tel:${person.contact.phone.replace(/\s/g, '')}`} className="font-semibold text-white hover:underline">
                        {person.contact.phone}
                      </a>
                    </li>
                  )}
                  {person.contact.cabin && (
                    <li className="flex items-start gap-3">
                      <DoorOpen className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                      <span className="text-navy-100">Cabin {person.contact.cabin}</span>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="mt-4 text-sm text-navy-100">
                  <p>Direct contact details are not published for this faculty member. Please reach them through the department office.</p>
                  {dept && (
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start gap-3">
                        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                        <span>
                          {dept.shortName} office, {dept.contact.location}
                        </span>
                      </li>
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
                    </ul>
                  )}
                </div>
              )}
              {dept && (
                <Link to={`/departments/${dept.slug}#contact`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 hover:text-white hover:underline">
                  Department contact page <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </Reveal>
          </aside>
        </div>
      </Section>

      <Section tone="alt" labelledBy="colleagues-heading">
        <SectionHeading
          id="colleagues-heading"
          eyebrow={dept?.shortName ?? 'Faculty'}
          title={dept ? `More faculty from ${dept.shortName}` : 'More faculty'}
          action={
            <ButtonLink to={dept ? `/faculty?dept=${dept.slug}` : '/faculty'} variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              View all
            </ButtonLink>
          }
        />
        {colleagues.length > 0 ? (
          <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {colleagues.slice(0, 3).map((f) => (
              <StaggerItem as="li" key={f.slug}>
                <FacultyCard faculty={f} compact />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="text-ink-muted">
            No other faculty profiles are listed for this department yet.{' '}
            <Link to="/faculty" className="link">
              Browse the full directory
            </Link>
            .
          </p>
        )}
      </Section>
    </>
  );
}
