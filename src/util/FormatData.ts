import {Injectable} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class FormatData extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  /**
   * Pega o array do objeto que vem no ng datapicker e converte como queremos na tela:
   *
   * @param date
   */
  format(date: NgbDateStruct | null): string {
    //Recebe a data e formata ele no nosso padrão PT (dd/MM/yyyy)
    return date ? this.inputZeroEsquerdaDiaMes(date.day) + this.DELIMITER + this.inputZeroEsquerdaDiaMes(date.month) + this.DELIMITER + this.inputZeroEsquerdaAno(date.year) : '';
  }

  /**
   * Pega os dados do componente e transforma no array que vem do ng datapicker
   * @param value
   */
  parse(value: string): NgbDateStruct | null {
    //Recebe o valor do componente e monta em array separado por '/'
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

  // /**
  //  * Método para conversão e gravação da data
  //  * @param date
  //  */
  // toModel(date: NgbDateStruct | null): string | null {
  //   return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  // }

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
