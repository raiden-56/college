import { useLocation } from 'react-router-dom';
import { siteConfig } from '@/config/site';
import { images } from '@/data/images';

interface SeoProps {
  /** Page title without the site name (appended automatically) */
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  /** Exclude from search engines (search results, utility pages) */
  noindex?: boolean;
  /** Optional structured data object(s) rendered as JSON-LD */
  jsonLd?: object | object[];
}

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head> automatically.
 * NOTE: for production SEO, prerender routes (see README) so crawlers receive this markup in the HTML.
 */
export function Seo({ title, description, image = images.heroCampus.src, type = 'website', noindex, jsonLd }: SeoProps) {
  const { pathname } = useLocation();
  const fullTitle = pathname === '/' ? `${siteConfig.name} | ${siteConfig.tagline}` : `${title} | ${siteConfig.shortName}`;
  const canonical = `${siteConfig.url}${pathname === '/' ? '' : pathname}`;
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  // Social cards need an absolute URL; local images (e.g. /images/...) are served from the site.
  const absoluteImage = image.startsWith('/') ? `${siteConfig.url}${image}` : image;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}
    </>
  );
}
