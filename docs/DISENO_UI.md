# HCRUDA-ng — DISENO_UI.md (Guía de diseño y UI)

> Define las decisiones visuales y de librería de HCRUDA-ng. Reemplaza al design system neumorfico de HCRUDA-js.
> **Leer junto con `docs/AGENTS.md`.**

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
ng install @angular/animations --legacy-peer-deps
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
| **NUNCA** | CSS/design-system neumorfico de HCRUDA-js, SnackBar, modo oscuro. |

---

## 3. Componentes de Angular Material usados

| Componente | Uso en HCRUDA-ng |
|------------|------------------|
| `mat-form-field` + `matInput` | Formularios (login, registro, alta/editar entidades) |
| `mat-select` | Filtros (tipo, departamento, estado) y formularios |
| `mat-table` | Listados de pacientes, doctores, citas, tratamientos |
| `mat-button` / `mat-icon-button` | Acciones (guardar, eliminar, editar, cerrar sesión) |
| `mat-card` | Tarjetas de resumen, tarjeta de login |
| `mat-sidenav` | Menú lateral de navegación |
| `mat-toolbar` | Barra superior de páginas |
| `mat-icon` | Iconografía (Material Icons) |
| `mat-list` / `mat-nav-list` | Menús y listas de navegación |
| `mat-badge` | Estados (reemplazado por `<span class="etiqueta">` para simplicidad) |

> Nota: `mat-badge` se evitó por simplicidad; se usan `<span>` con clases CSS personalizadas para etiquetas de estado.

---

## 4. Qué NO se usa

- **NUNCA** el CSS/design-system neumorfico de HCRUDA-js.
- **NUNCA** valores hex ni sombras escritas a mano fuera de los tokens de la librería.
- **NUNCA** modo oscuro.
- **NUNCA** SnackBar (mensajes se muestran en pantalla directamente).
- **NUNCA** Inter/Roboto/Arial como fuente principal.
