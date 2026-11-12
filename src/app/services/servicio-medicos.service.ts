import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from '../models/medico.model';

@Service()
export class ServicioMedicos {
  private urlJson = '/json/medicos.json';
  private http = inject(HttpClient);

  obtenerMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.urlJson);
  }
}
