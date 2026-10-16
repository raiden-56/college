import { describe, expect, it } from 'vitest';
import { pageRange } from '../pagination';

describe('pageRange', () => {
  it('lists every page when there are 7 or fewer', () => {
    expect(pageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('inserts gaps around the current page', () => {
    expect(pageRange(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12]);
  });

  it('does not add a gap next to the first or last page', () => {
    expect(pageRange(2, 12)).toEqual([1, 2, 3, 'gap', 12]);
    expect(pageRange(12, 12)).toEqual([1, 'gap', 11, 12]);
  });
});
