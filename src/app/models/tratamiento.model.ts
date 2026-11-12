export interface Tratamiento {
  id: string;
  pacienteId: string;
  medicoId: string;
  descripcion: string;
  fechaInicio: string;
  estado: "activo" | "finalizado" | "suspendido";
}

export class TratamientoClass implements Tratamiento {
  id: string;
  pacienteId: string;
  medicoId: string;
  descripcion: string;
  fechaInicio: string;
  estado: "activo" | "finalizado" | "suspendido";

  constructor(id: string, pacienteId: string, medicoId: string, descripcion: string, fechaInicio: string, estado: "activo" | "finalizado" | "suspendido" = "activo") {
    this.id = id;
    this.pacienteId = pacienteId;
    this.medicoId = medicoId;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.estado = estado;
  }

  esValido(): boolean {
    return !!this.id && !!this.pacienteId && !!this.descripcion && !!this.fechaInicio;
  }

  aObjetoPlano(): object {
    return {
      id: this.id,
      pacienteId: this.pacienteId,
      medicoId: this.medicoId,
      descripcion: this.descripcion,
      fechaInicio: this.fechaInicio,
      estado: this.estado
    };
  }

  finalizar(): void {
    this.estado = "finalizado";
  }
}
