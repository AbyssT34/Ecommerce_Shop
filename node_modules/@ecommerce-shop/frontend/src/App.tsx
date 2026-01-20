import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './customer/components/layout/layout';
import { HomePage } from './customer/pages/home_Page';
import { LoginPage } from './customer/pages/login_Page';
import { RegisterPage } from './customer/pages/register_Page';
import { ProductsPage } from './customer/pages/products_Page';
import { RecipesPage } from './customer/pages/recipes_Page';
import { CartPage } from './customer/pages/cart_Page';
import { CheckoutPage } from './customer/pages/checkout_Page';
import { OrdersPage } from './customer/pages/orders_Page';
import { AdminLayout } from './admin/components/layout/admin_Layout';
import { AdminDashboardPage } from './admin/pages/admin_Dashboard.page';
import { AdminProductsPage } from './admin/pages/admin_Products.page';
import { AdminOrdersPage } from './admin/pages/admin_Orders.page';
import { useAuthStore } from '@shared/store';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Auth Routes (No Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes (Protected) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboardPage />} />
                <Route path="/products" element={<AdminProductsPage />} />
                <Route path="/orders" element={<AdminOrdersPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Customer Routes (With Layout) */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
