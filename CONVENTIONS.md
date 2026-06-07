# Estándares de Código - Frontend Restaurante Enterprise

Este documento establece las convenciones y estándares de desarrollo para garantizar consistencia, legibilidad y mantenibilidad en todo el codebase del frontend.

---

## 📝 Nomenclatura

### Carpetas y Directorios
- **Módulos y capas:** `kebab-case` (ej: `waiting-list`, `shared-components`, `api-client`)
- **Rutas en TanStack Router:** `kebab-case` con extensión `.tsx` (ej: `reservations.tsx`, `client-detail.tsx`)

### Componentes React
- **Nombre:** `PascalCase` con extensión `.tsx` (ej: `ReservationForm.tsx`, `TableCard.tsx`)
- **Ubicación:** Dentro de carpeta `ui/` de la feature correspondiente
- **Exportación:** Named export `export const ComponentName` (no default export)

### Hooks Personalizados
- **Nombre:** `camelCase` con prefijo `use`, extensión `.ts` (ej: `useReservations.ts`, `useTableLock.ts`)
- **Ubicación:** Dentro de carpeta `hooks/` de la feature
- **Tipo de retorno:** Siempre tipado, no `any`

### Funciones y Utilidades
- **Nombre:** `camelCase` con extensión `.ts` (ej: `dateFormatter.ts`, `calculateTableCapacity.ts`)
- **Ubicación:** En `services/` o `utils/`

### Tipos e Interfaces
- **Nombre:** `PascalCase`, extensión `.ts` (ej: `Reservation.ts`, `ClientDTO.ts`)
- **Ubicación:** Dentro de carpeta `types/` de la feature
- **Exportación:** `export type` o `export interface`

### Variables y Constantes
- **Constantes globales:** `UPPER_SNAKE_CASE` (ej: `const API_BASE_URL = '...'`)
- **Variables locales:** `camelCase` (ej: `const totalGuests = 5`)

---

## 🎯 Reglas de TypeScript

### Tipado Estricto - NO EXCEPTIONS
1. **Prohibido `any`** — Todo valor debe tener un tipo explícito y verificable.
2. **Prohibido `as`** — Si necesitas type assertion, refactoriza la lógica. Es síntoma de tipado deficiente.
3. **Prohibido `!` (non-null assertion)** — Usa optional chaining (`?.`) y nullish coalescing (`??`).

### DTOs y Mapeo
- Las interfaces en `types/` deben mapear de forma **idéntica** los DTOs de C# .NET 10.
- Usa `z.object()` de Zod para definir esquemas que validarán datos en tiempo de ejecución.
- Ejemplo:
  ```typescript
  // C# DTO
  public class ReservationDTO {
    public int ClientId { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; }
  }

  // TypeScript (types/reservationDTO.ts)
  export interface ReservationDTO {
    clientId: number;
    date: string; // ISO 8601
    status: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada';
  }

  // Zod Schema (types/reservationSchema.ts)
  export const reservationSchema = z.object({
    clientId: z.number().positive(),
    date: z.string().datetime(),
    status: z.enum(['Pendiente', 'Confirmada', 'Cancelada', 'Completada']),
  });
  ```

### Importaciones
- **Absolute imports:** Configura `tsconfig.json` con paths (ej: `@/features/clients`)
- **No deep imports:** Evita `import x from '../../features/clients/api/someFile'`; crea índices (`index.ts`) que exporten la interfaz pública
- **Agrupar importaciones:**
  1. Librerías externas (`react`, `zod`, etc.)
  2. Proyectos internos (`@/features`, `@/shared`, etc.)
  3. Estilos (`.css`, `.module.css`)

---

## ⚛️ Componentes React

### Estructura Base
```typescript
// src/features/clients/ui/ClientsTable.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClientDTO } from '../types/clientDTO';
import { fetchClients } from '../api/clientsAPI';

interface ClientsTableProps {
  onRowClick?: (client: ClientDTO) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ onRowClick }) => {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
  });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Email</th>
        </tr>
      </thead>
      <tbody>
        {clients?.map((client) => (
          <tr key={client.id} onClick={() => onRowClick?.(client)}>
            <td className="px-4 py-2">{client.name}</td>
            <td className="px-4 py-2">{client.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### Props Tipadas
- Siempre define una interfaz `ComponentNameProps`
- Usa `React.FC<Props>` cuando sea necesario
- Desestructura props en el parámetro o en el cuerpo

### Callbacks
- Tipo: `(arg: Type) => ReturnType` explícitamente
- Ejemplo: `onRowClick?: (client: ClientDTO) => void`

---

## 🪝 Hooks Personalizados

### Estructura Base
```typescript
// src/features/reservations/hooks/useReservations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReservationDTO } from '../types/reservationDTO';
import { createReservation, fetchReservations } from '../api/reservationsAPI';

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReservationDTO) => createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};
```

### Reglas
- Siempre retorna objetos tipados
- Encapsula lógica de React Query/estado
- No mezcles lógica de negocio con hooks; extrae a `services/`

---

## 📡 API y Axios

### Configuración Centralizada (`src/shared/api/axiosClient.ts`)
```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Interceptor para JWT
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para errores 401/403
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión y redirigir a login
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

### Llamadas API por Feature
```typescript
// src/features/clients/api/clientsAPI.ts
import axiosClient from '@/shared/api/axiosClient';
import { ClientDTO } from '../types/clientDTO';

export const fetchClients = async (): Promise<ClientDTO[]> => {
  const response = await axiosClient.get<ClientDTO[]>('/api/clients');
  return response.data;
};

export const createClient = async (data: Omit<ClientDTO, 'id'>): Promise<ClientDTO> => {
  const response = await axiosClient.post<ClientDTO>('/api/clients', data);
  return response.data;
};
```

---

## 🗂️ Estructura de Features (Vertical Slices)

Cada feature (ej: `clients`, `reservations`) debe incluir:

```
src/features/{feature}/
├── api/                    # Llamadas HTTP (exportar funciones tipadas)
│   └── {feature}API.ts
├── hooks/                  # Hooks React personalizados (useQuery, useMutation)
│   ├── useList.ts
│   ├── useCreate.ts
│   └── index.ts            # Re-exportar públicamente
├── types/                  # Tipos, interfaces, esquemas Zod
│   ├── {feature}DTO.ts
│   ├── {feature}Schema.ts
│   └── index.ts
├── services/               # Lógica de negocio (opcional)
│   └── {feature}Calculator.ts
├── ui/                     # Componentes React
│   ├── {Feature}Form.tsx
│   ├── {Feature}List.tsx
│   ├── {Feature}Detail.tsx
│   └── index.ts            # Re-exportar públicamente
├── store/                  # Estado local con Zustand (si aplica)
│   └── {feature}Store.ts
└── index.ts                # Barril: exportar interfaz pública de la feature
```

### Archivo Índice (`src/features/{feature}/index.ts`)
```typescript
// Exportar solo la interfaz pública
export * from './types';
export * from './hooks';
export * from './ui';
```

---

## 🎨 Estilos y Tailwind CSS

- **Clases Tailwind:** Prefiere `className` a `style` prop
- **Componentes reutilizables:** Crea componentes base en `src/shared/components/` (Button, Input, Modal)
- **Extensiones de Tailwind:** Definiré en `tailwind.config.ts` (colores de marca, espaciados)
- **Archivos CSS módulo:** Solo si se necesita lógica compleja; prefiere Tailwind

---

## 🧪 Testing (Fase posterior)

- **Unit Tests:** Vitest + React Testing Library
- **Naming:** `{component|hook|function}.test.ts` colocados al lado del archivo original
- **Cobertura mínima:** 80%

---

## 🚀 Build y Entorno

### Variables de Entorno (`.env`, `.env.local`)
```
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
VITE_APP_ENV=development
```

### Validación (`src/config/env.ts`)
```typescript
import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_TIMEOUT: z.string().transform(Number),
  VITE_APP_ENV: z.enum(['development', 'production']),
});

export const env = envSchema.parse(import.meta.env);
```

---

## ✅ Checklist pre-commit

Antes de hacer commit:
- [ ] `pnpm run type-check` pasa (sin errores TS)
- [ ] `pnpm run lint` pasa (sin warnings de ESLint)
- [ ] No hay `console.log()` en producción
- [ ] Los tipos están tipados (sin `any`)
- [ ] Las variables de entorno están documentadas

---

**Última actualización:** 4 de Junio de 2026
