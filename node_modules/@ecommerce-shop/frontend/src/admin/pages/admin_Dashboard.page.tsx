import { useQuery } from '@tanstack/react-query';
import { GlassCard } from '@shared/components';
import { productsApi, ordersApi } from '@shared/api';
import type { Order } from '@shared/types/order_Types';
import type { Product } from '@shared/types/product_Types';
import { formatCurrency } from '@shared/utils';

export function AdminDashboardPage() {
  const { data: products = [] } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => productsApi.getAll(),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => ordersApi.getAll(),
  });

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    inStockProducts: products.filter((p: Product) => p.stockQuantity > 0).length,
    outOfStockProducts: products.filter((p: Product) => p.stockQuantity === 0).length,
    lowStockProducts: products.filter((p: Product) => p.stockQuantity > 0 && p.stockQuantity < 10).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o: Order) => o.status === 'pending').length,
    approvedOrders: orders.filter((o: Order) => o.status === 'approved').length,
    deliveredOrders: orders.filter((o: Order) => o.status === 'delivered').length,
    rejectedOrders: orders.filter((o: Order) => o.status === 'rejected').length,
    totalRevenue: orders
      .filter((o: Order) => o.status === 'delivered')
      .reduce((sum: number, o: Order) => sum + o.totalAmount, 0),
    pendingRevenue: orders
      .filter((o: Order) => o.status === 'pending' || o.status === 'approved')
      .reduce((sum: number, o: Order) => sum + o.totalAmount, 0),
  };

  const lowStockProducts = products
    .filter((p: Product) => p.stockQuantity > 0 && p.stockQuantity < 10)
    .sort((a: Product, b: Product) => a.stockQuantity - b.stockQuantity)
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Tổng quan Dashboard</h1>
        <p className="text-text-secondary">Chào mừng bạn đến với bảng quản trị</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Tổng doanh thu (Đã giao)</p>
              <p className="text-3xl font-bold gradient-text">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Doanh thu chờ xử lý</p>
              <p className="text-3xl font-bold text-warning">{formatCurrency(stats.pendingRevenue)}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </GlassCard>
      </div>

      {/* Product Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">Kho sản phẩm</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Tổng sản phẩm</p>
                <p className="text-3xl font-bold text-accent-teal">{stats.totalProducts}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Còn hàng</p>
                <p className="text-3xl font-bold text-success">{stats.inStockProducts}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Sắp hết</p>
                <p className="text-3xl font-bold text-warning">{stats.lowStockProducts}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Hết hàng</p>
                <p className="text-3xl font-bold text-error">{stats.outOfStockProducts}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Order Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">Thống kê Đơn hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Tổng đơn</p>
                <p className="text-3xl font-bold text-accent-cyan">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Chờ xử lý</p>
                <p className="text-3xl font-bold text-warning">{stats.pendingOrders}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Đã duyệt</p>
                <p className="text-3xl font-bold text-success">{stats.approvedOrders}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Đã giao</p>
                <p className="text-3xl font-bold text-info">{stats.deliveredOrders}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Đã hủy</p>
                <p className="text-3xl font-bold text-error">{stats.rejectedOrders}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">⚠️ Cảnh báo Sắp hết hàng</h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-text-secondary text-center py-8">Tất cả sản phẩm đều đủ hàng!</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product: Product) => (
                <div key={product.id} className="flex items-center justify-between p-3 glass-dark rounded-lg">
                  <div className="flex-1">
                    <p className="text-text-primary font-medium">{product.name}</p>
                    <p className="text-text-secondary text-sm">{product.category?.name || 'No category'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-warning font-bold">{product.stockQuantity} {product.unit}</p>
                    <p className="text-text-secondary text-xs">còn lại</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Recent Orders */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">📦 Đơn hàng gần đây</h2>
          {recentOrders.length === 0 ? (
            <p className="text-text-secondary text-center py-8">Chưa có đơn hàng nào</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: Order) => (
                <div key={order.id} className="flex items-center justify-between p-3 glass-dark rounded-lg">
                  <div className="flex-1">
                    <p className="text-text-primary font-medium">Đơn #{order.id}</p>
                    <p className="text-text-secondary text-sm">{order.user?.fullName || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent-teal font-bold">{formatCurrency(order.totalAmount)}</p>
                    <p className={`text-xs ${order.status === 'pending' ? 'text-warning' :
                        order.status === 'approved' ? 'text-success' :
                          order.status === 'delivered' ? 'text-info' :
                            'text-error'
                      }`}>
                      {order.status === 'pending' ? 'Chờ xử lý' :
                        order.status === 'approved' ? 'Đã duyệt' :
                          order.status === 'delivered' ? 'Đã giao' :
                            order.status === 'rejected' ? 'Đã từ chối' : order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
