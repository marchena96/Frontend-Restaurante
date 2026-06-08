# Restaurante Enterprise — Frontend

Sistema de gestión de operaciones para restaurante. Panel operativo para administrar comensales, infraestructura del salón, reservaciones y lista de espera.

## Stack

| Capa | Librería |
|---|---|
| Core | React 19 + TypeScript + Vite |
| Enrutamiento | @tanstack/react-router |
| Formularios | @tanstack/react-form |
| Data Fetching | @tanstack/react-query |
| Estado global | Zustand |
| Cliente HTTP | Axios |
| Validación | Zod |
| Estilos | Tailwind CSS (utilidades) + CSS nativo |

## Arquitectura

```
src/
├── app/           # Configuración global, rutas, páginas
├── features/      # Vertical Slices (auth, clients, infrastructure, reservations, waiting-list)
│   ├── api/       # Llamadas HTTP
│   ├── hooks/     # Hooks React (TanStack Query)
│   ├── services/  # Lógica de negocio
│   ├── types/     # DTOs y esquemas Zod
│   └── ui/        # Componentes
├── shared/        # Componentes, layouts, API client, tipos globales
└── config/        # Variables de entorno validadas
```

## Requisitos

- Node.js 20+
- pnpm (recomendado) o npm

## Instalación

```bash
pnpm install
```

## Configuración

Crear archivo `.env.local` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:5052/api
VITE_API_TIMEOUT=15000
VITE_APP_ENV=development
```

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia servidor de desarrollo (Vite HMR) |
| `pnpm build` | Compila TypeScript + build de producción |
| `pnpm preview` | Previsualiza el build de producción |
| `pnpm lint` | Ejecuta ESLint |

## API

El frontend espera una API REST en .NET 10 con los siguientes endpoints:

| Módulo | Endpoints |
|---|---|
| Auth | `/auth/*` |
| Clients | `GET/POST /clients`, `GET /clients/search`, `PUT /clients/:id` |
| Infrastructure | `GET /infrastructure/layout`, `GET/POST /infrastructure/tables/*` |
| Reservations | `GET/POST /reservations`, `PATCH /reservations/:id/status` |
| Waiting List | `GET/POST /waiting-list`, `PATCH /waiting-list/:id/status`, `POST /waiting-list/:id/assign`, `DELETE /waiting-list/:id` |
