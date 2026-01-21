import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe_Entity';
import { Product } from '../products/entities/product_Entity';
import { ProductIngredient } from '../products/entities/product_Ingredient_Entity';
import { CreateRecipeDto } from './dto/create_Recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductIngredient)
    private productIngredientsRepository: Repository<ProductIngredient>,
  ) { }

  async create(createRecipeDto: CreateRecipeDto) {
    const recipe = this.recipesRepository.create(createRecipeDto);
    return await this.recipesRepository.save(recipe);
  }

  async findAll() {
    return await this.recipesRepository.find({
      where: { active: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const recipe = await this.recipesRepository.findOne({
      where: { id, active: true },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async update(id: number, updateRecipeDto: CreateRecipeDto) {
    const recipe = await this.findOne(id);
    Object.assign(recipe, updateRecipeDto);
    return await this.recipesRepository.save(recipe);
  }

  async remove(id: number) {
    const recipe = await this.findOne(id);
    recipe.active = false;
    await this.recipesRepository.save(recipe);
    return { message: 'Recipe deactivated successfully' };
  }

  /**
   * AI Recipe Suggestion Logic
   * Returns recipes where ALL ingredients have products with stock > 0
   * Sorts by total availability and priority
   */
  async getAvailableRecipes() {
    const recipes = await this.recipesRepository.find({
      where: { active: true },
    });

    const availableRecipes = [];

    for (const recipe of recipes) {
      // Parse ingredients if it's a JSON string
      const ingredients = typeof recipe.ingredients === 'string'
        ? JSON.parse(recipe.ingredients)
        : recipe.ingredients;

      // Skip recipes without ingredients
      if (!ingredients || ingredients.length === 0) {
        continue;
      }

      const ingredientIds = ingredients.map((ing) => ing.ingredient_id);

      if (ingredientIds.length === 0) {
        continue;
      }

      // Get product suggestions for this recipe (even if partial)
      const productSuggestions = await this.getProductSuggestionsForRecipe(
        ingredientIds,
      );

      const availableIngredientIds = new Set(productSuggestions.map(p => p.ingredientId));
      const missingCount = ingredientIds.filter(id => !availableIngredientIds.has(id)).length;
      const totalStock = productSuggestions.reduce(
        (sum, p) => sum + p.product.stockQuantity,
        0,
      );

      availableRecipes.push({
        ...recipe,
        ingredients: ingredients.map(ing => ({
          ...ing,
          isAvailable: availableIngredientIds.has(ing.ingredient_id)
        })),
        productSuggestions,
        totalAvailability: totalStock,
        missingIngredientsCount: missingCount,
        isFullyAvailable: missingCount === 0
      });
    }

    // Sort by: 
    // 1. Fully available first
    // 2. Fewest missing ingredients
    // 3. Highest total stock
    availableRecipes.sort((a, b) => {
      if (a.isFullyAvailable !== b.isFullyAvailable) {
        return a.isFullyAvailable ? -1 : 1;
      }
      if (a.missingIngredientsCount !== b.missingIngredientsCount) {
        return a.missingIngredientsCount - b.missingIngredientsCount;
      }
      return b.totalAvailability - a.totalAvailability;
    });

    return availableRecipes; // Return all calculated recipes
  }

  /**
   * Check if ALL ingredients have at least one product with stock > 0
   */
  private async checkRecipeAvailability(ingredientIds: number[]): Promise<boolean> {
    for (const ingredientId of ingredientIds) {
      const hasStock = await this.productsRepository
        .createQueryBuilder('product')
        .innerJoin(
          'product.productIngredients',
          'pi',
          'pi.ingredient_id = :ingredientId',
          { ingredientId },
        )
        .where('product.stock_quantity > 0')
        .getCount();

      if (hasStock === 0) {
        return false; // At least one ingredient has no stock
      }
    }

    return true; // All ingredients have stock
  }

  /**
   * Get recommended products for a recipe
   * For each ingredient, select the product with:
   * 1. Highest priority (if multiple products)
   * 2. Highest stock
   */
  private async getProductSuggestionsForRecipe(ingredientIds: number[]) {
    const suggestions = [];

    for (const ingredientId of ingredientIds) {
      const productIngredient = await this.productIngredientsRepository
        .createQueryBuilder('pi')
        .innerJoinAndSelect('pi.product', 'product')
        .innerJoinAndSelect('pi.ingredient', 'ingredient')
        .where('pi.ingredient_id = :ingredientId', { ingredientId })
        .andWhere('product.stock_quantity > 0')
        .orderBy('pi.priority', 'DESC')
        .addOrderBy('product.stock_quantity', 'DESC')
        .getOne();

      if (productIngredient) {
        suggestions.push({
          ingredientId,
          ingredientName: productIngredient.ingredient.name,
          product: {
            id: productIngredient.product.id,
            name: productIngredient.product.name,
            sku: productIngredient.product.sku,
            price: productIngredient.product.price,
            stockQuantity: productIngredient.product.stockQuantity,
            imageUrl: productIngredient.product.imageUrl,
          },
          isPrimary: productIngredient.isPrimary,
          priority: productIngredient.priority,
        });
      }
    }

    return suggestions;
  }

  /**
   * Get recipe details with product suggestions
   */
  async getRecipeWithProducts(id: number) {
    const recipe = await this.findOne(id);

    // Parse ingredients if it's a JSON string
    const ingredients = typeof recipe.ingredients === 'string'
      ? JSON.parse(recipe.ingredients)
      : recipe.ingredients;

    // Parse steps if it's a JSON string
    const steps = typeof recipe.steps === 'string'
      ? JSON.parse(recipe.steps)
      : recipe.steps;

    // Try to get product suggestions, but don't fail if it errors
    let productSuggestions = [];
    try {
      const ingredientIds = ingredients.map((ing) => ing.ingredient_id).filter(id => id);
      if (ingredientIds.length > 0) {
        productSuggestions = await this.getProductSuggestionsForRecipe(ingredientIds);
      }
    } catch (error) {
      console.error('Error getting product suggestions:', error);
      // Continue without product suggestions
    }

    return {
      ...recipe,
      ingredients, // Use parsed ingredients
      steps, // Use parsed steps
      productSuggestions,
    };
  }

  /**
   * AI-powered recipe suggestions based on cart items
   * Analyzes products in cart and suggests recipes that can be made
   */
  async suggestRecipesFromCart(productIds: number[]) {
    if (!productIds || productIds.length === 0) {
      return [];
    }

    // Get all products and their ingredients
    const products = await this.productsRepository.find({
      where: productIds.map(id => ({ id })),
      relations: ['productIngredients', 'productIngredients.ingredient'],
    });

    // Collect all ingredient IDs from cart products
    const cartIngredientIds = new Set<number>();
    products.forEach(product => {
      product.productIngredients?.forEach(pi => {
        if (pi.ingredientId) {
          cartIngredientIds.add(pi.ingredientId);
        }
      });
    });

    if (cartIngredientIds.size === 0) {
      return [];
    }

    // Get all active recipes
    const recipes = await this.recipesRepository.find({
      where: { active: true },
    });

    const suggestions = [];

    for (const recipe of recipes) {
      // Parse ingredients if it's a JSON string
      const ingredients = typeof recipe.ingredients === 'string'
        ? JSON.parse(recipe.ingredients)
        : recipe.ingredients;

      if (!ingredients || ingredients.length === 0) {
        continue;
      }

      const recipeIngredientIds = ingredients.map(ing => ing.ingredient_id);

      // Calculate match percentage
      const matchedIngredients = recipeIngredientIds.filter(id =>
        cartIngredientIds.has(id)
      );
      const matchPercentage = (matchedIngredients.length / recipeIngredientIds.length) * 100;

      // Only suggest recipes with at least 30% match
      if (matchPercentage >= 30) {
        const productSuggestions = await this.getProductSuggestionsForRecipe(recipeIngredientIds);

        // Categorize ingredients
        const inCart = [];
        const needed = [];

        productSuggestions.forEach(suggestion => {
          if (cartIngredientIds.has(suggestion.ingredientId)) {
            inCart.push(suggestion);
          } else {
            needed.push(suggestion);
          }
        });

        suggestions.push({
          ...recipe,
          matchPercentage: Math.round(matchPercentage),
          ingredientsInCart: inCart.length,
          ingredientsNeeded: needed.length,
          totalIngredients: recipeIngredientIds.length,
          productSuggestions: {
            inCart,
            needed,
          },
          estimatedAdditionalCost: needed.reduce((sum, p) => sum + (p.product?.price || 0), 0),
        });
      }
    }

    // Sort by match percentage (highest first)
    suggestions.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return suggestions;
  }
}
