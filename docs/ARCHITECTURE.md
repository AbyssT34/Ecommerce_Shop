# 📐 ECOMMERCE_SHOP - KIẾN TRÚC HỆ THỐNG CHI TIẾT

> **Document Version**: 2.0 - Advanced System Architecture
> **Last Updated**: 2026-01-20
> **Target Audience**: Senior Engineers, System Architects

---

## 📋 MỤC LỤC

1. [Kiến trúc Monorepo](#1-kiến-trúc-monorepo)
2. [Cấu trúc Backend (apps/backend)](#2-cấu-trúc-backend)
3. [Cấu trúc Frontend (apps/frontend)](#3-cấu-trúc-frontend)
4. [State Management Architecture](#4-state-management-architecture)
5. [API Communication Layer](#5-api-communication-layer)

---

## 1. KIẾN TRÚC MONOREPO

### 1.1 Tổng quan cấu trúc

```
Ecommerce_Shop/
├── apps/
│   ├── backend/                  # Node.js/NestJS Backend
│   └── frontend/                 # React + Vite Frontend
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # Kiến trúc chi tiết (file này)
│   ├── COMMIT_HISTORY.md         # Lịch sử commit theo giai đoạn
│   ├── DEPLOYMENT.md             # Hướng dẫn deploy
│   └── images/                   # Diagrams & Screenshots
├── database_setup.sql            # SQL script khởi tạo DB
├── recipes.json                  # Dữ liệu món ăn (seed data)
├── .env.example                  # Environment variables template
├── .gitignore
└── README.md                     # Quick start guide
```

### 1.2 Workspace Configuration

**Package Manager**: npm workspaces / Yarn workspaces

```json
// package.json (root)
{
  "name": "ecommerce-shop-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/backend",
    "apps/frontend"
  ],
  "scripts": {
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev": "concurrently \"npm:dev:*\"",
    "build:all": "npm run build --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

---

## 2. CẤU TRÚC BACKEND (apps/backend)

### 2.1 Folder Structure - NestJS Architecture

```
apps/backend/
├── src/
│   ├── main.ts                       # Application bootstrap
│   ├── app.module.ts                 # Root module
│   │
│   ├── auth/                         # 🔐 Authentication Module
│   │   ├── auth.module.ts
│   │   ├── auth_Controller.ts        # POST /auth/login, /auth/register
│   │   ├── auth_Service.ts           # JWT generation, password hashing
│   │   ├── guards/
│   │   │   ├── jwt_Auth.guard.ts     # JWT validation guard
│   │   │   └── admin_Guard.ts        # Admin role guard
│   │   ├── strategies/
│   │   │   └── jwt_Strategy.ts       # Passport JWT strategy
│   │   └── dto/
│   │       ├── login_Dto.ts
│   │       └── register_Dto.ts
│   │
│   ├── users/                        # 👤 Users Module
│   │   ├── users.module.ts
│   │   ├── users_Controller.ts       # GET /users/profile, PATCH /users/profile
│   │   ├── users_Service.ts
│   │   ├── entities/
│   │   │   └── user_Entity.ts        # TypeORM Entity
│   │   └── dto/
│   │       └── update_User.dto.ts
│   │
│   ├── products/                     # 📦 Products Module
│   │   ├── products.module.ts
│   │   ├── products_Controller.ts    # GET /products, GET /products/:id
│   │   ├── products_Service.ts       # Business logic
│   │   ├── entities/
│   │   │   ├── product_Entity.ts
│   │   │   ├── category_Entity.ts
│   │   │   ├── ingredient_Entity.ts
│   │   │   └── product_Ingredient.entity.ts
│   │   └── dto/
│   │       ├── create_Product.dto.ts
│   │       ├── update_Product.dto.ts
│   │       └── filter_Product.dto.ts
│   │
│   ├── recipes/                      # 🍳 Recipes Module (AI Logic)
│   │   ├── recipes.module.ts
│   │   ├── recipes_Controller.ts     # GET /recipes, POST /recipes/:id/suggest
│   │   ├── recipes_Service.ts        # AI suggestion logic
│   │   ├── entities/
│   │   │   └── recipe_Entity.ts
│   │   ├── dto/
│   │   │   └── filter_Recipe.dto.ts
│   │   └── helpers/
│   │       └── ai_Suggestion.helper.ts  # Core AI algorithm
│   │
│   ├── cart/                         # 🛒 Shopping Cart Module
│   │   ├── cart.module.ts
│   │   ├── cart_Controller.ts        # GET /cart, POST /cart/add, DELETE /cart/:id
│   │   ├── cart_Service.ts
│   │   ├── entities/
│   │   │   └── cart_Item.entity.ts
│   │   └── dto/
│   │       └── add_To_Cart.dto.ts
│   │
│   ├── orders/                       # 📋 Orders Module
│   │   ├── orders.module.ts
│   │   ├── orders_Controller.ts      # POST /orders, GET /orders/:id
│   │   ├── orders_Service.ts         # Stock management logic
│   │   ├── entities/
│   │   │   ├── order_Entity.ts
│   │   │   └── order_Item.entity.ts
│   │   └── dto/
│   │       ├── create_Order.dto.ts
│   │       └── update_Order_Status.dto.ts
│   │
│   ├── admin/                        # 👨‍💼 Admin Module
│   │   ├── admin.module.ts
│   │   ├── products/
│   │   │   ├── admin_Products_Controller.ts  # POST /admin/products
│   │   │   └── admin_Products_Service.ts
│   │   ├── orders/
│   │   │   ├── admin_Orders_Controller.ts    # PATCH /admin/orders/:id/approve
│   │   │   └── admin_Orders_Service.ts
│   │   └── analytics/
│   │       ├── admin_Analytics_Controller.ts # GET /admin/analytics/top-recipes
│   │       └── admin_Analytics_Service.ts
│   │
│   ├── common/                       # 🔧 Shared Utilities
│   │   ├── filters/
│   │   │   └── http_Exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform_Interceptor.ts
│   │   ├── decorators/
│   │   │   └── roles_Decorator.ts
│   │   └── pipes/
│   │       └── validation_Pipe.ts
│   │
│   ├── database/                     # 💾 Database Configuration
│   │   ├── database.module.ts        # TypeORM config
│   │   ├── migrations/               # Migration files
│   │   └── seeders/                  # Seed scripts
│   │       ├── seed_Categories.ts
│   │       ├── seed_Ingredients.ts
│   │       └── seed_Recipes.ts
│   │
│   └── config/                       # ⚙️ Configuration
│       ├── database_Config.ts
│       ├── jwt_Config.ts
│       └── cors_Config.ts
│
├── test/                             # E2E Tests
│   └── app.e2e-spec.ts
│
├── .env.example
├── .env.development
├── .env.production
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

### 2.2 Database Connection (TypeORM)

**File**: `src/database/database.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // Use migrations in production
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
```

### 2.3 Environment Variables

**File**: `apps/backend/.env.example`

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_shop

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

---

## 3. CẤU TRÚC FRONTEND (apps/frontend)

### 3.1 Folder Structure - React + Vite

```
apps/frontend/
├── public/
│   ├── images/
│   │   ├── recipes/              # Recipe images
│   │   └── products/             # Product images
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with Router
│   ├── index.css                 # Global styles + Design tokens
│   │
│   ├── customer/                 # 🛍️ STOREFRONT (User-facing)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductListPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── RecipeListPage.tsx
│   │   │   ├── RecipeDetailPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   │
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductFilter.tsx
│   │   │   │   └── ProductSkeleton.tsx
│   │   │   │
│   │   │   ├── recipe/
│   │   │   │   ├── RecipeCard.tsx
│   │   │   │   ├── RecipeGrid.tsx
│   │   │   │   ├── IngredientDrawer.tsx      # ⭐ AI Suggestion UI
│   │   │   │   ├── RecipeFilter.tsx
│   │   │   │   └── RecipeDetail.tsx
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   └── CartBubble.tsx            # Floating cart icon
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── GlassCard.tsx             # Glassmorphism card
│   │   │       ├── GlassButton.tsx
│   │   │       ├── GlassInput.tsx
│   │   │       ├── Badge.tsx
│   │   │       ├── SearchBar.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   │
│   │   └── hooks/
│   │       ├── useCart.ts                    # Cart state management
│   │       ├── useAIRecipe.ts                # AI suggestion logic hook
│   │       ├── useAuth.ts                    # Auth state
│   │       └── useDebounce.ts
│   │
│   ├── admin/                    # 👨‍💼 ADMIN DASHBOARD
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx             # Overview + KPIs
│   │   │   ├── ProductManagementPage.tsx
│   │   │   ├── ProductFormPage.tsx           # Create/Edit Product
│   │   │   ├── OrderManagementPage.tsx
│   │   │   └── AnalyticsPage.tsx             # Top Recipes Report
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AdminSidebar.tsx          # Collapsible sidebar
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   └── AdminLayout.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx             # KPI cards
│   │   │   │   ├── ChartWidget.tsx           # Chart.js wrapper
│   │   │   │   └── RecentOrders.tsx
│   │   │   │
│   │   │   ├── product/
│   │   │   │   ├── ProductTable.tsx
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   ├── IngredientMappingInput.tsx # ⭐ Searchable Dropdown
│   │   │   │   ├── LowStockBadge.tsx
│   │   │   │   └── ImageUploader.tsx
│   │   │   │
│   │   │   ├── order/
│   │   │   │   ├── OrderTable.tsx
│   │   │   │   ├── OrderDetailModal.tsx
│   │   │   │   └── OrderStatusButton.tsx     # Approve/Reject
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── AdminTable.tsx            # Reusable table
│   │   │       ├── AdminModal.tsx
│   │   │       ├── AdminButton.tsx
│   │   │       └── Pagination.tsx
│   │   │
│   │   └── hooks/
│   │       ├── useProducts.ts
│   │       ├── useOrders.ts
│   │       └── useIngredients.ts
│   │
│   ├── shared/                   # 🔧 SHARED MODULES
│   │   ├── api/
│   │   │   ├── axios.config.ts               # Axios instance + interceptors
│   │   │   ├── auth.api.ts
│   │   │   ├── products.api.ts
│   │   │   ├── recipes.api.ts
│   │   │   ├── cart.api.ts
│   │   │   └── orders.api.ts
│   │   │
│   │   ├── types/
│   │   │   ├── user.types.ts
│   │   │   ├── product.types.ts
│   │   │   ├── recipe.types.ts
│   │   │   ├── order.types.ts
│   │   │   └── api-response.types.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── formatCurrency.ts             # VNĐ formatting
│   │   │   ├── formatDate.ts
│   │   │   ├── generateOrderNumber.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── roles.ts                      # RBAC constants
│   │   │   ├── orderStatus.ts
│   │   │   └── apiEndpoints.ts
│   │   │
│   │   └── store/                            # Zustand Store
│   │       ├── authStore.ts                  # Authentication state
│   │       ├── cartStore.ts                  # Shopping cart state
│   │       └── uiStore.ts                    # UI state (modals, toasts)
│   │
│   └── routes/                   # 🚏 Routing Configuration
│       ├── AppRoutes.tsx                     # Main router
│       ├── PrivateRoute.tsx                  # Auth guard
│       └── AdminRoute.tsx                    # Admin guard
│
├── .env.example
├── .env.development
├── .env.production
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

### 3.2 Vite Configuration

**File**: `apps/frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@customer': path.resolve(__dirname, './src/customer'),
      '@admin': path.resolve(__dirname, './src/admin'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### 3.3 Tailwind Configuration

**File**: `apps/frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark SaaS palette
        bgPrimary: '#0F172A',
        bgSecondary: '#1E293B',
        bgTertiary: '#334155',
        primary: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        secondary: {
          500: '#F97316',
          600: '#EA580C',
        },
        accent: {
          teal: '#14B8A6',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
```

---

## 4. STATE MANAGEMENT ARCHITECTURE

### 4.1 Zustand Stores

**File**: `src/shared/store/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  full_name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**File**: `src/shared/store/cartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalAmount: 0,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.product_id === item.product_id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [], totalAmount: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

---

## 5. API COMMUNICATION LAYER

### 5.1 Axios Configuration with Interceptors

**File**: `src/shared/api/axios.config.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '@shared/store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 5.2 React Query Integration

**File**: `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## 📝 NEXT STEPS

1. Review [COMMIT_HISTORY.md](./COMMIT_HISTORY.md) để xem lộ trình triển khai chi tiết
2. Setup Backend: `cd apps/backend && npm install`
3. Setup Frontend: `cd apps/frontend && npm install`
4. Import database: `mysql -u root -p < database_setup.sql`
5. Start development: `npm run dev` (from root)

---

**Document Maintainer**: Senior Engineering Team
**Contact**: dev@ecommerce-shop.com
