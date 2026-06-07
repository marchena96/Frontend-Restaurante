## Descripción

Implementación completa de la **Fase 3 — Vertical Slices** para los módulos `clients`, `infrastructure` y `reservations`. Cada slice ahora cuenta con su arquitectura interna completa (`api/`, `hooks/`, `ui/`, `services/`, `types/`) siguiendo el patrón de rebanadas verticales.

## Cambios por módulo

### `features/clients/`
- **`api/clientApi.ts`** — Endpoints CRUD + búsqueda de clientes via `httpClient`
- **`hooks/`** — `useClientsQuery`, `useCreateClientMutation`, `useClientSearchQuery` (con TanStack Query)
- **`ui/ClientsTable.tsx`** — Tabla con nombre, teléfono, email, visitas, última visita
- **`ui/ClientRegisterForm.tsx`** — Formulario con `@tanstack/react-form` + validación Zod
- **`ui/ClientSearch.tsx`** — Autocomplete para búsqueda de comensales
- **`services/clientService.ts`** — Helpers de formato y filtrado
- **`pages/ClientsPage.tsx`** — Conecta hooks y componentes, alterna entre listado/formulario

### `features/infrastructure/`
- **`api/infrastructureApi.ts`** — Endpoints de layout, mesas, bloqueo, disponibilidad
- **`hooks/`** — `useLocalLayoutQuery`, `useLockTableMutation`, `useAvailableTablesQuery`
- **`ui/InteractiveFloorPlan.tsx`** — Plano del salón con agrupación por zonas
- **`ui/TableCard.tsx`** — Tarjeta individual de mesa con estado coloreado
- **`ui/ZoneSelector.tsx`** — Filtro de zonas tipo pills
- **`services/layoutCalculator.ts`** — Agrupación y conteo de mesas por zona/estado
- **`pages/InfrastructurePage.tsx`** — Renderiza el plano interactivo

### `features/reservations/`
- **`api/reservationApi.ts`** — Endpoints CRUD + cambio de estado + filtro por fecha
- **`hooks/`** — `useReservationsQuery`, `useCreateReservationMutation`, `useUpdateReservationStatusMutation`
- **`ui/ReservationWizard.tsx`** — Asistente multi-paso (4 pasos): cliente → mesa → detalles → confirmación
- **`ui/TimelineView.tsx`** — Timeline de reservas próximas
- **`ui/HistoryLog.tsx`** — Historial completo en tabla
- **`services/reservationRules.ts`** — Validación de entrada, máquina de estados, defaults de fecha/hora
- **`pages/ReservationsPage.tsx`** — Alterna entre wizard, timeline e historial

## Verificación

- ✅ Compilación TypeScript estricta sin errores (`tsc -b`)
- ✅ Build de producción exitoso (`vite build`)
- ✅ 0 errores de lint
