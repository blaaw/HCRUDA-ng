import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tratamiento } from '../models/tratamiento.model';

@Service()
export class ServicioTratamientos {
  private urlJson = '/json/tratamientos.json';
  private http = inject(HttpClient);

  obtenerTratamientos(): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(this.urlJson);
  }
}
