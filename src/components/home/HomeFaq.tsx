import { ArrowRight, Mail, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { homeFaqs } from '@/data/faqs';
import { Reveal } from '@/components/motion/Reveal';
import { FaqSection } from '@/components/sections/FaqSection';
import { ButtonLink } from '@/components/ui/Button';

/** Home FAQs with an admissions contact card alongside. */
export function HomeFaq() {
  const admissions = siteConfig.contacts.admissions;
  return (
    <FaqSection
      faqs={homeFaqs}
      id="faqs"
      eyebrow="FAQs"
      title="Questions families often ask"
      description="Quick answers about admissions, hostels, scholarships and campus visits."
      aside={
        <Reveal className="card p-6">
          <p className="font-display text-lg font-bold text-navy-950">Still have a question?</p>
          <p className="mt-1 text-sm text-ink-muted">Our admissions team is available {admissions.hours}.</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${admissions.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 font-semibold text-navy-900 hover:text-royal-700">
                <Phone className="h-4 w-4 text-royal-600" aria-hidden />
                {admissions.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${admissions.email}`} className="inline-flex items-center gap-2 break-all font-semibold text-navy-900 hover:text-royal-700">
                <Mail className="h-4 w-4 shrink-0 text-royal-600" aria-hidden />
                {admissions.email}
              </a>
            </li>
          </ul>
          <ButtonLink to="/admissions#faqs" variant="secondary" size="sm" className="mt-5" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            All admission FAQs
          </ButtonLink>
        </Reveal>
      }
    />
  );
}
