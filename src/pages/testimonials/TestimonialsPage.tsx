import { ArrowRight, Clapperboard, FileText, MessageSquarePlus, ShieldCheck, Video } from 'lucide-react';
import { useMemo } from 'react';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { buttonClasses } from '@/components/ui/buttonClasses';
import { DemoNotice } from '@/components/ui/DemoBadge';
import { FilterChips, FilterSelect, ResultsSummary } from '@/components/ui/Filters';
import { EmptyState } from '@/components/ui/States';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { EnquiryCTA } from '@/components/sections/EnquiryCTA';
import { testimonials } from '@/data/testimonials';
import { departments } from '@/data/departments';
import { images } from '@/data/images';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import type { Testimonial } from '@/types';

/** Only testimonials with recorded consent are ever rendered publicly. */
const publicTestimonials = testimonials.filter((t) => t.consentRecorded);
const roles: Testimonial['role'][] = ['Student', 'Alumni', 'Parent'];
const deptOptions = departments.filter((d) => publicTestimonials.some((t) => t.departmentSlug === d.slug)).map((d) => ({ value: d.slug, label: d.shortName }));
const featured = publicTestimonials.filter((t) => (t.rating ?? 0) >= 5);
const withVideo = publicTestimonials.filter((t) => t.videoUrl);
const videoPending = publicTestimonials.filter((t) => !t.videoUrl && t.videoTranscript);

const youTubeId = (url: string) => url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];

function VideoTestimonial({ t }: { t: Testimonial }) {
  const id = t.videoUrl ? youTubeId(t.videoUrl) : undefined;
  return (
    <article className="card overflow-hidden">
      <div className="aspect-video bg-navy-950">
        {id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?cc_load_policy=1`}
            title={`Video testimonial from ${t.name}`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={t.videoUrl} controls preload="metadata" className="h-full w-full" aria-label={`Video testimonial from ${t.name}`} />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold">{t.name}</h3>
        <p className="text-sm text-ink-muted">
          {t.role} · {t.context}
        </p>
        {t.videoTranscript && (
          <details className="mt-3 text-sm">
            <summary className="link cursor-pointer">Read transcript</summary>
            <p className="mt-2 whitespace-pre-line text-ink-soft">{t.videoTranscript}</p>
          </details>
        )}
      </div>
    </article>
  );
}

function VideoComingSoon({ t }: { t: Testimonial }) {
  return (
    <article className="card overflow-hidden">
      <div className="on-dark relative aspect-video overflow-hidden bg-navy-950">
        {t.photo && <SmartImage image={t.photo} decorative className="h-full w-full object-cover opacity-35" />}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
            <Clapperboard className="h-6 w-6" aria-hidden />
          </span>
          <p className="mt-3 font-display text-lg font-bold">Video coming soon</p>
          <p className="text-sm text-navy-100">Captioned video will be published after review</p>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold">{t.name}</h3>
        <p className="text-sm text-ink-muted">
          {t.role} · {t.context}
        </p>
        <p className="mt-3 text-sm text-ink-soft">“{t.quote}”</p>
        <details className="group mt-4 rounded-xl border border-navy-100 text-sm">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-3 py-2.5 font-semibold text-royal-700 hover:bg-royal-50 [&::-webkit-details-marker]:hidden">
            <FileText className="h-4 w-4" aria-hidden />
            Transcript
          </summary>
          <p className="whitespace-pre-line px-3 pb-3 text-ink-soft">{t.videoTranscript}</p>
        </details>
      </div>
    </article>
  );
}

export default function TestimonialsPage() {
  const [raw, setFilter, resetFilters, activeCount] = useUrlFilters({ role: 'all', department: 'all' });
  const role = (roles as string[]).includes(raw.role) ? raw.role : 'all';
  const department = deptOptions.some((d) => d.value === raw.department) ? raw.department : 'all';

  const filtered = useMemo(
    () => publicTestimonials.filter((t) => (role === 'all' || t.role === role) && (department === 'all' || t.departmentSlug === department)),
    [role, department],
  );

  return (
    <>
      <Seo
        title="Testimonials"
        description="Hear from Crestwood College students, alumni and parents. Every testimonial is published with recorded consent after moderation."
      />
      <PageHero
        eyebrow="Community voices"
        title="Testimonials"
        description="Students, alumni and parents share what Crestwood means to them — in their own words, published with their consent."
        image={images.friends}
        actions={
          <ButtonLink to="/feedback" variant="gold" icon={<MessageSquarePlus className="h-4 w-4" aria-hidden />}>
            Share your experience
          </ButtonLink>
        }
      />

      {featured.length > 0 && (
        <Section tone="navy" id="featured" labelledBy="featured-heading">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <SectionHeading
              id="featured-heading"
              light
              eyebrow="Featured"
              title="Stories that stay with us"
              description="A rotating selection from our community. Use the controls to pause or move between testimonials."
              className="mb-0"
            />
            <TestimonialCarousel items={featured} light label="Featured testimonials" />
          </div>
        </Section>
      )}

      <Section tone="alt" id="all" labelledBy="all-heading">
        <SectionHeading id="all-heading" eyebrow="All testimonials" title="In their own words" description="Filter by who is speaking, or by department." />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <FilterChips
            label="Filter by role"
            value={role}
            onChange={(v) => setFilter('role', v)}
            options={[
              { value: 'all', label: 'Everyone', count: publicTestimonials.length },
              ...roles.map((r) => ({ value: r, label: r === 'Alumni' ? 'Alumni' : `${r}s`, count: publicTestimonials.filter((t) => t.role === r).length })),
            ]}
          />
          <FilterSelect label="Department" value={department} onChange={(v) => setFilter('department', v)} options={deptOptions} allLabel="All departments" className="w-full lg:w-64" />
        </div>
        <div className="mt-5">
          <ResultsSummary start={filtered.length ? 1 : 0} end={filtered.length} total={filtered.length} noun="testimonials" onReset={resetFilters} activeFilters={activeCount} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="No testimonials match these filters"
            description="Parent testimonials are not linked to a department. Try a different combination."
            action={
              <button type="button" className={buttonClasses({ variant: 'secondary' })} onClick={resetFilters}>
                Clear filters
              </button>
            }
          />
        ) : (
          <Stagger key={`${role}-${department}`} className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
            {filtered.map((t) => (
              <StaggerItem key={t.id} className="h-full">
                <TestimonialCard testimonial={t} className="card-hover" />              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Section>

      {(withVideo.length > 0 || videoPending.length > 0) && (
        <Section tone="white" id="videos" labelledBy="videos-heading">
          <SectionHeading
            id="videos-heading"
            eyebrow="Video testimonials"
            title="Watch & listen"
            description="Every video is published with captions and a full text transcript. Videos never auto-play."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {withVideo.map((t) => (
              <Reveal key={t.id}>
                <VideoTestimonial t={t} />
              </Reveal>
            ))}
            {videoPending.map((t) => (
              <Reveal key={t.id}>
                <VideoComingSoon t={t} />
              </Reveal>
            ))}
            <Reveal className="flex flex-col justify-center rounded-3xl border-2 border-dashed border-navy-200 p-6 text-center">
              <Video className="mx-auto h-8 w-8 text-royal-700" aria-hidden />
              <p className="mt-3 font-bold text-navy-950">More videos on the way</p>
              <p className="mt-1 text-sm text-ink-muted">Recorded with consent; published after captioning and review.</p>
            </Reveal>
          </div>
        </Section>
      )}

      <Section tone="sunken" id="moderation" labelledBy="moderation-heading" size="sm">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <Reveal className="flex gap-4">
            <ShieldCheck className="h-8 w-8 shrink-0 text-royal-700" aria-hidden />
            <div>
              <h2 id="moderation-heading" className="text-2xl font-extrabold">
                How we publish testimonials
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-soft">
                <li>We publish a testimonial only after the person gives recorded, written consent.</li>
                <li>Each one is moderated for accuracy and respect; we may shorten it but never change its meaning.</li>
                <li>Anyone can ask us to remove their testimonial at any time.</li>
                <li>Testimonials are personal views and are not paid endorsements.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="card p-6">
            <h3 className="text-lg font-bold">Have something to share?</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Send us your feedback and tick the option to allow publication. Feedback stays private unless you consent and it passes moderation.
            </p>
            <ButtonLink to="/feedback" variant="primary" className="mt-4" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Share your feedback
            </ButtonLink>
          </Reveal>
        </div>
        <DemoNotice className="mt-8">The people and testimonials on this page are fictional placeholders and will be replaced with consented testimonials.</DemoNotice>
      </Section>

      <EnquiryCTA />
    </>
  );
}
