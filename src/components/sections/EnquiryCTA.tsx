import { CalendarDays, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { images } from '@/data/images';
import { admissionCycle } from '@/data/admissions';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';

interface EnquiryCTAProps {
  title?: string;
  description?: string;
}

/** Closing admission call-to-action band with parallax background. Place right before the footer. */
export function EnquiryCTA({
  title = 'Your future starts with a conversation',
  description = 'Talk to our admissions team about programs, eligibility, scholarships and campus life. We usually respond within one working day.',
}: EnquiryCTAProps) {
  return (
    <section aria-labelledby="enquiry-cta-heading" className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <ParallaxImage image={images.graduation} strength={18} className="absolute inset-0 -z-20" imgClassName="opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-950/95 via-royal-950/85 to-navy-900/60" aria-hidden />
      <div className="container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow eyebrow-light justify-center">
            <span className="h-px w-6 bg-gold-300" aria-hidden />
            Admissions {admissionCycle}
          </p>
          <h2 id="enquiry-cta-heading" className="mt-4 text-balance text-3xl font-extrabold text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-100">{description}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/admissions/apply" variant="gold" size="lg">
              Apply / Enquire now
            </ButtonLink>
            <ButtonLink to="/contact#visit" variant="outline-light" size="lg" icon={<CalendarDays className="h-4 w-4" aria-hidden />}>
              Book a campus visit
            </ButtonLink>
          </div>
          <p className="mt-8 inline-flex items-center gap-2 text-sm text-navy-200">
            <Phone className="h-4 w-4 text-gold-300" aria-hidden />
            Admissions helpline:{' '}
            <a href={`tel:${siteConfig.contacts.admissions.phone.replace(/\s/g, '')}`} className="font-semibold text-white hover:underline">
              {siteConfig.contacts.admissions.phone}
            </a>
            <span aria-hidden>·</span> {siteConfig.contacts.admissions.hours}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
