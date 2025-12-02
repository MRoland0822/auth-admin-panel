import { api } from './api';

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'USER' | 'ADMIN';
  isActive?: boolean;
}

export const userService = {
  async getUsers(page = 1, limit = 10): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
};