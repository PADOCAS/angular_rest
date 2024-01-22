import {Component} from '@angular/core';
import {Telefone} from "../../../../model/telefone";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StatusBarService} from "../../../service/status-bar.service";
import {ToastService} from "../../../service/toast.service";
import {FormsModule} from "@angular/forms";
import {MenuComponent} from "../../menu/menu.component";
import {NgIf} from "@angular/common";
import {Usuario} from "../../../../model/usuario";
import {UsuarioTelefoneService} from "../../../service/usuario-telefone.service";

@Component({
  selector: 'app-usuario-telefone-form',
  standalone: true,
  imports: [
    FormsModule,
    MenuComponent,
    NgIf,
    RouterLink
  ],
  templateUrl: './usuario-telefone-form.component.html',
  styleUrls: ['./usuario-telefone-form.component.css', './usuario-telefone-form.component.responsive.css']
})
export class UsuarioTelefoneFormComponent {
  telefone: Telefone = new Telefone(null, null, null);
  telefoneSelectVo: Telefone | any = null; //Guarda a instância que veio de edição
  usuario: Usuario | any;

  constructor(private routeActive: ActivatedRoute, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router, private usuarioTelefoneService: UsuarioTelefoneService) {
    // console.log(this.usuarioTelefoneService.getListTelefoneSelectVo().get(localStorage.getItem("token")));
    // console.log(this.usuarioTelefoneService.getListTelefoneEditJson().get(localStorage.getItem("token")));
    // console.log(JSON.parse(this.usuarioTelefoneService.getListTelefoneEditJson().get(localStorage.getItem("token"))));
    if (localStorage !== undefined
      && localStorage !== null
      && localStorage.getItem("token") !== undefined
      && localStorage.getItem("token") !== null) {
      //Dados para alteração Telefone (nova instância):
      if (this.usuarioTelefoneService.getListTelefoneEditJson() !== undefined
        && this.usuarioTelefoneService.getListTelefoneEditJson() !== null
        && this.usuarioTelefoneService.getListTelefoneEditJson().get(localStorage.getItem("token")) !== undefined
        && this.usuarioTelefoneService.getListTelefoneEditJson().get(localStorage.getItem("token")) !== null) {
        this.telefone = JSON.parse(this.usuarioTelefoneService.getListTelefoneEditJson().get(localStorage.getItem("token")));
      }

      //Referência real do objeto para alteração da lista:
      if (this.usuarioTelefoneService.getListTelefoneSelectVo() !== undefined
        && this.usuarioTelefoneService.getListTelefoneSelectVo() !== null
        && this.usuarioTelefoneService.getListTelefoneSelectVo().get(localStorage.getItem("token")) !== undefined
        && this.usuarioTelefoneService.getListTelefoneSelectVo().get(localStorage.getItem("token")) !== null) {
        this.telefoneSelectVo = this.usuarioTelefoneService.getListTelefoneSelectVo().get(localStorage.getItem("token"));
      }

      //Referência real do objeto usuário para manutenção
      if (this.usuarioTelefoneService.getListUsuario() !== undefined
        && this.usuarioTelefoneService.getListUsuario() !== null
        && this.usuarioTelefoneService.getListUsuario().get(localStorage.getItem("token")) !== undefined
        && this.usuarioTelefoneService.getListUsuario().get(localStorage.getItem("token")) !== null) {
        //Referência real do objeto usuário para manutenção
        this.usuario = this.usuarioTelefoneService.getListUsuario().get(localStorage.getItem("token"));
      }
    }
  }

  public novo(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      this.telefone = new Telefone(null, null, null);
      this.telefoneSelectVo = null;
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public cancelarEditarTelefone() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      //Caso for novo usuário (sem id ainda) envia como ZERO para não dar erro, não deixa NULL nessa referência de rota:
      this.router.navigate(["usuario-edit", this.usuario === undefined || this.usuario === null || this.usuario.id === undefined || this.usuario.id === null ? 0 : this.usuario.id]);
      if (localStorage !== undefined
        && localStorage !== null
        && localStorage.getItem("token") !== undefined
        && localStorage.getItem("token") !== null) {
        //Limpa dados do telefone no Service:
        this.usuarioTelefoneService.limpaTelefonesMapUsuarioToken(localStorage.getItem("token"));
      }

      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public salvarTelefone(): void {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    if (this.validarSalvar()) {
      setTimeout(() => {
        if (localStorage !== undefined
          && localStorage !== null
          && localStorage.getItem("token") !== undefined
          && localStorage.getItem("token") !== null
          && this.telefone !== null
          && this.usuario !== null) {
          if (this.telefoneSelectVo !== undefined
            && this.telefoneSelectVo !== null) {
            //Atualizando Registro:
            if (this.usuario.listTelefone !== null
              && this.usuario.listTelefone.length > 0) {
              let indexAlteracao = this.usuario.listTelefone.indexOf(this.telefoneSelectVo);
              if (indexAlteracao !== null
                && indexAlteracao !== -1) {
                this.usuario.listTelefone[indexAlteracao] = this.telefone;
                //Vamos comentar a mensagem de sucesso, pois só vai salvar junto do usuário (cadastro pai)
                // this.toastService.showSuccesso("Sucesso", "Telefone atualizado com sucesso!", 2000);
                //Caso for novo usuário (sem id ainda) envia como ZERO para não dar erro, não deixa NULL nessa referência de rota:
                this.router.navigate(["usuario-edit", this.usuario === undefined || this.usuario === null || this.usuario.id === undefined || this.usuario.id === null ? 0 : this.usuario.id]);
                //Limpa dados do telefone no Service:
                this.usuarioTelefoneService.limpaTelefonesMapUsuarioToken(localStorage.getItem("token"));
              }
            }
          } else {
            //Novo Registro:
            if (this.usuario.listTelefone !== null) {
              this.usuario.listTelefone.push(this.telefone);
              //Vamos comentar a mensagem de sucesso, pois só vai salvar junto do usuário (cadastro pai)
              // this.toastService.showSuccesso("Sucesso", "Telefone cadastrado com sucesso!", 2000);
              //Caso for novo usuário (sem id ainda) envia como ZERO para não dar erro, não deixa NULL nessa referência de rota:
              this.router.navigate(["usuario-edit", this.usuario === undefined || this.usuario === null || this.usuario.id === undefined || this.usuario.id === null ? 0 : this.usuario.id]);
              //Limpa dados do telefone no Service:
              this.usuarioTelefoneService.limpaTelefonesMapUsuarioToken(localStorage.getItem("token"));
            }
          }
        }

        this.statusBarService.setShowStatusDialog(false);
      });
    } else {
      this.statusBarService.setShowStatusDialog(false);
    }
  }

  private validarSalvar(): boolean {
    if (this.telefone != null) {
      //Tipo:
      if (this.telefone.tipo === null
        || this.telefone.tipo.trim() === "") {
        this.toastService.showWarning("Atenção", "* Tipo deve ser informado.", null);
        return false;
      }

      //Número:
      if (this.telefone.numero === null
        || this.telefone.numero.trim() === "") {
        this.toastService.showWarning("Atenção", "* Número deve ser informado.", null);
        return false;
      }
    }
    return true;
  }
}
