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
│   │   ├── api/                    # Funciones de API (login, logout, getMe)
│   │   ├── types/                  # Interfaces TypeScript (AuthUser, AuthSession)
│   │   ├── store/                  # Estado global Zustand (authSessionStore)
│   │   ├── hooks/                  # Hooks personalizados (useAuthSession)
│   │   ├── forms/                  # Formularios (LoginForm)
│   │   ├── pages/                  # LoginPage
│   │   └── components/             # Componentes visuales (vacio por ahora)
│   │
│   ├── clients/                    # Gestion de comensales
│   │   ├── api/                    # CRUD de clientes
│   │   ├── types/                  # Interfaces (Client)
│   │   ├── hooks/                  # useClientsQuery, useCreateClientMutation
│   │   ├── services/               # Logica pura (filterClientsByQuery)
│   │   ├── components/             # ClientsTable, ClientSearch
│   │   ├── forms/                  # ClientRegisterForm
│   │   └── pages/                  # ClientsPage
│   │
│   ├── dashboard/                  # Panel de metricas
│   │   ├── api/                    # GET /dashboard
│   │   ├── types/                  # MetricsDto, ZoneSummaryDto
│   │   ├── hooks/                  # useDashboardQuery
│   │   └── pages/                  # DashboardPage
│   │
│   ├── infrastructure/             # Mesas, zonas, plano del local
│   │   ├── api/                    # layout, tables, locks, available
│   │   ├── types/                  # RestaurantTable, TableStatus
│   │   ├── services/               # groupTablesByZone, getTableStatusCounts
│   │   ├── hooks/                  # useLocalLayoutQuery, useLockTableMutation
│   │   ├── components/             # InteractiveFloorPlan, TableCard, ZoneSelector
│   │   └── pages/                  # InfrastructurePage
│   │
│   ├── reservations/               # Reservaciones
│   │   ├── api/                    # CRUD + status update
│   │   ├── types/                  # Zod schemas + ReservationResponse
│   │   ├── services/               # reservationRules (validacion, transiciones)
│   │   ├── hooks/                  # useReservationsQuery, useCreateReservationMutation
│   │   ├── components/             # TimelineView, StatusDropdown, HistoryLog
│   │   ├── forms/                  # ReservationWizard
│   │   └── pages/                  # ReservationsPage
│   │
│   ├── turns/                      # Turnos de operacion
│   │   ├── api/                    # CRUD completo
│   │   ├── types/                  # TurnDto, TurnFormInput
│   │   ├── hooks/                  # useTurnsQuery, mutations
│   │   ├── components/             # TurnList
│   │   ├── forms/                  # TurnFormModal
│   │   └── pages/                  # TurnsPage
│   │
│   └── waiting-list/               # Lista de espera
│       ├── api/                    # get, add, remove, assign
│       ├── types/                  # WaitingListEntry
│       ├── services/               # queuePrioritizer (sort, match, summary)
│       ├── hooks/                  # useWaitingListQuery, mutations
│       ├── components/             # LiveWaitingQueue
│       ├── forms/                  # AddToQueueModal, AssignTableModal
│       └── pages/                  # WaitingListPage
│
├── shared/                         # Codigo agnostico al negocio
│   ├── api/                        # Instancia Axios centralizada (httpClient)
│   ├── components/                 # UI generica (Button, ModulePlaceholder)
│   ├── config/                     # Navegacion, variables de entorno
│   ├── hooks/                      # useSidebarMetrics
│   ├── layouts/                    # AdminLayout (sidebar + main panel)
│   ├── types/                      # EntityId, PaginatedResponse
│   └── utils/                      # cn(), toast()
│
├── config/                         # Validacion de entorno con Zod
│   └── env.ts
│
├── main.tsx                        # Punto de entrada
├── App.tsx                         # Root component (QueryClient + Router + Toast)
├── App.css                         # Estilos globales (963 lineas)
└── index.css                       # TailwindCSS + CSS custom properties
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
```

### Proceso de Commit Manual

```bash
# 1. Verificar estado
git status

# 2. Verificar cambios
git diff --staged

# 3. Verificar que no hay errores
npx tsc --noEmit
npx vite build

# 4. Agregar archivos relacionados
git add archivo1.ts archivo2.ts

# 5. Commitear con mensaje descriptivo
git commit -m "tipo(scope): descripcion"
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

**Directorios eliminados:** Todos los `ui/` y `auth/components/`.

**Imports actualizados:** 12 archivos con rutas rotas corregidas.

### Etapa 3: Migracion de Paginas (Completada)

**Fecha:** 2026-06-26

**Objetivo:** Mover orquestadores de vista desde `app/pages/` hacia `features/<module>/pages/`.

| Pagina | De | A |
|---|---|---|
| `ClientsPage.tsx` | `app/pages/` | `features/clients/pages/` |
| `TurnsPage.tsx` | `app/pages/` | `features/turns/pages/` |
| `InfrastructurePage.tsx` | `app/pages/` | `features/infrastructure/pages/` |
| `ReservationsPage.tsx` | `app/pages/` | `features/reservations/pages/` |
| `WaitingListPage.tsx` | `app/pages/` | `features/waiting-list/pages/` |
| `LoginPage.tsx` | `app/pages/` | `features/auth/pages/` |
| `DashboardPage.tsx` | `app/pages/` | `features/dashboard/pages/` |

**Nota:** `NotFoundPage.tsx` se mantiene en `app/pages/` por ser transversal a todas las features.

**Imports actualizados:**
- 7 archivos de paginas migrados con imports relativos simplificados.
- `router.tsx` actualizado para importar desde las nuevas ubicaciones.

**Verificacion:**
- `tsc --noEmit`: Pasa sin errores.
- `vite build`: Pasa correctamente (5.40s).

### Etapa 4: Schemas Zod Separados (Pendiente)

Extraer schemas de validacion de formularios a archivos independientes en `forms/`.

### Etapa 5: Query Key Factories (Pendiente)

Implementar factories centralizadas para eliminar strings magicos en query keys.

### Etapa 6: Barrel Exports (Pendiente)

Crear `index.ts` por feature y migrar imports a `@/`.

### Etapa 7: Documentacion Final (Pendiente)

Completar guia para nuevos desarrolladores.
