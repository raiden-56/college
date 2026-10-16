import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from '@/routes';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { programs } from '@/data/programs';
import { departments } from '@/data/departments';
import { faculty } from '@/data/faculty';
import { posts } from '@/data/news';
import { events } from '@/data/events';

const paths = [
  '/',
  '/about',
  '/about/leadership',
  '/programs',
  `/programs/${programs[0].slug}`,
  '/departments',
  `/departments/${departments[0].slug}`,
  '/faculty',
  `/faculty/${faculty[0].slug}`,
  '/admissions',
  '/admissions/apply?program=mba',
  '/fees?program=bca&year=2027-28',
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
  `/news/${posts[0].slug}`,
  '/events',
  `/events/${events[0].slug}`,
  '/disclosures',
  '/contact',
  '/search?q=computer',
  '/privacy',
  '/accessibility',
  '/sitemap',
  '/this-page-does-not-exist',
  '/programs/unknown-program',
];

/** Renders every route in jsdom: catches runtime crashes and enforces a single <h1> per page. */
describe('route smoke test', () => {
  it.each(paths)('renders %s', async (path) => {
    const router = createMemoryRouter(routes, { initialEntries: [path] });
    render(
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>,
    );
    const h1 = await screen.findAllByRole('heading', { level: 1 }, { timeout: 8000 });
    expect(h1).toHaveLength(1);
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    if (path.includes('does-not-exist') || path.includes('unknown-program')) {
      expect(h1[0]).toHaveTextContent(/couldn’t find/i);
    }
  }, 60000);
});
