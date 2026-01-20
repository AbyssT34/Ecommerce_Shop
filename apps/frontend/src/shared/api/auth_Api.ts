import axiosInstance from './axios_Config';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = {
  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Logout user (client-side)
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
};
