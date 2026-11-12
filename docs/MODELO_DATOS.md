# HCRUDA-ng — MODELO_DATOS.md (Modelo de datos, clases y relaciones)

> Modelo de datos de HCRUDA-ng adaptado a TypeScript/Angular. Define interfaces, clases de modelo con lógica de negocio, relaciones y datos de seed (JSON).
> **Leer junto con `docs/AGENTS.md` y `docs/REQUISITOS.md`.**

---

## 1. Almacenamiento (sin base de datos real)

- No hay servidor SQL ni BD persistente en esta entrega.
- Los datos iniciales ("semilla") viven en **archivos JSON** en `public/json/` (servidos en la raíz del servidor, accesibles vía `/json/<archivo>.json`).
- Al cargar la app, esos JSON se leen mediante `HttpClient` y se instancian como **objetos TypeScript** en memoria.
- La sesión del usuario y los cambios del CRUD se guardan en `sessionStorage` / `localStorage` (requisito de la entrega).
- Al recargar, se lee de `sessionStorage` si existe; si no, se vuelve a leer el JSON original.

## 2. Interfaces TypeScript (modelo de datos)

Cada entidad se define como una `interface` en `src/app/models/`. Ejemplo de convención (nombres en español donde no sea de Angular):

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

Además de las interfaces, crear una **clase por entidad** en `src/app/models/` que encapsule campos, constructor, `esValido()`, `aObjetoPlano()` y **al menos 1 método adicional** (total ≥ 3 métodos). La clase no manipula el DOM, no llama a `HttpClient` ni a `sessionStorage`. Solo datos y lógica de negocio.

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

  // Método 1: verificar contraseña
  verificarContrasena(contrasenaIngresada: string): boolean {
    return this.contrasena === contrasenaIngresada;
  }

  // Método 2: conversión a objeto plano (JSON/storage)
  aObjetoPlano(): object {
    return {
      codigo: this.codigo,
      nombre: this.nombre,
      rol: this.rol,
      contrasena: this.contrasena
    };
  }

  // Método 3: validar campos obligatorios
  esValido(): boolean {
    return !!this.codigo && !!this.nombre && !!this.rol && !!this.contrasena;
  }
}
```

> Requisito del curso: cada objeto debe tener constructor y **≥ 3 métodos adicionales**. Aplicar el mismo patrón a `Departamento`, `Medico`, `Paciente`, `Cita`, `Tratamiento`.

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

| Archivo | Ruta de acceso | Contenido | Mínimo |
|---------|---------------|-----------|--------|
| `departamentos.json` | `/json/departamentos.json` | Lista de departamentos | 3 items |
| `medicos.json` | `/json/medicos.json` | Médicos con `departamentoId` | 5 items |
| `pacientes.json` | `/json/pacientes.json` | Pacientes con `tipo` | 8 items |
| `citas.json` | `/json/citas.json` | Citas con `pacienteId` y `medicoId` | 6 items |
| `tratamientos.json` | `/json/tratamientos.json` | Tratamientos | 4 items |
| `usuarios.json` | `/json/usuarios.json` | Usuarios de login (rol médico/enfermero) | 2 items |

Formato: array de objetos planos (sin métodos):

```json
[
  { "id": "U001", "nombre": "Ana García López", "rol": "medico", "password": "clave123" }
]
```

> **Importante:** El JSON usa `id` y `password`. El servicio de usuarios debe mapear estos campos a `codigo` y `contrasena` del modelo de la app antes de usarlos.

## 6. Flujo de carga inicial (seed)

1. El servicio de datos hace `this.http.get<any[]>("/json/entidad.json")`.
2. Se mapean los campos del JSON al modelo de la app (ej. `id` → `codigo`, `password` → `contrasena`).
3. Se crean instancias de la clase: `new UsuarioClass(item.codigo, item.nombre, ...)`.
4. El array de instancias se mantiene en memoria (servicio) y se expone como `Observable`.
5. Tras cada operación CRUD, persistir en `sessionStorage`/`localStorage` con `JSON.stringify(array.map(o => o.aObjetoPlano()))`.
