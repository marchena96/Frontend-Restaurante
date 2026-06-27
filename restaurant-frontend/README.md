# Restaurant Enterprise — Frontend

Sistema de gestion operativa para restaurante. Panel administrativo SPA para administrar comensales, mesas, reservaciones, lista de espera y turnos.

---

## Stack

| Capa | Tecnologia | Version |
|---|---|---|
| Framework | React | 19.x |
| Lenguaje | TypeScript | 6.x |
| Build | Vite | 8.x |
| Router | TanStack Router | 1.x |
| Data fetching | TanStack Query | 5.x |
| Formularios | TanStack Form | 0.35.x |
| Estado global | Zustand | 5.x |
| HTTP | Axios | 1.x |
| Validacion | Zod | 4.x |
| Estilos | Tailwind CSS | 3.x |
| Testing | Vitest | 4.x |
| Linter | ESLint | 10.x |

---

## Quick Start

```bash
# Instalacion
pnpm install

# Desarrollo
pnpm dev        # http://localhost:5173

# Build
pnpm build      # Compilar para produccion
pnpm preview    # Previsualizar build

# Testing
pnpm test       # Tests unitarios
pnpm test:watch # Modo watch

# Lint
pnpm lint       # ESLint
```

---

## Estructura del Proyecto

```
src/
├── app/                    # Configuracion core (rutas, query client)
├── features/               # Modulos de negocio (Vertical Slices)
│   ├── auth/               # Autenticacion JWT
│   ├── clients/            # Gestion de comensales
│   ├── dashboard/          # Panel de metricas
│   ├── infrastructure/     # Mesas, zonas, plano del local
│   ├── landing/            # Pagina publica
│   ├── reservations/       # Reservaciones
│   ├── turns/              # Turnos de operacion
│   └── waiting-list/       # Lista de espera
├── shared/                 # Codigo agnostico al negocio
│   ├── api/                # Cliente HTTP con interceptors
│   ├── components/         # UI reutilizable (Button, Skeleton)
│   ├── hooks/              # Hooks compartidos
│   ├── layouts/            # AdminLayout con sidebar responsive
│   ├── lib/                # Query key factories
│   ├── types/              # Tipos globales (EntityId, etc.)
│   └── utils/              # cn(), toast(), errors()
└── config/                 # Variables de entorno (Zod)
```

Cada feature sigue la estructura interna:

```
features/<modulo>/
├── index.ts          # Barrel export
├── api/              # Llamadas HTTP
├── hooks/            # TanStack Query (useQuery, useMutation)
├── services/         # Logica de negocio pura
├── types/            # DTOs e interfaces
├── forms/            # Componentes de formulario
├── components/       # Componentes visuales
└── pages/            # Orquestadores de vista
```

---

## Modulos

| Modulo | Descripcion | Endpoint principal |
|---|---|---|
| **Auth** | Login/logout JWT, sesion persistente | `POST /auth/login` |
| **Dashboard** | Metricas en tiempo real (refetch 30s) | `GET /dashboard` |
| **Clients** | CRUD de con busqueda | `GET /clients` |
| **Infrastructure** | Plano interactivo del salon | `GET /tables/layout` |
| **Reservations** | Wizard de 4 pasos + timeline | `GET /reservations` |
| **Waiting List** | Cola en vivo (refetch 15s) | `GET /waitinglist` |
| **Turns** | CRUD de turnos operativos | `GET /turns` |
| **Landing** | Pagina publica con hero y CTA | `/` |

---

## Funcionalidades Clave

### UI/UX

- **Sidebar responsive:** Drawer en movil con hamburger toggle, overlay oscuro, slide-in animation
- **Skeleton loaders:** Shimmer animation para estados de carga (Dashboard, Clients, Timeline, Turns, WaitingQueue)
- **Toast notifications:** Feedback visual para exito/error en todas las mutaciones
- **Error banners:** Mensajes de error con `role="alert"` para screen readers
- **Landing page:** Pagina publica con hero, features y call-to-action

### Accesibilidad

- **Modales:** `role="dialog"` + `aria-modal` + `aria-labelledby` + cierre con Escape
- **Form labels:** Todos los inputs tienen `htmlFor`/`id` correspondiente
- **Skip link:** "Saltar al contenido principal" al presionar Tab
- **Reduced motion:** Animaciones desactivadas con `prefers-reduced-motion: reduce`
- **ARIA:** `aria-label`, `aria-current="page"`, `aria-expanded` en elementos interactivos

### Cache & Data

- **Query keys centralizadas:** Factory en `shared/lib/queryKeys.ts`
- **Invalidacion completa:** Todas las mutaciones invalidan `dashboard.all`
- **refetchOnWindowFocus:** Datos se refrescan al volver a la pestana
- **Stale time:** 30 segundos por defecto

### CSS

- **Design tokens:** Variables CSS para colores, tipografia, espaciado, bordes, sombras
- **Overlays:** Variables para overlay oscuro y claro
- **Transiciones:** `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (400ms)

---

## Variables de Entorno

| Variable | Default | Descripcion |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base URL de la API |
| `VITE_API_TIMEOUT` | `15000` | Timeout en ms |
| `VITE_APP_ENV` | `development` | `development`, `test`, `staging`, `production` |

Proxy de Vite redirige `/api` → `http://localhost:5052` en desarrollo.

---

## Documentacion

| Documento | Descripcion |
|---|---|
| [Casos de Uso](docs/USE_CASES.md) | Flujos de usuario, actores, reglas de negocio |
| [Arquitectura](docs/ARCHITECTURE.md) | Estructura tecnica, convenciones, changelog |
| [Guia AdminLayout](GUIA.md) | Troubleshooting del layout de rutas |
| [Commit Cheatsheet](CHEATSHEET.md) | Convenciones de commits |

---

## Convenciones

- **Commits:** Conventional Commits (`feat(scope): description`)
- **Branches:** `main` → `develop` → `feat/xxx`, `fix/xxx`
- **Imports:** Alias `@/` apunta a `src/`
- **Components:** PascalCase (`ClientsTable.tsx`)
- **Hooks:** Prefijo `use` (`useClientsQuery`)
- **Event handlers:** Prefijo `handle` (`handleFormSubmit`)
- **CSS:** Variables CSS para colores, tipografia y espaciado
- **Accesibility:** ARIA roles, labels, skip link, reduced motion
