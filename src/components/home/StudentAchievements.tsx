import { ArrowRight, CalendarDays, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sortedPosts } from '@/data/news';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

/** Student achievements: staggered, offset story cards beside a short introduction. */
export function StudentAchievements() {
  const achievements = sortedPosts.filter((p) => p.category === 'Student Achievement').slice(0, 3);
  if (achievements.length === 0) return null;

  return (
    <Section id="achievements" tone="alt" labelledBy="achievements-heading" size="lg" className="overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="achievements-heading"
            eyebrow="Student achievements"
            title="Proud moments, earned by our students"
            description="From national robotics finals to moot court rounds, our students test themselves against the best — and the whole campus cheers them on."
            className="!mb-8"
          />
          <Reveal>
            <ButtonLink to="/news" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              More news from campus
            </ButtonLink>
          </Reveal>
        </div>

        <Stagger as="ul" className="space-y-6">
          {achievements.map((post, i) => (
            <StaggerItem as="li" key={post.slug} className={cn(i % 2 === 1 && 'lg:ml-12')}>
              <article className="card card-hover group relative flex flex-col overflow-hidden sm:flex-row">
                <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:w-2/5 sm:shrink-0">
                  <SmartImage image={post.image} decorative className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:absolute sm:inset-0" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-muted">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-2.5 py-0.5 font-semibold text-gold-800">
                      <Trophy className="h-3.5 w-3.5" aria-hidden /> Achievement
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug">
                    <Link to={`/news/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{post.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-royal-700" aria-hidden>
                    Read the story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
