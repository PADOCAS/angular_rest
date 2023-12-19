import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Usuario} from "../../../model/usuario";
import {LoginService} from "../../service/login.service";

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
export class LoginComponent {
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
