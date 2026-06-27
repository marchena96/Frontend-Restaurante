# Arquitectura del Proyecto

Guia tecnica y estructural del Frontend del Restaurante.

---

## 1. Stack Tecnologico

| Capa | Tecnologia | Version |
|---|---|---|
| Build Tool | Vite | 8.x |
| UI Library | React | 19.x |
| Language | TypeScript | 6.x |
| Routing | TanStack Router | 1.x |
| Data Fetching | TanStack Query | 5.x |
| Forms | TanStack Form | 0.35.x |
| Global State | Zustand | 5.x |
| HTTP Client | Axios | 1.x |
| Validation | Zod | 4.x |
| Styling | TailwindCSS | 3.x |
| Utilities | clsx + tailwind-merge | - |
| Icons | lucide-react | 1.x |
| Testing | Vitest | 4.x |
| Linter | ESLint | 10.x |

---

## 2. Estructura de Directorios

```
src/
├── app/                            # Configuracion core de la aplicacion
│   ├── routes/                     # Definiciones de rutas TanStack Router
│   │   └── __root.tsx              # Layout raiz global
│   ├── pages/                      # Solo NotFoundPage (transversal)
│   │   └── NotFoundPage.tsx
│   ├── router.tsx                  # Arbol de rutas centralizado
│   └── queryClient.ts              # Configuracion de TanStack Query
│
├── features/                       # Modulos de negocio (Vertical Slices)
│   ├── auth/                       # Autenticacion
│   │   ├── index.ts                # Barrel export
│   │   ├── api/                    # Funciones de API (login, logout, getMe)
│   │   ├── types/                  # Interfaces TypeScript (AuthUser, AuthSession)
│   │   ├── store/                  # Estado global Zustand (authSessionStore)
│   │   ├── hooks/                  # Hooks personalizados (useAuthSession)
│   │   ├── forms/                  # Formularios (LoginForm)
│   │   └── pages/                  # LoginPage
│   │
│   ├── clients/                    # Gestion de comensales
│   │   ├── index.ts                # Barrel export
│   │   ├── api/                    # CRUD de clientes
│   │   ├── types/                  # Interfaces (Client)
│   │   ├── hooks/                  # useClientsQuery, useCreateClientMutation
│   │   ├── services/               # Logica pura (filterClientsByQuery)
│   │   ├── components/             # ClientsTable, ClientSearch
│   │   ├── forms/                  # ClientRegisterForm, clientFormSchema
│   │   └── pages/                  # ClientsPage
│   │
│   ├── dashboard/                  # Panel de metricas
│   │   ├── index.ts                # Barrel export
│   │   ├── api/                    # GET /dashboard
│   │   ├── types/                  # MetricsDto, ZoneSummaryDto
│   │   ├── hooks/                  # useDashboardQuery
│   │   └── pages/                  # DashboardPage
│   │
│   ├── infrastructure/             # Mesas, zonas, plano del local
│   │   ├── index.ts                # Barrel export
│   │   ├── api/                    # layout, tables, locks, available
│   │   ├── types/                  # RestaurantTable, TableStatus
│   │   ├── services/               # groupTablesByZone, getTableStatusCounts
│   │   ├── hooks/                  # useLocalLayoutQuery, useLockTableMutation
│   │   ├── components/             # InteractiveFloorPlan, TableCard, ZoneSelector
│   │   └── pages/                  # InfrastructurePage
│   │
│   ├── reservations/               # Reservaciones
│   │   ├── index.ts                # Barrel export
│   │   ├── api/                    # CRUD + status update
│   │   ├── types/                  # ReservationResponse, ReservationStatus
│   │   ├── services/               # reservationRules (validacion, transiciones)
│   │   ├── hooks/                  # useReservationsQuery, useCreateReservationMutation
│   │   ├── components/             # TimelineView, StatusDropdown, HistoryLog
│   │   ├── forms/                  # ReservationWizard, reservationSchema
│   │   └── pages/                  # ReservationsPage
│   │
│   ├── turns/                      # Turnos de operacion
│   │   ├── index.ts                # Barrel export
│   │   ├── api/                    # CRUD completo
│   │   ├── types/                  # TurnDto, TurnFormInput
│   │   ├── hooks/                  # useTurnsQuery, mutations
│   │   ├── components/             # TurnList
│   │   ├── forms/                  # TurnFormModal
│   │   └── pages/                  # TurnsPage
│   │
│   ├── waiting-list/               # Lista de espera
│   │   ├── index.ts                # Barrel export
│   │   ├── api/                    # get, add, remove, assign
│   │   ├── types/                  # WaitingListEntry
│   │   ├── services/               # queuePrioritizer (sort, match, summary)
│   │   ├── hooks/                  # useWaitingListQuery, mutations
│   │   ├── components/             # LiveWaitingQueue
│   │   ├── forms/                  # AddToQueueModal, AssignTableModal
│   │   └── pages/                  # WaitingListPage
│   │
│   └── landing/                    # Pagina publica
│       ├── index.ts                # Barrel export
│       └── pages/                  # LandingPage
│
├── shared/                         # Codigo agnostico al negocio
│   ├── api/                        # Instancia Axios centralizada (httpClient)
│   │   └── index.ts
│   ├── components/                 # UI generica (Button, Skeleton*)
│   │   └── index.ts
│   ├── config/                     # Navegacion
│   ├── hooks/                      # useSidebarMetrics
│   ├── layouts/                    # AdminLayout (sidebar responsive + main panel)
│   ├── lib/                        # queryKeys factory
│   ├── types/                      # EntityId, PaginatedResponse
│   │   └── index.ts
│   └── utils/                      # cn(), toast(), errors()
│       └── index.ts
│
├── config/                         # Validacion de entorno con Zod
│   └── env.ts
│
├── main.tsx                        # Punto de entrada
├── App.tsx                         # Root component (QueryClient + Router + Toast)
├── App.css                         # Estilos globales (~1090 lineas)
└── index.css                       # TailwindCSS + CSS custom properties + animations
```

---

## 3. Convenciones de Nomenclatura

### Componentes y Vistas (PascalCase)

Todos los componentes React (.tsx) usan PascalCase.

```
ClientsTable.tsx    -> export function ClientsTable()
ReservationWizard.tsx -> export const ReservationWizard = () => {}
LoginForm.tsx       -> export function LoginForm()
```

### Funciones, Hooks y Logica (camelCase)

Funciones, custom hooks y llamadas a API usan camelCase.

```
fetchClients()           -> funcion de API
useClientsQuery()        -> hook de TanStack Query
useCreateClientMutation() -> hook de TanStack Mutation
filterClientsByQuery()   -> servicio puro
handleFormSubmit()       -> evento con prefijo handle
```

### Prefijos en Eventos

Funciones que manejan eventos de usuario llevan prefijo `handle`.

```
handleFormSubmit
handleInputChange
handleRowClick
handleDelete
```

### Prefijos en Hooks

Custom hooks llevan prefijo `use`.

```
useClientsQuery
useAuthSession
useUserFilters
```

### Estados y Setters

```
const [showForm, setShowForm] = useState(false)
const [editingTurn, setEditingTurn] = useState<TurnDto | undefined>()
```

### Atributos JSX

Siempre usar `className` (no `class`) y `htmlFor` (no `for`).

```tsx
<label htmlFor="email">Email</label>
<div className="container mx-auto">...</div>
```

---

## 4. Estrategia de Commits

### Formato: Conventional Commits

```
<tipo>(<scope>): <descripcion corta>
```

### Tipos

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de bug |
| `refactor` | Reestructuracion sin cambiar comportamiento |
| `chore` | Configuracion de herramientas, dependencias |
| `style` | Cambios de estilo/codigo |
| `test` | Agregar o modificar tests |
| `docs` | Documentacion |

### Scopes del Proyecto

| Scope | Modulo |
|---|---|
| `config` | Vite, TypeScript, configuracion general |
| `auth` | Autenticacion |
| `clients` | Clientes |
| `dashboard` | Panel de metricas |
| `infrastructure` | Mesas, zonas, plano |
| `reservations` | Reservaciones |
| `turns` | Turnos |
| `waiting-list` | Lista de espera |
| `shared` | Codigo compartido |

### Ejemplos

```
chore(config): add @/ path aliases in vite and typescript
chore(shared): add tailwind-merge, lucide-react and cn utility
refactor(clients): migrate ui/ to components/ and forms/
refactor(pages): move page components from app/pages to features
feat(reservations): add reservation wizard with multi-step form
fix(waiting-list): correct queue sorting by arrival time
feat(landing): add public landing page at /
feat(shared): add skeleton loaders for loading states
feat(shared): add toast notifications for mutation feedback
fix(shared): add dashboard cache invalidation to all mutations
feat(shared): add responsive sidebar with mobile drawer
feat(shared): add accessibility (ARIA, labels, skip link)
refactor(shared): extract CSS variables and add prefers-reduced-motion
```

---

## 5. Registro de Cambios (Changelog)

### Etapa 1: Configuracion Base (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| Path aliases `@/` | `vite.config.ts`, `tsconfig.app.json` | Alias `@` apunta a `src/` para imports limpios |
| Dependencias | `package.json` | Instalados `tailwind-merge` y `lucide-react` |
| Utility `cn()` | `src/shared/utils/cn.ts` | Combina clsx + tailwind-merge para clases CSS |

### Etapa 2: Restructuracion de Features (Completada)

**Fecha:** 2026-06-26

**Objetivo:** Separar `ui/` en `components/` (visual) y `forms/` (formularios).

| Feature | Archivos Movidos | De | A |
|---|---|---|---|
| clients | `ClientsTable.tsx`, `ClientSearch.tsx` | `ui/` | `components/` |
| clients | `ClientRegisterForm.tsx` | `ui/` | `forms/` |
| reservations | `TimelineView.tsx`, `StatusDropdown.tsx`, `HistoryLog.tsx` | `ui/` | `components/` |
| reservations | `ReservationWizard.tsx` | `ui/` | `forms/` |
| turns | `TurnList.tsx` | `ui/` | `components/` |
| turns | `TurnFormModal.tsx` | `ui/` | `forms/` |
| infrastructure | `InteractiveFloorPlan.tsx`, `TableCard.tsx`, `ZoneSelector.tsx` | `ui/` | `components/` |
| waiting-list | `LiveWaitingQueue.tsx` | `ui/` | `components/` |
| waiting-list | `AddToQueueModal.tsx`, `AssignTableModal.tsx` | `ui/` | `forms/` |
| auth | `Login.tsx` → `LoginForm.tsx` | `components/` | `forms/` |

### Etapa 3: Migracion de Paginas (Completada)

**Fecha:** 2026-06-26

| Pagina | De | A |
|---|---|---|
| `ClientsPage.tsx` | `app/pages/` | `features/clients/pages/` |
| `TurnsPage.tsx` | `app/pages/` | `features/turns/pages/` |
| `InfrastructurePage.tsx` | `app/pages/` | `features/infrastructure/pages/` |
| `ReservationsPage.tsx` | `app/pages/` | `features/reservations/pages/` |
| `WaitingListPage.tsx` | `app/pages/` | `features/waiting-list/pages/` |
| `LoginPage.tsx` | `app/pages/` | `features/auth/pages/` |
| `DashboardPage.tsx` | `app/pages/` | `features/dashboard/pages/` |

### Etapa 4: Schemas Zod Separados (Completada)

**Fecha:** 2026-06-26

| Schema | De | A |
|---|---|---|
| `clientFormSchema` | `ClientRegisterForm.tsx` (inline) | `clientFormSchema.ts` |
| `reservationSchema` | `types/reservation.ts` | `reservationSchema.ts` |

### Etapa 5: Query Key Factories (Completada)

**Fecha:** 2026-06-26

**Archivo:** `src/shared/lib/queryKeys.ts`

### Etapa 6: Barrel Exports y Migracion a @/ (Completada)

**Fecha:** 2026-06-26

**Barrels creados (10):** Por feature y shared.

### Etapa 7: Landing Page (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| LandingPage | `features/landing/pages/LandingPage.tsx` | Pagina publica con hero, features, CTA |
| Router | `app/router.tsx` | `/` renderiza LandingPage |

### Etapa 8: Palette Migration (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| CSS vars renombradas | `index.css` | `gold*` → `accent*` para paleta generica |
| Hardcoded colors | `App.css` | 13 rgba hardcodeados migrados a variables |
| Components | `AdminLayout`, `DashboardPage`, `LoginForm`, `LandingPage` | Inline styles actualizados |

### Etapa 9: Mutation Feedback (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| Toast notifications | 10 mutation hooks | `onSuccess` + `notify.success()` en todas las mutaciones |
| Error utility | `shared/utils/errors.ts` | `getErrorMessage()` para extraer mensajes de Axios |
| Try/catch | 4 forms | `mutateAsync` envuelto en try/catch |

### Etapa 10: Error States (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| Error banners | `ClientsPage`, `ReservationsPage`, `LiveWaitingQueue` | `isError` + error banner con `role="alert"` |

### Etapa 11: Skeleton Loaders (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| Skeleton components | `shared/components/Skeleton.tsx` | `Skeleton`, `SkeletonRow`, `SkeletonCard` |
| Pages actualizadas | 5 pages | Reemplazado "Cargando..." con skeletons |
| CSS | `App.css` | Shimmer animation + `.skeleton` classes |

### Etapa 12: Sidebar Responsive (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| AdminLayout | `shared/layouts/AdminLayout.tsx` | Drawer con `sidebarOpen`, hamburger toggle, logout |
| CSS | `App.css` | `.sidebar-toggle`, `.sidebar-overlay`, `.sidebar--open`, `.logout-btn` |

### Etapa 13: Cache Invalidation (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| Dashboard keys | 10 mutation hooks | Todas invalidan `dashboard.all` ademas de sus keys |
| refetchOnWindowFocus | `queryClient.ts` | `true` — refresca al volver a la pestana |

### Etapa 14: Accesibilidad (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| Modales | 3 modals | `role="dialog"` + `aria-modal` + `aria-labelledby` + Escape |
| Form labels | 6 forms | `htmlFor`/`id` en todos los inputs |
| Error alerts | 4 forms + LoginForm | `role="alert"` en mensajes de error |
| Skip link | `AdminLayout.tsx` | "Saltar al contenido principal" |
| CSS | `App.css` | `.skip-link` + `.visually-hidden` |

### Etapa 15: CSS Cleanup (Completada)

**Fecha:** 2026-06-26

| Cambio | Archivos | Descripcion |
|---|---|---|
| Font size vars | `index.css` | `--font-size-xs` through `--font-size-lg` |
| Spacing vars | `index.css` | `--spacing-4` through `--spacing-32` |
| Color vars | `index.css` | `--overlay`, `--accent-border`, `--error-border`, etc. |
| Reduced motion | `index.css` | `@media (prefers-reduced-motion: reduce)` |
| Cleanup | `App.css` | 13 rgba hardcodeados extraidos, `.text-gold` removida |
