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
- Usar variables CSS (`--font-size-*`, `--spacing-*`, `--overlay`, etc.) en lugar de valores hardcodeados.
- Respetar `prefers-reduced-motion`: no agregar animaciones que dependan de movimiento.

## Accesibilidad

- Todo `<input>` debe tener un `<label>` con `htmlFor`/`id` correspondiente.
- Modales deben tener `role="dialog"`, `aria-modal="true"` y `aria-labelledby` apuntando al heading.
- Modales deben cerrarse con Escape y al hacer click en el overlay.
- Mensajes de error deben usar `role="alert"` para anuncio por screen reader.
- Botones icono deben tener `aria-label` descriptivo.
- Sidebar debe tener `aria-label` y `aria-current="page"` en el item activo.
- Incluir skip-to-content link en layouts principales.
- Minimo 24x24px para targets interactivos (WCAG 2.5.8).
