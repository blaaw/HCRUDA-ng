export interface Paciente {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  tipo: "urgencia" | "planta" | "casa";
  foto?: string;
}

export class PacienteClass implements Paciente {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  tipo: "urgencia" | "planta" | "casa";

  constructor(id: string, nombre: string, apellidos: string, dni: string, telefono: string, tipo: "urgencia" | "planta" | "casa") {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = dni;
    this.telefono = telefono;
    this.tipo = tipo;
  }

  esValido(): boolean {
    return !!this.id && !!this.nombre && !!this.dni && !!this.telefono;
  }

  aObjetoPlano(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      apellidos: this.apellidos,
      dni: this.dni,
      telefono: this.telefono,
      tipo: this.tipo
    };
  }

  cambiarTipo(nuevoTipo: "urgencia" | "planta" | "casa"): void {
    this.tipo = nuevoTipo;
  }
}
