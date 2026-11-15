# HCRUDA-ng

SPA de gestión hospitalaria construida con **Angular 22**. Es la versión Angular de HCRUDA: pacientes, doctores, departamentos, citas, tratamientos y usuarios de acceso.

> **Estado:** proyecto en desarrollo. La base técnica (modelos, servicios, rutas, login, dashboard, listados y fichas de detalle) está implementada. Faltan las páginas de **registro**, **citas** y **tratamientos**, además del **CRUD completo**.
> El estado detallado, la comparación con el manual del curso y las tareas pendientes están en [`docs/ESTADO_ACTUAL.md`](docs/ESTADO_ACTUAL.md).

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Angular 22.2.x (standalone components) |
| Lenguaje | TypeScript 6.0 |
| Reactividad | RxJS 7.8 + Angular Signals |
| UI | Angular Material (tema claro) |
| Gráficos | Chart.js 4 + ng2-charts 11 |
| Pruebas | Vitest 5 |
| Build | Angular CLI 22 |

---

## Requisitos previos

- Node.js 22 LTS (probado con 22.23.1)
- npm 10.9.8 (probado)

## Puesta en marcha

```bash
npm install --legacy-peer-deps
npm start
```

La aplicación queda disponible en `http://localhost:4200/`.

> `--legacy-peer-deps` es necesario por los conflictos de dependencias entre Angular 22 y algunas librerías del ecosistema.

### Credenciales de prueba

| Código | Contraseña | Rol |
|--------|------------|-----|
| `U001` | `clave123` | médico |
| `U002` | `enf456` | enfermero |

---

## Rutas implementadas

| Ruta | Página | Estado |
|------|--------|--------|
| `/login` | Login por código y contraseña | ✅ |
| `/dashboard` | Resumen con tarjetas y gráficos | ✅ |
| `/pacientes` | Listado y filtro de pacientes | ✅ |
| `/pacientes/:id` | Ficha de paciente | ✅ |
| `/doctores` | Listado y filtros de doctores | ✅ |
| `/doctores/:id` | Ficha de doctor | ✅ |
| `/registro` | Alta de usuario | ❌ Pendiente |
| `/citas` | Gestión de citas | ❌ Pendiente |
| `/tratamientos` | Gestión de tratamientos | ❌ Pendiente |

Las rutas `dashboard`, `pacientes`, `pacientes/:id`, `doctores` y `doctores/:id` están protegidas por `SesionGuard` (`CanMatchFn`), que comprueba la sesión en `sessionStorage`.

---

## Estructura del proyecto

```
src/
  app/
    app.ts / app.html / app.css      # Componente raíz
    app.config.ts                    # provideRouter, provideHttpClient, provideAnimations
    app.routes.ts                    # Rutas de la aplicación

    models/                          # Interfaces + clases de modelo
      usuario.model.ts
      departamento.model.ts
      medico.model.ts
      paciente.model.ts
      cita.model.ts
      tratamiento.model.ts

    services/                        # Servicios HTTP con Observables
      servicio-usuarios.service.ts
      servicio-departamentos.service.ts
      servicio-medicos.service.ts
      servicio-pacientes.service.ts
      servicio-citas.service.ts
      servicio-tratamientos.service.ts

    guards/
      sesion.guard.ts                # Protección de rutas con sessionStorage

    pages/
      login/                         # ✅
      dashboard/                     # ✅
      pacientes/                     # ✅
      paciente-detalle/              # ✅
      doctores/                      # ✅
      medico-detalle/                # ✅
      registro/                      # ⏳ pendiente
      citas/                         # ⏳ pendiente
      tratamientos/                  # ⏳ pendiente

    components/
      menu-simple/                   # Menú horizontal compartido
      tabla-pacientes/               # Tabla + filtro + @Output
      tabla-medicos/                 # Tabla + filtros + @Output
      grafico-citas-estado/          # Chart.js
      grafico-tratamientos-departamento/ # Chart.js

    utils/
      chart-config.ts                # Chart.register(...registerables)

public/
  json/                              # Datos seed servidos en /json/<archivo>.json
    departamentos.json               # 3
    medicos.json                     # 5
    pacientes.json                   # 8
    citas.json                       # 6
    tratamientos.json                # 4
    usuarios.json                    # 2
```

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo en `http://localhost:4200/` |
| `npm run build` | Build de producción en `dist/` |
| `npm run watch` | Build en modo desarrollo con recarga |
| `npm test` | Pruebas unitarias con Vitest |

---

## Funcionalidad actual

### Implementado

- Login por **código de usuario** y contraseña, con sesión en `sessionStorage`, `setTimeout` antes de redirigir y errores inline (sin SnackBar).
- Dashboard con 2 tarjetas de resumen (pacientes y doctores) y 2 gráficos:
  - Citas por estado (Chart.js, barras horizontales).
  - Tratamientos por departamento (Chart.js, tarta).
- Menú horizontal `app-menu-simple` presente en todas las páginas salvo login, con perfil de sesión y botón Salir.
- Listado de pacientes con filtro por nombre y ficha de detalle con foto.
- Listado de doctores con filtro por nombre y departamento, y ficha de detalle.
- Modelos con interfaz, clase, constructor, `esValido()`, `aObjetoPlano()` y métodos propios.
- Servicios con `@Service()`, `inject(HttpClient)` y `Observable<T>`.
- Rutas con parámetro (`/pacientes/:id`, `/doctores/:id`), `ActivatedRoute` y `paramMap`.
- Gráficos responsivos con altura fija para evitar crecimiento infinito.

### Pendiente

- Página de **registro** y validación con expresiones regulares.
- Páginas de **citas** y **tratamientos**.
- **CRUD** (alta, edición y eliminación) de pacientes, doctores, citas y tratamientos.
- Persistencia con `localStorage` y cookies.
- Ordenación de listados.
- Uso de `setInterval`.
- Rol `admin` con acceso total.
- Pruebas unitarias reales (el `app.spec.ts` actual está desactualizado).
- Sincronizar los enlaces del menú con las rutas pendientes.

---

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [`docs/REQUISITOS.md`](docs/REQUISITOS.md) | Requisitos funcionales y técnicos del proyecto |
| [`docs/ESTADO_ACTUAL.md`](docs/ESTADO_ACTUAL.md) | Estado real, avance y comparación con el manual Word |
| [`docs/ARQUITECTURA_Y_ESTRUCTURA.md`](docs/ARQUITECTURA_Y_ESTRUCTURA.md) | Estructura de carpetas, capas, rutas y persistencia |
| [`docs/PAGINAS_COMPONENTES.md`](docs/PAGINAS_COMPONENTES.md) | Páginas, componentes y estado de cada una |
| [`docs/MODELO_DATOS.md`](docs/MODELO_DATOS.md) | Modelos, relaciones y datos seed |
| [`docs/DISENO_UI.md`](docs/DISENO_UI.md) | Decisiones visuales, Angular Material y gráficos |
| [`docs/BUENES_PRACTICAS_ANGULAR.md`](docs/BUENES_PRACTICAS_ANGULAR.md) | Patrones del manual adaptados a Angular 22 |

---

## Problemas conocidos

- `/registro` no tiene ruta ni componente; el enlace del login usa `routerLink` sin importar `RouterLink`, por lo que es inerte.
- `/citas` y `/tratamientos` aparecen en el menú pero no tienen ruta; el comodín redirige a `/login`.
- `app.spec.ts` espera un `<h1>` con el texto por defecto de Angular CLI y fallará.
- `ServicioUsuarios.obtenerUsuarios()` usa `catchError(() => of([]))`, lo que oculta los errores HTTP.
- `obtenerPaciente()` y `obtenerMedico()` no tienen manejo de error: si falla la petición, la ficha se queda en "Cargando...".
- `trackById()` en las tablas y la clave `medicoSeleccionado` del dashboard no se usan.
- El menú usa `routerLinkActiveOptions: { exact: true }`, así que "Pacientes"/"Doctores" no se resaltan en las fichas de detalle.

---

## Próximos pasos sugeridos

1. Página de registro + ruta + validación regex + `localStorage`.
2. Página de citas + CRUD + filtros + ordenación.
3. Página de tratamientos + CRUD.
4. CRUD de pacientes y doctores.
5. `setInterval`, cookies y rol `admin`.
6. Pruebas unitarias y sincronización final de la documentación.
