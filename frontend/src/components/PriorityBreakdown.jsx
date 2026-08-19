const BARS = [
  { key: 'Low', label: 'Low', color: '#f59e0b' },
  { key: 'Medium', label: 'Medium', color: '#d97706' },
  { key: 'High', label: 'High', color: '#92400e' },
];

export default function PriorityBreakdown({ byPriority, total }) {
  if (!total) {
    return (
      <div className="flex items-center justify-center h-24 text-sm text-gray-400 dark:text-gray-500">
        No tasks yet
      </div>
    );
  }

  const max = Math.max(...BARS.map((b) => byPriority[b.key] || 0), 1);

  return (
    <div className="space-y-3">
      {BARS.map((bar) => {
        const count = byPriority[bar.key] || 0;
        const pct = (count / max) * 100;
        return (
          <div key={bar.key} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-xs text-gray-600 dark:text-gray-400">{bar.label}</span>
            <div className="group relative flex-1 h-4 rounded-sm bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-sm transition-all"
                style={{ width: `${pct}%`, backgroundColor: bar.color, minWidth: count ? '4px' : 0 }}
              />
              <div className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 dark:bg-gray-100 px-2 py-1 text-xs font-medium text-white dark:text-gray-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10">
                {bar.label}: <span className="font-semibold">{count}</span> task{count === 1 ? '' : 's'}
              </div>
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-semibold text-gray-900 dark:text-gray-100">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
