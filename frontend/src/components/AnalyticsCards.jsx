import { useTheme } from '../context/ThemeContext';
import StatusBreakdown from './StatusBreakdown';
import PriorityBreakdown from './PriorityBreakdown';

const KPI_CARDS = [
  { key: 'total', label: 'Total Tasks', color: 'text-gray-900 dark:text-gray-100' },
  { key: 'completed', label: 'Completed', color: 'text-green-600 dark:text-green-400' },
  { key: 'pending', label: 'Pending', color: 'text-amber-600 dark:text-amber-400' },
];

export default function AnalyticsCards({ analytics, loading }) {
  const { dark } = useTheme();
  const pct = analytics?.completionPercentage ?? 0;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {KPI_CARDS.map((card) => (
          <div
            key={card.key}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center"
          >
            <div className={`text-2xl font-bold ${card.color}`}>
              {loading ? '—' : analytics?.[card.key] ?? 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</div>
          </div>
        ))}

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Completion</span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {loading ? '—' : `${pct}%`}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-amber-100 dark:bg-amber-950">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${loading ? 0 : pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Tasks by status
          </h3>
          {loading ? (
            <div className="h-24 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
          ) : (
            <StatusBreakdown byStatus={analytics?.byStatus || {}} total={analytics?.total || 0} dark={dark} />
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Tasks by priority
          </h3>
          {loading ? (
            <div className="h-24 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
          ) : (
            <PriorityBreakdown byPriority={analytics?.byPriority || {}} total={analytics?.total || 0} />
          )}
        </div>
      </div>
    </div>
  );
}
