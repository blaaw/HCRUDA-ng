# HCRUDA-ng — ARQUITECTURA_Y_ESTRUCTURA.md (Estructura y arquitectura)

> Define la estructura de carpetas, las capas de responsabilidad, las rutas y el flujo de navegación de HCRUDA-ng.
> **Leer junto con `docs/AGENTS.md`, `docs/MODELO_DATOS.md` y `docs/PAGINAS_COMPONENTES.md`.**

---

## 1. Estructura de carpetas (propuesta)

```
src/
  app/
    app.ts                 # Componente raíz (standalone, signal title)
    app.html               # Plantilla raíz: solo <router-outlet />
    app.css                # Estilos del root
    app.routes.ts          # Todas las rutas (Routes)
    app.config.ts          # proveedores globales (provideRouter, provideHttpClient, provideAnimations)
    main.ts                # bootstrapApplication(App, appConfig)

    models/                # Interfaces + clases del modelo de datos (1 archivo por entidad)
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

    pages/                 # Páginas/vistas (standalone components)
      login/
      dashboard/
      registro/            # pendiente
      pacientes/           # pendiente
      doctores/            # pendiente
      citas/               # pendiente
      tratamientos/        # pendiente

  public/
    json/                  # Datos de seed. Servidos en la raíz del servidor, accesibles vía /json/<archivo>.json
    favicon.ico

styles.css                 # Estilos globales (tema Angular Material indigo-pink)
index.html                 # Punto de entrada (link a Material Icons)
```

**Regla:** un archivo `.ts` por componente/servicio/modelo. Un archivo `.html` y un `.css` por componente (o estilos en línea si son mínimos). Nada de lógica de negocio dentro de las plantillas.

---

## 2. Capas y responsabilidades

| Capa | Carpeta | Responsabilidad |
|------|---------|-----------------|
| Entrada | `src/index.html`, `src/main.ts`, `src/app/app.*` | Bootstrap, raíz, rutas globales |
| Modelo | `src/app/models/` | Interfaces y clases con constructor, `esValido()`, `aObjetoPlano()`, métodos propios. Sin DOM, sin HTTP. |
| Servicios | `src/app/services/` | Acceso a datos: `HttpClient` → `Observable`, carga de JSON, mapeo de campos, manejo de errores (`catchError`, `of`). |
| Vistas | `src/app/pages/` | Páginas completas: formularios, tablas, filtros, botones CRUD, suscripción a servicios. |

Ningún archivo de `pages/` debe duplicar lógica que pertenezca a `services/` o a una clase de `models/`.

---

## 3. Rutas de la aplicación (`src/app/app.routes.ts`)

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PaginaLogin },
  {
    path: 'dashboard',
    component: PaginaDashboard,
    canMatch: [SesionGuard]
  },
  { path: '**', redirectTo: '/login' }
];
```

- Al menos una ruta con parámetros (detalle de entidad, pendiente).
- `canMatch` / guard para proteger páginas que requieren sesión.
- Rol `admin` acceso a la gestión de todas las tablas (pendiente).

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
