import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";

/**
 * Toda requisição nossa, vamos enviar o token válido nosso junto para a API REST aceitar!
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req != null
      && req.method !== 'OPTIONS') {
      if (localStorage != null
        && localStorage.getItem("token") != null) {
        //Pega o token da memória e envia na requisição também para API REST aceitar!
        let token = "Bearer " + localStorage.getItem("token");
        let tokenRequest = req.clone({
          headers: req.headers.set("Authorization", token)
        });
        // console.log("Token pego e enviado na requisição! " + token);
        //Vamos testar se um HttpResponse com status code de 200, 201 (sucesso) e da uma mensagem de sucesso!
        //Caso der algum erro (catchError) executa o método processaErro..
        //O jeito que está abaixo serve apenas para demonstração de como interceptar um erro, no nosso caso não usamos assim!
        //Caso nosso poderemos deixar só isso -> return next.handle(tokenRequest); o Erro já é tratado nas requisições Toast Message e as mensagens de sucesso também!
        return next.handle(tokenRequest).pipe(
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse
              && ((event.status === 200) || (event.status === 201))) {
              // console.log("Sucesso na operação!");
            }
          }), catchError(this.processaErro));
      }
    }

    // console.log("Nenhum token em memória para enviar na requisição ou é apenas uma requisição OPTIONS");
    //Caso não tenha token na memória segue apenas com a requisição normal, sem o token!
    //Vamos testar se um HttpResponse com status code de 200, 201 (sucesso) e da uma mensagem de sucesso!
    //Caso der algum erro (catchError) executa o método processaErro..
    //O jeito que está abaixo serve apenas para demonstração de como interceptar um erro, no nosso caso não usamos assim!
    //Caso nosso poderemos deixar só isso -> return next.handle(req); o Erro já é tratado nas requisições Toast Message e as mensagens de sucesso também!
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse
          && ((event.status === 200) || (event.status === 201))) {
          // console.log("Sucesso na operação!");
        }
      }), catchError(this.processaErro));
  }

  public processaErro(error: HttpErrorResponse) {
    //Mensagem padrão de erro, caso não for nada da API que estamos usando, nem veio as informações necessário que queremos.
    let errorMessage = "Erro desconhecido";

    if (error !== null
      && error.error !== null
      && error.error.codigo !== undefined
      && error.error.codigo !== null
      && error.error.erro !== undefined
      && error.error.erro !== null
      && error.error.excecao !== undefined
      && error.error.excecao !== null) {
      //Esse é o ObjetoErroApi que recebemos da API (tratamento genérico para os erros que ocorrem lá) -> Enviado por JSON!
      errorMessage = "Exceção: ".concat(error.error.excecao).concat("\nCódigo: ").concat(error.error.codigo).concat("\nErro: ").concat(error.error.erro);
    } else if (error !== null
      && error.error !== null
      && error.error.code !== undefined
      && error.error.code !== null
      && error.error.error !== undefined
      && error.error.error !== null) {
      //Esse é o erro padrão, não é do ObjetoErroApi
      errorMessage = "Código: " + error.error.code + "\nMensagem: " + error.error.error;
    }

    // window.alert(errorMessage);  //Caso quisesse retornar um alerta na tela para o usuário (não vamos utilizar isso, estamos rodando o toastMessage do bootstrap)
    //Retorna a excessão o próprio error encontrado, atráves dele nossas implementações que tratam erro disparam as mensagem (TOAST) por isso não colocamos o alert aqui, fizemos por toast!
    return throwError(error);
  }
}
