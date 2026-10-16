import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePagination } from '../usePagination';

const items = Array.from({ length: 23 }, (_, i) => i + 1);

describe('usePagination', () => {
  it('slices items into pages and reports the visible range', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.pageCount).toBe(3);
    expect(result.current.pageItems).toEqual(items.slice(0, 10));
    expect([result.current.start, result.current.end, result.current.total]).toEqual([1, 10, 23]);

    act(() => result.current.setPage(3));
    expect(result.current.pageItems).toEqual([21, 22, 23]);
    expect([result.current.start, result.current.end]).toEqual([21, 23]);
  });

  it('clamps the page when the list shrinks after filtering', () => {
    const { result, rerender } = renderHook(({ list }) => usePagination(list, 10), { initialProps: { list: items } });
    act(() => result.current.setPage(3));
    rerender({ list: items.slice(0, 5) });
    expect(result.current.page).toBe(1);
    expect(result.current.pageItems).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles empty lists', () => {
    const { result } = renderHook(() => usePagination([], 10));
    expect(result.current).toMatchObject({ page: 1, pageCount: 1, start: 0, end: 0, total: 0 });
  });
});
