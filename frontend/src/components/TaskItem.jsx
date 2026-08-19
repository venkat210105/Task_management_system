const STATUS_STYLES = {
  Todo: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const PRIORITY_STYLES = {
  Low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TaskItem({ task, onEdit, onDelete, onComplete }) {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <td className="py-3 px-4">
        <div className="font-medium text-gray-900 dark:text-gray-100">{task.title}</div>
        {task.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
            {task.description}
          </div>
        )}
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>
          {task.status}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(task.dueDate)}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          {task.status !== 'Done' && (
            <button
              onClick={() => onComplete(task)}
              className="text-xs font-medium text-green-600 dark:text-green-400 hover:underline"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
