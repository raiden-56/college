# UI conventions (for everyone building pages)

Project root: `C:\practise-folder\college` — React 19 + Vite 8 + TypeScript 6, React Router 7, Tailwind CSS 3.4,
framer-motion 14, lucide-react 1.x (**no brand icons** — use `components/ui/SocialIcon`), react-hook-form 7 + zod 4 +
@hookform/resolvers 5, recharts 3. Path alias `@/` → `src/`. **Do not add dependencies.**

## Page skeleton

Every page is a default-exported component in `src/pages/<area>/<Name>Page.tsx` and starts with:

```tsx
<Seo title="Fee Structure" description="…unique 150-char description…" jsonLd={optional} />
<PageHero eyebrow="Admissions" title="Fee structure" description="…" image={images.xyz} actions={<ButtonLink …/>} aside={optional} />
```

- `PageHero` renders the page's only `<h1>`, breadcrumbs (auto from URL; pass `crumbLabel` for slugs) and clears the fixed header.
  The Home page is the only exception (it has its own full-screen hero, which must include `pt-36`+ to clear the header).
- Then a sequence of `<Section tone="white|alt|navy|sunken" id="…" labelledBy="…-heading">` blocks, each opened with
  `<SectionHeading id="…-heading" eyebrow="…" title="…" description="…" />`. Alternate tones for rhythm; use `navy` sparingly
  (it sets `on-dark`, use `light` props on children). Heading levels must not skip (h1 → h2 → h3).
- Close conversion-oriented pages with `<EnquiryCTA />` (components/sections).
- Unknown slug on a detail page → `return <NotFoundPage />` (import default from `@/pages/NotFoundPage`).

## Available building blocks (read the file for full props)

| Import | What |
| --- | --- |
| `@/components/layout/Seo` | `Seo` title/description/canonical/OG/JSON-LD |
| `@/components/layout/PageHero` | inner-page hero |
| `@/components/layout/Breadcrumbs` | `Breadcrumbs`, `useAutoCrumbs` |
| `@/components/ui/Section` | `Section`, `SectionHeading` |
| `@/components/ui/Button` | `Button` (loading, icon, iconRight), `ButtonLink` (router), `ExternalButtonLink` (href/download) |
| `@/components/ui/buttonClasses` | `buttonClasses({variant,size})` for plain `<a>` |
| `@/components/ui/Badge` | `Badge` tones navy/royal/sky/gold/green/red/slate/white |
| `@/components/ui/DemoBadge` | `DemoBadge` (inline "Demo data"), `DemoNotice` (callout) — only render in demo mode |
| `@/components/ui/SmartImage` | lazy image w/ fallback; `image={ImageAsset}`, `decorative`, `priority` |
| `@/components/ui/Tabs` | controlled accessible tabs `{tabs,value,onChange,label,variant:'pill'|'underline'}` |
| `@/components/ui/Accordion` | `{items:[{id,title,content}],multiple,defaultOpen,headingLevel}` |
| `@/components/ui/Modal`, `Drawer` | accessible dialogs |
| `@/components/ui/Pagination` | `{page,pageCount,onPageChange,scrollTargetId}` |
| `@/components/ui/Filters` | `SearchInput`, `FilterSelect` (allLabel → value 'all'), `FilterChips`, `ResultsSummary` |
| `@/components/ui/States` | `EmptyState`, `ErrorState`, `Skeleton`, `CardSkeleton`, `PageSkeleton` |
| `@/components/ui/ResponsiveTable` | semantic table, `stackOnMobile`, caption required |
| `@/components/ui/DownloadLink` | file row with download/preview |
| `@/components/ui/StatBlock` | animated stat w/ demo badge |
| `@/components/ui/toast-context` | `useToast()` |
| `@/components/motion/Reveal` | `Reveal` (direction, delay), `Stagger` + `StaggerItem` |
| `@/components/motion/Parallax` | `ParallaxImage`, `ParallaxLayer` |
| `@/components/motion/CountUp`, `Marquee` | animated number, pausable scrolling strip |
| `@/components/cards/*` | `CourseCard`, `DepartmentCard`, `FacultyCard`, `NewsCard` (card/list), `EventCard` (card/row), `TestimonialCard`, `Rating` |
| `@/components/sections/*` | `EnquiryCTA`, `TestimonialCarousel`, `FaqSection` |
| `@/components/forms/*` | `TextField`, `TextAreaField`, `SelectField`, `CheckboxField`, `RatingField`, `Honeypot`; `FormSuccess`, `FormError`, `FormFootnote`; `AdmissionEnquiryForm`, `CampusVisitForm`, `NewsletterForm` |
| `@/hooks/*` | `useUrlFilters`, `usePagination`, `useDebounce`, `useDisclosure`, `useFormSubmit`, `useMediaQuery`, `useLocalStorage` |
| `@/utils/*` | `cn`, `format` (formatINR, formatDate, formatDateRange, dateParts, formatDuration…), `search` (matchesQuery), `searchIndex` (searchSite, groupResults), `searchIcons`, `fees` (feeAcademicYears, feesForYear, computeFeeTotals, yearWiseSchedule), `schemas` (zod), `icons` (getIcon by name), `structuredData` |
| `@/data/*` | programs, departments, faculty, news, events, testimonials, faqs, facilities, institution, placements, alumni, disclosures, admissions, images (`images`, `portraits`, `unsplash()`), navigation, announcements |
| `@/config/site` | `siteConfig` (contacts, address, portals, demoMode, social…), `fullAddress` |

## Patterns

- **Filterable lists**: `useUrlFilters({ q: '', level: 'all' })` → filter with `matchesQuery` → `usePagination(filtered, 9)` →
  `ResultsSummary` (+ reset) → grid → `Pagination` → `EmptyState` when 0 results. Filters must really work.
- **Forms**: follow `components/forms/AdmissionEnquiryForm.tsx` exactly: `useForm<XInput>({ resolver: zodResolver(xSchema), defaultValues, mode: 'onTouched' })`,
  `useFormSubmit('<endpoint>')`, `<Honeypot ref={honeypotRef} name="website" />`, show `FormSuccess` on success. Never claim an official
  submission — `FormSuccess` already handles mock mode honestly.
- **Motion**: `Reveal`/`Stagger` for entrances, `ParallaxImage` for photographic bands, `card-hover` class for lift. Tasteful, not on every element.
  framer-motion respects reduced motion app-wide.
- **Honesty**: never invent real credentials, rankings, company names or placement figures; anything illustrative gets `DemoBadge`/`DemoNotice`.
  External systems (ERP, LMS, results, payment, 360° tour) are shown as clearly labelled integration points (check `siteConfig.portals.*`; when empty show "integration pending" — never a fake login).
- **No dead controls**: every link goes to a real route/anchor/file; every button does something.
- **A11y**: labelled inputs, alt text (or `decorative`), `aria-current`, keyboard support, visible focus (global), lists as `<ul>`, tables via `ResponsiveTable`.
- **Responsive**: mobile-first; check 360px wide layouts (no horizontal scroll), grids collapse, tables stack/scroll.
- **Styling**: Tailwind only, using tokens (navy/royal/gold/sky, `card`, `btn-*`, `eyebrow`, `chip`, `field-*`, `prose-college`, `table-base`). No inline hex colors.
