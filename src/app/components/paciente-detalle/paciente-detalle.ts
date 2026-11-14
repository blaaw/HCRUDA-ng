import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioPacientes } from '../../services/servicio-pacientes.service';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-detalle',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './paciente-detalle.html',
  styleUrl: './paciente-detalle.css'
})
export class PacienteDetalleComponent implements OnInit {
  paciente?: Paciente;

  private route = inject(ActivatedRoute);
  private servicioPacientes = inject(ServicioPacientes);
  private router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPaciente(id);
    }
  }

  cargarPaciente(id: string): void {
    this.servicioPacientes.obtenerPacientes().subscribe(lista => {
      this.paciente = lista.find(p => p.id === id);
    });
  }

  volver(): void {
    this.router.navigate(['/pacientes']);
  }
}
