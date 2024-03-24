import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [
    MenuComponent
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {
  chart: any;

  constructor() {
  }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Pedro Alves', 'Jorge Panceta', 'Alváro Faria Lima', 'Clóvis Almeida'],
        datasets: [
          {
            label: 'Salário dos Usuários',
            data: [100.20, 5766.85, 12000.00, 1990.11],
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
          tooltip: {
            callbacks: {
              //Formatado bonito com BRL moeda ao dar tootip em uma barra:
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.formattedValue !== null) {
                  label += new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              //Formatado bonito com BRL moeda na legenda eixo y:
              callback: (value: any, index: any, values: any) => {
                const formattedValue = parseFloat(value).toFixed(2).replace('.', ',');
                return `R$ ${formattedValue}` as string;
              }
            }
          }
        }
      }
    });
  }
}
