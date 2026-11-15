# HCRUDA-ng — ESTADO_ACTUAL.md

> **Documento vivo.** Refleja el estado real del código en una fecha concreta, el avance frente a `docs/REQUISITOS.md` y la comparación con el manual `docs/ANGULAR PARTE1.docx` (Tour of Heroes).
> Actualizar este documento al cerrar cada bloque de trabajo.

| Dato | Valor |
|------|-------|
| Fecha de corte | 16 de noviembre de 2026 |
| Commit de referencia | `fa8276e` |
| Rama | `main` (20 commits por delante de `origin/main`, sin push) |
| Manual comparado | `docs/ANGULAR PARTE1.docx` |
| Documento de requisitos | `docs/REQUISITOS.md` |

---

## 1. Resumen ejecutivo

**Avance aproximado: 55–60 % de los requisitos obligatorios.**

La base técnica está prácticamente cerrada: Angular 22 standalone, modelos, servicios HTTP con Observables, rutas, guard de sesión, login, dashboard, listados, filtros y fichas de detalle. Lo que falta es el bloque funcional grande:

- Páginas de **registro**, **citas** y **tratamientos**.
- **CRUD** completo (alta, edición, eliminación) y persistencia.
- Ordenación de listados.
- `setInterval`, `localStorage`, cookies, validación con regex y rol `admin`.
- Pruebas unitarias reales.

El detalle por página y por requisito está en las secciones siguientes.

---

## 2. Estado por página

| Ruta | Estado | Qué hay | Qué falta |
|------|--------|---------|-----------|
| `/login` | ✅ Implementada | Código + contraseña, `sessionStorage`, `setTimeout`, errores inline, redirección | Validación con regex; enlace a registro funcional |
| `/registro` | ❌ No existe | — | Página, ruta, formulario, regex, persistencia |
| `/dashboard` | ✅ Implementada | 4 zonas: 2 tarjetas de resumen + 2 gráficos; menú horizontal | Tablas y sidebar del diseño original (sustituidos por decisión del usuario) |
| `/pacientes` | 🟡 Parcial | Listado, tabla, filtro por nombre, ficha de detalle | CRUD, ordenación, persistencia |
| `/pacientes/:id` | ✅ Implementada | Ficha con foto, signals de carga, botón Volver | Manejo de error HTTP; edición/eliminación |
| `/doctores` | 🟡 Parcial | Listado, tabla, filtros por nombre y departamento, ficha | CRUD, ordenación, persistencia |
| `/doctores/:id` | ✅ Implementada | Ficha con signals de carga, botón Volver | Manejo de error HTTP; edición/eliminación |
| `/citas` | ❌ No existe | Enlace en el menú | Página, ruta, CRUD, filtros, ordenación |
| `/tratamientos` | ❌ No existe | Enlace en el menú | Página, ruta, CRUD, filtros, ordenación |

**Páginas de gestión implementadas: 2 de 4** (pacientes y doctores). Contando login, dashboard y las dos fichas de detalle hay 6 rutas reales, pero el mínimo de 6 páginas del curso se refiere a páginas de gestión; faltan al menos registro y citas, y idealmente tratamientos.

---

## 3. Checklist frente a `docs/REQUISITOS.md`

### 3.1 Autenticación y sesión

| Requisito | Estado | Nota |
|-----------|--------|------|
| Login y registro con validación | 🟡 | Login valida campos vacíos; no hay regex ni registro |
| Perfil `admin` con acceso total | ❌ | Solo existen roles `medico` y `enfermero` |
| `sessionStorage` y `localStorage` | 🟡 | Se usa `sessionStorage`; no `localStorage` |
| Autenticación por código de usuario | ✅ | `verificarCredenciales(codigo, contrasena)` |
| Cookies | ❌ | No se usan |

### 3.2 Gestión de objetos

| Requisito | Estado | Nota |
|-----------|--------|------|
| ≥ 2 tipos de objeto con relación | ✅ | Pacientes, médicos, citas y tratamientos relacionados por IDs |
| ≥ 5 campos por objeto | ✅ | Todos los modelos cumplen |
| Constructor + ≥ 3 métodos por clase | ✅ | `esValido()`, `aObjetoPlano()` + método propio |
| CRUD completo | ❌ | Solo lectura/listado y ficha |
| Relaciones por claves foráneas | ✅ | En datos, tablas y gráficos |

### 3.3 Listados, filtros y ordenación

| Requisito | Estado | Nota |
|-----------|--------|------|
| Mostrar todos los elementos | ✅ | Pacientes y doctores |
| Filtrar por distintos campos | ✅ | Pacientes por nombre; doctores por nombre + departamento |
| Ordenar por distintos campos | ❌ | No implementado |
| Tabla para un tipo y ficha para otro | ✅ | Ambos tienen tabla y ficha (se supera el mínimo) |
| Detalle con ruta con parámetro | ✅ | `/pacientes/:id` y `/doctores/:id` |

### 3.4 Interacción y eventos

| Requisito | Estado | Nota |
|-----------|--------|------|
| `click` | ✅ | Botones, filas, menú, logout |
| `keypress` / `input` | 🟡 | Se usa `[(ngModel)]`; no hay un manejador `(input)` explícito |
| `change` (selects) | 🟡 | `mat-select` con `[(ngModel)]`; no hay `(change)` explícito |
| `@Input` / `@Output` | ✅ | Tablas y gráficos |
| Comunicación con servicios | ✅ | Servicios HTTP inyectados |
| Signals | ✅ | Estado de listas, filtros, carga y sesión |

### 3.5 Requisitos técnicos

| Requisito | Estado | Nota |
|-----------|--------|------|
| Rutas (alguna con parámetros) | ✅ | 6 rutas + comodín |
| Servicios HTTP con Observables | ✅ | 6 servicios con `@Service()` + `inject(HttpClient)` |
| Carga inicial desde JSON | ✅ | `public/json/*.json` servidos en `/json/*.json` |
| `setInterval` y `setTimeout` | 🟡 | `setTimeout` en login; no `setInterval` |
| Cookies y storage | 🟡 | `sessionStorage`; faltan cookies y `localStorage` |
| Código organizado y comentado | 🟡 | Nombres en español; comentarios escasos |
| Nunca SnackBar | ✅ | Errores inline |

### 3.6 Opcionales

| Extra | Estado | Nota |
|-------|--------|------|
| Animaciones | 🟡 | Solo las de Angular Material (`provideAnimations`) |
| Gráficos | ✅ | Chart.js + ng2-charts (2 gráficos) |
| Prueba unitaria | ❌ | `app.spec.ts` es el de Angular CLI y está desactualizado |
| Otras opciones | ✅ | Fichas de detalle con foto, guard de sesión, menú compartido |

---

## 4. Comparación con `docs/ANGULAR PARTE1.docx`

El Word es el manual **Tour of Heroes**: enseña Angular 22 con un ejemplo de héroes. No es una especificación de HCRUDA, así que algunas cosas que aparecen en él no son obligatorias para este proyecto (PWA, CORS, API PHP, servicio de mensajes). Aun así, sirve para medir qué patrones de código se han interiorizado.

### 4.1 Cosas que hemos metido y sí se dan en el Word (código)

| Tema del Word | Dónde está en HCRUDA-ng |
|---------------|--------------------------|
| Componentes standalone con `@Component`, `selector`, `templateUrl`, `styleUrl` e `imports` | Todas las páginas y componentes |
| Interpolación `{{ }}` | `login.html`, `dashboard.html`, tablas y fichas |
| Interfaces de modelo | `src/app/models/*.ts` |
| `UpperCasePipe` | `paciente-detalle.html`, `medico-detalle.html` |
| `[(ngModel)]` + `FormsModule` | Login y filtros de las tablas |
| `@for` con `track` | Tablas, menú y `mat-select` de departamentos |
| `@if` / `@else` | Login, fichas de detalle |
| Event binding `(click)` / `(ngSubmit)` | Botones, filas de tabla, formulario de login |
| `@Input()` | Tablas (`pacientes`, `medicos`, `departamentos`) y gráficos |
| `@Service()` + `inject()` | Los 6 servicios y todas las páginas |
| `Observable<T>` + `subscribe()` | Servicios y componentes |
| `provideHttpClient()` | `src/app/app.config.ts` |
| `HttpClient.get<T>()` | Los 6 servicios |
| JSON local vía HTTP | `public/json/*.json` → `/json/*.json` |
| `map` (transformar la respuesta HTTP) | `servicio-usuarios`, `servicio-pacientes`, `servicio-medicos` |
| `catchError` + `of` | `servicio-usuarios` (único servicio que los usa) |
| `Routes`, `router-outlet`, `routerLink` | `app.routes.ts`, `app.html`, `menu-simple.html` |
| Ruta con parámetro + `ActivatedRoute` + `paramMap` + `snapshot` | `paciente-detalle.ts`, `medico-detalle.ts` |
| `Router.navigate` | Login, dashboard, tablas, menú y fichas |
| `ngOnInit` / `OnInit` | Páginas y gráficos |
| `provideBrowserGlobalErrorListeners()` | `app.config.ts` |
| `ng build` | README y documentación |
| `standalone: true` explícito | Todos los componentes |

### 4.2 Cosas que no hemos metido y sí se dan en el Word (código)

| Tema del Word | Sección del manual | Estado en HCRUDA-ng |
|---------------|--------------------|---------------------|
| `HttpHeaders` + `httpOptions` | Modificación de los héroes | No se usan |
| `http.put` (actualizar) | Modificación de los héroes | No implementado |
| `http.post` (añadir) | Añadir y eliminar héroe | No implementado |
| `http.delete` (eliminar) | Añadir y eliminar héroe | No implementado |
| `tap` para logging | Tratamiento de errores | No se usa |
| `handleError<T>` genérico | Tratamiento de errores | Solo hay un `catchError` simple en usuarios |
| `catchError` en todas las peticiones | Tratamiento de errores | Parcial: solo `ServicioUsuarios` |
| `Subject` + `debounceTime` + `distinctUntilChanged` + `switchMap` | Buscar por nombre | No se usa; los filtros son locales |
| `AsyncPipe` (`\| async`) | Buscar por nombre | No se usa; suscripciones manuales |
| `searchHeroes` (búsqueda HTTP) | Buscar por nombre | No implementado |
| `GestionarMensajes` + componente `Mensajes` | Mostrar mensajes | No implementado |
| Inyectar un servicio dentro de otro servicio | Mostrar mensajes | No se usa |
| Consumo de API REST (`http://localhost:2525/heroes`) | Consultas HTTP | Solo JSON estático |
| `Location.back()` para volver | Navegar a los detalles | Se usa `Router.navigate` (variante) |
| `getHeroe` por endpoint `/heroes/:id` | Consultas HTTP | Se usa GET de la lista + `map(find)` (variante) |
| Class binding `[class.selected]` | Actualizar la plantilla de detalle | No se usa; el menú usa `routerLinkActive` |
| `(input)` explícito | Buscar por nombre | Se usa `[(ngModel)]`; no hay manejador `(input)` |
| `(change)` explícito | Selects | Se usa `[(ngModel)]` en `mat-select`; no hay `(change)` |
| PWA, animaciones propias y Angular Aria | Introducción/novedades | No se usan; solo `provideAnimations()` para Material |
| CORS/proxy y API PHP | Anexos 2 y 3 | No aplica: JSON estático |

> **Matiz:** los puntos marcados como "variante" no son funcionalidad perdida; el mismo concepto está resuelto de otra forma. Por ejemplo, `Volver` funciona con `Router.navigate(['/pacientes'])` en lugar de `Location.back()`.

### 4.3 Cosas que hemos metido y no se dan en el Word (código)

| Tema | Dónde está | Nota |
|------|------------|------|
| Signals (`signal`, `.set`) | `app.ts`, páginas, tablas, menú | El Word las menciona conceptualmente, pero no las desarrolla con código |
| `@Output` + `EventEmitter` | `tabla-pacientes.ts`, `tabla-medicos.ts` | El Word solo muestra `@Input` |
| `CanMatchFn` + `SesionGuard` | `guards/sesion.guard.ts` | No aparece en el Word |
| `sessionStorage` para la sesión | Login, guard, menú y dashboard | No aparece en el Word |
| `setTimeout` para redirigir | `login.ts` | No aparece en el Word |
| Angular Material (`mat-card`, `mat-form-field`, `matInput`, `mat-select`, `mat-option`, `mat-table`, `mat-header-cell`, `mat-cell`, `mat-row`, `mat-button`, `mat-raised-button`, `mat-icon-button`, `mat-icon`, `mat-label`) | Todas las vistas | El Word lo menciona en la historia, no lo enseña con código |
| `MatTableModule` / `mat-table` | Tablas de pacientes y doctores | No aparece en el Word |
| Chart.js + ng2-charts (`BaseChartDirective`) | Gráficos del dashboard | No aparece en el Word |
| `@ViewChild(BaseChartDirective)` + `chart.update()` | Gráficos | No aparece en el Word |
| `OnChanges` / `ngOnChanges` | Gráficos | No aparece en el Word |
| `RouterLinkActive` + `routerLinkActiveOptions` | Menú | No aparece en el Word |
| `provideAnimations()` | `app.config.ts` | El ejemplo del Word no lo incluye |
| Mapeo `id`→`codigo` y `password`→`contrasena` | `servicio-usuarios.ts` | No aparece en el Word |
| `verificarCredenciales` | `servicio-usuarios.ts` | No aparece con ese nombre; equivale a `getHeroe` |
| `obtenerPaciente` / `obtenerMedico` con HTTP + `map(find)` | Servicios de pacientes y médicos | El Word usa `LISTAHEROES.find` + `of` o un endpoint por id |
| `@else if` | Fichas de detalle | El Word solo muestra `@if` |
| `menu-simple` compartido en todas las páginas | `components/menu-simple` | No aparece en el Word |
| `app.html` solo con `<router-outlet />` | `app.html` | El Word pone título y navegación en `app.html` |
| Clases de modelo con `esValido`, `aObjetoPlano` y métodos propios | `models/*.ts` | El Word solo muestra la interfaz |
| `trackById` (sin uso) | Tablas | Código muerto; no aporta |
| `medicoSeleccionado` en `sessionStorage` (sin lectura) | `dashboard.ts` | Código muerto; no aporta |
| `Volver` con `Router.navigate` en vez de `Location.back()` | Fichas | Variante del Word |

### 4.4 Cosas del Word que evitamos a propósito (y está bien)

El propio manual marca estas secciones como **"NO HACER"** o "solo revisar". No implementarlas es correcto:

- `NgModule` tradicional (el Word dice que los módulos están en desuso).
- `*ngIf`, `*ngFor`, `*ngSwitch` (sustituidos por `@if`, `@for`, `@switch`).
- `@Injectable({ providedIn: 'root' })` y la inyección por constructor (versión anterior a Angular 22).
- La opción de servicios basados en Promesas (el Word recomienda Observables para este caso).
- La versión antigua de servicios con listas estáticas `LISTAHEROES` (el proyecto arranca directamente con HTTP/JSON).

### 4.5 Variantes de implementación (mismo concepto, otra forma)

| Concepto | Word | HCRUDA-ng |
|----------|------|-----------|
| Ruta de detalle | `/detalle/:id` | `/pacientes/:id` y `/doctores/:id` |
| Volver | `Location.back()` | `Router.navigate(['/pacientes'])` / `['/doctores']` |
| Buscar entidad por id | `LISTAHEROES.find` + `of`, o endpoint `/heroes/:id` | `http.get` de la lista + `map(find)` |
| Importar router | `RouterModule` | `RouterLink`, `RouterLinkActive`, `RouterOutlet` directos |
| Detalle | Componente hijo con `@Input` | Página enrutada (la variante que el propio Word enseña después) |
| Dashboard | "Top Heroes" + buscador | Tarjetas de resumen + 2 gráficos (rediseño del usuario) |
| Errores HTTP | `handleError<T>` + `tap` | `catchError` simple, solo en usuarios |
| Ubicación de datos | `LISTAHEROES` estático y luego `/public/heroes.json` | `/json/*.json` desde el principio |
| Modelo | Solo interfaz | Interfaz + clase con métodos (requisito del curso) |

---

## 5. Diferencias entre la documentación y el código

1. **Dashboard:** `docs/REQUISITOS.md` describe menú lateral, tablas y resumen de citas/tratamientos. La implementación actual usa menú horizontal, 2 tarjetas y 2 gráficos, sin sidebar. Es un rediseño aprobado por el usuario; queda documentado como desviación consciente.
2. **Servicios y clases:** `docs/MODELO_DATOS.md` describe que los servicios instancian clases (`new UsuarioClass(...)`). En el código actual los servicios devuelven los objetos planos del JSON tipados con la interfaz. Las clases existen y tienen métodos, pero todavía no se usan en el flujo de datos; se aprovecharán al implementar el CRUD.
3. **Persistencia:** la documentación habla de `sessionStorage`/`localStorage` tras cada CRUD. El CRUD no existe todavía; solo se guarda la sesión en `sessionStorage`.
4. **Manejo de errores:** `BUENES_PRACTICAS_ANGULAR.md` pide `catchError` en todas las peticiones. Solo `ServicioUsuarios` lo tiene; pacientes, médicos, citas, tratamientos y departamentos no.
5. **`docs/AGENTS.md`:** está en `.gitignore`, por lo que se actualiza en local pero no se commitea.

---

## 6. Problemas y deuda técnica

| Problema | Impacto | Prioridad |
|----------|---------|-----------|
| `/registro` sin ruta y enlace inerte (`RouterLink` no importado en login) | El usuario no puede registrarse | Alta |
| `/citas` y `/tratamientos` sin ruta | El menú lleva a una redirección inesperada | Alta |
| Sin CRUD | No se puede dar de alta, editar ni eliminar | Alta |
| Sin ordenación | Requisito del curso pendiente | Media |
| Sin `setInterval`, `localStorage` ni cookies | Requisitos técnicos pendientes | Media |
| Sin validación regex | Requisito del curso pendiente | Media |
| Sin rol `admin` | Requisito del curso pendiente | Media |
| `catchError(() => of([]))` en usuarios | Oculta errores HTTP y deja la lista vacía sin avisar | Media |
| Sin `catchError` en las fichas | Si falla la petición, se queda en "Cargando..." | Media |
| `trackById` sin uso | Código muerto | Baja |
| `medicoSeleccionado` sin lectura | Código muerto | Baja |
| `app.spec.ts` desactualizado | `ng test` fallaría | Baja |
| `routerLinkActiveOptions exact` | No resalta la sección en las fichas | Baja |
| Documentación desfasada | Se corrige con este documento y las actualizaciones de docs | Baja |

---

## 7. Próximos pasos recomendados

### Bloque 1 — Cerrar el mínimo obligatorio

1. **Registro** (`/registro`): página, ruta, `RouterLink` en login, validación con regex (DNI, email, contraseña), alta en `localStorage`.
2. **Citas** (`/citas`): página, ruta, listado, filtros, ordenación y CRUD.
3. **Tratamientos** (`/tratamientos`): página, ruta, listado, filtros y CRUD.
4. **CRUD de pacientes y doctores** con `localStorage` y validación con `esValido()`.

### Bloque 2 — Requisitos técnicos que faltan

5. `setInterval` (por ejemplo, un reloj o "última actualización" en el dashboard).
6. Cookies (por ejemplo, preferencia de tema o último acceso).
7. Rol `admin` con acceso a la gestión de todas las tablas.
8. Ordenación por columnas en las tablas.

### Bloque 3 — Calidad y extras

9. `catchError` en todos los servicios y estado de error en las fichas.
10. Pruebas unitarias reales (modelos, servicios y componentes críticos).
11. Limpiar código muerto (`trackById`, `medicoSeleccionado`).
12. Sincronizar `docs/REQUISITOS.md`, `PAGINAS_COMPONENTES.md` y `ARQUITECTURA_Y_ESTRUCTURA.md` con el estado final.

### Bloque 4 — Patrones del Word que se pueden añadir si se busca nota extra

13. CRUD HTTP con `HttpHeaders`, `http.post`, `http.put` y `http.delete` (aunque el backend sea JSON local, se puede simular con `localStorage`).
14. Búsqueda con `Subject` + `debounceTime` + `distinctUntilChanged` + `switchMap` y `AsyncPipe`.
15. Servicio de mensajes (`GestionarMensajes`) si se quiere mostrar un registro de actividad.

---

## 8. Cómo mantener este documento

1. Actualizar la **fecha de corte** y el **commit de referencia** al empezar una revisión.
2. Marcar las páginas y requisitos que se completen.
3. Añadir a la comparación con el Word los patrones nuevos que se implementen.
4. Actualizar también `README.md` y `docs/PAGINAS_COMPONENTES.md` cuando cambie el estado.
5. No borrar las secciones de "cosas que faltan": sirven de checklist para la entrega.
