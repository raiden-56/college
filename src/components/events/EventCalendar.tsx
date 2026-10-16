import { CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { CollegeEvent } from '@/types';
import { EventCard } from '@/components/cards/EventCard';
import { cn } from '@/utils/cn';
import { formatLongDate } from '@/utils/format';
import { addDays, addMonths, categoryStyles, fromDayKey, groupEventsByDay, startOfMonth, toDayKey } from './eventUtils';

interface EventCalendarProps {
  events: CollegeEvent[];
  /** Date used for "today" highlighting and the initial month */
  today: Date;
  className?: string;
}

const weekdays = [
  { short: 'Mon', long: 'Monday' },
  { short: 'Tue', long: 'Tuesday' },
  { short: 'Wed', long: 'Wednesday' },
  { short: 'Thu', long: 'Thursday' },
  { short: 'Fri', long: 'Friday' },
  { short: 'Sat', long: 'Saturday' },
  { short: 'Sun', long: 'Sunday' },
];

const monthTitle = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' });

/**
 * Accessible month calendar. Each day is a real button (roving tabindex): arrow keys move by day/week,
 * Home/End jump to the start/end of the week, Page Up/Down change month, Enter/Space selects a day.
 * Selecting a day lists its events beside (desktop) or below (mobile) the grid.
 */
export function EventCalendar({ events, today, className }: EventCalendarProps) {
  const headingId = useId();
  const todayKey = toDayKey(today);
  const [month, setMonth] = useState(() => startOfMonth(today));
  const [focusedKey, setFocusedKey] = useState(todayKey);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const shouldFocus = useRef(false);

  const byDay = useMemo(() => groupEventsByDay(events), [events]);

  const weeks = useMemo(() => {
    const first = startOfMonth(month);
    const offset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const count = Math.ceil((offset + daysInMonth) / 7);
    const gridStart = addDays(first, -offset);
    return Array.from({ length: count }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(gridStart, w * 7 + d)));
  }, [month]);

  const visibleKeys = useMemo(() => new Set(weeks.flat().map(toDayKey)), [weeks]);
  // Keep exactly one day tabbable even after the month changes via the header buttons.
  const tabbableKey = visibleKeys.has(focusedKey) ? focusedKey : toDayKey(startOfMonth(month));

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    buttons.current.get(focusedKey)?.focus();
  }, [focusedKey, month]);

  const moveTo = (date: Date) => {
    shouldFocus.current = true;
    setFocusedKey(toDayKey(date));
    if (date.getMonth() !== month.getMonth() || date.getFullYear() !== month.getFullYear()) setMonth(startOfMonth(date));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const weekday = (date.getDay() + 6) % 7;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => addDays(date, -weekday),
      End: () => addDays(date, 6 - weekday),
      PageUp: () => {
        const target = addMonths(date, -1);
        return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()));
      },
      PageDown: () => {
        const target = addMonths(date, 1);
        return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()));
      },
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    moveTo(move());
  };

  const changeMonth = (n: number) => {
    const next = addMonths(month, n);
    setMonth(next);
    setSelectedKey(null);
  };

  const goToday = () => {
    setMonth(startOfMonth(today));
    setFocusedKey(todayKey);
    setSelectedKey(todayKey);
  };

  const monthEvents = useMemo(() => {
    const seen = new Set<string>();
    const list: CollegeEvent[] = [];
    weeks.flat().forEach((d) => {
      if (d.getMonth() !== month.getMonth()) return;
      (byDay.get(toDayKey(d)) ?? []).forEach((ev) => {
        if (!seen.has(ev.slug)) {
          seen.add(ev.slug);
          list.push(ev);
        }
      });
    });
    return list;
  }, [weeks, byDay, month]);

  const panelEvents = selectedKey ? (byDay.get(selectedKey) ?? []) : monthEvents;
  const panelTitle = selectedKey ? `Events on ${formatLongDate(fromDayKey(selectedKey))}` : `Events in ${monthTitle.format(month)}`;
  const panelEnd = selectedKey ? addDays(fromDayKey(selectedKey), 1) : addMonths(month, 1);
  const nextAfter = panelEvents.length === 0 ? [...events].sort((a, b) => a.startDate.localeCompare(b.startDate)).find((e) => new Date(e.startDate) >= panelEnd) : undefined;
  const usedCategories =Array.from(new Set(events.map((e) => e.category)));

  return (
    <div className={cn('grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]', className)}>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-navy-100 p-3 sm:p-4">
          <button type="button" onClick={() => changeMonth(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 text-navy-800 transition hover:border-royal-300 hover:bg-royal-50" aria-label="Previous month">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-3">
            <h3 id={headingId} className="text-lg font-bold sm:text-xl" aria-live="polite">
              {monthTitle.format(month)}
            </h3>
            <button type="button" onClick={goToday} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-800 transition hover:bg-royal-100">
              Today
            </button>
          </div>
          <button type="button" onClick={() => changeMonth(1)} className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 text-navy-800 transition hover:border-royal-300 hover:bg-royal-50" aria-label="Next month">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <table className="w-full table-fixed border-collapse" aria-labelledby={headingId}>
          <thead>
            <tr>
              {weekdays.map((d) => (
                <th key={d.short} scope="col" className="py-2 text-center text-[0.6875rem] font-bold uppercase tracking-wider text-ink-muted">
                  <abbr title={d.long} className="no-underline">
                    <span className="sm:hidden">{d.short.charAt(0)}</span>
                    <span className="hidden sm:inline">{d.short}</span>
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={toDayKey(week[0])}>
                {week.map((date) => {
                  const key = toDayKey(date);
                  const dayEvents = byDay.get(key) ?? [];
                  const inMonth = date.getMonth() === month.getMonth();
                  const isToday = key === todayKey;
                  const isSelected = key === selectedKey;
                  const label = `${formatLongDate(date)}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}: ${dayEvents.map((e) => e.title).join('; ')}` : ', no events'}`;
                  return (
                    <td key={key} className="border-t border-navy-100 p-0.5 align-top sm:p-1">
                      <button
                        ref={(el) => {
                          if (el) buttons.current.set(key, el);
                          else buttons.current.delete(key);
                        }}
                        type="button"
                        tabIndex={key === tabbableKey ? 0 : -1}
                        aria-label={label}
                        aria-pressed={isSelected}
                        aria-current={isToday ? 'date' : undefined}
                        onClick={() => {
                          setFocusedKey(key);
                          setSelectedKey(isSelected ? null : key);
                          if (!inMonth) setMonth(startOfMonth(date));
                        }}
                        onFocus={() => setFocusedKey(key)}
                        onKeyDown={(e) => onKeyDown(e, date)}
                        className={cn(
                          'group flex h-14 w-full flex-col items-center rounded-lg p-1 text-left transition sm:h-24 sm:items-stretch sm:p-1.5',
                          isSelected ? 'bg-navy-900 text-white shadow-card' : dayEvents.length ? 'bg-royal-50/60 hover:bg-royal-100' : 'hover:bg-navy-50',
                          !inMonth && !isSelected && 'opacity-40',
                        )}
                      >
                        <span
                          className={cn(
                            'grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold',
                            isToday && !isSelected && 'bg-gold-400 text-navy-950',
                            isToday && isSelected && 'bg-gold-300 text-navy-950',
                          )}
                          aria-hidden
                        >
                          {date.getDate()}
                        </span>
                        {dayEvents.length > 0 && (
                          <>
                            <span className="mt-1 flex gap-0.5 sm:hidden" aria-hidden>
                              {dayEvents.slice(0, 3).map((ev) => (
                                <span key={ev.slug} className={cn('h-1.5 w-1.5 rounded-full', isSelected ? 'bg-gold-300' : categoryStyles[ev.category].dot)} />
                              ))}
                            </span>
                            <span className="mt-1 hidden min-w-0 flex-col gap-0.5 sm:flex" aria-hidden>
                              {dayEvents.slice(0, 2).map((ev) => (
                                <span
                                  key={ev.slug}
                                  className={cn('truncate rounded border px-1 py-px text-[0.6875rem] font-semibold leading-tight', isSelected ? 'border-white/20 bg-white/10 text-white' : categoryStyles[ev.category].chip)}
                                >
                                  {ev.title}
                                </span>
                              ))}
                              {dayEvents.length > 2 && <span className={cn('text-[0.6875rem] font-semibold', isSelected ? 'text-gold-200' : 'text-ink-muted')}>+{dayEvents.length - 2} more</span>}
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-navy-100 px-4 py-3 text-xs text-ink-muted">
          {usedCategories.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5">
              <span className={cn('h-2 w-2 rounded-full', categoryStyles[c].dot)} aria-hidden />
              {c}
            </span>
          ))}
          <span className="ml-auto hidden md:inline">Tip: use arrow keys to move between days, Page Up/Down to change month.</span>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold" aria-live="polite">
            {panelTitle} <span className="sr-only">({panelEvents.length} found)</span>
          </h3>
          {selectedKey && (
            <button type="button" onClick={() => setSelectedKey(null)} className="link text-sm">
              Show whole month
            </button>
          )}
        </div>
        {panelEvents.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {panelEvents.map((ev) => (
              <li key={ev.slug}>
                <EventCard event={ev} variant="row" headingLevel="h3" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-10 text-center">
            <CalendarX2 className="h-8 w-8 text-navy-300" aria-hidden />
            <p className="mt-3 font-semibold text-navy-900">{selectedKey ? 'No events on this day' : 'No events this month'}</p>
            <p className="mt-1 text-sm text-ink-muted">Try another {selectedKey ? 'date' : 'month'}, or switch to list view to see all upcoming events.</p>
            {nextAfter && (
              <button
                type="button"
                onClick={() => {
                  const d = new Date(nextAfter.startDate);
                  setMonth(startOfMonth(d));
                  setFocusedKey(toDayKey(d));
                  setSelectedKey(toDayKey(d));
                }}
                className="btn btn-sm btn-secondary mt-4"
              >
                Jump to next event: {monthTitle.format(new Date(nextAfter.startDate))}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
