import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';
import { fetchSystemStats, fetchAllUsers, fetchAllTasks } from '../api/admin';

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

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total Users' },
  { key: 'totalTasks', label: 'Total Tasks' },
  { key: 'completedTasks', label: 'Completed' },
  { key: 'pendingTasks', label: 'Pending' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    const res = await fetchAllTasks({ page, limit: 10 });
    setTasks(res.data);
    setPagination(res.pagination);
  }, [page]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsRes, usersRes] = await Promise.all([fetchSystemStats(), fetchAllUsers()]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        await loadTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Admin</h1>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {loading ? '—' : stats?.[card.key] ?? 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg mb-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 px-4 pt-4 pb-2">
            Users
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="py-2.5 px-4 font-medium">Name</th>
                <th className="py-2.5 px-4 font-medium">Email</th>
                <th className="py-2.5 px-4 font-medium">Role</th>
                <th className="py-2.5 px-4 font-medium">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{u.taskCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-x-auto">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 px-4 pt-4 pb-2">
            All Tasks
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="py-2.5 px-4 font-medium">Title</th>
                <th className="py-2.5 px-4 font-medium">Owner</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{t.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {t.user?.name || 'Unknown'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="py-3">
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={setPage} />
          </div>
        </div>
      </main>
    </div>
  );
}
