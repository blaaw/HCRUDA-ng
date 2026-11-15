# HCRUDA-ng — PAGINAS_COMPONENTES.md (Páginas y componentes de la aplicación)

> Define cada página y componente de HCRUDA-ng con su estado real, responsabilidades, campos, filtros y operaciones.
> **Leer junto con `docs/REQUISITOS.md`, `docs/ESTADO_ACTUAL.md` y `docs/MODELO_DATOS.md`.**
>
> Estado: 16 de noviembre de 2026 · commit `fa8276e`.

---

## 1. Página Login (`/login`) — ✅ IMPLEMENTADA

**Responsabilidad:** Página de entrada única de la aplicación.

- Formulario de acceso con **código de usuario** y contraseña.
- Validación de campos vacíos antes de enviar.
- Autentica contra `/json/usuarios.json` mediante `ServicioUsuarios.verificarCredenciales()`.
- Al autenticar, guarda `{ codigo, nombre, rol }` en `sessionStorage` y redirige al dashboard con `setTimeout` (500 ms).
- Si ya hay sesión, redirige directamente al dashboard desde `ngOnInit`.
- Mensajes de error mostrados en pantalla directamente (sin SnackBar).
- Mapea `id`→`codigo` y `password`→`contrasena`.

**Pendiente:**
- Validación con expresiones regulares.
- Enlace a `/registro` funcional: la ruta no existe y `login.ts` no importa `RouterLink`, por lo que el `routerLink` actual es inerte.

**Nombres en español (TS):** `codigoUsuario`, `contrasenaUsuario`, `estaCargando`, `mensajeError`, `iniciarSesion()`, `servicioUsuarios`.

---

## 2. Página Registro (`/registro`) — ❌ PENDIENTE

**Responsabilidad:** Alta de nuevo usuario (médico o enfermero).

- Campos previstos: nombre, apellidos, DNI, email, rol, contraseña y confirmar contraseña.
- Validación con expresiones regulares (formato DNI, email, longitud de contraseña, campos obligatorios).
- Persistencia prevista en `localStorage`.
- Al registrar con éxito, redirige al login.

---

## 3. Página Dashboard (`/dashboard`) — ✅ IMPLEMENTADA

**Responsabilidad:** Panel principal. Solo accesible con sesión iniciada (protegido por `SesionGuard`).

**Diseño actual (4 zonas):**

1. **Menú horizontal** `app-menu-simple` en la parte superior.
2. **2 tarjetas de resumen** al 50 %:
   - Pacientes: contador + botón "Ver todos" → `/pacientes`.
   - Doctores: contador + botón "Ver todos" → `/doctores`.
3. **2 gráficos** al 50 %:
   - `app-grafico-citas-estado`: citas agrupadas por estado (barras horizontales).
   - `app-grafico-tratamientos-departamento`: tratamientos por departamento (tarta).
4. **Cerrar sesión** desde el menú: limpia `sessionStorage` y redirige a `/login`.

**Diferencias con `docs/REQUISITOS.md`:**
- No hay sidebar; el menú es horizontal.
- No hay tablas de pacientes/doctores en el dashboard; viven en sus propias páginas.
- No hay componente de citas ni resumen textual de tratamientos; se sustituyeron por gráficos.
- Es un rediseño aprobado por el usuario.

**Nombres en español (TS):** `listaPacientes`, `listaMedicos`, `listaDepartamentos`, `listaCitas`, `listaTratamientos`, `cantidadPacientes`, `cantidadMedicos`, `cargarInformacion()`, `irAPagina()`.

---

## 4. Página Pacientes (`/pacientes`) — 🟡 PARCIAL

**Responsabilidad:** Listado y consulta de pacientes.

**Implementado:**
- Carga de pacientes con `ServicioPacientes.obtenerPacientes()`.
- Tabla Material (`app-tabla-pacientes`) con columnas: Nombre, Apellidos, DNI, Teléfono, Tipo.
- Filtro por nombre/apellidos con `[(ngModel)]` y signal `filtroNombre`.
- Clic en fila o botón de detalle → `/pacientes/:id`.
- Etiqueta de tipo con `<span class="etiqueta">` (sin `mat-badge`).
- Mensaje inline si no hay resultados.

**Pendiente:**
- Formulario de alta.
- Edición y eliminación.
- Persistencia en `localStorage`/`sessionStorage`.
- Ordenación por columnas.
- Validación con `PacienteClass.esValido()`.

---

## 5. Página Doctores (`/doctores`) — 🟡 PARCIAL

**Responsabilidad:** Listado y consulta de doctores.

**Implementado:**
- Carga de médicos y departamentos con `ServicioMedicos` y `ServicioDepartamentos`.
- Tabla Material (`app-tabla-medicos`) con columnas: Nombre, Apellidos, DNI, Especialidad, Departamento, Acción.
- Filtro por nombre/apellidos y por departamento (`mat-select` + `[(ngModel)]`).
- Nombre del departamento resuelto en el componente con `find`.
- Clic en fila o botón de visibilidad → `/doctores/:id`.

**Pendiente:**
- Formulario de alta.
- Edición y eliminación.
- Persistencia.
- Ordenación por columnas.
- Validación con `MedicoClass.esValido()`.

---

## 6. Página Citas (`/citas`) — ❌ PENDIENTE

**Responsabilidad:** CRUD completo de citas.

- Listado, alta, modificación y eliminación.
- Campos: paciente, médico, fecha, hora, motivo, estado.
- Filtrado por fecha, médico, paciente o estado.
- Ordenación por distintos campos.
- Relación: cita tiene 1 médico y 1 paciente (`pacienteId`, `medicoId`).
- El enlace existe en el menú, pero no hay ruta ni componente.

---

## 7. Página Tratamientos (`/tratamientos`) — ❌ PENDIENTE

**Responsabilidad:** CRUD completo de tratamientos.

- Listado, alta, modificación y eliminación.
- Campos: descripción, fecha de inicio, estado, médico, paciente.
- Relación: tratamiento tiene 1 médico y 1 paciente.
- El enlace existe en el menú, pero no hay ruta ni componente.

---

## 8. Páginas de detalle (ruta con parámetro) — ✅ IMPLEMENTADAS

### 8.1 `PacienteDetalle` (`/pacientes/:id`)

- Lee el `id` con `ActivatedRoute` (`route.params.subscribe` + `snapshot.paramMap.get('id')`).
- Llama a `ServicioPacientes.obtenerPaciente(id)`.
- Usa `signal<Paciente | undefined>` y `signal(true)` para el estado de carga.
- Muestra nombre y apellidos en mayúsculas (`UpperCasePipe`), foto (`foto` del JSON o `pravatar` con el id como semilla), DNI, teléfono y tipo.
- Botón **Volver a pacientes** → `Router.navigate(['/pacientes'])`.
- Si no encuentra el paciente, muestra "No se encontró el paciente".

### 8.2 `MedicoDetalle` (`/doctores/:id`)

- Misma estructura que la ficha de paciente.
- Llama a `ServicioMedicos.obtenerMedico(id)`.
- Muestra nombre, apellidos, DNI, especialidad y departamento.
- **No** muestra foto (decisión del usuario).
- Botón **Volver a doctores** → `Router.navigate(['/doctores'])`.

**Pendiente en ambas fichas:**
- Manejo de error HTTP (si falla la petición, se quedan en "Cargando...").
- Botones de editar/eliminar cuando exista el CRUD.

---

## 9. Componente Menú / Navegación (`app-menu-simple`) — ✅ IMPLEMENTADO

**Responsabilidad:** Menú horizontal reutilizable, presente en todas las páginas salvo login.

- Componente standalone sin `@Input`/`@Output`.
- Logo + enlaces: Dashboard, Pacientes, Doctores, Citas, Tratamientos.
- `RouterLinkActive` + `routerLinkActiveOptions: { exact: true }` para resaltar la sección activa.
- Perfil de sesión: avatar con la inicial, nombre y rol.
- Botón **Salir** en rojo: limpia `sessionStorage` y navega a `/login`.
- Lee la sesión de `sessionStorage` en el constructor y la guarda en un signal.

**Pendiente:**
- `exact: true` hace que "Pacientes"/"Doctores" no se resalten en las fichas de detalle.
- Los enlaces a Citas y Tratamientos no tienen ruta todavía.

---

## 10. Componentes de tabla

### 10.1 `app-tabla-pacientes`

- `@Input() pacientes: Paciente[]`.
- `@Output() seleccionarPaciente = new EventEmitter<string>()`.
- Signal `filtroNombre`.
- Getter `pacientesFiltrados` que filtra por nombre + apellidos.
- Tabla Material con `mat-table`, `mat-header-cell`, `mat-cell`, `mat-row`.
- Emite el id al hacer clic en una fila.

### 10.2 `app-tabla-medicos`

- `@Input() medicos: Medico[]` y `@Input() departamentos: Departamento[]`.
- `@Output() seleccionarMedico = new EventEmitter<string>()`.
- Signals `filtroNombre` y `filtroDepartamento`.
- Getter `medicosFiltrados` que combina ambos filtros.
- `obtenerNombreDepartamento(id)` con `find` local.
- Tabla Material con columna de acción (`mat-icon-button`).

---

## 11. Componentes de gráficos

### 11.1 `app-grafico-citas-estado`

- `@Input() citas: Cita[]`.
- Chart.js tipo `bar` horizontal (`indexAxis: 'y'`).
- Cuenta citas por estado: pendiente, confirmada, completada, cancelada.
- `responsive: false`, `maintainAspectRatio: false`, altura fija en CSS.
- `@ViewChild(BaseChartDirective)` + `chart.update()` en `ngOnChanges`.

### 11.2 `app-grafico-tratamientos-departamento`

- `@Input() tratamientos`, `medicos`, `departamentos`.
- Chart.js tipo `pie`.
- Agrupa tratamientos por departamento resolviendo `medicoId` → `departamentoId`.
- Misma estrategia de tamaño fijo y actualización manual.

---

## 12. Comunicación entre componentes

| Mecanismo | Uso real en el proyecto |
|-----------|-------------------------|
| `@Input()` | Tablas y gráficos reciben datos del padre |
| `@Output()` | Tablas emiten el id seleccionado al padre |
| Servicios | Carga de datos HTTP en páginas y componentes |
| Signals | Listas, filtros, estado de carga y sesión |
| `sessionStorage` | Sesión del usuario |
| `localStorage` | ⏳ Pendiente para el CRUD |

---

## 13. Eventos y utilidades

| Elemento | Uso real |
|----------|----------|
| `click` | Botones, filas, menú, logout |
| `input` | `[(ngModel)]` en login y filtros (sin manejador `(input)` explícito) |
| `change` | `mat-select` con `[(ngModel)]` (sin manejador `(change)` explícito) |
| `ngSubmit` | Formulario de login |
| `setTimeout` | Redirección tras login |
| `setInterval` | ❌ Pendiente |
| Pipes | `UpperCasePipe` en las fichas |
| `@if` / `@else` / `@for` | Control de flujo moderno en todas las plantillas |
