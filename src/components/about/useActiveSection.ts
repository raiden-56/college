import { useEffect, useState } from 'react';

/**
 * Tracks which in-page section is currently being read. A section counts as "active" while it
 * crosses a narrow band just above the middle of the viewport; the first match in document order wins.
 * The last active id is kept when the band falls between sections, so the highlight never flickers off.
 */
export function useActiveSection(ids: string[], rootMargin = '-35% 0px -55% 0px') {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|').filter(Boolean);
    const elements = list.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        const first = list.find((id) => visible.get(id));
        if (first) setActive(first);
      },
      { rootMargin, threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, rootMargin]);

  return active;
}
