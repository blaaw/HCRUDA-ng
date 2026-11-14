import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-grafico-citas-estado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-citas-estado.html',
  styleUrl: './grafico-citas-estado.css'
})
export class GraficoCitasEstadoComponent implements OnInit, AfterViewInit {
  @Input() citas: Cita[] = [];

  chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        distributed: true,
        dataLabels: {
          position: 'bottom'
        }
      }
    },
    colors: ['#ff9800', '#2196f3', '#4caf50', '#f44336'],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#333'],
        fontSize: '14px',
        fontWeight: 600
      },
      formatter: function (val: any) {
        return val + ' citas';
      },
      offsetX: 0,
      offsetY: 0
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'],
      labels: {
        style: {
          colors: '#333',
          fontSize: '14px',
          fontWeight: 600
        }
      },
      title: {
        text: 'Estado de Cita',
        style: {
          color: '#333',
          fontSize: '16px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#333',
          fontSize: '14px',
          fontWeight: 600
        }
      },
      title: {
        text: 'Cantidad',
        style: {
          color: '#333',
          fontSize: '16px',
          fontWeight: 600
        }
      }
    },
    grid: {
      borderColor: '#e1e8ed',
      strokeDashArray: 4
    }
  };

  private chart: ApexCharts | null = null;

  ngOnInit(): void {
    this.chartOptions.series = [{
      name: 'Citas',
      data: this.contarCitasPorEstado()
    }];
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.updateSeries([{
        name: 'Citas',
        data: this.contarCitasPorEstado()
      }]);
    }
  }

  contarCitasPorEstado(): number[] {
    const estados = ['pendiente', 'confirmada', 'completada', 'cancelada'];
    return estados.map(estado =>
      this.citas.filter(c => c.estado === estado).length
    );
  }

  private renderChart(): void {
    const options = { ...this.chartOptions };
    const chart = new ApexCharts(document.querySelector('#grafico-citas-estado') as HTMLElement, options);
    chart.render();
    this.chart = chart;
  }
}
