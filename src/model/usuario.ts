export class Usuario {
  id: number | any;
  login: string | any;
  senha: string | any;
  nome: string | any;
  cep: string | any;
  bairro: string | any;
  localidade: string | any;
  logradouro: string | any;
  complemento: string | any;
  uf: string | any;

  constructor(id: any, login: any, senha: any, nome: any, cep: any, bairro: any, localidade: any, logradouro: any, complemento: any, uf: any) {
    this.id = id;
    this.login = login;
    this.senha = senha;
    this.nome = nome;
    this.cep = cep;
    this.bairro = bairro;
    this.localidade = localidade;
    this.logradouro = logradouro;
    this.complemento = complemento;
    this.uf = uf;
  }
}
