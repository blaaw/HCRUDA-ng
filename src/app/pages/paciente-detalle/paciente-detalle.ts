import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuSimpleComponent } from '../../components/menu-simple/menu-simple';
import { ServicioPacientes } from '../../services/servicio-pacientes.service';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-detalle',
  standalone: true,
  imports: [CommonModule, MenuSimpleComponent],
  templateUrl: './paciente-detalle.html',
  styleUrl: './paciente-detalle.css'
})
export class PaginaPacienteDetalle implements OnInit {
  paciente?: Paciente;
  cargando = true;

  private route = inject(ActivatedRoute);
  private servicioPacientes = inject(ServicioPacientes);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe(() => this.cargarPaciente());
  }

  cargarPaciente(): void {
    const idPaciente = this.route.snapshot.paramMap.get('id');
    if (idPaciente) {
      this.servicioPacientes.obtenerPaciente(idPaciente).subscribe(paciente => {
        this.paciente = paciente;
        this.cargando = false;
      });
    } else {
      this.cargando = false;
    }
  }

  volver(): void {
    this.router.navigate(['/pacientes']);
  }
}
