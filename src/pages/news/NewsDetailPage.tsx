import { ArrowLeft, ArrowRight, BadgeCheck, Building2, CalendarDays, FileText, Hash, Paperclip, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ShareActions } from '@/components/news/ShareActions';
import { NewsCard } from '@/components/cards/NewsCard';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { DownloadLink } from '@/components/ui/DownloadLink';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getPost, sortedPosts } from '@/data/news';
import { formatDate, formatLongDate } from '@/utils/format';
import { articleLd } from '@/utils/structuredData';
import NotFoundPage from '@/pages/NotFoundPage';

export default function NewsDetailPage() {
  const { slug = '' } = useParams();
  const post = getPost(slug);
  if (!post) return <NotFoundPage />;

  const index = sortedPosts.findIndex((p) => p.slug === post.slug);
  const newer = index > 0 ? sortedPosts[index - 1] : undefined;
  const older = index < sortedPosts.length - 1 ? sortedPosts[index + 1] : undefined;

  const sameCategory = sortedPosts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const fillers = sortedPosts.filter((p) => p.slug !== post.slug && p.category !== post.category && p.isOfficialNotice === post.isOfficialNotice);
  const related = [...sameCategory, ...fillers].slice(0, 3);

  const kind = post.isOfficialNotice ? 'notice' : 'story';

  return (
    <>
      <Seo title={post.title} description={post.excerpt} type="article" image={post.image.src} jsonLd={articleLd(post)} />
      <PageHero eyebrow={post.isOfficialNotice ? 'Official notice' : post.category} title={post.title} crumbLabel={post.title.length > 48 ? `${post.title.slice(0, 45)}…` : post.title} image={post.image}>
        <div className="flex flex-wrap items-center gap-2">
          {post.isOfficialNotice && (
            <Badge tone="white" icon={<BadgeCheck className="h-3.5 w-3.5 text-gold-300" aria-hidden />}>
              Official notice
            </Badge>
          )}
          <Badge tone="white">{post.category}</Badge>
          <Badge tone="white" icon={<CalendarDays className="h-3.5 w-3.5" aria-hidden />}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </Badge>
          {post.attachments && post.attachments.length > 0 && (
            <Badge tone="white" icon={<Paperclip className="h-3.5 w-3.5" aria-hidden />}>
              {post.attachments.length} attachment{post.attachments.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </PageHero>

      <Section labelledBy="article-heading">
        <h2 id="article-heading" className="sr-only">
          Full {kind}
        </h2>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <article className="min-w-0">
            {post.isOfficialNotice && (
              <Reveal>
                <aside aria-label="Notice details" className="mb-8 overflow-hidden rounded-2xl border-2 border-navy-900 bg-white">
                  <div className="flex items-center gap-2 bg-navy-900 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white">
                    <BadgeCheck className="h-4 w-4 text-gold-300" aria-hidden />
                    Official notice
                  </div>
                  <dl className="grid gap-4 p-5 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        <Hash className="h-3.5 w-3.5" aria-hidden />
                        Reference no.
                      </dt>
                      <dd className="mt-1 font-mono font-semibold text-navy-950">{post.referenceNo ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        <Building2 className="h-3.5 w-3.5" aria-hidden />
                        Issued by
                      </dt>
                      <dd className="mt-1 font-semibold text-navy-950">{post.issuedBy ?? '—'}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                        Date of issue
                      </dt>
                      <dd className="mt-1 font-semibold text-navy-950">
                        <time dateTime={post.date}>{formatLongDate(post.date)}</time>
                      </dd>
                    </div>
                  </dl>
                </aside>
              </Reveal>
            )}

            <Reveal>
              <figure>
                <ParallaxImage image={post.image} strength={10} className="aspect-[16/9] rounded-3xl shadow-lift" />
                <figcaption className="mt-3 text-sm text-ink-muted">{post.image.alt}</figcaption>
              </figure>
            </Reveal>

            <div className="prose-college mt-8">
              <p className="text-lg font-medium text-navy-900">{post.excerpt}</p>
              {post.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {post.attachments && post.attachments.length > 0 && (
              <section aria-labelledby="attachments-heading" className="mt-10">
                <h3 id="attachments-heading" className="flex items-center gap-2 text-xl font-bold">
                  <FileText className="h-5 w-5 text-royal-700" aria-hidden />
                  Attachments
                </h3>
                <ul className="mt-4 grid gap-3">
                  {post.attachments.map((a) => (
                    <li key={a.title}>
                      <DownloadLink title={a.title} url={a.url} sizeKb={a.sizeKb} showPreview />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-10 flex flex-col gap-6 border-t border-navy-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-ink-muted" aria-hidden />
                  <span className="sr-only">Tags:</span>
                  <ul className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <li key={t}>
                        <Link to={`/news?q=${encodeURIComponent(t)}`} className="chip border-navy-100 bg-navy-50 text-navy-800 transition hover:border-royal-300 hover:text-royal-700">
                          #{t}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span />
              )}
              <ShareActions title={post.title} />
            </div>

            <nav aria-label="More posts" className="mt-10 grid gap-4 sm:grid-cols-2">
              {newer ? (
                <Link to={`/news/${newer.slug}`} className="group rounded-2xl border border-navy-100 bg-white p-5 transition hover:border-royal-200 hover:shadow-card">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" aria-hidden />
                    Newer
                  </span>
                  <span className="mt-1.5 block font-semibold leading-snug text-navy-950 group-hover:text-royal-700">{newer.title}</span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {older && (
                <Link to={`/news/${older.slug}`} className="group rounded-2xl border border-navy-100 bg-white p-5 text-right transition hover:border-royal-200 hover:shadow-card">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Older
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                  <span className="mt-1.5 block font-semibold leading-snug text-navy-950 group-hover:text-royal-700">{older.title}</span>
                </Link>
              )}
            </nav>
          </article>

          <aside aria-label="Related links" className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="card p-6">
              <h3 className="text-base font-bold">Latest official notices</h3>
              <ul className="mt-4 space-y-4">
                {sortedPosts
                  .filter((p) => p.isOfficialNotice && p.slug !== post.slug)
                  .slice(0, 4)
                  .map((p) => (
                    <li key={p.slug}>
                      <Link to={`/news/${p.slug}`} className="text-sm font-semibold leading-snug text-navy-950 hover:text-royal-700 hover:underline">
                        {p.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        <time dateTime={p.date}>{formatDate(p.date)}</time>
                        {p.referenceNo && ` · ${p.referenceNo}`}
                      </p>
                    </li>
                  ))}
              </ul>
              <ButtonLink to="/news?type=official" variant="secondary" size="sm" className="mt-5 w-full">
                Notice board
              </ButtonLink>
            </div>
            <div className="on-dark rounded-2xl bg-navy-radial p-6 text-white">
              <h3 className="text-base font-bold text-white">Have a question about this {kind}?</h3>
              <p className="mt-1.5 text-sm text-navy-100">Contact the issuing office during working hours, or send us a message.</p>
              <ButtonLink to="/contact" variant="gold" size="sm" className="mt-4">
                Contact us
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="alt" labelledBy="related-heading">
          <SectionHeading
            id="related-heading"
            eyebrow="Keep reading"
            title={sameCategory.length > 0 ? `More in ${post.category}` : 'Related posts'}
            action={
              <ButtonLink to={`/news?category=${encodeURIComponent(post.category)}`} variant="secondary" iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                View all
              </ButtonLink>
            }
          />
          <Stagger as="ul" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <StaggerItem as="li" key={p.slug}>
                <NewsCard post={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}
    </>
  );
}
