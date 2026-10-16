import { ArrowRight } from 'lucide-react';
import { departments } from '@/data/departments';
import { DepartmentCard } from '@/components/cards/DepartmentCard';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';

/** Browse-by-department: sticky intro column beside a grid of compact department tiles. */
export function DepartmentsBrowse() {
  return (
    <Section id="departments" tone="alt" labelledBy="departments-heading" size="lg">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="departments-heading"
            eyebrow="Browse by department"
            title={`${departments.length} departments, one connected campus`}
            description="Each department brings its own labs, research groups and industry partners — and students are free to take electives across them."
            className="!mb-8"
          />
          <ButtonLink to="/departments" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            All departments
          </ButtonLink>
        </div>
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2" stagger={0.06}>
          {departments.map((d) => (
            <StaggerItem as="li" key={d.slug}>
              <DepartmentCard department={d} variant="compact" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
