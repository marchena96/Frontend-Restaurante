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

**Shared code** (`shared/`):
- `api/` — httpClient (Axios with JWT interceptors)
- `components/` — Button, Skeleton, SkeletonRow, SkeletonCard
- `hooks/` — useSidebarMetrics
- `layouts/` — AdminLayout (responsive sidebar + main panel)
- `lib/` — queryKeys factory
- `types/` — EntityId, PaginatedResponse
- `utils/` — cn(), notify(), notifyConfirm(), getErrorMessage()

## Routing

**TanStack Router with manual route tree** — NOT file-based. Routes defined in `src/app/router.tsx`.

- `/` → LandingPage (public)
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

## Cache Invalidation

All mutations invalidate `dashboard.all` in addition to their own keys. This ensures sidebar metrics stay in sync.

| Mutation | Keys invalidated |
|---|---|
| Create client | `clients.all` + `dashboard.all` |
| Create reservation | `reservations.all` + `infrastructure.all` + `dashboard.all` |
| Update reservation status | `reservations.all` + `infrastructure.all` + `dashboard.all` |
| Create/update/delete turn | `turns.all` + `dashboard.all` |
| Add to queue | `waitingList.all` + `dashboard.all` |
| Assign table | `waitingList.all` + `infrastructure.all` + `dashboard.all` |
| Remove from queue | `waitingList.all` + `dashboard.all` |
| Lock/unlock table | `infrastructure.all` + `dashboard.all` |

`refetchOnWindowFocus: true` — data refreshes when user returns to tab.

## Forms & Validation

- **TanStack Form** for form state management
- **Zod 4** for validation schemas
- Schemas live in `features/<module>/forms/` (e.g., `clientFormSchema.ts`, `reservationSchema.ts`)
- `cn()` utility from `@/shared/utils/cn` for conditional classes (clsx + tailwind-merge)

## Error Handling

- All mutations use `onSuccess`/`onError` callbacks with toast notifications
- `getErrorMessage()` utility in `shared/utils/errors.ts` extracts messages from Axios errors
- Forms using `mutateAsync` wrap calls in `try/catch` to prevent UI state advances on error
- Error banners on pages use `role="alert"` for screen reader announcement

## Accessibility

- **Modals:** `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + Escape to close
- **Form labels:** Every input has `htmlFor`/`id` pair
- **Error messages:** `role="alert"` for screen reader announcement
- **Skip link:** "Saltar al contenido principal" appears on Tab, links to `#main-content`
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables animations
- **Sidebar:** `aria-label="Navegacion principal"`, `aria-current="page"` on active nav
- **Hamburger:** `aria-label` + `aria-expanded` on mobile toggle

## Skeleton Loaders

Three variants in `shared/components/Skeleton.tsx`:
- `Skeleton` — base shimmer block
- `SkeletonRow` — text row placeholder
- `SkeletonCard` — card placeholder

Used in: DashboardPage, ClientsTable, TimelineView, TurnList, LiveWaitingQueue.

## Testing

- **Vitest 4** + jsdom + `@testing-library/react`
- Only 2 test files currently: `reservationRules.test.ts` and `queuePrioritizer.test.ts` (both in `services/__tests__/`)
- Tests are co-located with the code they test, using `__tests__/` subdirectories
- Run a single test: `npx vitest run path/to/file.test.ts`

## Environment

- Vite proxy: `/api` → `http://localhost:5052` (development only)
- Env vars validated with Zod in `src/config/env.ts`: `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_APP_ENV`

## CSS Variables

Design tokens defined in `src/index.css`:

```css
/* Colors */
--bg, --bg-subtle, --panel, --panel-elevated, --border, --border-subtle
--accent, --accent-strong, --accent-muted, --accent-glow
--text, --text-muted, --text-dim
--error, --error-muted, --warning, --success

/* Typography */
--font-display (Cormorant Garamond), --font-body (DM Sans)
--font-size-xs (11px), --font-size-sm (12px), --font-size-base (13px), --font-size-md (14px), --font-size-lg (20px)

/* Spacing */
--spacing-4 through --spacing-32

/* Borders & Shadows */
--radius-sm/md/lg, --shadow-sm/md/lg, --shadow-accent

/* Transitions */
--transition-fast (150ms), --transition-base (250ms), --transition-slow (400ms)

/* Overlays & Borders */
--overlay, --overlay-light, --accent-border, --accent-glow-strong, --accent-subtle
--error-border, --error-border-light, --warning-bg, --warning-border
```

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
- `AuthUser` type has `{ id, username, role }` — no firstName/lastName fields
