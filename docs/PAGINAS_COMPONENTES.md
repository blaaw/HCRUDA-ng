# HCRUDA-ng — PAGINAS_COMPONENTES.md (Páginas y componentes de la aplicación)

> Define cada página y componente de HCRUDA-ng con sus responsabilidades, campos, filtros y operaciones CRUD.
> **Leer junto con `docs/AGENTS.md`, `docs/REQUISITOS.md` y `docs/MODELO_DATOS.md`.**

---

## 1. Página Login (`/login`)

**Responsabilidad:** Página de entrada única de la aplicación.

- Formulario de acceso con usuario y contraseña.
- Validación de campos vacíos antes de enviar.
- Al autenticar, guarda sesión en `sessionStorage` y redirige al dashboard.
- Enlace a la página de registro.
- Componente independiente (standalone), sin `router-outlet` propio.

---

## 2. Página Registro (`/registro`)

**Responsabilidad:** Alta de nuevo usuario (médico o enfermero).

- Campos: nombre, apellidos, DNI, email, rol, contraseña, confirmar contraseña.
- Validación con expresiones regulares (formato DNI, longitud de contraseña, campos obligatorios).
- Inputs y select con clases de la librería de UI (ver `docs/DISENO_UI.md`).
- Al registrar con éxito, redirige al login.

---

## 3. Página Dashboard (`/dashboard`)

**Responsabilidad:** Panel principal. Solo accesible con sesión iniciada (si no, redirige al login).

- Header con logo, título, bloque de usuario (avatar + nombre y rol) y botón Cerrar sesión.
- Resumen arriba: conteos de pacientes, doctores, citas y tratamientos (por estado: Activos, Finalizados, Suspendidos, y total).
- Tabla de pacientes: búsqueda por nombre + tabla (Nombre, Apellidos, DNI, Teléfono, Tipo badge, Tratamiento). Filtro por nombre.
- Tabla de doctores: búsqueda por nombre + tabla (Nombre, Apellidos, DNI, Especialidad, Departamento badge). Filtros por nombre y departamento.
- Componente citas: botones por estado (Pendientes, Confirmadas, Completadas, Canceladas, Todas) con total de citas.
- Menú lateral con hamburguesa.
- Navega a pacientes.html y doctores.html al clic en una fila.

---

## 4. Página Pacientes (`/pacientes`)

**Responsabilidad:** CRUD completo de pacientes (tabla para este tipo de objeto).

- Formulario de alta horizontal arriba del main (nombre, apellidos, DNI, teléfono, tipo).
- Tabla con filtros (search por nombre + select por tipo) y columnas: Nombre, Apellidos, Teléfono, Tipo.
- Detalle del paciente seleccionado en **modo ficha** (avatar, nombre, DNI, teléfono, tipo, tratamiento, botones Editar/Eliminar).
- Alta, modificación y eliminación con validación del modelo (`paciente.validar()`).
- Persistencia en `sessionStorage` tras cada CRUD.

---

## 5. Página Doctores (`/doctores`)

**Responsabilidad:** CRUD completo de doctores (modo ficha para este tipo).

- Formulario de alta horizontal arriba del main (nombre, apellidos, DNI, especialidad, departamento).
- Tabla con filtros (search por nombre + select por departamento) y columnas: Nombre, Apellidos, DNI, Especialidad, Departamento.
- Detalle del doctor seleccionado como componente de detalle (`<app-detalle-medico>`) con botones Editar y Eliminar.
- Menú lateral con hamburguesa.

---

## 6. Página Citas (`/citas`)

**Responsabilidad:** CRUD completo de citas.

- Listado, alta, modificación, eliminación.
- Campos: paciente, médico, fecha, hora, motivo, estado.
- Filtrado por fecha, médico, paciente o estado.
- Ordenado por distintos campos.
- Relación: cita tiene 1 médico y 1 paciente (claves foráneas `pacienteId`, `medicoId`).

---

## 7. Página Tratamientos (`/tratamientos`)

**Responsabilidad:** CRUD completo de tratamientos.

- Listado, alta, modificación, eliminación.
- Campos: descripción, fecha inicio, estado, médico, paciente.
- Relación: tratamiento tiene 1 médico y 1 paciente.

---

## 8. Componente Detalle (ruta con parámetro)

**Responsabilidad:** Mostrar el detalle de una entidad (ruta `/detalle/:tipo/:id`).

- Recibe el `id` por parámetro de ruta (`ActivatedRoute`, `paramMap`).
- Recupera la entidad mediante el servicio (`getHeroe(id)` / `getPaciente(id)`, etc.).
- Muestra los datos en modo ficha.
- Botón Volver (`Location.back()`) y botón Guardar/Actualizar (`actualizarHeroe` → `http.put`).

---

## 9. Componente Menú / Navegación

**Responsabilidad:** Menú de navegación reutilizable (requisito original: "menú como componente Web").

- Componente standalone reutilizable.
- Muestra enlaces de navegación según el rol del usuario logueado.
- Solo aparece si el usuario está logueado.
- Enlaces: Citas, Pacientes, Doctores, Tratamientos, Dashboard, Cerrar sesión.

---

## 10. Comunicación entre componentes

| Mecanismo | Uso en el proyecto |
|-----------|-------------------|
| `@Input()` / `@Output()` | Padre ↔ hijo (ej. detalle recibe entidad, emite evento de guardado) |
| Servicios | Estado compartido entre páginas no relacionadas (lista de pacientes, mensajes) |
| Signals | Contadores reactivos (ej. total de citas, notificaciones) |
| `sessionStorage` / `localStorage` | Sesión y persistencia de CRUD entre recargas |

---

## 11. Eventos requeridos

- `click`: botones de guardar, eliminar, editar, cerrar sesión, menú.
- `keypress` / `input`: búsqueda por nombre (keyup en search bar).
- `change`: selects de filtro (tipo, departamento, estado).
- `setInterval` / `setTimeout`: uso obligatorio en algún punto de la app (ej. temporizador de sesión, refresco de notificaciones, mensaje automático).
