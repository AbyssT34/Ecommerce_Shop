import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GlassCard, GlassButton, GlassInput } from '@shared/components';
import { productsApi, categoriesApi } from '@shared/api';
import type { Product, Category } from '@shared/types/product_Types';
import { formatCurrency } from '@shared/utils';
import { useCartStore } from '@shared/store';

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showInStock, setShowInStock] = useState(false);
  const { addItem } = useCartStore();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => selectedCategory
      ? productsApi.getByCategory(selectedCategory)
      : productsApi.getAll(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = !showInStock || product.stockQuantity > 0;
    return matchesSearch && matchesStock;
  });

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">Shop Ingredients</h1>
        <p className="text-text-secondary text-lg">
          Browse our fresh ingredients for your cooking needs
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <GlassInput
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>

          {/* Stock Filter */}
          <label className="flex items-center gap-2 glass px-4 py-2 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="w-4 h-4 accent-accent-teal"
            />
            <span className="text-text-primary">In Stock Only</span>
          </label>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === null
                ? 'bg-gradient-accent text-white'
                : 'glass text-text-secondary hover:text-text-primary'
            }`}
          >
            All Categories
          </button>
          {categories.map((category: Category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-accent text-white'
                  : 'glass text-text-secondary hover:text-text-primary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
          <p className="text-text-secondary mt-4">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-text-secondary text-lg">No products found</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => (
            <GlassCard key={product.id} className="p-6 flex flex-col" hover>
              {/* Product Image Placeholder */}
              <div className="w-full h-48 bg-gradient-accent rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">🥗</span>
              </div>

              {/* Product Info */}
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {product.name}
              </h3>

              {product.description && (
                <p className="text-text-secondary text-sm mb-4 flex-1">
                  {product.description}
                </p>
              )}

              {/* Stock Badge */}
              <div className="mb-4">
                {product.stockQuantity > 0 ? (
                  <span className="inline-block px-3 py-1 bg-success/20 text-success text-xs font-semibold rounded-full">
                    In Stock ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-error/20 text-error text-xs font-semibold rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-bold gradient-text">
                  {formatCurrency(product.price)}
                </span>
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stockQuantity === 0}
                >
                  Add to Cart
                </GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
