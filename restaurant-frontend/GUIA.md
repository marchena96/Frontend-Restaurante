# Guia: AdminLayout — Responsive Sidebar y Accesibilidad

## 1. Estructura Actual

`AdminLayout.tsx` es el layout principal del panel administrativo. Renderiza un sidebar con navegacion y un panel principal con `<Outlet />`.

### Componentes

| Elemento | Descripcion |
|---|---|
| Skip link | "Saltar al contenido principal" — aparece con Tab |
| Sidebar overlay | Fondo oscuro en movil — cierra sidebar al hacer click |
| Sidebar | Navegacion principal con brand, nav items, footer |
| Sidebar toggle | Hamburger button — visible solo en movil (≤960px) |
| Main panel | Contenido de la ruta activa via `<Outlet />` |

### Props del Store

| Store | Campo | Uso |
|---|---|---|
| `authSessionStore` | `user` | `{ id, username, role }` — nombre real del usuario |
| `authSessionStore` | `logout()` | Limpia sesion y redirige a `/login` |

---

## 2. Responsive Behavior

### Desktop (>960px)

- Sidebar fijo a la izquierda (260px)
- Grid layout: `260px minmax(0, 1fr)`
- Hamburger oculto

### Tablet/Movil (≤960px)

- Sidebar como drawer fijo (280px)
- `transform: translateX(-100%)` por defecto
- Hamburger fijo arriba-izquierda
- Click en overlay o nav link cierra el drawer
- `padding-top: 64px` en main panel para compensar hamburger

---

## 3. Accesibilidad

### Skip Link

```tsx
<a href="#main-content" className="skip-link">
  Saltar al contenido principal
</a>
```

- Aparece al presionar Tab al inicio de la pagina
- Oculto por defecto, visible con `:focus`
- Enlaza a `#main-content` en el `<main>`

### Sidebar

```tsx
<aside
  className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}
  aria-label="Navegacion principal"
>
```

- `aria-label` descriptivo para screen readers
- `aria-current="page"` en el nav item activo

### Hamburger

```tsx
<button
  type="button"
  className="sidebar-toggle"
  onClick={() => setSidebarOpen(!sidebarOpen)}
  aria-label={sidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
  aria-expanded={sidebarOpen}
>
```

- `aria-label` dinamico segun estado
- `aria-expanded` para indicar estado del menu

### Logout Button

```tsx
<button
  type="button"
  className="logout-btn"
  onClick={handleLogout}
>
  <svg>...</svg>
  Cerrar sesion
</button>
```

- Icono + texto para claridad
- Hover a rojo para feedback visual

---

## 4. Comportamiento de Cierre

El sidebar se cierra automaticamente cuando:

1. El usuario hace click en un nav link (`onClick={closeSidebar}`)
2. El usuario hace click en el overlay oscuro
3. El usuario presiona Escape (via `useEffect` en modales, no en sidebar)

**Nota:** No se cierra al cambiar de ruta via `useEffect` en `pathname` — esto causaria un lint error (`react-hooks/set-state-in-effect`). En su lugar, se usa `onClick={closeSidebar}` en cada nav link.

---

## 5. User Display

```tsx
const userInitials = user?.username
  ? user.username.slice(0, 2).toUpperCase()
  : '??'
```

- Muestra `username` real del store (no hardcoded)
- Iniciales generadas del username (primeras 2 letras)
- Fallback `??` si no hay usuario

---

## 6. Troubleshooting

### Error: "Avoid calling setState() directly within an effect"

**Causa:** Usar `setSidebarOpen(false)` dentro de `useEffect(() => { ... }, [pathname])`.

**Solucion:** Usar `onClick={closeSidebar}` en los nav links en lugar de `useEffect`.

### Sidebar no aparece en movil

**Verificar:**
1. `sidebar-toggle` tiene `display: flex` en el media query `≤960px`
2. `sidebar--open` clase se agrega al hacer click en hamburger
3. `sidebar-overlay` se renderiza cuando `sidebarOpen` es true

### Logout no funciona

**Verificar:**
1. `authSessionStore.logout()` esta definido en el store
2. `navigate({ to: '/login' })` se ejecuta despues de logout
3. El boton tiene `onClick={handleLogout}`

---

## 7. Archivos Relacionados

| Archivo | Contenido |
|---|---|
| `shared/layouts/AdminLayout.tsx` | Componente principal |
| `shared/config/navigation.ts` | Items de navegacion |
| `shared/hooks/useSidebarMetrics.ts` | Metricas del sidebar |
| `features/auth/store/authSessionStore.ts` | Store de sesion |
| `App.css` | Estilos del sidebar responsive |
