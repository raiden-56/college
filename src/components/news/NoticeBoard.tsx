import { ArrowRight, BadgeCheck, Building2, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post } from '@/types';
import { dateParts } from '@/utils/format';
import { cn } from '@/utils/cn';

interface NoticeBoardProps {
  posts: Post[];
  className?: string;
  headingLevel?: 'h2' | 'h3';
}

/**
 * Formal notice-board list for official notices: date block, reference number and issuing office,
 * so it reads differently from the photo-led general news grid.
 */
export function NoticeBoard({ posts, className, headingLevel: Heading = 'h3' }: NoticeBoardProps) {
  return (
    <ol className={cn('overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card', className)}>
      {posts.map((post) => {
        const { day, month, year } = dateParts(post.date);
        return (
          <li key={post.slug} className="group relative flex gap-4 border-b border-navy-100 border-l-4 border-l-gold-400 p-4 transition last:border-b-0 hover:bg-royal-50/40 sm:gap-6 sm:p-5">
            <div className="flex w-14 shrink-0 flex-col items-center rounded-xl border border-navy-100 bg-surface-alt py-2 text-navy-900 sm:w-16" aria-hidden>
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-royal-700">{month}</span>
              <span className="font-display text-2xl font-extrabold leading-none">{day}</span>
              <span className="text-[0.6875rem] text-ink-muted">{year}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-navy-900 px-2.5 py-0.5 font-semibold text-white">
                  <BadgeCheck className="h-3.5 w-3.5 text-gold-300" aria-hidden /> Official notice
                </span>
                {post.referenceNo && (
                  <span className="rounded-md border border-navy-200 bg-navy-50 px-2 py-0.5 font-mono text-[0.6875rem] font-semibold text-navy-800">
                    <span className="sr-only">Reference number </span>
                    {post.referenceNo}
                  </span>
                )}
                <span className="font-semibold text-ink-muted">{post.category}</span>
              </div>
              <Heading className="mt-2 text-base font-bold leading-snug sm:text-lg">
                <Link to={`/news/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-royal-700">
                  {post.title}
                </Link>
              </Heading>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                <span className="sr-only">
                  Issued on <time dateTime={post.date}>{`${day} ${month} ${year}`}</time>.
                </span>
                {post.issuedBy && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" aria-hidden />
                    Issued by {post.issuedBy}
                  </span>
                )}
                {post.attachments && post.attachments.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" aria-hidden />
                    {post.attachments.length} attachment{post.attachments.length > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <ArrowRight className="hidden h-5 w-5 shrink-0 self-center text-royal-700 transition-transform group-hover:translate-x-1 sm:block" aria-hidden />
            <span className="pointer-events-none absolute inset-0 ring-inset ring-royal-500 group-has-[a:focus-visible]:ring-2" aria-hidden />
          </li>
        );
      })}
    </ol>
  );
}
