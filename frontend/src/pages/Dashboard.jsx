import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import AnalyticsCards from '../components/AnalyticsCards';
import FilterBar from '../components/FilterBar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Pagination from '../components/Pagination';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskComplete,
  fetchAnalytics,
} from '../api/tasks';

const DEFAULT_FILTERS = {
  status: '',
  priority: '',
  search: '',
  sortBy: 'createdAt',
  order: 'desc',
  page: 1,
};

export default function Dashboard() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, limit: 10 };
      Object.keys(params).forEach((k) => params[k] === '' && delete params[k]);
      const res = await fetchTasks(params);
      setTasks(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetchAnalytics();
      setAnalytics(res.data);
    } catch {
      // Analytics failure shouldn't block the task list
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleNewTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (form) => {
    const payload = { ...form, dueDate: form.dueDate || null };
    if (editingTask) {
      await updateTask(editingTask._id, payload);
    } else {
      await createTask(payload);
    }
    setFormOpen(false);
    setEditingTask(null);
    await Promise.all([loadTasks(), loadAnalytics()]);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    await deleteTask(task._id);
    await Promise.all([loadTasks(), loadAnalytics()]);
  };

  const handleComplete = async (task) => {
    await markTaskComplete(task._id);
    await Promise.all([loadTasks(), loadAnalytics()]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <AnalyticsCards analytics={analytics} loading={analyticsLoading} />
        <FilterBar filters={filters} onChange={setFilters} onNewTask={handleNewTask} />
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={(page) => setFilters({ ...filters, page })}
        />
      </main>
      <TaskForm
        open={formOpen}
        task={editingTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
