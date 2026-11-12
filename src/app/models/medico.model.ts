export interface Medico {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  departamentoId: string;
  especialidad: string;
}

export class MedicoClass implements Medico {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  departamentoId: string;
  especialidad: string;

  constructor(id: string, nombre: string, apellidos: string, dni: string, departamentoId: string, especialidad: string) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = dni;
    this.departamentoId = departamentoId;
    this.especialidad = especialidad;
  }

  esValido(): boolean {
    return !!this.id && !!this.nombre && !!this.dni && !!this.especialidad;
  }

  aObjetoPlano(): object {
    return {
      id: this.id,
      nombre: this.nombre,
      apellidos: this.apellidos,
      dni: this.dni,
      departamentoId: this.departamentoId,
      especialidad: this.especialidad
    };
  }

  cambiarEspecialidad(nuevaEspecialidad: string): void {
    this.especialidad = nuevaEspecialidad;
  }
}
