import axiosInstance from './axios_Config';
import type { CartItem, CartSummary, AddToCartDto } from '../types';

export const cartApi = {
  /**
   * Get user cart
   */
  getCart: async (): Promise<CartSummary> => {
    const response = await axiosInstance.get<CartSummary>('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   */
  addItem: async (data: AddToCartDto): Promise<CartItem> => {
    const response = await axiosInstance.post<CartItem>('/cart', data);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (id: number, quantity: number): Promise<CartItem> => {
    const response = await axiosInstance.patch<CartItem>(`/cart/${id}`, { quantity });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeItem: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/cart/${id}`);
  },

  /**
   * Clear cart
   */
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete('/cart');
  },
};
