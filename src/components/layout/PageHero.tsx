import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { ImageAsset } from '@/types';
import { images } from '@/data/images';
import { ParallaxImage } from '@/components/motion/Parallax';
import { breadcrumbLd } from '@/utils/structuredData';
import { cn } from '@/utils/cn';
import { Breadcrumbs, useAutoCrumbs, type Crumb } from './Breadcrumbs';

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  image?: ImageAsset;
  /** Override auto-generated breadcrumbs */
  crumbs?: Crumb[];
  /** Label for the last breadcrumb if different from the title */
  crumbLabel?: string;
  actions?: ReactNode;
  /** Content shown beside (desktop) / below (mobile) the title, e.g. key facts */
  aside?: ReactNode;
  /** Extra content under the description (badges, meta) */
  children?: ReactNode;
  size?: 'md' | 'lg';
}

/**
 * Dark inner-page banner with a parallax photo, breadcrumbs and the page's single <h1>.
 * Top padding clears the fixed header. Every inner page should start with this.
 */
export function PageHero({ title, eyebrow, description, image = images.campusAerial, crumbs, crumbLabel, actions, aside, children, size = 'md' }: PageHeroProps) {
  const auto = useAutoCrumbs(crumbLabel ?? title);
  const items = crumbs ?? auto;

  return (
    <section className={cn('on-dark relative isolate overflow-hidden bg-navy-950 text-white', size === 'lg' ? 'pb-20 pt-40 sm:pb-28 sm:pt-48' : 'pb-14 pt-36 sm:pb-20 sm:pt-44')}>
      <ParallaxImage image={image} strength={12} className="absolute inset-0 -z-20" imgClassName="opacity-45" priority />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/40" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-royal-600/30 blur-3xl" aria-hidden />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(items)) }} />

      <div className={cn('container', aside && 'grid items-end gap-10 lg:grid-cols-[1fr_auto]')}>
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Breadcrumbs items={items} light />
          </motion.div>
          {eyebrow && (
            <motion.p className="eyebrow eyebrow-light mt-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
              <span className="h-px w-6 bg-gold-300" aria-hidden />
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            className={cn('mt-3 text-balance font-extrabold leading-[1.08] text-white', size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-5xl', !eyebrow && 'mt-6')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>
          {description && (
            <motion.div className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-navy-100 sm:text-lg" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {description}
            </motion.div>
          )}
          {children && (
            <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}>
              {children}
            </motion.div>
          )}
          {actions && (
            <motion.div className="mt-8 flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              {actions}
            </motion.div>
          )}
        </div>
        {aside && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}
