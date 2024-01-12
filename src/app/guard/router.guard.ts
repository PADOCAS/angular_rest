import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RouterGuard implements CanActivate {

  constructor(private router: Router) {
    //Está dando conflito de dependência caso utilize o UsuarioService aqui nessa classe, fica em circulo de dependência... como não vamos utilizar o UsuarioService aqui retirei o import
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("Guardião sendo chamado!");

    if (this.isUserAutenticado()) {
      //Caso o usuário estiver autenticado, liberamos a rota:
      return true;
    } else {
      //Não autenticado, mandamos para o login:
      return this.router.parseUrl('/login');
    }

    return true;
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
