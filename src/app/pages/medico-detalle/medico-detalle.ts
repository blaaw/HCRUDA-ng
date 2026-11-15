import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuSimpleComponent } from '../../components/menu-simple/menu-simple';
import { ServicioMedicos } from '../../services/servicio-medicos.service';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-medico-detalle',
  standalone: true,
  imports: [CommonModule, MenuSimpleComponent],
  templateUrl: './medico-detalle.html',
  styleUrl: './medico-detalle.css'
})
export class PaginaMedicoDetalle implements OnInit {
  medico = signal<Medico | undefined>(undefined);
  cargando = signal(true);

  private route = inject(ActivatedRoute);
  private servicioMedicos = inject(ServicioMedicos);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe(() => this.cargarMedico());
  }

  cargarMedico(): void {
    const idMedico = this.route.snapshot.paramMap.get('id');
    if (idMedico) {
      this.servicioMedicos.obtenerMedicos().subscribe(lista => {
        this.medico.set(lista.find(medico => medico.id === idMedico));
        this.cargando.set(false);
      });
    } else {
      this.cargando.set(false);
    }
  }

  volver(): void {
    this.router.navigate(['/doctores']);
  }
}
