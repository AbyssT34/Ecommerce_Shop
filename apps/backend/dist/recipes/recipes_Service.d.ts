import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe_Entity';
import { Product } from '../products/entities/product_Entity';
import { ProductIngredient } from '../products/entities/product_Ingredient_Entity';
import { CreateRecipeDto } from './dto/create_Recipe.dto';
export declare class RecipesService {
    private recipesRepository;
    private productsRepository;
    private productIngredientsRepository;
    constructor(recipesRepository: Repository<Recipe>, productsRepository: Repository<Product>, productIngredientsRepository: Repository<ProductIngredient>);
    create(createRecipeDto: CreateRecipeDto): Promise<Recipe>;
    findAll(): Promise<Recipe[]>;
    findOne(id: number): Promise<Recipe>;
    update(id: number, updateRecipeDto: CreateRecipeDto): Promise<Recipe>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getAvailableRecipes(): Promise<any[]>;
    private checkRecipeAvailability;
    private getProductSuggestionsForRecipe;
    getRecipeWithProducts(id: number): Promise<{
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
    suggestRecipesFromCart(productIds: number[]): Promise<any[]>;
}
