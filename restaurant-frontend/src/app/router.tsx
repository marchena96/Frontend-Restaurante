import React from 'react';
import { RootRoute, Route, Router } from '@tanstack/react-router';
import { MainLayout } from '@/shared/layouts/MainLayout';

/**
 * Ruta raíz - Layout principal
 */
const rootRoute = new RootRoute({
  component: () => <MainLayout />,
});

/**
 * Ruta de índice - Dashboard principal
 */
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-brand-primary mb-4">
        Bienvenido al Sistema de Restaurante
      </h1>
      <p className="text-gray-600">
        Esta es la página de inicio. Las demás características se implementarán en fases posteriores.
      </p>
    </div>
  ),
});

/**
 * Construir árbol de rutas
 */
const routeTree = rootRoute.addChildren([
  indexRoute,
]);

/**
 * Instancia del router
 */
export const router = new Router({ routeTree });

/**
 * Registrar instancia del router para DevTools
 */
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
