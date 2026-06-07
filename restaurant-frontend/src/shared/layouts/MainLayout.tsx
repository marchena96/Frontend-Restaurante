import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';

/**
 * Navbar - Barra superior de navegación
 */
export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { logout } = useLogout();

  return (
    <nav className="bg-brand-primary text-white shadow-lg">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold">🍽️ Restaurante</div>
          <span className="text-sm text-brand-accent">Sistema Integral</span>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-brand-accent">{user.role}</p>
            </div>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

/**
 * Sidebar - Panel lateral de navegación
 */
export const Sidebar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="w-sidebar bg-gray-100 border-r border-gray-300 min-h-screen p-6">
      <nav className="space-y-4">
        <a
          href="/"
          className="block px-4 py-2 text-gray-700 hover:bg-brand-secondary hover:text-white rounded transition"
        >
          📊 Dashboard
        </a>
        <a
          href="/clients"
          className="block px-4 py-2 text-gray-700 hover:bg-brand-secondary hover:text-white rounded transition"
        >
          👥 Comensales
        </a>
        <a
          href="/infrastructure"
          className="block px-4 py-2 text-gray-700 hover:bg-brand-secondary hover:text-white rounded transition"
        >
          🏠 Estructura
        </a>
        <a
          href="/reservations"
          className="block px-4 py-2 text-gray-700 hover:bg-brand-secondary hover:text-white rounded transition"
        >
          📅 Reservaciones
        </a>
        <a
          href="/waiting-list"
          className="block px-4 py-2 text-gray-700 hover:bg-brand-secondary hover:text-white rounded transition"
        >
          ⏳ Cola de Espera
        </a>
      </nav>
    </aside>
  );
};

/**
 * MainLayout - Layout principal que combina Navbar y Sidebar
 * Usa Outlet de TanStack Router para renderizar rutas anidadas
 */
export const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Sin autenticación, solo mostrar contenido (página de login)
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
