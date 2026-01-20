// Recipe types
export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  prepTime?: number;
  cookTime?: number;
  servings: number;
  difficulty?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  ingredient_id: number;
  ingredient_name: string;
  quantity?: string;
}

export interface AvailableRecipe extends Recipe {
  productSuggestions: ProductSuggestion[];
  totalAvailability: number;
  canCook: boolean;
}

export interface ProductSuggestion {
  ingredientId: number;
  ingredientName: string;
  quantity?: string;
  product: {
    id: number;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
  };
  suggestedProduct?: {
    id: number;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
  };
  isPrimary: boolean;
  priority: number;
  isAvailable?: boolean;
}

export interface RecipeWithAvailability extends Recipe {
  productSuggestions?: ProductSuggestion[];
  totalAvailability?: number;
  isAvailable?: boolean;
  estimatedCost?: number;
}
