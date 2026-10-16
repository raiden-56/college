import { ArrowRight, BadgeCheck, CalendarDays, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post } from '@/types';
import { formatDate } from '@/utils/format';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/utils/cn';

interface NewsCardProps {
  post: Post;
  className?: string;
  headingLevel?: 'h2' | 'h3';
  /** 'list' = compact row without image (good for notice boards) */
  variant?: 'card' | 'list';
}

/** Official notices get a navy "Official notice" seal; general news shows its category. */
export function NewsCard({ post, className, headingLevel: Heading = 'h3', variant = 'card' }: NewsCardProps) {
  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-muted">
      {post.isOfficialNotice ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-2.5 py-0.5 font-semibold text-white">
          <BadgeCheck className="h-3.5 w-3.5 text-gold-300" aria-hidden /> Official notice
        </span>
      ) : (
        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 font-semibold text-sky-800">{post.category}</span>
      )}
      <span className="inline-flex items-center gap-1">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      {post.attachments && post.attachments.length > 0 && (
        <span className="inline-flex items-center gap-1">
          <Paperclip className="h-3.5 w-3.5" aria-hidden />
          {post.attachments.length} attachment{post.attachments.length > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );

  if (variant === 'list') {
    return (
      <article className={cn('group relative rounded-xl border border-transparent p-4 transition hover:border-navy-100 hover:bg-white hover:shadow-card', className)}>
        {meta}
        <Heading className="mt-2 text-base font-bold leading-snug">
          <Link to={`/news/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-royal-700">
            {post.title}
          </Link>
        </Heading>
        {post.isOfficialNotice && post.category !== 'Announcement' && <p className="mt-1 text-xs text-ink-muted">{post.category}</p>}
      </article>
    );
  }

  return (
    <article className={cn('card card-hover group relative flex h-full flex-col overflow-hidden', className)}>
      <div className="aspect-[16/9] overflow-hidden">
        <SmartImage image={post.image} decorative className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        {meta}
        <Heading className="mt-3 text-lg font-bold leading-snug">
          <Link to={`/news/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-royal-700" aria-hidden>
          Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-royal-500 ring-offset-2 group-has-[a:focus-visible]:ring-2" aria-hidden />
    </article>
  );
}
