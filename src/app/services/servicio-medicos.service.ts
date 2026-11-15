import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.model';

@Service()
export class ServicioMedicos {
  private urlJson = '/json/medicos.json';
  private http = inject(HttpClient);

  obtenerMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.urlJson);
  }

  obtenerMedico(id: string): Observable<Medico | undefined> {
    return this.obtenerMedicos().pipe(
      map(lista => lista.find(medico => medico.id === id))
    );
  }
}
