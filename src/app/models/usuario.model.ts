export interface Usuario {
  codigo: string;
  nombre: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  rol: "medico" | "enfermero";
  contrasena: string;
}

export interface NuevoUsuario {
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  rol: "medico" | "enfermero";
  contrasena: string;
}

export class UsuarioClass implements Usuario {
  codigo: string;
  nombre: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  rol: "medico" | "enfermero";
  contrasena: string;

  constructor(
    codigo: string,
    nombre: string,
    rol: "medico" | "enfermero",
    contrasena: string,
    apellidos?: string,
    dni?: string,
    email?: string
  ) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = dni;
    this.email = email;
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
      apellidos: this.apellidos,
      dni: this.dni,
      email: this.email,
      rol: this.rol,
      contrasena: this.contrasena
    };
  }

  esValido(): boolean {
    return !!this.codigo && !!this.nombre && !!this.rol && !!this.contrasena;
  }

  esValidoParaRegistro(): boolean {
    return this.esValido() && !!this.apellidos && !!this.dni && !!this.email;
  }
}
