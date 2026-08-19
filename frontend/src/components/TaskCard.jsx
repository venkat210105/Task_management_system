const STATUS_STYLES = {
  Todo: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const PRIORITY_STYLES = {
  Low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TaskCard({ task, onEdit, onDelete, onComplete }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{task.title}</div>
          {task.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {task.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          {task.status}
        </span>
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Due {formatDate(task.dueDate)}</span>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        {task.status !== 'Done' && (
          <button
            onClick={() => onComplete(task)}
            className="text-xs font-medium text-green-600 dark:text-green-400"
          >
            Complete
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-xs font-medium text-red-600 dark:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
