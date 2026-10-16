import type { FAQ } from '@/types';
import { Accordion } from '@/components/ui/Accordion';
import { Section, SectionHeading } from '@/components/ui/Section';
import { faqLd } from '@/utils/structuredData';
import type { ReactNode } from 'react';

interface FaqSectionProps {
  faqs: FAQ[];
  title?: string;
  eyebrow?: string;
  description?: ReactNode;
  id?: string;
  tone?: 'white' | 'alt';
  /** Content beside the accordion on large screens (contact card, illustration) */
  aside?: ReactNode;
}

/** FAQ block with accordion and FAQPage structured data. */
export function FaqSection({ faqs, title = 'Frequently asked questions', eyebrow = 'FAQs', description, id = 'faqs', tone = 'white', aside }: FaqSectionProps) {
  return (
    <Section id={id} tone={tone} labelledBy={`${id}-heading`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faqs)) }} />
      <div className={aside ? 'grid gap-12 lg:grid-cols-[1fr_1.6fr]' : 'mx-auto max-w-3xl'}>
        <div>
          <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} description={description} align={aside ? 'left' : 'center'} className={aside ? 'mb-8' : undefined} />
          {aside}
        </div>
        <Accordion items={faqs.map((f, i) => ({ id: String(i), title: f.question, content: <p className="leading-relaxed">{f.answer}</p> }))} defaultOpen={['0']} />
      </div>
    </Section>
  );
}
