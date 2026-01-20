// User types
export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  fullName?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
