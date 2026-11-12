# HCRUDA-ng — DISENO_UI.md (Guía de diseño y UI)

> Define las decisiones visuales y de librería de HCRUDA-ng. Reemplaza al design system neumorfico de HCRUDA-js.
> **Leer junto con `docs/AGENTS.md`.**

---

## 1. Librería de UI (decidida)

**Angular Material** es la librería recomendada y más idónea para este proyecto, porque:

- Es la librería oficial de Angular, mantenida por el equipo de Angular.
- Se integra nativamente con Angular CLI (`ng add @angular/material`).
- Componentes accesibles (WCAG AA, ARIA, navegación por teclado).
- Theming claro (solo tema claro, sin modo oscuro).
- Encaja con el requisito "más sencillo" que HCRUDA-js y con el stack Angular 22 (standalone components, signals).

Instalación:
```bash
ng add @angular/material
```

Si el usuario prefiere otra librería (Tailwind, PrimeNG, Bootstrap Angular, etc.), este documento se actualiza y se comunica al agente antes de escribir CSS/HTML.

---

## 2. Reglas de diseño (no negociables)

| Regla | Valor |
|-------|-------|
| Tema | **Solo claro.** No inventar modo oscuro salvo petición explícita. |
| Fuentes | Sans ancha y legible (Lexend → Montserrat → Manrope). No Inter/Roboto/Arial como principal. |
| Colores | Grises azulados fríos + un único acento cian (identidad HCRUDA). |
| Bordes | Cero bordes duros, cero negros, cero blancos puros. |
| Sombras | Luz siempre desde arriba-izquierda. Usar tokens, nunca hex ni sombras escritas a mano. |
| Accesibilidad | WCAG AA (contraste, foco visible, táctil ≥ 44×44 px). |
| `:focus-visible` | Siempre visible con anillo; nunca `outline: none` sin sustituto. |
| Inputs | Usar las clases/componentes de la librería de UI elegida (consistentes en toda la app). |

---

## 3. Componentes de UI a usar (Angular Material)

| Componente Angular Material | Uso en HCRUDA-ng |
|----------------------------|------------------|
| `mat-form-field` + `matInput` | Formularios (login, registro, alta/editar entidades) |
| `mat-select` | Filtros (tipo, departamento, estado) y formularios |
| `mat-table` | Listados de pacientes, doctores, citas, tratamientos |
| `mat-button` / `mat-icon-button` | Acciones (guardar, eliminar, editar, cerrar sesión) |
| `mat-card` | Modo ficha / detalle de entidades |
| `mat-badge` | Estados (tipo de paciente, estado de cita/tratamiento) |
| `mat-sidenav` | Menú lateral de navegación |
| `mat-toolbar` | Header de páginas |
| `mat-icon` | Iconografía |
| `mat-list` / `mat-menu` | Menús y listas de navegación |

---

## 4. Qué NO se usa

- **NUNCA** el CSS/design-system neumorfico de HCRUDA-js.
- **NUNCA** valores hex ni sombras escritas a mano fuera de los tokens de la librería.
- **NUNCA** modo oscuro.
- **NUNCA** Inter/Roboto/Arial como fuente principal.
