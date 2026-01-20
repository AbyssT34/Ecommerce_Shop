import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './customer/components/layout/layout';
import { HomePage } from './customer/pages/home_Page';
import { LoginPage } from './customer/pages/login_Page';
import { RegisterPage } from './customer/pages/register_Page';

function App() {
  return (
    <Routes>
      {/* Auth Routes (No Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes (With Layout) */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-text-primary">Products - Coming Soon</h1></div>} />
              <Route path="/recipes" element={<div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-text-primary">AI Recipes - Coming Soon</h1></div>} />
              <Route path="/cart" element={<div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-text-primary">Cart - Coming Soon</h1></div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
