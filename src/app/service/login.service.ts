import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../../model/usuario";
import {Constants} from "../../util/constants";
import {Router} from "@angular/router";
import {ToastService} from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router:Router, private toastService:ToastService) {
  }

  public login(usuario: Usuario) {
    console.log("Usuário: " + usuario.login);
    console.info(usuario); //Sem ser um JSON válido {login: '213123', senha: '12wewe'}
    console.info(JSON.stringify(usuario)); //Formato JSON válido! {"login":"213123","senha":"12wewe"}
    return this.http.post(Constants.baseLogin, JSON.stringify(usuario))
      .subscribe(data => {
          //Retorno HTTP:
          //Retira o Bearer e também o espaço, só queremos o token:
          // console.log(JSON.parse(JSON.stringify(data)).Authorization.replace("Bearer", "").replaceAll(" ", "").replaceAll("\\s", ""));
          var token: string = JSON.parse(JSON.stringify(data)).Authorization.replace("Bearer", "").replaceAll(" ", "").replaceAll("\\s", "");

          //armazena o valor da variável token no armazenamento local do navegador, pode ser reutilizado depois!
          localStorage.setItem("token", token);

          // console.log("Token: " + localStorage.getItem("token")); //Pegando o token armazenado no navegador
          //Redirecionando rota para o componente HomeComponent
          this.router.navigate(["home"]);
        },
        error => {
          // console.error(`Acesso Negado!\n\nExceção: ${error.error.excecao},\nCódigo: ${error.error.codigo},\nErro: ${error.error.erro}`);
          // alert(`Acesso Negado!\n\nExceção: ${error.error.excecao},\nCódigo: ${error.error.codigo},\nErro: ${error.error.erro}`);
          this.toastService.showErro("Acesso Negado!", "Exceção: ".concat(error.error.excecao).concat(",\nCódigo: ").concat(error.error.codigo).concat(",\nErro: ").concat(error.error.erro), null);
        });
  }
}
