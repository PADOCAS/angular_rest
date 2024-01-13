import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RouterGuard implements CanActivate {

  constructor(private router: Router) {
    //Está dando conflito de dependência caso utilize o UsuarioService aqui nessa classe, fica em circulo de dependência... como não vamos utilizar o UsuarioService aqui retirei o import
    //Melhor usar nossa classe aqui mesmo caso precise checar algo direto no banco coisa assim! Não vamos usar service importado aqui, a não ser um service próprio para o Guard!
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // console.log("Guardião sendo chamado!");
    //Nessa parte o Toast message não adianta, aqui ele ta no meio do processo de validação de mudança de rota, nenhuma iteração da tela vai funcionar!

    if (this.isUserAutenticado()) {
      //Caso o usuário estiver autenticado, liberamos a rota:
      return true;
    } else {
      //Não autenticado, mandamos para o login:
      return this.router.parseUrl('/login');
    }
  }

  /**
   * Método para acessar o token em memória
   */
  public isUserAutenticado() {
    if (localStorage != null) {
      let token = localStorage.getItem("token");

      if (token != null
        && token.trim().length > 0) {
        return true;
      }
    }

    return false;
  }
}
