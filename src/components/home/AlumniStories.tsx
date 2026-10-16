import { ArrowRight, Briefcase } from 'lucide-react';
import { alumni } from '@/data/alumni';
import { getDepartment } from '@/data/departments';
import { siteConfig } from '@/config/site';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { HorizontalScroller } from './HorizontalScroller';

/** Alumni success stories (only alumni who consented to be listed) in a horizontal scroller. */
export function AlumniStories() {
  const stories = alumni.filter((a) => a.directoryConsent);
  if (stories.length === 0) return null;

  return (
    <Section id="alumni" tone="alt" labelledBy="alumni-heading" size="lg" className="overflow-hidden">
      <SectionHeading
        id="alumni-heading"
        eyebrow="Alumni success stories"
        title="Where a Crestwood education can lead"
        description={
          <>
            Engineers, founders, advocates, scientists and public servants — our alumni keep coming back to mentor the next generation.
            {siteConfig.demoMode && (
              <>
                {' '}
                <DemoBadge label="Fictional demo profiles" />
              </>
            )}
          </>
        }
        action={
          <ButtonLink to="/alumni" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Alumni network
          </ButtonLink>
        }
        className="!mb-4"
      />
      <Reveal>
        <HorizontalScroller label="Alumni stories">
          {stories.map((a) => (
            <li key={a.id} className="w-[18.5rem] shrink-0 snap-start sm:w-[22rem]">
              <article className="card card-hover flex h-full flex-col p-6">
                <div className="flex items-center gap-4">
                  <SmartImage image={a.photo} decorative className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top" />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-snug">{a.name}</h3>
                    <p className="text-sm font-medium text-royal-700">
                      {a.program} · Class of {a.batch}
                    </p>
                  </div>
                </div>
                <p className="mt-5 flex gap-2 text-sm font-semibold text-navy-900">
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                  <span>
                    {a.role}, <span className="font-medium text-ink-muted">{a.organization}</span>
                  </span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{a.story}</p>
                <p className="mt-auto flex flex-wrap gap-2 pt-5 text-xs font-semibold">
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-800">{a.industry}</span>
                  {getDepartment(a.departmentSlug) && (
                    <span className="rounded-full bg-navy-50 px-2.5 py-1 text-navy-700">{getDepartment(a.departmentSlug)?.shortName}</span>
                  )}
                </p>
              </article>
            </li>
          ))}
        </HorizontalScroller>
      </Reveal>
    </Section>
  );
}
