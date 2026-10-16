import { useEffect, useState } from 'react';

/**
 * Tracks which in-page section is currently being read. A section becomes active once its top edge
 * passes `offset` px from the top of the viewport (fixed header + sticky sub-nav).
 */
export function useActiveSection(ids: string[], offset = 160) {
  const [active, setActive] = useState(ids[0] ?? '');
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|').filter(Boolean);
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = list[0] ?? '';
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom of the page, highlight the last section even if it is short.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = list[list.length - 1] ?? current;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [key, offset]);

  return active;
}
