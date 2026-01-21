import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GlassCard, GlassButton, Badge } from '@shared/components';
import { recipesApi } from '@shared/api';
import type { RecipeWithAvailability } from '@shared/types/recipe_Types';
import { formatCurrency } from '@shared/utils';
import { useCartStore } from '@shared/store';

export function RecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithAvailability | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'missing'>('all');
  const { addItem } = useCartStore();

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', 'available'], // Changed key
    queryFn: () => recipesApi.getAvailable(), // Use availability endpoint
  });

  const filteredRecipes = recipes.filter(recipe => {
    if (filter === 'available') return recipe.isFullyAvailable;
    if (filter === 'missing') return !recipe.isFullyAvailable;
    return true;
  });

  const handleSelectRecipe = async (recipe: RecipeWithAvailability) => {
    console.log('Recipe clicked!', recipe.name, recipe.id);
    try {
      const details = await recipesApi.checkAvailability(recipe.id);
      console.log('Recipe details loaded:', details);
      setSelectedRecipe(details);
    } catch (error) {
      console.error('Failed to check recipe availability:', error);
      // Still show the basic recipe info even if API fails
      setSelectedRecipe({
        ...recipe,
        productSuggestions: [],
      });
    }
  };

  const handleAddAllToCart = async () => {
    if (!selectedRecipe?.productSuggestions) return;

    try {
      for (const suggestion of selectedRecipe.productSuggestions) {
        if (suggestion.suggestedProduct) {
          await addItem(suggestion.suggestedProduct.id, 1);
        }
      }
      alert('All ingredients added to cart!');
    } catch (error) {
      console.error('Failed to add ingredients to cart:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-4">🤖 Gợi ý Công thức AI</h1>
        <p className="text-text-secondary text-lg">
          Gợi ý món ăn thông minh dựa trên nguyên liệu có sẵn
        </p>

        {/* Filters */}
        <div className="flex justify-center gap-4 mt-8">
          <GlassButton
            variant={filter === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </GlassButton>
          <GlassButton
            variant={filter === 'available' ? 'success' : 'secondary'}
            onClick={() => setFilter('available')}
          >
            Có thể nấu ngay
          </GlassButton>
          <GlassButton
            variant={filter === 'missing' ? 'danger' : 'secondary'}
            onClick={() => setFilter('missing')}
          >
            Thiếu nguyên liệu
          </GlassButton>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
          <p className="text-text-secondary mt-4">Đang tải gợi ý từ AI...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-text-secondary text-lg">Không tìm thấy công thức nào phù hợp</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipes List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Danh sách món ăn ({filteredRecipes.length})
            </h2>
            {filteredRecipes.map((recipe: RecipeWithAvailability) => (
              <GlassCard
                key={recipe.id}
                className={`p-6 cursor-pointer transition-all ${selectedRecipe?.id === recipe.id ? 'ring-2 ring-accent-teal' : ''
                  }`}
                hover
                onClick={() => handleSelectRecipe(recipe)}
              >
                <div className="flex gap-4">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-text-primary">
                        {recipe.name}
                      </h3>
                      <div className="flex flex-col items-end ml-2 filter-none">
                        {recipe.isFullyAvailable ? (
                          <Badge variant="success">Có thể nấu ngay</Badge>
                        ) : (
                          <>
                            <Badge variant="error" className="bg-red-500/20 text-red-400 border-red-500/50 mb-1">
                              Thiếu {recipe.missingIngredientsCount} NL
                            </Badge>
                            <span className="text-[10px] text-red-400 text-right max-w-[120px] leading-tight">
                              {recipe.ingredients
                                .filter((i: any) => !i.isAvailable)
                                .map((i: any) => i.ingredient_name)
                                .join(', ')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span>⏱️ {recipe.prepTime || 15} phút sơ chế</span>
                      <span>🍳 {recipe.cookTime || 15} phút nấu</span>
                      <span>👥 {recipe.servings} người</span>
                    </div>

                    {(recipe.estimatedCost || 0) > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <span className="text-accent-teal font-semibold">
                          Chi phí: {formatCurrency(recipe.estimatedCost || 0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Image */}
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 relative group-hover:scale-105 transition-transform duration-300">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">🥘</span>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🥘
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Recipe Details */}
          <div className="lg:sticky lg:top-4">
            {selectedRecipe ? (
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold gradient-text mb-4">
                  {selectedRecipe.name}
                </h2>

                {/* Scrollable Content Area */}
                <div className="max-h-[50vh] overflow-y-auto pr-2 mb-4 space-y-6 scrollbar-thin scrollbar-thumb-accent-teal/50 scrollbar-track-transparent">
                  {/* Ingredients Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      Nguyên liệu ({selectedRecipe.productSuggestions?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {selectedRecipe.productSuggestions?.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 glass-dark rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-text-primary font-medium text-sm truncate">
                              {suggestion.ingredientName}
                            </p>
                            {suggestion.suggestedProduct && (
                              <p className="text-xs text-accent-teal truncate">
                                → {suggestion.suggestedProduct.name} - {formatCurrency(suggestion.suggestedProduct.price)}
                              </p>
                            )}
                          </div>
                          {suggestion.isAvailable ? (
                            <Badge variant="success" className="ml-2 flex-shrink-0">✓</Badge>
                          ) : (
                            <Badge variant="error" className="ml-2 flex-shrink-0">Hết hàng</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      Cách làm
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRecipe.steps.map((step, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-accent text-white flex items-center justify-center text-xs font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-text-secondary text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fixed Action Button at Bottom - Always visible */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between p-4 glass-dark rounded-lg">
                    <div>
                      <p className="text-text-secondary text-xs">Tổng chi phí ước tính</p>
                      <p className="text-xl font-bold gradient-text">
                        {formatCurrency(selectedRecipe.estimatedCost || 0)}
                      </p>
                    </div>
                    <GlassButton
                      variant="primary"
                      onClick={handleAddAllToCart}
                    >
                      🛒 Thêm tất cả
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-text-secondary">
                  Chọn một công thức để xem chi tiết và nguyên liệu
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      )
      }
    </div >
  );
}
