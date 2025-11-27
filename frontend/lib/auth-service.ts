import { api } from './api';
import { AuthResponse, LoginCredentials, RegisterData } from '@/types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};