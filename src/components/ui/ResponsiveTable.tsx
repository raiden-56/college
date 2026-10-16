import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Right-align numeric columns */
  numeric?: boolean;
  className?: string;
}

interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Required: describes the table for screen readers (can be visually hidden) */
  caption: ReactNode;
  captionHidden?: boolean;
  footer?: ReactNode;
  className?: string;
  /** On small screens, render each row as a stacked card instead of a scrolling table */
  stackOnMobile?: boolean;
}

/**
 * Semantic data table. On mobile it either scrolls horizontally inside a focusable region or
 * stacks rows as labelled cards (`stackOnMobile`).
 */
export function ResponsiveTable<T>({ columns, rows, rowKey, caption, captionHidden, footer, className, stackOnMobile }: ResponsiveTableProps<T>) {
  return (
    <div className={className}>
      {stackOnMobile && (
        <ul className="space-y-3 md:hidden" aria-label={typeof caption === 'string' ? caption : undefined}>
          {rows.map((row) => (
            <li key={rowKey(row)} className="card p-4">
              <dl className="space-y-2">
                {columns.map((c) => (
                  <div key={c.key} className="flex justify-between gap-4 text-sm">
                    <dt className="font-semibold text-navy-900">{c.header}</dt>
                    <dd className={cn('text-right text-ink-soft', c.numeric && 'tabular-nums')}>{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
          {footer && <li className="rounded-xl bg-navy-50 p-4 text-sm font-bold text-navy-950">{footer}</li>}
        </ul>
      )}
      <div
        className={cn('overflow-x-auto rounded-xl border border-navy-100 bg-white shadow-card', stackOnMobile && 'hidden md:block')}
        role="region"
        aria-label={typeof caption === 'string' ? `${caption} (scrollable)` : 'Scrollable table'}
        tabIndex={0}
      >
        <table className="table-base min-w-[560px]">
          <caption className={cn('px-4 pb-3 pt-4 text-left text-sm font-semibold text-navy-900', captionHidden && 'sr-only')}>{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn(c.numeric && 'text-right', c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((c, i) =>
                  i === 0 ? (
                    <th key={c.key} scope="row" className={cn('border-b border-navy-100 px-4 py-3 text-left font-semibold text-navy-900', c.className)}>
                      {c.cell(row)}
                    </th>
                  ) : (
                    <td key={c.key} className={cn(c.numeric && 'text-right tabular-nums', c.className)}>
                      {c.cell(row)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
          {footer && (
            <tfoot>
              <tr>
                <td colSpan={columns.length}>{footer}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
