import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Service()
export class ServicioUsuarios {
  private urlJson = '/json/usuarios.json';
  private http = inject(HttpClient);

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<any[]>(this.urlJson).pipe(
      map(listaRaw => listaRaw.map(item => ({
        codigo: item.id,
        nombre: item.nombre,
        rol: item.rol,
        contrasena: item.password
      }))),
      catchError(() => of([]))
    );
  }

  verificarCredenciales(codigo: string, contrasena: string): Observable<Usuario | undefined> {
    return this.obtenerUsuarios().pipe(
      map(lista => lista.find(u => u.codigo === codigo && u.contrasena === contrasena))
    );
  }
}
