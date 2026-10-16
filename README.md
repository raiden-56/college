# Crestwood College — Website

A complete, production-grade college website built with **React 19 + Vite + TypeScript**, ready for institutional
branding and verified content. “Crestwood College of Arts, Science & Technology” is a **fictional placeholder
institution**: every person, figure, credential and document in `src/data` is demo content and is labelled as such
in the UI while `VITE_DEMO_MODE=true`.

---

## Quick start

```bash
npm install
cp .env.example .env      # adjust values (all VITE_* values are public — never put secrets here)
npm run dev               # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) then production build to `dist/` (also emits `sitemap.xml`) |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only |
| `npm run lint` | ESLint (TypeScript, React Hooks, Fast Refresh rules) |
| `npm test` | Vitest unit/component tests (`npm run test:watch` for watch mode) |

Requires Node 20+ (developed on Node 24).

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework / build | React 19, Vite 8, TypeScript 6 (strict) |
| Routing | React Router 7 (data router, lazy route-level code splitting, scroll restoration) |
| Styling | Tailwind CSS 3.4 with design tokens in `tailwind.config.ts` + component classes in `src/index.css` |
| Motion | framer-motion (scroll reveals, parallax, count-ups, layout transitions; honours `prefers-reduced-motion`) |
| Icons | lucide-react (brand/social glyphs are local SVGs in `components/ui/SocialIcon.tsx`) |
| Forms | react-hook-form + zod (+ @hookform/resolvers) |
| Charts | Recharts (placements page, lazy-loaded with that route) |
| Tests | Vitest + Testing Library + jsdom |

No UI kit is used; the design system is a small set of reusable components (below), which keeps the bundle lean and
the look distinctive.

## Environment variables (`.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Canonical origin used for canonical URLs, Open Graph, JSON-LD and `sitemap.xml` |
| `VITE_COLLEGE_NAME` | Institution name |
| `VITE_DEMO_MODE` | `true` shows “Demo data” badges/notices on illustrative content. Set `false` once content is verified |
| `VITE_API_BASE_URL` | Backend base URL for form submissions. Empty → local mock that **never** claims an official submission |
| `VITE_WHATSAPP_NUMBER` | Enables the floating WhatsApp shortcut (international format, no `+`) |
| `VITE_MAP_EMBED_URL` | Map iframe on the Contact page |
| `VITE_ERP_URL`, `VITE_LMS_URL`, `VITE_RESULTS_URL`, `VITE_APPLICATION_PORTAL_URL` | External portals. Empty → clearly labelled “integration pending” states (no fake logins) |

## Project structure

```
src/
  App.tsx, main.tsx, routes.tsx      # app shell, router (all pages lazy-loaded)
  index.css                          # Tailwind layers, component classes, focus & reduced-motion rules
  config/site.ts                     # institution profile, contacts, portals, accreditations (env-driven)
  types/index.ts                     # typed domain models (Program, Department, Faculty, Post, Event, Fee…)
  data/                              # local mock content — shape mirrors a future CMS/API
  services/api.ts                    # form submission service (backend integration point)
  hooks/                             # useUrlFilters, usePagination, useFormSubmit, useFocusTrap, useHashScroll…
  utils/                             # format, search + searchIndex, fees, schemas (zod), structuredData, icons
  layouts/RootLayout.tsx             # skip link, header, main, footer, floating actions, cookie consent
  components/
    layout/                          # Header, DesktopNav, MobileNav, SearchDialog, AnnouncementBar, Footer,
                                     # PageHero, Breadcrumbs, Seo, CookieConsent, FloatingActions, Logo
    ui/                              # Button, Badge, Section, Tabs, Accordion, Modal, Drawer, Pagination, Filters,
                                     # States (empty/error/skeleton), ResponsiveTable, DownloadLink, StatBlock, Toast…
    motion/                          # Reveal/Stagger, ParallaxImage/ParallaxLayer, CountUp, Marquee, ScrollProgress
    cards/                           # CourseCard, DepartmentCard, FacultyCard, NewsCard, EventCard, TestimonialCard
    forms/                           # Field components, Honeypot, FormSuccess, AdmissionEnquiry/CampusVisit/Newsletter forms
    sections/                        # EnquiryCTA, TestimonialCarousel, FaqSection
    <area>/                          # page-specific sections (home, programs, placements, …)
  pages/<area>/*Page.tsx             # one file per route
build/sitemapPlugin.ts               # emits sitemap.xml from the data at build time
docs/UI-CONVENTIONS.md               # how to build new pages with the design system
public/                              # favicon, robots.txt, downloads/placeholder.pdf
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home (20 sections: hero, accreditation strip, intro, stats, programs, departments, why us, principal, faculty, facilities, placements, achievements, events & news, alumni, testimonials, admission steps, scholarships, gallery/tour, FAQs, CTA) |
| `/about` | Overview, history timeline, vision/mission/values, principal & chairman messages, awards, affiliation, accreditation & IQAC, infrastructure |
| `/about/leadership` | Management, administration & governing body profiles |
| `/programs` | Course finder (level, discipline, duration, eligibility, mode, keyword; URL-synced) |
| `/programs/:slug` | Program detail: overview, outcomes, eligibility, intake, procedure, syllabus, fees, faculty, careers, placements, scholarships, brochure, FAQs, enquiry |
| `/departments`, `/departments/:slug` | Department directory and detail pages |
| `/faculty`, `/faculty/:slug` | Faculty directory (department/designation/specialisation filters) and profiles |
| `/admissions` | Admissions hub: criteria, process, dates, documents checklist, enquiry, campus visit, scholarships, prospectus, FAQs, contacts |
| `/admissions/apply` | Application portal integration point + enquiry form (`?program=` preselects) |
| `/fees` | Fee structure with course & academic-year selectors (`?program=&year=`) |
| `/campus`, `/campus/gallery`, `/campus/virtual-tour` | Facilities, filterable gallery with lightbox, virtual tour (360° integration point) |
| `/placements` | T&P cell, process, training, recruiters, year-wise charts with methodology & data tables |
| `/alumni` | Stories, consented directory with filters, events, mentorship, registration |
| `/testimonials` | Moderated, consented testimonials (carousel, filters, video/transcript support) |
| `/feedback` | Private feedback and confidential grievance routing |
| `/research` | Centres, searchable publications, projects & grants, patents, MoUs, incubation |
| `/student-corner` | Calendar, exams, results portal link, timetables, notices, handbook, welfare, anti-ragging, ERP/LMS |
| `/news`, `/news/:slug` | News & official notices (type/category/date filters, search, pagination), detail with attachments |
| `/events`, `/events/:slug` | Upcoming/past events, month calendar view, detail with .ics download |
| `/disclosures` | Searchable mandatory disclosures by category & academic year with preview/download |
| `/contact` | Contacts, department directory, hours, map, directions, contact form, campus visit request |
| `/search?q=` | Global search results grouped by type |
| `/privacy`, `/accessibility`, `/sitemap` | Policy pages and HTML sitemap |
| `*` | Custom 404 with search |

Global search (header icon, or press <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd>) covers programs, departments,
faculty, news & notices, events, downloads/disclosures, FAQs and key pages.

## Design system

- **Palette:** deep navy (`navy-*`), royal blue (`royal-*`), white, with soft sky (`sky-*`) and subtle gold (`gold-*`)
  accents. Change the tokens in `tailwind.config.ts` to re-brand.
- **Type:** Manrope (display) + Inter (body), loaded from Google Fonts in `index.html`.
- **Motion:** reveal-on-scroll, staggered grids, parallax photo bands, animated counters, a reading-progress bar,
  transparent-to-solid sticky header. All transform animations are disabled for users who prefer reduced motion
  (`<MotionConfig reducedMotion="user">` + CSS media query); carousels and marquees have pause controls.
- See `docs/UI-CONVENTIONS.md` for component APIs and page patterns.

## Content & demo data

All content lives in `src/data/*.ts`, typed by `src/types/index.ts`:

- `programs.ts` — programs, syllabi and **illustrative** fee components (`utils/fees.ts` computes totals and
  year-wise schedules; `feeAcademicYears` holds revision factors).
- `departments.ts`, `faculty.ts`, `institution.ts` (stats, leadership, milestones), `news.ts`, `events.ts`,
  `testimonials.ts`, `alumni.ts`, `placements.ts`, `facilities.ts`, `disclosures.ts`, `admissions.ts`, `faqs.ts`,
  `gallery.ts`, `research.ts`, `studentCorner.ts`.
- `images.ts` centralises photography (Unsplash stand-ins). Replace with the institution’s own optimised images.
- Files in `public/downloads/` are placeholders — upload the signed/official PDFs.

**Before launch:** replace every demo record, set `VITE_DEMO_MODE=false`, and confirm accreditation, approvals,
fees, placement statistics and disclosure requirements with the institution and its regulators. Do not publish
placement figures, recruiter names, credentials or alumni details that are not verified and consented.

`src/data/__tests__/integrity.test.ts` guards against broken references (unknown department slugs, missing HODs,
syllabus/semester mismatches) when editors change data.

## Backend integrations still required

| Area | Where it plugs in | Notes |
| --- | --- | --- |
| Form submissions (admission enquiry, campus visit, contact, feedback, grievance, alumni registration, newsletter, placement enquiry) | `src/services/api.ts` → `POST ${VITE_API_BASE_URL}/<endpoint>` | Server must re-validate (share the zod schemas in `utils/schemas.ts`), rate-limit/CAPTCHA, store, and route to email/CRM. Grievances must go to the named committee with restricted access |
| Email service | backend | Acknowledgements, routing to offices, newsletter double opt-in |
| CMS / content API | replace imports from `src/data/*` with fetchers returning the same types | News, notices, events, programs, faculty, fees, disclosures, gallery, testimonials |
| Online application portal | `VITE_APPLICATION_PORTAL_URL` | `/admissions/apply` links out when set |
| Payment gateway | backend + `/fees` payment section | Fee payment is intentionally **not** simulated |
| Student ERP / LMS / results | `VITE_ERP_URL`, `VITE_LMS_URL`, `VITE_RESULTS_URL` | No fake logins or result lookups are implemented |
| Authentication & admin | future `/admin` app (see below) | |
| 360° tour / video | `/campus/virtual-tour` integration panel | Provide captions and transcripts for all video |
| Maps | `VITE_MAP_EMBED_URL` | |
| Analytics | load only when cookie consent `analytics === true` (`components/layout/CookieConsent.tsx`) | |

## Future admin dashboard

The public site is deliberately separated from administration:

- Public components never contain write logic; data enters through `src/data` (later a content API) and leaves only
  through `services/api.ts`.
- Build the admin as a **separate route tree/app** (e.g. `/admin/*` with its own layout and lazy chunk, or a separate
  deployment) managing: college profile & homepage content, courses & departments, faculty, fee structures, admission
  enquiries, news & notices, events & galleries, testimonial/feedback moderation, placement statistics, alumni stories
  and disclosure documents.
- Use server-side authentication, **role-based access control** (e.g. admissions officer, content editor, IQAC,
  grievance committee) and server-side authorisation on every endpoint. Never ship credentials or privileged keys in
  the frontend bundle — every `VITE_*` value is public.

## SEO & performance

- Unique `<title>`, meta description, canonical URL, Open Graph/Twitter tags per page (`components/layout/Seo.tsx`;
  React 19 hoists them into `<head>`), JSON-LD (`CollegeOrUniversity`, `BreadcrumbList`, `Course`, `NewsArticle`,
  `Event`, `FAQPage`), `robots.txt` and a generated `sitemap.xml`.
- Route-level code splitting, vendor chunking (React, motion, forms, charts), lazy-loaded images with fallbacks,
  preconnects for fonts/images, skeletons while chunks load.
- **Production SEO:** this is a client-rendered SPA. For best indexing, prerender the routes listed in `sitemap.xml`
  (e.g. migrate to React Router framework mode with `prerender`, or use a static prerender step in CI) so crawlers
  receive full HTML. Serve images from a CDN in AVIF/WebP with `srcset`.
- **Hosting:** configure an SPA fallback so unknown paths serve `index.html` (`public/_redirects` is included for
  Netlify-style hosts; use the equivalent rewrite on Vercel, Nginx, S3/CloudFront, etc.).

## Accessibility (target: WCAG 2.2 AA)

Skip link; semantic landmarks and heading order (one `<h1>` per page); visible focus rings; disclosure-pattern
navigation menus; accessible dialogs (focus trap, Escape, labelled); WAI-ARIA tabs, accordions, carousel and combobox
search; labelled form fields with inline, announced errors; pause controls for moving content; reduced-motion
support; alt text for meaningful images; tables with captions and mobile alternatives; chart data tables.

Recommended checks before launch: keyboard-only walkthrough of key journeys (find a program → fees → enquiry; read a
notice; submit feedback), screen reader spot checks (NVDA/VoiceOver), and automated audits with axe DevTools or
Lighthouse on every route.

## Testing

`npm test` runs unit tests for formatting, search ranking, fee calculations, pagination, zod schemas, the form
service’s spam guards and honest mock mode, data integrity, `usePagination`, and keyboard behaviour of `Tabs` and
`Accordion`. Add component tests alongside new reusable components (`__tests__/` folders).
