# Guía: Resolución del Error de Tipo en AdminLayout

## 1. Problema

### Error TypeScript

```
Type '({ children }: AdminLayout) => Element'
is not assignable to type 'RouteComponent | undefined'.
  Property 'children' is missing in type '{}'
  but required in type 'AdminLayout'.
```

### Causa Raíz

`AdminLayout.tsx` definía una interfaz con `children: ReactNode` y el componente esperaba recibir `{ children }`. Sin embargo, el router (`@tanstack/react-router`) renderiza los componentes de ruta **sin** pasar `children` — usa `<Outlet />` para renderizar rutas hijas.

El error de TypeScript significa: "el router llama `AdminLayout({})` (objeto vacío), pero la función exige `children` que no viene".

### Archivos Involucrados

| Archivo | Rol |
|---------|-----|
| `src/shared/layouts/AdminLayout.tsx` | Layout del panel admin (componente de ruta) |
| `src/app/router.tsx` | Define `adminRoute` con `component: AdminLayout` |
| `src/shared/layouts/MainLayout.tsx` | Layout para rutas públicas (wrapper, no afectado) |

---

## 2. Diagnóstico

1. `router.tsx:36` — `adminRoute` asigna `AdminLayout` como `component`.
2. `router.tsx:39-67` — rutas hijas (`adminDashboardRoute`, `adminClientsRoute`, etc.) se pasan via `adminRoute.addChildren([...])`.
3. `AdminLayout.tsx:5-7` — interfaz `AdminLayout` exige `children: ReactNode`.
4. `AdminLayout.tsx:47` — función recibe `{ children }`.
5. `AdminLayout.tsx:79` — renderiza `{children}`.

El router espera que `AdminLayout` sea `RouteComponent` (firma `(props: {}) => any`), pero la función tiene firma `({ children }: AdminLayout) => Element` — incompatible porque le falta `children`.

---

## 3. Solución Aplicada

### Cambios en `AdminLayout.tsx`

| Antes | Después |
|-------|---------|
| `import type { ReactNode } from 'react'` | Eliminado |
| `interface AdminLayout { children: ReactNode }` | Eliminado |
| `import { Link, useRouterState }` | `import { Link, Outlet, useRouterState }` |
| `to: '/'` | `to: '/admin'` |
| `to: '/clients'` | `to: '/admin/clients'` |
| `to: '/infrastructure'` | `to: '/admin/infrastructure'` |
| `to: '/reservations'` | `to: '/admin/reservations'` |
| `to: '/waiting-list'` | `to: '/admin/waiting-list'` |
| `pathname.startsWith('/clients')` | `pathname.startsWith('/admin/clients')` |
| (similar para infrastructure, reservations, waiting-list) | |
| `export function AdminLayout({ children }: AdminLayout)` | `export function AdminLayout()` |
| `<main>{children}</main>` | `<main><Outlet /></main>` |

### Principios

1. **Los route components no reciben `children`** — el router maneja el anidamiento via `<Outlet />`.
2. **Las rutas admin están bajo `/admin/...`** — los links y `getActiveModule` deben reflejar el path real.
3. **Sin interfaz de props** — un route component puro no necesita interfaz de props, recibe `{}`.

---

## 4. Verificación

```bash
npm run build
# tsc -b   → 0 errors
# vite build → built in 721ms
```

El build pasa limpio: `tsc -b` (type-check) y `vite build` (bundle) producen cero errores.

---

## 5. Lecciones

- No usar `{ children }` en componentes asignados a `component:` de una ruta — usar `<Outlet />`.
- Los paths de navegación sidebar deben coincidir con la estructura real del router (`/admin/*` no `/*`).
- Después de cambios estructurales, siempre ejecutar `tsc -b` para verificar tipos, no solo el bundler.
- Si hay errores fantasmas en VS Code (no en CLI), limpiar `node_modules/.tmp/` y reiniciar TS Server.
