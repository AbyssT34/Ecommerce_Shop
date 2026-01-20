import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi, categoriesApi } from '@shared/api';
import { recipesApi } from '@shared/api';
import { GlassCard, GlassButton, Badge } from '@shared/components';
import { formatCurrency } from '@shared/utils';
import type { Product } from '@shared/types/product_Types';
import type { RecipeWithAvailability } from '@shared/types/recipe_Types';

export function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Fetch featured products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getAll(),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  // Fetch AI recipe suggestions
  const { data: recipes = [] } = useQuery<RecipeWithAvailability[]>({
    queryKey: ['recipes', 'available'],
    queryFn: () => recipesApi.getAvailable(),
  });

  // Banner auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banners = [
    {
      title: '🤖 AI Gợi Ý Công Thức',
      subtitle: 'Tìm món ăn phù hợp với nguyên liệu có sẵn',
      cta: 'Khám phá ngay',
      link: '/recipes',
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      title: '🛒 Mua Sắm Thông Minh',
      subtitle: 'Nguyên liệu tươi ngon, giá cả hợp lý',
      cta: 'Mua ngay',
      link: '/products',
      gradient: 'from-teal-500 to-emerald-500',
    },
    {
      title: '👨‍🍳 Nấu Ăn Dễ Dàng',
      subtitle: 'Hướng dẫn chi tiết từng bước',
      cta: 'Xem công thức',
      link: '/recipes',
      gradient: 'from-emerald-500 to-cyan-500',
    },
  ];

  const featuredProducts = products.slice(0, 12);
  const featuredRecipes = recipes.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Banner Carousel - Shopee Style */}
      <section className="relative h-[400px] bg-gradient-to-br from-bg-secondary to-bg-primary overflow-hidden mb-8">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${banner.gradient} opacity-20 absolute`} />
            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
              <div className="max-w-2xl">
                <h1 className="text-6xl font-bold text-white mb-4">{banner.title}</h1>
                <p className="text-2xl text-white/90 mb-8">{banner.subtitle}</p>
                <Link to={banner.link}>
                  <GlassButton variant="primary" size="lg" className="text-lg px-8 py-4">
                    {banner.cta} →
                  </GlassButton>
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Banner indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentBanner
                  ? 'bg-accent-teal w-8'
                  : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* Category Icons - Horizontal Scroll */}
        <section className="mb-12">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            <Link to="/products" className="flex-shrink-0 text-center group">
              <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🛍️</span>
              </div>
              <p className="text-sm text-text-secondary group-hover:text-accent-teal transition-colors">
                Tất cả
              </p>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="flex-shrink-0 text-center group"
              >
                <div className="w-20 h-20 rounded-full glass border-2 border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-accent-teal transition-all">
                  <span className="text-3xl">
                    {category.name.includes('Thịt') ? '🥩' :
                      category.name.includes('Rau') ? '🥬' :
                        category.name.includes('Gia vị') ? '🧂' :
                          category.name.includes('Trứng') ? '🥚' : '🛒'}
                  </span>
                </div>
                <p className="text-sm text-text-secondary group-hover:text-accent-teal transition-colors max-w-[80px] truncate">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Recipe Suggestions */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text flex items-center gap-2">
              🤖 AI GỢI Ý HÔM NAY
            </h2>
            <Link to="/recipes">
              <GlassButton variant="accent" className="text-sm">
                Xem tất cả →
              </GlassButton>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes#recipe-${recipe.id}`}>
                <GlassCard className="p-0 overflow-hidden group hover:scale-105 transition-transform">
                  <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                    <span className="text-6xl">👨‍🍳</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-1">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                      <span>⏱️ {recipe.cookTime || 30}p</span>
                      <span>👥 {recipe.servings || 4}</span>
                    </div>
                    {recipe.isAvailable && (
                      <Badge variant="success" className="text-xs">
                        ✓ Có đủ nguyên liệu
                      </Badge>
                    )}
                    {recipe.estimatedCost && (
                      <p className="text-accent-teal font-semibold mt-2">
                        ~ {formatCurrency(recipe.estimatedCost)}
                      </p>
                    )}
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products - Shopee Grid Style */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-text-primary flex items-center gap-2">
              ⚡ NGUYÊN LIỆU NỔI BẬT
            </h2>
            <Link to="/products">
              <GlassButton variant="accent" className="text-sm">
                Xem tất cả →
              </GlassButton>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {productsLoading ? (
              Array(12).fill(0).map((_, i) => (
                <GlassCard key={i} className="p-4 animate-pulse">
                  <div className="aspect-square bg-white/5 rounded-lg mb-3" />
                  <div className="h-4 bg-white/5 rounded mb-2" />
                  <div className="h-6 bg-white/5 rounded" />
                </GlassCard>
              ))
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-text-secondary">Đang cập nhật sản phẩm...</p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <Link key={product.id} to="/products">
                  <GlassCard className="p-0 overflow-hidden group hover:scale-105 transition-transform h-full">
                    <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center relative">
                      {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="warning" className="text-xs">Sắp hết</Badge>
                        </div>
                      )}
                      {product.stockQuantity === 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="error" className="text-xs">Hết hàng</Badge>
                        </div>
                      )}
                      <span className="text-5xl">
                        {product.name.includes('Thịt') ? '🥩' :
                          product.name.includes('Cá') ? '🐟' :
                            product.name.includes('Trứng') ? '🥚' :
                              product.name.includes('Rau') || product.name.includes('Cải') ? '🥬' :
                                product.name.includes('Cà chua') ? '🍅' :
                                  product.name.includes('Hành') || product.name.includes('Tỏi') ? '🧅' :
                                    product.name.includes('Gừng') || product.name.includes('Sả') ? '🌿' :
                                      product.name.includes('Ớt') ? '🌶️' :
                                        product.name.includes('Nước mắm') || product.name.includes('Đường') || product.name.includes('Muối') ? '🧂' :
                                          '🥘'}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm text-text-primary mb-2 line-clamp-2 h-10">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-accent-teal">
                          {formatCurrency(product.price)}
                        </span>
                        {product.unit && (
                          <span className="text-xs text-text-secondary">/{product.unit}</span>
                        )}
                      </div>
                      {product.stockQuantity > 0 && (
                        <p className="text-xs text-text-secondary mt-1">
                          Còn {product.stockQuantity} {product.unit}
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
