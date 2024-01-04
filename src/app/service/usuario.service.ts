import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Usuario} from "../../model/usuario";
import {Observable} from "rxjs";
import {Constants} from "../../util/constants";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {
  }

  /**
   * Método responsável por listar todos os usuários cadastrados (../usuario/listall)
   *
   */
  public getListUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(Constants.baseUrl + "listall");
  }

  /**
   * Método responsável para chamar o delete Usuario da API (../usuario/{id})
   *
   * @param id (id do usuário -> number)
   */
  public deleteUsuario(id: number): Observable<any> {
    return this.http.delete(Constants.baseUrl + id, {responseType: "text"});
  }

  public getListUsuarioPorNome(nome:string):Observable<Usuario[]> {
    return this.http.get<Usuario[]>(Constants.baseUrl + "usuariopornome/" + nome);
  }

  public getUsuario(id:number):Observable<any> {
    //Método para retornar por ID está versionado na API, devemos pegar o que retorna todas as informações do VO!
    //Deve ser passado no header o parâmetro para API (X-API-Version=v1)
    const headers = {
      'X-API-Version': 'v1'
    };

    return this.http.get<Usuario>(Constants.baseUrl + id, {headers});
  }
}
