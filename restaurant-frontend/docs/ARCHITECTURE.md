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
│   └── waiting-list/               # Lista de espera
│       ├── index.ts                # Barrel export
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
│   │   └── index.ts
│   ├── components/                 # UI generica (Button)
│   │   └── index.ts
│   ├── config/                     # Navegacion
│   ├── hooks/                      # useSidebarMetrics
│   ├── layouts/                    # AdminLayout (sidebar + main panel)
│   ├── lib/                        # queryKeys factory
│   ├── types/                      # EntityId, PaginatedResponse
│   │   └── index.ts
│   └── utils/                      # cn(), toast()
│       └── index.ts
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

### Etapa 4: Schemas Zod Separados (Completada)

**Fecha:** 2026-06-26

**Objetivo:** Extraer schemas de validacion de formularios a archivos independientes en `forms/`.

| Schema | De | A |
|---|---|---|
| `clientFormSchema` | `clients/forms/ClientRegisterForm.tsx` (inline) | `clients/forms/clientFormSchema.ts` |
| `reservationSchema` | `reservations/types/reservation.ts` | `reservations/forms/reservationSchema.ts` |

**Archivos actualizados (5):**
- `ClientRegisterForm.tsx` - Importa schema desde `./clientFormSchema`
- `ReservationWizard.tsx` - Importa tipo desde `./reservationSchema`
- `reservationApi.ts` - Importa tipo desde `../forms/reservationSchema`
- `reservationRules.ts` - Importa tipo desde `../forms/reservationSchema`
- `reservationRules.test.ts` - Importa tipo desde `../../forms/reservationSchema`

**Nota:** `envSchema` en `config/env.ts` no se mueve (no es schema de formulario).

**Verificacion:**
- `tsc --noEmit`: Pasa sin errores.
- `vite build`: Pasa correctamente (3.54s).
- `vitest run`: 37 tests pasan (20 reservationRules + 17 queuePrioritizer).

### Etapa 5: Query Key Factories (Completada)

**Fecha:** 2026-06-26

**Objetivo:** Eliminar strings magicos en query keys y corregir el bug de cache desalineado en `useSidebarMetrics`.

**Archivo creado:** `src/shared/lib/queryKeys.ts`

**Estructura del factory:**

```typescript
export const queryKeys = {
  clients:     { all, sidebar }
  dashboard:   { all }
  infrastructure: { all, layout, tables: { all, available(date, startTime, endTime) } }
  reservations: { all }
  turns:       { all, sidebar }
  waitingList: { all }
}
```

**Archivos actualizados (18):**

| Tipo | Archivos |
|---|---|
| Queries (8) | `useClientsQuery`, `useTurnsQuery`, `useDashboardQuery`, `useWaitingListQuery`, `useLocalLayoutQuery`, `useAvailableTablesQuery`, `useReservationsQuery`, `useSidebarMetrics` |
| Mutations (10) | `useCreateTurnMutation`, `useUpdateTurnMutation`, `useDeleteTurnMutation`, `useAddToQueueMutation`, `useRemoveFromQueueMutation`, `useAssignTableMutation`, `useCreateClientMutation`, `useLockTableMutation`, `useCreateReservationMutation`, `useUpdateReservationStatusMutation` |

**Bug corregido:** `useSidebarMetrics` usaba keys desalineadas (`['tables', 'layout']`, `['turns', 'sidebar']`, `['clients', 'sidebar']`) que no coincidían con las keys de las features. Ahora comparte el mismo cache y se invalida correctamente cuando hay mutaciones.

**Verificacion:**
- `tsc --noEmit`: Pasa sin errores.
- `vitest run`: 37 tests pasan.
- Grep de `queryKey: [`: 0 resultados (todos los strings magicos eliminados).

### Etapa 6: Barrel Exports y Migracion a @/ (Completada)

**Fecha:** 2026-06-26

**Objetivo:** Crear `index.ts` por feature y migrar todos los imports relativos profundos a alias `@/`.

**Barrels creados (10):**

| Archivo | Contenido |
|---|---|
| `shared/components/index.ts` | Exporta `Button` |
| `shared/utils/index.ts` | Exporta `notify`, `notifyConfirm` |
| `shared/api/index.ts` | Exporta `httpClient` |
| `features/auth/index.ts` | Exports: hooks, types, api, store |
| `features/clients/index.ts` | Exports: hooks, types, api |
| `features/dashboard/index.ts` | Exports: hooks, types, api |
| `features/infrastructure/index.ts` | Exports: hooks, types, api |
| `features/reservations/index.ts` | Exports: hooks, types, api |
| `features/turns/index.ts` | Exports: hooks, types, api |
| `features/waiting-list/index.ts` | Exports: hooks, types, api |

**Imports migrados (42 en 24 archivos):**

- `../../` y `../../../` → `@/shared/...` (22 imports)
- `../../` y `../../../` → `@/features/...` (20 imports)
- 0 imports profundos restantes

**Directorio eliminado:** `infrastructure/forms/` (vacio).

**Verificacion:**
- `tsc --noEmit`: Pasa sin errores.
- `vitest run`: 37 tests pasan.
- Grep `../../`: 0 resultados.

### Etapa 7: Documentacion Final (Completada)

**Fecha:** 2026-06-26

**Documentos creados/actualizados:**

| Archivo | Contenido |
|---|---|
| `README.md` | Reestructurado: quick start, stack actualizado, estructura resumida, links a docs |
| `docs/USE_CASES.md` | 15 casos de uso documentados con actores, flujos, reglas de negocio |

**Contenido de USE_CASES.md:**
- 3 casos de uso de autenticación (login, logout, mantener sesión)
- 1 caso de uso de dashboard
- 3 casos de uso de comensales (listar, registrar, buscar)
- 4 casos de uso de infraestructura (ver plano, bloquear, desbloquear, disponibilidad)
- 4 casos de uso de reservaciones (wizard, cambiar estado, timeline, historial)
- 4 casos de uso de lista de espera (agregar, asignar mesa, eliminar, monitorear)
- 4 casos de uso de turnos (listar, crear, editar, eliminar)
- 2 flujos transversales (invalidación de cache, refetch automático)
- Diagrama de navegación
