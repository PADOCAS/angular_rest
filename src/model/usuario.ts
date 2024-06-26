import {Telefone} from "./telefone";
import {Role} from "./role";
import {Profissao} from "./profissao";

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
  dataNascimento: string | any;
  cpf: string | any;
  email: string | any;
  profissao: Profissao | any;
  salario: DoubleRange | any;
  listTelefone: Array<Telefone> | any;
  listRole: Array<Role> | any;

  constructor(id: any, login: any, senha: any, nome: any, cep: any, bairro: any, localidade: any, logradouro: any, complemento: any, uf: any, dataNascimento: any, cpf: any, email: any, profissao: any, salario: any, listTelefone: any, listRole: any) {
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
    this.dataNascimento = dataNascimento;
    this.cpf = cpf;
    this.email = email;
    this.profissao = profissao;
    this.salario = salario;
    this.listTelefone = listTelefone;
    this.listRole = listRole;
  }
}
