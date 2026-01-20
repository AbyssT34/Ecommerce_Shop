import { Link } from 'react-router-dom';
import { GlassCard, GlassButton } from '@shared/components';
import { useCartStore } from '@shared/store';
import { formatCurrency } from '@shared/utils';

export function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCartStore();

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
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
            Add some delicious ingredients to get started!
          </p>
          <Link to="/products">
            <GlassButton variant="primary" size="lg">
              Browse Products
            </GlassButton>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Shopping Cart</h1>
        <p className="text-text-secondary">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <GlassCard key={item.product.id} className="p-6">
              <div className="flex gap-6">
                {/* Product Image Placeholder */}
                <div className="w-24 h-24 bg-gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🥗</span>
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {item.product.name}
                  </h3>
                  {item.product.description && (
                    <p className="text-text-secondary text-sm mb-3">
                      {item.product.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Stock Info */}
                    <span className="text-sm text-text-secondary">
                      Stock: {item.product.stockQuantity}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-text-primary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-text-primary font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQuantity}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-text-primary hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="ml-auto text-error hover:text-error/80 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-sm text-text-secondary mb-1">Price</p>
                  <p className="text-xl font-bold gradient-text">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatCurrency(item.product.price)} each
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-4">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <span className="text-lg font-semibold text-text-primary">Total</span>
                <span className="text-2xl font-bold gradient-text">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            <Link to="/checkout">
              <GlassButton variant="primary" size="lg" fullWidth>
                Proceed to Checkout
              </GlassButton>
            </Link>

            <Link to="/products">
              <GlassButton variant="secondary" size="md" fullWidth className="mt-3">
                Continue Shopping
              </GlassButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
