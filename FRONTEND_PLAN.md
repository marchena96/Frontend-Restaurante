# Plan de Desarrollo Frontend - Restaurante Enterprise

Este documento consolida la arquitectura, el stack de librerias, los estandares y las fases para construir el frontend del sistema de restaurante con TypeScript estricto e integracion con la API en .NET 10.

## 1. Arquitectura

La aplicacion usa una arquitectura hibrida de Vertical Slices y capas internas por funcionalidad. Cada slice contiene su UI, hooks, servicios, llamadas API y tipos.

Beneficios:
- Autosuficiencia por modulo.
- Escalabilidad para nuevas areas como inventario o facturacion.
- Reglas de negocio desacopladas de la UI.

## 2. Stack

- React 19 + TypeScript + Vite.
- TanStack Router para rutas type-safe.
- TanStack Form para formularios headless.
- Zod para validacion en runtime y tipos inferidos.
- Zustand para estado de sesion/cliente.
- TanStack Query para sincronizacion de datos.
- Axios para cliente HTTP con interceptores JWT.
- Tailwind CSS como sistema de estilos utilitario.
- TanStack Table para tablas con filtros, ordenamiento y paginacion.

## 3. Estructura

```text
src/
├── app/
│   ├── routes/
│   ├── App.tsx
│   └── main.tsx
├── config/
├── features/
│   ├── auth/
│   ├── clients/
│   ├── infrastructure/
│   ├── reservations/
│   └── waiting-list/
└── shared/
    ├── api/
    ├── components/
    ├── layouts/
    ├── types/
    └── utils/
```

## 4. Fases

1. Inicializacion y gobernanza: proyecto Vite, dependencias, documentos y estructura base. Completada.
2. Base e infraestructura de datos: Axios, rutas, providers, Zustand y layout. Completada.
3. Slices principales: clients, infrastructure y reservations.
4. Lista de espera e integraciones: waiting-list y asignacion de mesas.
5. Verificacion y QA: build estricto, lint e instrucciones de ejecucion local.
