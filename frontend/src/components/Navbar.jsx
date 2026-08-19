import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Task Tracker
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
            {user?.name}
          </span>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-md p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
          >
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
