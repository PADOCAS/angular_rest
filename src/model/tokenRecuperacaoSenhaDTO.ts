export class TokenRecuperacaoSenhaDTO {
  token: string | any;
  email: string | any;
  senha: string | any;

  constructor(token: any, email: any, senha: any) {
    this.token = token;
    this.email = email;
    this.senha = senha;
  }
}
