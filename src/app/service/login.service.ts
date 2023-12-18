import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../../model/usuario";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(usuario:Usuario) {
    console.log("Usuário: " + usuario.login);
  }
}
