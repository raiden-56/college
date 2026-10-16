import { Eye, EyeOff, Lock, Mail, MessageSquareText, Phone, Quote, ShieldAlert, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Tabs } from '@/components/ui/Tabs';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { GrievanceForm } from '@/components/feedback/GrievanceForm';
import { grievanceOffices } from '@/components/feedback/grievanceOffices';
import { images } from '@/data/images';
import { siteConfig } from '@/config/site';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { getIcon } from '@/utils/icons';

const channels = [
  {
    icon: MessageSquareText,
    title: 'Feedback',
    visibility: 'Private',
    visIcon: EyeOff,
    text: 'Suggestions and ratings about teaching, facilities and services. Read by the IQAC to improve the college. Can be anonymous.',
  },
  {
    icon: Lock,
    title: 'Grievance / complaint',
    visibility: 'Confidential',
    visIcon: Lock,
    text: 'A formal complaint routed to the statutory office responsible. Needs your contact details so the office can investigate and reply.',
  },
  {
    icon: Quote,
    title: 'Public testimonial',
    visibility: 'Public — only with consent',
    visIcon: Eye,
    text: 'Feedback becomes a testimonial only if you tick the publication consent box and it passes moderation. You can withdraw it at any time.',
  },
];

const processSteps = [
  { title: 'Submit', text: 'Use the form below, email or phone. You receive a reference number.' },
  { title: 'Acknowledge', text: 'The office acknowledges receipt, usually within 2 working days.' },
  { title: 'Review or inquiry', text: 'The office reviews the matter, may contact you and the people involved, and keeps records confidential.' },
  { title: 'Resolution', text: 'You are told the outcome and any action taken, in writing.' },
  { title: 'Appeal', text: 'If unsatisfied, you can appeal to the Principal or the university / statutory ombudsperson as per regulations.' },
];

export default function FeedbackPage() {
  const [filters, setFilter] = useUrlFilters({ tab: 'feedback' });
  const tab = filters.tab === 'grievance' ? 'grievance' : 'feedback';
  const g = siteConfig.contacts.grievance;

  return (
    <>
      <Seo
        title="Feedback & Grievances"
        description="Share private feedback with Bapuji College Karwar or file a confidential grievance routed to the right committee. Response timelines and helplines included."
      />
      <PageHero
        eyebrow="We’re listening"
        title="Feedback & grievances"
        description="Tell us what is working and what isn’t. Feedback helps us improve; grievances are handled confidentially by the office responsible, within published timelines."
        image={images.writing}
        actions={
          <>
            <ButtonLink to={{ search: '', hash: '#forms' }} variant="gold">
              Give feedback
            </ButtonLink>
            <ButtonLink to={{ search: '?tab=grievance', hash: '#forms' }} variant="outline-light">
              File a grievance
            </ButtonLink>
          </>
        }
      />

      {/* Channels */}
      <Section tone="white" id="channels" labelledBy="channels-heading">
        <SectionHeading
          id="channels-heading"
          eyebrow="Choose the right channel"
          title="Private feedback is not the same as a public testimonial"
          description="Nothing you send here is published automatically. Here is what happens to each kind of message."
        />
        <Stagger className="grid gap-5 md:grid-cols-3">
          {channels.map((c) => (
            <StaggerItem key={c.title} className="card card-hover p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-royal-50 text-royal-700">
                  <c.icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="chip border-navy-200 bg-navy-50 text-navy-800">
                  <c.visIcon className="h-3.5 w-3.5" aria-hidden />
                  {c.visibility}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Forms */}
      <Section tone="alt" id="forms" labelledBy="forms-heading">
        <SectionHeading id="forms-heading" eyebrow="Submit" title="Send feedback or a grievance" description="Choose a tab. Required fields are marked with an asterisk." />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <Tabs
              label="Type of submission"
              value={tab}
              onChange={(v) => setFilter('tab', v)}
              listClassName="w-full sm:w-max"
              tabs={[
                {
                  id: 'feedback',
                  label: 'Feedback',
                  content: (
                    <div className="card p-6 sm:p-8">
                      <h3 className="text-xl font-bold">Institutional feedback</h3>
                      <p className="mb-6 mt-1 text-sm text-ink-muted">Private. Reviewed by the Internal Quality Assurance Cell (IQAC). You may stay anonymous.</p>
                      <FeedbackForm />
                    </div>
                  ),
                },
                {
                  id: 'grievance',
                  label: 'Grievance / complaint',
                  content: (
                    <div className="card p-6 sm:p-8">
                      <h3 className="text-xl font-bold">Grievance or complaint</h3>
                      <p className="mb-6 mt-1 text-sm text-ink-muted">Confidential. Routed only to the office you choose below.</p>
                      <GrievanceForm />
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <aside aria-labelledby="helplines-heading" className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="on-dark overflow-hidden rounded-3xl bg-navy-radial p-6 text-white shadow-lift">
              <h3 id="helplines-heading" className="flex items-center gap-2 text-lg font-bold text-white">
                <Siren className="h-5 w-5 text-gold-300" aria-hidden /> Helplines
              </h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li>
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-200">Grievance Redressal Cell</p>
                  <a href={`tel:${g.phone.replace(/\s/g, '')}`} className="mt-1 flex items-center gap-2 font-semibold text-white hover:underline">
                    <Phone className="h-4 w-4 text-gold-300" aria-hidden /> {g.phone}
                  </a>
                  <a href={`mailto:${g.email}`} className="mt-1 flex items-center gap-2 break-all font-semibold text-white hover:underline">
                    <Mail className="h-4 w-4 shrink-0 text-gold-300" aria-hidden /> {g.email}
                  </a>
                </li>
                <li className="rounded-2xl bg-white/10 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-200">
                    <ShieldAlert className="h-4 w-4" aria-hidden /> National Anti-Ragging Helpline
                  </p>
                  <a href={`tel:${siteConfig.contacts.antiRaggingHelpline.replace(/-/g, '')}`} className="mt-1 block font-display text-2xl font-extrabold text-white hover:underline">
                    {siteConfig.contacts.antiRaggingHelpline}
                  </a>
                  <p className="mt-1 text-xs text-navy-100">Toll-free, 24×7. In an emergency, also contact campus security immediately.</p>
                </li>
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="card p-6 text-sm text-ink-soft">
              <h3 className="text-base font-bold">Before you submit</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>For general questions, use the <Link to="/contact" className="link">contact page</Link>.</li>
                <li>Admission enquiries go to the <Link to="/admissions" className="link">admissions team</Link>.</li>
                <li>
                  Want to share a story publicly? Read how <Link to="/testimonials" className="link">testimonials</Link> are moderated.
                </li>
              </ul>
            </Reveal>
          </aside>
        </div>
      </Section>

      {/* Routing & timelines */}
      <Section tone="white" id="routing" labelledBy="routing-heading">
        <SectionHeading
          id="routing-heading"
          eyebrow="Routing & timelines"
          title="Who handles your grievance"
          description="Each grievance goes directly to the office responsible. Target timelines are indicative and follow the college’s grievance policy and applicable UGC regulations."
        />
        <Reveal>
          <ResponsiveTable
            caption="Grievance offices, what they handle and target response times"
            captionHidden
            stackOnMobile
            rows={grievanceOffices}
            rowKey={(o) => o.value}
            columns={[
              {
                key: 'office',
                header: 'Office',
                cell: (o) => {
                  const Icon = getIcon(o.icon);
                  return (
                    <span className="inline-flex items-center gap-2">
                      <Icon className="hidden h-4 w-4 text-royal-700 md:inline" aria-hidden />
                      {o.value}
                    </span>
                  );
                },
              },
              { key: 'handles', header: 'Handles', cell: (o) => o.handles },
              { key: 'timeline', header: 'Target response', cell: (o) => o.timeline },
            ]}
          />
        </Reveal>

        <h3 className="mt-14 text-xl font-bold">What happens after you submit</h3>
        <Stagger as="ol" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((s, i) => (
            <StaggerItem as="li" key={s.title} className="relative rounded-2xl border border-navy-100 bg-surface-alt p-5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 font-display text-sm font-extrabold text-gold-300">
                <span className="sr-only">Step </span>
                {i + 1}
              </span>
              <h4 className="mt-3 font-bold">{s.title}</h4>
              <p className="mt-1 text-sm text-ink-muted">{s.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Confidentiality & moderation */}
      <Section tone="sunken" id="privacy-commitments" labelledBy="commitments-heading" size="sm">
        <h2 id="commitments-heading" className="sr-only">
          Confidentiality and moderation commitments
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="card p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Lock className="h-5 w-5 text-royal-700" aria-hidden /> Confidentiality
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Grievances are stored with restricted access and seen only by the members of the office handling them. Identities are protected as far as the inquiry allows; statutory
              committees (ICC, Anti-Ragging) follow the confidentiality provisions of their governing regulations. Retaliation against complainants is a disciplinary offence.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="card p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Eye className="h-5 w-5 text-royal-700" aria-hidden /> Publication & moderation
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Feedback is never published unless you give consent on the form. Consented feedback is moderated — we may contact you to confirm wording and how your name appears — and
              you can ask us to remove it at any time. Grievances are never published.
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
