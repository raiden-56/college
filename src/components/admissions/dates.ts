import { importantDates } from '@/data/admissions';

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export type DateStatus = 'past' | 'next' | 'upcoming';

/** Important admission dates annotated with past / next / upcoming status relative to today. */
export const datesWithStatus = (now: Date = startOfToday()) => {
  const withTime = importantDates.map((d) => ({ ...d, time: new Date(`${d.date}T00:00:00`).getTime() }));
  const nextIndex = withTime.findIndex((d) => d.time >= now.getTime());
  return withTime.map((d, i) => ({
    ...d,
    status: (d.time < now.getTime() ? 'past' : i === nextIndex ? 'next' : 'upcoming') as DateStatus,
  }));
};
