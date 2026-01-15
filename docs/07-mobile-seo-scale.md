# 📱 MOBILE, SEO & CHIẾN LƯỢC SCALE

## 11. CHIẾN LƯỢC MOBILE-FIRST

### 11.1 Responsive Breakpoints

```
╔═══════════════════════════════════════════════════════════════════════╗
║                         BREAKPOINTS                                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  │ Name     │ Min Width │ Tailwind │ Mô tả                       │  ║
║  ├──────────┼───────────┼──────────┼─────────────────────────────┤  ║
║  │ xs       │ 0px       │ default  │ Mobile nhỏ (iPhone SE)      │  ║
║  │ sm       │ 640px     │ sm:      │ Mobile lớn                  │  ║
║  │ md       │ 768px     │ md:      │ Tablet dọc                  │  ║
║  │ lg       │ 1024px    │ lg:      │ Tablet ngang / Laptop nhỏ   │  ║
║  │ xl       │ 1280px    │ xl:      │ Desktop                     │  ║
║  │ 2xl      │ 1536px    │ 2xl:     │ Desktop lớn                 │  ║
║  └──────────┴───────────┴──────────┴─────────────────────────────┘  ║
║                                                                       ║
║  MOBILE-FIRST APPROACH:                                               ║
║  • Design cho mobile trước (320px - 375px)                            ║
║  • Scale up cho tablet và desktop                                     ║
║  • Touch targets tối thiểu 44x44px                                    ║
║  • Bottom navigation trên mobile                                      ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 11.2 Layout Responsive

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    LAYOUT THEO BREAKPOINT                             ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  PRODUCT GRID:                                                        ║
║  ─────────────────────────────────────────────────────────────────    ║
║  │ Breakpoint │ Columns │ Gap    │ Card Width              │        ║
║  ├────────────┼─────────┼────────┼─────────────────────────┤        ║
║  │ Mobile     │ 2       │ 12px   │ ~160px                  │        ║
║  │ Tablet     │ 3       │ 16px   │ ~220px                  │        ║
║  │ Desktop    │ 4       │ 20px   │ ~280px                  │        ║
║  │ Wide       │ 5       │ 24px   │ ~280px                  │        ║
║  └────────────┴─────────┴────────┴─────────────────────────┘        ║
║                                                                       ║
║  RECIPE GRID:                                                         ║
║  ─────────────────────────────────────────────────────────────────    ║
║  │ Mobile     │ 1       │ 16px   │ Full width              │        ║
║  │ Tablet     │ 2       │ 20px   │ ~350px                  │        ║
║  │ Desktop    │ 3       │ 24px   │ ~380px                  │        ║
║  └────────────┴─────────┴────────┴─────────────────────────┘        ║
║                                                                       ║
║  NAVIGATION:                                                          ║
║  ─────────────────────────────────────────────────────────────────    ║
║  │ Mobile     │ Bottom nav (fixed)                          │        ║
║  │ Tablet     │ Bottom nav (fixed)                          │        ║
║  │ Desktop    │ Top header + Sidebar (optional)             │        ║
║  └────────────┴─────────────────────────────────────────────┘        ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 11.3 Touch Optimizations

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    TỐI ƯU CHO MOBILE                                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  TOUCH TARGETS:                                                       ║
║  • Minimum size: 44x44px (Apple guideline)                            ║
║  • Buttons: min-h-11 (44px)                                           ║
║  • List items: py-3 (12px padding)                                    ║
║  • Icons in buttons: w-6 h-6 (24px)                                   ║
║                                                                       ║
║  GESTURES:                                                            ║
║  • Swipe để xóa item trong giỏ hàng                                   ║
║  • Pull to refresh trên danh sách                                     ║
║  • Pinch to zoom trên hình ảnh sản phẩm                               ║
║  • Horizontal scroll cho categories                                   ║
║                                                                       ║
║  PERFORMANCE:                                                         ║
║  • Lazy load images (next/image)                                      ║
║  • Skeleton loading states                                            ║
║  • Optimistic UI updates                                              ║
║  • Prefetch next pages                                                ║
║                                                                       ║
║  ACCESSIBILITY:                                                       ║
║  • Focus visible states                                               ║
║  • Proper labels cho screen readers                                   ║
║  • Skip to content link                                               ║
║  • Sufficient color contrast (AAA)                                    ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 12. CHIẾN LƯỢC SEO

### 12.1 URL Structure

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    CẤU TRÚC URL (Tiếng Việt, Thân thiện SEO)         ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  PAGES:                                                               ║
║  ─────────────────────────────────────────────────────────────────    ║
║  /                           Trang chủ                                ║
║  /san-pham                   Danh sách sản phẩm                       ║
║  /san-pham/ca-loc-tuoi       Chi tiết sản phẩm                       ║
║  /danh-muc/rau-cu            Sản phẩm theo danh mục                   ║
║  /danh-muc/thit-ca           Danh mục thịt cá                         ║
║  /cong-thuc                  Danh sách công thức                      ║
║  /cong-thuc/canh-chua-ca-loc Chi tiết công thức                      ║
║  /goi-y                      AI gợi ý món                             ║
║  /gio-hang                   Giỏ hàng                                 ║
║  /thanh-toan                 Thanh toán                               ║
║  /tai-khoan                  Tài khoản                                ║
║  /tai-khoan/don-hang         Đơn hàng                                 ║
║  /tai-khoan/yeu-thich        Món yêu thích                            ║
║                                                                       ║
║  QUY TẮC SLUG:                                                        ║
║  • Lowercase, không dấu                                               ║
║  • Dùng dấu gạch ngang (-)                                            ║
║  • Ngắn gọn, mô tả nội dung                                           ║
║  • Ví dụ: "Cá Lóc Tươi" → "ca-loc-tuoi"                               ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 12.2 Meta Tags Strategy

```typescript
// Trang Công thức - Meta Tags

// app/cong-thuc/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const recipe = await getRecipe(params.slug);
  
  return {
    title: `${recipe.name} - Công thức nấu ăn | Ăn Gì Hôm Nay`,
    description: `Cách làm ${recipe.name} đơn giản tại nhà. ${recipe.description}. Thời gian: ${recipe.cookingTime} phút. Chi phí từ ${formatCurrency(recipe.totalCost)}.`,
    
    openGraph: {
      title: recipe.name,
      description: recipe.description,
      images: [recipe.image],
      type: 'article',
      locale: 'vi_VN',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: recipe.name,
      description: recipe.description,
      images: [recipe.image],
    },
    
    other: {
      'recipe:cook_time': `PT${recipe.cookingTime}M`,
      'recipe:yield': `${recipe.servings} người`,
    }
  };
}
```

### 12.3 Structured Data (JSON-LD)

```typescript
// Công thức - Recipe Schema

const recipeSchema = {
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Canh Chua Cá Lóc",
  "description": "Món canh đậm đà hương vị miền Tây",
  "image": "https://angihomay.vn/images/canh-chua-ca-loc.jpg",
  "author": {
    "@type": "Organization",
    "name": "Ăn Gì Hôm Nay"
  },
  "datePublished": "2026-01-16",
  "prepTime": "PT15M",
  "cookTime": "PT30M",
  "totalTime": "PT45M",
  "recipeYield": "4 người",
  "recipeCategory": "Món canh",
  "recipeCuisine": "Việt Nam",
  "recipeIngredient": [
    "600g cá lóc",
    "400g cà chua",
    "1 quả dứa"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "Sơ chế cá lóc: làm sạch, cắt khúc vừa ăn"
    }
  ],
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "350 kcal"
  },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "87000",
    "highPrice": "174000",
    "priceCurrency": "VND",
    "offerCount": "5"
  }
};

// Sản phẩm - Product Schema
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Cá Lóc Tươi Nguyên Con",
  "description": "Cá lóc tươi sống, thịt săn chắc, thơm ngon",
  "image": "https://angihomay.vn/images/ca-loc.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Ăn Gì Hôm Nay"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://angihomay.vn/san-pham/ca-loc-tuoi",
    "priceCurrency": "VND",
    "price": "45000",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Ăn Gì Hôm Nay"
    }
  }
};
```

### 12.4 Content Strategy

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    NỘI DUNG CHO SEO                                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  TRANG CÔNG THỨC - NỘI DUNG CHUẨN:                                    ║
║  ─────────────────────────────────────────────────────────────────    ║
║  1. H1: Tên món ăn                                                    ║
║  2. Mô tả ngắn (2-3 câu)                                              ║
║  3. Thông tin meta: Thời gian, độ khó, khẩu phần                      ║
║  4. Hình ảnh chất lượng cao với alt text                              ║
║  5. Danh sách nguyên liệu với link sản phẩm                           ║
║  6. Các bước nấu chi tiết                                             ║
║  7. Mẹo nấu ăn                                                        ║
║  8. Công thức liên quan                                               ║
║                                                                       ║
║  KEYWORD STRATEGY:                                                    ║
║  ─────────────────────────────────────────────────────────────────    ║
║  Primary:                                                             ║
║  • "cách làm [tên món]"                                               ║
║  • "công thức [tên món]"                                              ║
║  • "[tên món] đơn giản"                                               ║
║                                                                       ║
║  Secondary:                                                           ║
║  • "hôm nay ăn gì"                                                    ║
║  • "món ngon mỗi ngày"                                                ║
║  • "nấu ăn tại nhà"                                                   ║
║                                                                       ║
║  Long-tail:                                                           ║
║  • "canh chua cá lóc miền tây"                                        ║
║  • "cách nấu canh chua đơn giản cho 2 người"                          ║
║  • "công thức canh chua cá lóc chuẩn vị"                              ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 13. CHIẾN LƯỢC SCALE & PERFORMANCE

### 13.1 Caching Strategy

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    CACHING LAYERS                                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  LAYER 1: CDN (Vercel Edge)                                           ║
║  ─────────────────────────────────────────────────────────────────    ║
║  • Static assets (images, fonts, CSS, JS)                             ║
║  • ISR pages (revalidate every 60s)                                   ║
║  • Edge caching for API responses                                     ║
║                                                                       ║
║  LAYER 2: Server Cache (Redis)                                        ║
║  ─────────────────────────────────────────────────────────────────    ║
║  │ Key Pattern              │ TTL      │ Data                    │  ║
║  ├──────────────────────────┼──────────┼─────────────────────────┤  ║
║  │ products:list            │ 5 min    │ Danh sách sản phẩm      │  ║
║  │ products:{slug}          │ 5 min    │ Chi tiết sản phẩm       │  ║
║  │ categories:all           │ 1 hour   │ Danh mục                │  ║
║  │ recipes:popular          │ 10 min   │ Món phổ biến            │  ║
║  │ recipes:{slug}           │ 10 min   │ Chi tiết công thức      │  ║
║  │ ai:suggestions:{hash}    │ 30 min   │ Kết quả AI gợi ý        │  ║
║  └──────────────────────────┴──────────┴─────────────────────────┘  ║
║                                                                       ║
║  LAYER 3: Client Cache                                                ║
║  ─────────────────────────────────────────────────────────────────    ║
║  • SWR/React Query với stale-while-revalidate                         ║
║  • LocalStorage cho cart (offline support)                            ║
║  • SessionStorage cho search history                                  ║
║                                                                       ║
║  INVALIDATION:                                                        ║
║  ─────────────────────────────────────────────────────────────────    ║
║  • Webhook khi sản phẩm update → Clear product cache                  ║
║  • Webhook khi giá thay đổi → Clear recipe cache                      ║
║  • Cron job clear AI cache mỗi 30 phút                                ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 13.2 Database Optimization

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    DATABASE OPTIMIZATION                              ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  INDEXES:                                                             ║
║  ─────────────────────────────────────────────────────────────────    ║
║  products:                                                            ║
║  • (categoryId)                 - Lọc theo danh mục                   ║
║  • (slug)                       - Lookup chi tiết                     ║
║  • (price)                      - Sắp xếp theo giá                    ║
║  • (stock) WHERE stock > 0      - Sản phẩm còn hàng                   ║
║  • (name) GIN                   - Full-text search                    ║
║                                                                       ║
║  recipes:                                                             ║
║  • (slug)                       - Lookup chi tiết                     ║
║  • (difficulty)                 - Lọc theo độ khó                     ║
║  • (viewCount DESC)             - Món phổ biến                        ║
║                                                                       ║
║  orders:                                                              ║
║  • (userId, createdAt DESC)     - Lịch sử đơn hàng                    ║
║  • (status)                     - Admin filter                        ║
║                                                                       ║
║  QUERY OPTIMIZATION:                                                  ║
║  ─────────────────────────────────────────────────────────────────    ║
║  • Limit SELECT fields (không SELECT *)                               ║
║  • Pagination với cursor-based (không offset)                         ║
║  • Batch queries cho AI context                                       ║
║  • Connection pooling (PgBouncer)                                     ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 13.3 Deployment Architecture

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    KIẾN TRÚC DEPLOYMENT                               ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║                         ┌─────────────┐                               ║
║                         │   Vercel    │                               ║
║                         │   (CDN)     │                               ║
║                         └──────┬──────┘                               ║
║                                │                                      ║
║            ┌───────────────────┼───────────────────┐                  ║
║            │                   │                   │                  ║
║            ▼                   ▼                   ▼                  ║
║     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐          ║
║     │   Next.js   │     │   Static    │     │    API      │          ║
║     │   (SSR)     │     │   Assets    │     │   Routes    │          ║
║     └──────┬──────┘     └─────────────┘     └──────┬──────┘          ║
║            │                                       │                  ║
║            └───────────────────┬───────────────────┘                  ║
║                                │                                      ║
║                                ▼                                      ║
║                    ┌──────────────────────┐                           ║
║                    │      Railway/VPS     │                           ║
║                    ├──────────────────────┤                           ║
║                    │                      │                           ║
║                    │  ┌────────────────┐  │                           ║
║                    │  │    NestJS      │  │                           ║
║                    │  │    Backend     │  │                           ║
║                    │  └───────┬────────┘  │                           ║
║                    │          │           │                           ║
║                    │  ┌───────┴────────┐  │                           ║
║                    │  │                │  │                           ║
║                    │  ▼                ▼  │                           ║
║                    │ ┌────┐        ┌────┐ │                           ║
║                    │ │Redis│       │ PG │ │                           ║
║                    │ └────┘        └────┘ │                           ║
║                    │                      │                           ║
║                    └──────────────────────┘                           ║
║                                │                                      ║
║                                ▼                                      ║
║                    ┌──────────────────────┐                           ║
║                    │    Claude/GPT API    │                           ║
║                    │    (AI Provider)     │                           ║
║                    └──────────────────────┘                           ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### 13.4 Monitoring & Logging

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    MONITORING STACK                                   ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  ERROR TRACKING:                                                      ║
║  • Sentry (Frontend + Backend)                                        ║
║  • Source maps upload for production                                  ║
║                                                                       ║
║  APM (Application Performance):                                       ║
║  • Vercel Analytics (Frontend)                                        ║
║  • Custom metrics (Backend)                                           ║
║                                                                       ║
║  LOGS:                                                                ║
║  • Pino logger (structured JSON)                                      ║
║  • Log levels: error, warn, info, debug                               ║
║  • Correlation IDs cho request tracing                                ║
║                                                                       ║
║  ALERTS:                                                              ║
║  ─────────────────────────────────────────────────────────────────    ║
║  │ Event                        │ Channel    │ Priority        │     ║
║  ├──────────────────────────────┼────────────┼─────────────────┤     ║
║  │ API error rate > 1%          │ Slack      │ High            │     ║
║  │ AI service timeout           │ Slack      │ Medium          │     ║
║  │ Payment failure              │ Telegram   │ Critical        │     ║
║  │ Database connection failed   │ PagerDuty  │ Critical        │     ║
║  │ Stock < threshold            │ Email      │ Low             │     ║
║  └──────────────────────────────┴────────────┴─────────────────┘     ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 14. ROADMAP PHÁT TRIỂN

### Phase 1: MVP (4-6 tuần)

```
╔═══════════════════════════════════════════════════════════════════════╗
║  PHASE 1: MVP                                                         ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  FRONTEND:                                                            ║
║  ☐ Setup Next.js + Tailwind                                           ║
║  ☐ Trang chủ với AI suggestion form                                   ║
║  ☐ Danh sách & Chi tiết sản phẩm                                      ║
║  ☐ Chi tiết công thức + Nguyên liệu có link                           ║
║  ☐ Giỏ hàng (nhóm theo món)                                           ║
║  ☐ Checkout cơ bản (COD)                                              ║
║  ☐ Mobile responsive                                                  ║
║                                                                       ║
║  BACKEND:                                                             ║
║  ☐ Setup NestJS + Prisma + PostgreSQL                                 ║
║  ☐ CRUD Products, Categories                                          ║
║  ☐ Recipes API với AI integration                                     ║
║  ☐ Cart & Orders API                                                  ║
║  ☐ Tính toán giá realtime                                             ║
║                                                                       ║
║  AI:                                                                  ║
║  ☐ Claude/GPT integration                                             ║
║  ☐ Recipe suggestion logic                                            ║
║  ☐ Price enrichment từ database                                       ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Phase 2: Enhanced (2-4 tuần)

```
╔═══════════════════════════════════════════════════════════════════════╗
║  PHASE 2: ENHANCED                                                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  ☐ User authentication (NextAuth)                                     ║
║  ☐ Lưu món yêu thích                                                  ║
║  ☐ Lịch sử đơn hàng                                                   ║
║  ☐ Payment integration (MoMo, VNPay)                                  ║
║  ☐ Search with autocomplete                                           ║
║  ☐ Rating & Reviews                                                   ║
║  ☐ Push notifications                                                 ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

### Phase 3: Scale (2-4 tuần)

```
╔═══════════════════════════════════════════════════════════════════════╗
║  PHASE 3: SCALE                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  ☐ Redis caching                                                      ║
║  ☐ CDN optimization                                                   ║
║  ☐ Admin dashboard                                                    ║
║  ☐ Analytics & Reporting                                              ║
║  ☐ AI personalization (học từ hành vi user)                           ║
║  ☐ SEO optimization hoàn thiện                                        ║
║  ☐ PWA support                                                        ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

## 15. TÓM TẮT

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    ĂN GÌ HÔM NAY - TÓM TẮT                            ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  🎯 MỤC TIÊU:                                                         ║
║  Biến câu hỏi "Hôm nay ăn gì?" thành trải nghiệm mua sắm liền mạch   ║
║                                                                       ║
║  💡 GIÁ TRỊ ĐỘC ĐÁO:                                                  ║
║  • AI gợi ý món dựa trên ngân sách & nguyên liệu thực có              ║
║  • Mỗi công thức có LINK sản phẩm + GIÁ REALTIME                      ║
║  • 1-click thêm tất cả nguyên liệu vào giỏ                            ║
║  • Giỏ hàng nhóm theo món ăn                                          ║
║                                                                       ║
║  🛠️ TECH STACK:                                                       ║
║  Frontend: Next.js + Tailwind CSS                                     ║
║  Backend: NestJS + Prisma + PostgreSQL                                ║
║  AI: Claude/GPT (logic only, BE là source of truth cho giá)           ║
║                                                                       ║
║  📱 UX PRINCIPLES:                                                    ║
║  • Mobile-first tuyệt đối                                             ║
║  • Giá minh bạch ở mọi bước                                           ║
║  • CTA rõ ràng bằng tiếng Việt đời thường                             ║
║  • Tối thiểu số bước để hoàn thành đơn hàng                           ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

---

**Tài liệu này đủ chi tiết để dev team có thể triển khai ngay.**

*Được tạo bởi Antigravity - AI Coding Assistant*
