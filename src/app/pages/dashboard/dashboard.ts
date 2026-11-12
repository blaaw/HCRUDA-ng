import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
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
    FormsModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class PaginaDashboard implements OnInit {
  usuarioConectado = signal<{ codigo: string; nombre: string; rol: string } | null>(null);

  listaPacientes = signal<Paciente[]>([]);
  listaMedicos = signal<Medico[]>([]);
  listaDepartamentos = signal<Departamento[]>([]);
  listaCitas = signal<Cita[]>([]);
  listaTratamientos = signal<Tratamiento[]>([]);

  filtroNombrePaciente = '';
  filtroNombreMedico = '';
  filtroDepartamentoMedico = '';

  get pacientesFiltrados() {
    return this.listaPacientes().filter(p =>
      this.filtroNombrePaciente === '' ||
      (p.nombre + ' ' + p.apellidos).toLowerCase().includes(this.filtroNombrePaciente.toLowerCase())
    );
  }

  get medicosFiltrados() {
    return this.listaMedicos().filter(m =>
      (this.filtroNombreMedico === '' ||
        (m.nombre + ' ' + m.apellidos).toLowerCase().includes(this.filtroNombreMedico.toLowerCase())) &&
      (this.filtroDepartamentoMedico === '' || m.departamentoId === this.filtroDepartamentoMedico)
    );
  }

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

  columnasPacientes = ['nombre', 'apellidos', 'dni', 'tipo', 'accion'];
  columnasMedicos = ['nombre', 'apellidos', 'especialidad', 'departamento', 'accion'];

  ngOnInit(): void {
    const sesionGuardada = sessionStorage.getItem('usuario');
    if (sesionGuardada) {
      this.usuarioConectado.set(JSON.parse(sesionGuardada));
    } else {
      this.router.navigate(['/login']);
    }

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

  obtenerNombreDepartamento(idDepartamento: string): string {
    const depto = this.listaDepartamentos().find(d => d.id === idDepartamento);
    return depto ? depto.nombre : '—';
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('usuario');
    this.usuarioConectado.set(null);
    this.router.navigate(['/login']);
  }

  irAPagina(ruta: string): void {
    this.router.navigate([ruta]);
  }

  verDetallePaciente(id: string): void {
    sessionStorage.setItem('pacienteSeleccionado', id);
    this.irAPagina('/pacientes');
  }

  rastrearPorId(_indice: number, elemento: any): string {
    return elemento.id;
  }
}
