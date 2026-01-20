# 📝 NAMING CONVENTION UPDATE

> **Updated**: 2026-01-20
> **Change**: Từ kebab-case → snake_PascalCase pattern

---

## 🔄 THAY ĐỔI NAMING CONVENTION

### ❌ CŨ (kebab-case)
```
user-auth.service.ts
product-card.tsx
ingredient-drawer.tsx
```

### ✅ MỚI (snake_PascalCase)
```
user_AuthService.ts
product_Card.tsx
ingredient_Drawer.tsx
```

---

## 📐 QUY TẮC MỚI

### Pattern: `abc_Xyz.extension`

**Cấu trúc:**
- **Phần prefix**: `lowercase_snake_case`
- **Phần type**: `PascalCase`

**Ví dụ Backend (NestJS):**
```
✅ auth_Controller.ts
✅ users_Service.ts
✅ product_Entity.ts
✅ create_Product.dto.ts
✅ jwt_Strategy.ts
✅ admin_Guard.ts
✅ http_Exception.filter.ts
```

**Ví dụ Frontend (React):**
```
✅ product_Card.tsx
✅ admin_Layout.tsx
✅ ingredient_Drawer.tsx
✅ use_Auth.ts
✅ glass_Button.tsx
✅ order_Table.tsx
```

---

## 🎯 CÁCH ÁP DỤNG

### Backend Files

**Controllers:**
```
auth_Controller.ts
products_Controller.ts
admin_Orders_Controller.ts
```

**Services:**
```
auth_Service.ts
recipes_Service.ts
admin_Analytics_Service.ts
```

**Entities:**
```
user_Entity.ts
product_Entity.ts
order_Item.entity.ts
```

**DTOs:**
```
login_Dto.ts
create_Product.dto.ts
filter_Recipe.dto.ts
```

**Guards:**
```
jwt_Auth.guard.ts
admin_Guard.ts
```

**Helpers/Utils:**
```
ai_Suggestion.helper.ts
format_Currency.ts
generate_Order_Number.ts
```

### Frontend Files

**Components:**
```
product_Card.tsx
ingredient_Drawer.tsx
admin_Sidebar.tsx
glass_Button.tsx
```

**Pages:**
```
home_Page.tsx
product_List_Page.tsx
admin_Dashboard_Page.tsx
```

**Hooks:**
```
use_Auth.ts
use_Cart.ts
use_AI_Recipe.ts
```

**API Services:**
```
auth_Api.ts
products_Api.ts
recipes_Api.ts
```

**Types:**
```
user_Types.ts
product_Types.ts
api_Response.types.ts
```

**Stores (Zustand):**
```
auth_Store.ts
cart_Store.ts
ui_Store.ts
```

---

## 📊 SO SÁNH VỚI CÁC CONVENTION KHÁC

| Style | Example | Use Case |
|-------|---------|----------|
| **kebab-case** | `user-auth.service.ts` | Standard NestJS/Angular |
| **PascalCase** | `UserAuthService.ts` | C#, Java files |
| **camelCase** | `userAuthService.ts` | JavaScript legacy |
| **snake_case** | `user_auth_service.ts` | Python, Ruby |
| **snake_PascalCase** ✅ | `user_AuthService.ts` | **Project custom** |

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Class/Function Names KHÔNG ĐỔI

**Class names vẫn PascalCase:**
```typescript
// File: user_AuthService.ts
export class UserAuthService {  // ✅ PascalCase
  async validateUser() {}        // ✅ camelCase
}
```

**Component names vẫn PascalCase:**
```typescript
// File: product_Card.tsx
export const ProductCard: React.FC = () => {  // ✅ PascalCase
  return <div>...</div>
}
```

**Hook names vẫn camelCase:**
```typescript
// File: use_Auth.ts
export const useAuth = () => {  // ✅ camelCase (với prefix 'use')
  // ...
}
```

---

## 🔄 MIGRATION GUIDE

### Nếu đã có code với kebab-case:

**Bước 1: Đổi tên file**
```bash
# Backend
mv user-auth.service.ts user_AuthService.ts
mv jwt-auth.guard.ts jwt_Auth.guard.ts

# Frontend
mv product-card.tsx product_Card.tsx
mv admin-layout.tsx admin_Layout.tsx
```

**Bước 2: Update imports**
```typescript
// Trước
import { UserAuthService } from './user-auth.service';

// Sau
import { UserAuthService } from './user_AuthService';
```

**Bước 3: Kiểm tra lại**
```bash
# Build để check errors
npm run build
```

---

## 📚 TÀI LIỆU LIÊN QUAN

- [WORKFLOW.md](./WORKFLOW.md#21-backend-code-style-nestjs) - Code standards chi tiết
- [ARCHITECTURE.md](./ARCHITECTURE.md#21-folder-structure---nestjs-architecture) - Cấu trúc thư mục đầy đủ

---

## ✅ CHECKLIST

Khi tạo file mới:

- [ ] Sử dụng pattern `abc_Xyz.extension`
- [ ] Phần prefix: lowercase với dấu gạch dưới
- [ ] Phần type: PascalCase (Service, Controller, Entity, Component, Page...)
- [ ] Class/Function names vẫn giữ nguyên convention cũ
- [ ] Update imports trong các file liên quan

---

**Maintained by**: Senior Engineering Team
**Questions**: Liên hệ team lead nếu có thắc mắc
