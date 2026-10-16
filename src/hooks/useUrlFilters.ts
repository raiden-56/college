import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Filter state stored in the URL query string so filtered views are shareable and survive refresh.
 * Values equal to their default are removed from the URL.
 *
 *   const [filters, setFilter, resetFilters, activeCount] = useUrlFilters({ q: '', level: 'all' });
 */
export function useUrlFilters<T extends Record<string, string>>(defaults: T) {
  const [params, setParams] = useSearchParams();
  // Serialise so callers can pass an inline object literal without causing re-renders.
  const defaultsKey = JSON.stringify(defaults);

  const values = useMemo(() => {
    const parsed = JSON.parse(defaultsKey) as T;
    const result = { ...parsed };
    (Object.keys(parsed) as (keyof T)[]).forEach((key) => {
      const v = params.get(key as string);
      if (v !== null) result[key] = v as T[keyof T];
    });
    return result;
  }, [params, defaultsKey]);

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const parsed = JSON.parse(defaultsKey) as T;
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === '' || value === parsed[key]) next.delete(key as string);
          else next.set(key as string, value);
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setParams, defaultsKey],
  );

  const reset = useCallback(() => {
    const parsed = JSON.parse(defaultsKey) as T;
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.keys(parsed).forEach((k) => next.delete(k));
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [setParams, defaultsKey]);

  const parsedDefaults = JSON.parse(defaultsKey) as T;
  const activeCount = (Object.keys(values) as (keyof T)[]).filter((k) => values[k] !== parsedDefaults[k]).length;

  return [values, setValue, reset, activeCount] as const;
}
