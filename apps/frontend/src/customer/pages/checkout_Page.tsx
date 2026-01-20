import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { useCartStore } from '@shared/store';
import { ordersApi } from '@shared/api';
import { formatCurrency } from '@shared/utils';

const checkoutSchema = z.object({
  shippingAddress: z.string().min(10, 'Please enter a complete address'),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      setError('root', { message: 'Your cart is empty' });
      return;
    }

    setIsLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await ordersApi.create({
        items: orderItems,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
      });

      clearCart();
      navigate('/orders');
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Failed to create order',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Your cart is empty
          </h2>
          <p className="text-text-secondary mb-8">
            Add items to your cart before checking out
          </p>
          <GlassButton variant="primary" size="lg" onClick={() => navigate('/products')}>
            Browse Products
          </GlassButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Checkout</h1>
        <p className="text-text-secondary">Complete your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Address */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <GlassInput
                  label="Shipping Address"
                  type="text"
                  placeholder="123 Main St, City, State, Zip"
                  fullWidth
                  error={errors.shippingAddress?.message}
                  {...register('shippingAddress')}
                />

                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any special instructions for your order..."
                    rows={4}
                    className="w-full glass px-4 py-3 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-teal resize-none"
                    {...register('notes')}
                  />
                  {errors.notes && (
                    <p className="text-error text-sm mt-1">{errors.notes.message}</p>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Payment Info */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Payment Method
              </h2>
              <div className="p-4 glass-dark rounded-lg">
                <p className="text-text-secondary text-sm">
                  💵 Cash on Delivery (COD)
                </p>
                <p className="text-text-secondary text-xs mt-2">
                  Pay when you receive your order
                </p>
              </div>
            </GlassCard>

            {/* Error Display */}
            {errors.root && (
              <div className="p-4 glass-dark rounded-lg border border-error/30">
                <p className="text-error text-sm">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button - Desktop */}
            <div className="hidden lg:block">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                Place Order
              </GlassButton>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-4">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Order Summary
            </h2>

            {/* Items List */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🥗</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-text-secondary text-xs">
                      Qty: {item.quantity} × {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <p className="text-text-primary font-semibold text-sm">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-text-secondary text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary text-sm">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-lg font-semibold text-text-primary">Total</span>
                <span className="text-2xl font-bold gradient-text">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Submit Button - Mobile */}
            <div className="lg:hidden">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                Place Order
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
