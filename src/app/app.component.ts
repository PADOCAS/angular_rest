import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AppModule} from "./app.module";
import {LoginService} from "./service/login.service";

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
  usuario = {login: "", senha: ""};

  constructor(private loginService: LoginService) {}

  public login() {
    console.log("Teste Login: " + this.usuario.login + " Senha: " + this.usuario.senha);
    this.loginService.login(this.usuario);
  }
}
