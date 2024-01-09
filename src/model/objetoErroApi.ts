export class ObjetoErroApi {
  excecao: string;
  erro: string;
  uri: string;
  codigo: string;
  data: string;


  constructor(excecao: any, erro: any, uri: any, codigo: any, data: any) {
    this.excecao = excecao;
    this.erro = erro;
    this.uri = uri;
    this.codigo = codigo;
    this.data = data;
  }
}
