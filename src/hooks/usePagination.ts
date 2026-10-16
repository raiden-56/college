import { useMemo, useState } from 'react';

export interface PaginationState<T> {
  page: number;
  pageCount: number;
  pageItems: T[];
  total: number;
  /** 1-based index of the first item on the page (0 when empty) */
  start: number;
  /** 1-based index of the last item on the page */
  end: number;
  setPage: (page: number) => void;
}

/** Client-side pagination. The page clamps automatically when the list shrinks (e.g. after filtering). */
export function usePagination<T>(items: T[], pageSize = 9): PaginationState<T> {
  const [requestedPage, setRequestedPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pageCount);

  const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);

  return {
    page,
    pageCount,
    pageItems,
    total: items.length,
    start: items.length === 0 ? 0 : (page - 1) * pageSize + 1,
    end: Math.min(page * pageSize, items.length),
    setPage: setRequestedPage,
  };
}
