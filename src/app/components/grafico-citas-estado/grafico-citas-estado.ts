import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-grafico-citas-estado',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './grafico-citas-estado.html',
  styleUrl: './grafico-citas-estado.css'
})
export class GraficoCitasEstadoComponent {
  @Input() citas: Cita[] = [];

  vista: [number, number] = [500, 350];

  get datosGrafico() {
    const estados = ['pendiente', 'confirmada', 'completada', 'cancelada'];
    return estados.map(estado => ({
      nombre: this.capitalizar(estado),
      valor: this.citas.filter(c => c.estado === estado).length
    }));
  }

  capitalizar(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  seleccionar(evento: any): void {
    console.log('Elemento seleccionado:', evento);
  }
}
