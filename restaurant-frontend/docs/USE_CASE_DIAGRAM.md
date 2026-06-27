# Diagrama de Casos de Use — Sistema de Gestion de Restaurante

## 1. Actores

| Actor | Tipo | Descripcion |
|---|---|---|
| **Visitante** | Principal | Persona no autenticada que accede al landing page y puede iniciar sesion |
| **Usuario Autenticado** | Principal | Personal del restaurante (Admin, Recepcionista, Mesero) que opera el panel administrativo. El frontend no distingue roles — todos ven las mismas funcionalidades |
| **Sistema** | Secundario | Comportamientos automaticos: validacion de token, refetch de datos, invalidacion de cache, notificaciones toast |

---

## 2. Diagrama Visual

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           SISTEMA DE GESTION DE RESTAURANTE                         │
│                                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   LANDING    │  │     AUTH     │  │   DASHBOARD  │  │   CLIENTES   │            │
│  │              │  │              │  │              │  │              │            │
│  │ UC-01 Ver    │  │ UC-04 Ver    │  │ UC-14 Ver    │  │ UC-20 Ver    │            │
│  │    pagina    │  │    login     │  │    metricas  │  │    listado   │            │
│  │ UC-02 Ir a   │  │ UC-05 Login  │  │ UC-15 Ver    │  │ UC-21 Form   │            │
│  │    login     │  │ UC-12 Logout │  │    zonas     │  │    nuevo     │            │
│  │ UC-03 Scroll │  │ UC-07 Restore│  │ UC-16 Ver    │  │ UC-22 Crear  │            │
│  │    features  │  │    sesion    │  │    proximos  │  │    cliente   │            │
│  └──────┬───────┘  └──────┬───────┘  │ UC-17 Navegar│  │ UC-26 Buscar │            │
│         │                 │          │    reservas   │  └──────┬───────┘            │
│         │                 │          │ UC-18 Navegar │         │                    │
│         │                 │          │    espera     │         │                    │
│         │                 │          └──────┬───────┘         │                    │
│         │                 │                 │                  │                    │
│  ┌──────┴─────────────────┴─────────────────┴──────────────────┴───────┐            │
│  │                                                                     │            │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │            │
│  │  │INFRAESTRUCTURA│  │  RESERVAS    │  │ COLA ESPERA  │             │            │
│  │  │              │  │              │  │              │             │            │
│  │  │ UC-27 Ver    │  │ UC-34 Ver    │  │ UC-51 Ver    │             │            │
│  │  │    plano     │  │    agenda    │  │    cola      │             │            │
│  │  │ UC-28 Filtrar│  │ UC-35 Ver    │  │ UC-54 Agregar│             │            │
│  │  │    zona      │  │    historial │  │    grupo     │             │            │
│  │  │ UC-31 Bloquear│  │ UC-37 Crear │  │ UC-57 Asignar│             │            │
│  │  │    mesa      │  │    reserva   │  │    mesa      │             │            │
│  │  │ UC-32 Des-   │  │ UC-44 Cambiar│  │ UC-60 Remover│             │            │
│  │  │    bloquear  │  │    estado    │  │    grupo     │             │            │
│  │  └──────────────┘  │ UC-46 Cancelar│  └──────────────┘             │            │
│  │                    │    reserva   │                                │            │
│  │  ┌──────────────┐  └──────────────┘  ┌──────────────┐             │            │
│  │  │   TURNOS     │                    │  COMPARTIDO  │             │            │
│  │  │              │                    │              │             │            │
│  │  │ UC-63 Ver    │                    │ UC-72 Navegar│             │            │
│  │  │    turnos    │                    │ UC-73 Metricas│            │            │
│  │  │ UC-65 Crear  │                    │    sidebar   │             │            │
│  │  │    turno     │                    │ UC-74 Sidebar│             │            │
│  │  │ UC-67 Editar │                    │    movil     │             │            │
│  │  │    turno     │                    │ UC-77 Toasts │             │            │
│  │  │ UC-68 Eliminar│                   │ UC-80 Auto-  │             │            │
│  │  │    turno     │                    │    refresh   │             │            │
│  │  └──────────────┘                    └──────────────┘             │            │
│  │                                                                     │            │
│  └─────────────────────────────────────────────────────────────────────┘            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

ACTORES:

  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
  │  Visitante  │         │   Usuario   │         │   Sistema   │
  │  (Persona)  │         │ Autenticado │         │  (Automatico)│
  └──────┬──────┘         └──────┬──────┘         └──────┬──────┘
         │                       │                       │
         ├── UC-01 Ver pagina    ├── UC-14 Dashboard     ├── UC-07 Restore sesion
         ├── UC-02 Ir a login    ├── UC-20 Clientes      ├── UC-08 401 handler
         ├── UC-03 Features      ├── UC-27 Plano         ├── UC-09 403 handler
         ├── UC-04 Ver login     ├── UC-34 Reservas      ├── UC-10 5xx handler
         └── UC-05 Login         ├── UC-51 Cola espera   ├── UC-11 Connection error
                                 ├── UC-63 Turnos        ├── UC-13 Route guard
                                 ├── UC-72 Navegar       ├── UC-77 Success toast
                                 ├── UC-74 Sidebar       ├── UC-78 Error toast
                                 └── UC-12 Logout        ├── UC-80 Auto-refresh
                                                         ├── UC-81 Queue refresh
                                                         ├── UC-82 Window focus
                                                         └── UC-83 Cache invalidation
```

---

## 3. Relaciones entre Casos de Uso

### Inclusion (`<<include>>`)

| Caso base | Incluye | Descripcion |
|---|---|---|
| UC-05 Login | UC-07 Restore sesion | Todo login implica restaurar/validar sesion |
| UC-14 Dashboard | UC-80 Auto-refresh | Dashboard siempre refresca cada 30s |
| UC-51 Cola espera | UC-81 Queue refresh | Cola siempre refresca cada 15s |
| UC-37 Crear reserva | UC-38 Seleccionar cliente | Wizard incluye seleccion de cliente |
| UC-37 Crear reserva | UC-39 Seleccionar mesa | Wizard incluye seleccion de mesa |
| UC-37 Crear reserva | UC-40 Datos reserva | Wizard incluye fecha/hora/invitados |
| UC-54 Agregar grupo | UC-26 Buscar cliente | Agregar a cola requiere buscar cliente |
| UC-57 Asignar mesa | UC-27 Ver plano | Asignar mesa muestra plano disponible |

### Extension (`<<extend>>`)

| Caso base | Extiende | Condicion |
|---|---|---|
| UC-05 Login | UC-06 Credenciales invalidas | Si el login falla |
| UC-34 Ver agenda | UC-35 Ver historial | Si el usuario cambia vista |
| UC-37 Crear reserva | UC-42 Navegar atras | Si el usuario retrocede en wizard |
| UC-37 Crear reserva | UC-43 Cerrar wizard | Si el usuario cancela |
| UC-44 Cambiar estado | UC-46 Cancelar reserva | Si el estado destino es "Cancelada" |
| UC-44 Cambiar estado | UC-50 Confirmar cancelacion | Si el usuario confirma la accion |
| UC-54 Agregar grupo | UC-55 Cambiar cliente | Si el usuario cambia seleccion |
| UC-57 Asignar mesa | UC-59 Sin mesas disponibles | Si no hay mesas libres |
| UC-68 Eliminar turno | UC-69 Cancelar eliminacion | Si el usuario cancela |
| UC-65 Crear turno | UC-70 Cerrar modal | Si el usuario cancela |

---

## 4. Especificaciones de Casos de Use

### 4.1 Modulo Landing

#### UC-01: Ver Pagina de Inicio
- **Actor:** Visitante
- **Precondicion:** Usuario no autenticado
- **Flujo principal:**
  1. Navega a `/`
  2. Ve hero section con titulo y descripcion del sistema
  3. Ve 3 tarjetas de features: Gestion Integral, Tiempo Real, Experiencia del Comensal
  4. Ve estadisticas: 24 mesas, 128 comensales, 36 reservas, 99% satisfaccion
  5. Ve seccion CTA con boton "Ir al Panel"
- **Flujos alternativos:**
  - 3a. Click en "Conocer Mas" → scroll suave a features
  - 3b. Click en "Iniciar Sesion" → redirige a `/login`
- **Postcondicion:** Visitante informado sobre el sistema

#### UC-02: Navegar a Login desde Landing
- **Actor:** Visitante
- **Precondicion:** En landing page
- **Flujo principal:**
  1. Click en "Iniciar Sesion" (nav bar) o "Acceder al Panel" (hero) o "Ir al Panel" (CTA)
  2. Redirige a `/login`
- **Postcondicion:** En pagina de login

---

### 4.2 Modulo Autenticacion

#### UC-04: Ver Pagina de Login
- **Actor:** Visitante
- **Precondicion:** No autenticado
- **Flujo principal:**
  1. Navega a `/login`
  2. Ve formulario con campos: Usuario, Contrasena
  3. Ve boton "Iniciar sesion"
  4. Ve errores con `role="alert"` para screen readers
- **Postcondicion:** Formulario listo para usar

#### UC-05: Iniciar Sesion
- **Actor:** Visitante
- **Precondicion:** En `/login`
- **Flujo principal:**
  1. Ingresa usuario y contrasena validos
  2. Click en "Iniciar sesion"
  3. POST `/auth/login` enviado
  4. Token JWT guardado en localStorage
  5. Store Zustand actualizado (user, token, isAuthenticated)
  6. Redirigido a `/admin` (dashboard)
- **Flujos alternativos:**
  - 3a. Credenciales invalidas → toast error "Credenciales invalidas"
  - 3a.1. Se queda en `/login`, puede reintentar
- **Postcondicion:** Sesion iniciada, usuario en dashboard

#### UC-07: Restaurar Sesion (Automatico)
- **Actor:** Sistema
- **Precondicion:** Token en localStorage
- **Flujo principal:**
  1. App carga → `initialize()` ejecutado
  2. Lee token de localStorage
  3. Si token existe → GET `/auth/me`
  4. Si valido → restaura estado del usuario
  5. Si expirado → limpia localStorage, usuario no autenticado
- **Postcondicion:** Sesion restaurada o usuario en login

#### UC-08: Manejar Sesion Expirada (401)
- **Actor:** Sistema
- **Precondicion:** Sesion activa
- **Flujo principal:**
  1. Cualquier API call retorna 401 (excepto `/auth/login`)
  2. Interceptor httpClient detecta 401
  3. Limpia Zustand store + localStorage
  4. Redirige a `/login`
- **Postcondicion:** Sesion terminada, usuario en login

#### UC-12: Cerrar Sesion
- **Actor:** Usuario Autenticado
- **Precondicion:** Sesion activa
- **Flujo principal:**
  1. Click en "Cerrar sesion" (footer del sidebar)
  2. POST `/auth/logout` enviado
  3. Token eliminado de localStorage
  4. Store limpiado
  5. Redirigido a `/login`
- **Postcondicion:** Sesion terminada

---

### 4.3 Modulo Dashboard

#### UC-14: Ver Panel de Metricas
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Navega a `/admin`
  2. Ve 4 tarjetas de metricas:
     - Reservas activas (count + pendientes)
     - Mesas disponibles (count + grandes)
     - Lista de espera (count + tiempo promedio)
     - Ocupacion (porcentaje)
  3. Datos se refrescan cada 30 segundos
- **Flujos alternativos:**
  - 2a. Error de carga → banner "No se pudieron cargar los indicadores"
- **Postcondicion:** Metricas visibles

#### UC-15: Ver Estado de Zonas
- **Actor:** Usuario Autenticado
- **Precondicion:** En dashboard
- **Flujo principal:**
  1. Ve panel "Estado de zonas"
  2. Cada zona muestra: nombre, cantidad mesas, barra de ocupacion
  3. Boton "Ver plano" → enlaza a `/admin/infrastructure`
- **Postcondicion:** Zonas visibles

#### UC-16: Ver Proximos Bloques
- **Actor:** Usuario Autenticado
- **Precondicion:** En dashboard
- **Flujo principal:**
  1. Ve panel "Proximos bloques"
  2. Lista cronologica: hora, nombre cliente, mesa, estado
  3. Boton "Agenda" → enlaza a `/admin/reservations`
- **Postcondicion:** Proximas reservas visibles

---

### 4.4 Modulo Clientes

#### UC-20: Ver Listado de Clientes
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Navega a `/admin/clients`
  2. Ve tabla con columnas: Nombre, Telefono, Cedula
  3. Ve SkeletonRow mientras carga
- **Flujos alternativos:**
  - 2a. Error → banner "No se pudieron cargar los comensales"
- **Postcondicion:** Listado visible

#### UC-22: Registrar Nuevo Cliente
- **Actor:** Usuario Autenticado
- **Precondicion:** En pagina de clientes
- **Flujo principal:**
  1. Click en "Nuevo comensal"
  2. Ve formulario: Nombre, Apellido, Telefono, Cedula
  3. Completa campos validos
  4. Click en "Guardar"
  5. POST `/clients` enviado
  6. Toast exito "Comensal registrado exitosamente"
  7. Lista se actualiza
- **Flujos alternativos:**
  - 4a. Campos invalidos → errores inline (Zod)
  - 4b. Click "Cancelar" → cierra formulario
- **Postcondicion:** Cliente registrado

#### UC-26: Buscar Clientes
- **Actor:** Usuario Autenticado
- **Precondicion:** En flujo de reserva o cola
- **Flujo principal:**
  1. Escribe 2+ caracteres en campo de busqueda
  2. Filtrado client-side por firstName, lastName, idCard
  3. Dropdown muestra resultados: nombre + telefono
  4. Click en resultado → cliente seleccionado
- **Postcondicion:** Cliente encontrado

---

### 4.5 Modulo Infraestructura

#### UC-27: Ver Plano del Salon
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Navega a `/admin/infrastructure`
  2. Ve "Plano del salon" con zonas y mesas
  3. Cada mesa muestra: numero, estado (color), zona, capacidad
  4. Skeleton loaders mientras carga
- **Flujos alternativos:**
  - 2a. Error → banner "Error al cargar el plano"
- **Postcondicion:** Plano visible

#### UC-28: Filtrar Mesas por Zona
- **Actor:** Usuario Autenticado
- **Precondicion:** En plano del salon
- **Flujo principal:**
  1. Click en boton de zona (o "Todas")
  2. Grid de mesas se filtra
  3. Solo mesas de la zona seleccionada visibles
- **Postcondicion:** Mesas filtradas

#### UC-31: Bloquear Mesa
- **Actor:** Usuario Autenticado
- **Precondicion:** En plano del salon
- **Flujo principal:**
  1. Selecciona mesa
  2. POST `/tablelocks` con fecha, hora actual, +2h, razon
  3. Estado mesa cambia a "Bloqueada"
  4. Toast "Mesa bloqueada exitosamente"
  5. Dashboard + infraestructura refrescan
- **Postcondicion:** Mesa bloqueada

#### UC-32: Desbloquear Mesa
- **Actor:** Usuario Autenticado
- **Precondicion:** Mesa bloqueada
- **Flujo principal:**
  1. GET `/tablelocks` para encontrar lock por tableId
  2. DELETE `/tablelocks/:lockId`
  3. Mesa vuelve a estado anterior
  4. Toast "Mesa desbloqueada exitosamente"
- **Postcondicion:** Mesa desbloqueada

---

### 4.6 Modulo Reservas

#### UC-34: Ver Agenda de Reservas
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Navega a `/admin/reservations`
  2. Ve timeline "Proximos bloques"
  3. Cada reserva: hora, cliente, mesa + zona + invitados, estado
  4. Boton "Crear reserva" y "Historial"
- **Postcondicion:** Agenda visible

#### UC-37: Crear Reserva (Wizard 4 Pasos)
- **Actor:** Usuario Autenticado
- **Precondicion:** En pagina de reservas
- **Flujo principal:**
  1. Click "Crear reserva" → wizard abre
  2. **Paso 1:** Buscar y seleccionar cliente
  3. **Paso 2:** Seleccionar mesa del plano
  4. **Paso 3:** Ingresar fecha (YYYY-MM-DD), hora (HH:mm), invitados
  5. Click "Confirmar reserva"
  6. POST `/reservations` enviado
  7. Toast "Reserva creada exitosamente"
  8. **Paso 4:** Pantalla de confirmacion
  9. Click "Nueva reserva" → reinicia wizard
- **Flujos alternativos:**
  - 3a. Click "Volver" → paso anterior
  - 3b. Click "Cerrar" → cierra wizard
  - 5a. Validacion fallida → errores inline
- **Postcondicion:** Reserva creada

#### UC-44: Cambiar Estado de Reserva
- **Actor:** Usuario Autenticado
- **Precondicion:** Reserva visible en agenda
- **Flujo principal:**
  1. Click en badge de estado
  2. Dropdown muestra transiciones validas:
     - Pendiente → Confirmada, Cancelada
     - Confirmada → Completada, Cancelada
     - Completada/Cancelada → (sin transiciones)
  3. Selecciona nuevo estado
  4. Si es "Cancelada" → toast confirmacion
  5. PUT `/reservations/:id/status/:statusId`
  6. Toast "Estado de reserva actualizado"
  7. Caches refrescan
- **Flujos alternativos:**
  - 4a. Click "Cancelar" en toast → no cambia estado
- **Postcondicion:** Estado actualizado

---

### 4.7 Modulo Cola de Espera

#### UC-51: Ver Cola de Espera en Vivo
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Navega a `/admin/waiting-list`
  2. Ve 4 tarjetas metricas: En espera total, pequenos (1-2), medianos (3-4), grandes (5+)
  3. Ve cola en vivo: posicion, nombre, tamano grupo, zona preferida, tiempo espera
  4. Grupos 20+ min resaltados con warning
  5. Se refresca cada 15 segundos
- **Postcondicion:** Cola visible

#### UC-54: Agregar Grupo a Cola
- **Actor:** Usuario Autenticado
- **Precondicion:** En cola de espera
- **Flujo principal:**
  1. Click "Agregar grupo" → modal abre
  2. Busca y selecciona cliente
  3. Ingresa tamano grupo (default: 2, min: 1, max: 20)
  4. Click "Agregar a la cola"
  5. POST `/waitinglist` enviado (fecha actual, ventana +2h)
  6. Toast "Grupo agregado a la cola de espera"
  7. Cola y dashboard refrescan
  8. Modal cierra
- **Flujos alternativos:**
  - 2a. Click "Cambiar" → cambia cliente seleccionado
- **Postcondicion:** Grupo en cola

#### UC-57: Asignar Mesa a Grupo en Espera
- **Actor:** Usuario Autenticado
- **Precondicion:** Grupo en cola
- **Flujo principal:**
  1. Click "Asignar" en entrada de cola
  2. Modal muestra: cliente, tamano, zona
  3. Sistema busca mesas disponibles (auto-refresh)
  4. Muestra "Mejor opcion disponible" (mesa mas pequena que quepa)
  5. Lista completa de mesas libres
  6. Click "Seleccionar esta mesa" + "Asignar mesa"
  7. POST `/waitinglist/:entryId/promote/:tableId`
  8. Toast "Mesa asignada exitosamente"
  9. Cola, infraestructura, dashboard refrescan
- **Flujos alternativos:**
  - 4a. Sin mesas disponibles → "No hay mesas disponibles para X personas"
  - 4b. Seleccion manual de mesa diferente
- **Postcondicion:** Mesa asignada, grupo removido de cola

#### UC-60: Remover Grupo de Cola
- **Actor:** Usuario Autenticado
- **Precondicion:** Grupo en cola
- **Flujo principal:**
  1. Click "X" en entrada de cola
  2. DELETE `/waitinglist/:id`
  3. Toast "Grupo removido de la cola"
  4. Cola y dashboard refrescan
- **Postcondicion:** Grupo removido

---

### 4.8 Modulo Turnos

#### UC-63: Ver Turnos
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Navega a `/admin/turns`
  2. Ve tabla: Nombre, Inicio, Fin, Acciones (Editar/Eliminar)
  3. SkeletonRow mientras carga
- **Postcondicion:** Turnos visibles

#### UC-65: Crear Turno
- **Actor:** Usuario Autenticado
- **Precondicion:** En pagina de turnos
- **Flujo principal:**
  1. Click "Agregar turno" → modal abre
  2. Ve campos: Nombre del turno, Hora inicio, Hora fin
  3. Completa campos
  4. Click "Crear"
  5. POST `/turns`
  6. Toast "Turno creado exitosamente"
  7. Lista y dashboard refrescan
- **Postcondicion:** Turno creado

#### UC-67: Editar Turno
- **Actor:** Usuario Autenticado
- **Precondicion:** Turno existente
- **Flujo principal:**
  1. Click "Editar" en fila
  2. Modal abre con campos pre-cargados
  3. Modifica campos
  4. Click "Actualizar"
  5. PUT `/turns/:id`
  6. Toast "Turno actualizado exitosamente"
- **Postcondicion:** Turno actualizado

#### UC-68: Eliminar Turno
- **Actor:** Usuario Autenticado
- **Precondicion:** Turno existente
- **Flujo principal:**
  1. Click "Eliminar" en fila
  2. Toast confirmacion "Eliminar este turno?"
  3. Click "Confirmar"
  4. DELETE `/turns/:id`
  5. Toast "Turno eliminado exitosamente"
- **Flujos alternativos:**
  - 3a. Click "Cancelar" → no elimina
- **Postcondicion:** Turno eliminado

---

### 4.9 Modulo Compartido

#### UC-72: Navegar entre Modulos
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Click en nav items del sidebar (Dashboard, Comensales, Salon, Reservas, Espera, Turnos)
  2. Pagina correspondiente carga
  3. Nav item activo resaltado con `aria-current="page"`
- **Postcondicion:** Navegacion exitosa

#### UC-73: Ver Metricas del Sidebar
- **Actor:** Usuario Autenticado
- **Precondicion:** Autenticado
- **Flujo principal:**
  1. Ve metricas en badges de nav items:
     - Dashboard: % ocupacion
     - Comensales: cantidad
     - Salon: X mesas
     - Reservas: activas
     - Espera: en cola
     - Turnos: cantidad
  2. Datos vienen de `useSidebarMetrics`
- **Postcondicion:** Metricas visibles

#### UC-74: Alternar Sidebar Movil
- **Actor:** Usuario Autenticado
- **Precondicion:** En dispositivo movil (≤960px)
- **Flujo principal:**
  1. Click en hamburger
  2. Sidebar se abre con overlay oscuro
  3. Click en overlay o nav link → sidebar cierra
  4. `aria-label` + `aria-expanded` en toggle
- **Postcondicion:** Sidebar abierto/cerrado

#### UC-76: Saltar al Contenido (Accesibilidad)
- **Actor:** Usuario de Teclado
- **Precondicion:** En cualquier pagina admin
- **Flujo principal:**
  1. Presiona Tab al inicio
  2. Aparece skip link "Saltar al contenido principal"
  3. Presiona Enter → salta a `#main-content`
- **Postcondicion:** En contenido principal

---

## 5. Matriz de Actores vs Casos de Uso

| Caso de Use | Visitante | Usuario | Sistema |
|---|---|---|---|
| UC-01 Ver landing | ● | | |
| UC-02 Ir a login | ● | | |
| UC-03 Scroll features | ● | | |
| UC-04 Ver login | ● | | |
| UC-05 Login | ● | | |
| UC-06 Credenciales invalidas | ● | | |
| UC-07 Restore sesion | | | ● |
| UC-08 401 handler | | | ● |
| UC-09 403 handler | | | ● |
| UC-10 5xx handler | | | ● |
| UC-11 Connection error | | | ● |
| UC-12 Logout | | ● | |
| UC-13 Route guard | | | ● |
| UC-14 Dashboard | | ● | |
| UC-15 Zonas | | ● | |
| UC-16 Proximos bloques | | ● | |
| UC-17 Navegar reservas | | ● | |
| UC-18 Navegar espera | | ● | |
| UC-19 Dashboard error | | | ● |
| UC-20 Ver clientes | | ● | |
| UC-21 Form nuevo | | ● | |
| UC-22 Crear cliente | | ● | |
| UC-23 Validacion errores | | ● | |
| UC-24 Cancelar cliente | | ● | |
| UC-25 Clientes error | | | ● |
| UC-26 Buscar cliente | | ● | |
| UC-27 Ver plano | | ● | |
| UC-28 Filtrar zona | | ● | |
| UC-29 Ver estado mesas | | ● | |
| UC-30 Seleccionar mesa | | ● | |
| UC-31 Bloquear mesa | | ● | |
| UC-32 Desbloquear mesa | | ● | |
| UC-33 Plano error | | | ● |
| UC-34 Ver agenda | | ● | |
| UC-35 Ver historial | | ● | |
| UC-36 Volver agenda | | ● | |
| UC-37 Crear reserva | | ● | |
| UC-38 Seleccionar cliente | | ● | |
| UC-39 Seleccionar mesa | | ● | |
| UC-40 Datos reserva | | ● | |
| UC-41 Confirmacion | | ● | |
| UC-42 Navegar atras | | ● | |
| UC-43 Cerrar wizard | | ● | |
| UC-44 Cambiar estado | | ● | |
| UC-45 Completar reserva | | ● | |
| UC-46 Cancelar reserva | | ● | |
| UC-47 Cancelar confirmada | | ● | |
| UC-48 Reserva terminal | | ● | |
| UC-49 Reservas error | | | ● |
| UC-50 Confirmar cancelacion | | ● | |
| UC-51 Ver cola | | ● | |
| UC-52 Urgencia espera | | ● | |
| UC-53 Modal agregar | | ● | |
| UC-54 Agregar grupo | | ● | |
| UC-55 Cambiar cliente | | ● | |
| UC-56 Modal asignar mesa | | ● | |
| UC-57 Asignar mesa auto | | ● | |
| UC-58 Asignar mesa manual | | ● | |
| UC-59 Sin mesas | | ● | |
| UC-60 Remover grupo | | ● | |
| UC-61 Historial asignaciones | | ● | |
| UC-62 Cola error | | | ● |
| UC-63 Ver turnos | | ● | |
| UC-64 Modal nuevo turno | | ● | |
| UC-65 Crear turno | | ● | |
| UC-66 Modal editar turno | | ● | |
| UC-67 Editar turno | | ● | |
| UC-68 Eliminar turno | | ● | |
| UC-69 Cancelar eliminacion | | ● | |
| UC-70 Cerrar modal | | ● | |
| UC-71 Turnos error | | | ● |
| UC-72 Navegar modulos | | ● | |
| UC-73 Metricas sidebar | | ● | |
| UC-74 Sidebar movil | | ● | |
| UC-75 Info usuario | | ● | |
| UC-76 Skip to content | | ● | |
| UC-77 Success toast | | | ● |
| UC-78 Error toast | | | ● |
| UC-79 Confirmar accion | | ● | |
| UC-80 Auto-refresh dashboard | | | ● |
| UC-81 Auto-refresh cola | | | ● |
| UC-82 Window focus refresh | | | ● |
| UC-83 Cache invalidation | | | ● |

---

## 6. Resumen Estadistico

| Metrica | Valor |
|---|---|
| Total casos de uso | 83 |
| Visitante (no auth) | 6 |
| Usuario autenticado | 54 |
| Sistema (automatico) | 23 |
| Modulos | 9 |
| Endpoints API | 28 |
| Mutaciones | 10 |
| Queries | 7 |
| Modales/Formularios | 5 |
| Paginas | 7 |
| Auto-refresh intervals | 2 (30s dashboard, 15s cola) |
