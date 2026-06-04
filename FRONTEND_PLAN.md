# Plan de Desarrollo Frontend - Restaurante Enterprise

Este documento consolida la arquitectura, el stack de librerías, los estándares y el plan de fases para la construcción del frontend del sistema de restaurante, asegurando un tipado estático estricto **End-to-End** y una integración perfecta con la API en .NET 10.

---

## 🏗️ 1. Arquitectura de Software
Se ha elegido una arquitectura híbrida de **Vertical Slices (Rebanadas Verticales) + Layered Architecture (Arquitectura en Capas)** dentro de cada rebanada.

### Beneficios Principales:
1. **Autosuficiencia:** Cada funcionalidad (rebanada) contiene todo su código de interfaz (UI), lógica de negocio (Services) y acceso a datos (API/Hooks).
2. **Escalabilidad:** Añadir nuevas características (ej. Inventario o Facturación) es tan sencillo como agregar una nueva carpeta en `features/` sin alterar el código existente.
3. **Mantenibilidad:** El código del dominio y las reglas de negocio están completamente desacoplados de la UI.

---

## 📦 2. Stack Tecnológico Elegido

* **Core:** React 19 + TypeScript + Vite (Entorno ágil y de ultra-alto rendimiento).
* **Enrutamiento:** `@tanstack/react-router` (Rutas 100% type-safe generadas en compilación).
* **Formularios:** `@tanstack/react-form` (Lógica headless, segura por tipos y sin re-renders).
* **Validación de Datos:** `zod` (Validación en tiempo de ejecución y tipado estático inferido).
* **Estado Global:** `zustand` (Manejo de estado ultra-ligero y reactivo para el cliente/sesión).
* **Data Fetching & Caché:** `@tanstack/react-query` (Sincronización de base de datos automática sin boilerplate).
* **Cliente HTTP:** `axios` (Centralización de interceptores de seguridad JWT).
* **Diseño y Estilado:** `tailwindcss` (Maquetación ágil consistente).
* **Tablas Complejas:** `@tanstack/react-table` (Filtros, ordenamiento y paginación headless).

---

## 📂 3. Estructura de Directorios Detallada

La estructura de carpetas bajo `src/` se organizará de la siguiente forma:

```text
src/
├── app/                              # Configuración global y bootstrap
│   ├── routes/                       # Enrutador centralizado (TanStack Router)
│   │   ├── __root.tsx                # Layout principal e inicializador
│   │   ├── index.tsx                 # Dashboard principal
│   │   ├── clients.tsx               # Gestión de comensales
│   │   ├── infrastructure.tsx        # Plano de zonas y mesas
│   │   ├── reservations.tsx          # Agenda e historial de reservas
│   │   └── waiting-list.tsx          # Cola de espera (Walk-ins)
│   ├── App.tsx                       # Integración de Proveedores (Providers)
│   └── main.tsx                      # Punto de acceso principal de Vite
│
├── features/                         # Rebanadas verticales (Vertical Slices)
│   ├── auth/                         # Sesión, inicio y cierre de sesión
│   │   ├── api/                      # Llamadas a endpoints de autenticación
│   │   ├── hooks/                    # useAuthSession, useLogin mutation
│   │   ├── types/                    # Auth DTOs e interfaces
│   │   └── ui/                       # LoginCard, ProtectedRoute
│   │
│   ├── clients/                      # Gestión de Comensales
│   │   ├── api/                      # ClientController API calls
│   │   ├── hooks/                    # useClientsQuery, useCreateClientMutation
│   │   ├── types/                    # ClientDTOs y esquemas Zod
│   │   └── ui/                       # ClientsTable, ClientRegisterForm
│   │
│   ├── infrastructure/               # Estructura del Local (Zonas, Secciones, Mesas)
│   │   ├── api/                      # Zone, Section, Table, LockTable API calls
│   │   ├── hooks/                    # useLocalLayoutQuery, useLockTableMutation
│   │   ├── services/                 # layoutCalculator.ts (lógica de dibujo del salón)
│   │   ├── types/                    # Estructuras de plano y capacidades
│   │   └── ui/                       # InteractiveFloorPlan, TableCard, ZoneSelector
│   │
│   ├── reservations/                 # Reservaciones y bloques horarios (Turnos)
│   │   ├── api/                      # ReservationController, TurnController API calls
│   │   ├── hooks/                    # useReservations, useAvailableTablesQuery
│   │   ├── services/                 # reservationRules.ts (validación de turnos/bloques)
│   │   ├── types/                    # ReservationDTOs y estados
│   │   └── ui/                       # ReservationWizard, TimelineView, HistoryLog
│   │
│   └── waiting-list/                 # Cola de Espera (Walk-ins)
│       ├── api/                      # WaitingListController API calls
│       ├── hooks/                    # useWaitingListQuery, useAssignTableMutation
│       ├── services/                 # queuePrioritizer.ts (ordenación de cola por tiempo)
│       ├── types/                    # WaitingListDTOs y estados
│       └── ui/                       # LiveWaitingQueue, AddToQueueModal
│
├── shared/                           # Recursos compartidos transversales
│   ├── components/                   # Botones, Inputs, Modales de Tailwind consistentes
│   ├── layouts/                      # MainLayout (Sidebar + Navbar)
│   ├── api/                          # Instancia común de Axios con interceptor JWT
│   ├── utils/                        # Formateadores (moneda, fecha)
│   └── types/                        # Tipos e interfaces de datos globales
│
└── config/                           # Constantes de red y variables de entorno
    └── env.ts                        # Validación estricta de variables .env
```

---

## 📏 4. Estándares de Código (`CONVENTIONS.md`)

Ver archivo adjunto `CONVENTIONS.md` para detalles completos.

---

## 🔗 5. Mapeo de Entidades Clave (.NET 10 ➡️ TS)

### DTO de Reservaciones (`features/reservations/types/reservation.ts`)
```typescript
import { z } from 'zod';

export const reservationSchema = z.object({
  clientId: z.number().positive('Debe seleccionar un cliente'),
  tableId: z.number().positive('Debe seleccionar una mesa'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha requerida (YYYY-MM-DD)'),
  reservationTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora requerida (HH:mm)'),
  guestCount: z.number().min(1, 'Mínimo 1 invitado'),
});

export type ReservationCreateInput = z.infer<typeof reservationSchema>;

export type ReservationStatus = 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada';

export interface ReservationResponse {
  id: number;
  date: string;
  reservationTime: string;
  guestCount: number;
  status: ReservationStatus;
  createdAt: string;
  clientId: number;
  clientName: string;
  tableId: number;
  tableNumber: string;
  zoneName: string;
  turnId: number;
  turnName: string;
}
```

---

## 🔄 6. Interconexión de Módulos (Slices)

1. **Liberación de Mesa 🔄 Cola de Espera:**
   Al cambiar una reserva a estado `Completada`, TanStack Query invalida la caché de mesas de `infrastructure`, notificando dinámicamente al módulo `waiting-list` la disponibilidad para sentar al siguiente cliente en espera.
2. **Reserva 🔄 Comensal Existente:**
   La rebanada de `reservations` utiliza la búsqueda autocomplete expuesta por `clients` para vincular el `ClientId` sin requerir que el operador abandone el asistente de reserva.

---

## 🗓️ 7. Fases de Ejecución

1. **Fase 1: Inicialización y Gobernanza** → Crear el andamiaje del proyecto Vite en `/frontend`, instalar dependencias y crear los archivos `CONVENTIONS.md` y `FRONTEND_PLAN.md`.
2. **Fase 2: Base e Infraestructura de Datos** → Configurar Axios con interceptores JWT, enrutamiento básico en TanStack Router, estado con Zustand y el Layout base (Navbar/Sidebar).
3. **Fase 3: Implementación de Slices** → Construir progresivamente `clients`, `infrastructure` y `reservations` con sus respectivas carpetas internas (`ui`, `api`, `hooks`, `types`, `services`).
4. **Fase 4: Lista de Espera e Integraciones** → Desarrollar el módulo `waiting-list` y acoplar el flujo de asignación automática de mesas.
5. **Fase 5: Verificación, Compilación y QA** → Validar la compilación estricta de TypeScript y documentar instrucciones de levantamiento local.

---

**Estado:** ✅ Fase 1 completada el 4 de Junio de 2026.
