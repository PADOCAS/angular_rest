import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../../model/usuario";
import {Constants} from "../../util/constants";
import {Router} from "@angular/router";
import {ToastService} from "./toast.service";
import {StatusBarService} from "./status-bar.service";
import {Telefone} from "../../model/telefone";
import {ObjetoErroApi} from "../../model/objetoErroApi";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router, private statusBarService: StatusBarService, private toastService: ToastService) {
  }

  public login(usuario: Usuario) {
    // console.log("Usuário: " + usuario.login);
    // console.info(usuario); //Sem ser um JSON válido {login: '213123', senha: '12wewe'}
    // console.info(JSON.stringify(usuario)); //Formato JSON válido! {"login":"213123","senha":"12wewe"}
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
          this.statusBarService.setShowStatusDialog(false);
        },
        error => {
          // console.error(`Acesso Negado!\n\nExceção: ${error.error.excecao},\nCódigo: ${error.error.codigo},\nErro: ${error.error.erro}`);
          // alert(`Acesso Negado!\n\nExceção: ${error.error.excecao},\nCódigo: ${error.error.codigo},\nErro: ${error.error.erro}`);
          this.toastService.showErro("Acesso Negado!", error.message, null, error.error);
          this.statusBarService.setShowStatusDialog(false);
        });
  }

  /**
   * Método usado para recuperação de Senha do Usuário -> Envio por e-mail
   *
   * @param login Login do Usuário para recuperação de senha
   */
  public recuperarSenha(login: string) {
    let usuario = new Usuario(null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0.00, new Array<Telefone>, null);
    usuario.login = login;

    this.http.post<Usuario>(Constants.baseUrlPath + "recuperarsenhauser/", usuario)
      .subscribe(data => {
          //Retorno HTTP (Objeto Erro com uma resposta de erro(404) ou ok (200):
          let objetoErro: ObjetoErroApi = JSON.parse(JSON.stringify(data));
          console.log(objetoErro);
          this.statusBarService.setShowStatusDialog(false);
        },
        error => {
          this.toastService.showErro("Erro ao recuperar Login!", error.message, null, error.error);
          this.statusBarService.setShowStatusDialog(false);
        });
  }
}
