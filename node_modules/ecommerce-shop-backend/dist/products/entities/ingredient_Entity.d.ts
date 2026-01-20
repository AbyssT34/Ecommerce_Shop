import { ProductIngredient } from './product_Ingredient_Entity';
export declare class Ingredient {
    id: number;
    name: string;
    description: string;
    productIngredients: ProductIngredient[];
    createdAt: Date;
}
