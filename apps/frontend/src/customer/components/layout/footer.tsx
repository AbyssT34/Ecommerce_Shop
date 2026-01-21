export function Footer() {
  return (
    <footer className="glass mt-20 border-t border-text-muted/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Về chúng tôi
            </h3>
            <p className="text-text-secondary text-sm">
              Nền tảng gợi ý món ăn thông minh giúp bạn nấu những món ngon từ nguyên liệu có sẵn.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-text-secondary hover:text-text-primary text-sm">
                  Sản phẩm
                </a>
              </li>
              <li>
                <a href="/recipes" className="text-text-secondary hover:text-text-primary text-sm">
                  Gợi ý món ăn
                </a>
              </li>
              <li>
                <a href="/orders" className="text-text-secondary hover:text-text-primary text-sm">
                  Đơn hàng của tôi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Liên hệ
            </h3>
            <p className="text-text-secondary text-sm">
              Email: hotro@ecommerce-shop.com
            </p>
            <p className="text-text-secondary text-sm">
              Điện thoại: 1900-xxxx
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-text-muted/10">
          <p className="text-center text-text-muted text-sm">
            © 2026 Ecommerce Shop. Được phát triển bởi Đội ngũ Kỹ thuật Cấp cao
          </p>
        </div>
      </div>
    </footer>
  );
}
