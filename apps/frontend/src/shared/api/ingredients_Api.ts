import axiosInstance from './axios_Config';

export interface Ingredient {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIngredientDto {
  name: string;
  description?: string;
}

export interface UpdateIngredientDto {
  name?: string;
  description?: string;
}

export const ingredientsApi = {
  getAll: async (): Promise<Ingredient[]> => {
    const response = await axiosInstance.get<Ingredient[]>('/ingredients');
    return response.data;
  },

  getById: async (id: number): Promise<Ingredient> => {
    const response = await axiosInstance.get<Ingredient>(`/ingredients/${id}`);
    return response.data;
  },

  create: async (data: CreateIngredientDto): Promise<Ingredient> => {
    const response = await axiosInstance.post<Ingredient>('/ingredients', data);
    return response.data;
  },

  update: async (id: number, data: UpdateIngredientDto): Promise<Ingredient> => {
    const response = await axiosInstance.patch<Ingredient>(`/ingredients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/ingredients/${id}`);
  },
};
