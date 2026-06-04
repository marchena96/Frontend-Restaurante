# Estandares de Codigo - Frontend

## Nomenclatura

- Carpetas de modulos y capas: `kebab-case`.
- Componentes React: `PascalCase.tsx`.
- Hooks personalizados: `camelCase` con prefijo `use`.
- Logica, helpers y tipos: `camelCase.ts`.

## TypeScript

- Evitar `any`; modelar datos con tipos explicitos.
- Los DTOs en `types/` deben mapear los DTOs de .NET.
- Los DTOs de entrada deben tener un schema Zod homonimo cuando participen en formularios o llamadas mutables.
- Mantener `noUnusedLocals` y `noUnusedParameters` en verde.

## UI

- Preferir componentes compartidos en `shared/components`.
- Mantener layouts densos, legibles y orientados a operacion.
- Evitar texto explicativo innecesario dentro de la app; la interfaz debe ser directa.
