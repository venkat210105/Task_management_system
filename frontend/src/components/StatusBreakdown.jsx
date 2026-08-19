const SEGMENTS = [
  { key: 'Todo', label: 'Todo', light: '#f59e0b', dark: '#d97706' },
  { key: 'In Progress', label: 'In Progress', light: '#3b82f6', dark: '#3b82f6' },
  { key: 'Done', label: 'Done', light: '#16a34a', dark: '#16a34a' },
];

export default function StatusBreakdown({ byStatus, total, dark }) {
  if (!total) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-gray-400 dark:text-gray-500">
        No tasks yet
      </div>
    );
  }

  const visible = SEGMENTS.filter((seg) => byStatus[seg.key]);

  return (
    <div>
      <div className="flex h-6 gap-[2px]" role="img" aria-label="Tasks by status">
        {visible.map((seg, i) => {
          const count = byStatus[seg.key] || 0;
          const pct = (count / total) * 100;
          const rounding =
            visible.length === 1
              ? 'rounded-md'
              : i === 0
                ? 'rounded-l-md'
                : i === visible.length - 1
                  ? 'rounded-r-md'
                  : '';
          return (
            <div
              key={seg.key}
              className={`group relative h-full transition-opacity hover:opacity-90 ${rounding}`}
              style={{ width: `${pct}%`, backgroundColor: dark ? seg.dark : seg.light }}
            >
              <div className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-100 px-2 py-1 text-xs font-medium text-white dark:text-gray-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10">
                <span className="font-semibold">{count}</span> {seg.label} ({Math.round(pct)}%)
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {SEGMENTS.map((seg) => (
          <div key={seg.key} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: dark ? seg.dark : seg.light }}
            />
            {seg.label}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{byStatus[seg.key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
