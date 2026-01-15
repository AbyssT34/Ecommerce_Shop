# 🤖 LUỒNG AI GỢI Ý MÓN + LINK + GIÁ TIỀN

## 4.1 Nguyên tắc Vàng

```
╔═══════════════════════════════════════════════════════════════════════╗
║                    🚨 NGUYÊN TẮC BẮT BUỘC                             ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  1. BACKEND LÀ NGUỒN DỮ LIỆU GIÁ DUY NHẤT                            ║
║     • AI KHÔNG được lưu giữ giá                                       ║
║     • AI KHÔNG được tự tính tổng tiền                                 ║
║     • Backend gửi giá → AI chỉ format hiển thị                        ║
║                                                                       ║
║  2. CHỈ GỢI Ý MÓN CÓ ĐỦ NGUYÊN LIỆU                                  ║
║     • 100% nguyên liệu chính phải còn tồn kho                         ║
║     • Nguyên liệu phụ thiếu → Gợi ý thay thế                          ║
║     • Không có thay thế → Không gợi ý món đó                          ║
║                                                                       ║
║  3. MỖI NGUYÊN LIỆU PHẢI CÓ LINK SẢN PHẨM                            ║
║     • Mapping 1-1: Nguyên liệu ↔ Sản phẩm trong shop                  ║
║     • Link phải dẫn đến đúng sản phẩm                                 ║
║     • Giá hiển thị phải khớp với giá sản phẩm                         ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## 4.2 Kiến trúc Luồng Dữ liệu

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        KIẾN TRÚC AI RECIPE FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

   FRONTEND                    BACKEND                       AI (Claude/GPT)
   ────────                    ───────                       ───────────────
       │                          │                               │
   ┌───┴───┐                      │                               │
   │ User  │                      │                               │
   │ Input │                      │                               │
   │•Budget│                      │                               │
   │•People│                      │                               │
   │•Time  │                      │                               │
   └───┬───┘                      │                               │
       │                          │                               │
       │  POST /api/recipes/suggest                               │
       │  {budget, people, time}  │                               │
       │─────────────────────────▶│                               │
       │                          │                               │
       │                    ┌─────┴─────┐                         │
       │                    │  1. Query │                         │
       │                    │  Products │                         │
       │                    │  In Stock │                         │
       │                    └─────┬─────┘                         │
       │                          │                               │
       │                    ┌─────┴─────┐                         │
       │                    │ 2. Build  │                         │
       │                    │  Context  │                         │
       │                    │ (Products │                         │
       │                    │ + Prices) │                         │
       │                    └─────┬─────┘                         │
       │                          │                               │
       │                          │  Send Context + Prompt        │
       │                          │──────────────────────────────▶│
       │                          │                               │
       │                          │                         ┌─────┴─────┐
       │                          │                         │ 3. AI     │
       │                          │                         │ Suggests  │
       │                          │                         │ Recipes   │
       │                          │                         │ (Logic    │
       │                          │                         │  Only)    │
       │                          │                         └─────┬─────┘
       │                          │                               │
       │                          │  Return Recipe Structure      │
       │                          │◀──────────────────────────────│
       │                          │                               │
       │                    ┌─────┴─────┐                         │
       │                    │ 4. Map    │                         │
       │                    │ Products  │                         │
       │                    │ & Calc    │                         │
       │                    │ Total     │                         │
       │                    └─────┬─────┘                         │
       │                          │                               │
       │  Response with Recipes   │                               │
       │◀─────────────────────────│                               │
       │                          │                               │
   ┌───┴───┐                      │                               │
   │Display│                      │                               │
   │Recipe │                      │                               │
   │+Links │                      │                               │
   │+Total │                      │                               │
   └───────┘                      │                               │
```

## 4.3 Input cho AI (Backend chuẩn bị)

```json
{
  "context": {
    "availableProducts": [
      {
        "id": "prod_001",
        "name": "Cá lóc tươi nguyên con",
        "price": 45000,
        "unit": "con",
        "weight": "500g",
        "stock": 25,
        "category": "hai_san",
        "productUrl": "/san-pham/ca-loc-tuoi"
      },
      {
        "id": "prod_002", 
        "name": "Cà chua Đà Lạt",
        "price": 15000,
        "unit": "gói",
        "weight": "500g",
        "stock": 50,
        "category": "rau_cu",
        "productUrl": "/san-pham/ca-chua-da-lat"
      }
      // ... tất cả sản phẩm còn hàng
    ],
    "userPreferences": {
      "budget": 150000,
      "servings": 2,
      "maxCookingTime": 30,
      "dietaryRestrictions": [],
      "previouslyCooked": ["canh_chua", "thit_kho"]
    }
  },
  "instruction": "Gợi ý 3 món ăn phù hợp với ngân sách và số người. Chỉ sử dụng sản phẩm có trong danh sách. Trả về JSON theo format quy định."
}
```

## 4.4 Output từ AI (Chỉ Logic)

```json
{
  "recipes": [
    {
      "name": "Canh Chua Cá Lóc",
      "description": "Món canh đậm đà hương vị miền Tây, chua thanh, ngọt tự nhiên",
      "cookingTime": 30,
      "difficulty": "Dễ",
      "servings": 2,
      "ingredients": [
        {
          "name": "Cá lóc",
          "amount": 300,
          "unit": "g",
          "productId": "prod_001",
          "isEssential": true
        },
        {
          "name": "Cà chua",
          "amount": 200,
          "unit": "g",
          "productId": "prod_002",
          "isEssential": true
        },
        {
          "name": "Dứa",
          "amount": 150,
          "unit": "g",
          "productId": "prod_003",
          "isEssential": true
        },
        {
          "name": "Đậu bắp",
          "amount": 100,
          "unit": "g",
          "productId": "prod_004",
          "isEssential": false,
          "substitute": "prod_005"
        }
      ],
      "steps": [
        "Sơ chế cá lóc: làm sạch, cắt khúc vừa ăn",
        "Cà chua cắt múi cau, dứa cắt miếng vừa",
        "Đun sôi nước, cho cà chua vào nấu mềm",
        "Cho cá vào, nêm nếm gia vị",
        "Cho các loại rau, tắt bếp"
      ]
    }
  ]
}
```

## 4.5 Backend Xử lý & Enrichment

```javascript
// Backend nhận output từ AI và xử lý

async function enrichRecipeWithPricing(aiRecipe) {
  const enrichedIngredients = await Promise.all(
    aiRecipe.ingredients.map(async (ingredient) => {
      // Lấy thông tin sản phẩm từ database
      const product = await prisma.product.findUnique({
        where: { id: ingredient.productId }
      });
      
      // Tính giá dựa trên số lượng cần
      const calculatedPrice = calculateIngredientPrice(
        product.price,
        product.weight,
        ingredient.amount,
        ingredient.unit
      );
      
      return {
        ...ingredient,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          url: `/san-pham/${product.slug}`,
          image: product.imageUrl
        },
        calculatedPrice: calculatedPrice
      };
    })
  );
  
  // Tính tổng tiền - BACKEND TÍNH, KHÔNG PHẢI AI
  const totalCost = enrichedIngredients.reduce(
    (sum, ing) => sum + ing.calculatedPrice, 
    0
  );
  
  return {
    ...aiRecipe,
    ingredients: enrichedIngredients,
    totalCost: totalCost,
    formattedTotal: formatCurrency(totalCost)
  };
}
```

## 4.6 Response Cuối cùng cho Frontend

```json
{
  "success": true,
  "data": {
    "recipes": [
      {
        "id": "recipe_001",
        "name": "Canh Chua Cá Lóc",
        "slug": "canh-chua-ca-loc",
        "description": "Món canh đậm đà hương vị miền Tây",
        "cookingTime": 30,
        "difficulty": "Dễ",
        "servings": 2,
        "image": "/images/recipes/canh-chua-ca-loc.jpg",
        "ingredients": [
          {
            "name": "Cá lóc",
            "amount": 300,
            "unit": "g",
            "isEssential": true,
            "product": {
              "id": "prod_001",
              "name": "Cá lóc tươi nguyên con",
              "price": 45000,
              "unit": "con",
              "url": "/san-pham/ca-loc-tuoi",
              "image": "/images/products/ca-loc.jpg"
            },
            "calculatedPrice": 45000
          },
          {
            "name": "Cà chua",
            "amount": 200,
            "unit": "g",
            "isEssential": true,
            "product": {
              "id": "prod_002",
              "name": "Cà chua Đà Lạt (500g)",
              "price": 15000,
              "unit": "gói",
              "url": "/san-pham/ca-chua-da-lat",
              "image": "/images/products/ca-chua.jpg"
            },
            "calculatedPrice": 15000
          }
        ],
        "totalCost": 87000,
        "formattedTotal": "87.000đ",
        "steps": [
          "Sơ chế cá lóc: làm sạch, cắt khúc vừa ăn",
          "Cà chua cắt múi cau, dứa cắt miếng vừa"
        ]
      }
    ],
    "meta": {
      "budget": 150000,
      "servings": 2,
      "generatedAt": "2026-01-16T03:00:00Z"
    }
  }
}
```

## 4.7 Xử lý Edge Cases

| Tình huống | Xử lý |
|------------|-------|
| Không đủ nguyên liệu cho bất kỳ món nào | Hiển thị "Xin lỗi, hiện tại không có đủ nguyên liệu. Bạn có muốn xem các sản phẩm đang có?" |
| Nguyên liệu phụ hết hàng | Gợi ý thay thế hoặc bỏ qua (đánh dấu optional) |
| Ngân sách quá thấp | "Với ngân sách này, bạn có thể thử món X đơn giản hơn" |
| AI timeout | Cache kết quả phổ biến, fallback to pre-defined recipes |
| Giá thay đổi giữa lúc xem và mua | Thông báo "Giá đã được cập nhật" + hiển thị giá mới |
