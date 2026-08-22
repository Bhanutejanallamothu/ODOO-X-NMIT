import React from 'react';

const Table = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-[10px] bg-paper-surface border border-paper-border shadow-paper ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/50">
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-5 py-3 text-[11px] font-bold text-paper-muted uppercase tracking-widest bg-paper-raised/50"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/40 text-[13px] text-paper-text">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-paper-muted font-medium">Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-paper-muted font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-paper-raised transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-5 py-3.5 whitespace-nowrap">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
