import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Usuario} from "../../../model/usuario";
import {LoginService} from "../../service/login.service";
import {StatusBarService} from "../../service/status-bar.service";
import {ToastService} from "../../service/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  mostrarSenha = false;
  title = 'Angular-REST';
  //Vamos criar um objeto Usuario, como 2 atributos, similar ao que vamos enviar para a API depois!
  usuario: Usuario = {
    id: null,
    login: null,
    senha: null,
    nome: null,
    cep: null,
    bairro: null,
    localidade: null,
    logradouro: null,
    complemento: null,
    uf: null,
    listTelefone: null,
    listRole: null
  }

  constructor(private loginService: LoginService, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router) {
  }

  ngOnInit(): void {
    if (localStorage != null) {
      let token = localStorage.getItem("token");

      if (token != null
        && token.trim().length > 0) {
        //Caso exista o token já, vamos enviar para o Home:
        this.router.navigate(["home"]);
      }
    }
  }

  public loginEnterSenha() {
    if (this.validLogin()) {
      this.statusBarService.setShowStatusDialog(true);
      this.toastService.limparMensagens();

      setTimeout(() => {
        //StatusBarService já é fechado dentro do loginService após concluir a validação
        this.loginService.login(this.usuario);
      });
    }
  }

  public login() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      if (this.validLogin()) {
        // console.log("Teste Login: " + this.usuario.login + " Senha: " + this.usuario.senha);
        //StatusBarService já é fechado dentro do loginService após concluir a validação
        this.loginService.login(this.usuario);
      } else {
        this.statusBarService.setShowStatusDialog(false);
      }
    });
  }

  private validLogin(): boolean {
    if (this.usuario == null) {
      return false;
    }

    if (this.usuario.login === null
      || this.usuario.login.trim() === "") {
      return false;
    }

    if (this.usuario.senha === null
      || this.usuario.senha.trim() === "") {
      return false;
    }

    return true;
  }

  public mostrarOcultarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }
}
