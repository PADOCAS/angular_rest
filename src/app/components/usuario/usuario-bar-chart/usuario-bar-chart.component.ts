import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../../menu/menu.component";
import Chart from "chart.js/auto";
import {UsuarioService} from "../../../service/usuario.service";
import {UsuarioGrafico} from "../../../../model/usuarioGrafico";
import {StatusBarService} from "../../../service/status-bar.service";
import {ToastService} from "../../../service/toast.service";

@Component({
  selector: 'app-usuario-bar-chart',
  standalone: true,
  imports: [
    MenuComponent
  ],
  templateUrl: './usuario-bar-chart.component.html',
  styleUrl: './usuario-bar-chart.component.css'
})
export class UsuarioBarChartComponent implements OnInit {
  chart: any;
  usuarioGrafico: UsuarioGrafico | null = null;

  constructor(private usuarioService: UsuarioService, private statusBarService: StatusBarService, private toastService: ToastService) {
  }

  ngOnInit() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();
    // Chama rotina para montar o gráfico:
    this.usuarioService.getDadosGraficoSalario().subscribe(
      data => {
        this.usuarioGrafico = data;
        this.createChart();
        this.statusBarService.setShowStatusDialog(false);
      }
    );
  }

  createChart() {
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        //labels: ['Pedro Alves', 'Jorge Panceta', 'Alváro Faria Lima', 'Clóvis Almeida'],
        //Devemos passar um formato json para as colunas com tudo que tem no nosso DTO - campo nome: (la foi armazenado com formato json mesmo aspas duplas)
        labels: JSON.parse('[' + this.usuarioGrafico?.nome + ']'),
        datasets: [
          {
            label: 'Salário dos Usuários',
            // data: [100.20, 5766.85, 12000.00, 1990.11],
            //Devemos passar um formato json para as colunas com tudo que tem no nosso DTO - campo salario:
            data: JSON.parse('[' + this.usuarioGrafico?.salario + ']'),
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
                return new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value);
              }
            }
          }
        }
      }
    });
  }
}
