import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MenuComponent} from "../../menu/menu.component";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {NgxCurrencyDirective} from "ngx-currency";
import {NgxMaskDirective, NgxMaskPipe} from "ngx-mask";
import {FormatData} from "../../../../util/FormatData";
import {FormatDateAdapter} from "../../../../util/FormatDateAdapter";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioService} from "../../../service/usuario.service";
import {StatusBarService} from "../../../service/status-bar.service";
import {ToastService} from "../../../service/toast.service";
import {ValidatorUtilService} from "../../../service/validator-util.service";
import {UsuarioReport} from "../../../../model/usuarioReport";
import {Profissao} from "../../../../model/profissao";
import {faCalendarAlt} from "@fortawesome/free-solid-svg-icons";
import {ErrorMessage} from "../../../../model/errorMessage";

@Component({
  selector: 'app-usuario-report',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    MenuComponent,
    NgForOf,
    NgIf,
    NgSelectModule,
    NgbInputDatepicker,
    NgxCurrencyDirective,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    CommonModule
  ],
  //Prove as classes para trabalhar com Formatação de Data pt-Br
  providers: [
    [{
      provide: NgbDateParserFormatter, useClass: FormatData
    }, {
      provide: NgbDateAdapter, useClass: FormatDateAdapter
    }],
  ],
  templateUrl: './usuario-report.component.html',
  styleUrls: ['./usuario-report.component.css', './usuario-report.component.responsive.css']
})
export class UsuarioReportComponent implements OnInit {
  usuarioReport: UsuarioReport = new UsuarioReport(null, null, null);
  listProfissao: Array<Profissao> | any = null;

  constructor(private routeActive: ActivatedRoute, private usuarioService: UsuarioService, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router, private validatorUtilService: ValidatorUtilService) {
  }

  ngOnInit(): void {
    this.usuarioService.getListProfissao().subscribe(
      data => {
        this.listProfissao = data;
        //Fecha o statusBar:
        this.statusBarService.setShowStatusDialog(false);
      });
  }

  public openModalReport() {
    let modalElement = document.getElementById('modalImpressaoPdf');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
    }
  }

  public closeModalReport() {
    let modalElement = document.getElementById('modalImpressaoPdf');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

  public gerarImpressao() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();
    if (this.validarImpressao()) {
      alert("GERAR IMPRESSÃO...");
      this.openModalReport();
      this.statusBarService.setShowStatusDialog(false);
    } else {
      this.statusBarService.setShowStatusDialog(false);
    }
  }

  private validarImpressao(): boolean {
    let msgErro: string = "";

    if (this.usuarioReport != null) {
      //Data Nascimento Inicial:
      let isInfoDataInicio: boolean = false;
      if (this.usuarioReport.dataNascimentoInicio !== undefined
        && this.usuarioReport.dataNascimentoInicio !== null
        && this.usuarioReport.dataNascimentoInicio.trim() !== "") {
        isInfoDataInicio = true;
        //Cria um Objeto e passa a msg dentro para tratar caso der erro, acessar a msg atualizada!
        //Caso mandar apenas a msg para o método será outra referência!
        let errorMsgAux: ErrorMessage = new ErrorMessage(msgErro);
        if (!this.validatorUtilService.isValidDate(this.usuarioReport.dataNascimentoInicio, errorMsgAux, "Data Nascimento Inicial")) {
          msgErro = errorMsgAux.msg;
        }
      }

      //Data Nascimento Final:
      let isInfoDataInicioFim: boolean = false;
      if (this.usuarioReport.dataNascimentoFim !== undefined
        && this.usuarioReport.dataNascimentoFim !== null
        && this.usuarioReport.dataNascimentoFim.trim() !== "") {
        isInfoDataInicioFim = true;
        //Cria um Objeto e passa a msg dentro para tratar caso der erro, acessar a msg atualizada!
        //Caso mandar apenas a msg para o método será outra referência!
        let errorMsgAux: ErrorMessage = new ErrorMessage(msgErro);
        if (!this.validatorUtilService.isValidDate(this.usuarioReport.dataNascimentoFim, errorMsgAux, "Data Nascimento Final")) {
          msgErro = errorMsgAux.msg;
        }
      }

      if (((isInfoDataInicio
          && !isInfoDataInicioFim)
        || (!isInfoDataInicio
          && isInfoDataInicioFim))) {
        if (msgErro.length > 0) {
          msgErro += "\n";
        }

        msgErro += "* Informe o período inicial e final ou então nenhum deles.";
      }
    }

    if (msgErro.length > 0) {
      this.toastService.showWarning("Atenção", msgErro, null);
      return false;
    }

    return true;
  }

  public validatorUtil(): ValidatorUtilService {
    return this.validatorUtilService;
  }

  protected readonly faCalendarAlt = faCalendarAlt;
}
