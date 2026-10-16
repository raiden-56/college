import { Bus, CalendarCheck, Car, Clock, ExternalLink, GraduationCap, Mail, MapPin, MessageSquareWarning, Phone, Plane, TrainFront } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ContactForm } from '@/components/contact/ContactForm';
import { campusMapUrl } from '@/components/events/eventUtils';
import { CampusVisitForm } from '@/components/forms/CampusVisitForm';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { ResultsSummary, SearchInput } from '@/components/ui/Filters';
import { ResponsiveTable, type Column } from '@/components/ui/ResponsiveTable';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { EmptyState } from '@/components/ui/States';
import { Tabs } from '@/components/ui/Tabs';
import { fullAddress, siteConfig } from '@/config/site';
import { departments } from '@/data/departments';
import { images } from '@/data/images';
import type { Department } from '@/types';
import { matchesQuery } from '@/utils/search';
import { organizationLd } from '@/utils/structuredData';

const tel = (phone: string) => `tel:${phone.replace(/[\s-]/g, '')}`;
const c = siteConfig.contacts;

const phoneLines = [
  { label: 'Reception / general', phone: c.main.phone },
  { label: 'Admissions', phone: c.admissions.phone },
  { label: 'Examinations', phone: c.examinations.phone },
  { label: 'Placements', phone: c.placements.phone },
  { label: 'Accounts & fees', phone: c.accounts.phone },
];

const emailLines = [
  { label: 'General enquiries', email: c.main.email },
  { label: 'Admissions', email: c.admissions.email },
  { label: 'Examinations', email: c.examinations.email },
  { label: 'Placements', email: c.placements.email },
  { label: 'Accounts', email: c.accounts.email },
  { label: 'Alumni relations', email: c.alumni.email },
  { label: 'Grievance cell', email: c.grievance.email },
];

const directions: { id: string; label: string; icon: ReactNode; points: string[] }[] = [
  {
    id: 'train',
    label: 'By train',
    icon: <TrainFront className="h-4 w-4" aria-hidden />,
    points: [
      'Karwar railway station on the Konkan Railway is the nearest station.',
      'Autos and taxis run from the station to the campus at Sadashivgad, across the Kali river bridge.',
      'Allow extra time for the last leg during peak hours.',
    ],
  },
  {
    id: 'bus',
    label: 'By bus',
    icon: <Bus className="h-4 w-4" aria-hidden />,
    points: [
      'KSRTC and city buses towards Sadashivgad stop on NH 66 near the campus.',
      'College buses run on fixed routes for enrolled students — see the transport office for routes and passes.',
      'The bus stop is a short walk from Gate 1.',
    ],
  },
  {
    id: 'car',
    label: 'By car',
    icon: <Car className="h-4 w-4" aria-hidden />,
    points: [
      'Follow NH 66 (Karwar–Goa road) to Sadashivgad, just north of the Kali river bridge.',
      'The campus entrance is on NH 66; visitor parking is inside the campus.',
      'Carry photo ID — visitors register at the security desk.',
    ],
  },
  {
    id: 'airport',
    label: 'From the airport',
    icon: <Plane className="h-4 w-4" aria-hidden />,
    points: [
      'The nearest airports are in Goa (Dabolim and Mopa); allow about 2–3 hours by road along NH 66.',
      'Airport shuttle buses and app cabs are available outside arrivals.',
      'Tell us your arrival time when booking a campus visit and we can share the best route.',
    ],
  },
];

const directoryColumns: Column<Department>[] = [
  {
    key: 'name',
    header: 'Department',
    cell: (d) => (
      <Link to={`/departments/${d.slug}`} className="link text-left">
        {d.shortName}
      </Link>
    ),
  },
  { key: 'location', header: 'Location', cell: (d) => d.contact.location },
  {
    key: 'phone',
    header: 'Phone',
    cell: (d) => (
      <a href={tel(d.contact.phone)} className="link whitespace-nowrap font-medium">
        {d.contact.phone}
      </a>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    cell: (d) => (
      <a href={`mailto:${d.contact.email}`} className="link break-all font-medium">
        {d.contact.email}
      </a>
    ),
  },
];

function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="card card-hover flex h-full flex-col p-6">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-gold-300">{icon}</span>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <div className="mt-3 flex-1 text-sm text-ink-soft">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const [route, setRoute] = useState('train');
  const [dirQuery, setDirQuery] = useState('');
  const directory = useMemo(
    () => departments.filter((d) => matchesQuery(dirQuery, d.name, d.shortName, d.contact.location, d.contact.email, d.tagline)),
    [dirQuery],
  );

  return (
    <>
      <Seo
        title="Contact Us"
        description={`Address, phone numbers, emails, office hours, map and directions for ${siteConfig.shortName}. Send a message, find a department contact or book a campus visit.`}
        jsonLd={organizationLd()}
      />
      <PageHero
        eyebrow="Contact"
        title="We’re here to help"
        description="Call, email, write to us or visit the campus. Choose the right office below and we’ll get back to you quickly."
        image={images.heroCampus}
        actions={
          <>
            <ExternalButtonLink href={tel(c.main.phone)} variant="gold" icon={<Phone className="h-4 w-4" aria-hidden />}>
              {c.main.phone}
            </ExternalButtonLink>
            <ButtonLink to="#visit" variant="outline-light" icon={<CalendarCheck className="h-4 w-4" aria-hidden />}>
              Book a campus visit
            </ButtonLink>
          </>
        }
        aside={
          <div className="glass rounded-3xl p-6 lg:w-80">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-300">
              <Clock className="h-4 w-4" aria-hidden />
              Office hours
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              {siteConfig.officeHours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <dt className="text-navy-100">{h.days}</dt>
                  <dd className="font-semibold text-white">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      {/* Contact details */}
      <Section labelledBy="reach-heading">
        <SectionHeading id="reach-heading" eyebrow="Reach us" title="Contact details" description="For the fastest answer, contact the office that handles your question directly." />
        <Stagger className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StaggerItem>
            <InfoCard icon={<MapPin className="h-6 w-6" aria-hidden />} title="Campus address">
              <address className="not-italic leading-relaxed">
                {siteConfig.name}
                <br />
                {siteConfig.address.line1}
                <br />
                {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.postalCode}
                <br />
                {siteConfig.address.country}
              </address>
              <a href={campusMapUrl} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Open in maps<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </InfoCard>
          </StaggerItem>
          <StaggerItem>
            <InfoCard icon={<Phone className="h-6 w-6" aria-hidden />} title="Phone">
              <ul className="space-y-2">
                {phoneLines.map((p) => (
                  <li key={p.label} className="flex flex-col">
                    <span className="text-xs text-ink-muted">{p.label}</span>
                    <a href={tel(p.phone)} className="link font-medium">
                      {p.phone}
                    </a>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </StaggerItem>
          <StaggerItem>
            <InfoCard icon={<Mail className="h-6 w-6" aria-hidden />} title="Official email">
              <ul className="space-y-2">
                {emailLines.map((e) => (
                  <li key={e.label} className="flex flex-col">
                    <span className="text-xs text-ink-muted">{e.label}</span>
                    <a href={`mailto:${e.email}`} className="link break-all font-medium">
                      {e.email}
                    </a>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </StaggerItem>
          <StaggerItem>
            <div className="on-dark relative flex h-full flex-col overflow-hidden rounded-2xl bg-navy-radial p-6 text-white shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400 text-navy-950">
                <GraduationCap className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold text-white">Admissions helpdesk</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy-100">
                <li>
                  <a href={tel(c.admissions.phone)} className="font-semibold text-white hover:underline">
                    {c.admissions.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${c.admissions.email}`} className="break-all font-semibold text-white hover:underline">
                    {c.admissions.email}
                  </a>
                </li>
                <li>{c.admissions.hours}</li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <ButtonLink to="/admissions/apply" variant="gold" size="sm">
                  Admission enquiry
                </ButtonLink>
                <ButtonLink to="/admissions" variant="outline-light" size="sm">
                  Admissions info
                </ButtonLink>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </Section>

      {/* Map & directions */}
      <Section id="directions" tone="alt" labelledBy="directions-heading">
        <SectionHeading
          id="directions-heading"
          eyebrow="Find us"
          title="Map, directions & transport"
          action={
            <ExternalButtonLink href={campusMapUrl} variant="secondary" icon={<MapPin className="h-4 w-4" aria-hidden />}>
              Open in maps
            </ExternalButtonLink>
          }
        />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card">
            <iframe
              src={siteConfig.mapEmbedUrl}
              title={`Map showing the location of ${siteConfig.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full sm:h-[420px]"
            />
            <p className="flex flex-wrap items-center justify-between gap-2 border-t border-navy-100 px-4 py-3 text-sm text-ink-muted">
              <span className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                {fullAddress}
              </span>
              <a href={campusMapUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                Get directions <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold">Getting here</h3>
              <DemoBadge label="Verify routes" />
            </div>
            <Tabs
              label="Directions by mode of transport"
              value={route}
              onChange={setRoute}
              panelClassName="mt-5"
              tabs={directions.map((d) => ({
                id: d.id,
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    {d.icon}
                    {d.label}
                  </span>
                ),
                content: (
                  <ol className="space-y-3">
                    {d.points.map((p, i) => (
                      <li key={p} className="flex gap-3 rounded-2xl border border-navy-100 bg-white p-4 text-sm text-ink-soft">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-royal-50 text-xs font-bold text-royal-800" aria-hidden>
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ol>
                ),
              }))}
            />
          </Reveal>
        </div>
      </Section>

      {/* Contact form */}
      <Section id="message" labelledBy="message-heading">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              id="message-heading"
              eyebrow="Write to us"
              title="Send us a message"
              description="Choose the office or department your message is for and it will be routed to the right inbox."
              className="mb-8"
            />
            <Reveal className="card p-6 sm:p-8">
              <ContactForm />
            </Reveal>
          </div>
          <aside aria-label="Other ways to connect" className="space-y-6 lg:pt-28">
            <Reveal className="card p-6">
              <h3 className="text-lg font-bold">Follow us</h3>
              <p className="mt-1 text-sm text-ink-muted">News, events and student stories on our official channels.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {siteConfig.social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-11 w-11 place-items-center rounded-full border border-navy-100 bg-white text-navy-800 transition hover:-translate-y-0.5 hover:border-royal-300 hover:bg-royal-700 hover:text-white"
                      aria-label={`${siteConfig.shortName} on ${s.label} (opens in a new tab)`}
                    >
                      <SocialIcon name={s.icon} className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08} className="rounded-2xl border border-gold-200 bg-gold-50/60 p-6">
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-gold-700" aria-hidden />
                <h3 className="text-base font-bold">Have a complaint or grievance?</h3>
              </div>
              <p className="mt-1.5 text-sm text-ink-soft">Use the dedicated grievance form so it is tracked by the redressal committee.</p>
              <ButtonLink to="/feedback" variant="secondary" size="sm" className="mt-4">
                Grievance &amp; feedback
              </ButtonLink>
            </Reveal>
            <Reveal delay={0.16} className="card p-6">
              <h3 className="text-base font-bold">Press &amp; media</h3>
              <p className="mt-1.5 text-sm text-ink-muted">
                For media requests, email{' '}
                <a href={`mailto:${c.main.email}?subject=${encodeURIComponent('Media enquiry')}`} className="link">
                  {c.main.email}
                </a>{' '}
                with “Media enquiry” in the subject.
              </p>
            </Reveal>
          </aside>
        </div>
      </Section>

      {/* Department directory */}
      <Section id="directory" tone="sunken" labelledBy="directory-heading">
        <SectionHeading id="directory-heading" eyebrow="Directory" title="Department contact directory" description="Reach a department office directly for academic questions, labs and timetables." />
        <div className="max-w-md">
          <SearchInput label="Search departments" showLabel value={dirQuery} onChange={setDirQuery} placeholder="Department, building or email" />
        </div>
        <div className="mt-4">
          <ResultsSummary start={directory.length ? 1 : 0} end={directory.length} total={directory.length} noun="departments" onReset={() => setDirQuery('')} activeFilters={dirQuery ? 1 : 0} />
        </div>
        {directory.length === 0 ? (
          <EmptyState className="mt-6" title="No departments match your search" description="Try a shorter keyword, such as “law” or “block A”." />
        ) : (
          <ResponsiveTable className="mt-6" caption="Department contact directory" captionHidden columns={directoryColumns} rows={directory} rowKey={(d) => d.slug} stackOnMobile />
        )}
      </Section>

      {/* Campus visit */}
      <Section id="visit" tone="alt" labelledBy="visit-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <Reveal direction="right" className="relative min-h-[18rem] overflow-hidden rounded-3xl shadow-lift">
            <ParallaxImage image={images.campusAerial} strength={14} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/50 to-transparent" aria-hidden />
            <div className="on-dark absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="eyebrow eyebrow-light">
                <span className="h-px w-6 bg-gold-300" aria-hidden />
                See it for yourself
              </p>
              <ul className="mt-4 space-y-2 text-sm text-navy-100">
                <li>• Guided tour of classrooms, labs, library and hostels</li>
                <li>• Meet faculty and the admissions team</li>
                <li>• Monday–Saturday, 10 AM – 4 PM</li>
              </ul>
              <Link to="/campus/virtual-tour" className="mt-4 inline-flex text-sm font-semibold text-gold-300 hover:underline">
                Can’t visit? Take the virtual tour →
              </Link>
            </div>
          </Reveal>
          <div>
            <SectionHeading id="visit-heading" eyebrow="Campus visit" title="Request a campus visit" description="Pick a date and we’ll confirm your slot by email." className="mb-8" />
            <Reveal className="card p-6 sm:p-8">
              <CampusVisitForm />
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
