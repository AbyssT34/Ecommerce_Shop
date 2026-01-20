import { Product } from './product_Entity';
import { Ingredient } from './ingredient_Entity';
export declare class ProductIngredient {
    id: number;
    productId: number;
    ingredientId: number;
    product: Product;
    ingredient: Ingredient;
    isPrimary: boolean;
    priority: number;
}
