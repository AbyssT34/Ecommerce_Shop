export declare class CreateRecipeDto {
    name: string;
    description: string;
    ingredients: {
        ingredient_id: number;
        ingredient_name: string;
        quantity?: string;
    }[];
    steps: string[];
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    difficulty?: string;
    imageUrl?: string;
}
