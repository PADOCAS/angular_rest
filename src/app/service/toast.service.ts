import {Injectable} from '@angular/core';
import {Toast} from "../../model/toast";
import {ObjetoErroApi} from "../../model/objetoErroApi";


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  constructor() {
  }

  private show(toast: Toast) {
    this.toasts.push(toast);
  }

  public remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  public showInfo(titulo: string | null, mensagem: string, delay: any) {
    this.show({
      classname: 'bg-info text-light',
      titulo: titulo === null ? "Info" : titulo,
      mensagem: mensagem,
      tipo: "info",
      delay: delay
    });
  }

  public showSuccesso(titulo: string | null, mensagem: string, delay: any) {
    this.show({
      classname: 'bg-success text-light',
      titulo: titulo === null ? "Sucesso" : titulo,
      mensagem: mensagem,
      tipo: "sucesso",
      delay: delay
    });
  }

  public showWarning(titulo: string | null, mensagem: string, delay: any) {
    this.show({
      classname: 'bg-warning text-light',
      titulo: titulo === null ? "Atenção" : titulo,
      mensagem: mensagem,
      tipo: "warning",
      delay: delay
    });
  }

  public showErro(titulo: string | null, mensagem: string, delay: any, objetoErroApi: ObjetoErroApi | null) {
    let message = "";

    if (objetoErroApi !== null
      && objetoErroApi.codigo !== undefined
      && objetoErroApi.codigo !== null
      && objetoErroApi.erro !== undefined
      && objetoErroApi.erro !== null) {
      message = "Exceção: ".concat(objetoErroApi.excecao).concat(", \nCódigo: ").concat(objetoErroApi.codigo).concat(", \nErro: ").concat(objetoErroApi.erro);
    } else {
      message = mensagem;
    }

    this.show({
      classname: 'bg-danger text-light',
      titulo: titulo === null ? "Erro" : titulo,
      mensagem: message,
      tipo: "erro",
      delay: delay
    });
  }

  public limparMensagens() {
    this.toasts.splice(0, this.toasts.length);
  }
}
