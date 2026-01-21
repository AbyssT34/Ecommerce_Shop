import { Link } from 'react-router-dom';
import { GlassCard } from './glass_Card';
import { Badge } from './badge';
import { cn } from '@shared/utils';
import { formatCurrency } from '@shared/utils';
import type { RecipeWithAvailability } from '@shared/types/recipe_Types';

interface RecipeCardProps {
  recipe: RecipeWithAvailability;
  onClick?: (recipe: RecipeWithAvailability) => void;
  isSelected?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showAvailability?: boolean;
}

// Get emoji based on recipe name
const getRecipeEmoji = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('phở') || n.includes('bún')) return '🍜';
  if (n.includes('cơm')) return '🍚';
  if (n.includes('bánh')) return '🥮';
  if (n.includes('gà')) return '🍗';
  if (n.includes('cá')) return '🐟';
  if (n.includes('tôm')) return '🦐';
  if (n.includes('canh')) return '🥣';
  if (n.includes('xào')) return '🥘';
  if (n.includes('nướng')) return '🔥';
  if (n.includes('chiên')) return '🍳';
  if (n.includes('hấp')) return '♨️';
  if (n.includes('kho')) return '🍲';
  if (n.includes('lẩu')) return '🫕';
  if (n.includes('gỏi') || n.includes('salad')) return '🥗';
  if (n.includes('chè') || n.includes('dessert')) return '🍮';
  return '👨‍🍳';
};

// Get difficulty badge color
const getDifficultyVariant = (difficulty?: string): 'success' | 'warning' | 'error' | 'default' => {
  if (!difficulty) return 'default';
  const d = difficulty.toLowerCase();
  if (d.includes('dễ') || d.includes('easy')) return 'success';
  if (d.includes('trung') || d.includes('medium')) return 'warning';
  if (d.includes('khó') || d.includes('hard')) return 'error';
  return 'default';
};

export function RecipeCard({
  recipe,
  onClick,
  isSelected = false,
  className,
  size = 'md',
  showAvailability = true,
}: RecipeCardProps) {
  const sizeClasses = {
    sm: 'max-w-[180px]',
    md: 'max-w-[250px]',
    lg: 'max-w-full',
  };

  const imageSizes = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-56',
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(recipe);
    }
  };

  const CardContent = (
    <GlassCard
      className={cn(
        'p-0 overflow-hidden group cursor-pointer',
        'hover:scale-105 transition-all duration-300',
        isSelected && 'ring-2 ring-accent-teal',
        sizeClasses[size],
        className
      )}
      hover
      onClick={handleClick}
    >
      {/* Recipe Image */}
      <div className={cn(
        'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center relative overflow-hidden',
        imageSizes[size]
      )}>
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.recipe-emoji')?.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Availability badge */}
        {showAvailability && recipe.isAvailable && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="success" className="text-xs">Có nguyên liệu</Badge>
          </div>
        )}

        {/* Recipe Emoji - Shown if no image or image fails */}
        <span className={cn(
          'transition-transform group-hover:scale-110 recipe-emoji',
          recipe.imageUrl ? 'hidden' : 'block',
          size === 'sm' ? 'text-5xl' : size === 'md' ? 'text-6xl' : 'text-7xl'
        )}>
          {getRecipeEmoji(recipe.name)}
        </span>
      </div>

      {/* Recipe Info */}
      <div className={cn(
        'p-4',
        size === 'sm' && 'p-3'
      )}>
        <h3 className={cn(
          'text-text-primary font-semibold mb-2 line-clamp-2',
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
        )}>
          {recipe.name}
        </h3>

        {/* Recipe metadata */}
        <div className={cn(
          'flex items-center gap-3 text-text-secondary mb-3',
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          <span>⏱️ {recipe.cookTime || 30} phút</span>
          <span>👥 {recipe.servings || 4} người</span>
          {recipe.difficulty && (
            <Badge variant={getDifficultyVariant(recipe.difficulty)} className="text-xs">
              {recipe.difficulty}
            </Badge>
          )}
        </div>

        {/* Estimated cost */}
        {recipe.estimatedCost && recipe.estimatedCost > 0 && (
          <div className="pt-3 border-t border-white/10">
            <span className="text-accent-teal font-semibold">
              ~ {formatCurrency(recipe.estimatedCost)}
            </span>
          </div>
        )}

        {/* Ingredients availability indicator */}
        {showAvailability && recipe.productSuggestions && recipe.productSuggestions.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-accent rounded-full transition-all"
                style={{
                  width: `${recipe.totalAvailability || (recipe.productSuggestions.filter(s => s.isAvailable).length / recipe.productSuggestions.length * 100)}%`
                }}
              />
            </div>
            <span className="text-xs text-text-secondary">
              {recipe.productSuggestions.filter(s => s.isAvailable).length}/{recipe.productSuggestions.length}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );

  // If onClick is provided, don't wrap in Link
  if (onClick) {
    return CardContent;
  }

  return (
    <Link to={`/recipes/${recipe.id}`}>
      {CardContent}
    </Link>
  );
}
