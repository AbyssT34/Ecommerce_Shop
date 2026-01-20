import axiosInstance from './axios_Config';
import type { Recipe, AvailableRecipe, RecipeWithAvailability } from '../types';

export const recipesApi = {
  /**
   * Get all recipes
   */
  getAll: async (): Promise<Recipe[]> => {
    const response = await axiosInstance.get<Recipe[]>('/recipes');
    return response.data;
  },

  /**
   * Get available recipes (AI-powered)
   */
  getAvailable: async (): Promise<RecipeWithAvailability[]> => {
    const response = await axiosInstance.get<any[]>('/recipes/available');
    return response.data.map((recipe: any) => ({
      ...recipe,
      isAvailable: true,
      estimatedCost: recipe.productSuggestions?.reduce((sum: number, p: any) => sum + (p.product?.price || 0), 0),
      productSuggestions: recipe.productSuggestions?.map((s: any) => ({
        ...s,
        suggestedProduct: s.product,
        isAvailable: s.product?.stockQuantity > 0,
      })),
    }));
  },

  /**
   * Get recipe by ID
   */
  getById: async (id: number): Promise<Recipe> => {
    const response = await axiosInstance.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Check recipe availability and get product suggestions
   */
  checkAvailability: async (id: number): Promise<RecipeWithAvailability> => {
    const response = await axiosInstance.get<any>(`/recipes/${id}/with-products`);
    const recipe = response.data;
    return {
      ...recipe,
      isAvailable: recipe.productSuggestions?.every((s: any) => s.product?.stockQuantity > 0),
      estimatedCost: recipe.productSuggestions?.reduce((sum: number, p: any) => sum + (p.product?.price || 0), 0),
      productSuggestions: recipe.productSuggestions?.map((s: any) => ({
        ...s,
        suggestedProduct: s.product,
        isAvailable: s.product?.stockQuantity > 0,
      })),
    };
  },

  /**
   * Get recipe with product suggestions
   */
  getWithProducts: async (id: number): Promise<AvailableRecipe> => {
    const response = await axiosInstance.get<AvailableRecipe>(`/recipes/${id}/with-products`);
    return response.data;
  },
};
