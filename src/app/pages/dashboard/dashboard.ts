import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MenuSimpleComponent } from '../../components/menu-simple/menu-simple';
import { TablaPacientesComponent } from '../../components/tabla-pacientes/tabla-pacientes';
import { TablaMedicosComponent } from '../../components/tabla-medicos/tabla-medicos';
import { ServicioPacientes } from '../../services/servicio-pacientes.service';
import { ServicioMedicos } from '../../services/servicio-medicos.service';
import { ServicioDepartamentos } from '../../services/servicio-departamentos.service';
import { ServicioCitas } from '../../services/servicio-citas.service';
import { ServicioTratamientos } from '../../services/servicio-tratamientos.service';
import { Paciente } from '../../models/paciente.model';
import { Medico } from '../../models/medico.model';
import { Departamento } from '../../models/departamento.model';
import { Cita } from '../../models/cita.model';
import { Tratamiento } from '../../models/tratamiento.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MenuSimpleComponent,
    TablaPacientesComponent,
    TablaMedicosComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class PaginaDashboard implements OnInit {
  listaPacientes = signal<Paciente[]>([]);
  listaMedicos = signal<Medico[]>([]);
  listaDepartamentos = signal<Departamento[]>([]);
  listaCitas = signal<Cita[]>([]);
  listaTratamientos = signal<Tratamiento[]>([]);

  get cantidadPacientes() { return this.listaPacientes().length; }
  get cantidadMedicos() { return this.listaMedicos().length; }
  get cantidadCitas() { return this.listaCitas().length; }
  get citasPendientes() { return this.listaCitas().filter(c => c.estado === 'pendiente').length; }

  private servicioPacientes = inject(ServicioPacientes);
  private servicioMedicos = inject(ServicioMedicos);
  private servicioDepartamentos = inject(ServicioDepartamentos);
  private servicioCitas = inject(ServicioCitas);
  private servicioTratamientos = inject(ServicioTratamientos);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarInformacion();
  }

  cargarInformacion(): void {
    this.servicioPacientes.obtenerPacientes().subscribe(datos => this.listaPacientes.set(datos));
    this.servicioMedicos.obtenerMedicos().subscribe(datos => this.listaMedicos.set(datos));
    this.servicioDepartamentos.obtenerDepartamentos().subscribe(datos => this.listaDepartamentos.set(datos));
    this.servicioCitas.obtenerCitas().subscribe(datos => this.listaCitas.set(datos));
    this.servicioTratamientos.obtenerTratamientos().subscribe(datos => this.listaTratamientos.set(datos));
  }

  obtenerNombreMedico(idMedico: string): string {
    const medico = this.listaMedicos().find(m => m.id === idMedico);
    return medico ? medico.nombre + ' ' + medico.apellidos : '—';
  }

  irAPagina(ruta: string): void {
    this.router.navigate([ruta]);
  }

  verDetalleMedico(id: string): void {
    sessionStorage.setItem('medicoSeleccionado', id);
    this.irAPagina('/doctores');
  }
}
