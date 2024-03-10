import {NgbDateAdapter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {Injectable} from "@angular/core";

/**
 * Este serviço trata de como a data é representada em ‘scripts’, ou seja, ngModel.
 */
@Injectable()
export class FormatDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '/';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? this.inputZeroEsquerdaDiaMes(date.day) + this.DELIMITER + this.inputZeroEsquerdaDiaMes(date.month) + this.DELIMITER + this.inputZeroEsquerdaAno(date.year) : null;
  }

  private inputZeroEsquerdaDiaMes(value: any) {
    if (value !== undefined
      && value !== null) {
      if (parseInt(value.toString()) <= 9) {
        return "0" + value;
      }
    }

    return value;
  }

  private inputZeroEsquerdaAno(value: any) {
    if (value !== undefined
      && value !== null) {
      switch (true) {
        case parseInt(value.toString()) <= 9:
          return '000' + value.toString();
        case parseInt(value.toString()) <= 99:
          return '00' + value.toString();
        case parseInt(value.toString()) <= 999:
          return "0" + value.toString();
        default:
          return value.toString(); // Caso o valor seja maior que 999, não adiciona zeros à esquerda.
      }
    }

    return value;
  }
}
