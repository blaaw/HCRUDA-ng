export interface Cita {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
}

export class CitaClass implements Cita {
  id: string;
  pacienteId: string;
  medicoId: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";

  constructor(id: string, pacienteId: string, medicoId: string, fecha: string, hora: string, motivo: string, estado: "pendiente" | "confirmada" | "completada" | "cancelada" = "pendiente") {
    this.id = id;
    this.pacienteId = pacienteId;
    this.medicoId = medicoId;
    this.fecha = fecha;
    this.hora = hora;
    this.motivo = motivo;
    this.estado = estado;
  }

  esValido(): boolean {
    return !!this.id && !!this.pacienteId && !!this.medicoId && !!this.fecha;
  }

  aObjetoPlano(): object {
    return {
      id: this.id,
      pacienteId: this.pacienteId,
      medicoId: this.medicoId,
      fecha: this.fecha,
      hora: this.hora,
      motivo: this.motivo,
      estado: this.estado
    };
  }

  cambiarEstado(nuevoEstado: "pendiente" | "confirmada" | "completada" | "cancelada"): void {
    this.estado = nuevoEstado;
  }
}
