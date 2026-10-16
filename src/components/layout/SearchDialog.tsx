import { CornerDownLeft, Search, X } from 'lucide-react';
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { SearchResult } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { groupResults, searchSite } from '@/utils/searchIndex';
import { resultIcons } from '@/utils/searchIcons';
import { cn } from '@/utils/cn';

const suggestions = ['B.Tech', 'MBA', 'Hostel', 'Scholarship', 'Fee structure', 'Exam timetable'];

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Global site search in a modal. Implements the combobox + listbox pattern:
 * type to search, ↑/↓ to move, Enter to open, Escape to close.
 */
export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const debounced = useDebounce(query, 120);
  const navigate = useNavigate();
  const listId = useId();
  const titleId = useId();

  useFocusTrap(ref, open, onClose);
  useLockBodyScroll(open);

  const results = useMemo(() => searchSite(debounced, 24), [debounced]);
  const groups = useMemo(() => groupResults(results), [results]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const close = () => {
    onClose();
    setQuery('');
    setActive(0);
  };

  const go = (r: SearchResult) => {
    close();
    if (r.external) window.open(r.to, '_blank', 'noopener');
    else navigate(r.to);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[active]) go(flat[active]);
      else if (query.trim()) {
        close();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  let flatIndex = -1;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] flex items-start justify-center p-3 pt-[8vh] sm:p-6 sm:pt-[12vh]">
          <motion.div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} aria-hidden />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-lift"
          >
            <h2 id={titleId} className="sr-only">
              Search the website
            </h2>
            <div className="flex items-center gap-3 border-b border-navy-100 px-5">
              <Search className="h-5 w-5 shrink-0 text-royal-600" aria-hidden />
              <input
                data-autofocus
                type="text"
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls={listId}
                aria-activedescendant={flat[active] ? `${listId}-${flat[active].id}` : undefined}
                aria-autocomplete="list"
                aria-label="Search programs, departments, faculty, news, events, downloads and FAQs"
                placeholder="Search programs, faculty, notices, FAQs…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                className="h-16 flex-1 bg-transparent text-base text-navy-950 placeholder:text-slate-400 focus:outline-none"
              />
              <button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-navy-700 hover:bg-navy-100" aria-label="Close search">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {!debounced.trim() && (
                <div className="p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Popular searches</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full border border-navy-100 bg-surface-alt px-3 py-1.5 text-sm font-medium text-navy-800 hover:border-royal-300 hover:text-royal-700">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {debounced.trim() && flat.length === 0 && (
                <div className="px-4 py-10 text-center" role="status">
                  <p className="font-semibold text-navy-950">No results for “{debounced}”</p>
                  <p className="mt-1 text-sm text-ink-muted">Try a different keyword, e.g. a course name, department or “admission”.</p>
                </div>
              )}

              <ul id={listId} role="listbox" aria-label="Search results" className={cn(flat.length === 0 && 'hidden')}>
                {groups.map((group) => (
                  <li key={group.type} role="presentation" className="mb-2">
                    <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-ink-muted" aria-hidden>
                      {group.type}
                    </p>
                    <ul role="group" aria-label={group.type}>
                      {group.items.map((r) => {
                        flatIndex += 1;
                        const i = flatIndex;
                        const Icon = resultIcons[r.type];
                        const selected = i === active;
                        return (
                          <li
                            key={r.id}
                            id={`${listId}-${r.id}`}
                            role="option"
                            aria-selected={selected}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => go(r)}
                            className={cn('flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5', selected ? 'bg-royal-50' : 'hover:bg-navy-50')}
                          >
                            <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', selected ? 'bg-royal-700 text-white' : 'bg-navy-50 text-navy-700')}>
                              <Icon className="h-4 w-4" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-navy-950">{r.title}</span>
                              <span className="block truncate text-xs text-ink-muted">{r.description}</span>
                            </span>
                            {selected && <CornerDownLeft className="h-4 w-4 shrink-0 text-royal-600" aria-hidden />}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-navy-100 bg-surface-alt px-5 py-3 text-xs text-ink-muted">
              <span className="hidden sm:inline">
                <kbd className="rounded border border-navy-200 bg-white px-1.5 py-0.5 font-sans">↑</kbd> <kbd className="rounded border border-navy-200 bg-white px-1.5 py-0.5 font-sans">↓</kbd> to navigate ·{' '}
                <kbd className="rounded border border-navy-200 bg-white px-1.5 py-0.5 font-sans">Enter</kbd> to open
              </span>
              {query.trim() && (
                <button
                  type="button"
                  className="link text-xs"
                  onClick={() => {
                    close();
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                >
                  See all results
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
