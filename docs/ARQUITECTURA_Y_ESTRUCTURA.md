# HCRUDA-ng — ARQUITECTURA_Y_ESTRUCTURA.md (Estructura y arquitectura)

> Define la estructura de carpetas, las capas de responsabilidad, las rutas y el flujo de navegación de HCRUDA-ng.
> **Leer junto con `docs/REQUISITOS.md`, `docs/ESTADO_ACTUAL.md` y `docs/MODELO_DATOS.md`.**
>
> Estado: 16 de noviembre de 2026 · commit `fa8276e`.

---

## 1. Estructura de carpetas (real)

```
src/
  app/
    app.ts                 # Componente raíz (standalone, signal title)
    app.html               # Plantilla raíz: solo <router-outlet />
    app.css                # Estilos del root
    app.routes.ts          # Todas las rutas (Routes)
    app.config.ts          # provideRouter, provideHttpClient, provideAnimations
    app.spec.ts            # Spec por defecto de Angular CLI (desactualizado)

    models/                # Interfaces + clases del modelo de datos
      usuario.model.ts
      departamento.model.ts
      medico.model.ts
      paciente.model.ts
      cita.model.ts
      tratamiento.model.ts

    services/              # Servicios de datos (@Service + inject + Observable + HttpClient)
      servicio-usuarios.service.ts
      servicio-departamentos.service.ts
      servicio-medicos.service.ts
      servicio-pacientes.service.ts
      servicio-citas.service.ts
      servicio-tratamientos.service.ts

    guards/                # Guardias de ruta (sesión)
      sesion.guard.ts

    pages/                 # Páginas/vistas standalone
      login/               # ✅ implementada
      dashboard/           # ✅ implementada
      pacientes/           # ✅ implementada (listado + filtro)
      paciente-detalle/    # ✅ implementada (/pacientes/:id)
      doctores/            # ✅ implementada (listado + filtros)
      medico-detalle/      # ✅ implementada (/doctores/:id)
      registro/            # ⏳ pendiente
      citas/               # ⏳ pendiente
      tratamientos/        # ⏳ pendiente

    components/            # Componentes reutilizables standalone
      menu-simple/         # Menú horizontal + perfil + Salir
      tabla-pacientes/     # Tabla Material, filtro y @Output
      tabla-medicos/       # Tabla Material, filtros y @Output
      grafico-citas-estado/
      grafico-tratamientos-departamento/

    utils/
      chart-config.ts      # Chart.register(...registerables)

  public/
    json/                  # Datos seed, servidos en /json/<archivo>.json
      departamentos.json
      medicos.json
      pacientes.json
      citas.json
      tratamientos.json
      usuarios.json
    favicon.ico

  styles.css               # Estilos globales (tema Angular Material indigo-pink)
  index.html               # Punto de entrada (Material Icons)
```

**Regla:** un archivo `.ts` por componente/servicio/modelo. Un `.html` y un `.css` por componente. Nada de lógica de negocio dentro de las plantillas.

---

## 2. Capas y responsabilidades

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Entrada | `src/index.html`, `src/main.ts`, `src/app/app.*` | Bootstrap, raíz, rutas globales |
| Modelo | `src/app/models/` | Interfaces y clases con constructor, `esValido()`, `aObjetoPlano()` y métodos propios. Sin DOM, sin HTTP. |
| Servicios | `src/app/services/` | Acceso a datos: `HttpClient` → `Observable`, carga de JSON, mapeo de campos y manejo de errores. |
| Guardias | `src/app/guards/` | Protección de rutas que requieren sesión (`CanMatchFn`). |
| Componentes | `src/app/components/` | Piezas reutilizables: menú, tablas, gráficos. |
| Vistas | `src/app/pages/` | Páginas completas: formularios, tablas, filtros, botones, suscripción a servicios. |
| Utilidades | `src/app/utils/` | Configuración global de Chart.js. |

### Servicios actuales

| Servicio | Métodos | Notas |
|----------|---------|-------|
| `ServicioUsuarios` | `obtenerUsuarios()`, `verificarCredenciales(codigo, contrasena)` | Mapea `id`→`codigo` y `password`→`contrasena`; `catchError` en `obtenerUsuarios()` |
| `ServicioDepartamentos` | `obtenerDepartamentos()` | JSON plano |
| `ServicioMedicos` | `obtenerMedicos()`, `obtenerMedico(id)` | `obtenerMedico` hace GET y `map(find)` |
| `ServicioPacientes` | `obtenerPacientes()`, `obtenerPaciente(id)` | `obtenerPaciente` hace GET y `map(find)` |
| `ServicioCitas` | `obtenerCitas()` | JSON plano |
| `ServicioTratamientos` | `obtenerTratamientos()` | JSON plano |

> Los servicios devuelven objetos planos del JSON tipados con las interfaces. Las clases de modelo existen para la lógica de negocio y se usarán al implementar el CRUD.

---

## 3. Rutas de la aplicación (`src/app/app.routes.ts`)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PaginaLogin },
  { path: 'dashboard', component: PaginaDashboard, canMatch: [SesionGuard] },
  { path: 'pacientes', component: PaginaPacientes, canMatch: [SesionGuard] },
  { path: 'pacientes/:id', component: PaginaPacienteDetalle, canMatch: [SesionGuard] },
  { path: 'doctores', component: PaginaDoctores, canMatch: [SesionGuard] },
  { path: 'doctores/:id', component: PaginaMedicoDetalle, canMatch: [SesionGuard] },
  { path: '**', redirectTo: '/login' }
];
```

- **Rutas con parámetro:** `/pacientes/:id` y `/doctores/:id`.
- **Protección:** `SesionGuard` (`CanMatchFn`) comprueba `sessionStorage.getItem('usuario')`.
- **Pendientes:** `/registro`, `/citas` y `/tratamientos`. El comodín redirige a `/login`.
- **Rol `admin`:** no implementado.

---

## 4. Flujo de navegación actual

1. Usuario llega a `/login`.
2. Si ya hay sesión en `sessionStorage`, el login redirige a `/dashboard`.
3. Tras autenticarse, `setTimeout` de 500 ms y redirección a `/dashboard`.
4. Desde el menú horizontal navega a Dashboard, Pacientes, Doctores, Citas o Tratamientos.
   - Citas y Tratamientos todavía no tienen ruta: el comodín redirige a `/login`.
5. Desde el listado de pacientes/doctores, clic en una fila → ficha `/pacientes/:id` o `/doctores/:id`.
6. En la ficha, botón **Volver** → `Router.navigate(['/pacientes'])` o `['/doctores']`.
7. **Salir** desde el menú → limpia `sessionStorage` y navega a `/login`.
8. El enlace **Regístrate** del login todavía es inerte (no hay ruta ni `RouterLink` importado).

---

## 5. Persistencia

| Momento | Qué se hace |
|---------|-------------|
| Carga inicial | `HttpClient.get` de `/json/*.json` → arrays de objetos planos en memoria. |
| Sesión de usuario | `sessionStorage.setItem('usuario', ...)` tras login; `removeItem` al salir. |
| CRUD | ⏳ Pendiente. Se prevé `localStorage`/`sessionStorage` tras cada alta, edición o eliminación. |
| Cookies | ❌ No se usan todavía. |

---

## 6. Decisiones de arquitectura

- **Standalone components** en toda la app; sin `NgModule`.
- **`@Service()` + `inject()`** en servicios y componentes (estilo Angular 22).
- **Observables** para todas las llamadas HTTP; sin Promesas en los servicios.
- **Signals** para el estado de las páginas (listas, filtros, carga, sesión).
- **Servicios finos:** devuelven datos; la búsqueda por id se resuelve con `map(find)` en el servicio.
- **Fichas enrutadas:** `/pacientes/:id` y `/doctores/:id` sustituyen al detalle embebido en el listado.
- **Menú horizontal compartido** (`app-menu-simple`) en todas las páginas salvo login; sin sidebar.
- **Chart.js + ng2-charts** con `responsive: false`, `maintainAspectRatio: false` y altura fija para evitar redimensionados infinitos.
- **Sin SnackBar:** los errores se muestran inline.
