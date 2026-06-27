# AGENTS.md — Restaurant Frontend

## Project Layout

The actual React app lives in a **nested subdirectory**:
```
Restaurante-Frontend/              ← git root
├── restaurant-frontend/           ← Vite project root (run commands here)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── CONVENTIONS.md                 ← naming/style rules (read this)
├── docs/ARCHITECTURE.md           ← full technical reference
└── docs/USE_CASES.md              ← business use cases
```

**All dev commands must run from `restaurant-frontend/`**, not the repo root.

## Commands

From `restaurant-frontend/`:

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server → `localhost:5173` |
| `pnpm build` | `tsc -b && vite build` (typecheck + bundle) |
| `pnpm lint` | ESLint flat config |
| `pnpm test` | `vitest run` (single pass) |
| `pnpm test:watch` | `vitest` (watch mode) |

There is **no explicit typecheck script**. Run `npx tsc --noEmit --project tsconfig.app.json` manually if needed. `pnpm build` also typechecks via `tsc -b`.

**Order:** lint → typecheck → test → build.

## Path Aliases

`@/` maps to `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json`.

```ts
import { httpClient } from '@/shared/api/httpClient'
import { ClientsPage } from '@/features/clients/pages/ClientsPage'
```

TypeScript 6 deprecates `baseUrl` in tsconfig. The `paths` config resolves relative to the tsconfig location by default — no `baseUrl` needed.

## Architecture

**Vertical Slices + TanStack stack.** Each feature is self-contained:

```
features/<module>/
├── index.ts          # barrel export
├── api/              # HTTP calls (axios)
├── hooks/            # TanStack Query hooks (useQuery/useMutation)
├── services/         # pure business logic (unit-testable)
├── types/            # DTOs and interfaces
├── forms/            # form components + Zod schemas
├── components/       # visual components
└── pages/            # view orchestrators (route targets)
```

**7 features:** auth, clients, dashboard, infrastructure, reservations, turns, waiting-list.

**Shared code** (`shared/`): api (httpClient), components (Button), hooks, layouts (AdminLayout), lib (queryKeys), types, utils (cn).

## Routing

**TanStack Router with manual route tree** — NOT file-based. Routes defined in `src/app/router.tsx`.

- `/` → redirects to `/admin` or `/login`
- `/login` → LoginPage
- `/admin/*` → AdminLayout (protected, requires auth)

To add a route: create the page in `features/<module>/pages/`, add a `new Route()` in `router.tsx`, and add the nav entry in `shared/config/navigation.ts`.

## Query Keys

Centralized factory in `src/shared/lib/queryKeys.ts`. **Always use this** — never hardcode queryKey arrays.

```ts
// Correct
queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })

// Wrong
queryClient.invalidateQueries({ queryKey: ['clients'] })
```

## Forms & Validation

- **TanStack Form** for form state management
- **Zod 4** for validation schemas
- Schemas live in `features/<module>/forms/` (e.g., `clientFormSchema.ts`, `reservationSchema.ts`)
- `cn()` utility from `@/shared/utils/cn` for conditional classes (clsx + tailwind-merge)

## Testing

- **Vitest 4** + jsdom + `@testing-library/react`
- Only 2 test files currently: `reservationRules.test.ts` and `queuePrioritizer.test.ts` (both in `services/__tests__/`)
- Tests are co-located with the code they test, using `__tests__/` subdirectories
- Run a single test: `npx vitest run path/to/file.test.ts`

## Environment

- Vite proxy: `/api` → `http://localhost:5052` (development only)
- Env vars validated with Zod in `src/config/env.ts`: `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_APP_ENV`

## Conventions

From `CONVENTIONS.md`:
- Folders/modules: `kebab-case`
- Components: `PascalCase.tsx`
- Hooks: `use` prefix, `camelCase`
- Types: `camelCase.ts`
- DTOs in `types/` must map to .NET backend DTOs
- Input DTOs need Zod schemas when used in forms/mutations
- No `any` — model with explicit types
- UI should be dense, operation-oriented, no explanatory text

## Gotchas

- `@tanstack/react-table` and `clsx` are installed but unused — dead deps
- React 19 with some TanStack packages expecting React 18 → peer dep warnings (not our issue)
- `NotFoundPage.tsx` lives in `app/pages/`, not a feature — it's transversal
- Barrel exports (`index.ts`) exist per feature and shared module — use them for cross-feature imports
- Intra-feature imports use relative paths; cross-feature imports use `@/` aliases
