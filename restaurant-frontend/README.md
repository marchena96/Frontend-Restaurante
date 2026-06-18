# Restaurante Enterprise — Frontend

Sistema de gestión operativa para restaurante. Panel administrativo SPA para administrar comensales, mesas, reservaciones, lista de espera y turnos.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 |
| Lenguaje | TypeScript 6 |
| Build | Vite 8 |
| Router | TanStack Router 1.x |
| Data fetching | TanStack Query 5.x |
| Formularios | TanStack Form |
| Tablas | TanStack Table |
| Estado global | Zustand 5 |
| HTTP | Axios |
| Validación | Zod 4 |
| Estilos | Tailwind CSS 3 + CSS variables |
| Testing | Vitest + Testing Library |
| Linter | ESLint 10 |

---

## Arquitectura

El proyecto sigue una arquitectura de **Vertical Slices** organizada en 3 capas:

```
src/
├── app/                   # Aplicación: rutas, páginas, query client
│   ├── pages/
│   ├── routes/
│   ├── router.tsx
│   └── queryClient.ts
│
├── features/              # Módulos funcionales (vertical slices)
│   ├── auth/
│   ├── clients/
│   ├── dashboard/
│   ├── infrastructure/
│   ├── reservations/
│   ├── turns/
│   └── waiting-list/
│
├── shared/                # Código compartido
│   ├── api/               # Cliente HTTP con interceptors
│   ├── components/        # UI reutilizable (Button)
│   ├── config/            # Navegación y rutas
│   ├── hooks/             # Hooks compartidos
│   ├── layouts/           # AdminLayout con sidebar
│   ├── types/             # Tipos globales
│   └── utils/             # Toast notifications
│
└── config/
    └── env.ts             # Variables de entorno validadas con Zod
```

Cada feature sigue una estructura interna consistente:

```
features/<modulo>/
├── api/           # Llamadas HTTP
├── hooks/         # TanStack Query (useQuery, useMutation)
├── services/      # Lógica de negocio pura
│   └── __tests__/
├── types/         # DTOs y esquemas Zod
├── store/         # Estado Zustand (opcional)
└── ui/            # Componentes React
```

---

## Módulos

### Auth
Autenticación JWT. Store Zustand persiste el token en `localStorage`. Al iniciar la app valida la sesión contra `GET /auth/me`. Interceptor de Axios inyecta `Bearer` token y redirige a `/login` en 401.

- `POST /auth/login` — iniciar sesión
- `POST /auth/logout` — cerrar sesión
- `GET /auth/me` — validar token

### Dashboard
Panel de indicadores con métricas en tiempo real. Refetch automático cada 30s.

- `GET /dashboard` — métricas, zonas, próximas reservas

### Clients
CRUD de comensales con búsqueda local por nombre, apellido o cédula. Formulario validado con Zod + TanStack Form.

- `GET /clients` — listar
- `POST /clients` — crear
- `GET /clients/:id` — detalle
- `PUT /clients/:id` — actualizar

### Infrastructure
Plano interactivo del salón. Mesas en cuadrícula agrupadas por zona con filtro por zona y código de colores por estado (Libre/Ocupada/Reservada/Bloqueada).

- `GET /tables/layout` — layout completo
- `GET /tables` — listar mesas
- `GET /tables/available` — mesas disponibles
- `POST /tablelocks` — bloquear mesa
- `DELETE /tablelocks/:id` — desbloquear mesa

### Reservations
Ciclo completo de reservas. Wizard de 4 pasos: cliente → mesa → fecha/hora/invitados → confirmación. Máquina de estados: Pendiente → Confirmada → Completada | Cancelada.

- `GET /reservations` — listar
- `POST /reservations` — crear
- `PUT /reservations/:id/status/:statusId` — cambiar estado
- Timeline de reservas activas + tabla de historial

### Waiting List
Cola de espera en vivo para walk-ins. Refetch cada 15s. Algoritmo `findBestTableMatch()` asigna la mesa más pequeña disponible que cumpla capacidad y zona. Resaltado visual para esperas > 20 min.

- `GET /waitinglist` — listar
- `POST /waitinglist` — agregar
- `PATCH /waitinglist/:id/status` — cambiar estado
- `POST /waitinglist/:id/promote/:tableId` — asignar mesa
- `DELETE /waitinglist/:id` — eliminar

### Turns
CRUD de turnos operativos (matutino, vespertino, cena). Tabla con editar/eliminar y modal de formulario.

- `GET /turns` — listar
- `POST /turns` — crear
- `PUT /turns/:id` — actualizar
- `DELETE /turns/:id` — eliminar

---

## Flujo de datos

```
Router → Page → useQuery/useMutation → Feature API → httpClient
                                                        ↓
                                            Interceptor (token JWT)
                                                        ↓
                                            Backend .NET 10 API
                                                        ↓
                                            TanStack Query cache
                                                        ↓
                                            Re-render
```

TanStack Query maneja caché (staleTime 30s), refetch automático en dashboard (30s) y waiting list (15s), e invalidación de queries relacionadas al mutar.

---

## Autenticación

1. Zustand store persiste el JWT en `localStorage`
2. `initialize()` valida el token contra `GET /auth/me` al cargar la app
3. Interceptor de Axios inyecta `Authorization: Bearer <token>`
4. 401 → limpia sesión y redirige a `/login`
5. Rutas `/admin/*` protegidas con `beforeLoad`
6. Raíz `/` redirige a `/admin` o `/login` según autenticación

---

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base URL de la API |
| `VITE_API_TIMEOUT` | `15000` | Timeout en ms |
| `VITE_APP_ENV` | `development` | `development`, `test`, `staging`, `production` |

Proxy de Vite redirige `/api` → `http://localhost:5052` en desarrollo.

---

## Instalación

```bash
pnpm install
pnpm dev        # Desarrollo con HMR
pnpm build      # Compilar para producción
pnpm preview    # Previsualizar build
pnpm test       # Tests unitarios
pnpm lint       # ESLint
```

---

## Testing

Tests unitarios con Vitest sobre la lógica de negocio:

```bash
pnpm test           # Una ejecución
pnpm test:watch     # Modo watch
```

Cobertura actual:
- **queuePrioritizer** — ordenamiento, wait time, best table match, queue summary
- **reservationRules** — validación de estados, transiciones, fecha/hora
