import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaMedicosComponent } from '../../components/tabla-medicos/tabla-medicos';
import { MenuSimpleComponent } from '../../components/menu-simple/menu-simple';
import { ServicioMedicos } from '../../services/servicio-medicos.service';
import { ServicioDepartamentos } from '../../services/servicio-departamentos.service';
import { Medico } from '../../models/medico.model';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-doctores',
  standalone: true,
  imports: [CommonModule, TablaMedicosComponent, MenuSimpleComponent],
  templateUrl: './doctores.html',
  styleUrl: './doctores.css'
})
export class PaginaDoctores implements OnInit {
  listaMedicos = signal<Medico[]>([]);
  listaDepartamentos = signal<Departamento[]>([]);

  private servicioMedicos = inject(ServicioMedicos);
  private servicioDepartamentos = inject(ServicioDepartamentos);

  ngOnInit(): void {
    this.cargarMedicos();
    this.cargarDepartamentos();
  }

  cargarMedicos(): void {
    this.servicioMedicos.obtenerMedicos().subscribe(datos => this.listaMedicos.set(datos));
  }

  cargarDepartamentos(): void {
    this.servicioDepartamentos.obtenerDepartamentos().subscribe(datos => this.listaDepartamentos.set(datos));
  }
}
