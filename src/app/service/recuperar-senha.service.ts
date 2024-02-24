import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Constants} from "../../util/constants";
import {TokenRecuperacaoSenhaDTO} from "../../model/tokenRecuperacaoSenhaDTO";

@Injectable({
  providedIn: 'root'
})
export class RecuperarSenhaService {

  constructor(private http: HttpClient) {
  }

  /**
   * Método para alteração da senha
   *
   * @param tokenRecuperacaoSenhaDto
   */
  public confirmAlteracaoSenha(tokenRecuperacaoSenhaDto: TokenRecuperacaoSenhaDTO): Observable<any> {
    return this.http.post<any>(Constants.baseUrlPath + "recuperarsenhauser/resetpassword", tokenRecuperacaoSenhaDto);
  }
}
