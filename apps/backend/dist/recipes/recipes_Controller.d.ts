import { RecipesService } from './recipes_Service';
import { CreateRecipeDto } from './dto/create_Recipe.dto';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    create(createRecipeDto: CreateRecipeDto): Promise<import("./entities/recipe_Entity").Recipe>;
    findAll(): Promise<import("./entities/recipe_Entity").Recipe[]>;
    getAvailableRecipes(): Promise<any[]>;
    findOne(id: string): Promise<import("./entities/recipe_Entity").Recipe>;
    getRecipeWithProducts(id: string): Promise<{
        productSuggestions: any[];
        id: number;
        name: string;
        description: string;
        ingredients: {
            ingredient_id: number;
            ingredient_name: string;
            quantity?: string;
        }[];
        steps: string[];
        prepTime: number;
        cookTime: number;
        servings: number;
        difficulty: string;
        imageUrl: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateRecipeDto: CreateRecipeDto): Promise<import("./entities/recipe_Entity").Recipe>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
