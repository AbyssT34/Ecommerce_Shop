import { Link } from 'react-router-dom';
import { useAuthStore } from '@shared/store';

export function AdminHeader() {
  const { user, logout } = useAuthStore();

  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">🛡️</span>
            </div>
            <span className="text-xl font-bold gradient-text">Admin Panel</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-text-primary font-medium">{user?.fullName}</p>
              <p className="text-text-secondary text-xs">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 glass rounded-lg text-text-primary hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
