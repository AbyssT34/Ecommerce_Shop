import { create } from 'zustand';
import type { CartItem, CartSummary } from '@shared/types';
import { cartApi } from '@shared/api';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: '0',
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const data: CartSummary = await cartApi.getCart();
      set({
        items: data.items,
        totalItems: data.summary.totalItems,
        totalPrice: data.summary.totalPrice,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch cart',
        isLoading: false,
      });
    }
  },

  addItem: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      await cartApi.addItem({ productId, quantity });
      await get().fetchCart(); // Refresh cart
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add item',
        isLoading: false,
      });
      throw error;
    }
  },

  updateItem: async (id, quantity) => {
    set({ isLoading: true, error: null });
    try {
      await cartApi.updateItem(id, quantity);
      await get().fetchCart(); // Refresh cart
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update item',
        isLoading: false,
      });
      throw error;
    }
  },

  removeItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await cartApi.removeItem(id);
      await get().fetchCart(); // Refresh cart
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to remove item',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await cartApi.clearCart();
      set({
        items: [],
        totalItems: 0,
        totalPrice: '0',
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to clear cart',
        isLoading: false,
      });
      throw error;
    }
  },

  getItemQuantity: (productId) => {
    const item = get().items.find((item) => item.productId === productId);
    return item?.quantity || 0;
  },
}));
