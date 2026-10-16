import { ArrowRight, Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { quickLinks } from '@/data/navigation';
import { images } from '@/data/images';

export default function NotFoundPage() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <Seo title="Page not found" description="The page you were looking for could not be found." noindex />
      <PageHero
        eyebrow="Error 404"
        title="We couldn’t find that page"
        description="The link may be outdated, or the page may have moved. Try searching, or use one of the popular links below."
        image={images.library}
        crumbLabel="Page not found"
        actions={
          <ButtonLink to="/" variant="gold" size="lg">
            Back to homepage
          </ButtonLink>
        }
      />
      <Section>
        <div className="mx-auto max-w-2xl">
          <form onSubmit={submit} role="search" className="flex gap-2">
            <label htmlFor="nf-search" className="sr-only">
              Search the website
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" aria-hidden />
              <input id="nf-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search programs, notices, faculty…" className="field-input py-3.5 pl-12 text-base" />
            </div>
            <button type="submit" className="btn btn-lg btn-primary">
              Search
            </button>
          </form>
          <h2 className="mt-12 text-lg font-bold">Popular pages</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group flex items-center justify-between rounded-xl border border-navy-100 bg-white px-5 py-4 font-semibold text-navy-900 transition hover:border-royal-300 hover:shadow-card">
                  {l.label}
                  <ArrowRight className="h-4 w-4 text-royal-600 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
