# Casos de Uso — Restaurant Enterprise

Descripcion funcional del sistema desde la perspectiva del usuario.

---

## Actores

| Actor | Rol | Permisos |
|---|---|---|
| **Administrador** | Gerente o encargado del restaurante | Acceso total a todos los modulos |
| **Visitante** | Usuario no autenticado | Acceso solo a landing page |
| **Sistema** | Procesos automatizados | Refetch de datos, invalidacion de cache |

> **Nota:** El sistema actual no distingue roles. Todos los usuarios autenticados tienen acceso completo a todas las funcionalidades.

---

## 0. Pagina Publica

### UC-LAND-01: Ver Landing Page

| Campo | Valor |
|---|---|
| **Actor** | Visitante |
| **Precondicion** | Sin sesion activa |
| **Postcondicion** | Landing page mostrada |

**Flujo principal:**
1. El usuario accede a `/`.
2. El sistema muestra la landing page con:
   - Hero con titulo y subtitulo
   - Features del sistema (6 modulos)
   - Call-to-action para login
3. El usuario puede navegar a `/login`.

**Flujos alternativos:**
- **1a.** Si hay sesion activa, el sistema redirige a `/admin`.

---

## 1. Autenticacion

### UC-AUTH-01: Iniciar Sesion

| Campo | Valor |
|---|---|
| **Actor** | Cualquier usuario |
| **Precondicion** | No hay sesion activa |
| **Postcondicion** | Sesion JWT activa, redirigir a `/admin` |

**Flujo principal:**
1. El usuario accede a la aplicacion.
2. El sistema redirige a `/login` (no hay sesion valida).
3. El usuario ingresa credenciales (usuario + contrasena).
4. El sistema valida contra `POST /auth/login`.
5. El sistema almacena el JWT en `localStorage` via Zustand.
6. El sistema redirige al panel de administracion (`/admin`).

**Flujos alternativos:**
- **4a.** Credenciales invalidas: el sistema muestra error "Credenciales invalidas".
- **4b.** Error de red: el sistema muestra error de conexion.

**Flujo de error:**
- Si el token expira (401 en cualquier peticion), el sistema limpia la sesion y redirige a `/login`.

---

### UC-AUTH-02: Cerrar Sesion

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Sesion eliminada, redirigir a `/login` |

**Flujo principal:**
1. El usuario hace click en "Cerrar sesion" en el sidebar.
2. El sistema llama `POST /auth/logout`.
3. El sistema elimina el JWT de `localStorage`.
4. El sistema redirige a `/login`.

---

### UC-AUTH-03: Mantener Sesion

| Campo | Valor |
|---|---|
| **Actor** | Sistema |
| **Precondicion** | JWT valido en `localStorage` |
| **Postcondicion** | Sesion restaurada silenciosamente |

**Flujo principal:**
1. Al cargar la aplicacion, el sistema detecta un JWT en `localStorage`.
2. El sistema valida el token contra `GET /auth/me`.
3. Si es valido: restaura la sesion y muestra el panel.
4. Si es invalido: limpia el token y redirige a `/login`.

---

## 2. Panel de Metricas (Dashboard)

### UC-DASH-01: Consultar Metricas

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Metricas actualizadas mostradas |

**Flujo principal:**
1. El usuario accede al dashboard (`/admin`).
2. El sistema carga las metricas via `GET /dashboard`.
3. El sistema muestra:
   - Porcentaje de ocupacion
   - Numero de reservas activas
   - Personas en lista de espera
   - Resumen por zona (mesas libres/ocupadas)
   - Proximas reservas (proximas 2 horas)
4. El sistema refresca automaticamente cada 30 segundos.

**Reglas de negocio:**
- El porcentaje de ocupacion se calcula sobre el total de mesas del layout.
- Las metricas del sidebar se actualizan cuando hay mutaciones en cualquier modulo.

---

## 3. Gestion de Comensales (Clients)

### UC-CLIENT-01: Listar Comensales

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Lista de comensales mostrada |

**Flujo principal:**
1. El usuario accede a `/admin/clients`.
2. El sistema carga la lista via `GET /clients`.
3. El sistema muestra una tabla con: nombre, telefono, visitas, ultima visita.

---

### UC-CLIENT-02: Registrar Comensal

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Nuevo comensal creado |

**Flujo principal:**
1. El usuario hace click en "Nuevo Comensal".
2. El sistema muestra el formulario de registro.
3. El usuario completa los campos obligatorios:
   - Nombre (string, requerido)
   - Apellido (string, requerido)
   - Telefono (string, formato valido)
   - Cedula (string, formato valido)
4. El sistema valida con Zod (`clientFormSchema`).
5. El usuario envia el formulario.
6. El sistema llama `POST /clients`.
7. El sistema invalida la cache de clientes y dashboard, y muestra exito.

**Flujos alternativos:**
- **4a.** Validacion fallida: el sistema muestra errores inline en cada campo.

---

### UC-CLIENT-03: Buscar Comensal

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Comensal encontrado seleccionado |

**Flujo principal:**
1. El usuario escribe en el campo de busqueda (nombre, apellido o cedula).
2. El sistema filtra la lista localmente en tiempo real.
3. El usuario selecciona un comensal de los resultados.

**Nota:** La busqueda es local (filtra el array en memoria, no llama a la API).

---

## 4. Infraestructura (Mesas y Zonas)

### UC-INFRA-01: Ver Plano del Salon

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Plano interactivo mostrado |

**Flujo principal:**
1. El usuario accede a `/admin/infrastructure`.
2. El sistema carga el layout via `GET /tables/layout`.
3. El sistema renderiza un plano interactivo con:
   - Mesas en cuadricula agrupadas por zona
   - Filtro por zona (pills selector)
   - Colores por estado: Libre (verde), Ocupada (rojo), Reservada (amarillo), Bloqueada (gris)
   - Capacidad de cada mesa mostrada

---

### UC-INFRA-02: Bloquear Mesa

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Mesa en estado "Libre" |
| **Postcondicion** | Mesa bloqueada |

**Flujo principal:**
1. El usuario selecciona una mesa libre.
2. El sistema muestra opcion de "Bloquear".
3. El usuario ingresa un motivo (string).
4. El sistema llama `POST /tablelocks`.
5. El sistema invalida la cache de infraestructura y dashboard.

---

### UC-INFRA-03: Desbloquear Mesa

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Mesa en estado "Bloqueada" |
| **Postcondicion** | Mesa liberada |

**Flujo principal:**
1. El usuario selecciona una mesa bloqueada.
2. El sistema muestra opcion de "Desbloquear".
3. El sistema llama `DELETE /tablelocks/:id`.
4. El sistema invalida la cache de infraestructura y dashboard.

---

### UC-INFRA-04: Ver Mesas Disponibles

| Campo | Valor |
|---|---|
| **Actor** | Administrador (implicito en wizard de reservas) |
| **Precondicion** | Fecha y rango horario seleccionados |
| **Postcondicion** | Lista de mesas disponibles mostrada |

**Flujo principal:**
1. Se proporciona fecha, hora inicio y hora fin.
2. El sistema llama `GET /tables/available?date=&startTime=&endTime=`.
3. El sistema retorna mesas que:
   - Estan libres en todo el rango horario
   - No tienen reservas superpuestas
   - No estan bloqueadas

---

## 5. Reservaciones

### UC-RES-01: Crear Reservacion (Wizard)

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Reservacion creada en estado "Pendiente" |

**Flujo principal (4 pasos):**

**Paso 1 — Seleccionar Cliente:**
1. El usuario busca y selecciona un comensal existente.
2. Si no existe, puede crear uno nuevo inline.

**Paso 2 — Seleccionar Mesa:**
3. El sistema muestra mesas disponibles para la fecha/hora.
4. El usuario selecciona una mesa.

**Paso 3 — Detalles:**
5. El usuario ingresa:
   - Fecha (formato YYYY-MM-DD)
   - Hora (formato HH:mm)
   - Numero de invitados (minimo 1)

**Paso 4 — Confirmacion:**
6. El sistema muestra resumen: cliente, mesa, fecha, hora, invitados.
7. El usuario confirma.
8. El sistema llama `POST /reservations`.
9. El sistema invalida cache de reservas, infraestructura y dashboard.

**Reglas de negocio:**
- La fecha no puede ser en el pasado.
- El numero de invitados no puede exceder la capacidad de la mesa.

---

### UC-RES-02: Cambiar Estado de Reservacion

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Reservacion existente |
| **Postcondicion** | Estado actualizado segun maquina de estados |

**Maquina de estados:**

```
Pendiente ──→ Confirmada ──→ Completada
    │               │
    └──→ Cancelada ←┘
```

**Transiciones validas:**

| Estado actual | Siguientes estados posibles |
|---|---|
| Pendiente | Confirmada, Cancelada |
| Confirmada | Completada, Cancelada |
| Completada | *(ninguno)* |
| Cancelada | *(ninguno)* |

**Flujo principal:**
1. El usuario selecciona una reservacion.
2. El sistema muestra las transiciones disponibles.
3. El usuario selecciona el nuevo estado.
4. El sistema valida la transicion (`canTransitionTo()`).
5. El sistema llama `PUT /reservations/:id/status/:statusId`.
6. El sistema invalida cache de reservas, infraestructura y dashboard.

---

### UC-RES-03: Ver Timeline de Reservaciones

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Timeline mostrado |

**Flujo principal:**
1. El usuario accede a `/admin/reservations`.
2. El sistema muestra timeline de reservas activas (hoy).
3. Cada entrada muestra: cliente, hora, mesa, estado, numero de invitados.

---

### UC-RES-04: Ver Historial de Reservaciones

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Historial mostrado |

**Flujo principal:**
1. El usuario cambia a la vista de historial.
2. El sistema muestra tabla con todas las reservaciones pasadas.
3. Columnas: cliente, fecha, hora, mesa, estado, invitados.

---

## 6. Lista de Espera

### UC-WAIT-01: Agregar a Cola de Espera

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Walk-in sin mesa disponible |
| **Postcondicion** | Entrada creada en la cola |

**Flujo principal:**
1. El usuario hace click en "Agregar a cola".
2. El usuario selecciona un comensal (o crea uno nuevo).
3. El usuario ingresa numero de invitados.
4. El sistema llama `POST /waitinglist`.
5. El sistema invalida la cache de lista de espera y dashboard.
6. La cola se actualiza en vivo (refetch cada 15s).

---

### UC-WAIT-02: Asignar Mesa desde Cola

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Entrada en cola + mesa disponible |
| **Postcondicion** | Mesa asignada, entrada eliminada de la cola |

**Flujo principal:**
1. El usuario selecciona una entrada de la cola.
2. El sistema muestra la mejor mesa disponible (algoritmo `findBestTableMatch()`).
3. El usuario confirma la asignacion.
4. El sistema llama `POST /waitinglist/:id/promote/:tableId`.
5. El sistema invalida cache de lista de espera, infraestructura y dashboard.

**Algoritmo `findBestTableMatch()`:**
- Filtra mesas libres con capacidad >= numero de invitados.
- Prioriza mesas en la misma zona del preference del cliente.
- Selecciona la mesa mas pequena que cumpla (minimiza desperdicio de capacidad).

---

### UC-WAIT-03: Eliminar de Cola

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Entrada en la cola |
| **Postcondicion** | Entrada eliminada |

**Flujo principal:**
1. El usuario selecciona una entrada de la cola.
2. El usuario hace click en "Eliminar".
3. El sistema llama `DELETE /waitinglist/:id`.
4. El sistema invalida la cache de lista de espera y dashboard.

---

### UC-WAIT-04: Monitorear Cola en Vivo

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Cola visible con tiempos actualizados |

**Flujo principal:**
1. El usuario accede a `/admin/waiting-list`.
2. El sistema muestra la cola ordenada por hora de llegada.
3. Cada entrada muestra: cliente, invitados, tiempo de espera, estado.
4. El sistema refresca automaticamente cada 15 segundos.
5. Entradas con espera > 20 minutos se resaltan visualmente.

---

## 7. Turnos de Operacion

### UC-TURN-01: Listar Turnos

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Lista de turnos mostrada |

**Flujo principal:**
1. El usuario accede a `/admin/turns`.
2. El sistema carga la lista via `GET /turns`.
3. El sistema muestra tabla con: nombre del turno, horario, estado.

---

### UC-TURN-02: Crear Turno

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Nuevo turno creado |

**Flujo principal:**
1. El usuario hace click en "Nuevo Turno".
2. El usuario completa el formulario (nombre, horario de inicio/fin).
3. El sistema valida los datos.
4. El sistema llama `POST /turns`.
5. El sistema invalida la cache de turnos y dashboard.

---

### UC-TURN-03: Editar Turno

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Turno existente |
| **Postcondicion** | Turno actualizado |

**Flujo principal:**
1. El usuario selecciona un turno de la tabla.
2. El sistema abre modal de edicion con los datos actuales.
3. El usuario modifica los campos.
4. El sistema llama `PUT /turns/:id`.
5. El sistema invalida la cache de turnos y dashboard.

---

### UC-TURN-04: Eliminar Turno

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Turno existente |
| **Postcondicion** | Turno eliminado |

**Flujo principal:**
1. El usuario selecciona un turno.
2. El usuario hace click en "Eliminar".
3. El sistema muestra confirmacion.
4. El usuario confirma.
5. El sistema llama `DELETE /turns/:id`.
6. El sistema invalida la cache de turnos y dashboard.

---

## 8. Flujos Transversales

### UC-CROSS-01: Invalidacion de Cache

| Campo | Valor |
|---|---|
| **Actor** | Sistema |
| **Precondicion** | Mutacion exitosa |
| **Postcondicion** | Datos relacionados refrescados |

**Reglas de invalidacion:**

| Mutacion | Cache invalidada |
|---|---|
| Crear cliente | `clients`, `dashboard` |
| Crear reservacion | `reservations`, `infrastructure`, `dashboard` |
| Cambiar estado reservacion | `reservations`, `infrastructure`, `dashboard` |
| Bloquear/desbloquear mesa | `infrastructure`, `dashboard` |
| Agregar a cola | `waiting-list`, `dashboard` |
| Asignar mesa desde cola | `waiting-list`, `infrastructure`, `dashboard` |
| Eliminar de cola | `waiting-list`, `dashboard` |
| Crear/editar/eliminar turno | `turns`, `dashboard` |

**Nota:** Todas las mutaciones invalidan `dashboard.all` para mantener las metricas del sidebar sincronizadas.

---

### UC-CROSS-02: Refetch Automatico

| Modulo | Intervalo | Proposito |
|---|---|---|
| Dashboard | 30 segundos | Metricas en tiempo real |
| Waiting List | 15 segundos | Cola en vivo |
| Todos | Al volver a la pestana | `refetchOnWindowFocus: true` |

---

### UC-CROSS-03: Feedback Visual

| Tipo | Componente | Uso |
|---|---|---|
| Exito | Toast notification | Despues de mutacion exitosa |
| Error | Toast notification | Cuando falla una mutacion |
| Error de pagina | Error banner | Cuando falla carga de datos |
| Carga | Skeleton loader | Mientras se cargan datos |

---

## 9. Accesibilidad

### UC-A11Y-01: Navegacion por Teclado

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondicion** | Sesion activa |
| **Postcondicion** | Navegacion completa por teclado |

**Flujo principal:**
1. El usuario presiona Tab para navegar entre elementos interactivos.
2. El skip link aparece al inicio para saltar al contenido principal.
3. Los modales capturan el foco y se cierran con Escape.
4. Los botones icono tienen `aria-label` para screen readers.

---

### UC-A11Y-02: Reduced Motion

| Campo | Valor |
|---|---|
| **Actor** | Sistema |
| **Precondicion** | Usuario con preferencia `prefers-reduced-motion: reduce` |
| **Postcondicion** | Animaciones desactivadas |

**Flujo principal:**
1. El sistema detecta la preferencia del usuario.
2. Todas las animaciones y transiciones se desactivan.

---

## Diagrama de Navegacion

```
/                          ← Landing Page (publica)
    │
    ▼ (click "Iniciar sesion")
/login
    │
    ▼ (autenticacion exitosa)
/admin
    ├── /admin/dashboard        ← Metricas
    ├── /admin/clients          ← Comensales
    ├── /admin/infrastructure   ← Plano del salon
    ├── /admin/reservations     ← Reservaciones
    ├── /admin/waiting-list     ← Lista de espera
    └── /admin/turns            ← Turnos
```

Todas las rutas `/admin/*` estan protegidas. Sin sesion valida, el sistema redirige a `/login`.
