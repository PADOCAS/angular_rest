export class ViaCep {
  cep: string;
  bairro: string;
  localidade: string;
  logradouro: string;
  complemento: string;
  uf: string;

  constructor(cep: any, bairro: any, localidade: any, logradouro: any, complemento: any, uf: any) {
    this.cep = cep;
    this.bairro = bairro;
    this.localidade = localidade;
    this.logradouro = logradouro;
    this.complemento = complemento;
    this.uf = uf;
  }
}
