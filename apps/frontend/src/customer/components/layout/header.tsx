import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '@shared/store';
import { GlassButton } from '@shared/components';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-text-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold gradient-text">
              Ecommerce Shop
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              to="/recipes"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Gợi ý AI
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 glass rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <svg
                className="w-6 h-6 text-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-secondary">
                  {user?.fullName || user?.email}
                </span>
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <GlassButton variant="accent" size="sm">
                      Admin
                    </GlassButton>
                  </Link>
                )}
                <GlassButton variant="ghost" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </GlassButton>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <GlassButton variant="ghost" size="sm">
                    Đăng nhập
                  </GlassButton>
                </Link>
                <Link to="/register">
                  <GlassButton variant="primary" size="sm">
                    Đăng ký
                  </GlassButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
