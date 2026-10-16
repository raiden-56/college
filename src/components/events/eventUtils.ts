import { siteConfig, fullAddress } from '@/config/site';
import type { CollegeEvent, EventCategory } from '@/types';

/** Category colour classes (kept as literal strings so Tailwind can see them). */
export const categoryStyles: Record<EventCategory, { dot: string; chip: string }> = {
  Workshop: { dot: 'bg-royal-600', chip: 'bg-royal-50 text-royal-800 border-royal-200' },
  Seminar: { dot: 'bg-sky-500', chip: 'bg-sky-50 text-sky-800 border-sky-200' },
  Sports: { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  Cultural: { dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-800 border-rose-200' },
  Conference: { dot: 'bg-gold-500', chip: 'bg-gold-50 text-gold-800 border-gold-200' },
  Admissions: { dot: 'bg-navy-700', chip: 'bg-navy-50 text-navy-800 border-navy-200' },
  Alumni: { dot: 'bg-violet-500', chip: 'bg-violet-50 text-violet-800 border-violet-200' },
};

/** Local calendar-day key, e.g. "2026-11-14". */
export const toDayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromDayKey = (key: string) => new Date(`${key}T00:00:00`);
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/** Every calendar day (local time) an event touches, so multi-day events appear on each date. */
export const eventDayKeys = (e: CollegeEvent) => {
  const start = new Date(e.startDate);
  const end = new Date(e.endDate ?? e.startDate);
  const keys: string[] = [];
  for (let d = new Date(start.getFullYear(), start.getMonth(), start.getDate()); d <= end && keys.length < 60; d = addDays(d, 1)) keys.push(toDayKey(d));
  return keys.length ? keys : [toDayKey(start)];
};

export const groupEventsByDay = (events: CollegeEvent[]) => {
  const map = new Map<string, CollegeEvent[]>();
  events.forEach((e) =>
    eventDayKeys(e).forEach((k) => {
      const list = map.get(k) ?? [];
      list.push(e);
      map.set(k, list);
    }),
  );
  map.forEach((list) => list.sort((a, b) => a.startDate.localeCompare(b.startDate)));
  return map;
};

export const isPastEvent = (e: CollegeEvent, now: Date = new Date()) => new Date(e.endDate ?? e.startDate).getTime() < now.getTime();

/** Events without an end time are assumed to last two hours for calendar files. */
export const eventEnd = (e: CollegeEvent) => (e.endDate ? new Date(e.endDate) : new Date(new Date(e.startDate).getTime() + 2 * 60 * 60 * 1000));

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

/** RFC 5545 calendar file for one event (times in UTC). */
export const buildIcs = (e: CollegeEvent) => {
  const url = `${siteConfig.url}/events/${e.slug}`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${icsText(siteConfig.shortName)}//Events//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.slug}@${new URL(siteConfig.url).hostname}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(new Date(e.startDate))}`,
    `DTEND:${icsDate(eventEnd(e))}`,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText(`${e.summary}\n\nDetails: ${url}`)}`,
    `LOCATION:${icsText(`${e.venue}, ${fullAddress}`)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
};

/** Generates the .ics client-side and triggers a download. */
export const downloadIcs = (e: CollegeEvent) => {
  const blob = new Blob([buildIcs(e)], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `${e.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
};

/** Map search for the campus (venues inside campus are not individually geocoded). */
export const campusMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapsQuery)}`;
