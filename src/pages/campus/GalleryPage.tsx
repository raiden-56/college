import { motion } from 'framer-motion';
import { Camera, Compass, Expand, ImageOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { FilterChips, ResultsSummary } from '@/components/ui/Filters';
import { EmptyState } from '@/components/ui/States';
import { Button, ButtonLink } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { DemoNotice } from '@/components/ui/DemoBadge';
import { Reveal } from '@/components/motion/Reveal';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { Lightbox } from '@/components/campus/Lightbox';
import { galleryCategories, galleryItems, type GalleryItem } from '@/data/gallery';
import { collegePhotos } from '@/data/images';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { cn } from '@/utils/cn';

const shapeClasses: Record<NonNullable<GalleryItem['shape']> | 'default', string> = {
  tall: 'sm:row-span-2',
  wide: 'lg:col-span-2',
  default: '',
};

export default function GalleryPage() {
  const [filters, setFilter, resetFilters, activeCount] = useUrlFilters({ category: 'all' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Unknown categories in the URL fall back to "all" rather than showing an empty page.
  const category = (galleryCategories as string[]).includes(filters.category) ? filters.category : 'all';
  const filtered = useMemo(() => (category === 'all' ? galleryItems : galleryItems.filter((g) => g.category === category)), [category]);

  const options = [
    { value: 'all', label: 'All photos', count: galleryItems.length },
    ...galleryCategories.map((c) => ({ value: c, label: c, count: galleryItems.filter((g) => g.category === c).length })),
  ];

  return (
    <>
      <Seo
        title="Photo Gallery"
        description="Browse photos of Bapuji College Karwar — campus, academics, events, sports, student life and hostels. Filter by category and view full-screen with captions."
      />
      <PageHero
        eyebrow="Campus"
        title="Photo gallery"
        description="A look at everyday life on campus — classrooms and labs, festivals and convocation, the sports grounds and the hostels students call home."
        image={collegePhotos.function}
        actions={
          <ButtonLink to="/campus/virtual-tour" variant="gold" icon={<Compass className="h-4 w-4" aria-hidden />}>
            Take the virtual tour
          </ButtonLink>
        }
      />

      <Section tone="alt" id="gallery" labelledBy="gallery-heading">
        <SectionHeading
          id="gallery-heading"
          eyebrow="Browse"
          title="Moments from campus"
          description="Choose a category to narrow the collection. Select any photo to open it full-screen; use the arrow keys or buttons to move between photos."
        />

        <div className="space-y-4">
          <FilterChips label="Filter photos by category" value={category} onChange={(v) => setFilter('category', v)} options={options} />
          <ResultsSummary id="gallery-results" start={filtered.length ? 1 : 0} end={filtered.length} total={filtered.length} noun="photos" onReset={resetFilters} activeFilters={activeCount} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            className="mt-8"
            icon={<ImageOff className="h-7 w-7" aria-hidden />}
            title="No photos in this category yet"
            description="Try another category, or view the full collection."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                Show all photos
              </Button>
            }
          />
        ) : (
          <ul className="mt-8 grid auto-rows-[220px] grid-cols-1 gap-4 sm:auto-rows-[200px] sm:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-3 xl:grid-cols-4" aria-label="Gallery photos">
            {filtered.map((item, i) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={cn('relative', shapeClasses[item.shape ?? 'default'])}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl bg-navy-100 text-left shadow-card"
                  aria-label={`Open photo ${i + 1} of ${filtered.length}: ${item.caption}`}
                >
                  <SmartImage image={item.image} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus-visible:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                  <span className="absolute right-3 top-3 grid h-9 w-9 scale-90 place-items-center rounded-full bg-white/90 text-navy-900 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden>
                    <Expand className="h-4 w-4" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-4" aria-hidden>
                    <span className="mb-1.5 inline-block rounded-full bg-gold-400 px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-navy-950">{item.category}</span>
                    <span className="line-clamp-2 block text-sm font-medium leading-snug text-white transition-transform duration-300 group-hover:-translate-y-0.5">{item.caption}</span>
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        )}

        <DemoNotice className="mt-10" title="About these photographs">
          Images in this gallery are royalty-free stock photographs used as placeholders. They will be replaced with the college’s own photography, published with the consent of the people pictured.
        </DemoNotice>
      </Section>

      <Section tone="white" id="more" labelledBy="more-heading" size="sm">
        <Reveal className="card flex flex-col items-start gap-6 overflow-hidden p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-700">
              <Camera className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 id="more-heading" className="text-xl font-bold sm:text-2xl">
                See it for yourself
              </h2>
              <p className="mt-1 max-w-xl text-ink-muted">Photos only tell part of the story. Walk through the campus virtually, explore our facilities, or book a guided visit.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/campus" variant="secondary">
              Facilities
            </ButtonLink>
            <ButtonLink to="/contact#visit" variant="primary">
              Book a campus visit
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <Lightbox items={filtered} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      <EnquiryCTA />
    </>
  );
}
