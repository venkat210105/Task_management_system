const inputClass =
  'rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

export default function FilterBar({ filters, onChange, onNewTask }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value, page: 1 });

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Search by title…"
        value={filters.search}
        onChange={set('search')}
        className={`${inputClass} flex-1 min-w-[180px]`}
      />

      <select value={filters.status} onChange={set('status')} className={inputClass}>
        <option value="">All statuses</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select value={filters.priority} onChange={set('priority')} className={inputClass}>
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select value={filters.sortBy} onChange={set('sortBy')} className={inputClass}>
        <option value="createdAt">Sort: Created</option>
        <option value="dueDate">Sort: Due date</option>
        <option value="priority">Sort: Priority</option>
        <option value="title">Sort: Title</option>
      </select>

      <select value={filters.order} onChange={set('order')} className={inputClass}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>

      <button
        onClick={onNewTask}
        className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md px-4 py-2 transition"
      >
        + New Task
      </button>
    </div>
  );
}
