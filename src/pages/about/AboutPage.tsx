import { ArrowRight, Award, BadgeCheck, Building2, CalendarClock, Clock3, Landmark, Medal, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { SmartImage } from '@/components/ui/SmartImage';
import { StatBlock } from '@/components/ui/StatBlock';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ParallaxImage, ParallaxLayer } from '@/components/motion/Parallax';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { InPageNav, type InPageNavItem } from '@/components/about/InPageNav';
import { LeaderMessage } from '@/components/about/LeaderMessage';
import { MilestoneTimeline } from '@/components/about/MilestoneTimeline';
import { siteConfig } from '@/config/site';
import { awards, chairman, coreValues, infrastructureHighlights, institutionStats, leaders, milestones, mission, principal, vision } from '@/data/institution';
import { departments } from '@/data/departments';
import { programs } from '@/data/programs';
import { disclosures } from '@/data/disclosures';
import { images } from '@/data/images';
import { getIcon } from '@/utils/icons';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const sections: InPageNavItem[] = [
  { id: 'overview', label: 'Overview & history' },
  { id: 'vision', label: 'Vision & values' },
  { id: 'principal', label: 'Principal’s message' },
  { id: 'chairman', label: 'Chairman’s message' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'accreditation', label: 'Accreditation' },
  { id: 'infrastructure', label: 'Infrastructure' },
];

/** Extra offset so anchored sections clear the fixed header *and* the sticky sub-navigation. */
const anchorOffset = 'scroll-mt-12';

const yearsOfService = new Date().getFullYear() - siteConfig.established;
const iqacDocuments = disclosures.filter((d) => d.category === 'IQAC');
const pendingAccreditations = siteConfig.accreditations.filter((a) => !a.verified).length;
const affiliationPending = /configure|\[/i.test(siteConfig.affiliation);
const leadershipPreview = leaders.filter((l) => l.role !== 'governing-body').slice(0, 4);
const awardIcons = [Trophy, Medal, Award, Sparkles];

/** Strip inline review notes from award strings; the UI shows a status badge instead. */
const parsedAwards = awards.map((raw) => ({
  text: raw.replace(/\s*\((details to be verified|see News)\)\s*$/i, ''),
  pending: /to be verified/i.test(raw),
  seeNews: /see News/i.test(raw),
}));

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Us"
        description={`Discover ${siteConfig.shortName}: our history since ${siteConfig.established}, vision and values, leadership, milestones, accreditation status and campus infrastructure.`}
      />
      <PageHero
        eyebrow="About us"
        title={`About ${siteConfig.shortName}`}
        description={`${siteConfig.tagline} Since ${siteConfig.established}, we have helped students grow into thoughtful professionals and responsible citizens.`}
        image={images.heroCampus}
        size="lg"
        actions={
          <>
            <ButtonLink to="/about/leadership" variant="gold" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Meet our leadership
            </ButtonLink>
            <ButtonLink to="/campus" variant="outline-light">
              Explore the campus
            </ButtonLink>
          </>
        }
        aside={
          <dl className="glass grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl sm:w-auto">
            {[
              { label: 'Established', value: String(siteConfig.established) },
              { label: 'Years of service', value: `${yearsOfService}+` },
              { label: 'Departments', value: String(departments.length) },
              { label: 'Programs', value: String(programs.length) },
            ].map((f) => (
              <div key={f.label} className="bg-navy-950/30 px-5 py-4 sm:min-w-[9.5rem]">
                <dt className="text-xs font-semibold uppercase tracking-wide text-navy-200">{f.label}</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold text-white">{f.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <div>
        <InPageNav items={sections} label="About page sections" />

        {/* Overview & history */}
        <Section id="overview" labelledBy="overview-heading" className={anchorOffset}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                id="overview-heading"
                eyebrow="Overview & history"
                title={`${yearsOfService} years of learning, built on purpose`}
                className="mb-6 sm:mb-8"
              />
              <Reveal className="space-y-4 text-base leading-relaxed text-ink-soft sm:text-[1.0625rem]">
                <p>
                  {siteConfig.name} was founded in {siteConfig.established} by the Bapuji Grameena Vikasa Samiti with a simple promise: quality
                  higher education that is accessible, values-driven and relevant to society. The college opened with programs in science,
                  commerce and mechanical engineering.
                </p>
                <p>
                  Over the decades we have grown into a multi-disciplinary institution with {departments.length} academic departments and{' '}
                  {programs.length} programs spanning engineering, computing, sciences, commerce and management, humanities, law and education —
                  on a green campus in {siteConfig.address.city}.
                </p>
                <p>
                  What has not changed is our approach: small classes, a mentor for every student, faculty who teach and research, and a
                  culture that values integrity, curiosity and service.
                </p>
              </Reveal>
              <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/departments" variant="primary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  Explore departments
                </ButtonLink>
                <ButtonLink to="/programs" variant="secondary">
                  Browse programs
                </ButtonLink>
              </Reveal>
            </div>

            <Reveal className="relative pb-10 sm:pb-0 sm:pr-10">
              <div className="overflow-hidden rounded-3xl shadow-lift">
                <SmartImage image={images.campusAerial} className="aspect-[4/3] w-full object-cover" />
              </div>
              <ParallaxLayer offset={30} className="absolute -bottom-2 right-0 w-1/2 sm:-bottom-10 sm:-right-2">
                <div className="overflow-hidden rounded-2xl border-4 border-white shadow-lift">
                  <SmartImage image={images.library} className="aspect-[4/3] w-full object-cover" />
                </div>
              </ParallaxLayer>
              <div className="absolute -left-2 top-6 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-lift sm:-left-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-300">Est.</p>
                <p className="font-display text-3xl font-extrabold">{siteConfig.established}</p>
              </div>
            </Reveal>
          </div>

          <Stagger as="ul" className="mt-16 grid grid-cols-2 gap-8 border-t border-navy-100 pt-12 sm:grid-cols-3 lg:grid-cols-5" aria-label="College at a glance">
            {institutionStats.map((s) => (
              <StaggerItem as="li" key={s.label}>
                <StatBlock stat={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>

        {/* Vision, mission & values */}
        <Section id="vision" tone="alt" labelledBy="vision-heading" className={anchorOffset}>
          <SectionHeading
            id="vision-heading"
            eyebrow="Vision, mission & core values"
            title="What guides us"
            description="Our vision sets the direction, our mission describes how we get there and our values shape everyday decisions."
          />
          <div className="grid gap-6 lg:grid-cols-5">
            <Reveal className="on-dark relative overflow-hidden rounded-3xl bg-navy-radial p-8 text-white shadow-lift lg:col-span-2 sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-royal-500/30 blur-3xl" aria-hidden />
              <h3 className="relative text-sm font-bold uppercase tracking-[0.18em] text-gold-300">Our vision</h3>
              <p className="relative mt-4 font-display text-2xl font-bold leading-snug text-white sm:text-[1.75rem]">“{vision}”</p>
            </Reveal>
            <Reveal delay={0.08} className="card p-8 lg:col-span-3 sm:p-10">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-royal-700">Our mission</h3>
              <ol className="mt-5 space-y-4">
                {mission.map((m, i) => (
                  <li key={m} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-royal-50 font-display text-sm font-bold text-royal-800" aria-hidden>
                      {i + 1}
                    </span>
                    <span className="pt-1 leading-relaxed text-ink-soft">{m}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <h3 className="mt-14 text-xl font-bold sm:text-2xl">Core values</h3>
          <Stagger as="ul" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {coreValues.map((v) => {
              const Icon = getIcon(v.icon);
              return (
                <StaggerItem as="li" key={v.title} className="card card-hover group p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-gold-300 transition-colors group-hover:bg-royal-700 group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h4 className="mt-4 text-lg font-bold">{v.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{v.text}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Section>

        {/* Principal */}
        <Section id="principal" labelledBy="principal-heading" className={anchorOffset}>
          <LeaderMessage
            person={principal}
            paragraphs={principal.message}
            eyebrow="Principal’s message"
            title="Education that shapes character as well as careers"
            headingId="principal-heading"
            excerpt={2}
            moreLink={{ to: '/about/leadership#principal-message', label: 'Read the full message' }}
          />
        </Section>

        {/* Chairman */}
        <Section id="chairman" tone="alt" labelledBy="chairman-heading" className={anchorOffset}>
          <LeaderMessage
            person={chairman}
            paragraphs={chairman.message}
            eyebrow="From the management"
            title="A promise of accessible, values-driven education"
            headingId="chairman-heading"
            moreLink={{ to: '/about/leadership#chairman-message', label: 'Leadership & governance' }}
            reverse
          />
        </Section>

        {/* Leadership preview */}
        <Section id="leadership" tone="navy" labelledBy="leadership-heading" className={anchorOffset}>
          <SectionHeading
            id="leadership-heading"
            light
            eyebrow="Leadership"
            title="The people who steer the college"
            description="Our trust management, academic administration and governing body work together on strategy, quality and student welfare."
            action={
              <ButtonLink to="/about/leadership" variant="gold" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Leadership & governance
              </ButtonLink>
            }
          />
          <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leadershipPreview.map((l) => (
              <StaggerItem as="li" key={l.name}>
                <Link
                  to="/about/leadership"
                  className="group flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:-translate-y-1 hover:border-gold-300/50 hover:bg-white/10"
                >
                  <SmartImage image={{ src: l.photo.src, alt: '' }} decorative className="h-16 w-16 shrink-0 rounded-full object-cover object-top ring-2 ring-gold-300/40" />
                  <span className="min-w-0">
                    <span className="block font-display font-bold leading-snug text-white">{l.name}</span>
                    <span className="mt-0.5 block text-sm text-navy-100">{l.designation}</span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-8 flex flex-wrap items-center gap-2 text-sm text-navy-200">
            <DemoBadge light label="Fictional names" />
            Names and photographs are placeholders until the institution publishes approved governance records.
          </p>
        </Section>

        {/* Milestones */}
        <Section id="milestones" labelledBy="milestones-heading" className={anchorOffset}>
          <SectionHeading
            id="milestones-heading"
            eyebrow="Milestones"
            title="Our journey so far"
            description={`From three programs in ${siteConfig.established} to a multi-disciplinary campus — the moments that shaped us.`}
            align="center"
          />
          <MilestoneTimeline items={milestones} className="mx-auto max-w-5xl" />
          <DemoNotice className="mx-auto mt-10 max-w-3xl" title="Dates awaiting confirmation">
            Milestone years are illustrative and should be confirmed against the institution’s records before publication.
          </DemoNotice>
        </Section>

        {/* Achievements & awards */}
        <Section id="achievements" tone="alt" labelledBy="achievements-heading" className={anchorOffset}>
          <SectionHeading
            id="achievements-heading"
            eyebrow="Achievements & awards"
            title="Recognition for our people and practices"
            description="Highlights from our students, faculty and campus initiatives. Every item is reviewed against official records before it is published as a credential."
            action={
              <ButtonLink to="/news" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Latest news
              </ButtonLink>
            }
          />
          <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {parsedAwards.map((a, i) => {
              const Icon = awardIcons[i % awardIcons.length];
              return (
                <StaggerItem as="li" key={a.text} className="card card-hover relative flex flex-col overflow-hidden p-6">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-royal-500" aria-hidden />
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="mt-4 flex-1 font-semibold leading-snug text-navy-950">{a.text}</p>
                  <div className="mt-4">
                    {a.pending && (
                      <Badge tone="gold" icon={<Clock3 className="h-3 w-3" aria-hidden />}>
                        Pending verification
                      </Badge>
                    )}
                    {a.seeNews && (
                      <Link to="/news" className="link inline-flex items-center gap-1 text-sm">
                        See news & stories <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Section>

        {/* Affiliation, recognition, accreditation & IQAC */}
        <Section id="accreditation" labelledBy="accreditation-heading" className={anchorOffset}>
          <SectionHeading
            id="accreditation-heading"
            eyebrow="Affiliation, recognition & quality"
            title="Accreditation & quality assurance"
            description="We publish approvals and quality documents openly. Items that have not yet been verified against official orders are clearly marked."
          />

          {pendingAccreditations > 0 && (
            <Reveal>
              <div role="note" className="mb-8 flex gap-3 rounded-2xl border border-gold-200 bg-gold-50/70 p-4 text-sm text-gold-900 sm:p-5">
                <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden />
                <p>
                  <strong className="font-semibold">Pending verification:</strong> {pendingAccreditations} of {siteConfig.accreditations.length}{' '}
                  approvals listed below are placeholders. They must not be read as confirmed credentials until the official documents are
                  published on the{' '}
                  <Link to="/disclosures" className="link">
                    disclosures page
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal className="card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy-900 text-gold-300">
                  <Landmark className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="text-xl font-bold">Affiliation & recognition</h3>
                  <p className="mt-1 text-sm text-ink-muted">{siteConfig.affiliation}</p>
                  {affiliationPending && (
                    <Badge tone="gold" className="mt-2" icon={<Clock3 className="h-3 w-3" aria-hidden />}>
                      Pending verification
                    </Badge>
                  )}
                </div>
              </div>
              <ul className="mt-6 divide-y divide-navy-100 border-t border-navy-100">
                {siteConfig.accreditations.map((a) => (
                  <li key={a.short} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                    <span className="grid h-11 w-14 shrink-0 place-items-center rounded-xl border border-navy-100 bg-surface-alt font-display text-sm font-extrabold text-navy-800">
                      {a.short}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-navy-900">{a.label}</span>
                    {a.verified ? (
                      <Badge tone="green" icon={<BadgeCheck className="h-3 w-3" aria-hidden />}>
                        Verified
                      </Badge>
                    ) : (
                      <Badge tone="gold" icon={<Clock3 className="h-3 w-3" aria-hidden />}>
                        Pending verification
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="flex flex-col gap-6">
              <div className="card p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                    <ShieldCheck className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">Internal Quality Assurance Cell (IQAC)</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      The IQAC plans, guides and monitors quality across teaching, research and administration. It collects stakeholder
                      feedback, runs academic and administrative audits, coordinates accreditation submissions and publishes an Annual Quality
                      Assurance Report (AQAR) every year.
                    </p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
                  {['Curriculum & feedback analysis', 'Academic & administrative audits', 'Faculty development programs', 'Accreditation & ranking data'].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">IQAC documents</h3>
                <ul className="mt-3 space-y-3">
                  {iqacDocuments.map((d) => (
                    <li key={d.id}>
                      <DownloadLink title={d.title} url={d.url} sizeKb={d.sizeKb} fileType={d.fileType} meta={`${d.academicYear} · Updated ${formatDate(d.updatedOn)}`} showPreview />
                    </li>
                  ))}
                </ul>
                <ButtonLink to="/disclosures" variant="primary" className="mt-5" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  All mandatory disclosures
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* Infrastructure */}
        <Section id="infrastructure" tone="sunken" labelledBy="infrastructure-heading" className={anchorOffset}>
          <SectionHeading
            id="infrastructure-heading"
            eyebrow="Infrastructure"
            title="A campus built for learning and living"
            description="Smart classrooms, specialised laboratories, a digital library, hostels and sports facilities — all within one green campus."
            action={
              <ButtonLink to="/campus" variant="primary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Campus & facilities
              </ButtonLink>
            }
          />

          <Reveal>
            <ParallaxImage image={images.campusAerial} strength={14} className="on-dark h-64 rounded-3xl shadow-lift sm:h-80 lg:h-96" imgClassName="opacity-90">
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/45 to-transparent" aria-hidden />
              <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-12">
                <div className="max-w-md">
                  <p className="eyebrow eyebrow-light">
                    <Building2 className="h-4 w-4" aria-hidden /> Campus life
                  </p>
                  <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    Spaces that make it easy to learn, build, play and belong.
                  </p>
                  <Link to="/campus/virtual-tour" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 hover:text-white hover:underline">
                    Take the virtual tour <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </ParallaxImage>
          </Reveal>

          <Stagger as="ul" className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {infrastructureHighlights.map((h, i) => (
              <StaggerItem as="li" key={h.label} className={cn('card card-hover flex flex-col p-5', i === 0 && 'border-royal-200')}>
                <span className="font-display text-2xl font-extrabold text-navy-950 sm:text-3xl">{h.value}</span>
                <span className="mt-1 text-sm text-ink-muted">{h.label}</span>
                {h.isDemo && <DemoBadge className="mt-3 self-start" />}
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
            <Users className="h-4 w-4 shrink-0 text-royal-600" aria-hidden />
            <span>
              Need accessibility support on campus?{' '}
              <Link to="/contact" className="link">
                Contact the student welfare office
              </Link>
              .
            </span>
          </p>
        </Section>
      </div>

      <EnquiryCTA />
    </>
  );
}
