import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NavItem } from '@/types';
import { footerColumns, legalLinks, mainNav } from '@/data/navigation';
import { degreeLevelLabels, degreeLevels, programs } from '@/data/programs';
import { departments } from '@/data/departments';
import { Seo } from '@/components/layout/Seo';
import { PageHero } from '@/components/layout/PageHero';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';

function LinkItem({ item }: { item: NavItem }) {
  return (
    <li>
      <Link to={item.to} className="group inline-flex items-start gap-1.5 py-1 text-sm text-ink-soft hover:text-royal-700">
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-royal-600" aria-hidden />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

export default function SitemapPage() {
  // Main navigation groups; children that merely repeat the parent link are skipped
  const groups = mainNav.map((item) => ({
    item,
    children: (item.children ?? []).filter((c) => c.to !== item.to),
  }));

  // Footer/legal links not already reachable from the main navigation
  const listed = new Set<string>(['/']);
  mainNav.forEach((item) => {
    listed.add(item.to);
    item.children?.forEach((c) => listed.add(c.to));
  });
  const extra: NavItem[] = [];
  [...footerColumns.flatMap((c) => c.links), { label: 'Site search', to: '/search' }].forEach((l) => {
    if (!listed.has(l.to)) {
      listed.add(l.to);
      extra.push(l);
    }
  });

  const programGroups = degreeLevels
    .map((level) => ({ level, items: programs.filter((p) => p.level === level).sort((a, b) => a.name.localeCompare(b.name)) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <Seo title="Sitemap" description="A complete list of pages on the Crestwood College website: admissions, programs, departments, campus life, news, events and policies." />
      <PageHero eyebrow="Legal" title="Sitemap" description="Every section of the website on one page — useful if you prefer browsing a list to using the menus or search." />

      <Section labelledBy="sitemap-main-heading">
        <SectionHeading id="sitemap-main-heading" eyebrow="Website sections" title="Main pages" />
        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StaggerItem as="li" className="card p-6">
            <h3 className="text-lg font-bold">
              <Link to="/" className="hover:text-royal-700">
                Home
              </Link>
            </h3>
          </StaggerItem>
          {groups.map(({ item, children }) => (
            <StaggerItem as="li" key={item.to} className="card p-6">
              <h3 className="text-lg font-bold">
                <Link to={item.to} className="hover:text-royal-700">
                  {item.label}
                </Link>
              </h3>
              {children.length > 0 && (
                <ul className="mt-3">
                  {children.map((c) => (
                    <LinkItem key={c.to} item={c} />
                  ))}
                </ul>
              )}
            </StaggerItem>
          ))}
          {extra.length > 0 && (
            <StaggerItem as="li" className="card p-6">
              <h3 className="text-lg font-bold">More pages</h3>
              <ul className="mt-3">
                {extra.map((l) => (
                  <LinkItem key={l.to} item={l} />
                ))}
              </ul>
            </StaggerItem>
          )}
          <StaggerItem as="li" className="card p-6">
            <h3 className="text-lg font-bold">Legal &amp; policies</h3>
            <ul className="mt-3">
              {legalLinks.map((l) => (
                <LinkItem key={l.to} item={l} />
              ))}
            </ul>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section tone="alt" labelledBy="sitemap-programs-heading">
        <SectionHeading
          id="sitemap-programs-heading"
          eyebrow="Academics"
          title="Programs"
          description={
            <>
              All {programs.length} programs by level. Compare them in the <Link to="/programs" className="link">course finder</Link>.
            </>
          }
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {programGroups.map((g) => (
            <div key={g.level}>
              <h3 className="text-base font-bold">
                {degreeLevelLabels[g.level]} <span className="font-medium text-ink-muted">({g.items.length})</span>
              </h3>
              <ul className="mt-2">
                {g.items.map((p) => (
                  <LinkItem key={p.slug} item={{ label: p.name, to: `/programs/${p.slug}` }} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="sitemap-departments-heading">
        <SectionHeading id="sitemap-departments-heading" eyebrow="Academics" title="Departments" />
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <LinkItem key={d.slug} item={{ label: d.name, to: `/departments/${d.slug}` }} />
          ))}
        </ul>
      </Section>
    </>
  );
}
