import { runnerImport, type Plugin } from 'vite';

type Data = {
  programs: typeof import('../src/data/programs').programs;
  departments: typeof import('../src/data/departments').departments;
  faculty: typeof import('../src/data/faculty').faculty;
  posts: typeof import('../src/data/news').posts;
  events: typeof import('../src/data/events').events;
};

const staticRoutes = [
  '/',
  '/about',
  '/about/leadership',
  '/programs',
  '/departments',
  '/faculty',
  '/admissions',
  '/admissions/apply',
  '/fees',
  '/campus',
  '/campus/gallery',
  '/campus/virtual-tour',
  '/placements',
  '/alumni',
  '/testimonials',
  '/feedback',
  '/research',
  '/student-corner',
  '/news',
  '/events',
  '/disclosures',
  '/contact',
  '/privacy',
  '/accessibility',
  '/sitemap',
];

/** Loads app data modules through Vite's module runner (handles TS + extensionless imports). */
const loadData = async (): Promise<Data> => {
  const load = async <K extends keyof Data>(file: string, key: K) => ((await runnerImport<Record<string, unknown>>(file)).module[key] as Data[K]);
  return {
    programs: await load('./src/data/programs.ts', 'programs'),
    departments: await load('./src/data/departments.ts', 'departments'),
    faculty: await load('./src/data/faculty.ts', 'faculty'),
    posts: await load('./src/data/news.ts', 'posts'),
    events: await load('./src/data/events.ts', 'events'),
  };
};

/** Emits sitemap.xml at build time from the same data the app renders. */
export function sitemapPlugin(siteUrl: string): Plugin {
  return {
    name: 'college-sitemap',
    apply: 'build',
    async generateBundle() {
      const { programs, departments, faculty, posts, events } = await loadData();
      const base = siteUrl.replace(/\/$/, '');
      const today = new Date().toISOString().slice(0, 10);
      const entries: { loc: string; lastmod?: string; priority: string }[] = [
        ...staticRoutes.map((r) => ({ loc: r, priority: r === '/' ? '1.0' : '0.8' })),
        ...programs.map((p) => ({ loc: `/programs/${p.slug}`, priority: '0.8' })),
        ...departments.map((d) => ({ loc: `/departments/${d.slug}`, priority: '0.7' })),
        ...faculty.map((f) => ({ loc: `/faculty/${f.slug}`, priority: '0.5' })),
        ...posts.map((p) => ({ loc: `/news/${p.slug}`, lastmod: p.date, priority: '0.6' })),
        ...events.map((e) => ({ loc: `/events/${e.slug}`, lastmod: e.startDate.slice(0, 10), priority: '0.5' })),
      ];
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...entries.map((e) => `  <url><loc>${base}${e.loc}</loc><lastmod>${e.lastmod ?? today}</lastmod><priority>${e.priority}</priority></url>`),
        '</urlset>',
        '',
      ].join('\n');
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
    },
  };
}
