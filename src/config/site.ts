/**
 * Institution-wide configuration. Everything here is safe to ship to the browser.
 * Values marked `verified: false` are illustrative and are labelled as demo content in the UI.
 */

const env = import.meta.env;

const bool = (value: string | undefined, fallback: boolean) =>
  value === undefined || value === '' ? fallback : value === 'true';

export const siteConfig = {
  name: env.VITE_COLLEGE_NAME || 'Bapuji College Karwar',
  shortName: 'Bapuji College Karwar',
  tagline: 'Learn deeply. Lead responsibly.',
  established: 1987,
  url: (env.VITE_SITE_URL || 'https://bgvsacc.org').replace(/\/$/, ''),
  demoMode: bool(env.VITE_DEMO_MODE, true),
  apiBaseUrl: env.VITE_API_BASE_URL || '',
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || '',
  mapEmbedUrl: env.VITE_MAP_EMBED_URL || 'https://maps.google.com/maps?q=Bapuji%20Grameena%20Vikasa%20Samiti%27s%20Arts%20and%20Commerce%20College%2C%20Sadashivgad%2C%20Karwar&t=m&z=16&output=embed',
  /** Exact campus location (Google Maps listing), used for "Open in maps" / directions links. */
  geo: { latitude: 14.8580472, longitude: 74.1305092 },
  /** The college's registered name — what map services know it by. */
  mapsQuery: "Bapuji Grameena Vikasa Samiti's Arts and Commerce College, Sadashivgad, Karwar",
  portals: {
    erp: env.VITE_ERP_URL || '',
    lms: env.VITE_LMS_URL || '',
    results: env.VITE_RESULTS_URL || '',
    application: env.VITE_APPLICATION_PORTAL_URL || '',
  },
  address: {
    line1: 'NH 66, At & Post Sadashivgad, Uttara Kannada',
    city: 'Karwar',
    state: 'Karnataka',
    postalCode: '581352',
    country: 'India',
  },
  contacts: {
    main: { phone: '+91 8382 265813', email: 'bgvsacc@gmail.com' },
    admissions: { phone: '+91 8382 265813', email: 'bgvsacc@gmail.com', hours: 'Mon–Sat, 9:00 AM – 5:30 PM' },
    placements: { phone: '+91 8382 265813', email: 'bgvsacc@gmail.com' },
    examinations: { phone: '+91 8382 265813', email: 'bgvsacc@gmail.com' },
    accounts: { phone: '+91 8382 265813', email: 'bgvsacc@gmail.com' },
    alumni: { phone: '+91 8382 265813', email: 'bgvsacc@gmail.com' },
    grievance: { phone: '+91 8382 265813', email: 'bgvsacc@gmail.com' },
    antiRaggingHelpline: '1800-180-5522',
  },
  officeHours: [
    { days: 'Monday – Friday', time: '9:00 AM – 5:30 PM' },
    { days: 'Saturday', time: '9:00 AM – 1:30 PM' },
    { days: 'Sunday & public holidays', time: 'Closed' },
  ],
  // Replace with the institution's official profile URLs
  social: [
    { label: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/' },
    { label: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/' },
    { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/' },
    { label: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/' },
    { label: 'X (Twitter)', icon: 'x', url: 'https://x.com/' },
  ] as { label: string; icon: SocialIconName; url: string }[],
  /**
   * Accreditation & recognition. Only items with verified: true should be presented as credentials
   * in production; unverified items render with a "pending verification" label.
   */
  accreditations: [
    { short: 'UGC', label: 'Recognition under UGC Act 2(f) & 12(B)', verified: false },
    { short: 'NAAC', label: 'NAAC accreditation — grade to be configured', verified: false },
    { short: 'AICTE', label: 'AICTE approval for technical programs', verified: false },
    { short: 'NBA', label: 'NBA accreditation for eligible programs', verified: false },
    { short: 'NIRF', label: 'NIRF participation — rank to be configured', verified: false },
    { short: 'BCI', label: 'Bar Council of India approval (Law)', verified: false },
    { short: 'NCTE', label: 'NCTE recognition (Education)', verified: false },
  ],
  affiliation: 'Affiliated to [University name — configure]',
};

export type SiteConfig = typeof siteConfig;
export type SocialIconName = 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'x';

export const fullAddress = (() => {
  const a = siteConfig.address;
  return `${a.line1}, ${a.city}, ${a.state} ${a.postalCode}, ${a.country}`;
})();
