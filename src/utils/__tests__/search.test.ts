import { describe, expect, it } from 'vitest';
import { matchesQuery, normalize, scoreMatch } from '../search';
import { groupResults, searchSite } from '../searchIndex';

describe('normalize', () => {
  it('lower-cases and strips punctuation so B.Tech matches btech', () => {
    expect(normalize('B.Tech. CSE!')).toBe('btech cse');
    expect(normalize('  Café   Économie ')).toBe('cafe economie');
  });
});

describe('scoreMatch', () => {
  it('returns 0 unless every term matches', () => {
    expect(scoreMatch('computer law', [{ text: 'Computer Science' }])).toBe(0);
    expect(scoreMatch('computer', [{ text: 'Computer Science' }])).toBeGreaterThan(0);
  });

  it('ranks exact word > prefix > substring and respects weights', () => {
    const exact = scoreMatch('law', [{ text: 'School of Law' }]);
    const prefix = scoreMatch('law', [{ text: 'Lawyer careers' }]);
    const sub = scoreMatch('law', [{ text: 'Outlaws' }]);
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(sub);
    expect(scoreMatch('law', [{ text: 'law', weight: 4 }])).toBe(exact * 4);
  });
});

describe('matchesQuery', () => {
  it('matches all terms across several fields', () => {
    expect(matchesQuery('mba finance', 'Master of Business Administration (MBA)', 'Finance specialisation')).toBe(true);
    expect(matchesQuery('mba law', 'MBA')).toBe(false);
    expect(matchesQuery('', 'anything')).toBe(true);
  });
});

describe('site search', () => {
  it('finds programs by short name and puts them first in their group', () => {
    const results = searchSite('MBA');
    expect(results[0]?.title).toMatch(/Business Administration/);
    expect(results.some((r) => r.type === 'Program')).toBe(true);
  });

  it('finds faculty, notices and FAQs', () => {
    expect(searchSite('Ananya').some((r) => r.type === 'Faculty')).toBe(true);
    expect(searchSite('examination timetable').some((r) => r.type === 'News & Notices')).toBe(true);
    expect(searchSite('hostel').some((r) => r.type === 'FAQ')).toBe(true);
  });

  it('returns nothing for empty or nonsense queries', () => {
    expect(searchSite('   ')).toEqual([]);
    expect(searchSite('zzqxv')).toEqual([]);
  });

  it('groups results in a stable display order', () => {
    const groups = groupResults(searchSite('computer'));
    const order = groups.map((g) => g.type);
    expect(order.indexOf('Program')).toBeLessThan(order.indexOf('Faculty') === -1 ? Infinity : order.indexOf('Faculty'));
    groups.forEach((g) => expect(g.items.length).toBeGreaterThan(0));
  });
});
