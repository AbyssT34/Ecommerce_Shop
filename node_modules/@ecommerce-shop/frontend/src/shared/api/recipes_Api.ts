import axiosInstance from './axios_Config';
import type { Recipe, AvailableRecipe } from '../types';

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
  getAvailable: async (): Promise<AvailableRecipe[]> => {
    const response = await axiosInstance.get<AvailableRecipe[]>('/recipes/available');
    return response.data;
  },

  /**
   * Get recipe by ID
   */
  getById: async (id: number): Promise<Recipe> => {
    const response = await axiosInstance.get<Recipe>(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Get recipe with product suggestions
   */
  getWithProducts: async (id: number): Promise<AvailableRecipe> => {
    const response = await axiosInstance.get<AvailableRecipe>(`/recipes/${id}/with-products`);
    return response.data;
  },
};
