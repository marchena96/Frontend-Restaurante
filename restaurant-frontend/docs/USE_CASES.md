# Casos de Uso — Restaurant Enterprise

Descripción funcional del sistema desde la perspectiva del usuario.

---

## Actores

| Actor | Rol | Permisos |
|---|---|---|
| **Administrador** | Gerente o encargado del restaurante | Acceso total a todos los módulos |
| **Sistema** | Procesos automatizados | Refetch de datos, invalidación de cache |

> **Nota:** El sistema actual no distingue roles. Todos los usuarios autenticados tienen acceso completo a todas las funcionalidades.

---

## 1. Autenticación

### UC-AUTH-01: Iniciar Sesión

| Campo | Valor |
|---|---|
| **Actor** | Cualquier usuario |
| **Precondición** | No hay sesión activa |
| **Postcondición** | Sesión JWT activa, redirigir a `/admin` |

**Flujo principal:**
1. El usuario accede a la aplicación.
2. El sistema redirige a `/login` (no hay sesión válida).
3. El usuario ingresa credenciales (email + contraseña).
4. El sistema valida contra `POST /auth/login`.
5. El sistema almacena el JWT en `localStorage` via Zustand.
6. El sistema redirige al panel de administración (`/admin`).

**Flujos alternativos:**
- **4a.** Credenciales inválidas: el sistema muestra error "Email o contraseña incorrectos".
- **4b.** Error de red: el sistema muestra error de conexión.

**Flujo de error:**
- Si el token expira (401 en cualquier petición), el sistema limpia la sesión y redirige a `/login`.

---

### UC-AUTH-02: Cerrar Sesión

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Sesión eliminada, redirigir a `/login` |

**Flujo principal:**
1. El usuario hace click en "Cerrar sesión" en el sidebar.
2. El sistema llama `POST /auth/logout`.
3. El sistema elimina el JWT de `localStorage`.
4. El sistema redirige a `/login`.

---

### UC-AUTH-03: Mantener Sesión

| Campo | Valor |
|---|---|
| **Actor** | Sistema |
| **Precondición** | JWT válido en `localStorage` |
| **Postcondición** | Sesión restaurada silenciosamente |

**Flujo principal:**
1. Al cargar la aplicación, el sistema detecta un JWT en `localStorage`.
2. El sistema valida el token contra `GET /auth/me`.
3. Si es válido: restaura la sesión y muestra el panel.
4. Si es inválido: limpia el token y redirige a `/login`.

---

## 2. Panel de Métricas (Dashboard)

### UC-DASH-01: Consultar Métricas

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Métricas actualizadas mostradas |

**Flujo principal:**
1. El usuario accede al dashboard (`/admin`).
2. El sistema carga las métricas via `GET /dashboard`.
3. El sistema muestra:
   - Porcentaje de ocupación
   - Número de reservas activas
   - Personas en lista de espera
   - Resumen por zona (mesas libres/ocupadas)
   - Próximas reservas (próximas 2 horas)
4. El sistema refresca automáticamente cada 30 segundos.

**Reglas de negocio:**
- El porcentaje de ocupación se calcula sobre el total de mesas del layout.
- Las métricas del sidebar se actualizan cuando hay mutaciones en cualquier módulo.

---

## 3. Gestión de Comensales (Clients)

### UC-CLIENT-01: Listar Comensales

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Lista de comensales mostrada |

**Flujo principal:**
1. El usuario accede a `/admin/clients`.
2. El sistema carga la lista via `GET /clients`.
3. El sistema muestra una tabla con: nombre, teléfono, email, visitas, última visita.

---

### UC-CLIENT-02: Registrar Comensal

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Nuevo comensal creado |

**Flujo principal:**
1. El usuario hace click en "Nuevo Comensal".
2. El sistema muestra el formulario de registro.
3. El usuario completa los campos obligatorios:
   - Nombre (string, requerido)
   - Apellido (string, requerido)
   - Teléfono (string, formato válido)
   - Email (string, formato válido)
4. El sistema valida con Zod (`clientFormSchema`).
5. El usuario envía el formulario.
6. El sistema llama `POST /clients`.
7. El sistema invalida la cache de clientes y muestra éxito.

**Flujos alternativos:**
- **4a.** Validación fallida: el sistema muestra errores inline en cada campo.

---

### UC-CLIENT-03: Buscar Comensal

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Comensal encontrado seleccionado |

**Flujo principal:**
1. El usuario escribe en el campo de búsqueda (nombre, apellido o cédula).
2. El sistema filtra la lista localmente en tiempo real.
3. El usuario selecciona un comensal de los resultados.

**Nota:** La búsqueda es local (filtra el array en memoria, no llama a la API).

---

## 4. Infraestructura (Mesas y Zonas)

### UC-INFRA-01: Ver Plano del Salón

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Plano interactivo mostrado |

**Flujo principal:**
1. El usuario accede a `/admin/infrastructure`.
2. El sistema carga el layout via `GET /tables/layout`.
3. El sistema renderiza un plano interactivo con:
   - Mesas en cuadrícula agrupadas por zona
   - Filtro por zona (pills selector)
   - Colores por estado: Libre (verde), Ocupada (rojo), Reservada (amarillo), Bloqueada (gris)
   - Capacidad de cada mesa mostrada

---

### UC-INFRA-02: Bloquear Mesa

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Mesa en estado "Libre" |
| **Postcondición** | Mesa bloqueada |

**Flujo principal:**
1. El usuario selecciona una mesa libre.
2. El sistema muestra opción de "Bloquear".
3. El usuario ingresa un motivo (string).
4. El sistema llama `POST /tablelocks`.
5. El sistema invalida la cache de infraestructura.

**Flujos alternativos:**
- **2a.** La mesa no está libre: la opción de bloquear no aparece.

---

### UC-INFRA-03: Desbloquear Mesa

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Mesa en estado "Bloqueada" |
| **Postcondición** | Mesa liberada |

**Flujo principal:**
1. El usuario selecciona una mesa bloqueada.
2. El sistema muestra opción de "Desbloquear".
3. El sistema llama `DELETE /tablelocks/:id`.
4. El sistema invalida la cache de infraestructura.

---

### UC-INFRA-04: Ver Mesas Disponibles

| Campo | Valor |
|---|---|
| **Actor** | Administrador (implícito en wizard de reservas) |
| **Precondición** | Fecha y rango horario seleccionados |
| **Postcondición** | Lista de mesas disponibles mostrada |

**Flujo principal:**
1. Se proporciona fecha, hora inicio y hora fin.
2. El sistema llama `GET /tables/available?date=&startTime=&endTime=`.
3. El sistema retorna mesas que:
   - Están libres en todo el rango horario
   - No tienen reservas superpuestas
   - No están bloqueadas

---

## 5. Reservaciones

### UC-RES-01: Crear Reservación (Wizard)

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Reservación creada en estado "Pendiente" |

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
   - Número de invitados (mínimo 1)

**Paso 4 — Confirmación:**
6. El sistema muestra resumen: cliente, mesa, fecha, hora, invitados.
7. El usuario confirma.
8. El sistema llama `POST /reservations`.
9. El sistema invalida cache de reservas e infraestructura.

**Reglas de negocio:**
- La fecha no puede ser en el pasado.
- El número de invitados no puede exceder la capacidad de la mesa.
- La hora debe estar dentro del horario del turno activo.

---

### UC-RES-02: Cambiar Estado de Reservación

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Reservación existente |
| **Postcondición** | Estado actualizado según máquina de estados |

**Máquina de estados:**

```
Pendiente ──→ Confirmada ──→ Completada
    │               │
    └──→ Cancelada ←┘
```

**Transiciones válidas:**

| Estado actual | Siguientes estados posibles |
|---|---|
| Pendiente | Confirmada, Cancelada |
| Confirmada | Completada, Cancelada |
| Completada | *(ninguno)* |
| Cancelada | *(ninguno)* |

**Flujo principal:**
1. El usuario selecciona una reservación.
2. El sistema muestra las transiciones disponibles.
3. El usuario selecciona el nuevo estado.
4. El sistema valida la transición (`canTransitionTo()`).
5. El sistema llama `PUT /reservations/:id/status/:statusId`.
6. El sistema invalida cache de reservas.

---

### UC-RES-03: Ver Timeline de Reservaciones

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Timeline mostrado |

**Flujo principal:**
1. El usuario accede a `/admin/reservations`.
2. El sistema muestra timeline de reservas activas (hoy).
3. Cada entrada muestra: cliente, hora, mesa, estado, número de invitados.

---

### UC-RES-04: Ver Historial de Reservaciones

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Historial mostrado |

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
| **Precondición** | Walk-in sin mesa disponible |
| **Postcondición** | Entrada creada en la cola |

**Flujo principal:**
1. El usuario hace click en "Agregar a cola".
2. El usuario selecciona un comensal (o crea uno nuevo).
3. El usuario ingresa número de invitados.
4. El sistema llama `POST /waitinglist`.
5. El sistema invalida la cache de lista de espera.
6. La cola se actualiza en vivo (refetch cada 15s).

---

### UC-WAIT-02: Asignar Mesa desde Cola

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Entrada en cola + mesa disponible |
| **Postcondición** | Mesa asignada, entrada eliminada de la cola |

**Flujo principal:**
1. El usuario selecciona una entrada de la cola.
2. El sistema muestra la mejor mesa disponible (algoritmo `findBestTableMatch()`).
3. El usuario confirma la asignación.
4. El sistema llama `POST /waitinglist/:id/promote/:tableId`.
5. El sistema invalida cache de lista de espera e infraestructura.

**Algoritmo `findBestTableMatch()`:**
- Filtra mesas libres con capacidad >= número de invitados.
- Prioriza mesas en la misma zona del preference del cliente.
- Selecciona la mesa más pequeña que cumpla (minimiza desperdicio de capacidad).

---

### UC-WAIT-03: Eliminar de Cola

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Entrada en la cola |
| **Postcondición** | Entrada eliminada |

**Flujo principal:**
1. El usuario selecciona una entrada de la cola.
2. El usuario hace click en "Eliminar".
3. El sistema llama `DELETE /waitinglist/:id`.
4. El sistema invalida la cache de lista de espera.

---

### UC-WAIT-04: Monitorear Cola en Vivo

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Cola visible con tiempos actualizados |

**Flujo principal:**
1. El usuario accede a `/admin/waiting-list`.
2. El sistema muestra la cola ordenada por hora de llegada.
3. Cada entrada muestra: cliente, invitados, tiempo de espera, estado.
4. El sistema refresca automáticamente cada 15 segundos.
5. Entradas con espera > 20 minutos se resaltan visualmente.

---

## 7. Turnos de Operación

### UC-TURN-01: Listar Turnos

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Lista de turnos mostrada |

**Flujo principal:**
1. El usuario accede a `/admin/turns`.
2. El sistema carga la lista via `GET /turns`.
3. El sistema muestra tabla con: nombre del turno, horario, estado.

---

### UC-TURN-02: Crear Turno

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Sesión activa |
| **Postcondición** | Nuevo turno creado |

**Flujo principal:**
1. El usuario hace click en "Nuevo Turno".
2. El usuario completa el formulario (nombre, horario de inicio/fin).
3. El sistema valida los datos.
4. El sistema llama `POST /turns`.
5. El sistema invalida la cache de turnos.

---

### UC-TURN-03: Editar Turno

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Turno existente |
| **Postcondición** | Turno actualizado |

**Flujo principal:**
1. El usuario selecciona un turno de la tabla.
2. El sistema abre modal de edición con los datos actuales.
3. El usuario modifica los campos.
4. El sistema llama `PUT /turns/:id`.
5. El sistema invalida la cache de turnos.

---

### UC-TURN-04: Eliminar Turno

| Campo | Valor |
|---|---|
| **Actor** | Administrador |
| **Precondición** | Turno existente |
| **Postcondición** | Turno eliminado |

**Flujo principal:**
1. El usuario selecciona un turno.
2. El usuario hace click en "Eliminar".
3. El sistema muestra confirmación.
4. El usuario confirma.
5. El sistema llama `DELETE /turns/:id`.
6. El sistema invalida la cache de turnos.

---

## 8. Fljos Transversales

### UC-CROSS-01: Invalidación de Cache

| Campo | Valor |
|---|---|
| **Actor** | Sistema |
| **Precondición** | Mutación exitosa |
| **Postcondición** | Datos relacionados refrescados |

**Reglas de invalidación:**

| Mutación | Cache invalidada |
|---|---|
| Crear cliente | `clients` |
| Crear reservación | `reservations`, `infrastructure` |
| Cambiar estado reservación | `reservations`, `infrastructure` |
| Bloquear/desbloquear mesa | `infrastructure` |
| Agregar a cola | `waiting-list` |
| Asignar mesa desde cola | `waiting-list`, `infrastructure` |
| Crear/editar/eliminar turno | `turns` |

---

### UC-CROSS-02: Refetch Automático

| Módulo | Intervalo | Propósito |
|---|---|---|
| Dashboard | 30 segundos | Métricas en tiempo real |
| Waiting List | 15 segundos | Cola en vivo |

---

## Diagrama de Navegación

```
/login
    │
    ▼ (autenticación exitosa)
/admin
    ├── /admin/dashboard        ← Métricas
    ├── /admin/clients          ← Comensales
    ├── /admin/infrastructure   ← Plano del salón
    ├── /admin/reservations     ← Reservaciones
    ├── /admin/waiting-list     ← Lista de espera
    └── /admin/turns            ← Turnos
```

Todas las rutas `/admin/*` están protegidas. Sin sesión válida, el sistema redirige a `/login`.
