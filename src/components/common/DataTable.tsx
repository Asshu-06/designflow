// src/components/common/DataTable.tsx
import React from 'react';

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  render: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyState,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-[#262C34] bg-[#111418] ${className}`}>
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#262C34] bg-[#171B21]/60 text-[#9CA3AF] uppercase text-[10px] font-mono tracking-wider">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2.5 px-4 font-semibold ${col.headerClassName || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#262C34]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-[#667085]">
                {emptyState || 'No records found.'}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={keyExtractor(row, idx)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-100 ${
                  onRowClick ? 'cursor-pointer hover:bg-[#171B21]' : 'hover:bg-[#171B21]/50'
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-4 text-[#F3F4F6] ${col.className || ''}`}>
                    {col.render(row, idx)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
