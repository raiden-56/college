import { cn } from '@/utils/cn';

interface LegalTocProps {
  items: { id: string; label: string }[];
  className?: string;
}

/** Sticky "On this page" navigation used by the long-form legal pages. */
export function LegalToc({ items, className }: LegalTocProps) {
  return (
    <nav aria-label="On this page" className={cn('lg:sticky lg:top-28 lg:self-start', className)}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-700">On this page</p>
      <ol className="mt-3 space-y-1 border-l border-navy-100 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-ink-muted transition hover:border-royal-500 hover:text-royal-700">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
