# HCRUDA-ng — PAGINAS_COMPONENTES.md (Páginas y componentes de la aplicación)

> Define cada página y componente de HCRUDA-ng con sus responsabilidades, campos, filtros y operaciones CRUD.
> **Leer junto con `docs/AGENTS.md`, `docs/REQUISITOS.md` y `docs/MODELO_DATOS.md`.**

---

## 1. Página Login (`/login`) — IMPLEMENTADA

**Responsabilidad:** Página de entrada única de la aplicación.

- Formulario de acceso con **código de usuario** y contraseña.
- Validación de campos vacíos antes de enviar.
- Al autenticar, guarda sesión en `sessionStorage` y redirige al dashboard.
- Enlace a la página de registro.
- Uso obligatorio de `setTimeout` (pequeña pausa antes de redirigir, requisito del curso).
- Mensajes de error mostrados en pantalla directamente (sin SnackBar).
- Autentica contra `/json/usuarios.json` (mapea `id`→`codigo`, `password`→`contrasena`).

**Nombres en español (TS):** `codigoUsuario`, `contrasenaUsuario`, `estaCargando`, `mensajeError`, `iniciarSesion()`, `servicioUsuarios`.

---

## 2. Página Registro (`/registro`) — PENDIENTE

**Responsabilidad:** Alta de nuevo usuario (médico o enfermero).

- Campos: nombre, apellidos, DNI, email, rol, contraseña, confirmar contraseña.
- Validación con expresiones regulares (formato DNI, longitud de contraseña, campos obligatorios).
- Al registrar con éxito, redirige al login.

---

## 3. Página Dashboard (`/dashboard`) — IMPLEMENTADA

**Responsabilidad:** Panel principal. Solo accesible con sesión iniciada (protegido por `SesionGuard`).

- **Header** con logo, título, bloque de usuario (avatar + nombre y rol) y botón Cerrar sesión.
- **Menú lateral** (sidenav) con navegación a todas las páginas.
- **Resumen**: tarjetas con conteos de pacientes, doctores y citas.
- **Tabla pacientes**: búsqueda por nombre + tabla (Nombre, Apellidos, DNI, Tipo, Acción). Clic en fila para detalle.
- **Tabla doctores**: filtros por nombre y departamento + tabla (Nombre, Apellidos, Especialidad, Departamento, Acción).
- **Cerrar sesión**: limpia `sessionStorage` y redirige a `/login`.
- `setTimeout` para mensaje de bienvenida (requisito del curso).

**Nombres en español (TS):** `usuarioConectado`, `listaPacientes`, `listaMedicos`, `cargarInformacion()`, `cerrarSesion()`, `irAPagina()`, `verDetallePaciente()`, `rastrearPorId()`.

---

## 4. Página Pacientes (`/pacientes`) — PENDIENTE

**Responsabilidad:** CRUD completo de pacientes (tabla para este tipo de objeto).

- Formulario de alta (nombre, apellidos, DNI, teléfono, tipo).
- Tabla con filtros (search por nombre + select por tipo).
- Detalle del paciente en **modo ficha**.
- Alta, modificación y eliminación con validación del modelo (`paciente.esValido()`).
- Persistencia en `sessionStorage` tras cada CRUD.

---

## 5. Página Doctores (`/doctores`) — PENDIENTE

**Responsabilidad:** CRUD completo de doctores (modo ficha para este tipo).

- Formulario de alta (nombre, apellidos, DNI, especialidad, departamento).
- Tabla con filtros (search por nombre + select por departamento).
- Detalle del doctor en **modo ficha** con botones Editar y Eliminar.

---

## 6. Página Citas (`/citas`) — PENDIENTE

**Responsabilidad:** CRUD completo de citas.

- Listado, alta, modificación, eliminación.
- Campos: paciente, médico, fecha, hora, motivo, estado.
- Filtrado por fecha, médico, paciente o estado.
- Ordenado por distintos campos.
- Relación: cita tiene 1 médico y 1 paciente (claves foráneas `pacienteId`, `medicoId`).

---

## 7. Página Tratamientos (`/tratamientos`) — PENDIENTE

**Responsabilidad:** CRUD completo de tratamientos.

- Listado, alta, modificación, eliminación.
- Campos: descripción, fecha inicio, estado, médico, paciente.
- Relación: tratamiento tiene 1 médico y 1 paciente.

---

## 8. Componente Detalle (ruta con parámetro)

**Responsabilidad:** Mostrar el detalle de una entidad (ruta `/detalle/:tipo/:id`).

- Recibe el `id` por parámetro de ruta (`ActivatedRoute`, `paramMap`).
- Recupera la entidad mediante el servicio.
- Muestra los datos en modo ficha.
- Botón Volver (`Location.back()`) y botón Guardar/Actualizar.

---

## 9. Componente Menú / Navegación

**Responsabilidad:** Menú de navegación reutilizable.

- Componente standalone reutilizable.
- Muestra enlaces de navegación según el rol del usuario logueado.
- Solo aparece si el usuario está logueado.

---

## 10. Comunicación entre componentes

| Mecanismo | Uso en el proyecto |
|-----------|-------------------|
| `@Input()` / `@Output()` | Padre ↔ hijo |
| Servicios | Estado compartido entre páginas no relacionadas |
| Signals | Contadores reactivos |
| `sessionStorage` / `localStorage` | Sesión y persistencia de CRUD entre recargas |

---

## 11. Eventos requeridos

- `click`: botones de guardar, eliminar, editar, cerrar sesión, menú.
- `keypress` / `input`: búsqueda por nombre.
- `change`: selects de filtro (tipo, departamento, estado).
- `setInterval` / `setTimeout`: uso obligatorio del curso.
