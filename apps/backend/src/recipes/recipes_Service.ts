import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe_Entity';
import { Product } from '../products/entities/product_Entity';
import { ProductIngredient } from '../products/entities/product_Ingredient.entity';
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
  ) {}

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
      const ingredientIds = recipe.ingredients.map((ing) => ing.ingredient_id);

      if (ingredientIds.length === 0) {
        continue;
      }

      // Check if ALL ingredients have products in stock
      const isRecipeAvailable = await this.checkRecipeAvailability(ingredientIds);

      if (isRecipeAvailable) {
        // Get product suggestions for this recipe
        const productSuggestions = await this.getProductSuggestionsForRecipe(
          ingredientIds,
        );

        availableRecipes.push({
          ...recipe,
          productSuggestions,
          totalAvailability: productSuggestions.reduce(
            (sum, p) => sum + p.stockQuantity,
            0,
          ),
        });
      }
    }

    // Sort by total availability (higher stock = better suggestion)
    availableRecipes.sort((a, b) => b.totalAvailability - a.totalAvailability);

    return availableRecipes;
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
    const ingredientIds = recipe.ingredients.map((ing) => ing.ingredient_id);
    const productSuggestions = await this.getProductSuggestionsForRecipe(ingredientIds);

    return {
      ...recipe,
      productSuggestions,
    };
  }
}
