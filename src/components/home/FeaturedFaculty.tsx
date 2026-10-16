import { ArrowRight } from 'lucide-react';
import { faculty } from '@/data/faculty';
import { siteConfig } from '@/config/site';
import { FacultyCard } from '@/components/cards/FacultyCard';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Section, SectionHeading } from '@/components/ui/Section';
import { HorizontalScroller } from './HorizontalScroller';

/** Featured faculty in a snap-scrolling row. */
export function FeaturedFaculty() {
  const featured = faculty.filter((f) => f.featured);
  if (featured.length === 0) return null;

  return (
    <Section id="faculty" labelledBy="faculty-heading" size="lg" className="overflow-hidden">
      <SectionHeading
        id="faculty-heading"
        eyebrow="Our faculty"
        title="Learn from mentors who practise what they teach"
        description={
          <>
            Researchers, practitioners and award-winning teachers who stay closely involved with every student’s progress.
            {siteConfig.demoMode && (
              <>
                {' '}
                <DemoBadge label="Demo profiles" />
              </>
            )}
          </>
        }
        action={
          <ButtonLink to="/faculty" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Faculty directory
          </ButtonLink>
        }
        className="!mb-4"
      />
      <Reveal>
        <HorizontalScroller label="Featured faculty">
          {featured.map((f) => (
            <li key={f.slug} className="w-[16.5rem] shrink-0 snap-start sm:w-[18rem]">
              <FacultyCard faculty={f} compact />
            </li>
          ))}
        </HorizontalScroller>
      </Reveal>
    </Section>
  );
}
