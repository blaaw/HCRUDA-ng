# HCRUDA-ng — DISENO_UI.md (Guía de diseño y UI)

> Define las decisiones visuales y de librería de HCRUDA-ng. Reemplaza al design system neumórfico de HCRUDA-js.
> **Leer junto con `docs/ESTADO_ACTUAL.md` y `docs/PAGINAS_COMPONENTES.md`.**
>
> Estado: 16 de noviembre de 2026 · commit `fa8276e`.

---

## 1. Librería de UI (decidida)

**Angular Material** es la librería usada, porque:

- Es la librería oficial de Angular, mantenida por el equipo de Angular.
- Se integra nativamente con Angular CLI (`ng add @angular/material`).
- Componentes accesibles (WCAG AA, ARIA, navegación por teclado).
- Theming claro (solo tema claro, sin modo oscuro).
- Encaja con el requisito "más sencillo" que HCRUDA-js y con el stack Angular 22 (standalone components, signals).

Instalación ya realizada:

```bash
ng add @angular/material
npm install @angular/animations --legacy-peer-deps
```

Tema prebuilt importado en `src/styles.css`:

```css
@import '@angular/material/prebuilt-themes/indigo-pink.css';
```

Fuente de Material Icons importada en `src/index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

---

## 2. Reglas de diseño (no negociables)

| Regla | Valor |
|-------|-------|
| Tema | **Solo claro.** No inventar modo oscuro salvo petición explícita. |
| Fuentes | Sans ancha y legible (Lexend → Montserrat → Manrope). No Inter/Roboto/Arial como principal. |
| Colores | Grises azulados fríos + acento de Angular Material (indigo/pink por defecto). |
| Bordes | Cero bordes duros, cero negros, cero blancos puros. |
| Accesibilidad | WCAG AA (contraste, foco visible, táctil ≥ 44×44 px). |
| `:focus-visible` | Siempre visible; nunca `outline: none` sin sustituto. |
| Inputs | Usar componentes de Angular Material (`mat-form-field`, `matInput`, `mat-select`) consistentes en toda la app. |
| **NUNCA** | CSS/design-system neumórfico de HCRUDA-js, SnackBar, modo oscuro. |

---

## 3. Componentes de Angular Material usados

| Componente | Uso en HCRUDA-ng |
|------------|------------------|
| `mat-form-field` + `matInput` | Login y filtros de búsqueda |
| `mat-label` | Etiquetas de campos |
| `mat-select` + `mat-option` | Filtro por departamento |
| `mat-table` + `mat-header-cell` + `mat-cell` + `mat-row` | Listados de pacientes y doctores |
| `mat-card` | Tarjeta de login y tarjetas de resumen del dashboard |
| `mat-card-header` / `mat-card-title` / `mat-card-content` / `mat-card-actions` | Estructura de las tarjetas |
| `mat-button` / `mat-raised-button` / `mat-icon-button` | Acciones (entrar, ver todos, ver detalle, volver) |
| `mat-icon` | Iconografía (Material Icons) |
| `mat-progress-spinner` | No se usa; la carga se muestra con texto ("Cargando...") |

**Componentes que ya no se usan:**

- `mat-sidenav` / `mat-toolbar` / `mat-nav-list`: se sustituyeron por el menú horizontal `app-menu-simple`.
- `mat-badge`: se sustituyó por `<span class="etiqueta">` para simplificar.

---

## 4. Menú horizontal (`app-menu-simple`)

- Barra superior con logo, título y enlaces: Dashboard, Pacientes, Doctores, Citas, Tratamientos.
- Sin sidebar.
- Enlace activo resaltado con `RouterLinkActive` + clase `.activo`.
- Zona derecha con avatar (inicial del nombre), nombre, rol y botón **Salir** en rojo.
- Presente en todas las páginas salvo login.
- Responsive: los enlaces se envuelven en pantallas pequeñas.

---

## 5. Gráficos

- Librería: **Chart.js 4 + ng2-charts 11** (MIT, sin coste).
- Registro centralizado en `src/app/utils/chart-config.ts`:

```typescript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
```

- Importado una sola vez en `src/main.ts`.
- Gráficos actuales:
  - **Citas por estado**: barras horizontales (`indexAxis: 'y'`).
  - **Tratamientos por departamento**: tarta (`pie`).
- Configuración para evitar el crecimiento infinito:
  - `responsive: false`
  - `maintainAspectRatio: false`
  - Contenedor y canvas con altura fija en CSS.
  - `@ViewChild(BaseChartDirective)` + `chart.update()` en `ngOnChanges`.
- Responsive: en móvil los gráficos se apilan y mantienen una altura legible.

> **No tocar las proporciones ajustadas por el usuario**; cualquier cambio debe limitarse a la corrección móvil.

---

## 6. Qué NO se usa

- **NUNCA** el CSS/design-system neumórfico de HCRUDA-js.
- **NUNCA** valores hex ni sombras escritas a mano fuera de los tokens de la librería.
- **NUNCA** modo oscuro.
- **NUNCA** SnackBar (mensajes se muestran en pantalla directamente).
- **NUNCA** Inter/Roboto/Arial como fuente principal.
- **NUNCA** sidebar o `mat-sidenav` en la implementación actual.

---

## 7. Estado visual

- Login centrado con tarjeta Material, logo y errores inline.
- Dashboard con 2 tarjetas de resumen y 2 gráficos al 50 %.
- Listados con tabla Material, filtros arriba y etiquetas de estado.
- Fichas de detalle con tarjeta, foto (solo paciente) y botón Volver.
- Menú horizontal consistente en todas las páginas internas.
- Tema claro indigo-pink.
