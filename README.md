# 🍜 Ăn Gì Hôm Nay - Vietnamese Food E-commerce with AI

> **"Nấu ngon - Giá rõ - Mua liền"**

Website bán thực phẩm tích hợp AI gợi ý công thức nấu ăn, tự động liên kết nguyên liệu với sản phẩm trong shop và tính tổng chi phí theo giá realtime.

---

## 📋 Tài liệu Đặc tả

| Phần | Nội dung | File |
|------|----------|------|
| 1 | Tầm nhìn sản phẩm & Chân dung người dùng | [01-tam-nhin-san-pham.md](./docs/01-tam-nhin-san-pham.md) |
| 2 | Hành trình người dùng (User Journey) | [02-hanh-trinh-nguoi-dung.md](./docs/02-hanh-trinh-nguoi-dung.md) |
| 3 | Luồng AI gợi ý món + Link + Giá tiền | [03-luong-ai-goi-y.md](./docs/03-luong-ai-goi-y.md) |
| 4 | Design System & UX chi tiết | [04-design-system-ux.md](./docs/04-design-system-ux.md) |
| 5 | Kiến trúc Frontend (Next.js) | [05-frontend-architecture.md](./docs/05-frontend-architecture.md) |
| 6 | Kiến trúc Backend & Database | [06-backend-database.md](./docs/06-backend-database.md) |
| 7 | Mobile, SEO & Chiến lược Scale | [07-mobile-seo-scale.md](./docs/07-mobile-seo-scale.md) |

---

## 🎯 Giá trị Cốt lõi

| Giá trị | Mô tả |
|---------|-------|
| 🎯 **Tiện lợi** | Từ ý tưởng → Giỏ hàng trong 30 giây |
| 💰 **Minh bạch** | Biết chính xác chi phí trước khi mua |
| 🤖 **Thông minh** | AI hiểu khẩu vị & ngân sách người Việt |
| 🛒 **Trọn gói** | Mua đủ nguyên liệu chỉ 1 hành động |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Icons**: Lucide React
- **Font**: Be Vietnam Pro (Google Fonts)

### Backend
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Search**: Meilisearch / PostgreSQL Full-text

### AI
- **Provider**: Claude API / OpenAI GPT
- **Nguyên tắc**: AI chỉ gợi ý logic, Backend là nguồn giá duy nhất

### Authentication
- NextAuth / Auth.js

### Payment
- COD (Thanh toán khi nhận hàng)
- MoMo
- VNPay

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway / Render / VPS

---

## 📱 Các Trang Chính

1. **Trang chủ** - CTA "Hôm nay ăn gì?" + AI gợi ý
2. **Danh mục sản phẩm** - Rau củ, thịt, hải sản, gia vị...
3. **Chi tiết sản phẩm** - Các món có thể nấu từ SP này
4. **Công thức món ăn** - Nguyên liệu có LINK + GIÁ + Mua trọn bộ
5. **Giỏ hàng** - Nhóm theo món ăn
6. **Thanh toán** - 1 trang duy nhất
7. **Tài khoản** - Món yêu thích, lịch sử

---

## 🚀 Bắt đầu

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/AbyssT34/Ecommerce_Shop.git
cd Ecommerce_Shop

# Cài đặt dependencies (sau khi có code)
npm install

# Setup database
npx prisma migrate dev

# Chạy development server
npm run dev
```

---

## 📁 Cấu trúc Thư mục (Dự kiến)

```
Ecommerce_Shop/
├── docs/                    # Tài liệu đặc tả
├── frontend/                # Next.js app
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── stores/         # Zustand stores
│   │   └── styles/         # Global styles
│   └── package.json
├── backend/                 # NestJS app
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── prisma/         # Database schema
│   └── package.json
├── .agent/                  # AI workflow configs
├── .shared/                 # Shared resources
└── README.md
```

---

## 🤖 Luồng AI Gợi ý

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │      │   Backend    │      │   AI API    │
│   (Input)   │ ───▶ │  (Context)   │ ───▶ │  (Logic)    │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Enrich with │
                    │  Real Prices │
                    │  from DB     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Response   │
                    │  with Links  │
                    │  & Total $   │
                    └──────────────┘
```

**Nguyên tắc vàng**: AI KHÔNG giữ giá - Backend là source of truth!

---

## 📄 License

MIT License - Xem [LICENSE](./LICENSE) để biết thêm chi tiết.

---

## 👨‍💻 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo Issue hoặc Pull Request.

---

*Được thiết kế & phát triển với ❤️ cho người Việt*