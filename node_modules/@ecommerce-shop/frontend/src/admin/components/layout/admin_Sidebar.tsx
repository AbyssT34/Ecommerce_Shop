import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
          ? 'bg-gradient-accent text-white'
          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

export function AdminSidebar() {
  return (
    <aside className="w-64 h-screen glass border-r border-white/10 fixed left-0 top-[73px] overflow-y-auto">
      <nav className="p-4 space-y-2">
        <NavItem to="/admin" icon="📊" label="Tổng quan" />
        <NavItem to="/admin/products" icon="🛍️" label="Sản phẩm" />
        <NavItem to="/admin/categories" icon="📁" label="Danh mục" />
        <NavItem to="/admin/ingredients" icon="🥗" label="Nguyên liệu" />
        <NavItem to="/admin/recipes" icon="📖" label="Công thức" />
        <NavItem to="/admin/orders" icon="📦" label="Đơn hàng" />
        <NavItem to="/admin/users" icon="👥" label="Người dùng" />

        <div className="pt-4 mt-4 border-t border-white/10">
          <NavItem to="/" icon="🏠" label="Trang chủ" />
        </div>
      </nav>
    </aside>
  );
}
