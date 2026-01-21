import axiosInstance from './axios_Config';
import type { Product, Category, CreateProductDto } from '../types';

export const productsApi = {
  /**
   * Get all products
   */
  getAll: async (params?: { category?: number; search?: string; inStock?: boolean }): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/products', { params });
    return response.data;
  },

  /**
   * Get product by ID
   */
  getById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Get products by category
   */
  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  },

  /**
   * Create product (Admin only)
   */
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await axiosInstance.post<Product>('/products', data);
    return response.data;
  },

  /**
   * Update product (Admin only)
   */
  update: async (id: number, data: Partial<CreateProductDto>): Promise<Product> => {
    const response = await axiosInstance.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete product (Admin only)
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },
};

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Get category by ID
   */
  getById: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create category (Admin only)
   */
  create: async (data: { name: string; slug?: string; description?: string }): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * Update category (Admin only)
   */
  update: async (id: number, data: { name?: string; slug?: string; description?: string }): Promise<Category> => {
    const response = await axiosInstance.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete category (Admin only)
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};
