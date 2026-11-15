# HCRUDA-ng — BUENES_PRACTICAS_ANGULAR.md (Buenas prácticas del documento Word)

> Recopila las buenas prácticas y patrones de código recomendados en el manual `ANGULAR PARTE1.docx`, adaptados a Angular 22.2.1. **Seguir a rajatabla.**
> **Leer junto con `docs/AGENTS.md`.**

---

## 1. Arquitectura de componentes (standalone)

- Los componentes son **standalone** (`standalone: true` o inferido). No usar `NgModule` (en desuso).
- Cada componente tiene 3 archivos: `.ts` (clase), `.html` (vista), `.css` (estilos). Opcionalmente `.spec.ts` para pruebas (Vitest).
- Las dependencias (pipes, otros componentes, módulos) se declaran en el arreglo `imports` de `@Component`.

Ejemplo de componente standalone:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatToolbarModule, ...],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class PaginaDashboard implements OnInit { ... }
```

---

## 2. Estado reactivo: Signals y inject()

- Usar **`signal()`** para el estado reactivo del componente (ej. `usuarioConectado = signal<...>(null)`).
- Usar **`inject()`** para inyectar servicios en lugar de inyección por constructor (estilo Angular 22):

```typescript
export class PaginaLogin implements OnInit {
  private servicioUsuarios = inject(ServicioUsuarios);
  private router = inject(Router);
  ...
}
```

- No usar `@Injectable({ providedIn: 'root' })` (versión anterior a la 22 — **NO HACER, solo revisar**). En v22 los servicios usan `@Service()` e `inject()`.

---

## 3. Servicios de datos (@Service + Observable)

Según el manual, hay 3 opciones. **Usar la Opción 2 (Observables)**, que es la que se va a utilizar.

### Opción 1 (síncrona, sin AJAX) — NO usar para datos remotos.
### Opción 2 (Observables) — **LA QUE SE USA.**
### Opción 3 (Promesas) — solo si se justifica.

Ejemplo de servicio correcto (v22, simplificado):

```typescript
@Service()
export class ServicioUsuarios {
  private urlJson = '/json/usuarios.json';
  private http = inject(HttpClient);

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<any[]>(this.urlJson).pipe(
      map(listaRaw => listaRaw.map(item => ({
        codigo: item.id,
        nombre: item.nombre,
        rol: item.rol,
        contrasena: item.password
      }))),
      catchError(() => of([]))
    );
  }

  verificarCredenciales(codigo: string, contrasena: string): Observable<Usuario | undefined> {
    return this.http.get<any[]>(this.urlJson).pipe(
      map(listaRaw => {
        const item = listaRaw.find(usuario => usuario.id === codigo && usuario.password === contrasena);
        if (!item) return undefined;
        return {
          codigo: item.id,
          nombre: item.nombre,
          rol: item.rol,
          contrasena: item.password
        };
      })
    );
  }
}
```

- Inyectar `HttpClient` con `inject(HttpClient)`.
- Añadir `provideHttpClient()` en `src/app/app.config.ts`:

```typescript
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations() // necesario para Angular Material
  ]
};
```

- Manejar errores HTTP con `catchError` y `of()` (nunca dejar una petición sin manejo de error).
- **Estado actual:** solo `ServicioUsuarios` tiene `catchError`; pacientes, médicos, citas, tratamientos y departamentos aún no lo implementan (ver `docs/ESTADO_ACTUAL.md`).
- **NUNCA** usar SnackBar para mensajes de error; mostrar en pantalla directamente.

---

## 4. Enrutamiento (Routing)

- Todas las rutas en `src/app/app.routes.ts` con `Routes` (`{ path, component }`).
- `<router-outlet />` en la plantilla raíz para renderizar las vistas.
- Navegación por enlace: `routerLink="/pacientes"`.
- Navegación por código: `this.router.navigate(['/detalle', id])`.
- Rutas con parámetros: `{ path: 'detalle/:id', component: DetallePage }`.
- Leer parámetros con `ActivatedRoute` y `paramMap` (los parámetros son strings; convertir con `+` o `Number()`):

```typescript
const id = Number(this.route.snapshot.paramMap.get('id'));
```

- `Location` para `goBack()` (volver atrás).
- Ruta por defecto (redirectTo) al dashboard o al login.
- `CanMatchFn` para guardia de sesión (protege rutas que requieren login).

---

## 5. Formularios y two-way binding

- Usar **`FormsModule`** y two-way binding con `[(ngModel)]`.
- Importar `FormsModule` en el `imports` del componente que use `ngModel`.
- Validación de formularios con expresiones regulares (DNI, longitud de contraseña, campos obligatorios).
- Ejemplo:

```html
<input matInput name="codigo" [(ngModel)]="codigoUsuario" required placeholder="Ej: U001" />
```

---

## 6. Control flow en plantillas (Angular 17/20/22)

- Usar la sintaxis de bloque moderna. **Nunca** `*ngIf`, `*ngFor`, `*ngSwitch` (deprecadas).
- `@if / @else` para condicionales.
- `@for (item of list; track item.id)` para listas (obligatorio `track`).
- `@switch / @case / @default` para múltiples condiciones.

Ejemplo:

```html
@if (usuarioConectado()) {
  <div class="info-usuario">{{ usuarioConectado()?.nombre }}</div>
}
@for (paciente of pacientesFiltrados; track paciente.id) {
  <li>{{ paciente.nombre }}</li>
}
```

---

## 7. Pipes

- Las tuberías (`|`) dan formato a textos, monedas, fechas, etc.
- Toda pipe usada en una plantilla debe importarse en el `imports` del componente.
- Ejemplos: `UpperCasePipe`, `DatePipe`, `DecimalPipe`, `CurrencyPipe`.

---

## 8. Comunicación entre componentes

- **`@Input()`**: recibe datos de un componente padre.
- **`@Output()`**: emite eventos hacia el padre.
- **Servicios**: comunicación entre componentes no relacionados (estado compartido).
- **Signals**: para estado reactivo compartido (ej. contador de notificaciones).

---

## 9. Mensajes y notificaciones (patrón del manual)

- **NUNCA** usar `MatSnackBar` (redundante e innecesario).
- Mensajes de error se muestran directamente en el formulario (variable `mensajeError` en el template).
- Servicio de mensajes (`GestionarMensajes`) solo si se justifica (opcional).

---

## 10. Búsqueda con debounce (patrón del manual)

- Usar un `Subject<string>` para los términos de búsqueda.
- Aplicar operadores RxJS: `debounceTime(300)`, `distinctUntilChanged()`, `switchMap()`.
- Evitar demasiadas peticiones HTTP al escribir.
- En la plantilla, usar el pipe `async` para suscribirse al Observable automáticamente.

---

## 11. Build y despliegue

- `ng build` genera el código JavaScript para producción en la carpeta `dist/`.
- Copiar el contenido de `dist/` al directorio raíz del servidor (nginx, apache, etc.).
- Para desarrollo: `ng serve --open` (puerto 4200).

---

## 12. CORS (si se consume una API externa)

- Opción 1: proxy con `src/proxy.conf.json` y `ng serve --proxy-config proxy.conf.json`.
- Opción 2: configurar CORS en el servidor de backend.
- En producción, las URLs absolutas tipo `http://localhost:2525/heroes` deben dejarse como rutas relativas (`/heroes`).

---

## 13. Pruebas unitarias

- Este proyecto usa **Vitest** (no Karma/Jasmine como el original).
- Escribir pruebas para servicios y componentes críticos (modelos, validaciones, servicios de datos).
- Ejecutar con `ng test`.

---

## 14. Accesibilidad

- Tema claro únicamente (no modo oscuro).
- `:focus-visible` siempre visible; nunca `outline: none` sin sustituto.
- Contrastes WCAG AA para texto sobre superficies.
- Elementos táctiles mínimos 44×44 px.
- Angular Aria (directivas accesibles headless) para patrones de teclado, foco y ARIA cuando se construyan componentes UI propios.
