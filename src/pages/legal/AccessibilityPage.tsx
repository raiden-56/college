import { AlertTriangle, ArrowRight, CheckCircle2, Contrast, Keyboard, Mail, MessageSquare, MousePointerClick, Phone, ScanEye, Subtitles, Text, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { images } from '@/data/images';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { formatDate } from '@/utils/format';
import { LegalToc } from './LegalToc';

const STATEMENT_DATE = '2026-10-16';

const features = [
  { icon: Keyboard, title: 'Keyboard access', text: 'A “Skip to main content” link, logical tab order, visible focus outlines, and menus, dialogs, tabs, accordions and carousels that work with the keyboard.' },
  { icon: Zap, title: 'Reduced motion', text: 'If your device asks for reduced motion, parallax, scroll effects and animated counters are switched off and carousels do not auto-advance. Scrolling strips can be paused.' },
  { icon: ScanEye, title: 'Screen reader support', text: 'Semantic headings and landmarks, labelled form fields with clear error messages, alternative text for informative images and live announcements for search and filter results.' },
  { icon: Contrast, title: 'Colour & contrast', text: 'Text and controls are designed to meet WCAG AA contrast ratios. Information is never conveyed by colour alone.' },
  { icon: Text, title: 'Readable, resizable text', text: 'Layouts reflow on small screens without sideways scrolling, and text can be zoomed to 200% without losing content. Plain language is used wherever possible.' },
  { icon: MousePointerClick, title: 'Comfortable targets', text: 'Buttons and links have generous touch targets, and nothing requires dragging, hovering or precise pointer gestures.' },
];

const toc = [
  { id: 'commitment', label: 'Our commitment' },
  { id: 'standard', label: 'Conformance target' },
  { id: 'features', label: 'Accessibility features' },
  { id: 'media', label: 'Captions & transcripts' },
  { id: 'limitations', label: 'Known limitations' },
  { id: 'compatibility', label: 'Compatibility' },
  { id: 'feedback', label: 'Feedback & contact' },
  { id: 'assessment', label: 'How we assess' },
];

const limitations = [
  'Some older PDF documents (notices, reports and forms) may not be fully tagged for screen readers. Ask us and we will provide an accessible version.',
  'External systems — the student ERP, learning management system, results portal, application portal and payment gateway — are provided by third parties and are not covered by this statement.',
  'The embedded campus map relies on a third-party map service; the full address and directions are always given as text on the Contact page.',
  'The 360° virtual tour, once integrated, may not be fully usable with assistive technology. A described photo gallery and in-person visits are offered as alternatives.',
  'Placeholder photographs and some alternative text are temporary and will be replaced with the institution’s own images and descriptions.',
];

export default function AccessibilityPage() {
  return (
    <>
      <Seo
        title="Accessibility Statement"
        description="Crestwood College’s accessibility statement: our WCAG 2.2 AA target, the features built into this website, known limitations and how to give feedback."
      />
      <PageHero
        eyebrow="Legal"
        title="Accessibility statement"
        description="We want everyone — including people with disabilities and people using assistive technology — to be able to use this website."
        image={images.studentsOutdoor}
      >
        <p className="text-sm text-navy-200">
          Statement prepared: <time dateTime={STATEMENT_DATE}>{formatDate(STATEMENT_DATE)}</time>
        </p>
      </PageHero>

      <Section ariaLabel="Accessibility statement">
        <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <LegalToc items={toc} />

          <div className="min-w-0 max-w-3xl">
            <article className="prose-college">
              <h2 id="commitment" className="scroll-mt-28">
                Our commitment
              </h2>
              <p>
                {siteConfig.name} is committed to equal access to information for students, parents, staff, alumni and visitors. Accessibility is part of how
                this website is designed and built, not an afterthought, and we keep improving it based on feedback.
              </p>

              <h2 id="standard" className="scroll-mt-28">
                Conformance target
              </h2>
              <p>
                We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.2, Level AA</strong>, which also informs the Guidelines for
                Indian Government Websites (GIGW). We consider the website <strong>partially conformant</strong>: it is designed to meet the standard, but a
                formal independent audit has not yet been completed and some content does not yet fully conform (see known limitations).
              </p>

              <h2 id="features" className="scroll-mt-28">
                Accessibility features
              </h2>
              <p>Features built into every page include:</p>
            </article>

            <Stagger as="ul" className="my-6 grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <StaggerItem as="li" key={f.title} className="card p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-royal-50 text-royal-700">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 text-base font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{f.text}</p>
                </StaggerItem>
              ))}
            </Stagger>

            <article className="prose-college">
              <h2 id="media" className="scroll-mt-28">
                Captions &amp; transcripts
              </h2>
              <div className="my-4 flex gap-3 rounded-2xl border border-navy-100 bg-surface-alt p-5 text-sm text-ink-soft">
                <Subtitles className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" aria-hidden />
                <p className="!mb-0">Our policy is that no video is published on this website without captions and a text transcript.</p>
              </div>
              <ul>
                <li>Pre-recorded videos (for example, video testimonials and event highlights) carry accurate captions, not only automatic ones.</li>
                <li>A text transcript is published alongside each video, including relevant visual information.</li>
                <li>Videos never play automatically with sound, and media players can be operated with the keyboard.</li>
                <li>Live-streamed events will provide captions where feasible and a recording with captions afterwards.</li>
              </ul>

              <h2 id="limitations" className="scroll-mt-28">
                Known limitations
              </h2>
              <p>Despite our efforts, some content may not yet be fully accessible:</p>
            </article>

            <ul className="my-6 space-y-3">
              {limitations.map((l) => (
                <li key={l} className="flex gap-3 rounded-2xl border border-gold-200 bg-gold-50/60 p-4 text-sm text-ink-soft">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>

            <article className="prose-college">
              <h2 id="compatibility" className="scroll-mt-28">
                Compatibility
              </h2>
              <p>
                The website is designed to work with current versions of Chrome, Edge, Firefox and Safari on desktop and mobile, and with common assistive
                technologies such as NVDA, JAWS, VoiceOver and TalkBack, as well as browser zoom and Windows high-contrast settings. It is built with standard
                HTML, CSS and JavaScript (WAI-ARIA is used only where native HTML is not enough).
              </p>

              <h2 id="feedback" className="scroll-mt-28">
                Feedback &amp; contact
              </h2>
              <p>
                If you have difficulty using any part of this website, or need information in a different format (large print, accessible PDF, audio or
                Braille), please tell us. Describe the page and the problem, and the assistive technology you use if relevant. We aim to reply within 5
                working days.
              </p>
            </article>

            <div className="my-6 grid gap-4 sm:grid-cols-3">
              <div className="card flex flex-col p-5">
                <MessageSquare className="h-5 w-5 text-royal-600" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-navy-900">Feedback form</p>
                <p className="mt-1 flex-1 text-sm text-ink-muted">Choose “Suggestion” or the relevant category.</p>
                <ButtonLink to="/feedback" variant="secondary" size="sm" className="mt-4 self-start" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  Give feedback
                </ButtonLink>
              </div>
              <div className="card flex flex-col p-5">
                <Mail className="h-5 w-5 text-royal-600" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-navy-900">Email</p>
                <a href={`mailto:${siteConfig.contacts.main.email}?subject=Website%20accessibility`} className="link mt-1 break-all text-sm">
                  {siteConfig.contacts.main.email}
                </a>
              </div>
              <div className="card flex flex-col p-5">
                <Phone className="h-5 w-5 text-royal-600" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-navy-900">Phone</p>
                <a href={`tel:${siteConfig.contacts.main.phone.replace(/\s/g, '')}`} className="link mt-1 text-sm">
                  {siteConfig.contacts.main.phone}
                </a>
                <p className="mt-1 text-xs text-ink-muted">{siteConfig.officeHours[0].days}, {siteConfig.officeHours[0].time}</p>
              </div>
            </div>

            <article className="prose-college">
              <p>
                For accessibility of the campus itself — ramps, lifts, accessible restrooms, scribes and examination support — see{' '}
                <Link to="/campus">Campus facilities</Link> or contact the Equal Opportunity Cell through the <Link to="/feedback">grievance form</Link>.
              </p>

              <h2 id="assessment" className="scroll-mt-28">
                How we assess
              </h2>
              <p>
                This statement describes the accessibility features the website was designed and built with. Before launch, the institution plans a documented self-assessment (automated checks, keyboard-only and screen reader testing) followed by an independent audit, and will update this statement with the results.
              </p>
              <p className="flex items-center gap-2 text-sm text-ink-muted">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                Read our <Link to="/privacy">privacy policy</Link> or browse the <Link to="/sitemap">sitemap</Link>.
              </p>
            </article>
          </div>
        </div>
      </Section>
    </>
  );
}
