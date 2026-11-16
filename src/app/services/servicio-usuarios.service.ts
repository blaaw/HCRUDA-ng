import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NuevoUsuario, Usuario, UsuarioClass } from '../models/usuario.model';

interface UsuarioJson {
  id: string;
  nombre: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  rol: "medico" | "enfermero";
  password: string;
}

@Service()
export class ServicioUsuarios {
  private urlJson = '/json/usuarios.json';
  private claveUsuariosGuardados = 'usuariosRegistrados';
  private http = inject(HttpClient);

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<UsuarioJson[]>(this.urlJson).pipe(
      map(listaRaw => [
        ...listaRaw.map(item => this.mapearUsuario(item)),
        ...this.obtenerUsuariosGuardados()
      ]),
      catchError(() => of(this.obtenerUsuariosGuardados()))
    );
  }

  verificarCredenciales(codigo: string, contrasena: string): Observable<Usuario | undefined> {
    return this.obtenerUsuarios().pipe(
      map(listaUsuarios =>
        listaUsuarios.find(usuario => usuario.codigo === codigo && usuario.contrasena === contrasena)
      )
    );
  }

  registrarUsuario(datos: NuevoUsuario): Observable<Usuario> {
    return this.obtenerUsuarios().pipe(
      map(listaUsuarios => {
        const dni = datos.dni.trim().toLowerCase();
        const email = datos.email.trim().toLowerCase();

        if (listaUsuarios.some(usuario => usuario.dni?.trim().toLowerCase() === dni)) {
          throw new Error('Ya existe un usuario con ese DNI.');
        }

        if (listaUsuarios.some(usuario => usuario.email?.trim().toLowerCase() === email)) {
          throw new Error('Ya existe un usuario con ese email.');
        }

        const nuevoUsuario = new UsuarioClass(
          this.generarCodigo(listaUsuarios),
          datos.nombre.trim(),
          datos.rol,
          datos.contrasena,
          datos.apellidos.trim(),
          datos.dni.trim().toUpperCase(),
          datos.email.trim().toLowerCase()
        );

        if (!nuevoUsuario.esValidoParaRegistro()) {
          throw new Error('Faltan datos obligatorios para registrar el usuario.');
        }

        const usuariosGuardados = [...this.obtenerUsuariosGuardados(), nuevoUsuario];
        localStorage.setItem(
          this.claveUsuariosGuardados,
          JSON.stringify(usuariosGuardados.map(usuario => usuario.aObjetoPlano()))
        );

        return nuevoUsuario;
      })
    );
  }

  private mapearUsuario(item: UsuarioJson): Usuario {
    return new UsuarioClass(
      item.id,
      item.nombre,
      item.rol,
      item.password,
      item.apellidos,
      item.dni,
      item.email
    );
  }

  private obtenerUsuariosGuardados(): UsuarioClass[] {
    try {
      const datosGuardados = localStorage.getItem(this.claveUsuariosGuardados);
      if (!datosGuardados) return [];

      const listaGuardada = JSON.parse(datosGuardados) as Usuario[];
      if (!Array.isArray(listaGuardada)) return [];

      return listaGuardada.map(usuario => new UsuarioClass(
        usuario.codigo,
        usuario.nombre,
        usuario.rol,
        usuario.contrasena,
        usuario.apellidos,
        usuario.dni,
        usuario.email
      ));
    } catch {
      return [];
    }
  }

  private generarCodigo(listaUsuarios: Usuario[]): string {
    const numeroMayor = listaUsuarios.reduce((maximo, usuario) => {
      const numero = Number(String(usuario.codigo ?? '').replace(/\D/g, ''));
      return Number.isNaN(numero) ? maximo : Math.max(maximo, numero);
    }, 0);

    return `U${String(numeroMayor + 1).padStart(3, '0')}`;
  }
}
