import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GlassCard, GlassButton, Badge } from '@shared/components';
import { recipesApi } from '@shared/api';
import type { Recipe } from '@shared/types';

export function AdminRecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['admin', 'recipes'],
    queryFn: () => recipesApi.getAll(),
  });

  const filteredRecipes = recipes.filter((recipe: Recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyLabel = (diff: string) => {
    const map: Record<string, string> = {
      'Easy': 'Dễ',
      'Medium': 'Trung bình',
      'Hard': 'Khó',
    };
    return map[diff] || diff;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Quản lý Công thức</h1>
          <p className="text-text-secondary">Quản lý công thức và gợi ý AI</p>
        </div>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Tổng số Công thức</p>
              <p className="text-3xl font-bold text-accent-teal">{recipes.length}</p>
            </div>
            <div className="text-4xl">📖</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm mb-1">Công thức hoạt động</p>
              <p className="text-3xl font-bold text-success">
                {recipes.filter((r: Recipe) => r.active).length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </GlassCard>

        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Tìm kiếm công thức..."
            className="w-full glass rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent-teal border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe: Recipe) => (
            <GlassCard
              key={recipe.id}
              className="p-6 cursor-pointer hover:scale-[1.02] transition-transform"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-white/5">
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
                <div className="absolute top-2 right-2">
                  <Badge variant={recipe.active ? 'success' : 'default'}>
                    {recipe.active ? 'Hoạt động' : 'Tạm ẩn'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-text-primary line-clamp-1">{recipe.name}</h3>
              </div>

              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {recipe.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span>⏱️ {recipe.cookTime} phút</span>
                <span>👥 {recipe.servings} người</span>
                <span>📊 {getDifficultyLabel(recipe.difficulty)}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-text-secondary text-sm">
                  {recipe.ingredients?.length || 0} nguyên liệu
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRecipe(null)}
        >
          <GlassCard
            className="w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="w-1/3 rounded-lg overflow-hidden glass-dark aspect-video flex-shrink-0">
                {selectedRecipe.imageUrl ? (
                  <img
                    src={selectedRecipe.imageUrl}
                    alt={selectedRecipe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🥘
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-bold gradient-text">{selectedRecipe.name}</h2>
                  <Badge variant={selectedRecipe.active ? 'success' : 'default'}>
                    {selectedRecipe.active ? 'Hoạt động' : 'Tạm ẩn'}
                  </Badge>
                </div>
                <p className="text-text-secondary">{selectedRecipe.description}</p>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 glass-dark rounded-lg text-center">
                <p className="text-2xl font-bold text-accent-teal">{selectedRecipe.prepTime}</p>
                <p className="text-text-secondary text-sm">Sơ chế (phút)</p>
              </div>
              <div className="p-4 glass-dark rounded-lg text-center">
                <p className="text-2xl font-bold text-accent-cyan">{selectedRecipe.cookTime}</p>
                <p className="text-text-secondary text-sm">Nấu (phút)</p>
              </div>
              <div className="p-4 glass-dark rounded-lg text-center">
                <p className="text-2xl font-bold text-success">{selectedRecipe.servings}</p>
                <p className="text-text-secondary text-sm">Khẩu phần</p>
              </div>
              <div className="p-4 glass-dark rounded-lg text-center">
                <p className="text-2xl font-bold text-warning">{getDifficultyLabel(selectedRecipe.difficulty)}</p>
                <p className="text-text-secondary text-sm">Độ khó</p>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Nguyên liệu</h3>
              <div className="glass-dark rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2">
                  {selectedRecipe.ingredients?.map((ing, index) => (
                    <div key={index} className="flex items-center gap-2 text-text-secondary">
                      <span className="text-accent-teal">•</span>
                      <span>{ing.ingredient_name}: {ing.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-3">Các bước thực hiện</h3>
              <div className="space-y-3">
                {selectedRecipe.steps?.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 glass-dark rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <p className="text-text-secondary">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <GlassButton variant="secondary" onClick={() => setSelectedRecipe(null)}>
                Đóng
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
