import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Landmark,
  Lightbulb,
  Lock,
  Mail,
  Mic,
  Phone,
  PlugZap,
  Rocket,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { FilterSelect, ResultsSummary } from '@/components/ui/Filters';
import { EmptyState } from '@/components/ui/States';
import { Pagination } from '@/components/ui/Pagination';
import { SmartImage } from '@/components/ui/SmartImage';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel';
import { EventCard } from '@/components/cards/EventCard';
import { AlumniRegistrationForm } from '@/components/alumni/AlumniRegistrationForm';
import { alumni } from '@/data/alumni';
import { departments, getDepartment } from '@/data/departments';
import { events } from '@/data/events';
import { testimonials } from '@/data/testimonials';
import { institutionStats } from '@/data/institution';
import { images } from '@/data/images';
import { siteConfig } from '@/config/site';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { usePagination } from '@/hooks/usePagination';
import { cn } from '@/utils/cn';

/** Privacy rule: only alumni who opted in are ever shown publicly (stories and directory). */
const listed = alumni.filter((a) => a.directoryConsent);
const featured = listed[0];
const otherStories = listed.slice(1, 4);
const batchOptions = Array.from(new Set(listed.map((a) => a.batch)))
  .sort((a, b) => b - a)
  .map((b) => ({ value: String(b), label: String(b) }));
const deptOptions = departments.filter((d) => listed.some((a) => a.departmentSlug === d.slug)).map((d) => ({ value: d.slug, label: d.shortName }));
const industryOptions = Array.from(new Set(listed.map((a) => a.industry)))
  .sort()
  .map((i) => ({ value: i, label: i }));
const alumniTestimonials = testimonials.filter((t) => t.role === 'Alumni' && t.consentRecorded);
const alumniEvents = events.filter((e) => e.category === 'Alumni').sort((a, b) => a.startDate.localeCompare(b.startDate));
const alumniCount = institutionStats.find((s) => /alumni/i.test(s.label));

const achievements = [
  { icon: Rocket, title: 'Founders & entrepreneurs', text: 'Alumni have started companies in mobility, software and services — several now hire our interns.' },
  { icon: Landmark, title: 'Public service', text: 'Graduates serve in civil services, the judiciary, public sector undertakings and policy bodies.' },
  { icon: Lightbulb, title: 'Research & academia', text: 'Alumni lead research groups at national laboratories and teach at universities in India and abroad.' },
  { icon: Award, title: 'Distinguished Alumni Award', text: 'Recognised each year at homecoming, nominated by peers and faculty. (Past awardees to be published after verification.)' },
];

const mentorship = [
  { icon: GraduationCap, title: 'Mentor a student', text: 'Guide a final-year student through career choices, one conversation a month.' },
  { icon: Mic, title: 'Speak on campus', text: 'Share your experience in a guest lecture, panel or department seminar.' },
  { icon: BriefcaseBusiness, title: 'Hire & refer', text: 'Offer internships or roles through the Training & Placement Cell.' },
  { icon: Users, title: 'City chapters', text: 'Meet fellow graduates at chapter meet-ups. (Chapter list to be configured.)' },
];

const givingOptions = [
  { title: 'Merit-cum-need scholarships', text: 'Help a deserving student complete their degree.' },
  { title: 'Lab & library upgrades', text: 'Fund equipment, books and digital resources.' },
  { title: 'Batch legacy projects', text: 'Pool contributions with your batch for a named project.' },
];

export default function AlumniPage() {
  const [rawFilters, setFilter, resetFilters, activeCount] = useUrlFilters({ year: 'all', department: 'all', industry: 'all' });
  // Ignore unknown values in the URL so the selects always reflect what is applied.
  const valid = (v: string, opts: { value: string }[]) => (opts.some((o) => o.value === v) ? v : 'all');
  const filters = {
    year: valid(rawFilters.year, batchOptions),
    department: valid(rawFilters.department, deptOptions),
    industry: valid(rawFilters.industry, industryOptions),
  };

  const filtered = useMemo(
    () =>
      listed.filter(
        (a) =>
          (filters.year === 'all' || String(a.batch) === filters.year) &&
          (filters.department === 'all' || a.departmentSlug === filters.department) &&
          (filters.industry === 'all' || a.industry === filters.industry),
      ),
    [filters.year, filters.department, filters.industry],
  );
  const { page, pageCount, pageItems, start, end, total, setPage } = usePagination(filtered, 6);
  const ac = siteConfig.contacts.alumni;

  return (
    <>
      <Seo
        title="Alumni"
        description="Bapuji College Karwar alumni network: success stories, opt-in alumni directory, reunions, mentorship, the alumni association, giving and registration."
      />
      <PageHero
        eyebrow="Alumni"
        title="Once Bapujian, always Bapujian"
        crumbLabel="Alumni"
        description="Our graduates lead teams, build companies, serve the public and push research forward. Stay connected, mentor the next generation and come home for reunions."
        image={images.graduation}
        actions={
          <>
            <a href="#register" className={buttonClasses({ variant: 'gold' })}>
              <UserPlus className="h-4 w-4" aria-hidden /> Register as alumni
            </a>
            <a href="#directory" className={buttonClasses({ variant: 'outline-light' })}>
              Alumni directory
            </a>
          </>
        }
        aside={
          alumniCount && (
            <div className="glass rounded-3xl p-6 sm:w-72">
              <p className="font-display text-4xl font-extrabold text-white">
                {alumniCount.value.toLocaleString('en-IN')}
                {alumniCount.suffix}
              </p>
              <p className="mt-1 text-sm text-navy-100">{alumniCount.label}</p>
              {alumniCount.isDemo && <DemoBadge light className="mt-3" />}
            </div>
          )
        }
      />

      {/* Success stories */}
      <Section tone="white" id="stories" labelledBy="stories-heading">
        <SectionHeading id="stories-heading" eyebrow="Success stories" title="Where Bapuji College takes you" description="A few of the many paths our graduates have taken." />
        {featured && (
          <Reveal>
            <article className="grid overflow-hidden rounded-3xl bg-navy-950 text-white shadow-lift lg:grid-cols-2" aria-labelledby={`story-${featured.id}`}>
              <ParallaxImage image={{ src: featured.photo.src, alt: `Portrait of ${featured.name}` }} strength={8} className="aspect-[4/3] lg:aspect-auto lg:min-h-[420px]" />
              <div className="on-dark relative flex flex-col justify-center p-7 sm:p-10">
                <Badge tone="white" className="self-start">
                  Featured · {featured.industry}
                </Badge>
                <h3 id={`story-${featured.id}`} className="mt-4 text-3xl font-extrabold text-white">
                  {featured.name}
                </h3>
                <p className="mt-1 font-semibold text-gold-300">
                  {featured.role}, {featured.organization}
                </p>
                <p className="mt-1 text-sm text-navy-200">
                  {featured.program}, Class of {featured.batch}
                </p>
                <p className="mt-5 text-lg leading-relaxed text-navy-100">{featured.story}</p>
                <DemoBadge light label="Fictional profile" className="mt-5 self-start" />
                <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-royal-600/30 blur-3xl" aria-hidden />
              </div>
            </article>
          </Reveal>
        )}
        <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
          {otherStories.map((a) => (
            <StaggerItem key={a.id} as="article" className="card card-hover group flex flex-col p-6">
              <div className="flex items-center gap-4">
                <SmartImage image={{ src: a.photo.src, alt: '' }} decorative className="h-16 w-16 rounded-2xl object-cover ring-2 ring-gold-300/60 transition-transform duration-500 group-hover:scale-105" />
                <div>
                  <h3 className="font-bold">{a.name}</h3>
                  <p className="text-sm text-ink-muted">
                    {a.program} · {a.batch}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-royal-700">
                {a.role}, {a.organization}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{a.story}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <DemoNotice className="mt-8">Alumni names, roles and stories on this page are fictional placeholders. Real profiles will be published only with each graduate’s written consent.</DemoNotice>
      </Section>

      {/* Directory */}
      <Section tone="alt" id="directory" labelledBy="directory-heading">
        <SectionHeading
          id="directory-heading"
          eyebrow="Alumni directory"
          title="Find fellow graduates"
          description="Filter by graduation year, department or industry to reconnect with classmates."
        />
        <Reveal className="mb-6 flex gap-3 rounded-2xl border border-royal-100 bg-white p-4 text-sm text-ink-soft">
          <ShieldCheck className="h-5 w-5 shrink-0 text-royal-700" aria-hidden />
          <p>
            <strong className="text-navy-900">Privacy rule:</strong> the directory lists only alumni who have given explicit consent to appear. Contact details are never shown publicly —
            to reach someone, write to the alumni office and we will pass on your message. Want to be listed?{' '}
            <a href="#register" className="link">
              Register and opt in
            </a>
            .
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          <FilterSelect label="Graduation year" value={filters.year} onChange={(v) => setFilter('year', v)} options={batchOptions} allLabel="All years" />
          <FilterSelect label="Department" value={filters.department} onChange={(v) => setFilter('department', v)} options={deptOptions} allLabel="All departments" />
          <FilterSelect label="Industry" value={filters.industry} onChange={(v) => setFilter('industry', v)} options={industryOptions} allLabel="All industries" />
        </div>
        <div className="mt-5">
          <ResultsSummary id="directory-results" start={start} end={end} total={total} noun="alumni" onReset={resetFilters} activeFilters={activeCount} />
        </div>

        {total === 0 ? (
          <EmptyState
            className="mt-6"
            title="No alumni match these filters"
            description="Only alumni who opted in are listed, so some batches may have few entries. Try removing a filter."
            action={
              <button type="button" className={buttonClasses({ variant: 'secondary' })} onClick={resetFilters}>
                Clear all filters
              </button>
            }
          />
        ) : (
          <>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((a) => (
                <li key={a.id} className="card card-hover flex items-start gap-4 p-5">
                  <SmartImage image={{ src: a.photo.src, alt: '' }} decorative className="h-14 w-14 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="font-bold text-navy-950">{a.name}</p>
                    <p className="text-sm text-ink-soft">
                      {a.role}, {a.organization}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge tone="navy">Class of {a.batch}</Badge>
                      <Badge tone="royal">{getDepartment(a.departmentSlug)?.shortName ?? a.program}</Badge>
                      <Badge tone="slate">{a.industry}</Badge>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} scrollTargetId="directory-results" />
          </>
        )}
      </Section>

      {/* Achievements */}
      <Section tone="white" id="achievements" labelledBy="achievements-heading">
        <SectionHeading id="achievements-heading" eyebrow="Achievements" title="Alumni making a difference" description="Highlights across sectors. Individual achievements are published after verification." />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a) => (
            <StaggerItem key={a.title} className="card card-hover group p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700 transition group-hover:bg-gold-400 group-hover:text-navy-950">
                <a.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Testimonials */}
      {alumniTestimonials.length > 0 && (
        <Section tone="navy" id="voices" labelledBy="voices-heading">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SectionHeading
              id="voices-heading"
              light
              eyebrow="In their words"
              title="Alumni testimonials"
              description="Shared with consent and moderated before publication."
              action={
                <ButtonLink to="/testimonials?role=Alumni" variant="outline-light" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  All testimonials
                </ButtonLink>
              }
              className="mb-0 md:flex-col md:items-start"
            />
            <TestimonialCarousel items={alumniTestimonials} light label="Alumni testimonials" />
          </div>
        </Section>
      )}

      {/* Events */}
      <Section tone="white" id="reunions" labelledBy="reunions-heading">
        <SectionHeading
          id="reunions-heading"
          eyebrow="Reunions & events"
          title="Come back to campus"
          description="Homecoming, batch reunions and chapter meet-ups. Batch coordinators can contact the alumni office to plan a reunion on campus."
          action={
            <ButtonLink to="/events" variant="secondary" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
              All events
            </ButtonLink>
          }
        />
        {alumniEvents.length > 0 ? (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {alumniEvents.map((e) => (
              <StaggerItem key={e.slug}>
                <EventCard event={e} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState icon={<CalendarDays className="h-7 w-7" aria-hidden />} title="No alumni events scheduled right now" description="Register with the alumni network to hear about the next reunion first." />
        )}
      </Section>

      {/* Mentorship */}
      <Section tone="alt" id="mentorship" labelledBy="mentorship-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal direction="right" className="relative order-2 lg:order-1">
            <ParallaxImage image={images.meeting} strength={10} className="aspect-[4/3] rounded-3xl shadow-lift" />
            <div className="absolute -bottom-5 right-5 rounded-2xl bg-gold-400 px-5 py-3 font-display font-extrabold text-navy-950 shadow-glow">Give an hour, change a career</div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              id="mentorship-heading"
              eyebrow="Mentorship & networking"
              title="Give back with your experience"
              description="Students value nothing more than advice from people who sat in the same classrooms. Choose how you’d like to help."
              className="mb-6"
            />
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
              {mentorship.map((m) => (
                <StaggerItem as="li" key={m.title} className="rounded-2xl border border-navy-100 bg-white p-5 transition hover:border-royal-200 hover:shadow-card">
                  <m.icon className="h-6 w-6 text-royal-700" aria-hidden />
                  <h3 className="mt-3 font-bold">{m.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{m.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Section>

      {/* Association */}
      <Section tone="white" id="association" labelledBy="association-heading">
        <SectionHeading id="association-heading" eyebrow="Alumni association" title="The Bapuji College Alumni Association" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="card p-6 sm:p-7 lg:col-span-2">
            <div className="prose-college">
              <p>
                The Alumni Association brings together graduates of every program and batch. It organises homecoming and reunions, supports the mentorship program, coordinates city
                chapters and recognises distinguished alumni each year.
              </p>
              <p>
                Membership is free for all graduates of {siteConfig.shortName}. Office bearers are elected by members; the executive committee works with the college’s alumni office.
              </p>
            </div>
            <dl className="mt-2 grid gap-4 sm:grid-cols-3">
              {[
                { term: 'Membership', desc: 'Free for all graduates' },
                { term: 'Office bearers', desc: 'To be published after election' },
                { term: 'Registration status', desc: 'Details to be configured' },
              ].map((d) => (
                <div key={d.term} className="rounded-xl bg-surface-sunken p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{d.term}</dt>
                  <dd className="mt-1 font-semibold text-navy-950">{d.desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1} className="card flex flex-col p-6 sm:p-7">
            <h3 className="text-lg font-bold">Alumni office</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`mailto:${ac.email}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-royal-50">
                  <Mail className="h-5 w-5 text-royal-700" aria-hidden />
                  <span className="font-semibold text-navy-900">{ac.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${ac.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-royal-50">
                  <Phone className="h-5 w-5 text-royal-700" aria-hidden />
                  <span className="font-semibold text-navy-900">{ac.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 p-2 text-ink-soft">
                <Building2 className="h-5 w-5 text-royal-700" aria-hidden />
                Administrative block, ground floor
              </li>
            </ul>
            <a href="#register" className={cn(buttonClasses({ variant: 'primary' }), 'mt-auto self-start')}>
              Join the association
            </a>
          </Reveal>
        </div>
      </Section>

      {/* Giving */}
      <Section tone="sunken" id="giving" labelledBy="giving-heading">
        <SectionHeading
          id="giving-heading"
          eyebrow="Giving back"
          title="Support the next generation"
          description="Contributions from alumni fund scholarships, labs and student initiatives. Every contribution is acknowledged with a receipt from the college accounts office."
        />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-3">
            {givingOptions.map((g) => (
              <StaggerItem as="li" key={g.title} className="card card-hover p-5">
                <HeartHandshake className="h-6 w-6 text-royal-700" aria-hidden />
                <h3 className="mt-3 font-bold">{g.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{g.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="rounded-3xl border-2 border-dashed border-gold-300 bg-white p-6">
            <div className="flex items-center gap-3">
              <HandCoins className="h-7 w-7 text-gold-600" aria-hidden />
              <h3 className="text-lg font-bold">Online contributions</h3>
            </div>
            <Badge tone="gold" icon={<PlugZap className="h-3 w-3" aria-hidden />} className="mt-3">
              Integration pending
            </Badge>
            <p className="mt-3 text-sm text-ink-soft">
              A secure payment gateway has not been connected yet, so this site does not accept payments. To contribute, please contact the alumni office — they will share the official
              bank details and tax-exemption information (where applicable).
            </p>
            <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
              <Lock className="h-3.5 w-3.5" aria-hidden /> Never transfer money based on unsolicited messages.
            </p>
            <a href={`mailto:${ac.email}?subject=${encodeURIComponent('Alumni contribution enquiry')}`} className={cn(buttonClasses({ variant: 'secondary', size: 'sm' }), 'mt-4')}>
              <Mail className="h-4 w-4" aria-hidden /> Email the alumni office
            </a>
          </Reveal>
        </div>
      </Section>

      {/* Registration */}
      <Section tone="white" id="register" labelledBy="register-heading">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <SectionHeading
              id="register-heading"
              eyebrow="Register"
              title="Join the alumni network"
              description="Register to receive reunion invitations, newsletters and mentoring opportunities. Listing in the public directory is optional and needs your consent."
              className="mb-6"
            />
            <Reveal>
              <ul className="space-y-3 text-sm text-ink-soft">
                {['Verified against college records before activation', 'Directory listing only with your explicit consent', 'Update or delete your details at any time'].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-royal-600" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink-muted">
                Questions? Read our{' '}
                <Link to="/privacy" className="link">
                  privacy policy
                </Link>{' '}
                or email <a href={`mailto:${ac.email}`} className="link">{ac.email}</a>.
              </p>
            </Reveal>
          </div>
          <Reveal direction="left" className="card p-6 sm:p-8">
            <AlumniRegistrationForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
