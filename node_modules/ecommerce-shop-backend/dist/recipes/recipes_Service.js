"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const recipe_Entity_1 = require("./entities/recipe_Entity");
const product_Entity_1 = require("../products/entities/product_Entity");
const product_Ingredient_Entity_1 = require("../products/entities/product_Ingredient_Entity");
let RecipesService = class RecipesService {
    constructor(recipesRepository, productsRepository, productIngredientsRepository) {
        this.recipesRepository = recipesRepository;
        this.productsRepository = productsRepository;
        this.productIngredientsRepository = productIngredientsRepository;
    }
    async create(createRecipeDto) {
        const recipe = this.recipesRepository.create(createRecipeDto);
        return await this.recipesRepository.save(recipe);
    }
    async findAll() {
        return await this.recipesRepository.find({
            where: { active: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const recipe = await this.recipesRepository.findOne({
            where: { id, active: true },
        });
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${id} not found`);
        }
        return recipe;
    }
    async update(id, updateRecipeDto) {
        const recipe = await this.findOne(id);
        Object.assign(recipe, updateRecipeDto);
        return await this.recipesRepository.save(recipe);
    }
    async remove(id) {
        const recipe = await this.findOne(id);
        recipe.active = false;
        await this.recipesRepository.save(recipe);
        return { message: 'Recipe deactivated successfully' };
    }
    async getAvailableRecipes() {
        const recipes = await this.recipesRepository.find({
            where: { active: true },
        });
        const availableRecipes = [];
        for (const recipe of recipes) {
            if (!recipe.ingredients || recipe.ingredients.length === 0) {
                continue;
            }
            const ingredientIds = recipe.ingredients.map((ing) => ing.ingredient_id);
            if (ingredientIds.length === 0) {
                continue;
            }
            const isRecipeAvailable = await this.checkRecipeAvailability(ingredientIds);
            if (isRecipeAvailable) {
                const productSuggestions = await this.getProductSuggestionsForRecipe(ingredientIds);
                availableRecipes.push({
                    ...recipe,
                    productSuggestions,
                    totalAvailability: productSuggestions.reduce((sum, p) => sum + p.stockQuantity, 0),
                });
            }
        }
        availableRecipes.sort((a, b) => b.totalAvailability - a.totalAvailability);
        return availableRecipes;
    }
    async checkRecipeAvailability(ingredientIds) {
        for (const ingredientId of ingredientIds) {
            const hasStock = await this.productsRepository
                .createQueryBuilder('product')
                .innerJoin('product.productIngredients', 'pi', 'pi.ingredient_id = :ingredientId', { ingredientId })
                .where('product.stock_quantity > 0')
                .getCount();
            if (hasStock === 0) {
                return false;
            }
        }
        return true;
    }
    async getProductSuggestionsForRecipe(ingredientIds) {
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
    async getRecipeWithProducts(id) {
        const recipe = await this.findOne(id);
        const ingredientIds = recipe.ingredients.map((ing) => ing.ingredient_id);
        const productSuggestions = await this.getProductSuggestionsForRecipe(ingredientIds);
        return {
            ...recipe,
            productSuggestions,
        };
    }
    async suggestRecipesFromCart(productIds) {
        if (!productIds || productIds.length === 0) {
            return [];
        }
        const products = await this.productsRepository.find({
            where: productIds.map(id => ({ id })),
            relations: ['productIngredients', 'productIngredients.ingredient'],
        });
        const cartIngredientIds = new Set();
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
        const recipes = await this.recipesRepository.find({
            where: { active: true },
        });
        const suggestions = [];
        for (const recipe of recipes) {
            if (!recipe.ingredients || recipe.ingredients.length === 0) {
                continue;
            }
            const recipeIngredientIds = recipe.ingredients.map(ing => ing.ingredient_id);
            const matchedIngredients = recipeIngredientIds.filter(id => cartIngredientIds.has(id));
            const matchPercentage = (matchedIngredients.length / recipeIngredientIds.length) * 100;
            if (matchPercentage >= 30) {
                const productSuggestions = await this.getProductSuggestionsForRecipe(recipeIngredientIds);
                const inCart = [];
                const needed = [];
                productSuggestions.forEach(suggestion => {
                    if (cartIngredientIds.has(suggestion.ingredientId)) {
                        inCart.push(suggestion);
                    }
                    else {
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
        suggestions.sort((a, b) => b.matchPercentage - a.matchPercentage);
        return suggestions;
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(recipe_Entity_1.Recipe)),
    __param(1, (0, typeorm_1.InjectRepository)(product_Entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(product_Ingredient_Entity_1.ProductIngredient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RecipesService);
//# sourceMappingURL=recipes_Service.js.map