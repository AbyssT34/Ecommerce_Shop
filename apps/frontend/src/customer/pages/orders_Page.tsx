import { useQuery } from '@tanstack/react-query';
import { GlassCard, Badge, GlassButton } from '@shared/components';
import { ordersApi } from '@shared/api';
import type { Order } from '@shared/types/order_Types';
import { formatCurrency, formatDate } from '@shared/utils';

export function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', 'my-orders'],
    queryFn: () => ordersApi.getMyOrders(),
  });

  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<Order['status'], 'warning' | 'success' | 'error' | 'info'> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      delivered: 'info',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">My Orders</h1>
        <p className="text-text-secondary">Track and manage your orders</p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
          <p className="text-text-secondary mt-4">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            No orders yet
          </h2>
          <p className="text-text-secondary mb-8">
            Start shopping to create your first order
          </p>
          <GlassButton variant="primary" size="lg" onClick={() => window.location.href = '/products'}>
            Browse Products
          </GlassButton>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <GlassCard key={order.id} className="p-6">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-text-primary">
                      Order #{order.id}
                    </h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-text-secondary text-sm">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-text-secondary text-sm mb-1">Total Amount</p>
                  <p className="text-2xl font-bold gradient-text">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                <h4 className="text-text-primary font-semibold mb-3">Items</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 glass-dark rounded-lg">
                    <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🥗</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-text-secondary text-sm">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="text-text-primary font-semibold">
                      {formatCurrency(item.quantity * item.price)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 glass-dark rounded-lg">
                  <p className="text-text-secondary text-sm mb-1">Shipping Address</p>
                  <p className="text-text-primary">{order.shippingAddress}</p>
                </div>
                {order.notes && (
                  <div className="p-4 glass-dark rounded-lg">
                    <p className="text-text-secondary text-sm mb-1">Order Notes</p>
                    <p className="text-text-primary">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              {(order.approvedAt || order.deliveredAt) && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-text-secondary text-sm mb-3">Order Timeline</p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent-teal"></div>
                      <span className="text-text-secondary">
                        Created: {formatDate(order.createdAt)}
                      </span>
                    </div>
                    {order.approvedAt && (
                      <>
                        <span className="text-text-secondary">→</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          <span className="text-text-secondary">
                            Approved: {formatDate(order.approvedAt)}
                          </span>
                        </div>
                      </>
                    )}
                    {order.deliveredAt && (
                      <>
                        <span className="text-text-secondary">→</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-info"></div>
                          <span className="text-text-secondary">
                            Delivered: {formatDate(order.deliveredAt)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
