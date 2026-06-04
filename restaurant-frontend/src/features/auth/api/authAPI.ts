import axiosClient from '@/shared/api/axiosClient';
import { AuthTokenResponse, LoginCredentials, User } from '../types/auth';

/**
 * Endpoint de login - Retorna tokens y datos del usuario
 */
export const login = async (credentials: LoginCredentials): Promise<AuthTokenResponse & { user: User }> => {
  const response = await axiosClient.post('/api/auth/login', credentials);
  return response.data;
};

/**
 * Endpoint de logout - Invalida token en backend
 */
export const logout = async (token: string): Promise<void> => {
  await axiosClient.post('/api/auth/logout', {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * Endpoint de refresco de token
 */
export const refreshAuthToken = async (refreshToken: string): Promise<AuthTokenResponse> => {
  const response = await axiosClient.post('/api/auth/refresh', { refreshToken });
  return response.data;
};

/**
 * Endpoint para obtener el usuario actual
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await axiosClient.get('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
