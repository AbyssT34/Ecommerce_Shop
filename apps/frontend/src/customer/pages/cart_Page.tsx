import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GlassCard, GlassButton, Badge } from '@shared/components';
import { useCartStore } from '@shared/store';
import { recipesApi } from '@shared/api';
import { formatCurrency } from '@shared/utils';

interface CartRecipeSuggestion {
  id: number;
  name: string;
  description: string;
  matchPercentage: number;
  ingredientsInCart: number;
  ingredientsNeeded: number;
  totalIngredients: number;
  estimatedAdditionalCost: number;
  productSuggestions: {
    inCart: any[];
    needed: any[];
  };
}

export function CartPage() {
  const { items, updateItem, removeItem, totalPrice, totalItems, addItem } = useCartStore();
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);

  // Get product IDs from cart
  const productIds = items.map(item => item.product.id);

  // Fetch AI recipe suggestions based on cart
  const { data: recipeSuggestions = [] } = useQuery<CartRecipeSuggestion[]>({
    queryKey: ['recipes', 'suggest-from-cart', productIds],
    queryFn: () => recipesApi.suggestFromCart(productIds),
    enabled: productIds.length > 0,
  });

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateItem(cartItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeItem(cartItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleAddNeededIngredients = async (recipe: CartRecipeSuggestion) => {
    try {
      for (const suggestion of recipe.productSuggestions.needed) {
        if (suggestion.suggestedProduct) {
          await addItem(suggestion.suggestedProduct.id, 1);
        }
      }
      alert(`Đã thêm ${recipe.productSuggestions.needed.length} nguyên liệu còn thiếu vào giỏ hàng!`);
    } catch (error) {
      console.error('Failed to add ingredients:', error);
    }
  };

  // Get emoji for product
  const getProductEmoji = (name: string) => {
    if (name.includes('Thịt')) return '🥩';
    if (name.includes('Cá')) return '🐟';
    if (name.includes('Trứng')) return '🥚';
    if (name.includes('Rau') || name.includes('Cải')) return '🥬';
    if (name.includes('Cà chua')) return '🍅';
    if (name.includes('Hành') || name.includes('Tỏi')) return '🧅';
    if (name.includes('Gừng') || name.includes('Sả')) return '🌿';
    if (name.includes('Ớt')) return '🌶️';
    if (name.includes('Nước mắm') || name.includes('Đường') || name.includes('Muối')) return '🧂';
    return '🥘';
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <GlassCard className="p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-text-secondary mb-8">
            Thêm nguyên liệu để bắt đầu nấu ăn!
          </p>
          <Link to="/products">
            <GlassButton variant="primary" size="lg">
              Mua sắm ngay
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Giỏ hàng của bạn</h1>
        <p className="text-text-secondary">
          {totalItems} sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <GlassCard key={item.product.id} className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gradient-to-br from-white/5 to-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">{getProductEmoji(item.product.name)}</span>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-text-primary mb-1 truncate">
                    {item.product.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-text-primary hover:bg-white/10 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-text-primary font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockQuantity}
                        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-text-primary hover:bg-white/10 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-error hover:text-error/80 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-xl font-bold gradient-text">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatCurrency(item.product.price)}/sp
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* AI Recipe Suggestions */}
          {recipeSuggestions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2">
                🤖 AI gợi ý món ăn từ giỏ hàng
              </h2>
              <p className="text-text-secondary mb-4">
                Với những nguyên liệu trong giỏ, bạn có thể nấu:
              </p>

              <div className="space-y-4">
                {recipeSuggestions.slice(0, 5).map((recipe) => (
                  <GlassCard key={recipe.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-text-primary">
                            {recipe.name}
                          </h3>
                          <Badge
                            variant={recipe.matchPercentage >= 80 ? 'success' : recipe.matchPercentage >= 50 ? 'warning' : 'default'}
                          >
                            {recipe.matchPercentage}% phù hợp
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                          <span className="text-success">✓ Có sẵn: {recipe.ingredientsInCart}/{recipe.totalIngredients}</span>
                          {recipe.ingredientsNeeded > 0 && (
                            <span className="text-warning">○ Cần thêm: {recipe.ingredientsNeeded}</span>
                          )}
                        </div>

                        {/* Expandable details */}
                        {expandedRecipe === recipe.id && (
                          <div className="mt-4 p-4 glass-dark rounded-lg space-y-3">
                            {recipe.productSuggestions.inCart.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-success mb-2">✓ Đã có trong giỏ:</p>
                                <div className="flex flex-wrap gap-2">
                                  {recipe.productSuggestions.inCart.map((s: any, i: number) => (
                                    <span key={i} className="text-xs px-2 py-1 glass rounded-full text-text-secondary">
                                      {s.ingredientName}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {recipe.productSuggestions.needed.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-warning mb-2">○ Cần mua thêm:</p>
                                <div className="flex flex-wrap gap-2">
                                  {recipe.productSuggestions.needed.map((s: any, i: number) => (
                                    <span key={i} className="text-xs px-2 py-1 glass rounded-full text-text-secondary">
                                      {s.ingredientName} - {formatCurrency(s.suggestedProduct?.price || 0)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-4">
                        <button
                          onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                          className="text-accent-teal text-sm hover:underline"
                        >
                          {expandedRecipe === recipe.id ? 'Thu gọn' : 'Chi tiết'}
                        </button>

                        {recipe.ingredientsNeeded > 0 && (
                          <GlassButton
                            variant="accent"
                            onClick={() => handleAddNeededIngredients(recipe)}
                            className="text-xs whitespace-nowrap"
                          >
                            + Thêm {recipe.ingredientsNeeded} món thiếu
                            <span className="ml-1 text-xs opacity-75">
                              ({formatCurrency(recipe.estimatedAdditionalCost)})
                            </span>
                          </GlassButton>
                        )}

                        {recipe.ingredientsNeeded === 0 && (
                          <Badge variant="success">Đủ nguyên liệu!</Badge>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-4">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-text-secondary">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span>{formatCurrency(parseFloat(totalPrice))}</span>
              </div>
              <div className="flex items-center justify-between text-text-secondary">
                <span>Phí vận chuyển</span>
                <span className="text-success">Miễn phí</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <span className="text-lg font-semibold text-text-primary">Tổng cộng</span>
                <span className="text-2xl font-bold gradient-text">
                  {formatCurrency(parseFloat(totalPrice))}
                </span>
              </div>
            </div>

            <Link to="/checkout">
              <GlassButton variant="primary" size="lg" fullWidth>
                Thanh toán
              </GlassButton>
            </Link>

            <Link to="/products">
              <GlassButton variant="secondary" size="md" fullWidth className="mt-3">
                Tiếp tục mua sắm
              </GlassButton>
            </Link>

            {/* Quick AI tip */}
            {recipeSuggestions.length > 0 && (
              <div className="mt-6 p-4 glass-dark rounded-lg">
                <p className="text-xs text-text-secondary mb-2">💡 Gợi ý AI</p>
                <p className="text-sm text-text-primary">
                  Bạn có thể nấu <span className="text-accent-teal font-semibold">{recipeSuggestions.length} món</span> với nguyên liệu trong giỏ!
                </p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
