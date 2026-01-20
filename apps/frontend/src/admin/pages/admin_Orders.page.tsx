import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard, Badge, GlassButton } from '@shared/components';
import { ordersApi } from '@shared/api';
import { Order } from '@shared/types';
import { formatCurrency, formatDate } from '@shared/utils';

export function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => ordersApi.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order['status'] }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      setSelectedOrder(null);
    },
  });

  const handleApprove = (id: number) => {
    if (confirm('Approve this order? Stock will be deducted.')) {
      updateStatusMutation.mutate({ id, status: 'approved' });
    }
  };

  const handleReject = (id: number) => {
    if (confirm('Reject this order? Stock will be refunded.')) {
      updateStatusMutation.mutate({ id, status: 'rejected' });
    }
  };

  const handleDeliver = (id: number) => {
    if (confirm('Mark this order as delivered?')) {
      updateStatusMutation.mutate({ id, status: 'delivered' });
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<Order['status'], 'warning' | 'success' | 'error' | 'info'> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
      delivered: 'info',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const filteredOrders = {
    pending: orders.filter((o: Order) => o.status === 'pending'),
    approved: orders.filter((o: Order) => o.status === 'approved'),
    delivered: orders.filter((o: Order) => o.status === 'delivered'),
    rejected: orders.filter((o: Order) => o.status === 'rejected'),
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Orders Management</h1>
        <p className="text-text-secondary">Manage and process customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-warning">{filteredOrders.pending.length}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold text-success">{filteredOrders.approved.length}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Delivered</p>
              <p className="text-3xl font-bold text-info">{filteredOrders.delivered.length}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Rejected</p>
              <p className="text-3xl font-bold text-error">{filteredOrders.rejected.length}</p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </GlassCard>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
        </div>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Items</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Total</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-text-primary font-semibold">Date</th>
                  <th className="px-6 py-4 text-right text-text-primary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 text-text-primary font-semibold">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-text-primary">{order.user.fullName}</p>
                        <p className="text-text-secondary text-sm">{order.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{order.items.length} items</td>
                    <td className="px-6 py-4 text-text-primary font-semibold">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(order.id)}
                              className="px-3 py-1 glass rounded text-success hover:bg-success/10 text-sm"
                              disabled={updateStatusMutation.isPending}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(order.id)}
                              className="px-3 py-1 glass rounded text-error hover:bg-error/10 text-sm"
                              disabled={updateStatusMutation.isPending}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {order.status === 'approved' && (
                          <button
                            onClick={() => handleDeliver(order.id)}
                            className="px-3 py-1 glass rounded text-info hover:bg-info/10 text-sm"
                            disabled={updateStatusMutation.isPending}
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <GlassCard
            className="w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e: any) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold gradient-text mb-2">
                  Order #{selectedOrder.id}
                </h2>
                <p className="text-text-secondary text-sm">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            {/* Customer Info */}
            <div className="mb-6 p-4 glass-dark rounded-lg">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p className="text-text-secondary">
                  <span className="text-text-primary font-medium">Name:</span> {selectedOrder.user.fullName}
                </p>
                <p className="text-text-secondary">
                  <span className="text-text-primary font-medium">Email:</span> {selectedOrder.user.email}
                </p>
                <p className="text-text-secondary">
                  <span className="text-text-primary font-medium">Phone:</span> {selectedOrder.user.phone || 'N/A'}
                </p>
                <p className="text-text-secondary">
                  <span className="text-text-primary font-medium">Address:</span> {selectedOrder.shippingAddress}
                </p>
                {selectedOrder.notes && (
                  <p className="text-text-secondary">
                    <span className="text-text-primary font-medium">Notes:</span> {selectedOrder.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 glass-dark rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                        <span className="text-xl">🥗</span>
                      </div>
                      <div>
                        <p className="text-text-primary font-medium">{item.product.name}</p>
                        <p className="text-text-secondary text-sm">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-primary font-semibold">
                      {formatCurrency(item.quantity * item.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 glass-dark rounded-lg mb-6">
              <span className="text-lg font-semibold text-text-primary">Total Amount</span>
              <span className="text-2xl font-bold gradient-text">
                {formatCurrency(selectedOrder.totalPrice)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {selectedOrder.status === 'pending' && (
                <>
                  <GlassButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      handleApprove(selectedOrder.id);
                    }}
                    loading={updateStatusMutation.isPending}
                  >
                    Approve Order
                  </GlassButton>
                  <GlassButton
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      handleReject(selectedOrder.id);
                    }}
                    loading={updateStatusMutation.isPending}
                  >
                    Reject Order
                  </GlassButton>
                </>
              )}
              {selectedOrder.status === 'approved' && (
                <GlassButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    handleDeliver(selectedOrder.id);
                  }}
                  loading={updateStatusMutation.isPending}
                >
                  Mark as Delivered
                </GlassButton>
              )}
              <GlassButton
                variant="secondary"
                size="lg"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
