export class Usuario {
  id: number;
  login: string;
  senha: string;
  nome: string;
  cep: string;
  bairro: string;
  localidade: string;
  logradouro: string;
  complemento: string;
  uf: string;

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
