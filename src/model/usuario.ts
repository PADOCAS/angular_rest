export class Usuario {
  id: number;
  login: string;
  senha: string;
  nome: string;

  constructor(id: number, login: string, senha: string, nome: string) {
    this.id = id;
    this.login = login;
    this.senha = senha;
    this.nome = nome;
  }
}
