# HCRUDA-ng — REQUISITOS.md (Requisitos del proyecto)

> Sintetiza los requisitos funcionales y técnicos de HCRUDA-ng, adaptados a Angular (v22) a partir de `docs/HCRUDA_PROJECT.md`, `docs/MODELO_DATOS_Y_CLASES.md`, `docs/ESTRUCTURA_ARCHIVOS_Y_PAGINAS.md`, `docs/CRUD_PAGINAS_JSON.md` y el manual `ANGULAR PARTE1.docx`.
> **Leer junto con `docs/AGENTS.md`.**

---

## 1. Alcance del producto

HCRUDA-ng es un ERP/CRM hospitalario de una sola página (SPA) con Angular. Gestiona:

- **Pacientes** (urgencia / planta / casa) y **médicos** (1 departamento cada uno).
- **Departamentos** (1:N con médicos; N:M con pacientes).
- **Citas** y **tratamientos** (cada una con 1 médico y 1 paciente).
- **Usuarios** de acceso (rol: `medico` o `enfermero`) para login y perfil.

Es como una CRM/ERP de hospital: citas, tratamientos y departamentos, con relación entre pacientes, médicos y departamentos.

---

## 2. Páginas mínimas (≥ 6 requeridas)

| Ruta | Página | Responsabilidad |
|------|--------|-----------------|
| `/` o `/login` | **Login** | Página de entrada. Formulario de acceso (usuario/contraseña). Validación de campos vacíos. Guarda sesión y redirige al dashboard. Enlace a registro. |
| `/registro` | **Registro** | Alta de nuevo usuario (médico o enfermero). Campos: nombre, apellidos, DNI, email, rol, contraseña, confirmar contraseña. Validación con expresiones regulares (formato DNI, longitud de contraseña, obligatorios). |
| `/dashboard` | **Dashboard** | Solo accesible con sesión. Resumen (conteos), tablas de pacientes y doctores, componente de citas, resumen de tratamientos por estado. Menú lateral. Navega a pacientes/doctores. |
| `/pacientes` | **Pacientes** | CRUD de pacientes: listado (tabla), alta, modificación, eliminación. Filtro por nombre y tipo. Detalle en modo ficha. |
| `/doctores` | **Doctores** | CRUD de doctores: listado (tabla), alta, modificación, eliminación. Filtro por nombre y departamento. Detalle en modo ficha. |
| `/citas` | **Citas** | CRUD completo de citas. Filtrado por fecha, médico, paciente o estado. Ordenado por distintos campos. |
| `/tratamientos` | **Tratamientos** | CRUD completo de tratamientos: descripción, fecha inicio, estado, médico, paciente. |

> Una tabla muestra los datos de un tipo de objeto y un **modo ficha** muestra el detalle del otro tipo (requisito del curso).

---

## 3. Requisitos funcionales (adaptados a Angular)

### Autenticación y sesión
- Página de login y de registro con **validación de formularios** (expresiones regulares, tipos, campos obligatorios).
- **Gestión de sesión y perfil**: el perfil `admin` debe tener acceso a la parte de la aplicación que permite gestionar todas las tablas.
- Uso de `sessionStorage` y `localStorage` para sesión y datos del CRUD.

### Gestión de objetos (≥ 2 tipos con relación)
- Cada objeto: **≥ 5 campos**, constructor y **≥ 3 métodos adicionales** (en clases de modelo).
- Para cada elemento se debe poder dar de **alta, modificar, eliminar y consultar** (CRUD completo).
- Relaciones simuladas con IDs (claves foráneas): Cita→pacienteId+medicoId, Tratamiento→pacienteId+medicoId, Medico→departamentoId.

### Listados, filtros y ordenación
- Mostrar todos los elementos de un tipo.
- **Filtrar** por distintos campos (componente único de búsqueda/filtro).
- **Ordenar** por distintos campos.
- Datos mostrados en **tabla** para un tipo y en **modo ficha** para otro.
- Componente para mostrar el **detalle** de algo (ruta con parámetro, ej. `/detalle/:id`).

### Interacción y eventos
- Diferentes eventos: `click`, `keypress`/`input`, `change` (selects).
- Comunicación entre componentes con `@Input`/`@Output` o con **servicios**.
- Comunicación con **señales** (Angular signals) — ej. actualizar contadores al crear/eliminar.

### Requisitos técnicos obligatorios (del curso)
- **Rutas** (alguna con parámetros, ej. detalle de paciente/cita).
- **Servicios HTTP con Observables** (`HttpClient`, `provideHttpClient`, `.subscribe()`).
- **Carga inicial de objetos** desde JSON (no partir del sistema vacío). `fetch`/`HttpClient` de `/json/*.json` al arrancar.
- Uso obligatorio de **`setInterval` y `setTimeout`**.
- Uso de **cookies y storage** (`sessionStorage` / `localStorage`).
- Código organizado, comentado, legible (nombres de variables y métodos en español).

### Opcional (ampliar nota hasta el 10)
- Animaciones.
- Gráficos.
- Prueba unitaria (en este proyecto Angular: **Vitest**, no Karma/Jasmine).
- Cualquier otra opción no vista en clase.

---

## 4. Carga inicial (seed) mínima

Al arrancar la app, instanciar al menos:
- 3 Departamentos
- 5 Médicos (distribuidos en departamentos)
- 8 Pacientes (mezcla urgencia / planta / casa)
- 6 Citas (vinculando pacientes y médicos)
- 4 Tratamientos
- 2 Usuarios (1 médico, 1 enfermero) para login

Los JSON de seed viven en `public/json/` y se leen mediante `HttpClient` desde la ruta `/json/<archivo>.json`.

---

## 5. Relaciones del modelo

| Relación | Cardinalidad |
|----------|-------------|
| Departamento → Médico | 1 : N |
| Departamento → Paciente | N : M |
| Médico → Departamento | N : 1 |
| Paciente → Departamento | 1 o más |
| Cita → Médico | N : 1 |
| Cita → Paciente | N : 1 |
| Tratamiento → Médico | N : 1 |
| Tratamiento → Paciente | N : 1 |

---

## 6. Detalles por entidad (campos mínimos)

| Entidad | Campos mínimos |
|---------|---------------|
| Departamento | id, nombre, descripcion |
| Medico | id, nombre, apellidos, dni, departamentoId, especialidad |
| Paciente | id, nombre, apellidos, dni, telefono, tipo ("urgencia"\|"planta"\|"casa") |
| Cita | id, pacienteId, medicoId, fecha, hora, motivo, estado ("pendiente"\|"confirmada"\|"completada"\|"cancelada") |
| Tratamiento | id, pacienteId, medicoId, descripcion, fechaInicio, estado ("activo"\|"finalizado"\|"suspendido") |
| Usuario (login) | id, nombre, rol ("medico"\|"enfermero"), password |

> Cada clase del modelo: constructor + `toJSON()` + `validar()` + ≥ 3 métodos propios (ej. `cambiarEstado()`, `getResumen()`, `cambiarTipo()`, `autenticar()`).
