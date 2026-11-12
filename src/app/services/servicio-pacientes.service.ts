import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

@Service()
export class ServicioPacientes {
  private urlJson = '/json/pacientes.json';
  private http = inject(HttpClient);

  obtenerPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.urlJson);
  }
}
