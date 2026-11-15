import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-grafico-citas-estado',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './grafico-citas-estado.html',
  styleUrl: './grafico-citas-estado.css'
})
export class GraficoCitasEstadoComponent implements OnInit, OnChanges {
  @Input() citas: Cita[] = [];

  tipoGrafico: any = 'bar';
  datosGrafico: any = {
    labels: ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'],
    datasets: [{
      label: 'Citas',
      data: [0, 0, 0, 0],
      backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336'],
      borderColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336'],
      borderWidth: 1
    }]
  };

  opcionesGrafico: any = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Citas por Estado',
        font: { size: 18, weight: '600' }
      }
    },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 } },
      y: {}
    }
  };

  ngOnInit(): void {
    this.actualizarDatos();
  }

  ngOnChanges(): void {
    this.actualizarDatos();
  }

  actualizarDatos(): void {
    const estados = ['pendiente', 'confirmada', 'completada', 'cancelada'];
    const valores = estados.map(estado =>
      this.citas.filter(c => c.estado === estado).length
    );
    this.datosGrafico.datasets = [{
      label: 'Citas',
      data: valores,
      backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336'],
      borderColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336'],
      borderWidth: 1
    }];
  }
}
