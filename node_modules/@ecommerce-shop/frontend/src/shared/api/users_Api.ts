import axiosInstance from './axios_Config';
import type { User } from '../types';

export interface UpdateUserDto {
  fullName?: string;
  phone?: string;
  address?: string;
  role?: 'user' | 'admin';
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  update: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await axiosInstance.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
