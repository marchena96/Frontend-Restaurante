import { useAuthStore } from '../store/authStore';

/**
 * Hook para acceder a la sesión de autenticación
 */
export const useAuth = () => {
  const state = useAuthStore((store) => store.state);
  const user = useAuthStore((store) => store.user);
  const token = useAuthStore((store) => store.token);
  const error = useAuthStore((store) => store.error);

  const isAuthenticated = state === 'authenticated' && token !== null;
  const isLoading = state === 'loading';

  return {
    state,
    user,
    token,
    error,
    isAuthenticated,
    isLoading,
  };
};

/**
 * Hook para ejecutar login
 */
export const useLogin = () => {
  const login = useAuthStore((store) => store.login);
  const state = useAuthStore((store) => store.state);
  const error = useAuthStore((store) => store.error);

  return {
    login,
    isLoading: state === 'loading',
    error,
  };
};

/**
 * Hook para ejecutar logout
 */
export const useLogout = () => {
  const logout = useAuthStore((store) => store.logout);
  return { logout };
};
