import { Link } from 'react-router-dom';
import { GlassCard } from './glass_Card';
import { GlassButton } from './glass_Button';
import { Badge } from './badge';
import { cn } from '@shared/utils';
import { formatCurrency } from '@shared/utils';
import type { Product } from '@shared/types/product_Types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAddButton?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Get emoji based on product name
const getProductEmoji = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('thịt') && n.includes('bò')) return '🥩';
  if (n.includes('thịt') && n.includes('heo')) return '🥓';
  if (n.includes('thịt') && n.includes('gà')) return '🍗';
  if (n.includes('thịt')) return '🥩';
  if (n.includes('cá')) return '🐟';
  if (n.includes('tôm')) return '🦐';
  if (n.includes('cua')) return '🦀';
  if (n.includes('mực')) return '🦑';
  if (n.includes('trứng')) return '🥚';
  if (n.includes('rau') || n.includes('cải')) return '🥬';
  if (n.includes('cà chua')) return '🍅';
  if (n.includes('hành') || n.includes('tỏi')) return '🧅';
  if (n.includes('gừng') || n.includes('sả')) return '🌿';
  if (n.includes('ớt')) return '🌶️';
  if (n.includes('nước mắm') || n.includes('đường') || n.includes('muối')) return '🧂';
  if (n.includes('khoai')) return '🥔';
  if (n.includes('đậu')) return '🫘';
  if (n.includes('nấm')) return '🍄';
  return '🥘';
};

export function ProductCard({
  product,
  onAddToCart,
  showAddButton = false,
  className,
  size = 'md',
}: ProductCardProps) {
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;

  // Create full image URL if needed
  let imageUrl = product.imageUrl;
  if (imageUrl && !imageUrl.startsWith('http')) {
    if (!imageUrl.startsWith('/')) imageUrl = '/' + imageUrl;
  }

  const sizeClasses = {
    sm: 'max-w-[160px]', // Slightly wider for better spacing
    md: 'max-w-[220px]',
    lg: 'max-w-[300px]',
  };

  const imageSizes = {
    sm: 'aspect-square text-4xl',
    md: 'aspect-square text-5xl',
    lg: 'aspect-square text-6xl', // Keep square aspect ratio for consistency
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && !isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block h-full">
      <GlassCard
        className={cn(
          'p-0 overflow-hidden group cursor-pointer flex flex-col h-full', // block flex flex-col h-full ensures equal height
          'hover:scale-105 transition-transform duration-300',
          className
        )}
        hover
      >
        {/* Product Image */}
        <div className={cn(
          'bg-white flex items-center justify-center relative overflow-hidden p-3', // White bg for product photos
          imageSizes[size]
        )}>
          {/* Stock badges */}
          {isLowStock && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="warning" className="text-xs backdrop-blur-md bg-yellow-500/80">Sắp hết</Badge>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="error" className="text-xs backdrop-blur-md bg-red-500/80">Hết hàng</Badge>
            </div>
          )}

          {/* Product Image with Fallback */}
          <img
            src={imageUrl || ''}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            style={{ display: imageUrl ? 'block' : 'none' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.fallback-emoji')) {
                const emoji = document.createElement('span');
                emoji.className = cn(
                  'fallback-emoji transition-transform group-hover:scale-110',
                  imageSizes[size].includes('text-4xl') ? 'text-4xl' :
                    imageSizes[size].includes('text-5xl') ? 'text-5xl' : 'text-6xl'
                );
                emoji.textContent = getProductEmoji(product.name);
                parent.appendChild(emoji);
                parent.classList.remove('bg-white');
                parent.classList.add('bg-gradient-to-br', 'from-white/5', 'to-white/10');
              }
            }}
          />

          {/* Initial Emoji (if no image URL provided) */}
          {!imageUrl && (
            <span className={cn(
              'transition-transform group-hover:scale-110',
              imageSizes[size].includes('text-4xl') ? 'text-4xl' :
                imageSizes[size].includes('text-5xl') ? 'text-5xl' : 'text-6xl'
            )}>
              {getProductEmoji(product.name)}
            </span>
          )}

          {/* Hover overlay with add button */}
          {showAddButton && !isOutOfStock && (
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleAddToCart}
                className="text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
              >
                + Thêm
              </GlassButton>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={cn(
          'p-3 flex flex-col flex-grow bg-glass-background', // Flex grow to push content to bottom
          size === 'lg' && 'p-4'
        )}>
          <h3 className={cn(
            'text-text-primary mb-1 line-clamp-2 font-medium',
            size === 'sm' ? 'text-xs h-8 leading-4' : size === 'md' ? 'text-sm h-10 leading-5' : 'text-base h-12 leading-6' // Fixed explicit height
          )} title={product.name}>
            {product.name}
          </h3>

          <div className="mt-auto pt-2"> {/* mt-auto pushes this section to the bottom */}
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  'font-bold text-accent-teal',
                  size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
                )}>
                  {formatCurrency(product.price)}
                </span>
                {product.unit && (
                  <span className="text-[10px] text-text-secondary">/{product.unit}</span>
                )}
              </div>
            </div>

            {product.stockQuantity > 0 && (
              <p className="text-[10px] text-text-secondary truncate">
                Còn {product.stockQuantity}
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
