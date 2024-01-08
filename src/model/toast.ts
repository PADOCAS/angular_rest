export class Toast {
  classname?: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  delay: number | any;

  constructor(classname: any, titulo: any, mensagem: any, tipo: any, delay:any) {
    this.classname = classname;
    this.titulo = titulo;
    this.mensagem = mensagem;
    this.tipo = tipo;
    this.delay = delay;
  }
}
