import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GlassCard, GlassButton, Badge } from '@shared/components';
import { recipesApi } from '@shared/api';
import type { Recipe, RecipeWithAvailability } from '@shared/types/recipe_Types';
import { formatCurrency } from '@shared/utils';
import { useCartStore } from '@shared/store';

export function RecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithAvailability | null>(null);
  const { addItem } = useCartStore();

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', 'available'],
    queryFn: () => recipesApi.getAvailable(),
  });

  const handleSelectRecipe = async (recipe: RecipeWithAvailability) => {
    try {
      const details = await recipesApi.checkAvailability(recipe.id);
      setSelectedRecipe(details);
    } catch (error) {
      console.error('Failed to check recipe availability:', error);
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
        <h1 className="text-4xl font-bold gradient-text mb-4">🤖 AI Recipe Suggestions</h1>
        <p className="text-text-secondary text-lg">
          Smart recipe recommendations based on our available ingredients
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
          <p className="text-text-secondary mt-4">Loading AI suggestions...</p>
        </div>
      ) : recipes.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-text-secondary text-lg">No recipes available at the moment</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipes List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Available Recipes ({recipes.length})
            </h2>
            {recipes.map((recipe: RecipeWithAvailability) => (
              <GlassCard
                key={recipe.id}
                className={`p-6 cursor-pointer transition-all ${selectedRecipe?.id === recipe.id ? 'ring-2 ring-accent-teal' : ''
                  }`}
                hover
                onClick={() => handleSelectRecipe(recipe)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {recipe.name}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">
                      {recipe.description}
                    </p>
                  </div>
                  {recipe.isAvailable && (
                    <Badge variant="success">Available</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>⏱️ {recipe.prepTime} min prep</span>
                  <span>🍳 {recipe.cookTime} min cook</span>
                  <span>👥 {recipe.servings} servings</span>
                </div>

                {recipe.estimatedCost && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="text-accent-teal font-semibold">
                      Est. Cost: {formatCurrency(recipe.estimatedCost)}
                    </span>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          {/* Recipe Details */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            {selectedRecipe ? (
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold gradient-text mb-6">
                  {selectedRecipe.name}
                </h2>

                {/* Ingredients Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Ingredients
                  </h3>
                  <div className="space-y-3">
                    {selectedRecipe.productSuggestions?.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 glass-dark rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-text-primary font-medium">
                            {suggestion.ingredientName}
                            {suggestion.quantity && (
                              <span className="text-text-secondary text-sm ml-2">
                                ({suggestion.quantity})
                              </span>
                            )}
                          </p>
                          {suggestion.suggestedProduct && (
                            <p className="text-sm text-accent-teal mt-1">
                              → {suggestion.suggestedProduct.name} - {formatCurrency(suggestion.suggestedProduct.price)}
                            </p>
                          )}
                        </div>
                        {suggestion.isAvailable ? (
                          <Badge variant="success">✓</Badge>
                        ) : (
                          <Badge variant="error">✗</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {selectedRecipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-accent text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Action Button */}
                {selectedRecipe.isAvailable && (
                  <div className="flex items-center justify-between p-4 glass-dark rounded-lg">
                    <div>
                      <p className="text-text-secondary text-sm">Total Estimated Cost</p>
                      <p className="text-2xl font-bold gradient-text">
                        {formatCurrency(selectedRecipe.estimatedCost || 0)}
                      </p>
                    </div>
                    <GlassButton
                      variant="primary"
                      size="lg"
                      onClick={handleAddAllToCart}
                    >
                      Add All to Cart
                    </GlassButton>
                  </div>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-text-secondary">
                  Select a recipe to view details and ingredients
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
