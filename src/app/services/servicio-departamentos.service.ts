import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from '../models/departamento.model';

@Service()
export class ServicioDepartamentos {
  private urlJson = '/json/departamentos.json';
  private http = inject(HttpClient);

  obtenerDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.urlJson);
  }
}
