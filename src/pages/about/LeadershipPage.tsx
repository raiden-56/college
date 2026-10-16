import { ArrowRight, Briefcase, Building, FileText, Landmark, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Leader } from '@/types';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge, DemoNotice } from '@/components/ui/DemoBadge';
import { Modal } from '@/components/ui/Modal';
import { SmartImage } from '@/components/ui/SmartImage';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { LeaderCard } from '@/components/about/LeaderCard';
import { LeaderMessage } from '@/components/about/LeaderMessage';
import { siteConfig } from '@/config/site';
import { chairman, leaders, principal } from '@/data/institution';
import { images } from '@/data/images';

const groups: { role: Leader['role']; id: string; eyebrow: string; title: string; description: string; icon: typeof Users }[] = [
  {
    role: 'management',
    id: 'management',
    eyebrow: 'Management',
    title: 'Bapuji Grameena Vikasa Samiti',
    description: 'The sponsoring trust sets long-term direction, invests in people and infrastructure and ensures transparent governance.',
    icon: Building,
  },
  {
    role: 'administration',
    id: 'administration',
    eyebrow: 'Academic administration',
    title: 'Principal & senior officers',
    description: 'The academic leadership team runs teaching, research, examinations, records and student welfare day to day.',
    icon: Briefcase,
  },
  {
    role: 'governing-body',
    id: 'governing-body',
    eyebrow: 'Governance',
    title: 'Governing body',
    description: 'The governing body reviews academic quality, budgets and policies, with members representing academia, industry and the affiliating university.',
    icon: Landmark,
  },
];

const roleLabel: Record<Leader['role'], string> = {
  management: 'Trust management',
  administration: 'Academic administration',
  'governing-body': 'Governing body',
};

/** Full messages are attached to leaders whose name matches the principal / chairman records. */
const messageFor = (leader: Leader) => {
  if (leader.name === principal.name) return { paragraphs: principal.message, anchor: 'principal-message' };
  if (leader.name === chairman.name) return { paragraphs: chairman.message, anchor: 'chairman-message' };
  return null;
};

export default function LeadershipPage() {
  const [selected, setSelected] = useState<Leader | null>(null);
  const message = selected ? messageFor(selected) : null;

  return (
    <>
      <Seo
        title="Leadership & Governance"
        description={`Meet the management, academic administration and governing body of ${siteConfig.shortName}, and read messages from our Chairman and Principal.`}
      />
      <PageHero
        eyebrow="About us"
        title="Leadership & governance"
        description="Transparent, accountable leadership is at the heart of the college. Meet the people responsible for our direction, academics and quality."
        image={images.meeting}
        actions={
          <>
            <ButtonLink to="#principal-message" variant="gold">
              Principal’s message
            </ButtonLink>
            <ButtonLink to="/disclosures" variant="outline-light" icon={<FileText className="h-4 w-4" aria-hidden />}>
              Committees & disclosures
            </ButtonLink>
          </>
        }
      />

      <Section tone="alt" size="sm" ariaLabel="About this information">
        <DemoNotice title="Demo leadership records">
          All names, designations and photographs on this page are fictional placeholders. Replace them with approved governance records
          (with each person’s consent) before the site goes live.
        </DemoNotice>
        <nav aria-label="Leadership groups" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="chip border-navy-200 bg-white px-4 py-2 text-sm text-navy-800 transition hover:border-royal-400 hover:text-royal-700">
                  <g.icon className="h-4 w-4" aria-hidden />
                  {g.eyebrow}
                </a>
              </li>
            ))}
            <li>
              <a href="#messages" className="chip border-navy-200 bg-white px-4 py-2 text-sm text-navy-800 transition hover:border-royal-400 hover:text-royal-700">
                <Users className="h-4 w-4" aria-hidden />
                Messages
              </a>
            </li>
          </ul>
        </nav>
      </Section>

      {groups.map((g, gi) => {
        const members = leaders.filter((l) => l.role === g.role);
        if (members.length === 0) return null;
        return (
          <Section key={g.id} id={g.id} tone={gi % 2 === 0 ? 'white' : 'alt'} labelledBy={`${g.id}-heading`}>
            <SectionHeading id={`${g.id}-heading`} eyebrow={g.eyebrow} title={g.title} description={g.description} />
            <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((l) => (
                <StaggerItem as="li" key={l.name}>
                  <LeaderCard leader={l} onOpen={() => setSelected(l)} />
                </StaggerItem>
              ))}
            </Stagger>
          </Section>
        );
      })}

      <div id="messages">
        <Section id="principal-message" tone="sunken" labelledBy="principal-message-heading">
          <LeaderMessage
            person={principal}
            paragraphs={principal.message}
            eyebrow="Message from the Principal"
            title="Welcome to our learning community"
            headingId="principal-message-heading"
          />
        </Section>
        <Section id="chairman-message" labelledBy="chairman-message-heading">
          <LeaderMessage
            person={chairman}
            paragraphs={chairman.message}
            eyebrow="Message from the Chairman"
            title="Our commitment to students and society"
            headingId="chairman-message-heading"
            reverse
          />
        </Section>
      </div>

      <Section tone="navy" size="sm" labelledBy="governance-docs-heading">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 id="governance-docs-heading" className="text-2xl font-extrabold text-white sm:text-3xl">
              Committees, policies & statutory documents
            </h2>
            <p className="mt-2 text-navy-100">
              Composition of statutory committees (anti-ragging, ICC, grievance redressal), governance policies and audit reports are published
              on our disclosures page.
            </p>
          </div>
          <ButtonLink to="/disclosures" variant="gold" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            View disclosures
          </ButtonLink>
        </div>
      </Section>

      <EnquiryCTA />

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? ''} description={selected?.designation} size="lg">
        {selected && (
          <div className="grid gap-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="mx-auto w-40 sm:mx-0 sm:w-full">
              <SmartImage image={{ src: selected.photo.src, alt: `Portrait of ${selected.name}` }} className="aspect-[4/5] w-full rounded-2xl object-cover object-top shadow-card" />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="navy">{roleLabel[selected.role]}</Badge>
                <DemoBadge label="Fictional profile" />
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">Profile</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{selected.bio}</p>
              {message ? (
                <>
                  <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-ink-muted">Message</h3>
                  <div className="mt-2 space-y-3 border-l-4 border-gold-400 pl-4 leading-relaxed text-ink-soft">
                    {message.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-6 rounded-xl bg-surface-alt p-4 text-sm text-ink-muted">
                  A detailed profile (qualifications, experience and responsibilities) will be published once approved by the institution. For
                  official correspondence, please{' '}
                  <Link to="/contact" className="link" onClick={() => setSelected(null)}>
                    contact the college office
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
