import { Category } from './category_Entity';
import { ProductIngredient } from './product_Ingredient_Entity';
export declare class Product {
    id: number;
    name: string;
    sku: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categoryId: number;
    category: Category;
    isActive: boolean;
    productIngredients: ProductIngredient[];
    createdAt: Date;
    updatedAt: Date;
}
