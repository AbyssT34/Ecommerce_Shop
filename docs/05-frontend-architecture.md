# 🏗️ KIẾN TRÚC FRONTEND & COMPONENTS

## 7. CẤU TRÚC THƯ MỤC NEXT.JS

```
src/
├── app/                          # App Router (Next.js 14+)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Trang chủ
│   ├── loading.tsx              # Loading UI
│   ├── error.tsx                # Error boundary
│   ├── not-found.tsx            # 404
│   │
│   ├── (auth)/                  # Route group - Auth
│   │   ├── dang-nhap/
│   │   │   └── page.tsx
│   │   └── dang-ky/
│   │       └── page.tsx
│   │
│   ├── san-pham/                # Sản phẩm
│   │   ├── page.tsx             # Danh sách
│   │   └── [slug]/
│   │       └── page.tsx         # Chi tiết
│   │
│   ├── danh-muc/                # Danh mục
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── cong-thuc/               # Công thức
│   │   ├── page.tsx             # Danh sách
│   │   └── [slug]/
│   │       └── page.tsx         # Chi tiết
│   │
│   ├── goi-y/                   # AI Gợi ý
│   │   └── page.tsx
│   │
│   ├── gio-hang/                # Giỏ hàng
│   │   └── page.tsx
│   │
│   ├── thanh-toan/              # Checkout
│   │   └── page.tsx
│   │
│   ├── tai-khoan/               # Tài khoản
│   │   ├── page.tsx
│   │   ├── don-hang/
│   │   │   └── page.tsx
│   │   └── yeu-thich/
│   │       └── page.tsx
│   │
│   └── api/                     # API Routes (nếu cần)
│       └── ...
│
├── components/
│   ├── ui/                      # Primitive UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Sidebar.tsx
│   │   └── Container.tsx
│   │
│   ├── product/                 # Product components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── AddToCartButton.tsx
│   │   └── QuantitySelector.tsx
│   │
│   ├── recipe/                  # Recipe components
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeDetail.tsx
│   │   ├── IngredientList.tsx
│   │   ├── IngredientItem.tsx
│   │   ├── ServingsAdjuster.tsx
│   │   ├── CookingSteps.tsx
│   │   ├── AddAllToCart.tsx
│   │   └── RelatedRecipes.tsx
│   │
│   ├── ai/                      # AI components
│   │   ├── SuggestionForm.tsx
│   │   ├── SuggestionResults.tsx
│   │   ├── AILoadingState.tsx
│   │   └── AIEmptyState.tsx
│   │
│   ├── cart/                    # Cart components
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartRecipeGroup.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartEmpty.tsx
│   │
│   ├── checkout/                # Checkout components
│   │   ├── CheckoutForm.tsx
│   │   ├── ShippingForm.tsx
│   │   ├── PaymentMethods.tsx
│   │   └── OrderSummary.tsx
│   │
│   ├── search/                  # Search components
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   └── SearchFilters.tsx
│   │
│   └── common/                  # Shared components
│       ├── PriceDisplay.tsx
│       ├── CategoryList.tsx
│       ├── EmptyState.tsx
│       └── LoadMore.tsx
│
├── hooks/                       # Custom hooks
│   ├── useCart.ts
│   ├── useRecipes.ts
│   ├── useProducts.ts
│   ├── useAISuggestion.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
│
├── lib/                         # Utilities
│   ├── api.ts                   # API client
│   ├── utils.ts                 # Helper functions
│   ├── constants.ts             # Constants
│   └── validators.ts            # Form validation
│
├── stores/                      # State management (Zustand)
│   ├── cartStore.ts
│   ├── userStore.ts
│   └── uiStore.ts
│
├── types/                       # TypeScript types
│   ├── product.ts
│   ├── recipe.ts
│   ├── cart.ts
│   ├── order.ts
│   └── api.ts
│
└── styles/
    └── globals.css              # Tailwind + custom styles
```

## 7.2 Các Component Chính

### Component: RecipeCard

```typescript
// components/recipe/RecipeCard.tsx

interface RecipeCardProps {
  recipe: {
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    cookingTime: number;      // phút
    servings: number;
    difficulty: 'Dễ' | 'Trung bình' | 'Khó';
    totalCost: number;        // VND
  };
  variant?: 'default' | 'compact' | 'featured';
  onSave?: (id: string) => void;
}

// Sử dụng:
<RecipeCard 
  recipe={recipe}
  variant="featured"
  onSave={handleSave}
/>
```

### Component: IngredientItem

```typescript
// components/recipe/IngredientItem.tsx

interface IngredientItemProps {
  ingredient: {
    id: string;
    name: string;
    amount: number;
    unit: string;
    isEssential: boolean;
    product: {
      id: string;
      name: string;
      price: number;
      url: string;
      image: string;
      inStock: boolean;
    };
    calculatedPrice: number;
  };
  isSelected: boolean;
  onToggle: (id: string) => void;
  onViewProduct: (url: string) => void;
}

// Features:
// - Checkbox để chọn/bỏ nguyên liệu
// - Hiển thị giá realtime
// - Link đến sản phẩm
// - Badge "Hết hàng" nếu không còn
// - Badge "Có thể thay thế" cho nguyên liệu phụ
```

### Component: ServingsAdjuster

```typescript
// components/recipe/ServingsAdjuster.tsx

interface ServingsAdjusterProps {
  defaultServings: number;
  minServings?: number;       // default: 1
  maxServings?: number;       // default: 10
  totalCost: number;
  onChange: (servings: number) => void;
  isLoading?: boolean;
}

// Features:
// - Nút [-] [số] [+]
// - Hiển thị tổng tiền cập nhật realtime
// - Debounce API call khi thay đổi
// - Loading state khi đang tính toán
```

### Component: AddAllToCart

```typescript
// components/recipe/AddAllToCart.tsx

interface AddAllToCartProps {
  recipeId: string;
  recipeName: string;
  ingredients: Ingredient[];
  selectedIds: string[];
  totalCost: number;
  onAddToCart: () => void;
  isLoading?: boolean;
}

// Features:
// - Sticky bottom bar
// - Hiển thị số lượng items và tổng tiền
// - Animation khi thêm thành công
// - Disabled nếu không có item nào được chọn
```

### Component: CartRecipeGroup

```typescript
// components/cart/CartRecipeGroup.tsx

interface CartRecipeGroupProps {
  recipeName: string;
  recipeSlug: string;
  items: CartItem[];
  subtotal: number;
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onViewRecipe: () => void;
}

// Features:
// - Header với tên món và link đến công thức
// - Danh sách sản phẩm
// - Tạm tính cho nhóm này
// - Collapsible (có thể thu gọn)
```

## 7.3 State Management (Zustand)

```typescript
// stores/cartStore.ts

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  recipeId?: string;          // Thuộc món nào (nếu có)
  recipeName?: string;
}

interface CartState {
  items: CartItem[];
  recipeGroups: Map<string, CartItem[]>;
  
  // Actions
  addItem: (item: CartItem) => void;
  addRecipeItems: (recipeId: string, recipeName: string, items: CartItem[]) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  
  // Computed
  totalItems: () => number;
  totalAmount: () => number;
  getRecipeGroups: () => { name: string; items: CartItem[]; subtotal: number }[];
}
```

```typescript
// stores/userStore.ts

interface UserState {
  user: User | null;
  savedRecipes: string[];
  recentlyViewed: string[];
  
  // Actions
  saveRecipe: (recipeId: string) => void;
  unsaveRecipe: (recipeId: string) => void;
  addToRecentlyViewed: (recipeId: string) => void;
}
```

## 7.4 API Client

```typescript
// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Products
  products: {
    list: (params?: ProductListParams) => 
      fetch(`${API_BASE}/products`, { params }),
    get: (slug: string) => 
      fetch(`${API_BASE}/products/${slug}`),
    search: (query: string) => 
      fetch(`${API_BASE}/products/search?q=${query}`),
  },
  
  // Recipes
  recipes: {
    list: (params?: RecipeListParams) => 
      fetch(`${API_BASE}/recipes`, { params }),
    get: (slug: string) => 
      fetch(`${API_BASE}/recipes/${slug}`),
    suggest: (input: SuggestionInput) => 
      fetch(`${API_BASE}/recipes/suggest`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    adjustServings: (recipeId: string, servings: number) =>
      fetch(`${API_BASE}/recipes/${recipeId}/adjust?servings=${servings}`),
  },
  
  // Cart
  cart: {
    addItems: (items: CartItem[]) =>
      fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        body: JSON.stringify({ items }),
      }),
    addRecipe: (recipeId: string, selectedIngredients: string[]) =>
      fetch(`${API_BASE}/cart/add-recipe`, {
        method: 'POST',
        body: JSON.stringify({ recipeId, selectedIngredients }),
      }),
  },
  
  // Orders
  orders: {
    create: (orderData: CreateOrderInput) =>
      fetch(`${API_BASE}/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),
  },
};
```

## 7.5 Custom Hooks

```typescript
// hooks/useAISuggestion.ts

interface UseSuggestionInput {
  budget: number;
  servings: number;
  cookingTime: number;
}

interface UseSuggestionReturn {
  suggestions: Recipe[];
  isLoading: boolean;
  error: Error | null;
  suggest: (input: UseSuggestionInput) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAISuggestion(): UseSuggestionReturn {
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const suggest = async (input: UseSuggestionInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.recipes.suggest(input);
      setSuggestions(response.data.recipes);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { suggestions, isLoading, error, suggest, refresh: suggest };
}
```

```typescript
// hooks/useRecipeWithPricing.ts

interface UseRecipeWithPricingReturn {
  recipe: Recipe | null;
  isLoading: boolean;
  servings: number;
  totalCost: number;
  ingredients: EnrichedIngredient[];
  selectedIngredientIds: string[];
  
  // Actions
  setServings: (n: number) => void;
  toggleIngredient: (id: string) => void;
  addAllToCart: () => Promise<void>;
}

export function useRecipeWithPricing(slug: string): UseRecipeWithPricingReturn {
  // Fetch recipe
  // Manage servings state
  // Recalculate prices when servings change
  // Handle ingredient selection
  // Add to cart functionality
}
```
