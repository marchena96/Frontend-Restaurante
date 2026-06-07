import { z } from 'zod';

/**
 * Schema de validación para credenciales de login
 */
export const loginCredentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

/**
 * DTO de respuesta de autenticación (.NET 10)
 */
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // segundos
}

/**
 * DTO de usuario autenticado
 */
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Staff';
  createdAt: string;
}

/**
 * Estado de la sesión de autenticación
 */
export type AuthState = 'unauthenticated' | 'authenticated' | 'loading' | 'error';

/**
 * Interfaz completa de sesión
 */
export interface AuthSession {
  state: AuthState;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
}
