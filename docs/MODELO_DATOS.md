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

Cada entidad se define como una `interface` en `src/app/models/`. Ejemplo de convención:

```typescript
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

export interface Usuario {
  id: string;
  nombre: string;
  rol: "medico" | "enfermero";
  password: string;
}
```

**Regla:** cada interfaz debe tener **≥ 5 campos**.

## 3. Clases de modelo (lógica de negocio)

Además de las interfaces, crear una **clase por entidad** en `src/app/models/` que encapsule campos, constructor, `toJSON()`, `validar()` y **al menos 3 métodos propios**. La clase no manipula el DOM, no llama a `HttpClient` ni a `sessionStorage`. Solo datos y lógica de negocio.

Ejemplo (`src/app/models/paciente.model.ts`):

```typescript
export class Paciente {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  tipo: "urgencia" | "planta" | "casa";

  constructor(id: string, nombre: string, apellidos: string,
              dni: string, telefono: string, tipo: "urgencia" | "planta" | "casa") {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = dni;
    this.telefono = telefono;
    this.tipo = tipo;
  }

  // Método 1: validación de campos del objeto
  validar(): boolean {
    return !!this.nombre && !!this.apellidos && !!this.dni && !!this.telefono;
  }

  // Método 2: conversión a objeto plano (JSON/storage)
  toJSON(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      apellidos: this.apellidos,
      dni: this.dni,
      telefono: this.telefono,
      tipo: this.tipo
    };
  }

  // Método 3: cambiar tipo de paciente
  cambiarTipo(nuevoTipo: "urgencia" | "planta" | "casa"): void {
    this.tipo = nuevoTipo;
  }

  // Método 4 (opcional, recomendado): resumen legible
  getResumen(): string {
    return `${this.nombre} ${this.apellidos} — ${this.tipo}`;
  }
}
```

> Requisito del curso: cada objeto debe tener constructor y **≥ 3 métodos adicionales**. Aplicar el mismo patrón a `Departamento`, `Medico`, `Cita`, `Tratamiento`, `Usuario` (con `autenticar(pwd)` para Usuario).

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
  { "id": "P001", "nombre": "Luis", "apellidos": "Martín",
    "dni": "11111111A", "telefono": "600111222", "tipo": "urgencia" }
]
```

## 6. Flujo de carga inicial (seed)

1. El servicio de datos hace `this.http.get<T[]>("/json/entidad.json")`.
2. Al recibir el array, se recorren los objetos y se crean instancias de la clase: `new Paciente(p.id, p.nombre, ...)`.
3. El array de instancias se mantiene en memoria (servicio) y se expone como `Observable`.
4. Tras cada operación CRUD, persistir en `sessionStorage`/`localStorage` con `JSON.stringify(array.map(o => o.toJSON()))`.
