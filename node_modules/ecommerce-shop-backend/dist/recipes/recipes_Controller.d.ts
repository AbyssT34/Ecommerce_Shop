import { RecipesService } from './recipes_Service';
import { CreateRecipeDto } from './dto/create_Recipe.dto';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    create(createRecipeDto: CreateRecipeDto): Promise<import("./entities/recipe_Entity").Recipe>;
    findAll(): Promise<import("./entities/recipe_Entity").Recipe[]>;
    getAvailableRecipes(): Promise<any[]>;
    suggestRecipesFromCart(body: {
        productIds: number[];
    }): Promise<any[]>;
    getRecipeWithProducts(id: string): Promise<{
        ingredients: any;
        steps: any;
        productSuggestions: any[];
        id: number;
        name: string;
        description: string;
        prepTime: number;
        cookTime: number;
        servings: number;
        difficulty: string;
        imageUrl: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<import("./entities/recipe_Entity").Recipe>;
    update(id: string, updateRecipeDto: CreateRecipeDto): Promise<import("./entities/recipe_Entity").Recipe>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
