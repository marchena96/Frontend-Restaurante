import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

const axiosClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de solicitud para agregar JWT token
 * TODO: Conectar con el store de autenticación en Fase 2
 */
axiosClient.interceptors.request.use((config: AxiosRequestConfig) => {
  // const token = useAuthStore.getState().token;
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

/**
 * Interceptor de respuesta para manejar errores de autenticación
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // TODO: Limpiar sesión y redirigir a login en Fase 2
      console.error('Sesión expirada. Redirigiendo a login...');
    }
    if (error.response?.status === 403) {
      console.error('Acceso denegado');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
