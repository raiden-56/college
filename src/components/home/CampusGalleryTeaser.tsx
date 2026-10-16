import { CalendarDays, Compass, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ImageAsset } from '@/types';
import { collegePhotos } from '@/data/images';
import { ParallaxLayer } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';

const columns: { offset: number; className?: string; items: { image: ImageAsset; aspect: string }[] }[] = [
  { offset: 30, items: [{ image: collegePhotos.mehendi, aspect: 'aspect-[3/4]' }, { image: collegePhotos.building, aspect: 'aspect-square' }] },
  { offset: -40, className: 'pt-10', items: [{ image: collegePhotos.certificates, aspect: 'aspect-square' }, { image: collegePhotos.treePlanting, aspect: 'aspect-[3/4]' }] },
  { offset: 55, className: 'hidden sm:block', items: [{ image: collegePhotos.function, aspect: 'aspect-[3/4]' }, { image: collegePhotos.felicitation, aspect: 'aspect-square' }] },
];

/** Dark full-bleed band: photo mosaic in parallax columns with links to the gallery and the virtual tour. */
export function CampusGalleryTeaser() {
  return (
    <section aria-labelledby="gallery-heading" className="on-dark relative isolate overflow-hidden bg-navy-950 py-20 text-white sm:py-28">
      <div className="absolute inset-0 -z-10 bg-navy-radial opacity-80" aria-hidden />
      <div className="absolute -right-32 top-1/4 -z-10 h-96 w-96 rounded-full bg-royal-600/25 blur-3xl" aria-hidden />

      <div className="container grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="gallery-heading"
            light
            eyebrow="Campus life"
            title="See it. Feel it. Picture yourself here."
            description="Browse photographs from classrooms, labs, fests and sports days — or explore the campus online before you visit in person."
            className="!mb-8"
          />
          <Reveal className="flex flex-wrap gap-3">
            <ButtonLink to="/campus/gallery" variant="gold" icon={<Images className="h-4 w-4" aria-hidden />}>
              Open the gallery
            </ButtonLink>
            <ButtonLink to="/campus/virtual-tour" variant="outline-light" icon={<Compass className="h-4 w-4" aria-hidden />}>
              Start the virtual tour
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 flex items-center gap-2 text-sm text-navy-100">
              <CalendarDays className="h-4 w-4 shrink-0 text-gold-300" aria-hidden />
              <span>
                Prefer to see it in person?{' '}
                <Link to="/contact#visit" className="font-semibold text-white underline-offset-4 hover:underline">
                  Book a campus visit
                </Link>
              </span>
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Campus photographs" role="group">
          {columns.map((col, ci) => (
            <ParallaxLayer key={ci} offset={col.offset} className={cn('space-y-3 sm:space-y-4', col.className)}>
              {col.items.map(({ image, aspect }) => (
                <div key={image.src} className={cn('group overflow-hidden rounded-2xl bg-navy-800 shadow-lift', aspect)}>
                  <SmartImage image={image} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              ))}
            </ParallaxLayer>
          ))}
        </div>
      </div>
    </section>
  );
}
