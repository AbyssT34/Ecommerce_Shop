# 📜 LỊCH SỬ COMMIT & LỘ TRÌNH TRIỂN KHAI

> **Convention**: Conventional Commits (https://www.conventionalcommits.org/)
> **Format**: `<type>(<scope>): <subject>`

---

## 📋 MỤC LỤC

1. [Phase 0: Project Initialization](#phase-0-project-initialization)
2. [Phase 1: Backend Foundation](#phase-1-backend-foundation)
3. [Phase 2: Frontend Foundation](#phase-2-frontend-foundation)
4. [Phase 3: Core Features - Backend](#phase-3-core-features---backend)
5. [Phase 4: Core Features - Frontend](#phase-4-core-features---frontend)
6. [Phase 5: Admin Dashboard](#phase-5-admin-dashboard)
7. [Phase 6: AI Recipe Suggestion](#phase-6-ai-recipe-suggestion)
8. [Phase 7: Testing & Optimization](#phase-7-testing--optimization)

---

## PHASE 0: PROJECT INITIALIZATION

**Timeline**: Week 1 - Day 1-2

### 📦 Commit List

```bash
# 1. Khởi tạo Monorepo
git commit -m "chore: initialize monorepo structure with workspaces"
# Files: package.json (root), .gitignore, README.md

# 2. Tạo documentation ban đầu
git commit -m "docs: add initial project specification and architecture"
# Files:
#   - ecommerce_shop_specification.md
#   - docs/ARCHITECTURE.md
#   - docs/COMMIT_HISTORY.md

# 3. Setup database schema
git commit -m "feat(db): create database schema and seed data script"
# Files: database_setup.sql

# 4. Add recipe data
git commit -m "feat(data): add recipes.json with 50 Vietnamese dishes"
# Files: recipes.json

# 5. Environment configuration
git commit -m "chore: add environment configuration templates"
# Files: .env.example
```

---

## PHASE 1: BACKEND FOUNDATION

**Timeline**: Week 1 - Day 3-5

### 🔧 Backend Setup

```bash
# 1. Initialize NestJS project
git commit -m "feat(backend): initialize NestJS project with TypeScript"
# Directory: apps/backend/
# Files: nest-cli.json, tsconfig.json, package.json

# 2. Configure TypeORM with MySQL
git commit -m "feat(backend): configure TypeORM database connection"
# Files:
#   - apps/backend/src/database/database.module.ts
#   - apps/backend/src/database/database.config.ts

# 3. Create base entities
git commit -m "feat(backend): create database entities (User, Product, Category, Ingredient)"
# Files:
#   - apps/backend/src/users/entities/user.entity.ts
#   - apps/backend/src/products/entities/product.entity.ts
#   - apps/backend/src/products/entities/category.entity.ts
#   - apps/backend/src/products/entities/ingredient.entity.ts
#   - apps/backend/src/products/entities/product-ingredient.entity.ts

# 4. Setup Authentication Module
git commit -m "feat(backend): implement JWT authentication module"
# Files:
#   - apps/backend/src/auth/auth.module.ts
#   - apps/backend/src/auth/auth.service.ts
#   - apps/backend/src/auth/auth.controller.ts
#   - apps/backend/src/auth/strategies/jwt.strategy.ts

# 5. Create Auth Guards
git commit -m "feat(backend): create JWT and Admin authorization guards"
# Files:
#   - apps/backend/src/auth/guards/jwt-auth.guard.ts
#   - apps/backend/src/auth/guards/admin.guard.ts

# 6. Setup global exception handling
git commit -m "feat(backend): add global exception filters and interceptors"
# Files:
#   - apps/backend/src/common/filters/http-exception.filter.ts
#   - apps/backend/src/common/interceptors/transform.interceptor.ts

# 7. Add validation pipes
git commit -m "feat(backend): configure global validation with class-validator"
# Files:
#   - apps/backend/src/common/pipes/validation.pipe.ts
#   - apps/backend/src/main.ts (update)

# 8. CORS configuration
git commit -m "feat(backend): configure CORS for frontend communication"
# Files: apps/backend/src/config/cors.config.ts
```

---

## PHASE 2: FRONTEND FOUNDATION

**Timeline**: Week 2 - Day 1-3

### 🎨 Frontend Setup

```bash
# 1. Initialize Vite + React + TypeScript
git commit -m "feat(frontend): initialize Vite project with React and TypeScript"
# Directory: apps/frontend/
# Files: vite.config.ts, tsconfig.json, package.json

# 2. Configure Tailwind CSS
git commit -m "feat(frontend): setup Tailwind CSS with custom design tokens"
# Files:
#   - apps/frontend/tailwind.config.js
#   - apps/frontend/postcss.config.js
#   - apps/frontend/src/index.css (with CSS variables)

# 3. Design System - Color Palette
git commit -m "style(frontend): implement dark mode design system with glassmorphism"
# Files: apps/frontend/src/index.css (update with color tokens)

# 4. Create Glass Components
git commit -m "feat(frontend): create reusable glassmorphism components"
# Files:
#   - apps/frontend/src/customer/components/shared/GlassCard.tsx
#   - apps/frontend/src/customer/components/shared/GlassButton.tsx
#   - apps/frontend/src/customer/components/shared/GlassInput.tsx
#   - apps/frontend/src/customer/components/shared/Badge.tsx

# 5. Setup React Router
git commit -m "feat(frontend): configure React Router with lazy loading"
# Files:
#   - apps/frontend/src/routes/AppRoutes.tsx
#   - apps/frontend/src/routes/PrivateRoute.tsx
#   - apps/frontend/src/routes/AdminRoute.tsx

# 6. Configure Axios with interceptors
git commit -m "feat(frontend): setup Axios instance with JWT interceptors"
# Files: apps/frontend/src/shared/api/axios.config.ts

# 7. Setup Zustand stores
git commit -m "feat(frontend): implement Zustand state management (auth, cart, UI)"
# Files:
#   - apps/frontend/src/shared/store/authStore.ts
#   - apps/frontend/src/shared/store/cartStore.ts
#   - apps/frontend/src/shared/store/uiStore.ts

# 8. React Query configuration
git commit -m "feat(frontend): integrate React Query for server state management"
# Files: apps/frontend/src/main.tsx (update)

# 9. TypeScript types
git commit -m "feat(frontend): define TypeScript interfaces for domain models"
# Files:
#   - apps/frontend/src/shared/types/user.types.ts
#   - apps/frontend/src/shared/types/product.types.ts
#   - apps/frontend/src/shared/types/recipe.types.ts
#   - apps/frontend/src/shared/types/order.types.ts
```

---

## PHASE 3: CORE FEATURES - BACKEND

**Timeline**: Week 2 - Day 4-7

### 🔨 Backend APIs

```bash
# 1. Users Module - Profile Management
git commit -m "feat(backend): implement user profile API endpoints"
# Files:
#   - apps/backend/src/users/users.controller.ts
#   - apps/backend/src/users/users.service.ts
#   - apps/backend/src/users/dto/update-user.dto.ts

# 2. Products Module - Public endpoints
git commit -m "feat(backend): create public product listing and detail APIs"
# Files:
#   - apps/backend/src/products/products.controller.ts
#   - apps/backend/src/products/products.service.ts
#   - apps/backend/src/products/dto/filter-product.dto.ts

# 3. Categories API
git commit -m "feat(backend): add category listing endpoint"
# Files: apps/backend/src/products/categories.controller.ts

# 4. Cart Module
git commit -m "feat(backend): implement shopping cart CRUD operations"
# Files:
#   - apps/backend/src/cart/cart.controller.ts
#   - apps/backend/src/cart/cart.service.ts
#   - apps/backend/src/cart/entities/cart-item.entity.ts
#   - apps/backend/src/cart/dto/add-to-cart.dto.ts

# 5. Orders Module - Create Order
git commit -m "feat(backend): implement order creation with stock hold logic"
# Files:
#   - apps/backend/src/orders/orders.controller.ts
#   - apps/backend/src/orders/orders.service.ts
#   - apps/backend/src/orders/entities/order.entity.ts
#   - apps/backend/src/orders/entities/order-item.entity.ts

# 6. Order Status Management
git commit -m "feat(backend): add order status update and history tracking"
# Files: apps/backend/src/orders/orders.service.ts (update)

# 7. Database Seeder
git commit -m "feat(backend): create database seeder scripts"
# Files:
#   - apps/backend/src/database/seeders/seed-categories.ts
#   - apps/backend/src/database/seeders/seed-ingredients.ts
#   - apps/backend/src/database/seeders/seed-products.ts
```

---

## PHASE 4: CORE FEATURES - FRONTEND

**Timeline**: Week 3 - Day 1-5

### 🛍️ Storefront Pages

```bash
# 1. Landing Page
git commit -m "feat(frontend): create landing page with hero section and featured products"
# Files:
#   - apps/frontend/src/customer/pages/HomePage.tsx
#   - apps/frontend/src/customer/components/layout/Header.tsx
#   - apps/frontend/src/customer/components/layout/Footer.tsx

# 2. Product List Page
git commit -m "feat(frontend): implement product listing with filters and search"
# Files:
#   - apps/frontend/src/customer/pages/ProductListPage.tsx
#   - apps/frontend/src/customer/components/product/ProductCard.tsx
#   - apps/frontend/src/customer/components/product/ProductGrid.tsx
#   - apps/frontend/src/customer/components/product/ProductFilter.tsx

# 3. Product Detail Page
git commit -m "feat(frontend): create product detail page with add to cart"
# Files: apps/frontend/src/customer/pages/ProductDetailPage.tsx

# 4. Shopping Cart Page
git commit -m "feat(frontend): implement shopping cart with quantity adjustment"
# Files:
#   - apps/frontend/src/customer/pages/CartPage.tsx
#   - apps/frontend/src/customer/components/cart/CartItem.tsx
#   - apps/frontend/src/customer/components/cart/CartSummary.tsx

# 5. Cart Bubble (Floating Icon)
git commit -m "feat(frontend): add floating cart icon with item counter"
# Files: apps/frontend/src/customer/components/cart/CartBubble.tsx

# 6. Checkout Page
git commit -m "feat(frontend): create checkout flow with form validation"
# Files: apps/frontend/src/customer/pages/CheckoutPage.tsx

# 7. Order History Page
git commit -m "feat(frontend): implement order history with status tracking"
# Files: apps/frontend/src/customer/pages/OrderHistoryPage.tsx

# 8. Authentication Pages
git commit -m "feat(frontend): create login and register pages"
# Files:
#   - apps/frontend/src/customer/pages/LoginPage.tsx
#   - apps/frontend/src/customer/pages/RegisterPage.tsx

# 9. API Integration - Products
git commit -m "feat(frontend): integrate product APIs with React Query"
# Files:
#   - apps/frontend/src/shared/api/products.api.ts
#   - apps/frontend/src/customer/hooks/useProducts.ts

# 10. API Integration - Cart
git commit -m "feat(frontend): integrate cart APIs with Zustand"
# Files:
#   - apps/frontend/src/shared/api/cart.api.ts
#   - apps/frontend/src/customer/hooks/useCart.ts

# 11. API Integration - Orders
git commit -m "feat(frontend): integrate order creation and history APIs"
# Files:
#   - apps/frontend/src/shared/api/orders.api.ts
#   - apps/frontend/src/customer/hooks/useOrders.ts
```

---

## PHASE 5: ADMIN DASHBOARD

**Timeline**: Week 4 - Day 1-5

### 👨‍💼 Admin Features

```bash
# 1. Admin Layout & Sidebar
git commit -m "feat(frontend): create admin dashboard layout with collapsible sidebar"
# Files:
#   - apps/frontend/src/admin/components/layout/AdminLayout.tsx
#   - apps/frontend/src/admin/components/layout/AdminSidebar.tsx
#   - apps/frontend/src/admin/components/layout/AdminHeader.tsx

# 2. Dashboard Overview Page
git commit -m "feat(frontend): implement admin dashboard with KPI cards and charts"
# Files:
#   - apps/frontend/src/admin/pages/DashboardPage.tsx
#   - apps/frontend/src/admin/components/dashboard/StatsCard.tsx
#   - apps/frontend/src/admin/components/dashboard/ChartWidget.tsx

# 3. Product Management - List View
git commit -m "feat(frontend): create product management table with low stock alerts"
# Files:
#   - apps/frontend/src/admin/pages/ProductManagementPage.tsx
#   - apps/frontend/src/admin/components/product/ProductTable.tsx
#   - apps/frontend/src/admin/components/product/LowStockBadge.tsx

# 4. Product Form - Create/Edit
git commit -m "feat(frontend): implement product form with image upload and ingredient mapping"
# Files:
#   - apps/frontend/src/admin/pages/ProductFormPage.tsx
#   - apps/frontend/src/admin/components/product/ProductForm.tsx
#   - apps/frontend/src/admin/components/product/ImageUploader.tsx

# 5. Ingredient Mapping Input
git commit -m "feat(frontend): create searchable dropdown for ingredient mapping"
# Files: apps/frontend/src/admin/components/product/IngredientMappingInput.tsx

# 6. Backend - Admin Product APIs
git commit -m "feat(backend): implement admin product CRUD endpoints"
# Files:
#   - apps/backend/src/admin/products/admin-products.controller.ts
#   - apps/backend/src/admin/products/admin-products.service.ts
#   - apps/backend/src/products/dto/create-product.dto.ts
#   - apps/backend/src/products/dto/update-product.dto.ts

# 7. Order Management Page
git commit -m "feat(frontend): create order management table with status filters"
# Files:
#   - apps/frontend/src/admin/pages/OrderManagementPage.tsx
#   - apps/frontend/src/admin/components/order/OrderTable.tsx

# 8. Order Approve/Reject Workflow
git commit -m "feat(frontend): implement order approval UI with stock confirmation"
# Files:
#   - apps/frontend/src/admin/components/order/OrderStatusButton.tsx
#   - apps/frontend/src/admin/components/order/OrderDetailModal.tsx

# 9. Backend - Admin Order APIs
git commit -m "feat(backend): implement order approval/rejection with stock management"
# Files:
#   - apps/backend/src/admin/orders/admin-orders.controller.ts
#   - apps/backend/src/admin/orders/admin-orders.service.ts

# 10. Analytics Page
git commit -m "feat(frontend): create analytics dashboard with top recipes report"
# Files: apps/frontend/src/admin/pages/AnalyticsPage.tsx

# 11. Backend - Analytics API
git commit -m "feat(backend): implement analytics endpoints for admin reports"
# Files:
#   - apps/backend/src/admin/analytics/admin-analytics.controller.ts
#   - apps/backend/src/admin/analytics/admin-analytics.service.ts
```

---

## PHASE 6: AI RECIPE SUGGESTION

**Timeline**: Week 5 - Day 1-4

### 🤖 AI Features

```bash
# 1. Recipes Module - Backend
git commit -m "feat(backend): create recipes module and entity"
# Files:
#   - apps/backend/src/recipes/recipes.module.ts
#   - apps/backend/src/recipes/entities/recipe.entity.ts

# 2. Recipe Seeder
git commit -m "feat(backend): import recipes from JSON to database"
# Files: apps/backend/src/database/seeders/seed-recipes.ts

# 3. AI Algorithm - Available Recipes
git commit -m "feat(backend): implement AI logic to filter available recipes by stock"
# Files:
#   - apps/backend/src/recipes/recipes.service.ts
#   - apps/backend/src/recipes/helpers/ai-suggestion.helper.ts

# 4. AI Algorithm - Ingredient Suggestion
git commit -m "feat(backend): implement ingredient suggestion with priority sorting"
# Files: apps/backend/src/recipes/recipes.service.ts (update)

# 5. Recipe APIs
git commit -m "feat(backend): create recipe listing and suggestion endpoints"
# Files:
#   - apps/backend/src/recipes/recipes.controller.ts
#   - apps/backend/src/recipes/dto/filter-recipe.dto.ts

# 6. Frontend - Recipe List Page
git commit -m "feat(frontend): create recipe listing page with mood filters"
# Files:
#   - apps/frontend/src/customer/pages/RecipeListPage.tsx
#   - apps/frontend/src/customer/components/recipe/RecipeCard.tsx
#   - apps/frontend/src/customer/components/recipe/RecipeGrid.tsx
#   - apps/frontend/src/customer/components/recipe/RecipeFilter.tsx

# 7. Frontend - Recipe Detail Page
git commit -m "feat(frontend): implement recipe detail with ingredient list"
# Files: apps/frontend/src/customer/pages/RecipeDetailPage.tsx

# 8. Frontend - Ingredient Drawer (AI UI)
git commit -m "feat(frontend): create AI suggestion drawer with checkbox selection"
# Files: apps/frontend/src/customer/components/recipe/IngredientDrawer.tsx

# 9. Frontend - AI Recipe Hook
git commit -m "feat(frontend): integrate AI suggestion API with React Query"
# Files:
#   - apps/frontend/src/shared/api/recipes.api.ts
#   - apps/frontend/src/customer/hooks/useAIRecipe.ts

# 10. Add to Cart from Recipe
git commit -m "feat(frontend): implement batch add to cart from recipe ingredients"
# Files: apps/frontend/src/customer/hooks/useCart.ts (update)

# 11. Recipe View Counter
git commit -m "feat(backend): track recipe view count for analytics"
# Files: apps/backend/src/recipes/recipes.service.ts (update)
```

---

## PHASE 7: TESTING & OPTIMIZATION

**Timeline**: Week 6 - Day 1-5

### 🧪 Testing & Performance

```bash
# 1. Unit Tests - Backend Services
git commit -m "test(backend): add unit tests for auth and product services"
# Files:
#   - apps/backend/src/auth/auth.service.spec.ts
#   - apps/backend/src/products/products.service.spec.ts

# 2. E2E Tests - Backend
git commit -m "test(backend): create E2E tests for critical API flows"
# Files: apps/backend/test/app.e2e-spec.ts

# 3. Frontend Component Tests
git commit -m "test(frontend): add React Testing Library tests for components"
# Files:
#   - apps/frontend/src/customer/components/product/ProductCard.test.tsx
#   - apps/frontend/src/customer/components/cart/CartItem.test.tsx

# 4. Database Indexing
git commit -m "perf(backend): add database indexes for query optimization"
# Files: apps/backend/src/database/migrations/add-indexes.migration.ts

# 5. Image Optimization
git commit -m "perf(frontend): implement lazy loading for images"
# Files: apps/frontend/src/customer/components/product/ProductCard.tsx (update)

# 6. Code Splitting
git commit -m "perf(frontend): enable route-based code splitting"
# Files: apps/frontend/src/routes/AppRoutes.tsx (update with lazy())

# 7. Skeleton Loading
git commit -m "feat(frontend): add skeleton loaders for better UX"
# Files: apps/frontend/src/customer/components/product/ProductSkeleton.tsx

# 8. Security Audit
git commit -m "security: add helmet, rate limiting, and input sanitization"
# Files:
#   - apps/backend/src/main.ts (update)
#   - apps/backend/package.json (add helmet, express-rate-limit)

# 9. Environment Variables Validation
git commit -m "chore: validate environment variables on startup"
# Files: apps/backend/src/config/env.validation.ts

# 10. Production Build Configuration
git commit -m "build: optimize production builds for both apps"
# Files:
#   - apps/backend/nest-cli.json (update)
#   - apps/frontend/vite.config.ts (update)

# 11. Deployment Documentation
git commit -m "docs: add deployment guide and Docker configuration"
# Files:
#   - docs/DEPLOYMENT.md
#   - Dockerfile (backend)
#   - Dockerfile (frontend)
#   - docker-compose.yml
```

---

## 📊 TỔNG KẾT

### Thống kê Commit

| Phase | Số Commits | Thời gian | Focus |
|-------|------------|-----------|-------|
| Phase 0 | 5 | 2 days | Project Setup |
| Phase 1 | 8 | 3 days | Backend Foundation |
| Phase 2 | 9 | 3 days | Frontend Foundation |
| Phase 3 | 7 | 4 days | Backend APIs |
| Phase 4 | 11 | 5 days | Storefront Features |
| Phase 5 | 11 | 5 days | Admin Dashboard |
| Phase 6 | 11 | 4 days | AI Recipe System |
| Phase 7 | 11 | 5 days | Testing & Optimization |
| **TOTAL** | **73 commits** | **~6 weeks** | **Full Implementation** |

### Conventional Commit Types Used

- **feat**: New features (45 commits)
- **fix**: Bug fixes (0 commits - add when needed)
- **docs**: Documentation (4 commits)
- **style**: Code formatting (1 commit)
- **refactor**: Code refactoring (0 commits)
- **test**: Adding tests (3 commits)
- **chore**: Build/tooling changes (3 commits)
- **perf**: Performance improvements (4 commits)
- **security**: Security improvements (1 commit)
- **build**: Build configuration (1 commit)

---

## 🚀 Cách sử dụng

### Khi bắt đầu Phase mới:

```bash
# Tạo branch cho Phase
git checkout -b feat/phase-1-backend-foundation

# Thực hiện commits theo danh sách
git commit -m "feat(backend): initialize NestJS project with TypeScript"

# Merge vào main khi hoàn thành Phase
git checkout main
git merge feat/phase-1-backend-foundation
```

### Review Progress:

```bash
# Xem lịch sử commit theo Phase
git log --grep="feat(backend)" --oneline

# Xem số lượng commits theo tác giả
git shortlog -sn
```

---

**Maintained by**: Senior Engineering Team
**Last Updated**: 2026-01-20
