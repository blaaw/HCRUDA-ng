import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita.model';

@Service()
export class ServicioCitas {
  private urlJson = '/json/citas.json';
  private http = inject(HttpClient);

  obtenerCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.urlJson);
  }
}
