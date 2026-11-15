import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TablaPacientesComponent } from '../../components/tabla-pacientes/tabla-pacientes';
import { MenuSimpleComponent } from '../../components/menu-simple/menu-simple';
import { ServicioPacientes } from '../../services/servicio-pacientes.service';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, TablaPacientesComponent, MenuSimpleComponent],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class PaginaPacientes implements OnInit {
  listaPacientes = signal<Paciente[]>([]);

  private servicioPacientes = inject(ServicioPacientes);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.servicioPacientes.obtenerPacientes().subscribe(datos => this.listaPacientes.set(datos));
  }

  mostrarDetalle(idPaciente: string): void {
    this.router.navigate(['/pacientes', idPaciente]);
  }
}
