import {Component} from '@angular/core';
import {Telefone} from "../../../../model/telefone";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StatusBarService} from "../../../service/status-bar.service";
import {ToastService} from "../../../service/toast.service";
import {FormsModule} from "@angular/forms";
import {MenuComponent} from "../../menu/menu.component";
import {NgIf} from "@angular/common";
import {Usuario} from "../../../../model/usuario";

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
  styleUrl: './usuario-telefone-form.component.css'
})
export class UsuarioTelefoneFormComponent {
  telefone: Telefone = new Telefone(null, null, null);
  usuario: Usuario | any;

  constructor(private routeActive: ActivatedRoute, private statusBarService: StatusBarService, private toastService: ToastService, private router: Router) {
    if (this.routeActive !== undefined
      && this.routeActive !== null
      && this.routeActive.snapshot !== null
      && this.routeActive.snapshot.params !== null) {
      //Carrega Telefone:
      if (this.routeActive.snapshot.params['telefone'] !== undefined
        && this.routeActive.snapshot.params['telefone'] !== null) {
        this.telefone = JSON.parse(this.routeActive.snapshot.params['telefone']);
      }
      //Carrega Usuário
      if (this.routeActive.snapshot.params['usuario'] !== undefined
        && this.routeActive.snapshot.params['usuario'] !== null) {
        this.usuario = JSON.parse(this.routeActive.snapshot.params['usuario']);
      }
    }
  }

  public cancelarEditarTelefone() {
    this.statusBarService.setShowStatusDialog(true);
    this.toastService.limparMensagens();

    setTimeout(() => {
      this.router.navigate(["usuario-edit", this.usuario.id, {
        usuario: JSON.stringify(this.usuario)
      }]);
      this.statusBarService.setShowStatusDialog(false);
    });
  }
}
