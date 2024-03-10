import {Injectable} from '@angular/core';
import {ToastService} from "./toast.service";
import {ErrorMessage} from "../../model/errorMessage";

@Injectable({
  providedIn: 'root'
})
export class ValidatorUtilService {

  constructor(private toastService: ToastService) {
  }

  /**
   * Valida um período, pode retornar um erro direto ou preencher uma 'string' para voltar a tela
   * @param dataInicio
   * @param dataFim
   * @param errorMessage
   * @param labelPeriodo
   */
  public isValidPeriodo(dataInicio: string, dataFim: String, errorMessage: ErrorMessage | null, labelPeriodo: string | null): boolean {
    if (labelPeriodo === null) {
      labelPeriodo = "Período";
    }

    if (errorMessage !== null) {
      this.toastService.limparMensagens();
    }

    if (dataInicio !== null
      && dataFim !== null) {
      let partsDataInicio = dataInicio.split('/');
      let partsDataFim = dataFim.split('/');

      if (partsDataInicio.length === 3
        && partsDataFim.length === 3) {
        const dtInicio: Date = new Date(parseInt(partsDataInicio[2]), parseInt(partsDataInicio[1]), parseInt(partsDataInicio[0]));
        const dtFim: Date = new Date(parseInt(partsDataFim[2]), parseInt(partsDataFim[1]), parseInt(partsDataFim[0]));

        // Verifica se a data inicial é maior que a data final
        if (dtInicio !== null
          && dtFim !== null
          && dtInicio > dtFim) {
          if (errorMessage !== null
            && errorMessage.msg !== null) {
            if (errorMessage.msg.length > 0) {
              errorMessage.msg += "\n";
            }
            errorMessage.msg += "* " + labelPeriodo + " inválido, Data Início não deve ser posterior a Data Fim.";
          } else {
            this.toastService.showWarning(labelPeriodo + " inválido", "Data Início não deve ser posterior a Data Fim.", null);
          }

          return false;
        }
      }
    }

    return true;
  }

  /**
   * Valida Data, pode retornar a mensagem de erro direto ou preencher uma ‘string’ para retornar a tela
   *
   * @param data (‘string’)
   * @param errorMessage (caso quiser tratar o erro direto em sua tela, recebe um objeto com a referência original da msg), se passar nulo vai liberar um Toast para o usuário
   * @param labelData (Label especifico para data que está a validar)
   */
  public isValidDate(data: string, errorMessage: ErrorMessage | null, labelData: string | null) {
    if (labelData === null) {
      labelData = "Data inválida";
    }

    if (errorMessage !== null) {
      this.toastService.limparMensagens();
    }

    let parts = data.split('/');

    if (parts.length != 3) {
      if (errorMessage !== null
        && errorMessage.msg !== null) {
        if (errorMessage.msg.length > 0) {
          errorMessage.msg += "\n";
        }
        errorMessage.msg += "* " + labelData + " inválida, insira os dados no formato dd/MM/yyyy";
      } else {
        this.toastService.showWarning(labelData + " inválida", "Informe uma data válida!\nInsira os dados no formato dd/MM/yyyy", null);
      }
      return false;
    }

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      if (errorMessage !== null
        && errorMessage.msg !== null) {
        if (errorMessage.msg.length > 0) {
          errorMessage.msg += "\n";
        }
        errorMessage.msg += "* " + labelData + " inválida, insira os dados no formato dd/MM/yyyy";
      } else {
        this.toastService.showWarning(labelData + " inválida", "Informe uma data válida!\nInsira os dados no formato dd/MM/yyyy", null);
      }
      return false;
    }

    if (day < 1 || day > 31) {
      if (errorMessage !== null
        && errorMessage.msg !== null) {
        if (errorMessage.msg.length > 0) {
          errorMessage.msg += "\n";
        }
        errorMessage.msg += "* " + labelData + " inválida, dia informado inválido!";
      } else {
        this.toastService.showWarning(labelData + " inválida", "Dia inválido!", null);
      }
      return false;
    }

    if (month < 1 || month > 12) {
      if (errorMessage !== null
        && errorMessage.msg !== null) {
        if (errorMessage.msg.length > 0) {
          errorMessage.msg += "\n";
        }
        errorMessage.msg += "* " + labelData + " inválida, mês informado inválido!";
      } else {
        this.toastService.showWarning(labelData + " inválida", "Mês inválido!", null);
      }
      return false;
    }

    if (year < 1 || year > 9999) {
      if (errorMessage !== null
        && errorMessage.msg !== null) {
        if (errorMessage.msg.length > 0) {
          errorMessage.msg += "\n";
        }
        errorMessage.msg += "* " + labelData + " inválida, ano informado inválido!";
      } else {
        this.toastService.showWarning(labelData + " inválida", "Ano inválido!", null);
      }
      return false;
    }

    //Tratamento dos meses:
    const isLeapYear = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;

    if (month == 2 && isLeapYear) {
      if (day <= 29) {
        return true;
      } else {
        if (errorMessage !== null
          && errorMessage.msg !== null) {
          if (errorMessage.msg.length > 0) {
            errorMessage.msg += "\n";
          }
          errorMessage.msg += "* " + labelData + " inválida, dia inválido para o mês de fevereiro, nesse ano vai até o dia 29.";
        } else {
          this.toastService.showWarning(labelData + " inválida", "Mês de fevereiro, nesse ano vai até o dia 29.", null);
        }
        return false;
      }
    } else if (month == 2) {
      if (day <= 28) {
        return true;
      } else {
        if (errorMessage !== null
          && errorMessage.msg !== null) {
          if (errorMessage.msg.length > 0) {
            errorMessage.msg += "\n";
          }
          errorMessage.msg += "* " + labelData + " inválida, dia inválido para o mês de fevereiro, nesse ano vai até o dia 28.";
        } else {
          this.toastService.showWarning(labelData + " inválida", "Mês de fevereiro, nesse ano vai até o dia 28.", null);
        }
        return false;
      }
    } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      if (day <= 31) {
        return true;
      } else {
        if (errorMessage !== null
          && errorMessage.msg !== null) {
          if (errorMessage.msg.length > 0) {
            errorMessage.msg += "\n";
          }
          errorMessage.msg += "* " + labelData + " inválida, mês vai até o dia 31.";
        } else {
          this.toastService.showWarning(labelData + " inválida", "Mês vai até o dia 31.", null);
        }
        return false;
      }
    } else {
      if (day <= 30) {
        return true;
      } else {
        if (errorMessage !== null
          && errorMessage.msg !== null) {
          if (errorMessage.msg.length > 0) {
            errorMessage.msg += "\n";
          }
          errorMessage.msg += "* " + labelData + " inválida, mês vai até o dia 30.";
        } else {
          this.toastService.showWarning(labelData + " inválida", "Mês vai até o dia 30.", null);
        }
        return false;
      }
    }
  }
}
