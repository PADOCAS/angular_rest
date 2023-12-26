import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * Toda requisição nossa, vamos enviar o token válido nosso junto para a API REST aceitar!
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService  implements HttpInterceptor {

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
        console.log("Token pego e enviado na requisição! " + token);
        return next.handle(tokenRequest);
      }
    }

    console.log("Nenhum token em memória para enviar na requisição ou é apenas uma requisição OPTIONS");
    //Caso não tenha token na memória segue apenas com a requisição normal, sem o token!
    return next.handle(req);
  }
}
