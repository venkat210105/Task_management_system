const CARDS = [
  { key: 'total', label: 'Total Tasks', color: 'text-indigo-600 dark:text-indigo-400' },
  { key: 'completed', label: 'Completed', color: 'text-green-600 dark:text-green-400' },
  { key: 'pending', label: 'Pending', color: 'text-amber-600 dark:text-amber-400' },
  { key: 'completionPercentage', label: 'Completion %', color: 'text-purple-600 dark:text-purple-400', suffix: '%' },
];

export default function AnalyticsCards({ analytics, loading }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center"
        >
          <div className={`text-2xl font-bold ${card.color}`}>
            {loading ? '—' : `${analytics?.[card.key] ?? 0}${card.suffix || ''}`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
