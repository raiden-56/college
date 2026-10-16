import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '@/types';
import { getDepartment } from '@/data/departments';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
  light?: boolean;
  size?: 'md' | 'lg';
}

export function Rating({ value, light }: { value: number; light?: boolean }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn('h-4 w-4', i < value ? 'fill-gold-400 text-gold-400' : light ? 'text-white/25' : 'text-navy-200')} aria-hidden />
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial: t, className, light, size = 'md' }: TestimonialCardProps) {
  const dept = t.departmentSlug ? getDepartment(t.departmentSlug) : undefined;
  return (
    <figure className={cn('relative flex h-full flex-col rounded-3xl p-6 sm:p-8', light ? 'glass text-white' : 'card', className)}>
      <Quote className={cn('h-9 w-9', light ? 'text-gold-300' : 'text-royal-200')} aria-hidden />
      {t.rating && (
        <div className="mt-4">
          <Rating value={t.rating} light={light} />
        </div>
      )}
      <blockquote className={cn('mt-4 flex-1 leading-relaxed', size === 'lg' ? 'text-lg sm:text-xl' : 'text-base', light ? 'text-white/90' : 'text-ink-soft')}>
        <p>“{t.quote}”</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {t.photo ? (
          <SmartImage image={{ src: t.photo.src, alt: '' }} decorative className="h-12 w-12 rounded-full object-cover ring-2 ring-gold-300/60" />
        ) : (
          <span className="grid h-12 w-12 place-items-center rounded-full bg-royal-100 font-bold text-royal-800">{initials(t.name)}</span>
        )}
        <div>
          <p className={cn('font-bold', light ? 'text-white' : 'text-navy-950')}>{t.name}</p>
          <p className={cn('text-sm', light ? 'text-navy-100' : 'text-ink-muted')}>
            {t.role} · {t.context}
          </p>
          {dept && <p className={cn('text-xs', light ? 'text-gold-200' : 'text-royal-700')}>{dept.shortName}</p>}
        </div>
      </figcaption>
    </figure>
  );
}
