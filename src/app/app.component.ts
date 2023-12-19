import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {AppModule} from "./app.module";
import {LoginService} from "./service/login.service";
import {Usuario} from "../model/usuario";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular-REST';
  //Vamos criar um objeto Usuario, como 2 atributos, similar ao que vamos enviar para a API depois!
  usuario: Usuario = {
    login: "",
    senha: ""
  }

  constructor(private loginService: LoginService) {
  }

  public login() {
    if (this.validLogin()) {
      console.log("Teste Login: " + this.usuario.login + " Senha: " + this.usuario.senha);
      this.loginService.login(this.usuario);
    }
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
}
