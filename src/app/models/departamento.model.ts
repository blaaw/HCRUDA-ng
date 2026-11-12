export interface Departamento {
  id: string;
  nombre: string;
  descripcion: string;
}

export class DepartamentoClass implements Departamento {
  id: string;
  nombre: string;
  descripcion: string;

  constructor(id: string, nombre: string, descripcion: string) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  esValido(): boolean {
    return !!this.id && !!this.nombre && !!this.descripcion;
  }

  aObjetoPlano(): object {
    return { id: this.id, nombre: this.nombre, descripcion: this.descripcion };
  }

  resumen(): string {
    return this.nombre;
  }
}
