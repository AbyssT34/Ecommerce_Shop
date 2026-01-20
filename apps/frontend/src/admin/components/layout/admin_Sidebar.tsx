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
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
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
        <NavItem to="/admin" icon="📊" label="Dashboard" />
        <NavItem to="/admin/products" icon="🛍️" label="Products" />
        <NavItem to="/admin/categories" icon="📁" label="Categories" />
        <NavItem to="/admin/ingredients" icon="🥗" label="Ingredients" />
        <NavItem to="/admin/recipes" icon="📖" label="Recipes" />
        <NavItem to="/admin/orders" icon="📦" label="Orders" />
        <NavItem to="/admin/users" icon="👥" label="Users" />

        <div className="pt-4 mt-4 border-t border-white/10">
          <NavItem to="/" icon="🏠" label="Back to Store" />
        </div>
      </nav>
    </aside>
  );
}
