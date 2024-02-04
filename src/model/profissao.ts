export class Profissao {
  id: number | any;
  descricao: string | any;
  idDescricaoFormatted: string | any;

  constructor(id: any, descricao: any, idDescricaoFormatted: any) {
    this.id = id;
    this.descricao = descricao;
    this.idDescricaoFormatted = idDescricaoFormatted;
  }
}
