import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../../model/usuario";
import {Observable} from "rxjs";
import {AppComponent} from "../app.component";
import {Constants} from "../../util/constants";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  public getListUsuarios():Observable<Usuario[]> {
    return this.http.get<Usuario[]>(Constants.baseUrl + "listall")
  }
}
