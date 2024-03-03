import {Profissao} from "./profissao";

export class UsuarioReport {
  dataNascimentoInicio: string | any;
  dataNascimentoFim: string | any;
  profissao: Profissao | any;

  constructor(dataNascimentoInicio: any, dataNascimentoFim: any, profissao: any) {
    this.dataNascimentoInicio = dataNascimentoInicio;
    this.dataNascimentoFim = dataNascimentoFim;
    this.profissao = profissao;
  }
}
