import { Cookie, Mail, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig, fullAddress } from '@/config/site';
import { images } from '@/data/images';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { openCookiePreferences } from '@/components/layout/cookieEvents';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
import { Section } from '@/components/ui/Section';
import { formatDate } from '@/utils/format';
import { LegalToc } from './LegalToc';

const LAST_UPDATED = '2026-10-16';

interface FormRecord {
  form: string;
  where: { label: string; to?: string };
  data: string;
  purpose: string;
  retention: string;
}

/** Proposed retention periods — to be confirmed by the institution's records policy. */
const formRecords: FormRecord[] = [
  {
    form: 'Admission enquiry',
    where: { label: 'Apply / Enquire', to: '/admissions/apply' },
    data: 'Name, email, mobile number, preferred program, highest qualification, optional message, consent confirmation',
    purpose: 'Responding to your enquiry and admission counselling',
    retention: '24 months after the admission cycle closes, unless you enrol',
  },
  {
    form: 'Campus visit booking',
    where: { label: 'Contact', to: '/contact' },
    data: 'Name, email, mobile number, preferred date, number of visitors, area of interest',
    purpose: 'Scheduling and hosting your visit',
    retention: '12 months after the visit date',
  },
  {
    form: 'Contact message',
    where: { label: 'Contact', to: '/contact' },
    data: 'Name, email, optional mobile number, office addressed, subject, message',
    purpose: 'Routing and answering your message',
    retention: '24 months after the conversation ends',
  },
  {
    form: 'Feedback',
    where: { label: 'Feedback', to: '/feedback' },
    data: 'Respondent type, category, rating, comments, optional name and email, permission to publish',
    purpose: 'Improving services; publishing a comment only if you allowed it',
    retention: '36 months; aggregated statistics may be kept longer without names',
  },
  {
    form: 'Grievance',
    where: { label: 'Feedback & grievance', to: '/feedback' },
    data: 'Name, email, mobile number, role, office concerned, description, confidentiality preference',
    purpose: 'Investigating and resolving the grievance through the appropriate committee',
    retention: 'As required by applicable regulations and the grievance redressal policy',
  },
  {
    form: 'Alumni registration',
    where: { label: 'Alumni', to: '/alumni' },
    data: 'Name, email, mobile number, graduation year, program, organisation, role, mentoring interest, directory consent',
    purpose: 'Alumni communication, mentoring and (only with consent) the public directory',
    retention: 'Until you ask us to remove it',
  },
  {
    form: 'Newsletter',
    where: { label: 'Website footer (every page)' },
    data: 'Email address',
    purpose: 'Sending college news you asked for',
    retention: 'Until you unsubscribe',
  },
];

const toc = [
  { id: 'scope', label: 'Scope of this policy' },
  { id: 'collect', label: 'Information we collect' },
  { id: 'use', label: 'How we use information' },
  { id: 'retention', label: 'How long we keep it' },
  { id: 'sharing', label: 'Sharing & third parties' },
  { id: 'cookies', label: 'Cookies & local storage' },
  { id: 'security', label: 'Security' },
  { id: 'rights', label: 'Your choices & rights' },
  { id: 'children', label: 'Applicants under 18' },
  { id: 'contact', label: 'Contact for data requests' },
  { id: 'changes', label: 'Changes to this policy' },
];

export default function PrivacyPage() {
  const mockMode = !siteConfig.apiBaseUrl;

  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Bapuji College Karwar collects, uses, stores and protects personal information submitted through this website, including cookies and your choices."
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        description="What we collect through this website, why we collect it, how long we keep it and how you can control it."
        image={images.libraryReading}
      >
        <p className="text-sm text-navy-200">
          Last updated: <time dateTime={LAST_UPDATED}>{formatDate(LAST_UPDATED)}</time>
        </p>
      </PageHero>

      <Section ariaLabel="Privacy policy">
        <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <LegalToc items={toc} />

          <div className="min-w-0 max-w-3xl">
            <Reveal className="mb-10 flex gap-3 rounded-2xl border border-gold-200 bg-gold-50/70 p-5 text-sm text-gold-900" role="note">
              <Scale className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden />
              <p>
                <strong className="font-semibold">Draft for legal review.</strong> This policy describes how this website is built to handle personal data.
                It must be reviewed and approved by the institution’s legal team and data protection contact before publication, including alignment
                with the Digital Personal Data Protection Act, 2023 and any rules made under it.
              </p>
            </Reveal>

            <article className="prose-college">
              <h2 id="scope" className="scroll-mt-28">
                Scope of this policy
              </h2>
              <p>
                This policy applies to the public website of {siteConfig.name} (“the college”, “we”), {fullAddress}. It covers information you submit through
                forms on this website and information stored in your browser while you use it. Separate notices apply to the student ERP, learning management
                system, results portal and online application portal, which are operated as distinct systems.
              </p>

              <h2 id="collect" className="scroll-mt-28">
                Information we collect
              </h2>
              <p>
                We only collect what you choose to submit. You can browse every page of this website without giving us any personal information. The table
                below lists each form, the information it asks for, why, and the proposed retention period.
              </p>
            </article>

            <ResponsiveTable<FormRecord>
              className="my-6"
              caption="Personal information collected by website forms"
              stackOnMobile
              rows={formRecords}
              rowKey={(r) => r.form}
              columns={[
                { key: 'form', header: 'Form', cell: (r) => r.form },
                {
                  key: 'where',
                  header: 'Where',
                  cell: (r) =>
                    r.where.to ? (
                      <Link to={r.where.to} className="link">
                        {r.where.label}
                      </Link>
                    ) : (
                      r.where.label
                    ),
                },
                { key: 'data', header: 'Information', cell: (r) => r.data },
                { key: 'purpose', header: 'Purpose', cell: (r) => r.purpose },
                { key: 'retention', header: 'Retention (proposed)', cell: (r) => r.retention },
              ]}
            />

            <article className="prose-college">
              <p>
                To block automated spam, forms include a hidden field that people never see and check how quickly the form was completed. These checks run
                in your browser and are not stored.
              </p>
              {mockMode && (
                <p>
                  <strong>Current status:</strong> this website is running in preview mode. Form entries are checked in your browser but are{' '}
                  <strong>not sent to the college or stored anywhere</strong>. Please call or email the relevant office for anything urgent.
                </p>
              )}

              <h2 id="use" className="scroll-mt-28">
                How we use information
              </h2>
              <ul>
                <li>To answer your enquiry, arrange visits and provide admission counselling.</li>
                <li>To handle feedback and grievances through the appropriate committee or office.</li>
                <li>To keep in touch with alumni and subscribers who asked to hear from us.</li>
                <li>To meet legal and regulatory obligations, and to keep the website secure.</li>
              </ul>
              <p>
                We do not sell personal information, and we do not use it for automated decisions that affect admission. Admission decisions follow the
                published process and applicable regulations.
              </p>

              <h2 id="retention" className="scroll-mt-28">
                How long we keep it
              </h2>
              <p>
                We keep information only as long as needed for the purpose it was collected, or longer where the law requires it. The periods in the table
                above are proposals that will be confirmed in the college’s records retention schedule. When a period ends, records are deleted or anonymised.
              </p>

              <h2 id="sharing" className="scroll-mt-28">
                Sharing &amp; third parties
              </h2>
              <p>Information is shared only with staff who need it to respond, and with service providers who process it on our instructions, such as:</p>
              <ul>
                <li>website hosting and form-processing providers;</li>
                <li>email or CRM tools used by the admissions office;</li>
                <li>the affiliating university or regulators, where the law requires it.</li>
              </ul>
              <p>
                Some pages load content directly from other services: photographs from <strong>images.unsplash.com</strong>, web fonts from{' '}
                <strong>Google Fonts</strong>, and the campus map from <strong>OpenStreetMap</strong>. Like any website request, these services receive your
                IP address and browser details. Links to social media open those sites, which have their own privacy policies.
              </p>

              <h2 id="cookies" className="scroll-mt-28">
                Cookies &amp; local storage
              </h2>
              <p>
                We use your browser’s local storage for a small number of essential preferences. Nothing is used for advertising, and no analytics or
                marketing scripts are loaded unless you allow them.
              </p>
              <ul>
                <li>
                  <strong>Essential:</strong> your cookie choices and the time you made them (key <code>bapuji-cookie-consent-v1</code>), and conveniences
                  you set yourself, such as a ticked document checklist. These stay on your device.
                </li>
                <li>
                  <strong>Analytics (optional, off by default):</strong> would help us understand which pages are useful, using anonymous statistics.
                </li>
                <li>
                  <strong>Marketing (optional, off by default):</strong> would measure admission campaigns.
                </li>
              </ul>
              <p>You can change your choices at any time. Clearing your browser’s site data also removes everything stored by this website.</p>
            </article>

            <div className="my-6 flex flex-col gap-4 rounded-2xl border border-navy-100 bg-surface-alt p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-3 text-sm font-medium text-navy-900">
                <Cookie className="h-5 w-5 shrink-0 text-gold-600" aria-hidden />
                Review or change which optional cookies are allowed.
              </p>
              <Button variant="secondary" size="sm" onClick={openCookiePreferences}>
                Cookie preferences
              </Button>
            </div>

            <article className="prose-college">
              <h2 id="security" className="scroll-mt-28">
                Security
              </h2>
              <p>
                The website is served over HTTPS. Form data is validated again on the server, access to records is limited to authorised staff, and
                providers are required to protect information appropriately. No system is perfectly secure; if we become aware of a breach affecting your
                data, we will notify you and the authorities as the law requires.
              </p>

              <h2 id="rights" className="scroll-mt-28">
                Your choices &amp; rights
              </h2>
              <p>Subject to applicable law, you can ask us to:</p>
              <ul>
                <li>tell you what personal information we hold about you and how it is used;</li>
                <li>correct, complete or update it;</li>
                <li>erase it when it is no longer needed, or withdraw consent you gave (for example, the alumni directory or newsletter);</li>
                <li>nominate another person to exercise these rights on your behalf;</li>
                <li>raise a grievance about how your data has been handled.</li>
              </ul>
              <p>Withdrawing consent does not affect processing that already took place, and some records must be kept to meet legal obligations.</p>

              <h2 id="children" className="scroll-mt-28">
                Applicants under 18
              </h2>
              <p>
                Many applicants are under 18. If you are, please ask a parent or guardian to submit the enquiry with you, or to confirm their consent when the
                admissions team contacts you. We do not knowingly use children’s data for tracking or targeted advertising.
              </p>

              <h2 id="contact" className="scroll-mt-28">
                Contact for data requests
              </h2>
              <p>
                Send privacy questions and data requests to the college office. Please say which form you used and roughly when, so we can find your record.
                We aim to acknowledge requests within 7 working days. A designated data protection contact will be named here once appointed.
              </p>
            </article>

            <ul className="my-6 grid gap-3 sm:grid-cols-2">
              <li className="card p-5">
                <p className="text-sm font-semibold text-navy-900">General &amp; data requests</p>
                <a href={`mailto:${siteConfig.contacts.main.email}?subject=Data%20request`} className="link mt-1 inline-flex items-center gap-2 break-all text-sm">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {siteConfig.contacts.main.email}
                </a>
                <p className="mt-1 text-sm text-ink-muted">{siteConfig.contacts.main.phone}</p>
              </li>
              <li className="card p-5">
                <p className="text-sm font-semibold text-navy-900">Grievance redressal</p>
                <a href={`mailto:${siteConfig.contacts.grievance.email}`} className="link mt-1 inline-flex items-center gap-2 break-all text-sm">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {siteConfig.contacts.grievance.email}
                </a>
                <p className="mt-1 text-sm text-ink-muted">
                  or use the{' '}
                  <Link to="/feedback" className="link">
                    grievance form
                  </Link>
                </p>
              </li>
            </ul>

            <article className="prose-college">
              <h2 id="changes" className="scroll-mt-28">
                Changes to this policy
              </h2>
              <p>
                We will update this page when our practices change and show the date of the latest revision at the top. Significant changes will also be
                announced under{' '}
                <Link to="/news">News &amp; Notices</Link>. See also our <Link to="/accessibility">accessibility statement</Link>.
              </p>
            </article>
          </div>
        </div>
      </Section>
    </>
  );
}
