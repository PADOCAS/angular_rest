import {Component, OnInit} from '@angular/core';
import {UsuarioService} from "../../service/usuario.service";
import {Usuario} from "../../../model/usuario";
import {NgForOf} from "@angular/common";
import {MenuComponent} from "../menu/menu.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {StatusBarService} from "../../service/status-bar.service";

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    NgForOf,
    MenuComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  nomePesquisa: string = "";

  constructor(private usuarioService: UsuarioService, private statusBarService: StatusBarService) {
  }

  ngOnInit(): void {
    //Ao iniciar o Componente vai buscar os usuários para carregar a lista:
    this.carregarUsuariosCadastrados();
  }

  public carregarUsuariosCadastrados() {
    this.usuarioService.getListUsuarios()
      .subscribe(data => {
        this.usuarios = data
      });
  }

  public deleteUsuario(id: number) {
    //StatusDialog globalizado!
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      this.usuarioService.deleteUsuario(id)
        .subscribe(data => {
          console.log("Retorno do método delete: " + data);
          //Após deletar, recarrega a lista de usuário para atualizar a tela!
          this.carregarUsuariosCadastrados();
        });
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public consultaUsuariosPorNome() {
    //StatusDialog globalizado!
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      if (this.nomePesquisa != null
        && this.nomePesquisa.trim() !== '') {
        //Só utiliza a pesquisa por Nome se algo for digitado em tela!
        this.usuarioService.getListUsuarioPorNome(this.nomePesquisa)
          .subscribe(data => {
            this.usuarios = data
          });
      } else {
        this.carregarUsuariosCadastrados();
      }
      //StatusDialog globalizado!
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public novo() {
    //StatusDialog globalizado!
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      //StatusDialog globalizado!
      this.statusBarService.setShowStatusDialog(false);
    });
  }

  public editUsuario() {
    this.statusBarService.setShowStatusDialog(true);

    setTimeout(() => {
      this.statusBarService.setShowStatusDialog(false);
    });
  }
}
