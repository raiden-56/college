import { siteConfig } from '@/config/site';
import type { CollegeEvent, Post, Program } from '@/types';

/** schema.org builders for JSON-LD. Validate with Google's Rich Results Test after deployment. */

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollegeOrUniversity',
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteConfig.url,
  logo: `${siteConfig.url}/favicon.svg`,
  foundingDate: String(siteConfig.established),
  email: siteConfig.contacts.main.email,
  telephone: siteConfig.contacts.main.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address.line1,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.postalCode,
    addressCountry: 'IN',
  },
  sameAs: siteConfig.social.map((s) => s.url),
});

export const breadcrumbLd = (items: { label: string; to?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    ...(item.to ? { item: `${siteConfig.url}${item.to}` } : {}),
  })),
});

export const courseLd = (p: Program) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: p.name,
  description: p.summary,
  url: `${siteConfig.url}/programs/${p.slug}`,
  provider: { '@type': 'CollegeOrUniversity', name: siteConfig.name, sameAs: siteConfig.url },
  educationalCredentialAwarded: p.shortName,
  timeRequired: `P${Math.round(p.durationYears * 12)}M`,
});

export const articleLd = (post: Post) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: post.title,
  datePublished: post.date,
  image: [post.image.src],
  description: post.excerpt,
  publisher: { '@type': 'CollegeOrUniversity', name: siteConfig.name },
});

export const eventLd = (e: CollegeEvent) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: e.title,
  startDate: e.startDate,
  ...(e.endDate ? { endDate: e.endDate } : {}),
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: { '@type': 'Place', name: e.venue, address: `${siteConfig.address.line1}, ${siteConfig.address.city}` },
  image: [e.image.src],
  description: e.summary,
  organizer: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
});

export const faqLd = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
});
