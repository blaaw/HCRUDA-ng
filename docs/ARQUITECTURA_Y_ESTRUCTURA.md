# HCRUDA-ng — ARQUITECTURA_Y_ESTRUCTURA.md (Estructura y arquitectura)

> Define la estructura de carpetas, las capas de responsabilidad, las rutas y el flujo de navegación de HCRUDA-ng.
> **Leer junto con `docs/AGENTS.md`, `docs/MODELO_DATOS.md` y `docs/PAGINAS_COMPONENTES.md`.**

---

## 1. Estructura de carpetas (propuesta)

```
src/
  app/
    app.ts                 # Componente raíz (standalone, signal title)
    app.html               # Plantilla raíz: header, <router-outlet />
    app.css                # Estilos del root
    app.routes.ts          # Todas las rutas (Routes)
    app.config.ts          # proveedores globales (provideRouter, provideHttpClient)
    main.ts                # bootstrapApplication(App, appConfig)

    models/                # Interfaces + clases del modelo de datos (1 archivo por entidad)
      departamento.model.ts
      medico.model.ts
      paciente.model.ts
      cita.model.ts
      tratamiento.model.ts
      usuario.model.ts

    services/              # Servicios de datos (@Service + inject + Observable + HttpClient)
      gestionar-departamentos.service.ts
      gestionar-medicos.service.ts
      gestionar-pacientes.service.ts
      gestionar-citas.service.ts
      gestionar-tratamientos.service.ts
      gestionar-usuarios.service.ts   # login, registro, sesión
      gestionar-mensajes.service.ts   # servicio de mensajes (opcional, del manual)

    pages/                 # Páginas/vistas (standalone components)
      login/
      registro/
      dashboard/
      pacientes/
      doctores/
      citas/
      tratamientos/

    components/            # Componentes UI reutilizables (menú, tabla, ficha, detalle, badge)
      menu/
      tabla-entidad/
      ficha-entidad/
      detalle-entidad/

    guards/                # Guardias de ruta (sesión, rol admin) — opcional

  public/json/             # Datos de seed (departamentos, medicos, pacientes, citas, tratamientos, usuarios). Servidos en la raíz del servidor, accesibles vía /json/<archivo>.json
    ...

styles.css                 # Estilos globales de la aplicación
index.html                 # Punto de entrada
```

**Regla:** un archivo `.ts` por componente/servicio/modelo. Un archivo `.html` y un `.css` por componente (o estilos en línea si son mínimos). Nada de lógica de negocio dentro de las plantillas.

---

## 2. Capas y responsabilidades

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Entrada | `src/index.html`, `src/main.ts`, `src/app/app.*` | Bootstrap, raíz, rutas globales |
| Modelo | `src/app/models/` | Interfaces y clases con constructor, `toJSON()`, `validar()`, métodos propios. Sin DOM, sin HTTP. |
| Servicios | `src/app/services/` | Acceso a datos: `HttpClient` → `Observable`, carga de JSON, CRUD en memoria, persistencia en `sessionStorage`/`localStorage`, manejo de errores (`catchError`, `tap`, `of`). |
| Vistas | `src/app/pages/` | Páginas completas: formularios, tablas, filtros, botones CRUD, suscripción a servicios. |
| Componentes UI | `src/app/components/` | Componentes reutilizables standalone (menú, tabla, ficha, detalle, badges). |

Ningún archivo de `pages/` debe duplicar lógica que pertenezca a `services/` o a una clase de `models/`.

---

## 3. Rutas de la aplicación (`src/app/app.routes.ts`)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'registro', component: RegistroPage },
  { path: 'dashboard', component: DashboardPage, canMatch: [SesionGuard] },
  { path: 'pacientes', component: PacientesPage, canMatch: [SesionGuard] },
  { path: 'doctores', component: DoctoresPage, canMatch: [SesionGuard] },
  { path: 'citas', component: CitasPage, canMatch: [SesionGuard] },
  { path: 'tratamientos', component: TratamientosPage, canMatch: [SesionGuard] },
  { path: 'detalle/:tipo/:id', component: DetallePage }, // ruta con parámetros
  { path: '**', redirectTo: '/login' },
];
```

- Al menos una ruta con parámetros (detalle de entidad).
- `canMatch` / guard para proteger páginas que requieren sesión.
- Rol `admin` acceso a la gestión de todas las tablas.

---

## 4. Flujo de navegación recomendado

1. Usuario llega a `/login`.
2. Si no tiene cuenta, va a `/registro`, se registra y vuelve al login.
3. Tras iniciar sesión, llega a `/dashboard`.
4. Desde el dashboard navega al resto de páginas de gestión (`/pacientes`, `/doctores`, `/citas`, `/tratamientos`).
5. Desde cualquier página puede volver al dashboard o cerrar sesión (limpia `sessionStorage`).

---

## 5. Persistencia

| Momento | Qué se hace |
|---------|-------------|
| Carga inicial | `HttpClient.get` de `/json/*.json` → instancias de clase en memoria. |
| Tras cada CRUD | `sessionStorage.setItem("entidad", JSON.stringify(array))`. |
| Al recargar | Leer de `sessionStorage` si existe; si no, volver a cargar JSON original. |
| Sesión de usuario | `sessionStorage.setItem("usuario", ...)` tras login; limpiar al logout. |
