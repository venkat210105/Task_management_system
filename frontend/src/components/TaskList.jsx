import TaskItem from './TaskItem';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, loading, error, onEdit, onDelete, onComplete }) {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
        Loading tasks…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
        No tasks found. Create your first task to get started.
      </div>
    );
  }

  return (
    <>
      {/* Card layout for small screens */}
      <div className="grid gap-3 sm:hidden" data-testid="task-cards">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
          />
        ))}
      </div>

      {/* Table layout for sm+ screens */}
      <div
        className="hidden sm:block overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        data-testid="task-table"
      >
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400">
              <th className="py-2.5 px-4 font-medium">Title</th>
              <th className="py-2.5 px-4 font-medium">Status</th>
              <th className="py-2.5 px-4 font-medium">Priority</th>
              <th className="py-2.5 px-4 font-medium">Due Date</th>
              <th className="py-2.5 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
