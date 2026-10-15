'use client';

import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  className = '',
  mobileCardRender, // Optional mobile card render function for custom compact cards
}) {
  return (
    <div className={clsx('w-full', className)}>
      {/* Mobile Card View (if mobileCardRender is provided) */}
      {mobileCardRender && (
        <div className="block md:hidden space-y-3">
          {isLoading ? (
            <div className="card text-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
              <p className="text-xs text-slate-500 mt-2 font-medium">Loading records...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="card text-center py-10 text-slate-500 text-sm">
              {emptyMessage}
            </div>
          ) : (
            data.map((row, rowIdx) => (
              <div
                key={row.id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={clsx(
                  'card p-4 transition-all',
                  onRowClick && 'cursor-pointer hover:border-blue-300 active:scale-[0.99]'
                )}
              >
                {mobileCardRender(row)}
              </div>
            ))
          )}
        </div>
      )}

      {/* Standard / Horizontally Scrollable Table Container */}
      <div className={clsx('table-container', mobileCardRender && 'hidden md:block')}>
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={clsx(
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length || 1} className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Loading records...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length || 1} className="text-center py-12 text-slate-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={clsx(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-blue-50/40'
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={clsx(
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                        col.cellClassName
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
