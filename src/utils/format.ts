const inrFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const numberFormatter = new Intl.NumberFormat('en-IN');

export const formatINR = (amount: number) => inrFormatter.format(amount);
export const formatNumber = (n: number) => numberFormatter.format(n);

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const longDateFormatter = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });

const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value.length === 10 ? `${value}T00:00:00` : value));

export const formatDate = (value: string | Date) => dateFormatter.format(toDate(value));
export const formatLongDate = (value: string | Date) => longDateFormatter.format(toDate(value));
export const formatTime = (value: string | Date) => timeFormatter.format(toDate(value));

/** "14 Nov 2026" or "20 – 22 Nov 2026" or "30 Jan – 1 Feb 2027" */
export const formatDateRange = (start: string, end?: string) => {
  const s = toDate(start);
  if (!end) return formatDate(s);
  const e = toDate(end);
  if (s.toDateString() === e.toDateString()) return formatDate(s);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) return `${s.getDate()} – ${formatDate(e)}`;
  const sameYear = s.getFullYear() === e.getFullYear();
  const startLabel = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) }).format(s);
  return `${startLabel} – ${formatDate(e)}`;
};

/** Month and day parts for date badges on cards. */
export const dateParts = (value: string) => {
  const d = toDate(value);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(d),
    year: d.getFullYear(),
  };
};

export const formatDuration = (years: number) => {
  if (years < 1) return `${Math.round(years * 12)} months`;
  return `${years} ${years === 1 ? 'year' : 'years'}`;
};

export const formatFileSize = (kb?: number) => {
  if (!kb) return '';
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
};

export const initials = (name: string) =>
  name
    .replace(/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

export const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${formatNumber(count)} ${count === 1 ? singular : plural}`;
