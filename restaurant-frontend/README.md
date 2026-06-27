# Restaurant Enterprise — Frontend

Sistema de gestión operativa para restaurante. Panel administrativo SPA para administrar comensales, mesas, reservaciones, lista de espera y turnos.

---

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React | 19.x |
| Lenguaje | TypeScript | 6.x |
| Build | Vite | 8.x |
| Router | TanStack Router | 1.x |
| Data fetching | TanStack Query | 5.x |
| Formularios | TanStack Form | 0.35.x |
| Estado global | Zustand | 5.x |
| HTTP | Axios | 1.x |
| Validación | Zod | 4.x |
| Estilos | Tailwind CSS | 3.x |
| Testing | Vitest | 4.x |
| Linter | ESLint | 10.x |

---

## Quick Start

```bash
# Instalación
pnpm install

# Desarrollo
pnpm dev        # http://localhost:5173

# Build
pnpm build      # Compilar para producción
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
├── app/                    # Configuración core (rutas, query client)
├── features/               # Módulos de negocio (Vertical Slices)
│   ├── auth/               # Autenticación JWT
│   ├── clients/            # Gestión de comensales
│   ├── dashboard/          # Panel de métricas
│   ├── infrastructure/     # Mesas, zonas, plano del local
│   ├── reservations/       # Reservaciones
│   ├── turns/              # Turnos de operación
│   └── waiting-list/       # Lista de espera
├── shared/                 # Código agnóstico al negocio
│   ├── api/                # Cliente HTTP con interceptors
│   ├── components/         # UI reutilizable (Button)
│   ├── hooks/              # Hooks compartidos
│   ├── layouts/            # AdminLayout con sidebar
│   ├── lib/                # Query key factories
│   ├── types/              # Tipos globales (EntityId, etc.)
│   └── utils/              # cn(), toast()
└── config/                 # Variables de entorno (Zod)
```

Cada feature sigue la estructura interna:

```
features/<modulo>/
├── index.ts          # Barrel export
├── api/              # Llamadas HTTP
├── hooks/            # TanStack Query (useQuery, useMutation)
├── services/         # Lógica de negocio pura
├── types/            # DTOs e interfaces
├── forms/            # Componentes de formulario
├── components/       # Componentes visuales
└── pages/            # Orquestadores de vista
```

---

## Módulos

| Módulo | Descripción | Endpoint principal |
|---|---|---|
| **Auth** | Login/logout JWT, sesión persistente | `POST /auth/login` |
| **Dashboard** | Métricas en tiempo real (refetch 30s) | `GET /dashboard` |
| **Clients** | CRUD de comensales con búsqueda | `GET /clients` |
| **Infrastructure** | Plano interactivo del salón | `GET /tables/layout` |
| **Reservations** | Wizard de 4 pasos + timeline | `GET /reservations` |
| **Waiting List** | Cola en vivo (refetch 15s) | `GET /waitinglist` |
| **Turns** | CRUD de turnos operativos | `GET /turns` |

---

## Variables de Entorno

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base URL de la API |
| `VITE_API_TIMEOUT` | `15000` | Timeout en ms |
| `VITE_APP_ENV` | `development` | `development`, `test`, `staging`, `production` |

Proxy de Vite redirige `/api` → `http://localhost:5052` en desarrollo.

---

## Documentación

| Documento | Descripción |
|---|---|
| [Casos de Uso](docs/USE_CASES.md) | Flujos de usuario, actores, reglas de negocio |
| [Arquitectura](docs/ARCHITECTURE.md) | Estructura técnica, convenciones, changelog |
| [Guía AdminLayout](GUIA.md) | Troubleshooting del layout de rutas |
| [Commit Cheatsheet](CHEATSHEET.md) | Convenciones de commits |

---

## Convenciones

- **Commits:** Conventional Commits (`feat(scope): description`)
- **Branches:** `main` → `develop` → `feat/xxx`, `fix/xxx`
- **Imports:** Alias `@/` apunta a `src/`
- **Components:** PascalCase (`ClientsTable.tsx`)
- **Hooks:** Prefijo `use` (`useClientsQuery`)
- **Event handlers:** Prefijo `handle` (`handleFormSubmit`)
