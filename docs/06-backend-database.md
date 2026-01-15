# 🔧 KIẾN TRÚC BACKEND & DATABASE

## 8. KIẾN TRÚC NESTJS

### 8.1 Cấu trúc Thư mục

```
src/
├── main.ts                      # Entry point
├── app.module.ts                # Root module
│
├── common/                      # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
│
├── config/                      # Configuration
│   ├── database.config.ts
│   ├── ai.config.ts
│   ├── cache.config.ts
│   └── payment.config.ts
│
├── modules/
│   ├── auth/                    # Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── dto/
│   │
│   ├── users/                   # Users
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │
│   ├── products/                # Products
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       ├── update-product.dto.ts
│   │       └── product-query.dto.ts
│   │
│   ├── categories/              # Categories
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   └── categories.service.ts
│   │
│   ├── recipes/                 # Recipes + AI
│   │   ├── recipes.module.ts
│   │   ├── recipes.controller.ts
│   │   ├── recipes.service.ts
│   │   ├── ai/
│   │   │   ├── ai.service.ts
│   │   │   └── prompts/
│   │   │       └── recipe-suggestion.prompt.ts
│   │   └── dto/
│   │       ├── suggest-recipe.dto.ts
│   │       ├── recipe-response.dto.ts
│   │       └── adjust-servings.dto.ts
│   │
│   ├── cart/                    # Cart
│   │   ├── cart.module.ts
│   │   ├── cart.controller.ts
│   │   ├── cart.service.ts
│   │   └── dto/
│   │
│   ├── orders/                  # Orders
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── dto/
│   │
│   ├── payments/                # Payments
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── providers/
│   │       ├── momo.provider.ts
│   │       ├── vnpay.provider.ts
│   │       └── cod.provider.ts
│   │
│   └── search/                  # Search
│       ├── search.module.ts
│       ├── search.controller.ts
│       └── search.service.ts
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/
│   └── seed.ts                  # Seed data
│
└── types/                       # Shared types
    └── index.ts
```

### 8.2 API Endpoints

```
╔═══════════════════════════════════════════════════════════════════════╗
║                         API ENDPOINTS                                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  BASE URL: /api/v1                                                    ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  PRODUCTS                                                             ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  GET    /products                  Danh sách sản phẩm (có filter)     ║
║  GET    /products/:slug            Chi tiết sản phẩm                  ║
║  GET    /products/:id/recipes      Các món có thể nấu từ SP này       ║
║  GET    /products/search           Tìm kiếm sản phẩm                  ║
║                                                                       ║
║  Query params:                                                        ║
║  - category: string               Lọc theo danh mục                   ║
║  - minPrice, maxPrice: number     Lọc theo giá                        ║
║  - inStock: boolean               Chỉ sản phẩm còn hàng               ║
║  - sort: price_asc | price_desc | newest | bestseller                 ║
║  - page, limit: number            Phân trang                          ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  CATEGORIES                                                           ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  GET    /categories                Danh sách danh mục                 ║
║  GET    /categories/:slug          Chi tiết danh mục                  ║
║  GET    /categories/:slug/products Sản phẩm trong danh mục            ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  RECIPES (AI-Powered)                                                 ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  GET    /recipes                   Danh sách công thức                ║
║  GET    /recipes/:slug             Chi tiết công thức                 ║
║  POST   /recipes/suggest           🤖 AI gợi ý món                    ║
║  GET    /recipes/:id/adjust        Điều chỉnh khẩu phần              ║
║  GET    /recipes/popular           Món phổ biến                       ║
║                                                                       ║
║  POST /recipes/suggest body:                                          ║
║  {                                                                    ║
║    "budget": 150000,              // VND                              ║
║    "servings": 2,                 // Số người                         ║
║    "cookingTime": 30,             // Phút                             ║
║    "excludeIngredients": []       // Không muốn ăn                    ║
║  }                                                                    ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  CART                                                                 ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  GET    /cart                      Xem giỏ hàng                       ║
║  POST   /cart/items                Thêm sản phẩm                      ║
║  POST   /cart/recipe               Thêm nguyên liệu từ công thức      ║
║  PATCH  /cart/items/:id            Cập nhật số lượng                  ║
║  DELETE /cart/items/:id            Xóa sản phẩm                       ║
║  DELETE /cart                      Xóa giỏ hàng                       ║
║                                                                       ║
║  POST /cart/recipe body:                                              ║
║  {                                                                    ║
║    "recipeId": "recipe_001",                                          ║
║    "recipeName": "Canh Chua Cá Lóc",                                  ║
║    "servings": 2,                                                     ║
║    "selectedIngredients": ["ing_001", "ing_002", ...]                 ║
║  }                                                                    ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  ORDERS                                                               ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  POST   /orders                    Tạo đơn hàng                       ║
║  GET    /orders                    Danh sách đơn (user)               ║
║  GET    /orders/:id                Chi tiết đơn                       ║
║  PATCH  /orders/:id/cancel         Hủy đơn                            ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  PAYMENTS                                                             ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  POST   /payments/momo             Thanh toán MoMo                    ║
║  POST   /payments/vnpay            Thanh toán VNPay                   ║
║  POST   /payments/callback/:provider  Callback từ payment provider    ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  AUTH                                                                 ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  POST   /auth/register             Đăng ký                            ║
║  POST   /auth/login                Đăng nhập                          ║
║  POST   /auth/logout               Đăng xuất                          ║
║  POST   /auth/refresh              Refresh token                      ║
║  GET    /auth/me                   Thông tin user hiện tại            ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  USER                                                                 ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  GET    /users/saved-recipes       Món đã lưu                         ║
║  POST   /users/saved-recipes/:id   Lưu món                            ║
║  DELETE /users/saved-recipes/:id   Bỏ lưu món                         ║
║  GET    /users/recent-recipes      Món đã xem gần đây                 ║
║                                                                       ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  SEARCH                                                               ║
║  ═══════════════════════════════════════════════════════════════════  ║
║  GET    /search                    Tìm kiếm tổng hợp                  ║
║         ?q=canh chua               (Sản phẩm + Công thức)             ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 9. DATABASE SCHEMA (PRISMA)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════════════════════════════
// USER & AUTH
// ═══════════════════════════════════════════════════════════════════

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   @unique
  passwordHash  String
  name          String
  avatar        String?
  
  // Địa chỉ mặc định
  defaultAddress  Address?  @relation("DefaultAddress", fields: [defaultAddressId], references: [id])
  defaultAddressId String?  @unique
  
  // Relations
  addresses     Address[] @relation("UserAddresses")
  orders        Order[]
  savedRecipes  SavedRecipe[]
  recentRecipes RecentRecipe[]
  cart          Cart?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Address {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation("UserAddresses", fields: [userId], references: [id])
  
  recipientName String
  phone         String
  province      String
  district      String
  ward          String
  street        String
  note          String?
  isDefault     Boolean   @default(false)
  
  // Relation for default address
  defaultFor    User?     @relation("DefaultAddress")
  
  orders        Order[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCTS & CATEGORIES
// ═══════════════════════════════════════════════════════════════════

model Category {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String?
  image         String?
  icon          String?           // Icon name (từ Lucide)
  parentId      String?
  parent        Category? @relation("CategoryChildren", fields: [parentId], references: [id])
  children      Category[] @relation("CategoryChildren")
  
  products      Product[]
  
  sortOrder     Int       @default(0)
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Product {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String?
  
  // Giá & Đơn vị
  price         Int                   // Giá bán (VND)
  originalPrice Int?                  // Giá gốc (nếu có giảm giá)
  unit          String                // "kg", "gói", "con", "quả"...
  weight        String?               // "500g", "1kg"...
  
  // Tồn kho
  stock         Int       @default(0)
  lowStockThreshold Int   @default(10)
  
  // Hình ảnh
  images        String[]              // Array of image URLs
  thumbnail     String?
  
  // Metadata
  origin        String?               // Xuất xứ
  storage       String?               // Cách bảo quản
  expiry        String?               // Hạn sử dụng
  
  // Relations
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  
  recipeIngredients RecipeIngredient[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  
  // Flags
  isActive      Boolean   @default(true)
  isFeatured    Boolean   @default(false)
  
  // Stats
  soldCount     Int       @default(0)
  viewCount     Int       @default(0)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([categoryId])
  @@index([slug])
  @@index([price])
}

// ═══════════════════════════════════════════════════════════════════
// RECIPES
// ═══════════════════════════════════════════════════════════════════

model Recipe {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  description   String
  
  // Media
  image         String?
  video         String?
  
  // Thông tin nấu
  cookingTime   Int                   // Phút
  prepTime      Int?                  // Thời gian chuẩn bị
  difficulty    Difficulty @default(EASY)
  defaultServings Int      @default(2)
  
  // Nội dung
  tips          String?               // Mẹo nấu
  
  // Relations
  ingredients   RecipeIngredient[]
  steps         RecipeStep[]
  
  // User interactions
  savedBy       SavedRecipe[]
  recentViews   RecentRecipe[]
  
  // Stats
  viewCount     Int       @default(0)
  cookCount     Int       @default(0)  // Số lần được thêm vào giỏ
  
  // SEO
  metaTitle     String?
  metaDescription String?
  
  // Source
  isAIGenerated Boolean   @default(false)
  aiPrompt      String?               // Prompt đã dùng để tạo
  
  // Flags
  isActive      Boolean   @default(true)
  isFeatured    Boolean   @default(false)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([slug])
  @@index([difficulty])
}

enum Difficulty {
  EASY          // Dễ
  MEDIUM        // Trung bình
  HARD          // Khó
}

model RecipeIngredient {
  id            String    @id @default(cuid())
  
  recipeId      String
  recipe        Recipe    @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  productId     String
  product       Product   @relation(fields: [productId], references: [id])
  
  // Số lượng cần cho 1 khẩu phần mặc định
  amount        Float                 // Số lượng
  unit          String                // Đơn vị (g, ml, quả, muỗng...)
  
  // Metadata
  isEssential   Boolean   @default(true)  // Nguyên liệu chính?
  substituteFor String?               // Thay thế cho nguyên liệu nào
  note          String?               // Ghi chú (vd: "cắt lát mỏng")
  
  sortOrder     Int       @default(0)
  
  createdAt     DateTime  @default(now())

  @@unique([recipeId, productId])
  @@index([recipeId])
  @@index([productId])
}

model RecipeStep {
  id            String    @id @default(cuid())
  
  recipeId      String
  recipe        Recipe    @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  stepNumber    Int
  title         String?
  content       String
  image         String?
  duration      Int?                  // Phút
  
  createdAt     DateTime  @default(now())

  @@unique([recipeId, stepNumber])
  @@index([recipeId])
}

model SavedRecipe {
  id            String    @id @default(cuid())
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  recipeId      String
  recipe        Recipe    @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime  @default(now())

  @@unique([userId, recipeId])
}

model RecentRecipe {
  id            String    @id @default(cuid())
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  recipeId      String
  recipe        Recipe    @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  viewedAt      DateTime  @default(now())

  @@unique([userId, recipeId])
  @@index([userId, viewedAt(sort: Desc)])
}

// ═══════════════════════════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════════════════════════

model Cart {
  id            String    @id @default(cuid())
  
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  items         CartItem[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CartItem {
  id            String    @id @default(cuid())
  
  cartId        String
  cart          Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)
  
  productId     String
  product       Product   @relation(fields: [productId], references: [id])
  
  quantity      Int       @default(1)
  
  // Tracking nguồn gốc (từ món nào)
  recipeId      String?               // ID của công thức
  recipeName    String?               // Tên công thức
  
  addedAt       DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([cartId, productId, recipeId])
  @@index([cartId])
}

// ═══════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════

model Order {
  id            String    @id @default(cuid())
  orderNumber   String    @unique       // Mã đơn hàng hiển thị
  
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  
  // Địa chỉ giao hàng (snapshot)
  addressId     String
  address       Address   @relation(fields: [addressId], references: [id])
  shippingAddress Json                  // Snapshot địa chỉ tại thời điểm đặt
  
  // Items
  items         OrderItem[]
  
  // Giá
  subtotal      Int                     // Tổng tiền hàng
  shippingFee   Int                     // Phí ship
  discount      Int       @default(0)   // Giảm giá
  total         Int                     // Tổng thanh toán
  
  // Payment
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  paidAt        DateTime?
  
  // Order status
  status        OrderStatus @default(PENDING)
  
  // Metadata
  note          String?                 // Ghi chú từ khách
  
  // Tracking
  confirmedAt   DateTime?
  shippedAt     DateTime?
  deliveredAt   DateTime?
  cancelledAt   DateTime?
  cancelReason  String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([userId])
  @@index([status])
  @@index([orderNumber])
}

model OrderItem {
  id            String    @id @default(cuid())
  
  orderId       String
  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId     String
  product       Product   @relation(fields: [productId], references: [id])
  
  // Snapshot thông tin sản phẩm
  productName   String
  productImage  String?
  unitPrice     Int                     // Giá tại thời điểm đặt
  quantity      Int
  subtotal      Int                     // unitPrice * quantity
  
  // Tracking nguồn gốc
  recipeId      String?
  recipeName    String?
  
  createdAt     DateTime  @default(now())

  @@index([orderId])
}

enum PaymentMethod {
  COD           // Thanh toán khi nhận hàng
  MOMO          // Ví MoMo
  VNPAY         // VNPay
}

enum PaymentStatus {
  PENDING       // Chờ thanh toán
  PAID          // Đã thanh toán
  FAILED        // Thanh toán thất bại
  REFUNDED      // Đã hoàn tiền
}

enum OrderStatus {
  PENDING       // Chờ xác nhận
  CONFIRMED     // Đã xác nhận
  PROCESSING    // Đang chuẩn bị
  SHIPPING      // Đang giao
  DELIVERED     // Đã giao
  CANCELLED     // Đã hủy
}
```

---

## 10. AI SERVICE

```typescript
// modules/recipes/ai/ai.service.ts

@Injectable()
export class AIService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  
  async suggestRecipes(input: SuggestRecipeDto): Promise<RecipeResponse[]> {
    // 1. Lấy danh sách sản phẩm còn hàng
    const availableProducts = await this.prisma.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
        weight: true,
        stock: true,
        slug: true,
        category: { select: { name: true } },
      },
    });
    
    // 2. Chuẩn bị context cho AI
    const context = this.buildContext(availableProducts, input);
    
    // 3. Gọi AI API (Claude/GPT)
    const aiResponse = await this.callAI(context);
    
    // 4. Parse và validate response
    const recipes = this.parseAIResponse(aiResponse);
    
    // 5. Enrich với giá thực từ database
    const enrichedRecipes = await this.enrichWithPricing(
      recipes, 
      availableProducts,
      input.servings
    );
    
    return enrichedRecipes;
  }
  
  private buildContext(products: Product[], input: SuggestRecipeDto): string {
    // Build prompt với danh sách sản phẩm và yêu cầu người dùng
    return `
      Bạn là AI gợi ý món ăn cho người Việt.
      
      NGUYÊN LIỆU CÓ SẴN:
      ${products.map(p => `- ${p.name} (${p.price}đ/${p.unit})`).join('\n')}
      
      YÊU CẦU:
      - Ngân sách: ${input.budget}đ
      - Số người: ${input.servings} người
      - Thời gian nấu: tối đa ${input.cookingTime} phút
      
      Gợi ý 3 món ăn phù hợp. Chỉ sử dụng nguyên liệu trong danh sách.
      Trả về JSON theo format: [{ name, description, cookingTime, difficulty, ingredients: [{ productId, amount, unit }], steps: [] }]
    `;
  }
  
  private async enrichWithPricing(
    recipes: AIRecipe[], 
    products: Product[],
    servings: number
  ): Promise<RecipeResponse[]> {
    return recipes.map(recipe => {
      const enrichedIngredients = recipe.ingredients.map(ing => {
        const product = products.find(p => p.id === ing.productId);
        const calculatedPrice = this.calculatePrice(product, ing.amount, servings);
        
        return {
          ...ing,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            url: `/san-pham/${product.slug}`,
          },
          calculatedPrice,
        };
      });
      
      const totalCost = enrichedIngredients.reduce(
        (sum, ing) => sum + ing.calculatedPrice, 
        0
      );
      
      return {
        ...recipe,
        ingredients: enrichedIngredients,
        totalCost,
        formattedTotal: this.formatCurrency(totalCost),
      };
    });
  }
}
```
