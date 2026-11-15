# HCRUDA-ng — MODELO_DATOS.md (Modelo de datos, clases y relaciones)

> Modelo de datos de HCRUDA-ng adaptado a TypeScript/Angular. Define interfaces, clases de modelo con lógica de negocio, relaciones y datos de seed (JSON).
> **Leer junto con `docs/REQUISITOS.md` y `docs/ESTADO_ACTUAL.md`.**
>
> Estado: 16 de noviembre de 2026 · commit `fa8276e`.

---

## 1. Almacenamiento (sin base de datos real)

- No hay servidor SQL ni BD persistente en esta entrega.
- Los datos iniciales ("semilla") viven en **archivos JSON** en `public/json/` (servidos en la raíz del servidor, accesibles vía `/json/<archivo>.json`).
- Al cargar la app, esos JSON se leen mediante `HttpClient` y se manejan como **objetos planos tipados con las interfaces**.
- La sesión del usuario se guarda en `sessionStorage`. Los cambios del CRUD se guardarán en `localStorage`/`sessionStorage` cuando se implementen.
- **Estado actual:** los servicios devuelven los objetos planos del JSON; las clases de modelo existen con sus métodos, pero todavía no se instancian en el flujo de datos. Se aprovecharán al implementar el CRUD.

## 2. Interfaces TypeScript (modelo de datos)

Cada entidad se define como una `interface` en `src/app/models/`. Convención de nombres en español donde no sea de Angular:

```typescript
export interface Usuario {
  codigo: string;      // mapeado desde "id" del JSON
  nombre: string;
  rol: "medico" | "enfermero";
  contrasena: string;  // mapeado desde "password" del JSON
}

export interface Departamento {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Medico {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  departamentoId: string;
  especialidad: string;
}

export interface Paciente {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  tipo: "urgencia" | "planta" | "casa";
  foto?: string;       // URL opcional; si falta se usa pravatar
}

export interface Cita {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;   // ISO o "YYYY-MM-DD"
  hora: string;    // "HH:MM"
  motivo: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
}

export interface Tratamiento {
  id: string;
  pacienteId: string;
  medicoId: string;
  descripcion: string;
  fechaInicio: string;
  estado: "activo" | "finalizado" | "suspendido";
}
```

**Regla:** cada interfaz debe tener **≥ 5 campos**.

## 3. Clases de modelo (lógica de negocio)

Además de las interfaces, cada entidad tiene una **clase** en `src/app/models/` con constructor, `esValido()`, `aObjetoPlano()` y **al menos 1 método adicional** (total ≥ 3 métodos). La clase no manipula el DOM, no llama a `HttpClient` ni a `sessionStorage`.

### Métodos implementados

| Clase | Constructor | `esValido()` | `aObjetoPlano()` | Método propio |
|-------|-------------|--------------|------------------|---------------|
| `UsuarioClass` | ✅ | ✅ | ✅ | `verificarContrasena()` |
| `DepartamentoClass` | ✅ | ✅ | ✅ | `resumen()` |
| `MedicoClass` | ✅ | ✅ | ✅ | `cambiarEspecialidad()` |
| `PacienteClass` | ✅ | ✅ | ✅ | `cambiarTipo()` |
| `CitaClass` | ✅ | ✅ | ✅ | `cambiarEstado()` |
| `TratamientoClass` | ✅ | ✅ | ✅ | `finalizar()` |

Ejemplo (`src/app/models/usuario.model.ts`):

```typescript
export class UsuarioClass implements Usuario {
  codigo: string;
  nombre: string;
  rol: "medico" | "enfermero";
  contrasena: string;

  constructor(codigo: string, nombre: string, rol: "medico" | "enfermero", contrasena: string) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.rol = rol;
    this.contrasena = contrasena;
  }

  verificarContrasena(contrasenaIngresada: string): boolean {
    return this.contrasena === contrasenaIngresada;
  }

  aObjetoPlano(): object {
    return {
      codigo: this.codigo,
      nombre: this.nombre,
      rol: this.rol,
      contrasena: this.contrasena
    };
  }

  esValido(): boolean {
    return !!this.codigo && !!this.nombre && !!this.rol && !!this.contrasena;
  }
}
```

> Requisito del curso: cada objeto debe tener constructor y **≥ 3 métodos adicionales**. El patrón se aplica a las 6 entidades.

## 4. Relaciones (claves foráneas simuladas)

No hay SQL real; se simulan relaciones con **IDs**:

| Origen | Campo FK | Referencia |
|--------|----------|------------|
| Medico | `departamentoId` | Departamento.id |
| Cita | `pacienteId` | Paciente.id |
| Cita | `medicoId` | Medico.id |
| Tratamiento | `pacienteId` | Paciente.id |
| Tratamiento | `medicoId` | Medico.id |

Al pintar citas o tratamientos, buscar el nombre por ID:

```typescript
const medico = medicos.find(m => m.id === cita.medicoId);
// medico.nombre + " " + medico.apellidos
```

## 5. Archivos JSON de seed (`public/json/`)

| Archivo | Ruta de acceso | Contenido | Mínimo | Actual |
|---------|---------------|-----------|--------|--------|
| `departamentos.json` | `/json/departamentos.json` | Lista de departamentos | 3 items | 3 |
| `medicos.json` | `/json/medicos.json` | Médicos con `departamentoId` | 5 items | 5 |
| `pacientes.json` | `/json/pacientes.json` | Pacientes con `tipo` y `foto` opcional | 8 items | 8 |
| `citas.json` | `/json/citas.json` | Citas con `pacienteId` y `medicoId` | 6 items | 6 |
| `tratamientos.json` | `/json/tratamientos.json` | Tratamientos | 4 items | 4 |
| `usuarios.json` | `/json/usuarios.json` | Usuarios de login (rol médico/enfermero) | 2 items | 2 |

Formato: array de objetos planos (sin métodos):

```json
[
  { "id": "U001", "nombre": "Ana García López", "rol": "medico", "password": "clave123" }
]
```

Ejemplo de paciente con foto:

```json
{
  "id": "P001",
  "nombre": "Luis Martín",
  "apellidos": "Hernández",
  "dni": "11111111A",
  "telefono": "600111222",
  "tipo": "urgencia",
  "foto": "https://i.pravatar.cc/150?img=1"
}
```

> **Importante:** El JSON usa `id` y `password`. El servicio de usuarios mapea estos campos a `codigo` y `contrasena` del modelo de la app antes de usarlos.

## 6. Flujo de carga inicial (seed)

**Estado actual:**

1. El servicio hace `this.http.get<Entidad[]>("/json/entidad.json")`.
2. Devuelve el array de objetos planos tipado con la interfaz.
3. La página se suscribe y guarda el array en un `signal`.
4. La vista pinta los datos.
5. `ServicioUsuarios` mapea `id`→`codigo` y `password`→`contrasena`.

**Flujo previsto al implementar el CRUD:**

1. Leer de `localStorage` si existe; si no, cargar el JSON original.
2. Convertir cada objeto plano en una instancia de la clase (`new PacienteClass(...)`).
3. Mantener el array de instancias en memoria (servicio) y exponerlo como `Observable`.
4. Tras cada operación CRUD, persistir con `JSON.stringify(array.map(o => o.aObjetoPlano()))`.
5. Al recargar, reconstruir las instancias desde el storage.

## 7. Notas de implementación

- `Paciente` incluye `foto?: string`; la ficha usa `foto` o `https://i.pravatar.cc/150?u=<id>` como respaldo.
- `Medico` no tiene foto (decisión del usuario).
- Los servicios de citas, tratamientos y departamentos solo tienen `obtener...()`; no hay CRUD todavía.
- `ServicioMedicos.obtenerMedico(id)` y `ServicioPacientes.obtenerPaciente(id)` hacen la petición HTTP y el `find` dentro de `map`.
- `ServicioUsuarios.verificarCredenciales(codigo, contrasena)` hace la petición HTTP, busca por `id` + `password` y devuelve el usuario mapeado.
