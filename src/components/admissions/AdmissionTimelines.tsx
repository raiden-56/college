import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { admissionSteps } from '@/data/admissions';
import { datesWithStatus } from './dates';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { dateParts, formatDate, formatLongDate } from '@/utils/format';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

/** Animated, numbered admission process: vertical on mobile, horizontal from lg. */
export function ProcessTimeline() {
  return (
    <div className="relative">
      {/* Connector lines */}
      <motion.div
        className="absolute left-7 top-7 block h-[calc(100%-3.5rem)] w-0.5 origin-top bg-gradient-to-b from-royal-600 to-gold-400 lg:hidden"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '0px 0px -120px 0px' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        aria-hidden
      />
      <motion.div
        className="absolute left-[10%] right-[10%] top-7 hidden h-0.5 origin-left bg-gradient-to-r from-royal-600 to-gold-400 lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '0px 0px -120px 0px' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        aria-hidden
      />
      <Stagger as="ol" stagger={0.14} className="relative grid gap-8 lg:grid-cols-5 lg:gap-6">
        {admissionSteps.map((step, i) => {
          const Icon = getIcon(step.icon);
          return (
            <StaggerItem as="li" key={step.title} className="group relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-navy-900 text-white shadow-lift ring-4 ring-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-royal-700">
                <Icon className="h-6 w-6" aria-hidden />
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-gold-400 text-xs font-extrabold text-navy-950">{i + 1}</span>
              </span>
              <div className="pt-1 lg:pt-0">
                <p className="text-xs font-bold uppercase tracking-wider text-royal-700">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{step.text}</p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

interface ImportantDatesProps {
  /** Compact list for sidebars; full timeline for the admissions page (on a navy section) */
  variant?: 'full' | 'compact';
  limit?: number;
}

export function ImportantDates({ variant = 'full', limit }: ImportantDatesProps) {
  const all = datesWithStatus();
  const items = limit ? all.filter((d) => d.status !== 'past').slice(0, limit) : all;

  if (variant === 'compact') {
    return (
      <ul className="space-y-3">
        {items.map((d) => {
          const p = dateParts(d.date);
          return (
            <li key={d.label} className="flex items-center gap-3">
              <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-xl text-center leading-none', d.status === 'next' ? 'bg-gold-400 text-navy-950' : 'bg-navy-50 text-navy-900')}>
                <span>
                  <span className="block font-display text-base font-extrabold">{p.day}</span>
                  <span className="block text-[0.625rem] font-bold uppercase">{p.month}</span>
                </span>
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-navy-900">{d.label}</p>
                <p className="text-xs text-ink-muted">
                  <time dateTime={d.date}>{formatDate(d.date)}</time>
                  {d.status === 'next' && <span className="ml-1.5 font-semibold text-gold-700">· Up next</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <Stagger as="ol" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d) => {
        const p = dateParts(d.date);
        const past = d.status === 'past';
        const next = d.status === 'next';
        return (
          <StaggerItem as="li" key={d.label}>
            <div
              className={cn(
                'relative flex h-full gap-4 rounded-2xl border p-5 transition duration-300 hover:-translate-y-1',
                next ? 'border-gold-300/60 bg-gold-300/10 shadow-glow' : 'glass',
                past && 'opacity-60',
              )}
            >
              <span className={cn('grid h-16 w-16 shrink-0 place-items-center rounded-xl text-center leading-none', next ? 'bg-gold-400 text-navy-950' : 'bg-white/10 text-white')}>
                <span>
                  <span className="block font-display text-2xl font-extrabold">{p.day}</span>
                  <span className="mt-1 block text-[0.6875rem] font-bold uppercase tracking-wider">
                    {p.month} {String(p.year).slice(2)}
                  </span>
                </span>
              </span>
              <div className="min-w-0">
                <h3 className={cn('text-base font-bold text-white', past && 'line-through decoration-white/40')}>{d.label}</h3>
                <p className="mt-0.5 text-sm text-navy-100">
                  <time dateTime={d.date}>{formatLongDate(d.date)}</time>
                </p>
                {d.note && <p className="mt-1 text-xs text-navy-200">{d.note}</p>}
                {(past || next) && (
                  <p className={cn('mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide', next ? 'text-gold-300' : 'text-navy-200')}>
                    {past ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Completed
                      </>
                    ) : (
                      'Up next'
                    )}
                  </p>
                )}
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
