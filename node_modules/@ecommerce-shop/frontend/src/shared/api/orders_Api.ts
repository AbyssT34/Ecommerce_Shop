import axiosInstance from './axios_Config';
import type { Order, CreateOrderDto, UpdateOrderStatusDto } from '../types';

export const ordersApi = {
  /**
   * Get user orders
   */
  getAll: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>('/orders');
    return response.data;
  },

  /**
   * Get order by ID
   */
  getById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Create new order
   */
  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await axiosInstance.post<Order>('/orders', data);
    return response.data;
  },

  /**
   * Cancel order (user)
   */
  cancel: async (id: number): Promise<Order> => {
    const response = await axiosInstance.patch<Order>(`/orders/${id}/cancel`);
    return response.data;
  },

  /**
   * Update order status (Admin only)
   */
  updateStatus: async (id: number, data: UpdateOrderStatusDto): Promise<Order> => {
    const response = await axiosInstance.patch<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  /**
   * Get order statistics (Admin only)
   */
  getStats: async (): Promise<any> => {
    const response = await axiosInstance.get('/orders/stats');
    return response.data;
  },
};
