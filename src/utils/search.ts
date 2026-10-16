/** Lower-case, strip diacritics and punctuation so "B.Tech" matches "btech". */
export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Relevance score for a query against weighted fields. Returns 0 when not every query term matches.
 * Title matches outrank body matches; prefix matches outrank substring matches.
 */
export const scoreMatch = (query: string, fields: { text: string; weight?: number }[]) => {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return 0;
  const prepared = fields.map((f) => ({ text: normalize(f.text), weight: f.weight ?? 1 }));
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const field of prepared) {
      if (!field.text.includes(term)) continue;
      const words = field.text.split(' ');
      const score = (words.some((w) => w === term) ? 3 : words.some((w) => w.startsWith(term)) ? 2 : 1) * field.weight;
      best = Math.max(best, score);
    }
    if (best === 0) return 0;
    total += best;
  }
  return total;
};

/** Simple contains-all-terms filter for list pages. */
export const matchesQuery = (query: string, ...texts: (string | undefined)[]) => {
  const terms = normalize(query).split(' ').filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalize(texts.filter(Boolean).join(' '));
  return terms.every((t) => haystack.includes(t));
};
