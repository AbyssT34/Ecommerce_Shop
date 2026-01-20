// Product types
export interface Product {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  stockQuantity: number;
  unit?: string;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productIngredients?: ProductIngredient[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  products?: Product[];
}

export interface Ingredient {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface ProductIngredient {
  id: number;
  productId: number;
  ingredientId: number;
  product?: Product;
  ingredient?: Ingredient;
  isPrimary: boolean;
  priority: number;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId?: number;
  imageUrl?: string;
  ingredientIds?: number[];
}
