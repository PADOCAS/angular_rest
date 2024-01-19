import {Injectable} from '@angular/core';
import {Telefone} from "../../model/telefone";
import {Usuario} from "../../model/usuario";

/**
 * Service guarda informações de telefone/usuario por TOKEN de cada sessão de usuário nos MAPs, não correndo risco de atrapalhar programa multiusuários utilizando!
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioTelefoneService {
  private listTelefoneSelectVo: Map<string | any, Telefone | any> = new Map; //Objeto real, referência para manutenção
  private listTelefoneEditJson: Map<string | any, string | any> = new Map; //Objeto clone JSON para alteração
  private listUsuario: Map<string | any, Usuario | any> = new Map;

  constructor() {
  }


  /**
   * Objeto Real (selectVO) referência para alteração!
   */
  public getListTelefoneSelectVo(): Map<string | any, Telefone | any> {
    return this.listTelefoneSelectVo;
  }

  /**
   * Objeto clone, feito para dar manutenção antes de salvar!
   */
  public getListTelefoneEditJson(): Map<string | any, string | any> {
    return this.listTelefoneEditJson;
  }

  public getListUsuario(): Map<string | any, Usuario | any> {
    return this.listUsuario;
  }

  private limpaTelefoneEditJson(token: string | any) {
    if (token !== undefined
      && token !== null) {
      this.getListTelefoneEditJson().set(token, null);
    }
  }

  private limpaTelefoneSelectVo(token: string | any) {
    if (token !== undefined
      && token !== null) {
      this.getListTelefoneSelectVo().set(token, null);
    }
  }

  public limpaTelefonesMapUsuarioToken(token: string | any) {
    this.limpaTelefoneEditJson(token);
    this.limpaTelefoneSelectVo(token);
  }
}
